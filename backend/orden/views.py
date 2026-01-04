from django.shortcuts import render, get_object_or_404, redirect
from carts.funciones import funcionCarrito, deleteCart
from .models import Orden
from .utils import funcionOrden, breadcrumb, deleteOrden
from django.contrib.auth.decorators import login_required
from DirEnvio.models import DireccionEnvio
from django.contrib import messages
from django.views.generic.list import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.query import EmptyQuerySet
from users.models import *
from orden.models import OrdenProducto
from .decorador import validar_cart_and_orden

class OrdenViews(LoginRequiredMixin, ListView):
    login_url = 'login'
    template_name = 'orden/ordenes.html'
    
    def get_queryset(self):
        return self.request.user.ordenes_completadas()

#decorador, si no esta logueado la pagina Orden no cargaria, por lo que redirige a login
@login_required(login_url='login')
@validar_cart_and_orden
def orden(request, cart, orden):
    
    return render(request, 'orden/orden.html',{
        'cart':cart,
        'orden' : orden,
        'breadcrumb':breadcrumb(),
    })

@login_required(login_url='login')
@validar_cart_and_orden
def direccion(request, cart, orden):
    
    direccion_envio = orden.get_or_set_direccion_envio()
    contDireccion = request.user.direccionenvio_set.count() >1
    
    return render(request, 'orden/direccion.html',{
        'cart': cart,
        'orden': orden,
        'direccion_envio' : direccion_envio,
        'contDireccion' : contDireccion,
        'breadcrumb': breadcrumb(products=True, address=True),
    })
 
@login_required(login_url='login')   
def select_direccion(request):
    direccion_envios = request.user.direccionenvio_set.all()
    return render(request, 'orden/select_direccion.html',{
        'breadcrumb': breadcrumb(address=True),
        'direccion_envios': direccion_envios,
    })
    
    
@login_required(login_url='login') 
@validar_cart_and_orden
def check_direccion(request, cart, orden, pk):
   
    direccion_envio = get_object_or_404(DireccionEnvio, pk=pk)
    
    if request.user.id != direccion_envio.user_id:
        return redirect('index')
    
    orden.update_direccion_envio(direccion_envio)
    
    return redirect('direccion')


@login_required(login_url='login') 
@validar_cart_and_orden
def confirmacion(request, cart, orden):
    
    direccion_envio = orden.direccion_envio
    if direccion_envio is None:
        return redirect('direccion')
    
    return render(request, 'orden/confirmacion.html', {
        'cart' : cart,
        'orden' : orden,
        'direccion_envio' : direccion_envio, 
        'breadcrumb' : breadcrumb(address=True, confirmation=True),
    })
    
@login_required(login_url='login')   
@validar_cart_and_orden 
def cancelar_orden(request, cart, orden):
    
    if request.user.id != orden.user_id:
        return redirect('index')

    orden.cancelar()
    
    deleteCart(request)
    deleteOrden(request)
    
    messages.error(request, 'Orden eliminada correctamente')
    return redirect('index')

@login_required(login_url='login')    
@validar_cart_and_orden
def completado(request,cart, orden):

    # valida que usuario que hace la solicitud sea el mismo que el del carrito
    if request.user.id != orden.user_id:
        return redirect('index')

    # evita ordenes vacias
    if cart.cartproduct_set.count() == 0:
        messages.error(request, 'El carrito está vacío')
        return redirect('cart')

    # copia los productos del carrito a la orden
    for item in cart.cartproduct_set.select_related('product'):
        OrdenProducto.objects.create(
            orden=orden,
            product=item.product,
            title=item.product.title,
            price=item.product.price,
            quantity=item.quantity
        )

    # coloca la orden como completada
    orden.completado()

    # limpiar carrito
    cart.cartproduct_set.all().delete()
    cart.subtotal = 0
    cart.total = 0
    cart.save()

    # limpia la sesion
    deleteCart(request)
    deleteOrden(request)

    messages.success(request, 'Compra completada')
    return redirect('index')
