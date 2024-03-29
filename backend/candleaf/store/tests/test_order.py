import random
from itertools import cycle

import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.reverse import reverse

from store import models


@pytest.fixture
def order_list_url():
    return reverse('orders-list')


@pytest.fixture
def order_detail_url():
    def _method(pk):
        return reverse('orders-detail', kwargs=dict(pk=pk))

    return _method


def assert_order_item_response(item_response, order_item):
    assert item_response['product']['title'] == order_item.product.title
    assert item_response['unit_price'] == order_item.unit_price
    assert item_response['quantity'] == order_item.quantity
    assert item_response['total_price'] == order_item.unit_price * order_item.quantity

    review = order_item.review
    if review:
        assert item_response['review']['rating'] == review.rating
        assert item_response['review']['comment'] == review.comment
    else:
        assert item_response['review'] is None


@pytest.mark.django_db
class TestCreateOrder:
    def test_returns_201(self, authenticate_client, order_list_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        cart = baker.make(models.Cart, customer=customer)
        cart_items = baker.make(models.CartItem, cart=cart, quantity=random.randint(3, 10),
                                product__inventory=random.randint(10, 20), _quantity=random.randint(3, 5))

        response = client.post(order_list_url)

        assert response.status_code == status.HTTP_201_CREATED

        order = models.Order.objects.filter(customer=customer).last()
        assert order.is_pending

        order_items = order.items.all()
        assert len(order_items) == len(cart_items)

        # The cart should be deleted
        assert models.Cart.objects.filter(id=cart.id).count() == 0

        for order_item, cart_item in zip(order_items, cart_items):
            # The cart item should be deleted
            assert models.CartItem.objects.filter(id=cart_item.id).count() == 0

            # The order item should have the correct properties
            assert order_item.product == cart_item.product
            assert order_item.unit_price == cart_item.product.unit_price
            assert order_item.quantity == cart_item.quantity
            assert order_item.total_price == cart_item.total_price

            # The product inventory count should decrease
            product = models.Product.objects.get(id=cart_item.product.id)
            assert product.inventory == cart_item.product.inventory - cart_item.quantity

    def test_if_inventory_not_enough_returns_400(self, authenticate_client, order_list_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        cart = baker.make(models.Cart, customer=customer)
        cart_items = baker.make(models.CartItem, cart=cart, quantity=random.randint(3, 10),
                                product__inventory=0, _quantity=random.randint(3, 5))

        response = client.post(order_list_url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # The cart and its items shouldn't be deleted
        assert models.Cart.objects.filter(id=cart.id).count() == 1
        for cart_item in cart_items:
            assert models.CartItem.objects.filter(id=cart_item.id).count() == 1


@pytest.mark.django_db
class TestListOrder:
    def test_returns_200(self, authenticate_client, order_list_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        orders = baker.make(models.Order, customer=customer, _quantity=random.randint(3, 5))
        orders.reverse()
        order_items_set = []
        for order in orders:
            order_items = baker.make(models.OrderItem, order=order, _quantity=random.randint(1, 10))
            order_items_set.append(order_items)

            for order_item in order_items:
                baker.make(models.Review, order_item=order_item)

        # Data from other customers
        baker.make(models.OrderItem, _quantity=5,
                   order=cycle(baker.make(models.Order, customer=baker.make(models.Customer), _quantity=5)))

        response = client.get(order_list_url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']
        for order_response, order, order_items in zip(results, orders, order_items_set):
            assert order_response['id'] == order.id
            assert order_response['status'] == order.status
            assert len(order_items) != 0

            for item_response, order_item in zip(order_response['items'], order_items):
                assert_order_item_response(item_response, order_item)

    def test_if_order_time_filter_works_returns_200(self, authenticate_client, order_list_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        order_yesterday = baker.make(models.Order, customer=customer, order_time="2023-01-01")
        baker.make(models.OrderItem, order=order_yesterday)
        orders = baker.make(models.Order, customer=customer, order_time="2023-01-02", _quantity=random.randint(3, 5))
        orders.reverse()
        order_items_set = []
        for order in orders:
            order_items = baker.make(models.OrderItem, order=order, _quantity=random.randint(1, 10))
            order_items_set.append(order_items)

            for order_item in order_items:
                baker.make(models.Review, order_item=order_item)

        order_tomorrow = baker.make(models.Order, customer=customer, order_time="2023-01-03")
        baker.make(models.OrderItem, order=order_tomorrow)

        response = client.get(f"{order_list_url}?order_time_min=2023-01-02&order_time_max=2023-01-02")

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']
        for order_response, order, order_items in zip(results, orders, order_items_set):
            assert order_response['id'] == order.id
            assert order_response['status'] == order.status
            assert len(order_items) != 0

            for item_response, order_item in zip(order_response['items'], order_items):
                assert_order_item_response(item_response, order_item)

        assert all(d["id"] != order_yesterday.id for d in results)
        assert all(d["id"] != order_tomorrow.id for d in results)

    def test_empty_returns_200(self, authenticate_client, order_list_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        response = client.get(order_list_url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 0

    def test_not_authenticated_returns_401(self, api_client, order_list_url):
        response = api_client.get(order_list_url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestRetrieveOrder:
    def test_returns_200(self, authenticate_client, order_detail_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        order = baker.make(models.Order, customer=customer)
        order_items = baker.make(models.OrderItem, order=order, _quantity=random.randint(3, 5))
        for item in order_items:
            baker.make(models.Review, order_item=item)

        response = client.get(order_detail_url(order.id))

        assert response.status_code == status.HTTP_200_OK

        assert response.data['status'] == order.status

        response_items = response.data['items']
        assert len(response_items) == len(order_items)
        for item_response, order_item in zip(response_items, order_items):
            assert_order_item_response(item_response, order_item)

    def test_if_not_own_order_returns_404(self, authenticate_client, order_detail_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        # Data from another customer
        order = baker.make(models.Order, customer=baker.make(models.Customer))
        baker.make(models.OrderItem, _quantity=5, order=order)

        response = client.get(order_detail_url(order.id))

        assert response.status_code == status.HTTP_404_NOT_FOUND
