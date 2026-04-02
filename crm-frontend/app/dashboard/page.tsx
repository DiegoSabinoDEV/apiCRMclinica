'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { MetricCard } from '@/components/MetricCard';
import { apiFetch } from '@/lib/api';

type Lead = { id: string; contactName: string; contactPhone: string; procedureInterest: string; goal: string; urgency: string; status: string; createdAt: string };
type Patient = { id: string; fullName: string; phone: string; createdAt: string };
type Appointment = { id: string; scheduledAt: string; status: string; notes?: string };

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/v1/leads'),
      apiFetch('/api/v1/patients'),
      apiFetch('/api/v1/appointments'),
    ])
      .then(([l, p, a]) => {
        setLeads(l.data ?? []);
        setPatients(p.data ?? []);
        setAppointments(a.data ?? []);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active="/dashboard" />
      <main className="content">
        <Topbar title="Dashboard" subtitle="Visão geral da operação da Harmonny" />
        <section className="grid-4">
          <MetricCard label="Leads" value={leads.length} hint="Captados pela landing e WhatsApp" />
          <MetricCard label="Pacientes" value={patients.length} hint="Base centralizada da clínica" />
          <MetricCard label="Agenda" value={appointments.length} hint="Consultas e procedimentos" />
          <MetricCard label="Conversão" value="--" hint="Adicionar depois com BI" />
        </section>

        <section className="section table-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Funil ativo</div>
              <h2>Leads recentes</h2>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Procedimento</th>
                <th>Objetivo</th>
                <th>Urgência</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.contactName}</td>
                  <td>{lead.procedureInterest}</td>
                  <td>{lead.goal}</td>
                  <td>{lead.urgency}</td>
                  <td><span className="badge">{lead.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
