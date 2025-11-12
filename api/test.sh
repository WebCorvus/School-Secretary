#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR

echo "--- Executing API code checking ---"
uv run ruff check .

echo "--- Executing API tests ---"
uv run python manage.py test