'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { apiFetch } from '@/lib/api';

type Patient = { id: string; fullName: string; phone: string; email?: string; notes?: string; createdAt: string };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', notes: '' });

  async function loadPatients() {
    const data = await apiFetch('/api/v1/patients');
    setPatients(data.data ?? []);
  }

  useEffect(() => {
    loadPatients().catch(() => undefined);
  }, []);

  async function createPatient() {
    await apiFetch('/api/v1/patients', {
      method: 'POST',
      body: JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || undefined,
        notes: form.notes || undefined,
      }),
    });

    setForm({ fullName: '', phone: '', email: '', notes: '' });
    await loadPatients();
  }

  return (
    <div className="app-shell">
      <Sidebar active="/pacientes" />
      <main className="content">
        <Topbar title="Pacientes" subtitle="Prontuário 360° e histórico clínico" />
        <section className="section panel">
          <div className="section-header">
            <div>
              <div className="eyebrow">Novo paciente</div>
              <h2>Cadastro rápido</h2>
            </div>
            <button className="btn btn-primary" onClick={createPatient}>
              Salvar paciente
            </button>
          </div>
          <div className="form-row">
            <label className="field">
              <span>Nome completo</span>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </label>
            <label className="field">
              <span>WhatsApp</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="field">
              <span>Email</span>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="field">
              <span>Observações</span>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
          </div>
        </section>
        <section className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td><Link href={`/pacientes/${patient.id}`}>{patient.fullName}</Link></td>
                  <td>{patient.phone}</td>
                  <td>{patient.notes || 'Sem observações'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
