#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "$0")")"

cd $SCRIPT_DIR

echo "--- Executing APP code fix ---"
npm run check:write