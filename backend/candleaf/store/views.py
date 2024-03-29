import stripe
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, mixins, generics
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from config.settings import base as settings
from candleaf.core.serializers import CreateUserSerializer
from . import models, serializers, filters
from .paginations import PageNumberPagination

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreatePayment(generics.GenericAPIView):
    def post(self, request):
        order_id = request.data['order_id']
        customer = get_object_or_404(models.Customer, user=request.user)
        order = get_object_or_404(models.Order.objects.all(),
                                  id=order_id,
                                  customer=customer)

        if order.is_creating_payment:
            return Response(data={'error': 'Payment creation is already in progress.'}, status=status.HTTP_409_CONFLICT)

        if order.is_payment_created:
            return Response(data={'client_secret': order.stripe_client_secret}, status=status.HTTP_200_OK)

        if order.is_pending:
            client_secret = order.create_payment()
            return Response(data={'client_secret': client_secret}, status=status.HTTP_201_CREATED)

        return Response(data={'error': 'Request for this order is invalid.'},
                        status=status.HTTP_409_CONFLICT)


class StripeWebHook(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        # noinspection PyUnresolvedReferences
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )

            # Handle the event
            if event.type == 'payment_intent.succeeded':
                payment_intent = event.data.object
                if not hasattr(payment_intent, 'metadata') and not hasattr(payment_intent.metadata, 'order_id'):
                    print('Payment success without the correct metadata:', payment_intent)
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                order_id = payment_intent.metadata.order_id
                qs = models.Order.objects.filter(id=order_id, payment_intent_id=payment_intent.id)
                if qs.count() == 0:
                    print("Payment success but order doesn't exist:", payment_intent)
                    return Response(status=status.HTTP_404_NOT_FOUND)
                order = qs[0]
                order.complete_payment()
                order.save()

            return Response(status=status.HTTP_200_OK)
        except ValueError as err:
            # Invalid payload
            raise err
        except stripe.error.SignatureVerificationError as err:
            # Invalid signature
            raise err


def get_cart_for_user(user):
    customer = get_object_or_404(models.Customer, user=user)
    cart, _ = models.Cart.objects.get_or_create(customer=customer)
    return cart


class OrderViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    serializer_class = serializers.OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    filterset_class = filters.OrderFilter

    def get_queryset(self):
        customer = get_object_or_404(models.Customer, user=self.request.user)
        return models.Order.objects.filter(customer=customer).order_by('-id')

    def create(self, request, *args, **kwargs):
        cart = get_cart_for_user(self.request.user)
        cart_items = cart.cartitem_set.all()

        if cart_items.count() == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order = models.Order.objects.create(customer=cart.customer)
            order_items = []
            for cart_item in cart_items:
                product = cart_item.product
                if cart_item.quantity > cart_item.product.inventory:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                order_items.append(models.OrderItem(
                    order=order,
                    product=cart_item.product,
                    unit_price=cart_item.product.unit_price,
                    quantity=cart_item.quantity
                ))

                # Delete the cart item
                cart_item.delete()

                # Reduce the quantity
                product.inventory -= cart_item.quantity
                product.save()

            # Save the order items
            models.OrderItem.objects.bulk_create(order_items, unique_fields=['order', 'product'])
            cart.delete()

            return Response(data={'order_id': order.id}, status=status.HTTP_201_CREATED)


class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return models.CartItem.objects.filter(cart=get_cart_for_user(self.request.user))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['cart'] = get_cart_for_user(self.request.user)
        return context

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['create', 'partial_update']:
            return serializers.WriteCartItemSerializer
        else:
            return serializers.CartItemSerializer


class ProductViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    class Permission(permissions.IsAdminUser):
        def has_permission(self, request, view):
            # Everyone can look at the products
            if request.method in permissions.SAFE_METHODS:
                return True

            return super().has_permission(request, view)

    queryset = models.Product.objects.all()
    permission_classes = [Permission]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_class = filters.ProductFilter
    pagination_class = PageNumberPagination

    def get_serializer_class(self):
        if self.action in ['create', 'partial_update']:
            return serializers.CreateProductSerializer
        elif self.action == 'featured':
            return serializers.FeaturedProductSerializer
        else:
            return serializers.ProductSerializer

    @action(detail=False)
    def featured(self, request):
        queryset = models.FeaturedProduct.objects.all()[:8]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CustomerViewSet(viewsets.ModelViewSet):
    class Permission(permissions.IsAdminUser):
        def has_permission(self, request, view):
            # Give non-admin permission to create customer object if the user is authenticated
            # and the object hasn't been created before.
            if view.action == 'create' and request.user \
                    and models.Customer.objects.filter(user=request.user.id).count() == 0:
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

    @action(detail=False, methods=["GET", "PUT"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        customer = get_object_or_404(models.Customer, user_id=user.id)

        method = request.method

        if method == 'GET':
            serializer = serializers.CustomerSerializer(customer)
            return Response(serializer.data)

        if method == 'PUT':
            serializer = serializers.UpdateCustomerSerializer(customer, data=request.data)
            serializer.is_valid(raise_exception=True)

            user.first_name = serializer.validated_data.get('first_name', user.first_name)
            user.last_name = serializer.validated_data.get('last_name', user.last_name)
            user.email = serializer.validated_data.get('email', user.last_name)

            user.save()
            serializer.save()

            return Response(request.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, customer):
        super().perform_destroy(customer)
        customer.user.delete()


class ReviewViewSet(viewsets.ModelViewSet):
    class IsPurchasedItemOwner(permissions.BasePermission):
        def has_permission(self, request, view):
            data = request.data
            if view.action == "create" and "order_item" in data:
                order_item = get_object_or_404(models.OrderItem, id=data['order_item'])
                return order_item.order.customer.user == request.user
            return super().has_permission(request, view)

        def has_object_permission(self, request, view, review):
            return review.order_item.order.customer.user == request.user

    permission_classes = [IsPurchasedItemOwner]

    def get_queryset(self):
        return models.Review.objects.filter(order_item__order__customer__user=self.request.user)

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return serializers.CreateReviewSerializer
        else:
            return serializers.ReviewSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_item = serializer.validated_data['order_item']

        if order_item.review_set.all().count() > 0 or order_item.order.status != models.Order.STATUS_COMPLETED:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CreateUserCustomer(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.CreateUserCustomerSerializer
    queryset = models.Customer.objects.all()

    def post(self, request):
        with transaction.atomic():
            customer_serializer = serializers.CreateCustomerSerializer(data=request.data)
            customer_serializer.is_valid(raise_exception=True)
            user_serializer = CreateUserSerializer(data=request.data)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.validated_data["is_active"] = True

            user = user_serializer.save()
            customer_serializer.save(user=user)

            return Response(request.data, status=status.HTTP_201_CREATED)
