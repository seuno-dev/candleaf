import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.reverse import reverse

from store import models


@pytest.fixture
def category_list_url():
    return reverse('categories-list')


@pytest.fixture
def category_detail_url():
    def _method(slug):
        return reverse('categories-detail', kwargs=dict(slug=slug))

    return _method


@pytest.mark.django_db
class TestCreateCategory:
    def test_returns_201(self, authenticate_client, category_list_url):
        client = authenticate_client(is_staff=True)

        response = client.post(category_list_url, {'title': 'a new category'})

        assert response.status_code == status.HTTP_201_CREATED

    def test_if_wrong_params_returns_400(self, authenticate_client, category_list_url):
        client = authenticate_client(is_staff=True)

        response = client.post(category_list_url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_not_admin_returns_401(self, authenticate_client, category_list_url):
        client = authenticate_client()

        response = client.post(category_list_url, {'title': 'a new category'})

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestListCategory:
    def test_returns_200(self, api_client, category_list_url):
        categories = baker.make(models.Category, _quantity=20)

        response = api_client.get(category_list_url)

        assert response.status_code == status.HTTP_200_OK

        for category, cat_response in zip(categories, response.data):
            assert category.id == cat_response['id']
            assert category.title == cat_response['title']
            assert category.slug == cat_response['slug']


@pytest.mark.django_db
class TestRetrieveCategory:
    def test_returns_200(self, api_client, category_detail_url):
        category = baker.make(models.Category)

        response = api_client.get(category_detail_url(category.slug))

        assert response.status_code == status.HTTP_200_OK
        assert category.id == response.data['id']
        assert category.title == response.data['title']
        assert category.slug == response.data['slug']

    def test_not_exists_return_404(self, api_client, category_detail_url):
        response = api_client.get(category_detail_url("asscqaws"))

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestDeleteCategory:
    def test_returns_204(self, authenticate_client, category_detail_url):
        category = baker.make(models.Category)

        response = authenticate_client(is_staff=True) \
            .delete(category_detail_url(category.slug))

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_if_not_exists_returns_404(self, authenticate_client, category_detail_url):
        response = authenticate_client(is_staff=True) \
            .delete(category_detail_url("wseadfawefhk"))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_not_admin_returns_403(self, authenticate_client, category_detail_url):
        category = baker.make(models.Category)

        response = authenticate_client(is_staff=False) \
            .delete(category_detail_url(category.slug))

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestUpdateProduct:
    def test_returns_200(self, authenticate_client, category_detail_url):
        category = baker.make(models.Category)

        params = {'title': 'wKUXxTIp'}
        response = authenticate_client(is_staff=True) \
            .patch(category_detail_url(category.slug), params)

        assert response.status_code == status.HTTP_200_OK

    def test_if_not_admin_returns_403(self, authenticate_client, category_detail_url):
        category = baker.make(models.Category)

        params = {'title': 'wKUXxTIp'}
        response = authenticate_client(is_staff=False) \
            .patch(category_detail_url(category.slug), params)

        assert response.status_code == status.HTTP_403_FORBIDDEN
