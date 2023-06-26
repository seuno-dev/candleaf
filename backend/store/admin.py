from django import forms
from django.contrib import admin
from django.utils.html import format_html

from . import models


class OrderItemInline(admin.TabularInline):
    model = models.OrderItem
    readonly_fields = ['product', 'quantity', 'unit_price']


class ShipOrderForm(forms.Form):
    shipment_reference = forms.CharField()


@admin.register(models.Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'get_username', 'get_product', 'rating']

    @admin.display(ordering='order_item__order__customer__user__username', description="Username")
    def get_username(self, review):
        if review.order_item:
            return review.order_item.order.customer.user.username
        return ""

    @admin.display(ordering='order_item__product__title', description="Product")
    def get_product(self, review):
        if review.order_item:
            return review.order_item.product.title
        return ""


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'status']
    inlines = [OrderItemInline]


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['email']

    def email(self, customer):
        return customer.user.email


@admin.register(models.Category)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['title']
    prepopulated_fields = {'slug': ['title']}
    search_fields = ['title']


class ProductImageInline(admin.TabularInline):
    model = models.ProductImage
    readonly_fields = ['thumbnail']

    def thumbnail(self, instance):
        if instance.image.name != '':
            return format_html(f"<img src='{instance.image.url}' style='width: 100px; object-fit: cover;'></img>")


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    prepopulated_fields = {'slug': ['title']}
    list_display = ['title', 'unit_price', 'inventory', 'average_rating']
