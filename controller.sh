#!/bin/bash

if [ -z "$1" ]; then
  echo "At least one argument is required."
  exit 1
fi

SCRIPT_DIR="$(dirname "$(realpath "$0")")/scripts"
SCRIPT="$1.sh"

SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT"

if [ ! -f "$SCRIPT_PATH" ]; then
  echo "'$SCRIPT' not found in 'scripts/'."
  exit 1
fi

CMD="$SCRIPT_PATH"

OS=$(uname -s)
if [[ "$OS" == "MINGW"* || "$OS" == "CYGWIN"* || "$OS" == "MSYS"* ]]; then
    CMD="winpty $CMD"
fi

chmod +x "$SCRIPT_PATH"
echo "Executing $SCRIPT..."
"$CMD"

chmod +x "$SCRIPT_DIR/on_exit.sh"
"$SCRIPT_DIR/on_exit.sh"

exit 0
