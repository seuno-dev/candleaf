from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

urlpatterns = [
    path('orders/stripe-webhook/', views.StripeWebHook.as_view(), name='stripe-webhook'),
    path('orders/create_payment', views.CreatePayment.as_view(), name='payment-create'),
]

router = DefaultRouter()
router.register('products', views.ProductViewSet, basename='products')
router.register('categories', views.CategoryViewSet, basename='categories')
router.register('customers', views.CustomerViewSet, basename='customers')
router.register('cart-items', views.CartItemViewSet, basename='cart-items')
router.register('orders', views.OrderViewSet, basename='orders')
router.register('reviews', views.ReviewViewSet, basename='reviews')

urlpatterns += router.urls
