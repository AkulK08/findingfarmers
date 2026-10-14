export type CropId = 'maize' | 'rice' | 'wheat';
export type DistrictId = 'samastipur' | 'darbhanga' | 'muzaffarpur' | 'gaya' | 'purnia';
export type IrrigationId = 'tubewell' | 'canal' | 'rainfed';

export type ModelInput = {
  crop: CropId;
  district: DistrictId;
  stage: string;
  irrigation: IrrigationId;
};

export type ModelOutput = {
  traceId: string;
  recommendationKey: 'hold_irrigation' | 'inspect_bunds' | 'prepare_sowing';
  actionKeys: string[];
  confidence: number;
  risks: { rainfall: number; pest: number; heat: number; waterlogging: number };
  cropSuitability: number;
  featureContributions: { feature: string; contribution: number }[];
  modelVersions: string[];
  sourceFreshness: { weather: string; soil: string; cropHistory: string };
};

const cropBaseline = {
  maize: { rain: 63, pest: 26, heat: 18, suitability: 86, recommendation: 'hold_irrigation' as const },
  rice: { rain: 71, pest: 31, heat: 11, suitability: 91, recommendation: 'inspect_bunds' as const },
  wheat: { rain: 24, pest: 14, heat: 25, suitability: 82, recommendation: 'prepare_sowing' as const },
};

const districtFactors = {
  samastipur: { rain: 11, heat: -4, waterlogging: 18, suitability: 0, code: 'SMT' },
  darbhanga: { rain: 16, heat: -5, waterlogging: 24, suitability: 1, code: 'DBG' },
  muzaffarpur: { rain: 9, heat: -2, waterlogging: 15, suitability: 2, code: 'MZF' },
  gaya: { rain: -13, heat: 12, waterlogging: -8, suitability: -4, code: 'GAY' },
  purnia: { rain: 19, heat: -7, waterlogging: 20, suitability: 3, code: 'PUR' },
};

const irrigationFactors = {
  tubewell: { rain: 0, waterlogging: 8, confidence: 2 },
  canal: { rain: 0, waterlogging: 13, confidence: 1 },
  rainfed: { rain: 4, waterlogging: -4, confidence: 0 },
};

const clamp = (value: number, min = 0, max = 99) => Math.min(max, Math.max(min, Math.round(value)));

function stableHash(value: string) {
  let hash = 17;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) % 10000;
  return String(hash).padStart(4, '0');
}

export function runDecisionEngine(input: ModelInput): ModelOutput {
  const crop = cropBaseline[input.crop];
  const district = districtFactors[input.district];
  const irrigation = irrigationFactors[input.irrigation];
  const reproductiveStage = /flower|tassel|panicle|grain|बाली|फूल|दाना/i.test(input.stage);
  const seedStage = /sow|nursery|बुवाई|रोपाई/i.test(input.stage);

  const rainfall = clamp(crop.rain + district.rain + irrigation.rain);
  const pest = clamp(crop.pest + (reproductiveStage ? 9 : seedStage ? -3 : 2));
  const heat = clamp(crop.heat + district.heat + (input.irrigation === 'rainfed' ? 6 : 0));
  const waterlogging = clamp(32 + district.waterlogging + irrigation.waterlogging + rainfall * 0.22);
  const confidence = clamp(86 + irrigation.confidence + (input.stage ? 4 : 0) + (rainfall > 65 ? 1 : 0), 72, 94);
  const cropSuitability = clamp(crop.suitability + district.suitability - (heat > 55 ? 4 : 0), 50, 96);

  const recommendationKey = input.crop === 'wheat'
    ? 'prepare_sowing'
    : input.crop === 'rice'
      ? 'inspect_bunds'
      : rainfall >= 60
        ? 'hold_irrigation'
        : crop.recommendation;

  const actionKeys = recommendationKey === 'hold_irrigation'
    ? ['clear_drainage', 'delay_urea', 'inspect_stem_borer']
    : recommendationKey === 'inspect_bunds'
      ? ['repair_bunds', 'record_leaf_colour', 'inspect_khaira']
      : ['level_field', 'verify_seed', 'attach_soil_card'];

  return {
    traceId: `BKC-${district.code}-${input.crop.toUpperCase()}-${stableHash(JSON.stringify(input))}`,
    recommendationKey,
    actionKeys,
    confidence,
    risks: { rainfall, pest, heat, waterlogging },
    cropSuitability,
    featureContributions: [
      { feature: 'weather_signal', contribution: 35 },
      { feature: 'crop_stage', contribution: 30 },
      { feature: 'soil_water_context', contribution: 20 },
      { feature: 'district_history', contribution: 15 },
    ],
    modelVersions: ['BK-WX-2.1.0', 'BK-CROP-1.4.2', 'BK-SOIL-1.2.0', 'BK-XPLAIN-0.8.1'],
    sourceFreshness: { weather: '2026-08-29T06:10:00+05:30', soil: 'farmer-input-required', cropHistory: 'OGD-2024-10-16' },
  };
}

export const modelRegistry = [
  { id: 'BK-WX-2.1.0', family: 'Calibrated risk scorer', purpose: 'Weather-to-operation risk', validation: 'District holdout required', status: 'reference-active' },
  { id: 'BK-CROP-1.4.2', family: 'Rules + weighted fusion', purpose: 'Crop-stage advisory', validation: 'Agronomist review gate', status: 'reference-active' },
  { id: 'BK-SOIL-1.2.0', family: 'Constraint scoring', purpose: 'Soil–crop suitability', validation: 'SHC input required', status: 'input-gated' },
  { id: 'BK-XPLAIN-0.8.1', family: 'Template-grounded NLG', purpose: 'Hindi/Bhojpuri/English explanation', validation: 'Terminology review', status: 'reference-active' },
] as const;
