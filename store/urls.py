from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('products', views.ProductViewSet, basename='products')
router.register('customers', views.CustomerViewSet, basename='customers')
router.register('cart-items', views.CartItemViewSet, basename='cart-items')

urlpatterns = router.urls
