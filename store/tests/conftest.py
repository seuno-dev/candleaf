import pytest
from django.contrib.auth import settings
from model_bakery import baker
from rest_framework.test import APIClient


@pytest.fixture()
def api_client():
    return APIClient()


@pytest.fixture()
def authenticate_client(api_client):
    def _method(user=None, is_staff=False):
        if not user:
            user = baker.make(settings.AUTH_USER_MODEL, is_staff=is_staff)
        api_client.force_authenticate(user=user)
        return api_client

    return _method
