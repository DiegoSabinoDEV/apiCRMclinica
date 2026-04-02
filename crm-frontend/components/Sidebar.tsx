import Link from 'next/link';
import { HarmonnyLogo } from './HarmonnyLogo';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/agenda', label: 'Agenda' },
];

export function Sidebar({ active }: { active: string }) {
  return (
    <aside className="sidebar">
      <HarmonnyLogo />
      <p className="muted" style={{ color: 'rgba(255,255,255,0.72)' }}>
        CRM premium para clínica de estética
      </p>
      <nav>
        {items.map((item) => (
          <Link key={item.href} className={`nav-link ${active === item.href ? 'active' : ''}`} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
