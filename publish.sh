#!/bin/bash
set -e

DOCKER_USERNAME="webcorvus"
IMAGES=(
  "webcorvus/school-secretary-test:latest"
  "webcorvus/school-secretary-proxy:latest"
  "webcorvus/school-secretary-app:latest"
  "webcorvus/school-secretary-api:latest"
)

echo "Subindo containers com Docker Compose..."
sudo docker compose up --build -d

sleep 5

echo "Fazendo login no Docker Hub..."
sudo docker login

for IMAGE in "${IMAGES[@]}"; do
  echo "Publicando $IMAGE no Docker Hub..."
  sudo docker push "$IMAGE"
done

echo "Parando containers..."
sudo docker compose down

echo "Processo concluído com sucesso!"
