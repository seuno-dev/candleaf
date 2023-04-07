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

        for i in range(len(order_items)):
            cart_item = cart_items[i]
            order_item: models.OrderItem = order_items[i]

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
        order_items_set = []
        for order in orders:
            order_items = baker.make(models.OrderItem, order=order, _quantity=random.randint(1, 10))
            order_items_set.append(order_items)

        # Data from other customers
        baker.make(models.OrderItem, _quantity=5,
                   order=cycle(baker.make(models.Order, customer=baker.make(models.Customer), _quantity=5)))

        response = client.get(order_list_url)

        assert response.status_code == status.HTTP_200_OK

        for i in range(len(orders)):
            order = orders[i]
            order_items = order_items_set[i]
            response_order = response.data[i]

            assert response_order['id'] == order.id

            assert len(order_items) != 0
            for j in range(len(order_items)):
                order_item = order_items[j]
                response_item = response_order['items'][j]

                assert response_item['product']['title'] == order_item.product.title
                assert response_item['unit_price'] == order_item.unit_price.to_eng_string()
                assert response_item['quantity'] == order_item.quantity
                assert response_item['total_price'] == order_item.unit_price * order_item.quantity

    def test_empty_returns_200(self, authenticate_client, order_list_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        response = client.get(order_list_url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

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

        response = client.get(order_detail_url(order.id))

        assert response.status_code == status.HTTP_200_OK

        response_items = response.data['items']
        assert len(response_items) == len(order_items)
        for i in range(len(order_items)):
            order_item = order_items[i]
            response_item = response_items[i]

            assert response_item['product']['title'] == order_item.product.title
            assert response_item['quantity'] == order_item.quantity
            assert response_item['unit_price'] == order_item.unit_price.to_eng_string()
            assert response_item['total_price'] == order_item.quantity * order_item.unit_price

    def test_if_not_own_order_returns_404(self, authenticate_client, order_detail_url):
        customer = baker.make(models.Customer)
        client = authenticate_client(customer.user)

        # Data from another customer
        order = baker.make(models.Order, customer=baker.make(models.Customer))
        baker.make(models.OrderItem, _quantity=5, order=order)

        response = client.get(order_detail_url(order.id))

        assert response.status_code == status.HTTP_404_NOT_FOUND
