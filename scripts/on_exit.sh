#!/bin/bash

set -e

if [ -t 0 ]; then
  echo "Press Enter to leave..."
  read -r
else
  echo "Running automatically, leaving..."
fi

exit 0
