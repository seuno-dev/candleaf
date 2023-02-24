from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import pytest


@pytest.fixture()
def api_client():
    return APIClient()


@pytest.fixture()
def authenticated_client():
    user = baker.make(settings.AUTH_USER_MODEL)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'JWT {RefreshToken.for_user(user).access_token}')
    return client
