# Roteiro de Teste Manual - CRM Harmonny

## Login
1. Acesse `crm.clinicaharmonny.com.br`.
2. Faça login com a conta seedada.
3. Verifique se o dashboard abre sem erro.

## Leads
1. Envie um lead pela landing.
2. Confirme se ele aparece em `Leads`.
3. Pesquise pelo nome na busca global.

## Pacientes
1. Crie um paciente novo.
2. Abra o prontuário.
3. Registre uma anamnese.
4. Verifique se a linha do tempo atualiza.

## Fotos
1. Faça upload de uma imagem clínica.
2. Registre a foto como antes/depois.
3. Confirme se aparece na galeria do paciente.

## Consentimento
1. Registre um termo de consentimento.
2. Verifique se o registro aparece na aba de consentimentos.

## Alertas
1. Registre um procedimento com serviço com janela de retoque.
2. Confirme se o alerta aparece no dashboard.

## Integração
1. Envie uma mensagem pela Evolution API.
2. Confirme se o lead entra no CRM.
3. Confirme se o n8n recebe o webhook.
