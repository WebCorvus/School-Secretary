#!/bin/bash

set -e

if [ -t 0 ]; then
    echo "-----------------------"
    echo "Press Enter to leave..."
    read -r
else
    echo "---------------------------------"
    echo "Running automatically, leaving..."
fi

exit 0
