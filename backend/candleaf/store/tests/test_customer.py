import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models, serializers


@pytest.fixture()
def customers_list_url():
    return reverse('customers-list')


@pytest.fixture()
def customers_detail_url():
    def _method(pk):
        return reverse('customers-detail', kwargs=dict(pk=pk))

    return _method


@pytest.fixture()
def customers_me_url():
    return reverse('customers-me')


@pytest.fixture()
def customer_auth(api_client):
    customer = baker.make(models.Customer, user__is_staff=False)
    api_client.force_authenticate(customer.user)
    return api_client, customer


@pytest.mark.django_db
class TestRegisterCustomer:
    def test_user_if_correct_returns_201(self, api_client):
        response_user = api_client.post('/auth/users/', {
            'email': 'email@g.com',
            'password': ')P38`dwzSNpA5[Q4',
            'first_name': 'd',
            'last_name': 'e'
        })

        assert response_user.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize('params', [
        {
            'email': '',
            'password': ')P38`dwzSNp4',
            'first_name': 'd',
            'last_name': 'e'
        },
        {
            'email': '',
            'password': '',
            'first_name': 'd',
            'last_name': 'e'
        },
    ])
    def test_user_if_wrong_params_returns_400(self, api_client, params):
        response = api_client.post('/auth/users/', params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_customer_if_correct_returns_201(self, authenticate_client, customers_list_url):
        response_create = authenticate_client().post(customers_list_url, {
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
    def test_customer_if_wrong_params_returns_400(self, authenticate_client, params, customers_list_url):
        response = authenticate_client().post(customers_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_user_customer_if_correct_return_201(self, api_client):
        params = {
            'email': 'email@g.com',
            'password': ')P38`dwzSNpA5[Q4',
            'first_name': 'd',
            'last_name': 'e',
            'phone': '907890',
            'address': 'a',
        }

        response = api_client.post("/store/create-user-customer/", params)

        assert response.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize("field", [{"email": ""}, {"password": ""}, {"first_name": ""}, {"last_name": ""}, {"phone": ""}, {"address": ""} ])
    def test_create_user_customer_if_wrong_return_400(self, api_client, field):
        params = {
            'email': 'email@g.com',
            'password': ')P38`dwzSNpA5[Q4',
            'first_name': 'd',
            'last_name': 'e',
            'phone': '907890',
            'address': 'a',
        }
        params.update(field)

        response = api_client.post("/store/create-user-customer/", params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        if params["phone"] is None or params["address"] is None:
            assert get_user_model().objects.count() == 0


@pytest.mark.django_db
class TestListCustomer:
    def test_if_admin_returns_200(self, authenticate_client, customers_list_url):
        customers = baker.make(models.Customer, _quantity=5)

        response = authenticate_client(is_staff=True).get(customers_list_url)

        assert response.status_code == status.HTTP_200_OK
        assert response.json() == serializers.CustomerSerializer(instance=customers, many=True).data

    def test_if_not_admin_returns_403(self, authenticate_client, customers_list_url):
        response = authenticate_client().get(customers_list_url)

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


@pytest.mark.django_db
class TestDeleteCustomer:
    def test_if_its_own_returns_204(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth

        response = customer_client.delete(customers_detail_url(pk=customer.user.id))

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert models.Customer.objects.filter(id=customer.id).count() == 0
        assert get_user_model().objects.filter(id=customer.user.id).count() == 0

    def test_if_not_its_own_returns_403(self, customers_detail_url, customer_auth):
        customer_client, customer = customer_auth
        another_customer = baker.make(models.Customer)

        response = customer_client.delete(customers_detail_url(pk=another_customer.user.id))

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestRetrieveCustomerMe:
    def test_returns_200(self, customer_auth, customers_me_url):
        customer_client, customer = customer_auth

        response = customer_client.get(customers_me_url)

        assert response.status_code == status.HTTP_200_OK

    def test_if_unauthenticated_returns_401(self, api_client, customers_me_url):
        response = api_client.get(customers_me_url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_customer_not_created_returns_404(self, api_client, customers_me_url):
        user = baker.make(get_user_model())
        api_client.force_authenticate(user)

        response = api_client.get(customers_me_url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestUpdateCustomerMe:
    def test_put_returns_200(self, customer_auth, customers_me_url):
        client, customer = customer_auth

        params = {
            'first_name': 'dsaf',
            'last_name': 'aesdf',
            'email': 'asdf@gmail.com',
            'phone': '472134',
            'address': 'asdfdasf st. 231'
        }
        response = client.put(customers_me_url, params)

        assert response.status_code == status.HTTP_200_OK

        customer.refresh_from_db()
        assert customer.user.first_name == params['first_name']
        assert customer.user.last_name == params['last_name']
        assert customer.user.email == params['email']
        assert customer.phone == params['phone']
        assert customer.address == params['address']

    def test_if_unauthenticated_returns_401(self, api_client, customers_me_url):
        params = {
            'first_name': 'dsaf',
            'last_name': 'aesdf',
            'email': 'asdf@gmail.com',
            'phone': '472134',
            'address': 'asdfdasf st. 231'
        }
        response = api_client.put(customers_me_url, params)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_customer_not_created_returns_404(self, api_client, customers_me_url):
        user = baker.make(get_user_model())
        api_client.force_authenticate(user)

        params = {
            'first_name': 'dsaf',
            'last_name': 'aesdf',
            'email': 'asdf@gmail.com',
            'phone': '472134',
            'address': 'asdfdasf st. 231'
        }
        response = api_client.put(customers_me_url, params)

        assert response.status_code == status.HTTP_404_NOT_FOUND
