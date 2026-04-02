export type LeadStatus = 'interessado' | 'avaliacao_agendada' | 'orcamento_pendente' | 'cliente_ativo' | 'perdido';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'compareceu' | 'faltou' | 'cancelado';

export interface LeadInput {
  nome: string;
  telefone: string;
  source_channel: string;
  procedure_interest: string;
  goal: string;
  urgency: string;
}

export interface LeadRecord extends LeadInput {
  id: string;
  status: LeadStatus;
  assigned_to_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientRecord {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  cpf?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentRecord {
  id: string;
  patient_id: string;
  lead_id?: string;
  professional_id?: string;
  service_name?: string;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}
