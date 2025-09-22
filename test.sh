#!/bin/sh

echo "---Building---"
docker compose -f compose.test.yaml build
echo "---Running---"
docker compose -f compose.test.yaml up -d

echo "---Waiting---"
sleep 10

echo "---Testing API---"
docker compose -f compose.test.yaml exec -T api python manage.py test
echo "---Testing APP---"
docker compose -f compose.test.yaml exec -T app npm run test

echo "---Stopping and Removing---"
docker compose -f compose.test.yaml down -v