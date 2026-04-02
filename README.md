# Harmonny Clinic CRM

Sistema de aquisição, atendimento e fidelização para a Harmonny Clínica de Estética Avançada.

## Visão Executiva

O projeto foi desenhado para operar a clínica como um funil único: captação, triagem, agendamento, prontuário 360°, fotos clínicas, consentimentos, estoque, financeiro e recorrência.

### Canais
- `www.clinicaharmonny.com.br` para a landing institucional.
- `crm.clinicaharmonny.com.br` para o CRM operacional.
- `api.crm.clinicaharmonny.com.br` para a API do CRM.

## Componentes

- `crm-frontend`: interface do CRM em Next.js.
- `crm-backend`: API em Fastify + Prisma.
- `n8n`: workflows de automação.
- `docs`: documentação executiva e técnica.
- `scripts`: backup e restore do banco.

## O que o CRM faz

- Recebe leads da landing e WhatsApp.
- Qualifica pacientes por objetivo e procedimento.
- Controla agenda, prontuário e fotos clínicas.
- Registra consentimentos e históricos.
- Monitora estoque e alertas de retoque.
- Centraliza financeiro e pagamentos.
- Prepara automações de recorrência.

## Stack

- Frontend: Next.js
- Backend: Fastify + TypeScript
- Banco: PostgreSQL
- ORM: Prisma
- Automação: n8n
- WhatsApp: Evolution API

## Deploy

Veja:
- `docs/deploy-hostinger.md`
- `docs/deploy-dominios-hostinger.md`

## Operação

- `docs/checklist-lancamento.md`
- `docs/teste-manual-aceite.md`
- `scripts/README.md`

## Status

O projeto está pronto para seguir para publicação em VPS e evolução por fases.
