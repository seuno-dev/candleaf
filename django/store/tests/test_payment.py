import random
from unittest import mock

import pytest
from django.core.cache import cache
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture
def create_payment_url():
    return reverse('payment-create')


@pytest.fixture
def stripe_webhook_url():
    return reverse('stripe-webhook')


@pytest.fixture
def uninitialized_order():
    customer = baker.make(models.Customer)
    order = baker.make(models.Order, customer=customer)
    baker.make(models.OrderItem, order=order, product__unit_price=random.randint(1, 10),
               quantity=random.randint(1, 10), _quantity=10)
    return order


@pytest.fixture
def payment_patch():
    create_payment_patch = mock.patch('stripe.PaymentIntent.create')
    retrieve_payment_patch = mock.patch('stripe.PaymentIntent.retrieve')

    mock_intent = mock.Mock(
        id='pi_test',
        client_secret='cs_test'
    )

    mock_create = create_payment_patch.start()
    mock_create.return_value = mock_intent

    mock_retrieve = retrieve_payment_patch.start()
    mock_retrieve.return_value = mock_intent

    return mock_intent


@pytest.mark.django_db
class TestCreatePayment:
    def test_uninitiated_returns_201(self, authenticate_client, create_payment_url, uninitialized_order, payment_patch):
        client = authenticate_client(user=uninitialized_order.customer.user)

        response = client.post(create_payment_url, {'order_id': uninitialized_order.id})

        assert response.status_code == status.HTTP_201_CREATED

    def test_waiting_returns_200(self, authenticate_client, create_payment_url, uninitialized_order, payment_patch):
        client = authenticate_client(user=uninitialized_order.customer.user)

        # Initiate the payment first so the status change
        client.post(create_payment_url, {'order_id': uninitialized_order.id})

        # Send the same request again
        response = client.post(create_payment_url, {'order_id': uninitialized_order.id})

        assert response.status_code == status.HTTP_200_OK

    def test_concurrent_call_returns_409(self, authenticate_client, create_payment_url, uninitialized_order):
        client = authenticate_client(user=uninitialized_order.customer.user)

        # Simulate locking because payment is being created
        cache.set(uninitialized_order.get_lock_key(), True, timeout=30)

        response = client.post(create_payment_url, {'order_id': uninitialized_order.id})

        assert response.status_code == status.HTTP_409_CONFLICT


@pytest.mark.django_db
class TestStripeWebhook:
    def test_stripe_webhook(self, authenticate_client, create_payment_url, api_client, stripe_webhook_url,
                            uninitialized_order, payment_patch):
        client = authenticate_client(user=uninitialized_order.customer.user)

        # Send payment creation request so payment intent is created
        client.post(create_payment_url, {'order_id': uninitialized_order.id})
        order = models.Order.objects.get(id=uninitialized_order.id)

        payload = "payload"
        sig_header = "signature"

        with mock.patch('stripe.Webhook.construct_event') as mock_construct_event:
            mock_event = mock.Mock(
                type='payment_intent.succeeded',
                data=mock.Mock(
                    object=mock.Mock(
                        id=order.payment_intent_id,
                        metadata=mock.Mock(
                            order_id=order.id
                        )
                    )
                )
            )
            mock_construct_event.return_value = mock_event

            response = api_client.post(stripe_webhook_url, data={'payload': payload}, HTTP_STRIPE_SIGNATURE=sig_header)

            assert response.status_code == 200
