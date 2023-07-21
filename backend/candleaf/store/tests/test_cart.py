import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture()
def cart_item_list_url():
    return reverse('cart-items-list')


@pytest.fixture()
def cart_item_detail_url():
    def _method(pk):
        return reverse('cart-items-detail', kwargs=dict(pk=pk))

    return _method


@pytest.mark.django_db
class TestAddCartItem:
    def test_returns_201(self, authenticate_client, cart_item_list_url):
        products = baker.make(models.Product, inventory=10, _quantity=3)
        customer = baker.make(models.Customer)

        for product in products:
            params = {'product_id': product.id, 'quantity': 1}
            response = authenticate_client(customer.user).post(cart_item_list_url, params)

            assert response.status_code == status.HTTP_201_CREATED

            cart = models.Cart.objects.get(customer=customer)
            cart_item: models.CartItem = cart.cartitem_set.filter(product=product).first()
            assert cart_item.quantity == params['quantity']

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

    def test_if_quantity_is_more_than_inventory_returns_409(self, authenticate_client, cart_item_list_url):
        product = baker.make(models.Product, inventory=1)
        customer = baker.make(models.Customer)

        params = {'product_id': product.id, 'quantity': product.inventory + 1}
        response = authenticate_client(customer.user).post(cart_item_list_url, params)

        assert response.status_code == status.HTTP_409_CONFLICT

    def test_if_not_authenticated_returns_401(self, api_client, cart_item_list_url):
        product = baker.make(models.Product)

        params = {'product_id': product.id, 'quantity': 1}
        response = api_client.post(cart_item_list_url, params)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUpdateCartItem:
    def test_if_product_is_already_added_increment_quantity(self, authenticate_client, cart_item_list_url):
        cart_item = baker.make(models.CartItem, product__inventory=5, quantity=1)
        qty_start = cart_item.quantity

        params = {'product_id': cart_item.product.id, 'quantity': 1}
        response = authenticate_client(cart_item.cart.customer.user) \
            .post(cart_item_list_url, params)

        assert response.status_code == status.HTTP_201_CREATED

        cart_item.refresh_from_db()
        assert cart_item.quantity == qty_start + params['quantity']

    def test_change_quantity_returns_200(self, authenticate_client, cart_item_detail_url):
        inventory = 5
        cart_item = baker.make(models.CartItem, product__inventory=inventory, quantity=1)

        params = {'quantity': inventory}
        response = authenticate_client(cart_item.cart.customer.user) \
            .patch(cart_item_detail_url(cart_item.id), params)

        assert response.status_code == status.HTTP_200_OK

        cart_item.refresh_from_db()
        assert cart_item.quantity == params['quantity']

    def test_if_quantity_is_more_than_inventory_returns_409(self, authenticate_client, cart_item_detail_url):
        inventory = 1
        cart_item = baker.make(models.CartItem, product__inventory=inventory, quantity=1)

        params = {'quantity': inventory + 1}
        response = authenticate_client(cart_item.cart.customer.user) \
            .patch(cart_item_detail_url(pk=cart_item.id), params)

        assert response.status_code == status.HTTP_409_CONFLICT

    def test_if_not_own_cart_returns_404(self, authenticate_client, cart_item_detail_url):
        cart_item = baker.make(models.CartItem, product__inventory=2, quantity=1)

        params = {'quantity': 2}
        response = authenticate_client().patch(cart_item_detail_url(cart_item.id), params)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestListCartItem:
    def test_returns_200(self, authenticate_client, cart_item_list_url):
        customer1 = baker.make(models.Customer)

        cart = baker.make(models.Cart, customer=customer1)
        cart_items = baker.make(models.CartItem, cart=cart, _quantity=3)

        # Cart items from another customer which shouldn't be shown
        customer2 = baker.make(models.Customer)
        cart = baker.make(models.Cart, customer=customer2)
        baker.make(models.CartItem, cart=cart, _quantity=3)

        response = authenticate_client(customer1.user).get(cart_item_list_url)

        assert response.status_code == status.HTTP_200_OK

        for item_response, cart_item in zip(response.data, cart_items):
            assert item_response['product']['id'] == cart_item.product.id
            assert item_response['product']['title'] == cart_item.product.title
            assert item_response['product']['unit_price'] == cart_item.product.unit_price

            assert item_response['quantity'] == cart_item.quantity
            assert item_response['total_price'] == cart_item.quantity * cart_item.product.unit_price


@pytest.mark.django_db
class TestDeleteCartItem:
    def test_returns_204(self, authenticate_client, cart_item_detail_url):
        cart_item = baker.make(models.CartItem)

        response = authenticate_client(cart_item.cart.customer.user) \
            .delete(cart_item_detail_url(cart_item.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT

        assert models.CartItem.objects.filter(id=cart_item.id).count() == 0

    def test_if_not_own_cart_returns_404(self, authenticate_client, cart_item_detail_url):
        cart_item = baker.make(models.CartItem)

        response = authenticate_client().delete(cart_item_detail_url(cart_item.id))

        assert response.status_code == status.HTTP_404_NOT_FOUND
