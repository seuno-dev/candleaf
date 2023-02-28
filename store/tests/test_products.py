import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models, serializers


@pytest.fixture
def products_list_url():
    return reverse('products-list')


@pytest.mark.django_db
class TestCreateProduct:
    def test_if_admin_returns_201(self, admin_client, products_list_url):
        collection = baker.make(models.Collection)

        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0,
                  'collection': collection.id}
        response = admin_client.post(products_list_url, params)

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
    def test_if_admin_wrong_params_return_400(self, wrong_params, admin_client, products_list_url):
        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0, }
        params.update(wrong_params)

        response = admin_client.post(products_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_not_admin_returns_403(self, authenticated_client, products_list_url):
        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0}
        response = authenticated_client.post(products_list_url, params)

        assert response.status_code == status.HTTP_403_FORBIDDEN
