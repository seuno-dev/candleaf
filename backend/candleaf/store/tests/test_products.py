import itertools

import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from store import models


@pytest.fixture
def products_list_url():
    return reverse('products-list')


@pytest.fixture
def products_detail_url():
    def _method(slug):
        return reverse('products-detail', kwargs=dict(slug=slug))

    return _method


@pytest.fixture
def products_featured_url():
    return reverse('products-featured')


def assert_product_response(product_response, product):
    assert product_response['id'] == product.id
    assert product_response['title'] == product.title
    assert product_response['slug'] == product.slug
    assert product_response['description'] == product.description
    assert product_response['unit_price'] == product.unit_price
    assert product_response['inventory'] == product.inventory
    assert product_response['average_rating'] == product.average_rating
    assert product_response['review_count'] == product.review_count

    # product specifications
    assert product_response['wax'] == product.wax
    assert product_response['fragrance'] == product.fragrance
    assert product_response['dimension'] == product.dimension
    assert product_response['weight'] == product.weight
    assert product_response['burning_time'] == product.burning_time

    if product.review_count > 0:
        for review_response, review in zip(product_response['reviews'], product.few_reviews):
            assert review_response['id'] == review.id
            assert review_response['order_item']['id'] == review.order_item.id
            assert review_response['rating'] == review.rating
            assert review_response['comment'] == review.comment


# noinspection DuplicatedCode
@pytest.mark.django_db
class TestListProduct:
    def test_returns_200(self, api_client, products_list_url):
        products = baker.make(models.Product, _quantity=5)

        response = api_client.get(products_list_url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']
        assert len(results) == len(products)

        for product_response, product in zip(results, products):
            assert_product_response(product_response, product)

    def test_title_filter_returns_200(self, api_client, products_list_url):
        baker.make(models.Product, _quantity=10)

        # Only this product should be returned by the API
        titles = ['new macbook 2012', 'macbook m1', 'used macbook 2018']
        products = baker.make(models.Product, title=itertools.cycle(titles), _quantity=3)

        url = f"{products_list_url}?title=macbook"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']
        assert len(results) == len(products)

        for product_response, product in zip(results, products):
            assert_product_response(product_response, product)

    def test_price_filter_returns_200(self, api_client, products_list_url):
        baker.make(models.Product, unit_price=5, _quantity=5)
        baker.make(models.Product, unit_price=25, _quantity=5)

        # Only this product should be returned by the API
        products = baker.make(models.Product, unit_price=15, _quantity=10)

        url = f"{products_list_url}?price_min=10&price_max=20"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']
        assert len(results) == len(products)

        for product_response, product in zip(results, products):
            assert_product_response(product_response, product)

    def test_burning_time_filter_returns_200(self, api_client, products_list_url):
        baker.make(models.Product, burning_time=15, _quantity=5)
        baker.make(models.Product, burning_time=35, _quantity=5)

        # Only this product should be returned by the API
        products = baker.make(models.Product, burning_time=25, _quantity=10)

        url = f"{products_list_url}?burning_time_min=20&burning_time_max=30"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data['results']
        assert len(results) == len(products)

        for product_response, product in zip(results, products):
            assert_product_response(product_response, product)


@pytest.mark.django_db
class TestRetrieveProduct:
    def test_returns_200(self, api_client, products_detail_url):
        product = baker.make(models.Product)
        baker.make(models.Review, order_item__product=product, _quantity=20)

        response = api_client.get(products_detail_url(product.slug))

        assert response.status_code == status.HTTP_200_OK
        assert_product_response(response.data, product)

    def test_not_exists_return_404(self, api_client, products_detail_url):
        response = api_client.get(products_detail_url(9999))

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestFeaturedProduct:
    def test_returns_200(self, api_client, products_featured_url):
        featured_products = baker.make(models.FeaturedProduct, _quantity=8)

        response = api_client.get(products_featured_url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data
        assert len(results) == len(featured_products)

        for fp_response, fp in zip(results, featured_products):
            assert fp_response['id'] == fp.id
            assert_product_response(fp_response['product'], fp.product)

    def test_only_returns_eight_products(self, api_client, products_featured_url):
        featured_products = baker.make(models.FeaturedProduct, _quantity=10)

        response = api_client.get(products_featured_url)

        assert response.status_code == status.HTTP_200_OK

        results = response.data
        assert len(results) == 8
