from django.shortcuts import render, redirect, get_object_or_404
from .models import Cart, Product, CartProduct, CartProductManager
from .funciones import funcionCarrito


def cart(request):
    cart = funcionCarrito(request)
    
    return render(request, 'carts/cart.html', {
        'cart':cart
    })

def add(request):
    if request.method != 'POST':
        return redirect('cart')
    
    cart = funcionCarrito(request)
    quantity = int(request.POST.get('quantity',1))
    
    #busca el producto, si no lo encuentra devuelve un 404
    product = get_object_or_404(Product, pk=request.POST.get('product_id'))
    
    product_cart = CartProduct.objects.crearActualizar(cart=cart, product=product, quantity=quantity)
    
    
    cart.update_totals()
    
    return redirect('cart')
    #return render(request, 'carts/add.html', {
    #    'product': product, 
    #})
    
def remove(request):
    cart = funcionCarrito(request)
    product = get_object_or_404(Product, pk=request.POST.get('product_id'))
    
    cart.products.remove(product)
    
    return redirect('cart')