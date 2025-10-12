#!/bin/bash

set -e

cp ./api/.env.example ./api/.env
cp ./app/.env.example ./app/.env
cp ./db/.env.example ./db/.env
cp ./proxy/.env.example ./proxy/.env

echo "Files generated"