import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture
def products_list_url():
    return reverse('products-list')


@pytest.fixture
def products_detail_url():
    def _method(pk):
        return reverse('products-detail', kwargs=dict(pk=pk))

    return _method


@pytest.mark.django_db
class TestCreateProduct:
    def test_if_admin_returns_201(self, authenticate_client, products_list_url):
        collection = baker.make(models.Collection)

        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0,
                  'collection': collection.id}
        response = authenticate_client(is_staff=True).post(products_list_url, params)

        assert response.status_code == status.HTTP_201_CREATED
        product = models.Product.objects.filter(title='wKUXxTIp')[0]
        assert product.title == params['title']
        assert product.description == params['description']
        assert product.unit_price.to_eng_string() == params['unit_price']
        assert product.inventory == params['inventory']
        assert product.collection.id == params['collection']

    @pytest.mark.parametrize('wrong_params', [
        {'title': ''},
        {'unit_price': ''}
    ])
    def test_if_admin_wrong_params_return_400(self, wrong_params, authenticate_client, products_list_url):
        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0, }
        params.update(wrong_params)

        response = authenticate_client(is_staff=True).post(products_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_not_admin_returns_403(self, authenticate_client, products_list_url):
        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0}
        response = authenticate_client().post(products_list_url, params)

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestListProduct:
    def test_returns_200(self, api_client, products_list_url):
        products = baker.make(models.Product, _quantity=5)

        response = api_client.get(products_list_url)

        assert response.status_code == status.HTTP_200_OK

        for i in range(len(products)):
            product = products[i]
            response_product = response.data[i]

            assert product.id == response_product['id']
            assert product.title == response_product['title']
            assert product.description == response_product['description']
            assert product.unit_price.to_eng_string() == response_product['unit_price']
            assert product.inventory == response_product['inventory']
            assert product.collection == response_product['collection']


@pytest.mark.django_db
class TestRetrieveProduct:
    def test_returns_200(self, api_client, products_detail_url):
        product = baker.make(models.Product)

        response = api_client.get(products_detail_url(product.id))

        assert response.status_code == status.HTTP_200_OK
        assert product.id == response.data['id']
        assert product.title == response.data['title']
        assert product.description == response.data['description']
        assert product.unit_price.to_eng_string() == response.data['unit_price']
        assert product.inventory == response.data['inventory']
        assert product.collection == response.data['collection']

