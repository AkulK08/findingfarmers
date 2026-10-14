export type ClimateCrop = 'maize' | 'rice' | 'wheat';
export type ClimateDistrict = 'samastipur' | 'darbhanga' | 'muzaffarpur' | 'gaya' | 'purnia';

export type ForecastDay = {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  precipitationProbability: number;
  evapotranspiration: number;
  windMax: number;
};

export type ClimateModelResult = {
  releaseId: string;
  location: { district: ClimateDistrict; label: string; latitude: number; longitude: number };
  crop: ClimateCrop;
  stage: string;
  generatedAt: string;
  forecast: ForecastDay[];
  observed: {
    forecastRainfallMm: number;
    antecedentRainfallMm: number;
    forecastEt0Mm: number;
    waterBalanceMm: number;
    meanTemperatureC: number;
    temperatureAnomalyC: number;
    surfaceSoilMoisture: number;
    meanRelativeHumidity: number;
    climateNormalRainMmPerDay: number;
    climateNormalTemperatureC: number;
  };
  risks: { waterlogging: number; heatStress: number; diseasePressure: number; irrigationNeed: number };
  uncertainty: { sampledPoints: number; rainfallLowMm: number; rainfallHighMm: number; rainfallSpreadMm: number; spatialAgreement: number };
  decision: { code: string; title: string; reason: string; actions: string[] };
  confidence: number;
  dataQuality: { completeness: number; forecastStatus: string; baselineStatus: string };
  sources: { name: string; role: string; url: string; updated: string }[];
  workflow: { code: string; name: string; output: string }[];
  modelCard: { version: string; method: string; limits: string[] };
};

export const climateDistricts: Record<ClimateDistrict, { label: string; latitude: number; longitude: number; code: string }> = {
  samastipur: { label: 'Samastipur', latitude: 25.86, longitude: 85.78, code: 'SMT' },
  darbhanga: { label: 'Darbhanga', latitude: 26.15, longitude: 85.90, code: 'DBG' },
  muzaffarpur: { label: 'Muzaffarpur', latitude: 26.12, longitude: 85.39, code: 'MZF' },
  gaya: { label: 'Gaya', latitude: 24.80, longitude: 85.00, code: 'GAY' },
  purnia: { label: 'Purnia', latitude: 25.78, longitude: 87.47, code: 'PUR' },
};

const cropThresholds = {
  maize: { heat: 35, diseaseHumidity: 82, waterloggingTolerance: 0.36 },
  rice: { heat: 37, diseaseHumidity: 86, waterloggingTolerance: 0.43 },
  wheat: { heat: 30, diseaseHumidity: 78, waterloggingTolerance: 0.32 },
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(value)));
const round = (value: number, decimals = 1) => Number(value.toFixed(decimals));
const sum = (values: number[]) => values.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
const mean = (values: number[]) => values.length ? sum(values) / values.length : 0;

export function calculateClimateModel(input: {
  district: ClimateDistrict;
  crop: ClimateCrop;
  stage: string;
  forecast: ForecastDay[];
  soilMoisture: number[];
  relativeHumidity: number[];
  antecedentRainfallMm: number;
  spatialRainfallTotalsMm: number[];
  climateNormal: { rainfallMmPerDay: number; temperatureC: number };
  generatedAt: string;
}): ClimateModelResult {
  const district = climateDistricts[input.district];
  const threshold = cropThresholds[input.crop];
  const forecastRainfallMm = sum(input.forecast.map((day) => day.precipitation));
  const forecastEt0Mm = sum(input.forecast.map((day) => day.evapotranspiration));
  const waterBalanceMm = forecastRainfallMm - forecastEt0Mm;
  const meanTemperatureC = mean(input.forecast.map((day) => (day.temperatureMax + day.temperatureMin) / 2));
  const temperatureAnomalyC = meanTemperatureC - input.climateNormal.temperatureC;
  const surfaceSoilMoisture = mean(input.soilMoisture.filter(Number.isFinite));
  const meanRelativeHumidity = mean(input.relativeHumidity.filter(Number.isFinite));
  const highRainDays = input.forecast.filter((day) => day.precipitation >= 10).length;
  const spatialLow = Math.min(...input.spatialRainfallTotalsMm);
  const spatialHigh = Math.max(...input.spatialRainfallTotalsMm);
  const spatialSpread = spatialHigh - spatialLow;
  const spatialAgreement = clamp(100 - spatialSpread * 1.8, 35, 98);
  const heatDegreeDays = sum(input.forecast.map((day) => Math.max(0, day.temperatureMax - threshold.heat)));
  const stageSensitivity = /flower|tassel|panicle|grain/i.test(input.stage) ? 12 : /sow|nursery|transplant/i.test(input.stage) ? 7 : 4;

  const waterlogging = clamp(
    (forecastRainfallMm / 100) * 34 +
    (surfaceSoilMoisture / threshold.waterloggingTolerance) * 26 +
    (highRainDays / 7) * 12 +
    (input.antecedentRainfallMm / 100) * 18 +
    stageSensitivity,
  );
  const heatStress = clamp(heatDegreeDays * 8 + Math.max(0, temperatureAnomalyC) * 11 + stageSensitivity * 0.6);
  const diseasePressure = clamp((meanRelativeHumidity / threshold.diseaseHumidity) * 48 + highRainDays * 7 + stageSensitivity);
  const irrigationNeed = clamp(Math.max(0, -waterBalanceMm) * 3.2 + Math.max(0, 0.24 - surfaceSoilMoisture) * 140 - input.antecedentRainfallMm * 0.8);
  const completeness = clamp((input.forecast.length / 7) * 55 + (input.soilMoisture.length ? 20 : 0) + (input.relativeHumidity.length ? 15 : 0) + (input.climateNormal.temperatureC ? 10 : 0));
  const confidence = clamp(65 + completeness * 0.24 - Math.abs(temperatureAnomalyC) * 1.3 - spatialSpread * 0.22, 50, 94);

  const decision = waterlogging >= 65
    ? {
        code: 'DRAINAGE_FIRST',
        title: 'Protect drainage; hold irrigation.',
        reason: `The next 7-day water balance is +${round(waterBalanceMm)} mm after ${round(input.antecedentRainfallMm)} mm of recent rain. Rainfall across three district sample points ranges from ${round(spatialLow)} to ${round(spatialHigh)} mm.`,
        actions: ['Open field drainage before the next rain window', 'Hold irrigation until the water balance falls below +10 mm', 'Scout low-lying rows for standing water and root stress'],
      }
    : irrigationNeed >= 55
      ? {
          code: 'IRRIGATION_WINDOW',
          title: 'Plan one measured irrigation window.',
          reason: `Forecast ET₀ exceeds expected rainfall by ${round(Math.abs(waterBalanceMm))} mm and modeled irrigation need is ${irrigationNeed}/100.`,
          actions: ['Verify soil moisture at root depth', 'Irrigate in the lowest-wind morning window', 'Recalculate after the next forecast update'],
        }
      : {
          code: 'MONITOR_ONLY',
          title: 'No major water intervention this week.',
          reason: `The modeled water balance is ${round(waterBalanceMm)} mm and no single stress signal crosses the intervention threshold.`,
          actions: ['Continue field observation', 'Record one soil-moisture check', 'Recalculate on the Saturday release'],
        };

  return {
    releaseId: `BK-CLIMATE-W35-${district.code}-${input.crop.toUpperCase()}`,
    location: { district: input.district, label: district.label, latitude: district.latitude, longitude: district.longitude },
    crop: input.crop,
    stage: input.stage,
    generatedAt: input.generatedAt,
    forecast: input.forecast,
    observed: {
      forecastRainfallMm: round(forecastRainfallMm), antecedentRainfallMm: round(input.antecedentRainfallMm), forecastEt0Mm: round(forecastEt0Mm), waterBalanceMm: round(waterBalanceMm), meanTemperatureC: round(meanTemperatureC), temperatureAnomalyC: round(temperatureAnomalyC), surfaceSoilMoisture: round(surfaceSoilMoisture, 3), meanRelativeHumidity: round(meanRelativeHumidity), climateNormalRainMmPerDay: round(input.climateNormal.rainfallMmPerDay, 2), climateNormalTemperatureC: round(input.climateNormal.temperatureC),
    },
    risks: { waterlogging, heatStress, diseasePressure, irrigationNeed },
    uncertainty: { sampledPoints: input.spatialRainfallTotalsMm.length, rainfallLowMm: round(spatialLow), rainfallHighMm: round(spatialHigh), rainfallSpreadMm: round(spatialSpread), spatialAgreement },
    decision,
    confidence,
    dataQuality: { completeness, forecastStatus: input.forecast.length === 7 ? 'complete' : 'partial', baselineStatus: input.climateNormal.temperatureC ? 'complete' : 'missing' },
    sources: [
      { name: 'Open-Meteo Forecast API', role: '7-day forecast, ET₀, soil moisture and humidity', url: 'https://open-meteo.com/en/docs', updated: input.generatedAt },
      { name: 'NASA POWER Agroclimatology', role: '2001–2020 monthly climate normal', url: 'https://power.larc.nasa.gov/docs/services/api/temporal/climatology/', updated: '2001–2020 baseline' },
      { name: 'IMD Agromet', role: 'Agricultural advisory review context', url: 'https://webgis.imd.gov.in/agro/', updated: 'external review source' },
      { name: 'India OGD crop statistics', role: 'District crop-production history', url: 'https://www.data.gov.in/catalog/district-wise-season-wise-crop-production-statistics-0', updated: '2024-10-16 catalog update' },
    ],
    workflow: [
      { code: '01', name: 'Recent rainfall memory', output: `${round(input.antecedentRainfallMm)} mm in the previous 7 days` },
      { code: '02', name: 'Three-point spatial check', output: `${round(spatialLow)}–${round(spatialHigh)} mm district range` },
      { code: '03', name: 'Climate baseline', output: `2001–2020 ${district.label} normal` },
      { code: '04', name: 'Water balance', output: `${round(waterBalanceMm)} mm forecast balance` },
      { code: '05', name: 'Crop stress rules', output: `${input.crop} · ${input.stage}` },
      { code: '06', name: 'Decision policy', output: decision.code },
      { code: '07', name: 'Human release gate', output: 'agronomist review required' },
    ],
    modelCard: {
      version: 'BK-CLIMATE-0.5.0',
      method: 'Crop-stage risk model combining previous-7-day rainfall, three-point district sampling, FAO-56 ET₀ water balance, surface soil moisture, humidity and a 2001–2020 climate normal.',
      limits: ['Three district sample points do not resolve individual field topography', 'Surface soil moisture is a model estimate, not an in-field sensor reading', 'Chemical dosage is outside this model scope', 'Operational deployment requires district-held-out calibration and agronomist approval'],
    },
  };
}
