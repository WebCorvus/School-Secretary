#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR/..

echo "--- Stopping Containers ---"

running=$(docker compose ps -q)
if [ -n "$running" ]; then
    docker compose down
    still_running=$(docker compose ps -q)
    if [ -n "$still_running" ]; then
        echo "--- Warning: Some containers did not stop properly ---"
        docker ps -a
    else
        echo "--- Containers stopped successfully ---"
    fi
else
    echo "--- No running containers found ---"
fi
