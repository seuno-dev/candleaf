import itertools
import os
import random
from io import BytesIO

from django.db import transaction
from django.db.models.fields import files
from model_bakery import baker

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'ShopZone.settings')

import requests
import django
from django.utils.text import slugify
import json

django.setup()
from store.models import Category, Product, ProductImage, Review, OrderItem, Order


def clean_and_create_category(title):
    title = title.replace('-', ' ')
    title = title.capitalize()
    return Category.objects.create(title=title)


def download_temp_image(url):
    resp = requests.get(url)
    fp = BytesIO()
    fp.write(resp.content)
    file_name = url.split("/")[-1]
    return file_name, files.File(fp)


def populate():
    print("Populating categories...")
    cat_cache = {}
    cat_responses = requests.get("https://dummyjson.com/products/categories")
    for cat_title in json.loads(cat_responses.text):
        print(cat_title)
        cat_cache[cat_title] = clean_and_create_category(cat_title)

    print("Populating products...")
    product_responses = requests.get("https://dummyjson.com/products?limit=100")
    for product_dict in json.loads(product_responses.text)['products']:
        print(product_dict['id'])
        product = Product.objects.create(title=product_dict['title'], slug=slugify(product_dict['title']),
                                         description=product_dict['description'],
                                         unit_price=product_dict['price'],
                                         category=cat_cache[product_dict['category']])
        for image in product_dict['images']:
            file_name, file = download_temp_image(image)
            product_image = ProductImage(product=product)
            product_image.image.save(file_name, file)
            product_image.save()

        baker.make(Review, _quantity=random.randint(1, 10), order_item__product=product, rating=itertools.cycle([1, 3]),
                   comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit sem tristique, ultricies ex ac, congue ligula.")
        baker.make(Review, _quantity=random.randint(1, 90), order_item__product=product, rating=itertools.cycle([4, 5]),
                   comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit sem tristique, ultricies ex ac, congue ligula.")


def delete_current_data():
    Category.objects.all().delete()
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Product.objects.all().delete()
    Review.objects.all().delete()


@transaction.atomic
def main():
    delete_current_data()
    populate()


if __name__ == '__main__':
    main()
