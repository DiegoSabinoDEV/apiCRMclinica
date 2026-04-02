# CRM Harmonny - Documento Técnico

## 1. Objetivo
Projetar um CRM personalizado para a Harmonny Clínica de Estética Avançada, integrando captação, triagem, agendamento, prontuário 360°, estoque, financeiro, comissionamento, recorrência e BI.

O sistema deve apoiar venda consultiva, fidelização e operação clínica com foco em estética de alto valor.

## 2. Princípios de Produto
- Um único cadastro central por paciente.
- Captura automática de leads de mídia paga, WhatsApp e Instagram.
- Jornada orientada a conversão e retenção.
- Operação rápida em tablet durante atendimento.
- Automação primeiro, preenchimento manual mínimo.
- LGPD, trilha de auditoria e consentimentos desde o início.

## 3. Arquitetura da Informação

### 3.1 Módulos principais
- Dashboard executivo.
- Leads e funil comercial.
- Agenda e confirmações.
- Pacientes e prontuário 360°.
- Procedimentos e planos de tratamento.
- Galeria clínica de antes e depois.
- Estoque e insumos.
- Financeiro e faturamento.
- Automação e recorrência.
- BI e relatórios.
- Configurações e permissões.

### 3.2 Jornada do usuário
1. Lead entra pela landing, WhatsApp ou Instagram.
2. Assistente faz triagem e qualifica.
3. CRM cria lead e sugere próximo passo.
4. Secretária agenda avaliação.
5. Paciente vira cadastro único.
6. Avaliação gera plano, orçamento e histórico.
7. Procedimento baixa estoque e registra comissão.
8. Sistema agenda retorno e retoque.

## 4. Fluxos Principais

### 4.1 Captação e triagem
- Origem: Meta Ads, Instagram, WhatsApp, site, indicação.
- Dados mínimos: nome, telefone, procedimento, objetivo, urgência.
- Saída: lead qualificado, parcialmente qualificado ou inválido.
- Automação: criar lead, atribuir responsável e notificar equipe.

### 4.2 Agendamento
- Secretária visualiza lead qualificado.
- Sugere horários disponíveis.
- Confirmação enviada por WhatsApp e e-mail.
- Evento criado no Google Calendar.

### 4.3 Atendimento clínico
- Profissional acessa ficha do paciente em tablet.
- Consulta anamnese, histórico, fotos e procedimentos anteriores.
- Registra dosimetria, lote, observações e consentimentos.

### 4.4 Pós-atendimento e recorrência
- Sistema calcula janela de retoque.
- Gera tarefa para equipe comercial.
- Envia lembrete automático ao paciente.

### 4.5 Financeiro
- Venda pode ser à vista, parcelada ou recorrente.
- Cada pagamento vincula-se ao paciente, procedimento e profissional.
- Comissão calculada por regra configurável.

## 5. Modelo de Dados SQL

### 5.1 Entidades centrais

#### patients
- `id` PK
- `full_name`
- `cpf` nullable
- `birth_date` nullable
- `gender` nullable
- `phone`
- `email` nullable
- `document_url` nullable
- `created_at`
- `updated_at`

#### leads
- `id` PK
- `patient_id` FK nullable
- `source_channel`
- `origin_campaign`
- `status` enum: `interessado`, `avaliacao_agendada`, `orcamento_pendente`, `cliente_ativo`, `perdido`
- `procedure_interest`
- `goal`
- `urgency`
- `assigned_to_user_id` FK
- `created_at`
- `updated_at`

#### appointments
- `id` PK
- `patient_id` FK
- `lead_id` FK nullable
- `professional_id` FK
- `service_id` FK nullable
- `scheduled_at`
- `status` enum: `agendado`, `confirmado`, `compareceu`, `faltou`, `cancelado`
- `notes`
- `google_calendar_event_id` nullable

#### consultations
- `id` PK
- `patient_id` FK
- `appointment_id` FK nullable
- `professional_id` FK
- `anamnesis_json` jsonb
- `clinical_notes` text
- `recommended_plan` text
- `created_at`

#### procedures
- `id` PK
- `patient_id` FK
- `appointment_id` FK nullable
- `professional_id` FK
- `service_id` FK
- `performed_at`
- `dosage_json` jsonb
- `anatomical_area` nullable
- `status` enum: `realizado`, `pendente`, `cancelado`

#### before_after_photos
- `id` PK
- `patient_id` FK
- `procedure_id` FK nullable
- `taken_at`
- `photo_type` enum: `before`, `after`
- `file_url`
- `tags` jsonb

#### services
- `id` PK
- `name`
- `category`
- `duration_minutes`
- `retouch_days_min` nullable
- `retouch_days_max` nullable
- `price_base`
- `active`

#### inventory_items
- `id` PK
- `name`
- `sku`
- `unit`
- `minimum_stock`
- `current_stock`
- `active`

#### inventory_movements
- `id` PK
- `inventory_item_id` FK
- `procedure_id` FK nullable
- `movement_type` enum: `entrada`, `saida`, `ajuste`, `reserva`
- `quantity`
- `unit_cost` nullable
- `created_at`

#### invoices
- `id` PK
- `patient_id` FK
- `appointment_id` FK nullable
- `total_amount`
- `installments`
- `status` enum: `aberta`, `parcial`, `quitada`, `cancelada`
- `due_date`
- `created_at`

#### payments
- `id` PK
- `invoice_id` FK
- `amount`
- `paid_at`
- `method` enum: `pix`, `cartao`, `boleto`, `dinheiro`, `link_pagamento`
- `gateway_transaction_id` nullable

#### commissions
- `id` PK
- `procedure_id` FK
- `professional_id` FK
- `rule_name`
- `base_amount`
- `rate_percent`
- `commission_amount`
- `status` enum: `prevista`, `aprovada`, `paga`

#### users
- `id` PK
- `name`
- `email`
- `role` enum: `admin`, `secretaria`, `profissional`, `financeiro`, `gestor`
- `active`

#### audit_logs
- `id` PK
- `user_id` FK nullable
- `entity_name`
- `entity_id`
- `action`
- `before_json` jsonb
- `after_json` jsonb
- `created_at`

### 5.2 Relacionamentos essenciais
- `patients 1:N leads`
- `patients 1:N appointments`
- `patients 1:N consultations`
- `patients 1:N procedures`
- `procedures 1:N before_after_photos`
- `services 1:N procedures`
- `procedures 1:N inventory_movements`
- `invoices 1:N payments`
- `users 1:N leads` via responsável comercial
- `users 1:N appointments` via profissional

## 6. Automação e Regras de Negócio

### 6.1 Estoque inteligente
- Cada procedimento possui uma ficha de consumo padrão.
- Ao salvar um procedimento, o sistema gera saídas automáticas de insumos.
- Quando um item atingir mínimo, cria alerta para compras.

### 6.2 Recorrência e LTV
- Botox: alerta entre 120 e 180 dias.
- Bioestimuladores: janela configurável por protocolo.
- Drenagem e limpeza: recorrência comercial por pacote.
- O CRM cria tarefas e campanhas de reativação.

## 7. Integrações Essenciais
- WhatsApp API via Evolution API.
- n8n para orquestração de automações.
- Google Calendar para agenda.
- Gateway de pagamento: Mercado Pago, Pagar.me, Asaas ou Stripe.
- Armazenamento de mídia: S3 compatível.
- E-mail transacional: Resend, SendGrid ou Mailgun.
- BI: Metabase ou Power BI.

## 8. UX para Tablet
- Navegação lateral curta com ícones.
- Botões grandes e estados claros.
- Foco em poucos campos por tela.
- Auto-save em anamnese e evolução clínica.
- Busca rápida por paciente na recepção.
- Modo tela cheia para atendimento.

## 9. Stack Tecnológica Sugerida

### Backend
- Node.js com NestJS ou Fastify.
- PostgreSQL como banco principal.
- Prisma como ORM.
- Redis para filas, cache e automações.

### Frontend
- Next.js.
- Tailwind ou design system próprio premium.
- PWA para uso em tablet.

### Infraestrutura
- Docker.
- AWS, Render ou Railway.
- Storage S3.
- Observabilidade com Sentry e logs estruturados.

### Integração e automação
- n8n como motor de workflow.
- Evolution API para WhatsApp.
- Webhooks com fila e retry.

## 10. BI e Indicadores
- Leads por canal.
- Taxa de agendamento.
- Taxa de comparecimento.
- Conversão por procedimento.
- Ticket médio.
- LTV por paciente.
- Receita por profissional.
- Uso de estoque por procedimento.
- Taxa de retorno/retoque.

## 11. Segurança e LGPD
- Consentimento para imagem e tratamento de dados.
- Controle de acesso por perfil.
- Criptografia em repouso e em trânsito.
- Auditoria de alterações clínicas e financeiras.
- Backup e retenção por política definida.

## 12. MVP Recomendado
1. Leads + triagem + agenda.
2. Cadastro de pacientes + prontuário 360°.
3. Financeiro básico + pagamentos.
4. Estoque por procedimento.
5. Comissões.
6. Automação de recorrência.
7. BI inicial.

## 13. Evolução Sugerida
- Integração com IA para triagem e reativação.
- Portal do paciente.
- Assinatura digital de termos.
- Campanhas automáticas por comportamento.
- Previsão de churn e reativação por score.
