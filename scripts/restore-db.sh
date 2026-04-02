#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: ./restore-db.sh caminho/do/backup.sql"
  exit 1
fi

BACKUP_FILE="$1"
: "${DATABASE_URL:?DATABASE_URL não definido}"

psql "$DATABASE_URL" < "$BACKUP_FILE"
echo "Restore concluído a partir de $BACKUP_FILE"
