import { runClimateModel } from '@/lib/climate-data';
import { climateDistricts, type ClimateCrop, type ClimateDistrict } from '@/lib/climate-model';

const allowedCrops = new Set<ClimateCrop>(['maize', 'rice', 'wheat']);
const districtKeys = Object.keys(climateDistricts) as ClimateDistrict[];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const crop = (url.searchParams.get('crop') || 'maize') as ClimateCrop;
  const stage = url.searchParams.get('stage') || 'vegetative';
  if (!allowedCrops.has(crop)) return Response.json({ error: 'Unsupported crop.' }, { status: 400 });

  try {
    const results = await Promise.all(districtKeys.map((district) => runClimateModel(district, crop, stage)));
    const ranking = results.map((result) => {
      const peakRisk = Math.max(result.risks.waterlogging, result.risks.diseasePressure, result.risks.heatStress, result.risks.irrigationNeed);
      const dominantRisk = Object.entries(result.risks).sort((a, b) => b[1] - a[1])[0][0];
      return {
        district: result.location.district,
        label: result.location.label,
        releaseId: result.releaseId,
        decisionCode: result.decision.code,
        decision: result.decision.title,
        peakRisk,
        dominantRisk,
        confidence: result.confidence,
        rainfallMm: result.observed.forecastRainfallMm,
        waterBalanceMm: result.observed.waterBalanceMm,
        antecedentRainfallMm: result.observed.antecedentRainfallMm,
        spatialAgreement: result.uncertainty.spatialAgreement,
      };
    }).sort((a, b) => b.peakRisk - a.peakRisk);

    return Response.json({
      portfolioId: `BK-PORTFOLIO-W35-${crop.toUpperCase()}`,
      modelVersion: results[0].modelCard.version,
      generatedAt: new Date().toISOString(),
      coverage: { districts: ranking.length, crops: 3, horizonDays: 7 },
      ranking,
      productionGate: 'Pilot output. District-held-out calibration and agronomist approval required before operational deployment.',
    }, { headers: { 'Cache-Control': 'no-store', 'X-BK-Model': results[0].modelCard.version } });
  } catch (error) {
    return Response.json({ error: 'Portfolio workflow failed.', detail: error instanceof Error ? error.message : 'Unknown error' }, { status: 502 });
  }
}
