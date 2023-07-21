# noinspection PyUnresolvedReferences
from .base import *

import os
from datetime import timedelta

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

MEDIA_ROOT = os.path.join(BASE_DIR, 'candleaf', 'media')

SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"] = timedelta(days=30)

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
]

CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = False
