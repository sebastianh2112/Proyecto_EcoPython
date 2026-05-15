import json
from decimal import Decimal, ROUND_HALF_UP

import stripe
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views.generic.list import ListView

from carts.funciones import deleteCart
from DirEnvio.models import DireccionEnvio
from orden.comun import OrdenStatus

from .decorador import validar_cart_and_orden
from .models import Orden, OrdenProducto
from .utils import breadcrumb, deleteOrden

stripe.api_key = settings.STRIPE_PRIVATE_KEY


def _stripe_amount(total):
    return int((Decimal(total) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _intent_get(payment_intent, key, default=None):
    if isinstance(payment_intent, dict):
        return payment_intent.get(key, default)

    return getattr(payment_intent, key, default)


def _stripe_metadata(payment_intent):
    return dict(_intent_get(payment_intent, "metadata", {}) or {})


def _status_equals(status, expected):
    return status in (expected, expected.value, str(expected))


def _payment_intent_matches_orden(payment_intent, orden):
    metadata = _stripe_metadata(payment_intent)
    expected_amount = _stripe_amount(orden.total)
    received_amount = _intent_get(payment_intent, "amount_received") or _intent_get(
        payment_intent,
        "amount",
    )

    return (
        str(metadata.get("orden_id")) == str(orden.id)
        and str(metadata.get("user_id")) == str(orden.user_id)
        and int(received_amount) == expected_amount
    )


def _finalizar_orden_pagada(orden):
    with transaction.atomic():
        orden = Orden.objects.select_for_update().select_related("cart").get(pk=orden.pk)

        if _status_equals(orden.status, OrdenStatus.COMPLETED):
            return True, orden

        if _status_equals(orden.status, OrdenStatus.CANCELED):
            return False, orden

        cart_items = list(orden.cart.cartproduct_set.select_related("product"))

        if not cart_items and not orden.items.exists():
            return False, orden

        if not orden.items.exists():
            OrdenProducto.objects.bulk_create(
                [
                    OrdenProducto(
                        orden=orden,
                        product=item.product,
                        title=item.product.title,
                        price=item.product.price,
                        quantity=item.quantity,
                    )
                    for item in cart_items
                ]
            )

        orden.completado()

        orden.cart.cartproduct_set.all().delete()
        orden.cart.subtotal = 0
        orden.cart.total = 0
        orden.cart.save()

    return True, orden


class OrdenViews(LoginRequiredMixin, ListView):
    login_url = "login"
    template_name = "orden/ordenes.html"

    def get_queryset(self):
        return self.request.user.ordenes_completadas()


@login_required(login_url="login")
@validar_cart_and_orden
def orden(request, cart, orden):
    return render(
        request,
        "orden/orden.html",
        {
            "cart": cart,
            "orden": orden,
            "breadcrumb": breadcrumb(),
        },
    )


@login_required(login_url="login")
@validar_cart_and_orden
def direccion(request, cart, orden):
    direccion_envio = orden.get_or_set_direccion_envio()
    contDireccion = request.user.direccionenvio_set.count() > 1

    return render(
        request,
        "orden/direccion.html",
        {
            "cart": cart,
            "orden": orden,
            "direccion_envio": direccion_envio,
            "contDireccion": contDireccion,
            "breadcrumb": breadcrumb(products=True, address=True),
        },
    )


@login_required(login_url="login")
def select_direccion(request):
    direccion_envios = request.user.direccionenvio_set.all()
    return render(
        request,
        "orden/select_direccion.html",
        {
            "breadcrumb": breadcrumb(address=True),
            "direccion_envios": direccion_envios,
        },
    )


@login_required(login_url="login")
@validar_cart_and_orden
def check_direccion(request, cart, orden, pk):
    direccion_envio = get_object_or_404(DireccionEnvio, pk=pk, user=request.user)

    orden.update_direccion_envio(direccion_envio)

    return redirect("direccion")


@login_required(login_url="login")
@validar_cart_and_orden
def confirmacion(request, cart, orden):
    direccion_envio = orden.direccion_envio
    if direccion_envio is None:
        return redirect("direccion")

    return render(
        request,
        "orden/confirmacion.html",
        {
            "cart": cart,
            "orden": orden,
            "direccion_envio": direccion_envio,
            "stripe_public_key": settings.STRIPE_PUBLIC_KEY,
            "breadcrumb": breadcrumb(address=True, confirmation=True),
        },
    )


@login_required(login_url="login")
@require_POST
@validar_cart_and_orden
def cancelar_orden(request, cart, orden):
    if request.user.id != orden.user_id:
        return redirect("index")

    orden.cancelar()

    deleteCart(request)
    deleteOrden(request)

    messages.error(request, "Orden eliminada correctamente")
    return redirect("index")


@login_required(login_url="login")
@require_POST
@validar_cart_and_orden
def completado(request, cart, orden):
    messages.error(
        request,
        "La compra solo se completa cuando Stripe confirma el pago",
    )
    return redirect("confirmacion")


@login_required(login_url="login")
@require_POST
@validar_cart_and_orden
def crear_payment_intent(request, cart, orden):
    if request.user.id != orden.user_id:
        return JsonResponse({"error": "Orden no autorizada"}, status=403)

    if cart.cartproduct_set.count() == 0:
        return JsonResponse({"error": "El carrito esta vacio"}, status=400)

    if orden.direccion_envio is None:
        return JsonResponse({"error": "La orden no tiene direccion de envio"}, status=400)

    orden.update_total()
    payment_intent = stripe.PaymentIntent.create(
        amount=_stripe_amount(orden.total),
        currency=settings.STRIPE_CURRENCY,
        payment_method_types=["card"],
        metadata={
            "orden_id": str(orden.id),
            "orden_uuid": orden.ordenID,
            "user_id": str(request.user.id),
            "cart_id": str(cart.id),
        },
    )

    return JsonResponse(
        {
            "client_secret": payment_intent.client_secret,
            "payment_intent_id": payment_intent.id,
        }
    )


@login_required(login_url="login")
@require_POST
def confirmar_pago(request):
    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Solicitud invalida"}, status=400)

    payment_intent_id = data.get("payment_intent_id")

    if not payment_intent_id:
        return JsonResponse({"error": "Falta el identificador del pago"}, status=400)

    payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

    if payment_intent.status != "succeeded":
        return JsonResponse({"error": "Stripe todavia no confirmo el pago"}, status=400)

    metadata = _stripe_metadata(payment_intent)
    orden = get_object_or_404(Orden, pk=metadata.get("orden_id"), user=request.user)

    if not _payment_intent_matches_orden(payment_intent, orden):
        return JsonResponse({"error": "El pago no coincide con la orden"}, status=400)

    finalizada, orden = _finalizar_orden_pagada(orden)

    if not finalizada:
        return JsonResponse({"error": "No se pudo completar la orden"}, status=400)

    deleteCart(request)
    deleteOrden(request)

    messages.success(request, "Compra completada")
    return JsonResponse(
        {
            "success": True,
            "redirect_url": reverse("index"),
        }
    )


@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if endpoint_secret:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except (ValueError, stripe.error.SignatureVerificationError):
            return HttpResponse(status=400)
    elif settings.IS_PRODUCTION:
        return HttpResponse(status=400)
    else:
        try:
            event = json.loads(payload)
        except json.JSONDecodeError:
            return HttpResponse(status=400)

    if event.get("type") == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        metadata = payment_intent.get("metadata", {})
        orden = Orden.objects.filter(pk=metadata.get("orden_id")).first()

        if orden and _payment_intent_matches_orden(payment_intent, orden):
            _finalizar_orden_pagada(orden)

    return HttpResponse(status=200)
