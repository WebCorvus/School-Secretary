#!/bin/bash

if [ -z "$1" ]; then
  echo "At least one argument is required."
  exit 1
fi

FUNCTION="$1"
SCRIPT_DIR="$(dirname "$(realpath "$0")")/scripts"

if [ ! -f "$SCRIPT_DIR/$FUNCTION.sh" ]; then
  echo "'$FUNCTION.sh' not found in 'scripts'."
  exit 1
fi

chmod +x "$SCRIPT_DIR/$FUNCTION.sh"
echo "Executing $FUNCTION..."
"$SCRIPT_DIR/$FUNCTION.sh"

chmod +x "$SCRIPT_DIR/on_exit.sh"
echo "Executing on_exit..."
"$SCRIPT_DIR/on_exit.sh"

exit 0
