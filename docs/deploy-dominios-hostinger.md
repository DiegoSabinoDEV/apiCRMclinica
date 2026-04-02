# Deploy com dominio principal e subdominio

## Dominios
- Site institucional: `www.clinicaharmonny.com.br`
- CRM: `crm.clinicaharmonny.com.br`

## Estrutura recomendada
- `www.clinicaharmonny.com.br` aponta para a landing page.
- `crm.clinicaharmonny.com.br` aponta para o frontend Next.js do CRM.
- API do CRM roda em outro processo/porta no mesmo VPS ou em outro host dedicado.

## DNS na Hostinger

### Registros sugeridos
- `A` `@` -> IP do servidor da landing ou VPS
- `A` `www` -> IP do servidor da landing ou VPS
- `A` `crm` -> IP do VPS do CRM

Se a landing e o CRM estiverem no mesmo VPS, os três podem apontar para o mesmo IP.

## SSL
- Ative SSL para `www.clinicaharmonny.com.br` e `crm.clinicaharmonny.com.br`.
- Se usar Nginx, gere certificados com Let's Encrypt.

## Hostinger VPS

### Processo 1: API do CRM
- Porta sugerida: `3001`
- Processo: `harmonny-crm`

### Processo 2: Frontend do CRM
- Porta sugerida: `3000`
- Processo: `harmonny-crm-frontend`

### Processo 3: Landing institucional
- Pode ficar estática no mesmo VPS ou em hosting separado.

## Nginx - exemplo
```nginx
server {
  server_name crm.clinicaharmonny.com.br;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

server {
  server_name api.crm.clinicaharmonny.com.br;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Variáveis de ambiente finais

### Frontend CRM
- `NEXT_PUBLIC_API_BASE_URL=https://api.crm.clinicaharmonny.com.br`

### Backend CRM
- `PORT=3001`
- `DATABASE_URL=...`
- `JWT_SECRET=...`
- `EVOLUTION_API_URL=...`
- `EVOLUTION_INSTANCE=...`
- `EVOLUTION_API_KEY=...`

## Ordem de implantação
1. Apontar DNS.
2. Subir API no VPS.
3. Subir frontend Next.js.
4. Configurar Nginx.
5. Emitir SSL.
6. Testar login, dashboard e formulários.

## Observação
Se você quiser simplificar, pode deixar a API em um subdomínio separado e o frontend do CRM em `crm.clinicaharmonny.com.br`.
