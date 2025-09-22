#!/bin/sh

docker compose -f compose.test.yaml build
docker compose -f compose.test.yaml up -d

sleep 10

docker compose -f compose.test.yaml exec -T api python manage.py test
docker compose -f compose.test.yaml exec -T app npm run test

docker compose -f compose.test.yaml down