from products.views import ProductListView
from carts.views import cart
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.views.static import serve
from django.conf import settings
from . import views

urlpatterns = [
    path('usuarios/salir', views.salir, name="salir"),
    path('usuarios/login', views.login, name='login'),
    path('usuarios/registro', views.registro, name='registro'),
    path('',ProductListView.as_view(), name='index'),
    path("admin/", admin.site.urls),
    path('social-auth/', include('social_django.urls', namespace="social")),
    path('productos/', include('products.urls')),
    path('carrito/', include('carts.urls')),
    path('orden/', include('orden.urls')),
    path('direcciones/', include('DirEnvio.urls')),
    path('codigopromo/', include('promo_codigo.urls')),
    path('pagos/', include('MetodoPago.urls')),
    path('api/', include('api.urls')),
]
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]