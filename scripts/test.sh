#!/bin/sh

set -e

cleanup() {
    echo "---Stopping and Removing Containers---"
    docker compose -f compose.test.yaml down -v
}

on_success() {
    echo "---Showing Logs---"
    docker compose -f compose.test.yaml logs
    echo "---All tests finished successfully!---"
}

on_failure() {
    echo "---Showing Logs (Failure)---"
    docker compose -f compose.test.yaml logs
    echo "---Something Went Wrong---"
}

trap cleanup EXIT
trap on_failure ERR

echo "---Cleaning Test Containers---"
docker compose -f compose.test.yaml down -v || true

echo "---Building Containers---"
docker compose -f compose.test.yaml build

echo "---Running and Waiting for Services to be Healthy---"
docker compose -f compose.test.yaml up -d --wait

echo "---Testing API---"
docker compose -f compose.test.yaml exec -T api uv run python manage.py test

echo "---Testing APP---"
docker compose -f compose.test.yaml exec -T app npm run test

on_success