#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR

echo "--- Executing API code fix ---"
uv run ruff format .

echo "--- Executing API tests ---"
uv run ruff check --fix .