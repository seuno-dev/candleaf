import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture
def review_list_url():
    return reverse('reviews-list')


@pytest.fixture
def review_detail_url():
    def _method(pk):
        return reverse('reviews-detail', kwargs=dict(pk=pk))

    return _method


@pytest.mark.django_db
class TestCreateReview:
    def test_returns_201(self, authenticate_client, review_list_url):
        customer = baker.make(models.Customer)
        order_item = baker.make(models.OrderItem, order__customer=customer, order__status=models.Order.STATUS_COMPLETED)

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

    def test_if_review_already_exists_returns_400(self, authenticate_client, review_list_url):
        customer = baker.make(models.Customer)
        order_item = baker.make(models.OrderItem, order__customer=customer)
        baker.make(models.Review, order_item=order_item)

        client = authenticate_client(customer.user)

        params = {
            "order_item": order_item.id,
            "rating": 3,
            "comment": "dfasuawioe"
        }
        response = client.post(review_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @pytest.mark.parametrize('order_status', [models.Order.STATUS_AWAITING_PAYMENT, models.Order.STATUS_PROCESSED,
                                              models.Order.STATUS_SHIPPED, models.Order.STATUS_CANCELLED])
    def test_order_not_completed_returns_400(self, authenticate_client, review_list_url, order_status):
        customer = baker.make(models.Customer)
        order_item = baker.make(models.OrderItem, order__customer=customer, order__status=order_status)

        client = authenticate_client(customer.user)

        params = {
            "order_item": order_item.id,
            "rating": 3,
            "comment": "dfasuawioe"
        }
        response = client.post(review_list_url, params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUpdateReview:
    def test_returns_200(self, authenticate_client, review_detail_url):
        customer = baker.make(models.Customer)
        review = baker.make(models.Review, order_item__order__customer=customer)

        client = authenticate_client(customer.user)

        params = {
            "rating": 3,
            "comment": "dfasuawioe"
        }
        response = client.patch(review_detail_url(review.id), params)

        assert response.status_code == status.HTTP_200_OK

        review.refresh_from_db()
        assert review.rating == params['rating']
        assert review.comment == params['comment']

    def test_not_own_review_returns_404(self, authenticate_client, review_detail_url):
        review = baker.make(models.Review)

        client = authenticate_client()

        params = {
            "rating": 3,
            "comment": "dfasuawioe"
        }
        response = client.patch(review_detail_url(review.id), params)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.parametrize('wrong_params', [
        {"rating": 0},
        {"rating": 6},
    ])
    def test_params_invalid_returns_400(self, authenticate_client, review_detail_url, wrong_params):
        customer = baker.make(models.Customer)
        review = baker.make(models.Review, order_item__order__customer=customer)

        client = authenticate_client(customer.user)

        params = {
            "rating": 3,
            "comment": "dfasuawioe"
        }
        params.update(wrong_params)
        response = client.patch(review_detail_url(review.id), params)

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestListReview:
    def test_returns_200(self, authenticate_client, review_list_url):
        customer = baker.make(models.Customer)
        reviews = baker.make(models.Review, order_item__order__customer=customer, _quantity=5)
        baker.make(models.Review, _quantity=5)

        client = authenticate_client(customer.user)

        response = client.get(review_list_url)

        assert response.status_code == status.HTTP_200_OK

        for review_response, review in zip(response.data, reviews):
            assert review_response['order_item']['id'] == review.order_item.id
            assert review_response['rating'] == review.rating
            assert review_response['comment'] == review.comment


@pytest.mark.django_db
class TestDetailReview:
    def test_returns_200(self, authenticate_client, review_detail_url):
        customer = baker.make(models.Customer)
        review = baker.make(models.Review, order_item__order__customer=customer)

        client = authenticate_client(customer.user)

        response = client.get(review_detail_url(review.id))

        assert response.data['order_item']['id'] == review.order_item.id
        assert response.data['rating'] == review.rating
        assert response.data['comment'] == review.comment

    def test_not_own_review_returns_404(self, authenticate_client, review_detail_url):
        review = baker.make(models.Review)
        client = authenticate_client()

        response = client.get(review_detail_url(review.id))

        assert response.status_code == status.HTTP_404_NOT_FOUND
