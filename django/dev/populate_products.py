import os
import random

from django.db import transaction

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'ShopZone.settings')

import requests
import django
import json

django.setup()
from store.models import Category, Product, ProductImage


def clean_and_create_category(title):
    title = title.replace('-', ' ')
    title = title.capitalize
    Category.objects.create(title=title)


@transaction.atomic
def populate():
    print("Populating categories...")
    cat_responses = requests.get("https://dummyjson.com/products/categories")
    for cat_title in cat_responses.text:
        print(cat_title)
        clean_and_create_category(cat_title)

    print("Populating products...")
    product_responses = requests.get("https://dummyjson.com/products")
    for product_dict in json.loads(product_responses.text)['products']:
        print(product_dict['id'])
        product = Product.objects.create(title=product_dict['title'], slug=product_dict['handle'],
                                         description=product_dict['description'],
                                         unit_price=product_dict['price'],
                                         category=Category.objects.get(title=product_dict['category']))
        for image in product_dict['images']:
            ProductImage.objects.create(product=product, image=image)

        for i in range(random.randint(100)):



# Start execution here!
if __name__ == '__main__':
    populate()
