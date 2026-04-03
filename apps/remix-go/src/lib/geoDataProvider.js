const SUPPORTED_KEYS = ['GEOCOUNTRY', 'GEOCITY', 'GEOSTATE'];

const FIELD_MAPPING = {
  country: 'GEOCOUNTRY',
  city: 'GEOCITY',
  regionName: 'GEOSTATE',
};

let cachedResult = null;

export async function fetchGeoData() {
  if (cachedResult) return cachedResult;

  try {
    const resp = await fetch('https://ipapi.co/json/');
    const data = await resp.json();
    cachedResult = {
      GEOCOUNTRY: data.country_name || '',
      GEOCITY: data.city || '',
      GEOSTATE: data.region || '',
    };
    return cachedResult;
  } catch {
    return { GEOCOUNTRY: '', GEOCITY: '', GEOSTATE: '' };
  }
}

export function canSupplyAny(customVarKeys) {
  return SUPPORTED_KEYS.some(key => customVarKeys.includes(key));
}

export function clearCache() {
  cachedResult = null;
}

export default {
  fetchGeoData,
  canSupplyAny,
  clearCache,
  SUPPORTED_KEYS,
};
