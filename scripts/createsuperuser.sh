#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR/..

OS=$(uname -s)

CMD="docker exec -it school-secretary-api"
EXECUTION="uv run python manage.py createsuperuser"

if [[ "$OS" == "MINGW"* || "$OS" == "CYGWIN"* || "$OS" == "MSYS"* ]]; then
    CMD="winpty $CMD"
fi

$CMD $EXECUTION

echo "User created"
