import { calculateClimateModel, climateDistricts, type ClimateCrop, type ClimateDistrict, type ClimateModelResult, type ForecastDay } from '@/lib/climate-model';

const monthKeys = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

type OpenMeteoResponse = {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    et0_fao_evapotranspiration: number[];
    wind_speed_10m_max: number[];
  };
  hourly: { time: string[]; soil_moisture_0_to_1cm: number[]; relative_humidity_2m: number[] };
};

type NasaPowerResponse = {
  properties: { parameter: { PRECTOTCORR: Record<string, number>; T2M: Record<string, number> } };
  header?: { api?: { version?: string }; sources?: string[] };
};

export type ClimateRun = ClimateModelResult & {
  upstream: {
    forecastRequest: string;
    baselineRequest: string;
    nasaApiVersion: string;
    nasaSources: string[];
  };
};

export async function runClimateModel(districtKey: ClimateDistrict, crop: ClimateCrop, stage: string): Promise<ClimateRun> {
  const district = climateDistricts[districtKey];
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.searchParams.set('latitude', `${district.latitude},${district.latitude + 0.12},${district.latitude - 0.12}`);
  forecastUrl.searchParams.set('longitude', `${district.longitude},${district.longitude},${district.longitude}`);
  forecastUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,wind_speed_10m_max');
  forecastUrl.searchParams.set('hourly', 'soil_moisture_0_to_1cm,relative_humidity_2m');
  forecastUrl.searchParams.set('timezone', 'Asia/Kolkata');
  forecastUrl.searchParams.set('forecast_days', '7');
  forecastUrl.searchParams.set('past_days', '7');

  const baselineUrl = new URL('https://power.larc.nasa.gov/api/temporal/climatology/point');
  baselineUrl.searchParams.set('parameters', 'PRECTOTCORR,T2M');
  baselineUrl.searchParams.set('community', 'AG');
  baselineUrl.searchParams.set('longitude', String(district.longitude));
  baselineUrl.searchParams.set('latitude', String(district.latitude));
  baselineUrl.searchParams.set('start', '2001');
  baselineUrl.searchParams.set('end', '2020');
  baselineUrl.searchParams.set('format', 'JSON');

  const [forecastResponse, baselineResponse] = await Promise.all([
    fetch(forecastUrl, { cache: 'no-store', headers: { Accept: 'application/json' } }),
    fetch(baselineUrl, { cache: 'no-store', headers: { Accept: 'application/json' } }),
  ]);
  if (!forecastResponse.ok || !baselineResponse.ok) throw new Error(`Upstream status ${forecastResponse.status}/${baselineResponse.status}`);

  const forecastPayload = await forecastResponse.json() as OpenMeteoResponse | OpenMeteoResponse[];
  const forecastPoints = Array.isArray(forecastPayload) ? forecastPayload : [forecastPayload];
  const forecastJson = forecastPoints[0];
  const baselineJson = await baselineResponse.json() as NasaPowerResponse;
  const forecastStart = Math.max(0, forecastJson.daily.time.length - 7);
  const forecast: ForecastDay[] = forecastJson.daily.time.slice(forecastStart).map((date, offset) => {
    const index = forecastStart + offset;
    return {
    date,
    temperatureMax: forecastJson.daily.temperature_2m_max[index],
    temperatureMin: forecastJson.daily.temperature_2m_min[index],
    precipitation: forecastJson.daily.precipitation_sum[index],
    precipitationProbability: forecastJson.daily.precipitation_probability_max[index],
    evapotranspiration: forecastJson.daily.et0_fao_evapotranspiration[index],
    windMax: forecastJson.daily.wind_speed_10m_max[index],
  }; });
  const antecedentRainfallMm = forecastJson.daily.precipitation_sum.slice(0, forecastStart).reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
  const spatialRainfallTotalsMm = forecastPoints.map((point) => point.daily.precipitation_sum.slice(-7).reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0));
  const currentHourIndex = Math.max(0, forecastJson.hourly.time.findIndex((time) => time.startsWith(forecast[0].date)));
  const firstDate = new Date(`${forecast[0].date}T00:00:00Z`);
  const monthKey = monthKeys[firstDate.getUTCMonth()];
  const generatedAt = new Date().toISOString();
  const result = calculateClimateModel({
    district: districtKey,
    crop,
    stage,
    forecast,
    soilMoisture: forecastJson.hourly.soil_moisture_0_to_1cm.slice(Math.max(0, currentHourIndex - 24), currentHourIndex + 1),
    relativeHumidity: forecastJson.hourly.relative_humidity_2m.slice(currentHourIndex, currentHourIndex + 168),
    antecedentRainfallMm,
    spatialRainfallTotalsMm,
    climateNormal: {
      rainfallMmPerDay: baselineJson.properties.parameter.PRECTOTCORR[monthKey],
      temperatureC: baselineJson.properties.parameter.T2M[monthKey],
    },
    generatedAt,
  });

  return {
    ...result,
    upstream: {
      forecastRequest: forecastUrl.toString(),
      baselineRequest: baselineUrl.toString(),
      nasaApiVersion: baselineJson.header?.api?.version || 'unknown',
      nasaSources: baselineJson.header?.sources || [],
    },
  };
}
