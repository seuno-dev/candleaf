import pytest
from django.urls import reverse
from rest_framework import status


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

    def test_customer_if_correct_returns_201(self, authenticated_client):
        response_create = authenticated_client.post(reverse('customers-list'), {
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
    def test_customer_if_wrong_params_returns_400(self, authenticated_client, params):
        response = authenticated_client.post(reverse('customers-list'), params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
