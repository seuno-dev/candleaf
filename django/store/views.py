from rest_framework import viewsets, permissions
from rest_framework.generics import get_object_or_404

from . import models, serializers


class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self):
        customer = get_object_or_404(models.Customer, user=self.request.user)
        cart, _ = models.Cart.objects.get_or_create(customer=customer)
        return cart

    def get_queryset(self):
        return models.CartItem.objects.filter(cart=self.get_cart())

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['cart'] = self.get_cart()
        return context

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['create', 'partial_update']:
            return serializers.WriteCartItemSerializer
        else:
            return serializers.CartItemSerializer


class ProductViewSet(viewsets.ModelViewSet):
    class Permission(permissions.IsAdminUser):
        def has_permission(self, request, view):
            # Everyone can look at the products
            if request.method in permissions.SAFE_METHODS:
                return True

            return super().has_permission(request, view)

    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer
    permission_classes = [Permission]


class CustomerViewSet(viewsets.ModelViewSet):
    class Permission(permissions.IsAdminUser):
        def has_permission(self, request, view):
            # Only allow creation of customer object if the user is authenticated
            # and the object hasn't been created before
            if view.action == 'create' and request.user \
                    and models.Customer.objects.filter(user=request.user).count() == 0:
                return True

            # Use implementation IsAdminUser if the action is `list`
            if view.action == 'list':
                return super().has_permission(request, view)

            # else allow all other actions which are object level ones
            # (handled by `has_object_permission`)
            return True

        def has_object_permission(self, request, view, customer):
            # Only allow if it is their own customer instance
            if request.user == customer.user:
                return True
            return False

    queryset = models.Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    permission_classes = [Permission]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, customer):
        super().perform_destroy(customer)
        customer.user.delete()
