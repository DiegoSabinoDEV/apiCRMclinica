# CRM Harmonny - Contrato de API

## 1. Padrão
- Base URL: `/api/v1`
- Formato: JSON
- Autenticação: JWT + RBAC
- Webhooks: assinatura HMAC

## 2. Endpoints principais

### Autenticação
- `GET /auth/me`
- `POST /auth/login`

### Leads
- `POST /leads`
- `GET /leads`
- `GET /leads/:id`
- `PATCH /leads/:id/status`
- `PATCH /leads/:id/assign`

### Pacientes
- `POST /patients`
- `GET /patients`
- `GET /patients/:id`
- `PATCH /patients/:id`

### Prontuário e fotos
- `POST /consultations`
- `GET /patients/:patientId/consultations`
- `POST /photos/before-after`
- `GET /patients/:patientId/photos`

### Serviços
- `GET /services`
- `POST /services`

### Agenda
- `POST /appointments`
- `GET /appointments`
- `PATCH /appointments/:id`
- `POST /appointments/:id/confirm`

### Prontuário
- `POST /consultations`
- `GET /patients/:id/consultations`
- `POST /procedures`
- `GET /patients/:id/procedures`

### Fotos clínicas
- `POST /photos/before-after`
- `GET /patients/:id/photos`

### Estoque
- `POST /inventory/movements`
- `GET /inventory/items`
- `GET /inventory/alerts`

### Financeiro
- `POST /invoices`
- `POST /payments`
- `GET /patients/:id/financial`

### Integrações
- `POST /webhooks/evolution`
- `POST /webhooks/google-calendar`
- `POST /webhooks/payment-gateway`

## 3. Payloads essenciais

### Criar lead
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

### Registrar procedimento
```json
{
  "patient_id": "uuid",
  "service_id": "uuid",
  "professional_id": "uuid",
  "performed_at": "2026-04-02T12:00:00Z",
  "dosage": {
    "toxina_unidades": 48,
    "areas": ["fronte", "glabela"]
  }
}
```

### Registrar pagamento
```json
{
  "invoice_id": "uuid",
  "amount": 350,
  "method": "pix",
  "gateway_transaction_id": "tx_123"
}
```

## 4. Regras de integração
- Toda origem de lead deve gerar `source_channel`.
- Todo procedimento realizado deve disparar baixa de estoque.
- Todo pagamento deve atualizar o status da fatura.
- Todo procedimento elegível deve gerar alerta de recorrência.
