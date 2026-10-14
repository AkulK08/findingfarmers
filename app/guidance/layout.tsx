import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Week 35 Guidance | Finding Farmers',
  description: 'Weekly maize, rice and wheat guidance for Bihar with district-level model signals and explicit confidence.',
  openGraph: { title: 'Week 35 Guidance | Finding Farmers', description: 'Weekly crop intelligence for Bihar.' },
};

export default function GuidanceLayout({ children }: { children: React.ReactNode }) { return children; }
