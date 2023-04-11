import django_filters

from store import models


class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = models.Product
        fields = ['title', 'category', 'unit_price']

    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    category = django_filters.NumberFilter(field_name='category')
    unit_price_gt = django_filters.NumberFilter(field_name='unit_price', lookup_expr='gt')
    unit_price_lt = django_filters.NumberFilter(field_name='unit_price', lookup_expr='lt')
