-- CRM Harmonny - Esquema base PostgreSQL

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin', 'secretaria', 'profissional', 'financeiro', 'gestor')),
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  cpf text unique,
  birth_date date,
  gender text,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  contact_name text not null,
  contact_phone text not null,
  source_channel text not null,
  origin_campaign text,
  status text not null check (status in ('interessado', 'avaliacao_agendada', 'orcamento_pendente', 'cliente_ativo', 'perdido')),
  procedure_interest text,
  goal text,
  urgency text,
  assigned_to_user_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  duration_minutes integer not null default 30,
  retouch_days_min integer,
  retouch_days_max integer,
  price_base numeric(12,2),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  lead_id uuid references leads(id),
  professional_id uuid references users(id),
  service_id uuid references services(id),
  scheduled_at timestamptz not null,
  status text not null check (status in ('agendado', 'confirmado', 'compareceu', 'faltou', 'cancelado')),
  notes text,
  google_calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table consultations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  appointment_id uuid references appointments(id),
  professional_id uuid references users(id),
  anamnesis_json jsonb not null default '{}'::jsonb,
  clinical_notes text,
  recommended_plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table procedures (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  appointment_id uuid references appointments(id),
  professional_id uuid references users(id),
  service_id uuid not null references services(id),
  performed_at timestamptz not null default now(),
  dosage_json jsonb not null default '{}'::jsonb,
  anatomical_area text,
  status text not null check (status in ('realizado', 'pendente', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table before_after_photos (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  procedure_id uuid references procedures(id),
  taken_at timestamptz not null default now(),
  photo_type text not null check (photo_type in ('before', 'after')),
  file_url text not null,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  unit text not null,
  minimum_stock numeric(12,2) not null default 0,
  current_stock numeric(12,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references inventory_items(id),
  procedure_id uuid references procedures(id),
  movement_type text not null check (movement_type in ('entrada', 'saida', 'ajuste', 'reserva')),
  quantity numeric(12,2) not null,
  unit_cost numeric(12,2),
  created_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  appointment_id uuid references appointments(id),
  total_amount numeric(12,2) not null,
  installments integer not null default 1,
  status text not null check (status in ('aberta', 'parcial', 'quitada', 'cancelada')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id),
  amount numeric(12,2) not null,
  paid_at timestamptz not null default now(),
  method text not null check (method in ('pix', 'cartao', 'boleto', 'dinheiro', 'link_pagamento')),
  gateway_transaction_id text,
  created_at timestamptz not null default now()
);

create table consent_forms (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  consent_type text not null,
  signed_at timestamptz,
  file_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  entity_name text not null,
  entity_id uuid not null,
  action text not null,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);
