import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Harmonny CRM',
  description: 'CRM premium para clínica de estética avançada',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
