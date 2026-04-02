"use client";

import { HarmonnyLogo } from './HarmonnyLogo';

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="topbar">
      <div className="brand">
        <HarmonnyLogo />
        <div>
          <div className="eyebrow">Harmonny Clinic CRM</div>
          <strong>{title}</strong>
          <div className="muted">{subtitle}</div>
        </div>
      </div>
      <button
        className="btn btn-secondary"
        onClick={() => {
          if (typeof window !== 'undefined') window.localStorage.removeItem('harmonny_token');
          window.location.href = '/';
        }}
      >
        Sair
      </button>
    </header>
  );
}
