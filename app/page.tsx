'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Database, Expand, FileCheck2, LoaderCircle, Map, Pause, Play, Radar, RefreshCw, ShieldCheck, Workflow, X } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import type { ClimateCrop, ClimateDistrict, ClimateModelResult } from '@/lib/climate-model';

type PortfolioRow = { district: ClimateDistrict; label: string; releaseId: string; decisionCode: string; decision: string; peakRisk: number; dominantRisk: string; confidence: number; rainfallMm: number; waterBalanceMm: number; antecedentRainfallMm: number; spatialAgreement: number };
type PortfolioResult = { portfolioId: string; modelVersion: string; generatedAt: string; coverage: { districts: number; crops: number; horizonDays: number }; ranking: PortfolioRow[]; productionGate: string };

const copy = {
  en: {
    heroKicker: 'Bihar · Weekly crop guidance', heroTitle: 'Clear weekly crop decisions for Bihar farmers.', heroBody: 'We combine the seven-day weather forecast, recent rain, soil moisture and crop stage to explain what to do in the field this week.', heroCta: 'See this week’s guidance', heroNote: 'Hindi, Bhojpuri and English.',
    productKicker: 'WHAT THIS WEBSITE DOES', productTitle: 'Choose a district, crop and growth stage. The model gives one weekly action and shows why.', productBody: 'It checks recent rain, the next seven-day forecast, soil moisture, humidity, expected water loss and the crop’s current sensitivity. Farmers keep the final decision.',
    liveTitle: 'Check this week’s field guidance', liveBody: 'Select your district, crop and crop stage. The result uses live public weather data.', district: 'District', crop: 'Crop', stage: 'Stage', run: 'Update guidance', loading: 'Checking recent rain, forecast, soil moisture and crop stage…', recommended: 'Suggested field action', confidence: 'Data confidence', rain: 'Next 7 days', balance: 'Water balance',
    portfolioKicker: 'DISTRICT VIEW', portfolioTitle: 'See which pilot districts need attention first.', portfolioBody: 'The same model runs across five Bihar districts so extension teams can see where drainage, disease, heat or irrigation risk is highest this week.', districtRisk: 'District / main risk', action: 'Suggested action', exposure: 'Risk level',
    videoKicker: 'FIELD CONTEXT', videoTitle: 'Weather data must end in a useful field action.', videoBody: 'The model does not replace local observation. Farmers and agronomists should check drainage, crop condition and field-level soil moisture before acting.', productSystem: 'Six connected models produce one weekly field decision.', finalTitle: 'Start with your district, crop and crop stage.', finalBody: 'This is a five-district pilot. Each result shows the data used, the calculation, uncertainty and known limits. Field validation is required before wider use.',
  },
  hi: {
    heroKicker: 'बिहार · साप्ताहिक फसल सलाह', heroTitle: 'बिहार के किसानों के लिए हर सप्ताह साफ़ फसल सलाह।', heroBody: 'हम सात दिन के मौसम, हाल की बारिश, मिट्टी की नमी और फसल की अवस्था को जोड़कर बताते हैं कि इस सप्ताह खेत में क्या करना है।', heroCta: 'इस सप्ताह की सलाह देखें', heroNote: 'हिंदी, भोजपुरी और अंग्रेज़ी में।',
    productKicker: 'यह वेबसाइट क्या करती है', productTitle: 'जिला, फसल और अवस्था चुनें। मॉडल एक साप्ताहिक काम बताता है और उसका कारण दिखाता है।', productBody: 'यह हाल की बारिश, अगले सात दिन का मौसम, मिट्टी की नमी, हवा की नमी, पानी की संभावित कमी और फसल की अवस्था देखता है। अंतिम फैसला किसान का है।',
    liveTitle: 'इस सप्ताह की खेत सलाह देखें', liveBody: 'अपना जिला, फसल और फसल अवस्था चुनें। परिणाम लाइव सार्वजनिक मौसम डेटा पर चलता है।', district: 'जिला', crop: 'फसल', stage: 'फसल अवस्था', run: 'सलाह अपडेट करें', loading: 'हाल की बारिश, मौसम, मिट्टी की नमी और फसल अवस्था जांची जा रही है…', recommended: 'सुझाया गया खेत का काम', confidence: 'डेटा भरोसा', rain: 'अगले 7 दिन', balance: 'जल संतुलन',
    portfolioKicker: 'जिला स्थिति', portfolioTitle: 'देखें किन पायलट जिलों पर पहले ध्यान देना है।', portfolioBody: 'एक ही मॉडल बिहार के पांच जिलों में चलता है। इससे जलभराव, रोग, गर्मी या सिंचाई के सबसे बड़े साप्ताहिक खतरे दिखाई देते हैं।', districtRisk: 'जिला / मुख्य खतरा', action: 'सुझाया काम', exposure: 'खतरा स्तर',
    videoKicker: 'खेत का संदर्भ', videoTitle: 'मौसम का डेटा खेत में उपयोगी काम तक पहुंचना चाहिए।', videoBody: 'मॉडल स्थानीय निरीक्षण की जगह नहीं लेता। काम करने से पहले किसान और कृषि विशेषज्ञ जल निकासी, फसल की हालत और खेत की नमी जांचें।', productSystem: 'छह जुड़े मॉडल मिलकर एक साप्ताहिक खेत फैसला बनाते हैं।', finalTitle: 'अपने जिला, फसल और फसल अवस्था से शुरू करें।', finalBody: 'यह पांच जिलों का पायलट है। हर परिणाम में उपयोग किया गया डेटा, गणना, अनिश्चितता और सीमाएं दिखाई जाती हैं। बड़े उपयोग से पहले फील्ड सत्यापन जरूरी है।',
  },
  bho: {
    heroKicker: 'बिहार · हफ्तावार फसल सलाह', heroTitle: 'बिहार के किसान खातिर हर हफ्ता साफ फसल सलाह।', heroBody: 'हम सात दिन के मौसम, हाल के बरखा, माटी के नमी आ फसल के अवस्था जोड़ के बताइले कि एह हफ्ता खेत में का करे के बा।', heroCta: 'एह हफ्ता के सलाह देखीं', heroNote: 'हिंदी, भोजपुरी आ अंग्रेजी में।',
    productKicker: 'ई वेबसाइट का करेला', productTitle: 'जिला, फसल आ अवस्था चुनीं। मॉडल एक हफ्तावार काम बताई आ कारण देखाई।', productBody: 'ई हाल के बरखा, अगिला सात दिन के मौसम, माटी के नमी, हवा के नमी, पानी के कमी आ फसल के अवस्था देखेला। आखिरी फैसला किसान के बा।',
    liveTitle: 'एह हफ्ता के खेत सलाह देखीं', liveBody: 'अपना जिला, फसल आ अवस्था चुनीं। नतीजा लाइव सार्वजनिक मौसम डेटा पर चलत बा।', district: 'जिला', crop: 'फसल', stage: 'फसल अवस्था', run: 'सलाह अपडेट करीं', loading: 'हाल के बरखा, मौसम, माटी के नमी आ फसल अवस्था जांचल जात बा…', recommended: 'सुझावल खेत काम', confidence: 'डेटा भरोसा', rain: 'अगिला 7 दिन', balance: 'पानी संतुलन',
    portfolioKicker: 'जिला स्थिति', portfolioTitle: 'देखीं कवन पायलट जिला पर पहिले ध्यान देवे के बा।', portfolioBody: 'एके मॉडल बिहार के पांच जिला में चलेला आ जलभराव, रोग, गरमी चाहे पटवन के सबसे बड़ खतरा देखावेला।', districtRisk: 'जिला / मुख्य खतरा', action: 'सुझावल काम', exposure: 'खतरा स्तर',
    videoKicker: 'खेत के संदर्भ', videoTitle: 'मौसम डेटा के खेत में काम तक पहुंचे के चाहीं।', videoBody: 'मॉडल स्थानीय जांच के जगह ना लेला। काम से पहिले किसान आ खेती विशेषज्ञ पानी निकासी, फसल के हालत आ खेत के नमी देखसु।', productSystem: 'छह जुड़ल मॉडल मिल के एक हफ्तावार खेत फैसला बनावेला।', finalTitle: 'अपना जिला, फसल आ अवस्था से शुरू करीं।', finalBody: 'ई पांच जिला के पायलट बा। हर नतीजा में डेटा, गणना, अनिश्चितता आ सीमा देखावल बा। बड़ उपयोग से पहिले खेत सत्यापन जरूरी बा।',
  },
} as const;

const districtLabels: Record<ClimateDistrict, string> = { samastipur: 'Samastipur', darbhanga: 'Darbhanga', muzaffarpur: 'Muzaffarpur', gaya: 'Gaya', purnia: 'Purnia' };
const cropLabels: Record<ClimateCrop, [string, string, string]> = { maize: ['Maize', 'मक्का', 'मकई'], rice: ['Rice', 'धान', 'धान'], wheat: ['Wheat', 'गेहूं', 'गेहूं'] };
const stages: Record<ClimateCrop, { value: string; label: [string, string, string] }[]> = {
  maize: [{ value: 'vegetative', label: ['Vegetative', 'वनस्पतिक', 'बढ़त'] }, { value: 'flower_tassel', label: ['Flowering', 'फूल अवस्था', 'फूल अवस्था'] }, { value: 'grain_fill', label: ['Grain fill', 'दाना भरना', 'दाना भरत'] }],
  rice: [{ value: 'nursery_transplant', label: ['Transplanting', 'रोपाई', 'रोपनी'] }, { value: 'tillering', label: ['Tillering', 'कल्ला निकलना', 'कल्ला निकलत'] }, { value: 'panicle', label: ['Panicle initiation', 'बाली निकलना', 'बाली निकलत'] }],
  wheat: [{ value: 'sowing_preparation', label: ['Sowing', 'बुवाई', 'बोआई'] }, { value: 'tillering', label: ['Tillering', 'कल्ला निकलना', 'कल्ला निकलत'] }, { value: 'grain_fill', label: ['Grain fill', 'दाना भरना', 'दाना भरत'] }],
};
const riskLabels = {
  en: { waterlogging: 'Waterlogging', diseasePressure: 'Disease pressure', heatStress: 'Heat stress', irrigationNeed: 'Irrigation need' },
  hi: { waterlogging: 'जलभराव', diseasePressure: 'रोग का मौसम', heatStress: 'गर्मी का असर', irrigationNeed: 'सिंचाई की जरूरत' },
  bho: { waterlogging: 'जलभराव', diseasePressure: 'रोग के मौसम', heatStress: 'गरमी के असर', irrigationNeed: 'पटवन के जरूरत' },
} as const;

const suiteModules = {
  en: [
    ['Recent Rain Model', 'Carries the previous seven days of rain into this week’s drainage and irrigation calculation.'],
    ['District Spatial Check', 'Samples three points in each district and reports the rainfall range instead of pretending one point represents every field.'],
    ['Water Balance Model', 'Subtracts FAO-56 reference evapotranspiration from expected rain to estimate surplus or deficit.'],
    ['Crop-stage Stress Model', 'Changes heat, waterlogging and disease thresholds for maize, rice, wheat and the selected growth stage.'],
    ['Weekly Decision Rules', 'Turns the risk scores into drainage, irrigation or monitoring actions with a written reason.'],
    ['Release & Validation Record', 'Stores the model version, data sources, confidence, limitations and agronomist approval requirement.'],
  ],
  hi: [
    ['हाल की बारिश मॉडल', 'पिछले सात दिन की बारिश को इस सप्ताह के जल निकासी और सिंचाई हिसाब में जोड़ता है।'],
    ['जिला स्थानिक जांच', 'हर जिले में तीन स्थान जांचता है और एक बिंदु को पूरे जिले का सच मानने के बजाय बारिश की सीमा दिखाता है।'],
    ['जल संतुलन मॉडल', 'बारिश से FAO-56 के अनुसार संभावित जल हानि घटाकर पानी की अधिकता या कमी बताता है।'],
    ['फसल-अवस्था तनाव मॉडल', 'मक्का, धान, गेहूं और चुनी हुई अवस्था के अनुसार गर्मी, जलभराव और रोग सीमा बदलता है।'],
    ['साप्ताहिक निर्णय नियम', 'जोखिम अंकों को जल निकासी, सिंचाई या निगरानी के काम और साफ कारण में बदलता है।'],
    ['रिलीज और सत्यापन रिकॉर्ड', 'मॉडल संस्करण, डेटा स्रोत, भरोसा, सीमाएं और कृषि विशेषज्ञ की समीक्षा दर्ज करता है।'],
  ],
  bho: [
    ['हाल के बरखा मॉडल', 'पिछला सात दिन के बरखा के एह हफ्ता के पानी निकासी आ पटवन हिसाब में जोड़ेला।'],
    ['जिला जगह जांच', 'हर जिला में तीन जगह जांचेला आ एक जगह के पूरा जिला ना मान के बरखा के सीमा देखावेला।'],
    ['पानी संतुलन मॉडल', 'बरखा में से FAO-56 वाला पानी नुकसान घटा के अधिका चाहे कमी बतावेला।'],
    ['फसल-अवस्था तनाव मॉडल', 'मकई, धान, गेहूं आ चुनल अवस्था हिसाब से गरमी, जलभराव आ रोग सीमा बदलेला।'],
    ['हफ्तावार फैसला नियम', 'खतरा अंक के पानी निकासी, पटवन चाहे निगरानी के काम आ साफ कारण में बदलेला।'],
    ['रिलीज आ सत्यापन रिकॉर्ड', 'मॉडल संस्करण, डेटा स्रोत, भरोसा, सीमा आ खेती विशेषज्ञ समीक्षा दर्ज करेला।'],
  ],
} as const;

const decisionTitles = {
  DRAINAGE_FIRST: { en: 'Protect drainage; hold irrigation.', hi: 'जल निकासी ठीक रखें; अभी सिंचाई रोकें।', bho: 'पानी निकासी ठीक रखीं; अबहीं पटवन रोकीं।' },
  IRRIGATION_WINDOW: { en: 'Plan one measured irrigation window.', hi: 'एक नापी हुई सिंचाई की तैयारी करें।', bho: 'एक नापल पटवन के तैयारी करीं।' },
  MONITOR_ONLY: { en: 'No major water intervention this week.', hi: 'इस सप्ताह पानी से जुड़ा बड़ा काम जरूरी नहीं।', bho: 'एह हफ्ता पानी के बड़ काम जरूरी नइखे।' },
} as const;

export default function Home() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const currentRiskLabels = riskLabels[locale];
  const simple = locale === 'en'
    ? { api: 'View model data', contract: 'TECHNICAL OUTPUT', open: 'Open district data', recent: 'recent 7 days', points: 'district sample agreement', suite: 'CLIMATE MODEL SUITE', final: 'WEEKLY CROP GUIDANCE', dossier: 'Open this week’s guidance', about: 'How the model works' }
    : locale === 'hi'
      ? { api: 'मॉडल डेटा देखें', contract: 'तकनीकी आउटपुट', open: 'जिला डेटा खोलें', recent: 'पिछले 7 दिन', points: 'जिला नमूना सहमति', suite: 'जलवायु मॉडल समूह', final: 'साप्ताहिक फसल सलाह', dossier: 'इस सप्ताह की सलाह खोलें', about: 'मॉडल कैसे काम करता है' }
      : { api: 'मॉडल डेटा देखीं', contract: 'तकनीकी नतीजा', open: 'जिला डेटा खोलीं', recent: 'पिछला 7 दिन', points: 'जिला नमूना सहमति', suite: 'जलवायु मॉडल समूह', final: 'हफ्तावार फसल सलाह', dossier: 'एह हफ्ता के सलाह खोलीं', about: 'मॉडल कइसे काम करेला' };
  const movingLabels = locale === 'en' ? ['RECENT RAIN', '7-DAY FORECAST', 'SOIL MOISTURE', 'DRAINAGE', 'IRRIGATION', 'CROP STAGE'] : locale === 'hi' ? ['हाल की बारिश', '7 दिन का मौसम', 'मिट्टी की नमी', 'जल निकासी', 'सिंचाई', 'फसल अवस्था'] : ['हाल के बरखा', '7 दिन के मौसम', 'माटी के नमी', 'पानी निकासी', 'पटवन', 'फसल अवस्था'];
  const languageIndex = locale === 'en' ? 0 : locale === 'hi' ? 1 : 2;
  const [district, setDistrict] = useState<ClimateDistrict>('samastipur');
  const [crop, setCrop] = useState<ClimateCrop>('maize');
  const [stage, setStage] = useState('vegetative');
  const [model, setModel] = useState<ClimateModelResult | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      fetch(`/api/climate?district=${district}&crop=${crop}&stage=${stage}`, { signal: controller.signal }).then((response) => response.json()),
      fetch(`/api/portfolio?crop=${crop}&stage=${stage}`, { signal: controller.signal }).then((response) => response.json()),
    ]).then(([modelResult, portfolioResult]) => {
      if (!modelResult.error) setModel(modelResult);
      if (!portfolioResult.error) setPortfolio(portfolioResult);
      setLoading(false);
    }).catch((error) => { if (error?.name !== 'AbortError') setLoading(false); });
    return () => controller.abort();
  }, [district, crop, stage, runKey]);

  const moveHero = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    event.currentTarget.style.setProperty('--hero-x', `${x}px`);
    event.currentTarget.style.setProperty('--hero-y', `${y}px`);
  };

  return <main className="bk-home">
    <section className="bk-photo-hero" ref={heroRef} onPointerMove={moveHero} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--hero-x', '0px'); event.currentTarget.style.setProperty('--hero-y', '0px'); }}>
      <div className="bk-photo-stage">
        <img src="/founder-field-family.png" alt="A family standing in a mustard field in Bihar" />
        <div className="bk-photo-caption">ORIGINAL FIELD PHOTOGRAPH · BIHAR</div>
        <div className="bk-hero-copy">
          <span>{t.heroKicker}</span><h1>{t.heroTitle}</h1><p>{t.heroBody}</p>
          <div><Link href="/guidance">{t.heroCta}<ArrowUpRight /></Link><small>{t.heroNote}</small></div>
        </div>
      </div>
    </section>

    <div className="bk-marquee" aria-hidden="true"><div>{[...movingLabels, ...movingLabels].map((label, index) => <span key={`${label}-${index}`}>{label}<i>●</i></span>)}</div></div>

    <section className="bk-product-statement" id="technology" data-reveal>
      <span>{t.productKicker}</span><h2>{t.productTitle}</h2>
      <div><p>{t.productBody}</p><ul><li><Check />7-day forecast</li><li><Check />Previous 7-day rainfall</li><li><Check />3 district sample points</li><li><Check />2001–2020 climate normal</li></ul></div>
    </section>

    <section className="bk-live-product" data-reveal>
      <div className="bk-live-head"><div><span>LIVE / BK-CLIMATE-0.5.0</span><h2>{t.liveTitle}</h2><p>{t.liveBody}</p></div><Link href="/api/climate?district=samastipur&crop=maize&stage=vegetative" target="_blank">{simple.api} <ArrowUpRight /></Link></div>
      <div className="bk-model-console">
        <div className="bk-model-controls">
          <label><span>{t.district}</span><select value={district} onChange={(event) => setDistrict(event.target.value as ClimateDistrict)}>{Object.entries(districtLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label><span>{t.crop}</span><select value={crop} onChange={(event) => { const next = event.target.value as ClimateCrop; setCrop(next); setStage(stages[next][0].value); }}>{Object.entries(cropLabels).map(([value, label]) => <option value={value} key={value}>{label[languageIndex]}</option>)}</select></label>
          <label><span>{t.stage}</span><select value={stage} onChange={(event) => setStage(event.target.value)}>{stages[crop].map((item) => <option value={item.value} key={item.value}>{item.label[languageIndex]}</option>)}</select></label>
          <button onClick={() => setRunKey((key) => key + 1)}><RefreshCw />{t.run}</button>
        </div>
        {loading || !model ? <div className="bk-console-loading"><LoaderCircle />{t.loading}</div> : <div className="bk-console-result">
          <div className="bk-decision"><span>{t.recommended}</span><h3>{decisionTitles[model.decision.code as keyof typeof decisionTitles]?.[locale] || model.decision.title}</h3><p>{locale === 'en' ? model.decision.reason : locale === 'hi' ? `पिछले सात दिन में ${model.observed.antecedentRainfallMm} मिमी बारिश हुई। अगले सात दिन में ${model.observed.forecastRainfallMm} मिमी बारिश का अनुमान है। जिले के तीन नमूना स्थानों में बारिश ${model.uncertainty.rainfallLowMm} से ${model.uncertainty.rainfallHighMm} मिमी के बीच है।` : `पिछला सात दिन में ${model.observed.antecedentRainfallMm} मिमी बरखा भइल। अगिला सात दिन में ${model.observed.forecastRainfallMm} मिमी बरखा के अनुमान बा। जिला के तीन नमूना जगह में बरखा ${model.uncertainty.rainfallLowMm} से ${model.uncertainty.rainfallHighMm} मिमी बीच बा।`}</p><small>{model.releaseId} · {new Date(model.generatedAt).toLocaleString(locale === 'en' ? 'en-IN' : 'hi-IN', { dateStyle: 'medium', timeStyle: 'short' })}</small></div>
          <div className="bk-metric"><span>{t.confidence}</span><b>{model.confidence}<sup>%</sup></b><small>{model.uncertainty.spatialAgreement}% {simple.points}</small></div>
          <div className="bk-metric"><span>{t.rain}</span><b>{model.observed.forecastRainfallMm}<sup>mm</sup></b><small>{model.observed.antecedentRainfallMm} mm · {simple.recent}</small></div>
          <div className="bk-metric"><span>{t.balance}</span><b>{model.observed.waterBalanceMm > 0 ? '+' : ''}{model.observed.waterBalanceMm}<sup>mm</sup></b><small>rain − FAO-56 ET₀</small></div>
          <div className="bk-risk-strip">{Object.entries(model.risks).map(([name, value]) => <div key={name}><span>{currentRiskLabels[name as keyof typeof currentRiskLabels]}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}</strong></div>)}</div>
        </div>}
      </div>
    </section>

    <section className="bk-portfolio" id="portfolio" data-reveal>
      <div className="bk-portfolio-copy"><span>{t.portfolioKicker}</span><h2>{t.portfolioTitle}</h2><p>{t.portfolioBody}</p><div className="bk-portfolio-contract"><b>{simple.contract}</b><code>{'{ district, crop, stage, recentRain, spatialAgreement, risk, action }'}</code><Link href={`/api/portfolio?crop=${crop}&stage=${stage}`} target="_blank">{simple.open} <ArrowUpRight /></Link></div></div>
      <div className="bk-portfolio-table">
        <div className="bk-table-meta"><span>{portfolio?.portfolioId || 'BK-PORTFOLIO-W35'}</span><b>{portfolio?.coverage.districts || 5} PILOT DISTRICTS · LIVE</b></div>
        <div className="bk-table-head"><span>{t.districtRisk}</span><span>{t.action}</span><span>{t.exposure}</span></div>
        {portfolio?.ranking.map((row, index) => <div className="bk-table-row" key={row.district}><span><b>{String(index + 1).padStart(2, '0')}</b><i>{row.label}<small>{currentRiskLabels[row.dominantRisk as keyof typeof currentRiskLabels]}</small></i></span><span>{row.decisionCode.replaceAll('_', ' ')}</span><span><i><b style={{ width: `${row.peakRisk}%` }} /></i><strong>{row.peakRisk}</strong></span></div>) || <div className="bk-portfolio-wait"><LoaderCircle />Building the district view…</div>}
        <small className="bk-production-gate">PILOT GATE · {portfolio?.productionGate || 'Calibration and agronomist approval required before production.'}</small>
      </div>
    </section>

    <section className="bk-field-film" id="groundtruth" data-reveal>
      <div className="bk-film-copy"><span>{t.videoKicker}</span><h2>{t.videoTitle}</h2><p>{t.videoBody}</p></div>
      <div className="bk-film-grid">
        <InteractiveFilm src="/media/rice-harvest.mp4" index="01" title="Rice field operations" credit="Suresh Boddu / Pexels" creditUrl="https://www.pexels.com/video/farmers-harvesting-the-rice-field-5636708/" />
        <InteractiveFilm src="/media/india-fields.mp4" index="02" title="Indian agricultural landscape" credit="Vatsal Mandavia / Pexels" creditUrl="https://www.pexels.com/video/indian-farm-s-drone-views-17007049/" />
      </div>
    </section>

    <section className="bk-system" id="model-suite" data-reveal>
      <div><span>{simple.suite}</span><h2>{t.productSystem}</h2></div>
      <div className="bk-system-grid">
        {suiteModules[locale].map(([title, body], index) => { const icons = [Database, Map, Radar, Workflow, FileCheck2, ShieldCheck]; const Icon = icons[index]; return <article key={title}><Icon /><b>0{index + 1}</b><h3>{title}</h3><p>{body}</p></article>; })}
      </div>
    </section>

    <section className="bk-final" data-reveal><div><span>{simple.final}</span><h2>{t.finalTitle}</h2></div><div><p>{t.finalBody}</p><div><Link href="/guidance">{simple.dossier} <ArrowRight /></Link><Link href="/about">{simple.about} <ArrowUpRight /></Link></div></div></section>
  </main>;
}

function InteractiveFilm({ src, index, title, credit, creditUrl }: { src: string; index: string; title: string; credit: string; creditUrl: string }) {
  const inlineVideo = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', close);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = ''; };
  }, [expanded]);

  const togglePlayback = () => {
    const video = inlineVideo.current;
    if (!video) return;
    if (video.paused) { void video.play(); setPlaying(true); } else { video.pause(); setPlaying(false); }
  };

  return <>
    <figure className="bk-interactive-film">
      <div className="bk-film-media">
        <video ref={inlineVideo} autoPlay muted loop playsInline preload="metadata"><source src={src} type="video/mp4" /></video>
        <button className="bk-film-expand" onClick={() => setExpanded(true)} aria-label={`Open ${title} film`}><Expand /><span>OPEN FILM</span></button>
        <button className="bk-film-play" onClick={togglePlayback} aria-label={playing ? `Pause ${title}` : `Play ${title}`}>{playing ? <Pause /> : <Play />}</button>
        <span className="bk-film-live"><i />REAL FIELD FILM</span>
      </div>
      <figcaption><span>{index} / {title.toUpperCase()}</span><a href={creditUrl} target="_blank" rel="noreferrer">Film: {credit} <ArrowUpRight /></a></figcaption>
    </figure>
    {expanded && <div className="bk-film-modal" role="dialog" aria-modal="true" aria-label={title} onClick={() => setExpanded(false)}>
      <div onClick={(event) => event.stopPropagation()}>
        <div className="bk-modal-bar"><span>{index} / {title.toUpperCase()}</span><button onClick={() => setExpanded(false)} aria-label="Close film"><X /></button></div>
        <video autoPlay muted loop playsInline controls><source src={src} type="video/mp4" /></video>
        <a href={creditUrl} target="_blank" rel="noreferrer">Original film by {credit} <ArrowUpRight /></a>
      </div>
    </div>}
  </>;
}
