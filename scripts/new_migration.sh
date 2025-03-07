#!/bin/bash

# Scripts folder
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source "$SCRIPT_DIR/colors.sh"

# Check if a migration name was provided
if [ $# -eq 0 ]; then
  echo "${RED}${BOLD}Error: Please provide a migration name${RESET}"
  echo "${YELLOW}Usage: $0 ${MAGENTA}${BOLD}<migration_name>${RESET}"
  echo ""
  exit 1
fi

# Get the migration name from the first argument
MIGRATION_NAME=$1

# Format the timestamp for the filename
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Create the filename with timestamp and migration name
FILENAME="${TIMESTAMP}_${MIGRATION_NAME}.sql"

# Path to migrations directory
MIGRATIONS_DIR="./database/migrations"

# Create the migration file
FILEPATH="$MIGRATIONS_DIR/$FILENAME"
touch $FILEPATH

echo "${GREEN}${BOLD}Created new migration file:${RESET}${GREEN} $FILEPATH${RESET}"
echo "-- Created at: $(date)" >> $FILEPATH
echo "" >> $FILEPATH
echo ""


