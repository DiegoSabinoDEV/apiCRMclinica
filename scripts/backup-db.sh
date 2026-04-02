#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
FILE="$BACKUP_DIR/harmonny-crm-$TIMESTAMP.sql"

: "${DATABASE_URL:?DATABASE_URL não definido}"

pg_dump "$DATABASE_URL" > "$FILE"
echo "Backup criado em $FILE"
