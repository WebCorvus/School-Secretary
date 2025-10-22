#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR/..

cp ./api/.env.example ./api/.env
cp ./app/.env.example ./app/.env
cp ./db/.env.example ./db/.env
cp ./proxy/.env.example ./proxy/.env

echo "Files generated"