#!/bin/sh

docker compose -f compose.test.yaml exec -T api python manage.py test
docker compose -f compose.test.yaml exec -T app npm run test
