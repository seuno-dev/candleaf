import django_filters

from . import models


class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = models.Product
        fields = ['title', 'price_min', 'price_max', 'burning_time_min', 'burning_time_max']

    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    price_min = django_filters.NumberFilter(field_name='unit_price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='unit_price', lookup_expr='lte')
    burning_time_min = django_filters.NumberFilter(field_name='burning_time', lookup_expr='gte')
    burning_time_max = django_filters.NumberFilter(field_name='burning_time', lookup_expr='lte')


class OrderFilter(django_filters.FilterSet):
    class Meta:
        model = models.Order
        fields = ["order_time_min", "order_time_max"]

    order_time_min = django_filters.DateTimeFilter(field_name='order_time__date', lookup_expr="gte")
    order_time_max = django_filters.DateTimeFilter(field_name='order_time__date', lookup_expr="lte")
