#!/bin/sh

set -e

echo "--- Executing API entrypoint ---"
echo "--- Collecting static files ---"
uv run python manage.py collectstatic --noinput

echo "--- Making migrations ---"
uv run python manage.py makemigrations

echo "--- Migrating ---"
uv run python manage.py migrate

echo "--- Running API with gunicorn ---"
uv run gunicorn School-Secretary.wsgi:application --bind 0.0.0.0:8000