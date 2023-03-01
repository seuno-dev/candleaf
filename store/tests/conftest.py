import pytest
from django.conf import settings
from model_bakery import baker
from rest_framework.test import APIClient


@pytest.fixture()
def api_client():
    return APIClient()


def authenticate(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture()
def authenticated_client():
    user = baker.make(settings.AUTH_USER_MODEL, is_staff=False)
    return authenticate(user)


@pytest.fixture()
def admin_client():
    user = baker.make(settings.AUTH_USER_MODEL, is_staff=True)
    return authenticate(user)
