import stripe
from django.core.validators import MinValueValidator
from django.db import models
from django.core.cache import cache

from DjangoKart import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


class Customer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=255)
    address = models.TextField()


class Collection(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Product(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField()
    description = models.TextField(null=True, blank=True)
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(1)]
    )
    inventory = models.IntegerField(blank=True, default=0)
    last_update = models.DateTimeField(auto_now=True)
    collection = models.ForeignKey(Collection, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='store/images/')


class Cart(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)


class CartItem(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_product_in_cart')
        ]

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])

    @property
    def total_price(self):
        return self.quantity * self.product.unit_price


class Order(models.Model):
    PAYMENT_UNINITIATED = 'U'
    PAYMENT_CREATING = 'R'
    PAYMENT_WAITING = 'W'
    PAYMENT_FAILED = 'F'
    PAYMENT_COMPLETED = 'C'
    PAYMENT_CHOICES = [
        (PAYMENT_UNINITIATED, 'Uninitiated'),
        (PAYMENT_CREATING, 'Creating'),
        (PAYMENT_WAITING, 'Waiting'),
        (PAYMENT_FAILED, 'Failed'),
        (PAYMENT_COMPLETED, 'Completed'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_time = models.DateTimeField(auto_now=True)
    payment_status = models.CharField(max_length=1, choices=PAYMENT_CHOICES, default=PAYMENT_UNINITIATED)
    payment_intent_id = models.CharField(max_length=50, blank=True, null=True)

    @property
    def total_price(self):
        items = OrderItem.objects.filter(order=self)
        total = 0
        for item in items:
            total += item.total_price
        return total

    @property
    def is_creating_payment(self):
        return self.payment_status == self.PAYMENT_CREATING

    @property
    def is_waiting_payment(self):
        return self.payment_status == self.PAYMENT_WAITING

    @property
    def is_uninitiated_payment(self):
        return self.payment_status == self.PAYMENT_UNINITIATED

    @property
    def stripe_client_secret(self):
        if not self.is_waiting_payment:
            return None
        intent = stripe.PaymentIntent.retrieve(self.payment_intent_id)
        return intent.client_secret

    def create_payment(self):
        # Update payment status to creating
        self.payment_status = self.PAYMENT_CREATING
        self.save()

        # Creating the Stripe PaymentIntent
        intent = stripe.PaymentIntent.create(
            currency='usd',
            amount=int(self.total_price * 100),
            setup_future_usage='off_session',
            metadata={'order_id': self.id}
        )
        self.payment_intent_id = intent.id

        # Update payment status to waiting
        self.payment_status = self.PAYMENT_WAITING
        self.save()

        return intent.client_secret

    def complete_payment(self):
        self.payment_status = self.PAYMENT_COMPLETED
        self.save()


class OrderItem(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['order', 'product'], name='unique_product_in_order')
        ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(1)]
    )

    @property
    def total_price(self):
        return self.quantity * self.unit_price
