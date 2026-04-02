# CRM Harmonny - Contrato de API

## Padrão
- Base URL: `/api/v1`
- Formato: JSON
- Autenticação: JWT + RBAC

## Autenticação
- `GET /auth/me`
- `POST /auth/login`

## Leads
- `POST /leads`
- `GET /leads`

## Pacientes
- `POST /patients`
- `GET /patients`
- `GET /patients/:patientId`

## Serviços
- `GET /services`
- `POST /services`

## Agenda
- `POST /appointments`
- `GET /appointments`

## Prontuário
- `POST /consultations`
- `GET /patients/:patientId/consultations`

## Fotos clínicas
- `POST /uploads/image`
- `POST /photos/before-after`
- `GET /patients/:patientId/photos`

## Consentimentos
- `POST /consents`
- `GET /patients/:patientId/consents`

## Busca e alertas
- `GET /search?q=`
- `GET /alerts/retouch`

## Estoque
- `POST /inventory/movements`
- `GET /inventory/items`
- `GET /inventory/alerts`

## Financeiro
- `POST /invoices`
- `POST /payments`
- `GET /patients/:patientId/financial`

## Integrações
- `POST /webhooks/landing`
- `POST /webhooks/evolution`

## Payloads essenciais

### Lead
```json
{
  "contactName": "Maria Silva",
  "contactPhone": "83999999999",
  "sourceChannel": "instagram",
  "procedureInterest": "Botox",
  "goal": "Rejuvenescimento",
  "urgency": "Nesta semana"
}
```

### Consulta
```json
{
  "patientId": "uuid",
  "anamnesisJson": { "alergias": false },
  "clinicalNotes": "Paciente bem, sem intercorrências",
  "recommendedPlan": "Botox frontal e glabela"
}
```

### Consentimento
```json
{
  "patientId": "uuid",
  "consentType": "uso de imagem",
  "fileUrl": "https://.../termo.pdf",
  "metadata": { "signedBy": "Maria Silva" }
}
```

## Regras de integração
- Toda origem de lead deve gerar `sourceChannel`.
- Todo procedimento realizado deve disparar baixa de estoque.
- Todo pagamento deve atualizar o status da fatura.
- Todo procedimento elegível deve gerar alerta de recorrência.
