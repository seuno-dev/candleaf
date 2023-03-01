from django.urls import reverse
import pytest
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture()
def cart_item_list_url():
    return reverse('cart-items-list')


@pytest.mark.django_db
class TestAddCartItem:
    def test_returns_201(self, authenticate_client, cart_item_list_url):
        products = baker.make(models.Product, _quantity=3)
        customer = baker.make(models.Customer)

        for product in products:
            params = {'product_id': product.id, 'quantity': 1}
            response = authenticate_client(customer.user).post(cart_item_list_url, params)

            assert response.status_code == status.HTTP_201_CREATED

            cart = models.Cart.objects.get(customer=customer)
            cart_item: models.CartItem = cart.cartitem_set.filter(product=product)[0]
            assert cart_item.quantity == params['quantity']

    def test_if_product_already_increment_quantity(self, authenticate_client, cart_item_list_url):
        cart_item = baker.make(models.CartItem)
        qty_start = cart_item.quantity

        params = {'product_id': cart_item.product.id, 'quantity': 1}
        response = authenticate_client(cart_item.cart.customer.user) \
            .post(cart_item_list_url, params)

        assert response.status_code == status.HTTP_201_CREATED

        cart_item.refresh_from_db()
        assert cart_item.quantity == qty_start + params['quantity']

    @pytest.mark.parametrize('wrong_param', [
        {'product_id': 9999}, {'quantity': 0}
    ])
    def test_if_wrong_params_returns_400(self, authenticate_client, cart_item_list_url, wrong_param):
        product = baker.make(models.Product)
        customer = baker.make(models.Customer)

        params = {'product_id': product.id, 'quantity': 1}
        params.update(wrong_param)
        response = authenticate_client(customer.user).post(cart_item_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_not_authenticated_returns_401(self, api_client, cart_item_list_url):
        product = baker.make(models.Product)

        params = {'product_id': product.id, 'quantity': 1}
        response = api_client.post(cart_item_list_url, params)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
