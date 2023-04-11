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
    def _method(slug):
        return reverse('products-detail', kwargs=dict(slug=slug))

    return _method


@pytest.mark.django_db
class TestCreateProduct:
    def test_if_admin_returns_201(self, authenticate_client, products_list_url):
        category = baker.make(models.Category)

        params = {'title': 'wKUXxTIp', 'description': '', 'unit_price': '490.53', 'inventory': 0,
                  'category': category.id}
        response = authenticate_client(is_staff=True).post(products_list_url, params, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        product = models.Product.objects.filter(title='wKUXxTIp')[0]
        assert product.title == params['title']
        assert product.description == params['description']
        assert product.unit_price.to_eng_string() == params['unit_price']
        assert product.inventory == params['inventory']
        assert product.category.id == params['category']

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
        category = baker.make(models.Category)
        products_with_category = baker.make(models.Product, category=category, _quantity=5)
        products_without_category = baker.make(models.Product, _quantity=5)

        response = api_client.get(products_list_url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']

        for product, response_product in zip(products_with_category + products_without_category, results):
            assert product.id == response_product['id']
            assert product.title == response_product['title']
            assert product.slug == response_product['slug']
            assert product.description == response_product['description']
            assert product.unit_price == response_product['unit_price']
            assert product.inventory == response_product['inventory']

            if product.category:
                assert product.category.id == response_product['category']['id']
                assert product.category.title == response_product['category']['title']
                assert product.category.slug == response_product['category']['slug']
            else:
                assert response_product['category'] is None


@pytest.mark.django_db
class TestRetrieveProduct:
    def test_returns_200(self, api_client, products_detail_url):
        product = baker.make(models.Product)

        response = api_client.get(products_detail_url(product.slug))

        assert response.status_code == status.HTTP_200_OK
        assert product.id == response.data['id']
        assert product.title == response.data['title']
        assert product.slug == response.data['slug']
        assert product.description == response.data['description']
        assert product.unit_price == response.data['unit_price']
        assert product.inventory == response.data['inventory']
        assert product.category == response.data['category']

    def test_not_exists_return_404(self, api_client, products_detail_url):
        response = api_client.get(products_detail_url(9999))

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestUpdateProduct:
    def test_if_admin_returns_200(self, authenticate_client, products_detail_url):
        category = baker.make(models.Category)
        product = baker.make(models.Product, category=None)

        params = {'title': 'wKUXxTIp', 'description': 'a', 'unit_price': '490.53', 'inventory': 0,
                  'category': category.id}
        response = authenticate_client(is_staff=True) \
            .patch(products_detail_url(product.slug), params)

        assert response.status_code == status.HTTP_200_OK

    def test_if_not_admin_returns_403(self, authenticate_client, products_detail_url):
        product = baker.make(models.Product, category=None)

        params = {'title': 'wKUXxTIp', 'description': 'a', 'unit_price': '490.53', 'inventory': 0}
        response = authenticate_client(is_staff=False) \
            .patch(products_detail_url(product.slug), params)

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestDeleteProduct:
    def test_if_admin_returns_204(self, authenticate_client, products_detail_url):
        product = baker.make(models.Product)

        response = authenticate_client(is_staff=True) \
            .delete(products_detail_url(product.slug))

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_if_not_exists_returns_404(self, authenticate_client, products_detail_url):
        response = authenticate_client(is_staff=True) \
            .delete(products_detail_url(9999))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_not_admin_returns_403(self, authenticate_client, products_detail_url):
        product = baker.make(models.Product)

        response = authenticate_client(is_staff=False) \
            .delete(products_detail_url(product.slug))

        assert response.status_code == status.HTTP_403_FORBIDDEN
