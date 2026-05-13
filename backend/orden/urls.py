from django.urls import path
from .import views

urlpatterns = [
    path('', views.orden, name='orden'),
    path('direccion',views.direccion, name='direccion'),
    path('seleccionar/direccion',views.select_direccion, name='select_direccion'),
    path('establecer/direccion/<int:pk>',views.check_direccion, name='check_direccion'),
    path('confirmacion',views.confirmacion, name='confirmacion'),
    path('cancelar',views.cancelar_orden, name='cancelar'),
    path('completado',views.completado, name='completado'),
    path('crear-payment-intent',views.crear_payment_intent, name='crear_payment_intent'),
    path('confirmar-pago',views.confirmar_pago, name='confirmar_pago'),
    path('stripe/webhook',views.stripe_webhook, name='stripe_webhook'),
    path('completados',views.OrdenViews.as_view(), name='completados'),
]
