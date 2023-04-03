import stripe
from django.db import transaction

from rest_framework import viewsets, permissions, status, mixins, generics, filters
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from DjangoKart import settings
from . import models, serializers
from .paginations import PageNumberPagination


class StripeWebHook(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )

            # Handle the event
            if event.type == 'payment_intent.succeeded':
                payment_intent = event.data.object
                if not hasattr(payment_intent, 'client_reference_id'):
                    print('Payment success without client reference:', payment_intent)
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                order_id = payment_intent.client_reference_id
                qs = models.Order.objects.filter(id=order_id)
                if qs.count() == 0:
                    print("Payment success but order doesn't exist:", payment_intent)
                    return Response(status=status.HTTP_404_NOT_FOUND)
                order = qs[0]
                order.payment_status = models.Order.PAYMENT_COMPLETED

            elif event.type == 'payment_method.attached':
                payment_method = event.data.object
                print("--------payment_method ---------->", payment_method)
            # ... handle other event types
            else:
                print('Unhandled event type {}'.format(event.type))

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

    def get_queryset(self):
        customer = get_object_or_404(models.Customer, user=self.request.user)
        return models.Order.objects.filter(customer=customer)

    def create(self, request, *args, **kwargs):
        cart = get_cart_for_user(self.request.user)
        cart_items = cart.cartitem_set.all()

        if cart_items.count() == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order = models.Order.objects.create(customer=cart.customer)
            order_items = []
            stripe_items = []
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
                stripe_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': int(product.unit_price * 100),
                        "product_data": {
                            "name": product.title,
                        },
                    },
                    'quantity': cart_item.quantity
                })

                # Delete the cart item
                cart_item.delete()

                # Reduce the quantity
                product.inventory -= cart_item.quantity
                product.save()

            # Save the order items
            models.OrderItem.objects.bulk_create(order_items, unique_fields=['order', 'product'])
            cart.delete()

            try:
                stripe.api_key = settings.STRIPE_SECRET_KEY
                checkout_session = stripe.checkout.Session.create(
                    client_reference_id=order.id,
                    line_items=stripe_items,
                    mode='payment',
                    success_url='http://127.0.0.1:3000/checkout-success',
                    cancel_url='http://127.0.0.1:3000/checkout-fail'
                )
                return Response(status=status.HTTP_201_CREATED, data={"stripe_checkout_url": checkout_session.url})
            except Exception as e:
                print(e)
                return e


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
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']
    pagination_class = PageNumberPagination


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
