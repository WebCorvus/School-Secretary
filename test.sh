#!/bin/sh

set -e

cleanup() {
    echo "---Stopping and Removing Containers---"
    docker compose -f compose.test.yaml down -v
}

trap cleanup EXIT

echo "---Building Containers---"
docker compose -f compose.test.yaml build

echo "---Running and Waiting for Services to be Healthy---"
docker compose -f compose.test.yaml up -d --wait

echo "---All Services are Healthy. Running Tests---"

echo "---Testing API---"
docker compose -f compose.test.yaml exec -T api python manage.py test

echo "---Testing APP---"
docker compose -f compose.test.yaml exec -T app npm run test

echo "---All tests finished successfully!---"