#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR

echo "--- Executing APP tests ---"
npm run test