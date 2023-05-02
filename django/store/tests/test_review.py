import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture
def review_list_url():
    return reverse('reviews-list')


@pytest.mark.django_db
class TestCreateReview:
    def test_returns_201(self, authenticate_client, review_list_url):
        customer = baker.make(models.Customer)
        order_item = baker.make(models.OrderItem, order__customer=customer)

        client = authenticate_client(customer.user)

        params = {
            "order_item": order_item.id,
            "rating": 3,
            "comment": "dfasuawioe"
        }
        response = client.post(review_list_url, params)

        assert response.status_code == status.HTTP_201_CREATED

        review = order_item.review_set.first()
        assert review.rating == params["rating"]
        assert review.comment == params["comment"]

    def test_not_own_order_returns_403(self, authenticate_client, review_list_url):
        customer = baker.make(models.Customer)
        order_item = baker.make(models.OrderItem, order__customer=customer)
        client = authenticate_client()

        params = {
            "order_item": order_item.id,
            "rating": 3,
            "comment": "dfasuawioe"
        }
        response = client.post(review_list_url, params)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @pytest.mark.parametrize('wrong_params', [
        {"rating": 0},
        {"rating": 6},
    ])
    def test_params_invalid_returns_400(self, authenticate_client, review_list_url, wrong_params):
        customer = baker.make(models.Customer)
        baker.make(models.OrderItem, order__customer=customer)

        client = authenticate_client(customer.user)

        params = {
            "rating": 3,
            "comment": "dfasuawioe"
        }
        params.update(wrong_params)
        response = client.post(review_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
