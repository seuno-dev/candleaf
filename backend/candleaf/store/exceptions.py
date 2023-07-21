from rest_framework import status
from rest_framework.exceptions import APIException


class QuantityError(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "Quantity is more than the product's inventory"
