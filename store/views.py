from rest_framework import viewsets, permissions

from . import models, serializers


class ProductViewSet(viewsets.ModelViewSet):
    class Permission(permissions.IsAuthenticated):
        def has_permission(self, request, view):
            # Everyone can look at the products
            if request.method in permissions.SAFE_METHODS:
                return True

            # Only admin can create or delete products
            if view.action in ['create', 'delete'] and not request.user.is_staff:
                return False

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
