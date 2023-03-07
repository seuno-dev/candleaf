import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.reverse import reverse
import random

from store import models


@pytest.fixture
def order_list_url():
    return reverse('orders-list')


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

        order_items = models.Order.objects.filter(customer=customer).last().orderitem_set.all()
        assert len(order_items) == len(cart_items)

        # The cart should be deleted
        assert models.Cart.objects.filter(id=cart.id).count() == 0

        for i in range(len(order_items)):
            cart_item = cart_items[i]
            order_item = order_items[i]

            # The cart item should be deleted
            assert models.CartItem.objects.filter(id=cart_item.id).count() == 0

            # The order item should have the correct properties
            assert order_item.product == cart_item.product
            assert order_item.unit_price == cart_item.product.unit_price
            assert order_item.quantity == cart_item.quantity

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
