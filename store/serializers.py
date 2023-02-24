from rest_framework import serializers

from . import models


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id', 'image']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'description', 'unit_price', 'inventory', 'collection', 'images']
