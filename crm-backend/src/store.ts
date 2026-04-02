import { randomUUID } from 'node:crypto';
import type { AppointmentRecord, LeadInput, LeadRecord, PatientRecord } from './types.js';

const now = () => new Date().toISOString();

export const db = {
  leads: [] as LeadRecord[],
  patients: [] as PatientRecord[],
  appointments: [] as AppointmentRecord[],
};

export function createLead(input: LeadInput): LeadRecord {
  const lead: LeadRecord = {
    id: randomUUID(),
    ...input,
    status: 'interessado',
    created_at: now(),
    updated_at: now(),
  };

  db.leads.unshift(lead);
  return lead;
}

export function listLeads() {
  return db.leads;
}

export function createPatient(input: { full_name: string; phone: string; email?: string; cpf?: string; notes?: string; }) {
  const patient: PatientRecord = {
    id: randomUUID(),
    full_name: input.full_name,
    phone: input.phone,
    email: input.email,
    cpf: input.cpf,
    notes: input.notes,
    created_at: now(),
    updated_at: now(),
  };

  db.patients.unshift(patient);
  return patient;
}

export function listPatients() {
  return db.patients;
}

export function createAppointment(input: Omit<AppointmentRecord, 'id' | 'created_at' | 'updated_at'>) {
  const appointment: AppointmentRecord = {
    id: randomUUID(),
    ...input,
    created_at: now(),
    updated_at: now(),
  };

  db.appointments.unshift(appointment);
  return appointment;
}

export function listAppointments() {
  return db.appointments;
}
