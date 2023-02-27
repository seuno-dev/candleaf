import pytest
from django.conf import settings
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models, serializers
from store.tests.conftest import get_client_from_user


@pytest.fixture()
def customers_list_url():
    return reverse('customers-list')


@pytest.fixture()
def customers_detail_url():
    def _method(pk):
        return reverse('customers-detail', kwargs=dict(pk=pk))

    return _method


@pytest.fixture()
def customer_auth():
    customer = baker.make(models.Customer, user__is_staff=False)
    return get_client_from_user(customer.user), customer


@pytest.mark.django_db
class TestRegisterCustomer:
    def test_user_if_correct_returns_201(self, api_client):
        response_user = api_client.post('/auth/users/', {
            'username': 'a',
            'email': 'email@g.com',
            'password': ')P38`dwzSNpA5[Q4',
            'first_name': 'd',
            'last_name': 'e'
        })

        assert response_user.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize('params', [
        {
            'username': '',
            'email': 'email@g.com',
            'password': ')P38`dwzSNp4',
            'first_name': 'd',
            'last_name': 'e'
        },
        {
            'username': 'a',
            'email': '',
            'password': ')P38`dwzSNp4',
            'first_name': 'd',
            'last_name': 'e'
        },
        {
            'username': 'a',
            'email': '',
            'password': '',
            'first_name': 'd',
            'last_name': 'e'
        },
    ])
    def test_user_if_wrong_params_returns_400(self, api_client, params):
        response = api_client.post('/auth/users/', params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_customer_if_correct_returns_201(self, authenticated_client, customers_list_url):
        response_create = authenticated_client.post(customers_list_url, {
            'phone': '907890',
            'address': 'a'
        })

        assert response_create.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize('params', [
        {
            'phone': '',
            'address': '',
        },
        {
            'phone': 'a',
            'address': '',
        },
        {
            'phone': '',
            'address': 'a',
        },
    ])
    def test_customer_if_wrong_params_returns_400(self, authenticated_client, params, customers_list_url):
        response = authenticated_client.post(customers_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestListCustomer:
    def test_if_admin_returns_200(self, admin_client, customers_list_url):
        customers = baker.make(models.Customer, _quantity=5)

        response = admin_client.get(customers_list_url)

        assert response.status_code == status.HTTP_200_OK
        assert response.json() == serializers.CustomerSerializer(instance=customers, many=True).data

    def test_if_not_admin_returns_403(self, authenticated_client, customers_list_url):
        response = authenticated_client.get(customers_list_url)

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestRetrieveCustomer:
    def test_if_its_own_returns_200(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth

        response = customer_client.get(customers_detail_url(pk=customer.user.id))

        assert response.status_code == status.HTTP_200_OK

    def test_if_it_not_its_own_return_403(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth
        another_customer = baker.make(models.Customer, user__is_staff=False)

        response = customer_client.get(customers_detail_url(pk=another_customer.user.id))

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestUpdateCustomer:
    def test_user_if_its_own_returns_200(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth
        user = customer.user

        params = {
            'first_name': 'a',
            'last_name': 'b',
        }
        response = customer_client.patch('/auth/users/me/', params)
        user.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert customer.user.first_name == params['first_name']
        assert customer.user.last_name == params['last_name']

    def test_customer_if_its_own_returns_200(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth

        params = {
            'phone': 'fwe',
            'address': 'dasfjkl'
        }
        response = customer_client.patch(customers_detail_url(pk=customer.user.id), params)
        customer.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert customer.phone == params['phone']
        assert customer.address == params['address']

    def test_customer_if_not_its_own_returns_403(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth
        another_customer = baker.make(models.Customer)

        response = customer_client.put(customers_detail_url(pk=another_customer.user.id), {
            'phone': 'fwe',
            'address': 'dasfjkl'
        })

        assert response.status_code == status.HTTP_403_FORBIDDEN
