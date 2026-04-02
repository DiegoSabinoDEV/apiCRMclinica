# Scripts de Operação

## Backup
```bash
chmod +x scripts/backup-db.sh
DATABASE_URL="..." ./scripts/backup-db.sh
```

## Restore
```bash
chmod +x scripts/restore-db.sh
DATABASE_URL="..." ./scripts/restore-db.sh ./backups/arquivo.sql
```

## Smoke test da API
```bash
chmod +x scripts/smoke-test-api.sh
./scripts/smoke-test-api.sh
```

## Observação
Use os scripts em uma VPS com `pg_dump` e `psql` instalados.
