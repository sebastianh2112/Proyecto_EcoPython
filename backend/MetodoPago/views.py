from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.conf import settings

@login_required(login_url='login')
def crear(request):
    context = {
        "stripe_public_key": settings.STRIPE_PUBLIC_KEY,
    }

    return render(request, 'MetodoPago/profile_pago.html', context)
