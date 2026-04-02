'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { apiFetch } from '@/lib/api';

type Consultation = { id: string; clinicalNotes?: string; recommendedPlan?: string; createdAt: string };
type Photo = { id: string; photoType: 'before' | 'after'; fileUrl: string; tags: string[]; takenAt: string };
type Patient = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  consultations: Consultation[];
  photos: Photo[];
  appointments: { id: string; scheduledAt: string; status: string }[];
};

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultation, setConsultation] = useState({ notes: '', plan: '' });
  const [photo, setPhoto] = useState({ type: 'before' as 'before' | 'after', url: '', tags: '' });

  async function loadPatient() {
    const response = await apiFetch(`/api/v1/patients/${params.id}`);
    setPatient(response.data ?? null);
  }

  useEffect(() => {
    loadPatient().catch(() => router.push('/pacientes'));
  }, [params.id]);

  async function saveConsultation() {
    await apiFetch('/api/v1/consultations', {
      method: 'POST',
      body: JSON.stringify({
        patientId: params.id,
        anamnesisJson: { origem: 'crm', revisadoEm: new Date().toISOString() },
        clinicalNotes: consultation.notes,
        recommendedPlan: consultation.plan,
      }),
    });
    setConsultation({ notes: '', plan: '' });
    await loadPatient();
  }

  async function savePhoto() {
    await apiFetch('/api/v1/photos/before-after', {
      method: 'POST',
      body: JSON.stringify({
        patientId: params.id,
        photoType: photo.type,
        fileUrl: photo.url,
        tags: photo.tags.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    });
    setPhoto({ type: 'before', url: '', tags: '' });
    await loadPatient();
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="app-shell">
      <Sidebar active="/pacientes" />
      <main className="content">
        <Topbar title={patient.fullName} subtitle="Prontuário 360°, evolução clínica e fotos" />

        <section className="grid-4">
          <div className="card metric"><span className="eyebrow">Contato</span><strong>{patient.phone}</strong><span>WhatsApp do paciente</span></div>
          <div className="card metric"><span className="eyebrow">Consultas</span><strong>{patient.consultations.length}</strong><span>Histórico clínico</span></div>
          <div className="card metric"><span className="eyebrow">Fotos</span><strong>{patient.photos.length}</strong><span>Antes e depois</span></div>
          <div className="card metric"><span className="eyebrow">Agenda</span><strong>{patient.appointments.length}</strong><span>Compromissos vinculados</span></div>
        </section>

        <section className="section panel">
          <div className="section-header">
            <div>
              <div className="eyebrow">Anamnese</div>
              <h2>Novo registro clínico</h2>
            </div>
            <button className="btn btn-primary" onClick={saveConsultation}>Salvar anamnese</button>
          </div>
          <div className="form-row">
            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Notas clínicas</span>
              <textarea rows={4} value={consultation.notes} onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })} />
            </label>
            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Plano recomendado</span>
              <textarea rows={3} value={consultation.plan} onChange={(e) => setConsultation({ ...consultation, plan: e.target.value })} />
            </label>
          </div>
        </section>

        <section className="section panel">
          <div className="section-header">
            <div>
              <div className="eyebrow">Fotos clínicas</div>
              <h2>Antes e depois</h2>
            </div>
            <button className="btn btn-primary" onClick={savePhoto}>Salvar foto</button>
          </div>
          <div className="form-row">
            <label className="field">
              <span>Tipo</span>
              <select value={photo.type} onChange={(e) => setPhoto({ ...photo, type: e.target.value as 'before' | 'after' })}>
                <option value="before">Antes</option>
                <option value="after">Depois</option>
              </select>
            </label>
            <label className="field">
              <span>URL da imagem</span>
              <input value={photo.url} onChange={(e) => setPhoto({ ...photo, url: e.target.value })} />
            </label>
            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Tags</span>
              <input value={photo.tags} onChange={(e) => setPhoto({ ...photo, tags: e.target.value })} placeholder="ex: botox, testa, frontal" />
            </label>
          </div>
        </section>

        <section className="section table-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Linha do tempo</div>
              <h2>Consultas recentes</h2>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Notas</th>
                <th>Plano</th>
              </tr>
            </thead>
            <tbody>
              {patient.consultations.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleString('pt-BR')}</td>
                  <td>{item.clinicalNotes || 'Sem notas'}</td>
                  <td>{item.recommendedPlan || 'Sem plano'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="section table-card">
          <div className="section-header">
            <div>
              <div className="eyebrow">Galeria</div>
              <h2>Fotos registradas</h2>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Tags</th>
                <th>Arquivo</th>
              </tr>
            </thead>
            <tbody>
              {patient.photos.map((item) => (
                <tr key={item.id}>
                  <td><span className="badge">{item.photoType}</span></td>
                  <td>{item.tags.join(', ')}</td>
                  <td>{item.fileUrl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
