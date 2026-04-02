'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { MetricCard } from '@/components/MetricCard';
import { apiFetch } from '@/lib/api';

type Lead = { id: string; contactName: string; contactPhone: string; procedureInterest: string; goal: string; urgency: string; status: string; createdAt: string };
type Patient = { id: string; fullName: string; phone: string; createdAt: string };
type Appointment = { id: string; scheduledAt: string; status: string; notes?: string };
type RetouchAlert = { id: string; patientName: string; serviceName: string; performedAt: string; daysSince: number; status: string };
type SearchResults = { leads: Lead[]; patients: Patient[]; appointments: Appointment[] };

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [alerts, setAlerts] = useState<RetouchAlert[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/v1/leads'),
      apiFetch('/api/v1/patients'),
      apiFetch('/api/v1/appointments'),
      apiFetch('/api/v1/alerts/retouch'),
    ])
      .then(([l, p, a, r]) => {
        setLeads(l.data ?? []);
        setPatients(p.data ?? []);
        setAppointments(a.data ?? []);
        setAlerts(r.data ?? []);
      })
      .catch(() => undefined);
  }, []);

  async function runSearch() {
    if (!searchQuery.trim()) return;
    const result = await apiFetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchResults(result.data ?? null);
  }

  return (
    <div className="app-shell">
      <Sidebar active="/dashboard" />
      <main className="content">
        <Topbar title="Dashboard" subtitle="Visão geral da operação da Harmonny" />
        <section className="grid-4">
          <MetricCard label="Leads" value={leads.length} hint="Captados pela landing e WhatsApp" />
          <MetricCard label="Pacientes" value={patients.length} hint="Base centralizada da clínica" />
          <MetricCard label="Agenda" value={appointments.length} hint="Consultas e procedimentos" />
          <MetricCard label="Retoques" value={alerts.length} hint="Alertas automáticos ativos" />
        </section>

        <section className="section panel">
          <div className="section-header">
            <div>
              <div className="eyebrow">Busca global</div>
              <h2>Localize leads, pacientes e atendimentos</h2>
            </div>
            <button className="btn btn-primary" onClick={runSearch}>Pesquisar</button>
          </div>
          <div className="form-row">
            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Termo de busca</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Nome, telefone, procedimento, observação..." />
            </label>
          </div>
          {searchResults ? (
            <div className="grid-4" style={{ marginTop: 16 }}>
              <div className="card metric"><span className="eyebrow">Leads</span><strong>{searchResults.leads.length}</strong><span>Resultados encontrados</span></div>
              <div className="card metric"><span className="eyebrow">Pacientes</span><strong>{searchResults.patients.length}</strong><span>Resultados encontrados</span></div>
              <div className="card metric"><span className="eyebrow">Agenda</span><strong>{searchResults.appointments.length}</strong><span>Resultados encontrados</span></div>
              <div className="card metric"><span className="eyebrow">Acesso rápido</span><strong>OK</strong><span>Base unificada</span></div>
            </div>
          ) : null}
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

        <section className="section table-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Retoques</div>
              <h2>Alertas automáticos</h2>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Serviço</th>
                <th>Dias</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.patientName}</td>
                  <td>{alert.serviceName}</td>
                  <td>{alert.daysSince}</td>
                  <td><span className="badge">{alert.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
