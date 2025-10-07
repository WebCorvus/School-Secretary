#!/bin/sh
set -e

uv run python manage.py collectstatic --noinput
uv run python manage.py makemigrations
uv run python manage.py migrate
uv run gunicorn School-Secretary.wsgi:application --bind 0.0.0.0:8000