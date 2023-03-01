from rest_framework import serializers

from . import models


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
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'description', 'unit_price', 'inventory', 'collection', 'images']


class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ['id', 'title', 'unit_price']


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        models = models.Product
        fields = ['id', 'product', 'quantity', 'total_price']

    product = SimpleProductSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, cart_item: models.CartItem):
        return cart_item.quantity * cart_item.product.unit_price


class AddCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['id', 'product', 'quantity']
