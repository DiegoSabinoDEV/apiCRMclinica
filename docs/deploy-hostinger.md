# Deploy Harmonny na Hostinger

## 1. O que hospedar onde

### Opção recomendada
- `crm-frontend` em Hostinger VPS ou outro Node host.
- `crm-backend` em Hostinger VPS, Render, Railway ou similar.
- Landing estática pode ficar em qualquer hospedagem simples.

### Se usar Hostinger compartilhada
- Use apenas para a landing estática/exportada.
- Node, Prisma e Fastify não rodam bem em shared hosting.

## 2. Variáveis de ambiente

### Backend
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `EVOLUTION_API_URL`
- `EVOLUTION_INSTANCE`
- `EVOLUTION_API_KEY`

### Frontend
- `NEXT_PUBLIC_API_BASE_URL`

## 3. Backend

1. Instale dependências.
2. Configure `.env`.
3. Rode `prisma generate`.
4. Rode `prisma migrate deploy`.
5. Execute o seed.
6. Inicie com `npm run start`.

### Com PM2
```bash
npm install -g pm2
pm2 start dist/server.js --name harmonny-crm
pm2 save
pm2 startup
```

## 4. Frontend Next.js

1. Instale dependências.
2. Configure `.env.local`.
3. Rode `npm run build`.
4. Inicie com `npm run start`.

### Com PM2
```bash
pm2 start npm --name harmonny-crm-frontend -- start
```

## 5. Banco de dados

- Use PostgreSQL gerenciado ou o banco do VPS.
- Execute migrations antes do primeiro acesso.
- Faça backup diário.

## 6. Upload de imagens

- O upload local grava em `uploads/` do backend.
- Em produção, prefira storage persistente ou S3 compatível.
- Se usar VPS, monte volume persistente para não perder arquivos.

## 7. Debug rápido

### 500 no login
- Verifique `JWT_SECRET`, `DATABASE_URL` e usuário seedado.

### Tela sem dados
- Verifique `NEXT_PUBLIC_API_BASE_URL` e CORS.

### Upload falhando
- Confirme `@fastify/multipart`, permissão de pasta e limite de arquivo.

### Prisma com erro
- Rode `prisma generate` e confirme o schema aplicado no banco.

### WhatsApp/Evolution sem envio
- Confirme `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE` e `EVOLUTION_API_KEY`.

## 8. Checklist final

- Login funcionando.
- Dashboard carregando dados.
- Leads e pacientes persistindo.
- Fotos e consentimentos registrando.
- Alertas de retoque aparecendo.
- Busca global retornando resultados.
