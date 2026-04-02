'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { apiFetch } from '@/lib/api';

type Patient = { id: string; fullName: string; phone: string; email?: string; notes?: string; createdAt: string };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    apiFetch('/api/v1/patients').then((data) => setPatients(data.data ?? [])).catch(() => undefined);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active="/pacientes" />
      <main className="content">
        <Topbar title="Pacientes" subtitle="Prontuário 360° e histórico clínico" />
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
                  <td>{patient.fullName}</td>
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
