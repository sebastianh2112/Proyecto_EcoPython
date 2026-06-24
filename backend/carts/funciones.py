from .models import Cart

#Autentica usuario y guarda carrito
def funcionCarrito(request):
    user = request.user if request.user.is_authenticated else None
    cart_id = request.session.get('cart_id')
    cart = Cart.objects.filter(cart_id=cart_id).first()
    
    #Crea carrito si no existe
    if cart is None:
        cart = Cart.objects.create(user=user)
    
    #Guardar carrito de usuario no logueado a logueado
    if user and cart.user is None:
        cart.user = user
        cart.save()
    
    request.session['cart_id'] = cart.cart_id
    
    return cart

def deleteCart(request):
    request.session['card_id'] = None