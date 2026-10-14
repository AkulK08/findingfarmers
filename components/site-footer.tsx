'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

const copy = {
  en: ['Crop intelligence, made human.', 'Independent public-data decision support. Not a government portal.'],
  hi: ['फसल बुद्धिमत्ता, इंसानों के लिए।', 'स्वतंत्र सार्वजनिक-डेटा निर्णय सहयोग। सरकारी पोर्टल नहीं।'],
  bho: ['फसल बुद्धि, किसान परिवार खातिर।', 'स्वतंत्र सार्वजनिक-डेटा फैसला सहयोग। सरकारी पोर्टल नइखे।'],
} as const;

export function SiteFooter() {
  const { locale } = useLanguage();
  return <footer className="site-footer"><div className="footer-brand"><img src="/brand/finding-farmers-logo.jpg" alt="" /><span>FINDING FARMERS</span></div><h2>{copy[locale][0]}</h2><div className="footer-grid"><p>{copy[locale][1]}</p><div><Link href="/about">About <ArrowUpRight /></Link><Link href="/guidance">Weekly guidance <ArrowUpRight /></Link></div></div><div className="footer-bottom"><span>© 2026 FINDING FARMERS</span><span>WEEKLY MODEL RELEASE · W35.2026</span></div></footer>;
}
