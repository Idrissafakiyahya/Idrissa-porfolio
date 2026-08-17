"""
Django settings for portfolio_site project.
"""

import os
from pathlib import Path
from decouple import config
import dj_database_url
import sys

# Compatibility shim: some Python 3.14 + Django combinations raise
# "'super' object has no attribute 'dicts'" when copying template
# contexts. Monkeypatch BaseContext.__copy__ to a safer implementation
# so admin changelists render while we ensure the runtime/Django versions
# are aligned in production. Remove this when you upgrade Django or
# pin the Python runtime to 3.11 on Render.
try:
    if sys.version_info >= (3, 14):
        from django.template.context import BaseContext

        def _basecontext_copy(self):
            # Use __new__ to create instance without calling __init__
            # (avoids issues with RequestContext requiring a 'request' arg)
            from copy import copy as copy_obj
            new_ctx = object.__new__(type(self))
            # Copy the dicts attribute
            new_ctx.dicts = list(self.dicts)
            # Copy other attributes that might exist on subclasses
            for key, value in self.__dict__.items():
                if key != 'dicts':
                    try:
                        setattr(new_ctx, key, copy_obj(value) if hasattr(value, '__iter__') and not isinstance(value, (str, bytes)) else value)
                    except Exception:
                        # If copy fails, just assign the reference
                        setattr(new_ctx, key, value)
            return new_ctx

        BaseContext.__copy__ = _basecontext_copy
except Exception:
    # If Django isn't importable yet or something else fails, skip shim
    pass

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='').strip()
# Ensure SECRET_KEY is never empty
if not SECRET_KEY:
    SECRET_KEY = 'django-insecure-dev-key-change-in-production'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

# ALLOWED_HOSTS with support for environment variable and defaults for local/Render
# Use a leading dot to allow all subdomains (Django accepts '.example.com' for subdomains)
ALLOWED_HOSTS_DEFAULT = 'localhost,127.0.0.1,.onrender.com'
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default=ALLOWED_HOSTS_DEFAULT).split(',')
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS]

# Application definition
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
    'portfolio',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portfolio_site.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio_site.wsgi.application'

# Database
if config('DATABASE_URL', default=None):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(default=config('DATABASE_URL'))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME', default=''),
    'API_KEY': config('CLOUDINARY_API_KEY', default=''),
    'API_SECRET': config('CLOUDINARY_API_SECRET', default=''),
}

if config('CLOUDINARY_CLOUD_NAME', default='') and config('CLOUDINARY_API_KEY', default='') and config('CLOUDINARY_API_SECRET', default=''):
    STORAGES = {
        'default': {
            'BACKEND': 'cloudinary_storage.storage.MediaCloudinaryStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
        },
    }
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
        },
    }

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {},
}

# CORS configuration
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173'
).split(',')
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS]
# Allow the frontend deployed on Vercel; make configurable via env var
VERCEL_ORIGIN = config('VERCEL_ORIGIN', default='https://idrissa-fakiyahya.vercel.app')
if VERCEL_ORIGIN and VERCEL_ORIGIN not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(VERCEL_ORIGIN)

# Allow all Vercel preview/deployment domains (*.vercel.app)
# This covers dynamic preview URLs without needing an env var for each
CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://.*\.vercel\.app$"]

# Email configuration
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@portfolio.local')

# Contact form settings
CONTACT_EMAIL_RECIPIENT = config('CONTACT_EMAIL_RECIPIENT', default='admin@portfolio.local')

# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

JAZZMIN_SETTINGS = {
    "site_title": "Portfolio Admin",
    "site_header": "Portfolio Admin",
    "site_brand": "Idrissa",
    "welcome_sign": "Welcome to the Portfolio Dashboard",
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_models": [],
    "order_with_respect_to": ["auth", "portfolio"],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.group": "fas fa-users",
        "portfolio.profile": "fas fa-id-card",
        "portfolio.skill": "fas fa-code",
        "portfolio.project": "fas fa-project-diagram",
        "portfolio.experience": "fas fa-briefcase",
        "portfolio.education": "fas fa-graduation-cap",
        "portfolio.testimonial": "fas fa-comments",
        "portfolio.contactmessage": "fas fa-envelope",
    },
}

JAZZMIN_UI_TWEAKS = {
    "theme": "darkly",
    "dark_mode_theme": "darkly",
    "navbar": "#0b1f3a",
    "sidebar": "#081a2f",
    "accent": "#ffffff",
    "brand_color": "#ffffff",
    "body_bg": "#0b132b",
    "font_family": "sans-serif",
    "sidebar_text_color": "#ffffff",
    "sidebar_hover_color": "#1f3a5f",
    "secondary": "#dbeafe",
    "primary": "#ffffff",
}


ALLOWED_HOSTS = [
    "idrissa-porfolio-backend.onrender.com",
    "localhost",
    "127.0.0.1",
]