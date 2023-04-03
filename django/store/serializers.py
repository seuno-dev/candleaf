from rest_framework import serializers

from . import models, exceptions


class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    user_first_name = serializers.StringRelatedField(read_only=True)
    user_last_name = serializers.StringRelatedField(read_only=True)
    user_email = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = models.Customer
        fields = ['user_id', 'user_first_name', 'user_last_name', 'user_email', 'phone', 'address']

    def save(self, **kwargs):
        return super().save(**kwargs)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id', 'image']


class ProductSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'slug', 'description', 'unit_price', 'inventory', 'collection', 'images']


class SimpleProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'unit_price', 'inventory', 'image']

    def get_image(self, product):
        images = product.images.all()
        if len(images) == 0:
            return ''
        return images[0].image.url


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

    product = SimpleProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField(read_only=True)

    def get_total_price(self, cart_item: models.CartItem):
        return cart_item.get_total_price()


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


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItem
        fields = ['id', 'order_id', 'product', 'unit_price', 'quantity', 'total_price']

    product = SimpleProductSerializer()
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, order_item: models.OrderItem):
        return order_item.unit_price * order_item.quantity


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = ['id', 'items', 'order_time']

    items = OrderItemSerializer(many=True)
