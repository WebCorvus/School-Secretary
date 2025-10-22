#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR/..

CMD="docker exec -it school-secretary-api"
EXECUTION="uv run python manage.py createsuperuser"

$CMD $EXECUTION

echo "User created"
