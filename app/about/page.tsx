'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpenCheck, CloudRain, Database, Eye, Languages, ShieldCheck, Sprout, Users } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

const copy = {
  en: {
    kicker: 'WHY FINDING FARMERS', title: 'The last mile is the whole problem.', body: 'Agricultural knowledge exists. Forecasts exist. Public datasets exist. But a farmer still has to answer one immediate question: what should I do in my field this week?',
    problem: 'The problem is not information. It is translation into a trusted decision.', problemBody: 'A district forecast is too broad. A research paper is too distant. A generic chatbot is too unconstrained. The missing layer is local, crop-stage-aware, uncertainty-aware and accountable to the person standing in the field.',
    human: 'This company was made by people, for people who farm.', humanBody: 'The family photograph at the heart of the site is not a stock image or an invented persona. It represents our operating belief: agricultural intelligence begins with human context and ends with human agency.',
    principles: 'Our operating principles', road: 'The road from prototype to public trust', cta: 'See this week’s guidance',
  },
  hi: {
    kicker: 'भोजपुरी कृषि क्यों', title: 'आखिरी दूरी ही असली समस्या है।', body: 'कृषि ज्ञान है। पूर्वानुमान हैं। सार्वजनिक डेटा है। फिर भी किसान के सामने एक सीधा सवाल रहता है: इस सप्ताह अपने खेत में क्या करूं?',
    problem: 'समस्या जानकारी की नहीं, भरोसेमंद फैसले में बदलने की है।', problemBody: 'जिला पूर्वानुमान बहुत व्यापक है। शोध पत्र खेत से दूर है। सामान्य चैटबॉट बहुत खुला है। जरूरी परत स्थानीय, फसल-अवस्था आधारित, अनिश्चितता-जागरूक और खेत में खड़े व्यक्ति के प्रति जवाबदेह होनी चाहिए।',
    human: 'यह कंपनी इंसानों ने बनाई—खेती करने वाले लोगों के लिए।', humanBody: 'साइट के केंद्र में परिवार की तस्वीर स्टॉक फोटो या गढ़ी हुई पहचान नहीं है। यह हमारे सिद्धांत को दिखाती है: कृषि बुद्धिमत्ता इंसानी संदर्भ से शुरू होती है और इंसानी अधिकार पर खत्म होती है।',
    principles: 'हमारे संचालन सिद्धांत', road: 'प्रोटोटाइप से सार्वजनिक भरोसे तक', cta: 'इस सप्ताह का मार्गदर्शन देखें',
  },
  bho: {
    kicker: 'भोजपुरी कृषि काहे', title: 'आखिरी दूरीए असली समस्या बा।', body: 'खेती ज्ञान बा। मौसम अनुमान बा। सार्वजनिक डेटा बा। तबो किसान के एक सीधा सवाल बा: एह हफ्ता अपना खेत में का करीं?',
    problem: 'समस्या जानकारी के ना, भरोसेमंद फैसला में बदले के बा।', problemBody: 'जिला अनुमान बहुते चौड़ा बा। शोध खेत से दूर बा। साधारण चैटबॉट पर रोक कम बा। जरूरी परत स्थानीय, फसल-अवस्था वाला, अनिश्चितता समझे वाला आ खेत में खड़ा आदमी खातिर जवाबदेह होखे के चाहीं।',
    human: 'ई कंपनी इंसान बनवले—खेती करे वाला लोग खातिर।', humanBody: 'साइट के बीच परिवार के तस्वीर स्टॉक फोटो ना ह। ई हमार मान्यता देखावेला: खेती बुद्धि इंसानी संदर्भ से शुरू होखे आ आखिरी हक किसान के रहे।',
    principles: 'हमार संचालन सिद्धांत', road: 'प्रोटोटाइप से सार्वजनिक भरोसा तक', cta: 'एह हफ्ता के सलाह देखीं',
  },
} as const;

const principles = [
  [Eye, 'Show the reasoning', 'Every advisory exposes source freshness, feature weights and a deterministic trace.'],
  [Languages, 'Language is infrastructure', 'Bhojpuri is not a translation afterthought; it is a primary delivery surface.'],
  [ShieldCheck, 'Know when not to answer', 'Low confidence, stale data or missing soil context must trigger abstention.'],
  [Users, 'Humans own the boundary', 'Agronomists define release gates. Farmers keep the final decision.'],
] as const;

export default function AboutPage() {
  const { locale } = useLanguage();
  const t = copy[locale];
  return <main className="about-page">
    <section className="about-hero"><div className="about-orbit" /><span className="hero-eyebrow"><span />{t.kicker}</span><h1>{t.title}</h1><p>{t.body}</p><div className="about-index"><span>01 / PROBLEM</span><span>02 / PEOPLE</span><span>03 / PRINCIPLES</span><span>04 / ROADMAP</span></div></section>

    <section className="problem-section"><div className="problem-visual"><div className="broken-signal"><span>FORECAST</span><i /><span>FIELD</span></div><div className="problem-stat"><b>7 days</b><span>between weekly releases</span></div></div><div><span className="micro-label">THE MISSING INTELLIGENCE LAYER</span><h2>{t.problem}</h2><p>{t.problemBody}</p></div></section>

    <section className="human-origin"><div className="human-origin-copy"><span className="micro-label">HUMAN ORIGIN / FIELD 01</span><h2>{t.human}</h2><p>{t.humanBody}</p></div><figure><img src="/founder-field-family.png" alt="A family standing together in a mustard field" /><figcaption>THE PEOPLE BEHIND THE PURPOSE · PERSONAL FIELD PHOTOGRAPH</figcaption></figure></section>

    <section className="principles-section"><div className="section-heading dark-heading"><div><span className="micro-label">HOW WE OPERATE</span><h2>{t.principles}</h2></div><p>We want the system to feel revolutionary because its accountability is unusually ordinary: sources, versions, people and decisions that can all be named.</p></div><div className="principles-grid">{principles.map(([Icon, title, body], index) => <article key={title}><div><span>0{index + 1}</span><Icon /></div><h3>{title}</h3><p>{body}</p></article>)}</div></section>

    <section className="roadmap-section"><span className="micro-label">BUILDING IN PUBLIC</span><h2>{t.road}</h2><div className="roadmap-line">{[
      ['NOW', 'Reference engine', 'Weekly maize, rice and wheat releases with transparent inputs.'],
      ['NEXT', 'Field validation', 'District-held-out evaluation and structured agronomist review.'],
      ['THEN', 'Farmer pilots', 'Small cohorts, language QA and decision-outcome logging.'],
      ['SCALE', 'Bihar network', 'KVK partnerships, audited models and district release operations.'],
    ].map(([phase, title, body], index) => <div key={phase}><span>{phase}</span><i>{index + 1}</i><h3>{title}</h3><p>{body}</p></div>)}</div></section>

    <section className="about-sources"><div><span className="micro-label">PUBLIC KNOWLEDGE, PROPRIETARY DECISION LAYER</span><h2>Built on sources farmers already deserve access to.</h2></div><div className="source-links"><a href="https://webgis.imd.gov.in/agro/" target="_blank" rel="noreferrer"><CloudRain />IMD AGROMET<ArrowUpRight /></a><a href="https://icar.gov.in/en/node/17260" target="_blank" rel="noreferrer"><BookOpenCheck />ICAR BIHAR<ArrowUpRight /></a><a href="https://soilhealth.dac.gov.in/" target="_blank" rel="noreferrer"><Sprout />SOIL HEALTH CARD<ArrowUpRight /></a><a href="https://www.data.gov.in/catalog/district-wise-season-wise-crop-production-statistics-0" target="_blank" rel="noreferrer"><Database />DATA.GOV.IN<ArrowUpRight /></a></div><Link href="/guidance" className="about-cta">{t.cta}<ArrowUpRight /></Link></section>
  </main>;
}
