from rest_framework import serializers

from . import models, exceptions


class CustomerSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = models.Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address']


class UpdateCustomerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()

    class Meta:
        model = models.Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address']


class CreateUserCustomerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    password = serializers.CharField(style={"input_type": "password"})

    class Meta:
        model = models.Customer
        fields = ['first_name', 'last_name', 'email', 'password', 'phone', 'address']


class CreateCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields = ['phone', 'address']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id', 'image']


class SimpleProductSerializer(serializers.ModelSerializer):
    image = ProductImageSerializer(read_only=True)

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'slug', 'unit_price', 'inventory', 'image']


class SimpleReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = ['id', 'rating', 'comment']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItem
        fields = ['id', 'order_id', 'product', 'unit_price', 'quantity', 'total_price', 'review']

    product = SimpleProductSerializer()
    review = SimpleReviewSerializer()


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = ['id', 'order_item', 'rating', 'comment']

    order_item = OrderItemSerializer()


class CreateReviewSerializer(serializers.ModelSerializer):
    order_item = serializers.PrimaryKeyRelatedField(required=True, queryset=models.OrderItem.objects.all())

    class Meta:
        model = models.Review
        fields = ['order_item', 'rating', 'comment']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ['id', 'title', 'slug', 'description', 'unit_price', 'inventory', 'wax', 'fragrance', 'dimension',
                  'weight', 'burning_time', 'images', 'average_rating', 'review_count', 'reviews']

    slug = serializers.CharField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, source="few_reviews")


class FeaturedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FeaturedProduct
        fields = ['id', 'product']

    product = ProductSerializer(read_only=True)


class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ['id', 'title', 'unit_price', 'inventory', 'wax', 'fragrance', 'dimension', 'weight',
                  'minimum_burning_time', 'maximum_burning_time', ]


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

    product = SimpleProductSerializer(read_only=True)


class WriteCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['id', 'product_id', 'quantity']

    product_id = serializers.IntegerField()

    def validate_product_id(self, product_id):
        if not models.Product.objects.filter(pk=product_id).exists():
            raise serializers.ValidationError('No product with the given id was found')
        return product_id

    def update(self, cart_item, validated_data):
        if validated_data['quantity'] > cart_item.product.inventory:
            raise exceptions.QuantityError()
        return super().update(cart_item, validated_data)

    def save(self, **kwargs):
        cart = self.context['cart']

        # Update the quantity directly instead of adding the value
        if self.instance is not None:
            self.update(self.instance, self.validated_data)
            return self.instance

        product_id = self.validated_data['product_id']
        quantity = self.validated_data['quantity']
        try:
            cart_item = models.CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.quantity += quantity
        except models.CartItem.DoesNotExist:
            cart_item = models.CartItem(cart=cart, **self.validated_data)

        if cart_item.quantity > cart_item.product.inventory:
            raise exceptions.QuantityError()

        cart_item.save()
        self.instance = cart_item
        return self.instance


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = ['id', 'items', 'order_time', 'total_price', 'status']

    items = OrderItemSerializer(many=True)
