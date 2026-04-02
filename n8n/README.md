# n8n - Harmonny

## Arquivos
- `harmonny-agent-workflow.json`: workflow de triagem e repasse.
- `harmonny-agent-prompt.md`: prompt do agente para IA.

## Nós do workflow
1. `Receber Lead`: webhook que recebe o payload da landing page.
2. `Normalizar e Qualificar`: padroniza os campos e cria o resumo.
3. `Dados incompletos?`: decide se o lead segue ou precisa de mais dados.
4. `Responder Parcial`: devolve mensagem pedindo o que falta.
5. `Enviar para Evolution`: envia o resumo para a secretária via Evolution API.
6. `Responder Completo`: devolve confirmação ao paciente.

## Payload esperado
```json
{
  "nome": "Maria Silva",
  "telefone": "83999999999",
  "procedimento": "Botox",
  "objetivo": "Rejuvenescimento",
  "urgencia": "Nesta semana",
  "origem": "landing-page"
}
```

## Variáveis de ambiente
- `EVOLUTION_API_URL`
- `EVOLUTION_INSTANCE`
- `EVOLUTION_API_KEY`

## Observação
Os sticky notes no workflow foram deixados para servir de comentário visual dentro do n8n.
