from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('products', views.ProductViewSet, basename='products')
router.register('customers', views.CustomerViewSet, basename='customers')

urlpatterns = router.urls
