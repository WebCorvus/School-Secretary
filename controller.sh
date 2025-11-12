#!/bin/bash

if [ -z "$1" ]; then
  echo "At least one argument is required."
  exit 1
fi

NO_CONFIRM=false
SCRIPT_NAME=""

for arg in "$@"; do
  if [ "$arg" == "--no-confirm" ]; then
    NO_CONFIRM=true
  else
    SCRIPT_NAME="$arg"
  fi
done

if [ -z "$SCRIPT_NAME" ]; then
  echo "Script name is required."
  exit 1
fi

SCRIPT_DIR="$(dirname "$(realpath "$0")")/scripts"
SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_NAME.sh"

if [ ! -f "$SCRIPT_PATH" ]; then
  echo "'$SCRIPT_NAME.sh' not found in 'scripts/'."
  exit 1
fi


echo "---------------------"
echo "Executing $SCRIPT_NAME..."

chmod +x "$SCRIPT_PATH"
OS=$(uname -s)
if [[ "$OS" == "MINGW"* || "$OS" == "CYGWIN"* || "$OS" == "MSYS"* ]]; then
    winpty bash "$SCRIPT_PATH"
else
    bash "$SCRIPT_PATH"
fi

if [ "$NO_CONFIRM" = false ]; then
  chmod +x "$SCRIPT_DIR/on_exit.sh"
  "$SCRIPT_DIR/on_exit.sh"
fi

exit 0
