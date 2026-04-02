'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { apiFetch } from '@/lib/api';

type Appointment = { id: string; scheduledAt: string; status: string; notes?: string };

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    apiFetch('/api/v1/appointments').then((data) => setAppointments(data.data ?? [])).catch(() => undefined);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active="/agenda" />
      <main className="content">
        <Topbar title="Agenda" subtitle="Consultas, confirmações e atendimentos" />
        <section className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Status</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.scheduledAt).toLocaleString('pt-BR')}</td>
                  <td><span className="badge">{appointment.status}</span></td>
                  <td>{appointment.notes || 'Sem notas'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
