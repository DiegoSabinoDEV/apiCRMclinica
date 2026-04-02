# Harmonny CRM Backend MVP

Backend inicial do CRM da Harmonny, pronto para conectar a landing, n8n e Evolution API.

## O que já existe
- Health check.
- Autenticação por JWT e perfis de acesso.
- Rotas de leads, pacientes, serviços, agenda, prontuário, estoque e financeiro.
- Rotas de fotos clínicas antes/depois.
- Webhook para receber a landing.
- Validação com Zod.
- Prisma com PostgreSQL.

## Como rodar
1. `npm install`
2. Copie `.env.example` para `.env`
3. `npm run dev`
4. `npm run prisma:generate`
5. `npm run prisma:seed`

## Infra local
- `docker compose up -d` para subir Postgres e Redis.

## Perfis de acesso
- `admin`
- `secretaria`
- `profissional`
- `financeiro`
- `gestor`

## Endpoints
- `GET /health`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/login`
- `POST /api/v1/leads`
- `GET /api/v1/leads`
- `POST /api/v1/patients`
- `GET /api/v1/patients`
- `GET /api/v1/patients/:patientId`
- `POST /api/v1/services`
- `GET /api/v1/services`
- `POST /api/v1/appointments`
- `GET /api/v1/appointments`
- `POST /api/v1/photos/before-after`
- `GET /api/v1/patients/:patientId/photos`
- `POST /api/v1/webhooks/landing`
- `POST /api/v1/webhooks/evolution`

## Frontend integration
- Defina `window.HARMONNY_API_BASE_URL` no front para apontar para este backend em produção.
- Se o front e o API estiverem no mesmo domínio, o valor pode ser omitido.

## Próximo passo
Ligar as tabelas do banco às automações do n8n e evoluir as telas do CRM.
