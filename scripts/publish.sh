#!/bin/bash
set -e

DOCKER_USERNAME="webcorvus"
IMAGES=(
  "webcorvus/school-secretary-api:latest"
  "webcorvus/school-secretary-app:latest"
  "webcorvus/school-secretary-db:latest"
  "webcorvus/school-secretary-proxy:latest"
)

./scripts/start.sh

sleep 5

echo "Logging on Docker Hub..."
docker login

for IMAGE in "${IMAGES[@]}"; do
  echo "Publishing $IMAGE on Docker Hub..."
  docker push "$IMAGE"
done

echo "Proccess Finished!"
