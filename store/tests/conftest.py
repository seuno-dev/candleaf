import pytest
from django.conf import settings
from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture()
def api_client():
    return APIClient()


def get_client_from_user(user):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'JWT {RefreshToken.for_user(user).access_token}')
    return client


@pytest.fixture()
def authenticated_client():
    user = baker.make(settings.AUTH_USER_MODEL, is_staff=False)
    return get_client_from_user(user)


@pytest.fixture()
def admin_client():
    user = baker.make(settings.AUTH_USER_MODEL, is_staff=True)
    return get_client_from_user(user)
