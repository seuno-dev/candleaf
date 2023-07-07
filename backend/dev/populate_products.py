import sys
import os

script_path = os.path.dirname(__file__)
project_dir = os.path.abspath(os.path.join(script_path, '..', '..', 'backend'))
sys.path.insert(0, project_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'candleaf.settings')

from django.core.files import File

import itertools
import random
from io import BytesIO

from django.db import transaction
from django.db.models.fields import files
from model_bakery import baker

import requests
import django
from django.utils.text import slugify
import json

django.setup()
from store.models import Product, ProductImage, Review, OrderItem, Order, FeaturedProduct


def download_temp_image(url):
    resp = requests.get(url)
    fp = BytesIO()
    fp.write(resp.content)
    file_name = url.split("/")[-1]
    return file_name, files.File(fp)


def populate(products_data):
    print("Populating products...")
    for (index, product_dict) in enumerate(products_data):
        print(index)
        product = Product.objects.create(title=product_dict['title'], slug=slugify(product_dict['title']),
                                         inventory=10,
                                         description=product_dict['description'],
                                         unit_price=product_dict['unit_price'],
                                         wax=product_dict['wax'],
                                         fragrance=product_dict['fragrance'],
                                         burning_time=product_dict['burning_time'],
                                         dimension=product_dict['dimension'],
                                         weight=product_dict['weight'])

        product_image = ProductImage(product=product)

        image_file_name = product_dict['title'] + ".png"
        image_file = open("./dev/products_data/images/" + image_file_name, 'rb')
        product_image.image.save(image_file_name, File(image_file))
        product_image.save()
        image_file.close()

        baker.make(Review, _quantity=random.randint(1, 10), order_item__product=product, rating=itertools.cycle([1, 3]),
                   comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit sem tristique, ultricies ex ac, congue ligula.")
        baker.make(Review, _quantity=random.randint(20, 90), order_item__product=product,
                   rating=itertools.cycle([4, 5]),
                   comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis blandit sem tristique, ultricies ex ac, congue ligula.")

    products = Product.objects.all()
    for i in range(8):
        FeaturedProduct.objects.create(product=products[i])


def delete_current_data():
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Product.objects.all().delete()
    FeaturedProduct.objects.all().delete()
    Review.objects.all().delete()


@transaction.atomic
def main():
    delete_current_data()

    f = open("./dev/products_data/products.json")
    populate(json.load(f))
    f.close()


if __name__ == '__main__':
    main()
