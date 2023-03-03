from django.contrib import admin
from django.utils.html import format_html
from . import models


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['title']
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
    list_display = ['title', 'unit_price', 'inventory']
    autocomplete_fields = ['collection']
