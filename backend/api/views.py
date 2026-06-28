from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from products.models import Product
from categories.models import Category
from carts.models import Cart, CartProduct
from carts.funciones import funcionCarrito, deleteCart
from orden.models import Orden, OrdenProducto
from orden.utils import funcionOrden, deleteOrden
from orden.comun import OrdenStatus
from DirEnvio.models import DireccionEnvio
from promo_codigo.models import PromoCodigo

from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    CategorySerializer,
    ProductListSerializer, ProductDetailSerializer,
    CartSerializer, AddToCartSerializer,
    DireccionEnvioSerializer,
    PromoValidateSerializer,
    OrdenSerializer, ConfirmPaymentSerializer,
)

import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_PRIVATE_KEY


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if user.username == 'demo':
            Cart.objects.filter(user=user).delete()
            Orden.objects.filter(user=user).delete()
            DireccionEnvio.objects.filter(user=user).delete()

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
        except Exception:
            pass
        return Response({'detail': 'Sesión cerrada correctamente.'})


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ─── Categories ───────────────────────────────────────────────────────────────

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None
    queryset = Category.objects.order_by('title')


# ─── Products ─────────────────────────────────────────────────────────────────

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Product.objects.prefetch_related('category_set').order_by('-created_at')
        q = self.request.query_params.get('q')
        category = self.request.query_params.get('category')
        if q:
            qs = qs.filter(title__icontains=q)
        if category:
            qs = qs.filter(category__title__icontains=category)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.prefetch_related('category_set')
    lookup_field = 'slug'


# ─── Cart ─────────────────────────────────────────────────────────────────────

class CartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = funcionCarrito(request)
        return Response(CartSerializer(cart, context={'request': request}).data)


class CartAddView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
        cart = funcionCarrito(request)
        CartProduct.objects.crearActualizar(
            cart=cart,
            product=product,
            quantity=serializer.validated_data['quantity'],
        )
        cart.refresh_from_db()
        return Response(CartSerializer(cart, context={'request': request}).data)


class CartRemoveView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        cart = funcionCarrito(request)
        item = get_object_or_404(CartProduct, id=pk, cart=cart)
        item.delete()
        cart.refresh_from_db()
        return Response(CartSerializer(cart, context={'request': request}).data)


# ─── Addresses ────────────────────────────────────────────────────────────────

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = DireccionEnvioSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return DireccionEnvio.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DireccionEnvioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DireccionEnvio.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_default_address(request, pk):
    address = get_object_or_404(DireccionEnvio, id=pk, user=request.user)
    address.update_default()
    return Response(DireccionEnvioSerializer(address).data)


# ─── Promo Codes ──────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_promo(request):
    serializer = PromoValidateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    codigo = serializer.validated_data['codigo'].upper()
    promo = PromoCodigo.objects.get_validar(codigo)
    if not promo:
        return Response({'valid': False, 'message': 'Código inválido o expirado.'}, status=400)
    return Response({'valid': True, 'codigo': promo.codigo, 'descuento': str(promo.descuento)})


# ─── Orders ───────────────────────────────────────────────────────────────────

class OrderListView(generics.ListAPIView):
    serializer_class = OrdenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.ordenes_completadas()


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrdenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Orden.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_or_get_order(request):
    cart = funcionCarrito(request)
    if not cart or not cart.products.exists():
        return Response({'error': 'El carrito está vacío.'}, status=400)
    orden = funcionOrden(cart, request)
    return Response(OrdenSerializer(orden).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_order_address(request, pk):
    orden = get_object_or_404(Orden, user=request.user, status=OrdenStatus.CREATED)
    address = get_object_or_404(DireccionEnvio, id=pk, user=request.user)
    orden.update_direccion_envio(address)
    return Response(OrdenSerializer(orden).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    orden = get_object_or_404(
        Orden,
        user=request.user,
        status__in=[OrdenStatus.CREATED, OrdenStatus.PAYED],
    )
    total_cents = int(orden.get_total() * 100)
    intent = stripe.PaymentIntent.create(
        amount=total_cents,
        currency=settings.STRIPE_CURRENCY,
        metadata={
            'orden_id': orden.id,
            'orden_uuid': str(orden.ordenID),
            'user_id': request.user.id,
        },
    )
    return Response({'client_secret': intent.client_secret})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    serializer = ConfirmPaymentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payment_intent_id = serializer.validated_data['payment_intent_id']
    orden_id = serializer.validated_data['orden_id']

    orden = get_object_or_404(Orden, id=orden_id, user=request.user)
    intent = stripe.PaymentIntent.retrieve(payment_intent_id)

    if intent.status != 'succeeded':
        return Response({'error': 'El pago no fue completado.'}, status=400)
    if str(intent.metadata.get('orden_uuid')) != str(orden.ordenID):
        return Response({'error': 'El pago no corresponde a esta orden.'}, status=400)

    with transaction.atomic():
        orden.completado()
        for item in CartProduct.objects.filter(cart=orden.cart):
            OrdenProducto.objects.get_or_create(
                orden=orden,
                product=item.product,
                defaults={
                    'title': item.product.title,
                    'price': item.product.price,
                    'quantity': item.quantity,
                },
            )
        deleteCart(request)
        deleteOrden(request)

    orden.refresh_from_db()
    return Response(OrdenSerializer(orden).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request):
    orden = get_object_or_404(Orden, user=request.user, status=OrdenStatus.CREATED)
    orden.cancelar()
    deleteOrden(request)
    return Response({'detail': 'Orden cancelada.'})
