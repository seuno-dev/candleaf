from rest_framework import serializers

from . import models


class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    user_first_name = serializers.StringRelatedField(read_only=True)
    user_last_name = serializers.StringRelatedField(read_only=True)
    user_email = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = models.Customer
        fields = ['user_id', 'user_first_name', 'user_last_name', 'user_email', 'phone']

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
