'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { apiFetch } from '@/lib/api';

type Lead = { id: string; contactName: string; contactPhone: string; sourceChannel: string; procedureInterest: string; goal: string; urgency: string; status: string };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    apiFetch('/api/v1/leads').then((data) => setLeads(data.data ?? [])).catch(() => undefined);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar active="/leads" />
      <main className="content">
        <Topbar title="Leads" subtitle="Triagem e acompanhamento comercial" />
        <section className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Contato</th>
                <th>Canal</th>
                <th>Procedimento</th>
                <th>Objetivo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.contactName}<br /><span className="muted">{lead.contactPhone}</span></td>
                  <td>{lead.sourceChannel}</td>
                  <td>{lead.procedureInterest}</td>
                  <td>{lead.goal}</td>
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
