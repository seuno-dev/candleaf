import django_filters

from store import models


class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = models.Product
        fields = ['title', 'category', 'price_min', 'price_max']

    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    category = django_filters.NumberFilter(field_name='category')
    price_min = django_filters.NumberFilter(field_name='unit_price', lookup_expr='gt')
    price_max = django_filters.NumberFilter(field_name='unit_price', lookup_expr='lt')
