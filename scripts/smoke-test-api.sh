#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
EMAIL="${EMAIL:-admin@harmonny.com}"
PASSWORD="${PASSWORD:-TroqueEstaSenha123!}"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

step() {
  printf '\n==> %s\n' "$1"
}

fail() {
  printf 'ERRO: %s\n' "$1" >&2
  exit 1
}

step "1/8 - Health check"
health="$(curl -s "$BASE_URL/health")"
printf '%s\n' "$health"

step "2/8 - Login"
login_response="$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
printf '%s\n' "$login_response"
TOKEN="$(printf '%s' "$login_response" | node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(0,'utf8')); process.stdout.write(data.token || '')")"
[ -n "$TOKEN" ] || fail "Token não retornado no login"

AUTH_HEADER=("-H" "Authorization: Bearer $TOKEN")

step "3/8 - Criar lead"
lead_response="$(curl -s -X POST "$BASE_URL/api/v1/leads" \
  "${AUTH_HEADER[@]}" \
  -H 'Content-Type: application/json' \
  -d '{"contactName":"Maria Silva Smoke","contactPhone":"83999999999","sourceChannel":"instagram","procedureInterest":"Botox","goal":"Rejuvenescimento","urgency":"Nesta semana"}')"
printf '%s\n' "$lead_response"

step "4/8 - Criar paciente"
patient_response="$(curl -s -X POST "$BASE_URL/api/v1/patients" \
  "${AUTH_HEADER[@]}" \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Maria Silva Smoke","phone":"83999999999","email":"maria.smoke@example.com","notes":"Teste automatizado"}')"
printf '%s\n' "$patient_response"
PATIENT_ID="$(printf '%s' "$patient_response" | node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync(0,'utf8')); process.stdout.write(data.data?.id || data.id || '')")"
[ -n "$PATIENT_ID" ] || fail "Patient ID não retornado"

step "5/8 - Criar consulta"
consultation_response="$(curl -s -X POST "$BASE_URL/api/v1/consultations" \
  "${AUTH_HEADER[@]}" \
  -H 'Content-Type: application/json' \
  -d "{\"patientId\":\"$PATIENT_ID\",\"anamnesisJson\":{\"alergias\":false,\"gestante\":false},\"clinicalNotes\":\"Teste automatizado\",\"recommendedPlan\":\"Botox frontal\"}")"
printf '%s\n' "$consultation_response"

step "6/8 - Buscar paciente"
patient_detail="$(curl -s "$BASE_URL/api/v1/patients/$PATIENT_ID" "${AUTH_HEADER[@]}")"
printf '%s\n' "$patient_detail"

step "7/8 - Buscar prontuário"
chart_response="$(curl -s "$BASE_URL/api/v1/patients/$PATIENT_ID/consultations" "${AUTH_HEADER[@]}")"
printf '%s\n' "$chart_response"

step "8/8 - Busca global e alertas"
search_response="$(curl -s "$BASE_URL/api/v1/search?q=Maria" "${AUTH_HEADER[@]}")"
alerts_response="$(curl -s "$BASE_URL/api/v1/alerts/retouch" "${AUTH_HEADER[@]}")"
printf 'Busca global: %s\n' "$search_response"
printf 'Alertas: %s\n' "$alerts_response"

printf '\nSmoke test concluído com sucesso.\n'
