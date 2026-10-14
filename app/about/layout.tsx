import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Finding Farmers',
  description: 'Why Finding Farmers is building a human-accountable crop intelligence layer for Bihar.',
  openGraph: { title: 'About Finding Farmers', description: 'The last mile is the whole problem.' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) { return children; }
