import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from './client-layout';

export const metadata: Metadata = {
  title: 'Sticky Discipline',
  description: 'Build discipline one sticky note at a time',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
