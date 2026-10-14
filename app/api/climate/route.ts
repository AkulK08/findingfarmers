import { runClimateModel } from '@/lib/climate-data';
import type { ClimateCrop, ClimateDistrict } from '@/lib/climate-model';

const allowedCrops = new Set<ClimateCrop>(['maize', 'rice', 'wheat']);
const allowedDistricts = new Set<ClimateDistrict>(['samastipur', 'darbhanga', 'muzaffarpur', 'gaya', 'purnia']);
export async function GET(request: Request) {
  const url = new URL(request.url);
  const districtParam = (url.searchParams.get('district') || 'samastipur') as ClimateDistrict;
  const cropParam = (url.searchParams.get('crop') || 'maize') as ClimateCrop;
  const stage = url.searchParams.get('stage') || 'vegetative';

  if (!allowedDistricts.has(districtParam) || !allowedCrops.has(cropParam)) {
    return Response.json({ error: 'Unsupported district or crop.' }, { status: 400 });
  }

  try {
    const result = await runClimateModel(districtParam, cropParam, stage);

    return Response.json(result, { headers: { 'Cache-Control': 'no-store', 'X-BK-Model': result.modelCard.version } });
  } catch (error) {
    return Response.json({ error: 'Climate data workflow failed.', detail: error instanceof Error ? error.message : 'Unknown error' }, { status: 502 });
  }
}
