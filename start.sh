#!/bin/sh

set -e

echo "---Starting Containers---"
docker compose up -d --wait

echo "---Showing Logs---"
docker compose logs -f

echo "---All Services are up and healthy---"