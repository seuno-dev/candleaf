import stripe
from django.core.validators import MinValueValidator
from django.db import models
from django.core.cache import cache
from django_fsm import FSMField, transition

from DjangoKart import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


class Customer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=255)
    address = models.TextField()

    # noinspection PyUnresolvedReferences
    @property
    def name(self):
        user = self.user
        name = user.first_name
        if user.last_name:
            name += f' {user.last_name}'
        return name

    # noinspection PyUnresolvedReferences
    @property
    def email(self):
        return self.user.email


class Category(models.Model):
    class Meta:
        verbose_name_plural = "categories"

    title = models.CharField(max_length=255)
    slug = models.SlugField()

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
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title

    @property
    def image(self):
        images = self.images.all()
        if images.count() == 0:
            return None
        return images.first()


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
    STATUS_AWAITING_PAYMENT = 'a'
    STATUS_PROCESSED = 'b'
    STATUS_SHIPPED = 'c'
    STATUS_COMPLETED = 'd'
    STATUS_CANCELLED = 'p'
    STATUS_CHOICES = [
        (STATUS_AWAITING_PAYMENT, 'Awaiting payment'),
        (STATUS_PROCESSED, 'Processed'),
        (STATUS_SHIPPED, 'Shipped'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_time = models.DateTimeField(auto_now=True)
    status = FSMField(max_length=1, choices=STATUS_CHOICES, default=STATUS_AWAITING_PAYMENT)
    payment_intent_id = models.CharField(max_length=50, blank=True, null=True)
    shipping_reference = models.CharField(max_length=50, blank=True, null=True)

    @property
    def total_price(self):
        items = OrderItem.objects.filter(order=self)
        total = 0
        for item in items:
            total += item.total_price
        return total

    @property
    def is_payment_created(self):
        return self.payment_intent_id is not None

    @property
    def is_creating_payment(self):
        return cache.get(self.get_lock_key())

    @property
    def is_pending(self):
        return self.status == self.STATUS_AWAITING_PAYMENT

    @property
    def stripe_client_secret(self):
        if not self.is_payment_created:
            return None
        intent = stripe.PaymentIntent.retrieve(self.payment_intent_id)
        return intent.client_secret

    @transition(field=status, source=STATUS_AWAITING_PAYMENT, target=STATUS_PROCESSED)
    def complete_payment(self):
        pass

    @transition(field=status, source=STATUS_PROCESSED, target=STATUS_SHIPPED)
    def ship(self, shipping_reference=''):
        self.shipping_reference = shipping_reference

    @transition(field=status, source=STATUS_SHIPPED, target=STATUS_COMPLETED)
    def complete(self):
        pass

    @transition(field=status, source=[STATUS_AWAITING_PAYMENT, STATUS_PROCESSED], target=STATUS_CANCELLED)
    def cancel(self):
        pass

    def get_lock_key(self):
        return f"payment_lock_{self.id}"

    def create_payment(self):
        # Lock this order from another payment creation
        lock_key = self.get_lock_key()
        cache.set(lock_key, True, timeout=30)

        try:
            # Creating the Stripe PaymentIntent
            intent = stripe.PaymentIntent.create(
                currency='usd',
                amount=int(self.total_price * 100),
                setup_future_usage='off_session',
                metadata={'order_id': self.id}
            )
            self.payment_intent_id = intent.id
            self.save()
            return intent.client_secret
        finally:
            # Release lock
            cache.delete(lock_key)


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
