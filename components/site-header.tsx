'use client';

import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/components/language-provider';

const nav = {
  en: [['Weekly guidance', '/guidance'], ['How it works', '/#technology'], ['Model suite', '/#model-suite'], ['About', '/about']],
  hi: [['साप्ताहिक सलाह', '/guidance'], ['यह कैसे काम करता है', '/#technology'], ['मॉडल समूह', '/#model-suite'], ['हमारे बारे में', '/about']],
  bho: [['हफ्तावार सलाह', '/guidance'], ['ई कइसे काम करेला', '/#technology'], ['मॉडल समूह', '/#model-suite'], ['हमार कहानी', '/about']],
} as const;

export function SiteHeader() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="Finding Farmers home">
        <span className="brand-mark"><img src="/brand/finding-farmers-logo.jpg" alt="Women working in an Indian field" /></span>
        <span className="brand-name">FINDING <b>FARMERS</b></span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav[locale].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>

      <div className="header-actions">
        <div className="language-switch" aria-label="Language">
          {(['en', 'hi', 'bho'] as const).map((item) => <button key={item} onClick={() => setLocale(item)} className={locale === item ? 'active' : ''}>{item === 'en' ? 'EN' : item === 'hi' ? 'हि' : 'भो'}</button>)}
        </div>
        <Link href="/guidance" className="header-cta"><span>Week 35</span><ArrowUpRight /></Link>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>

      {open && <nav className="mobile-nav">{nav[locale].map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight /></Link>)}</nav>}
    </header>
  );
}
