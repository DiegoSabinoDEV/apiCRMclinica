'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { HarmonnyLogo } from '@/components/HarmonnyLogo';
import { API_BASE } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@harmonny.com');
  const [password, setPassword] = useState('TroqueEstaSenha123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Falha no login');

      window.localStorage.setItem('harmonny_token', data.token);
      window.location.href = '/dashboard';
    } catch {
      setError('Não foi possível entrar. Verifique as credenciais e a API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <HarmonnyLogo />
        <p className="eyebrow">Acesso restrito</p>
        <h1>Entrar no CRM Harmonny</h1>
        <p className="muted">Plataforma de gestão clínica, comercial e operacional.</p>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <label className="field">
            <span>Senha</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </label>
          {error ? <div className="badge">{error}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Acessar CRM'}
          </button>
        </form>
      </section>
    </main>
  );
}
