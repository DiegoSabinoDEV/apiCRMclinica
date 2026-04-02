# Checklist de Lançamento - CRM Harmonny

## Antes de publicar
- Confirmar domínio `www.clinicaharmonny.com.br`.
- Confirmar subdomínio `crm.clinicaharmonny.com.br`.
- Confirmar API em `api.crm.clinicaharmonny.com.br`.
- Validar SSL nos três domínios.
- Validar `.env` de produção no backend e frontend.
- Rodar `prisma generate` e `prisma migrate deploy`.
- Rodar seed do admin e serviços.
- Confirmar `NEXT_PUBLIC_API_BASE_URL` apontando para a API.

## Testes de aceite
- Login entra com usuário seedado.
- Dashboard carrega leads, pacientes, agenda e alertas.
- Criar lead pela landing salva no CRM.
- Criar paciente manualmente funciona.
- Abrir prontuário 360 do paciente funciona.
- Salvar anamnese funciona.
- Upload de imagem clínica funciona.
- Registrar consentimento funciona.
- Busca global retorna resultados.
- Alertas de retoque aparecem.
- Webhook da Evolution registra lead.

## Após publicar
- Conferir logs do PM2.
- Conferir backups do banco.
- Conferir resposta do webhook do n8n.
- Conferir acesso em mobile e tablet.
- Conferir se a landing redireciona para o CRM correto.
