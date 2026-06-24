from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='api_register'),
    path('auth/login/', views.LoginView.as_view(), name='api_login'),
    path('auth/logout/', views.LogoutView.as_view(), name='api_logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='api_token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='api_me'),

    # Catalog
    path('categories/', views.CategoryListView.as_view(), name='api_categories'),
    path('products/', views.ProductListView.as_view(), name='api_products'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='api_product_detail'),

    # Cart
    path('cart/', views.CartView.as_view(), name='api_cart'),
    path('cart/add/', views.CartAddView.as_view(), name='api_cart_add'),
    path('cart/remove/<int:pk>/', views.CartRemoveView.as_view(), name='api_cart_remove'),

    # Addresses
    path('addresses/', views.AddressListCreateView.as_view(), name='api_addresses'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='api_address_detail'),
    path('addresses/<int:pk>/default/', views.set_default_address, name='api_address_default'),

    # Promo
    path('promo/validate/', views.validate_promo, name='api_promo_validate'),

    # Orders
    path('orders/', views.OrderListView.as_view(), name='api_orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='api_order_detail'),
    path('orders/create/', views.create_or_get_order, name='api_order_create'),
    path('orders/address/<int:pk>/', views.set_order_address, name='api_order_address'),
    path('orders/payment-intent/', views.create_payment_intent, name='api_payment_intent'),
    path('orders/confirm-payment/', views.confirm_payment, name='api_confirm_payment'),
    path('orders/cancel/', views.cancel_order, name='api_cancel_order'),
]
