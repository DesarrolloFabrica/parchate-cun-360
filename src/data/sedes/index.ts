import { bogotaCampuses } from './campuses/bogotaCampuses';
import { otherCityCampuses } from './campuses/otherCities';
import { bogotaCity } from './cities/bogota';
import {
  barranquillaCity,
  ibagueCity,
  medellinCity,
  monteriaCity,
  neivaCity,
  santaMartaCity,
  sincelejoCity,
} from './cities/other';
import type {
  CampusConfig,
  CampusId,
  CityConfig,
  CityId,
  MapCityPin,
  SedeId,
} from '../../types/sede';

export const DEFAULT_CAMPUS_ID: CampusId = 'bogota-sede-a';

/** @deprecated Usar `DEFAULT_CAMPUS_ID`. */
export const DEFAULT_SEDE_ID: SedeId = DEFAULT_CAMPUS_ID;

export const CITY_IDS: CityId[] = [
  'bogota',
  'ibague',
  'medellin',
  'monteria',
  'neiva',
  'santa-marta',
  'sincelejo',
  'barranquilla',
];

export const CAMPUS_IDS: CampusId[] = [
  'bogota-sede-a',
  'bogota-sede-fph',
  'bogota-sede-gi',
  'bogota-sede-e',
  'bogota-sede-j',
  'bogota-sede-d',
  'bogota-sede-c',
  'ibague-campus',
  'medellin-campus',
  'monteria-campus',
  'neiva-campus',
  'santa-marta-campus',
  'sincelejo-campus',
  'barranquilla-campus',
];

const LEGACY_CAMPUS_ALIASES: Record<string, CampusId> = {
  bogota: 'bogota-sede-a',
  ibague: 'ibague-campus',
  medellin: 'medellin-campus',
  monteria: 'monteria-campus',
  neiva: 'neiva-campus',
  'santa-marta': 'santa-marta-campus',
  sincelejo: 'sincelejo-campus',
  barranquilla: 'barranquilla-campus',
};

export const CITIES: Record<CityId, CityConfig> = {
  bogota: bogotaCity,
  ibague: ibagueCity,
  medellin: medellinCity,
  monteria: monteriaCity,
  neiva: neivaCity,
  'santa-marta': santaMartaCity,
  sincelejo: sincelejoCity,
  barranquilla: barranquillaCity,
};

export const CAMPUSES: Record<CampusId, CampusConfig> = Object.fromEntries(
  [...bogotaCampuses, ...otherCityCampuses].map((campus) => [campus.id, campus]),
) as Record<CampusId, CampusConfig>;

/** @deprecated Usar `CAMPUSES`. */
export const SEDES = CAMPUSES;

export function isValidCityId(value: string): value is CityId {
  return (CITY_IDS as readonly string[]).includes(value);
}

export function isValidCampusId(value: string): value is CampusId {
  return (CAMPUS_IDS as readonly string[]).includes(value);
}

/** @deprecated Usar `isValidCampusId`. */
export function isValidSedeId(value: string): value is SedeId {
  return isValidCampusId(value);
}

export function resolveCampusId(param: string | null | undefined): CampusId {
  if (!param) {
    return DEFAULT_CAMPUS_ID;
  }

  if (isValidCampusId(param)) {
    return param;
  }

  const legacy = LEGACY_CAMPUS_ALIASES[param];
  if (legacy) {
    return legacy;
  }

  return DEFAULT_CAMPUS_ID;
}

/** @deprecated Usar `resolveCampusId`. */
export function resolveSedeId(param: string | null | undefined): SedeId {
  return resolveCampusId(param);
}

export function getCityConfig(id: CityId): CityConfig {
  return CITIES[id];
}

export function getCampusConfig(id: CampusId): CampusConfig {
  return CAMPUSES[id];
}

/** @deprecated Usar `getCampusConfig`. */
export function getSedeConfig(id: SedeId): CampusConfig {
  return getCampusConfig(id);
}

export function getAllCities(): CityConfig[] {
  return CITY_IDS.map((id) => CITIES[id]);
}

export function getCampusesByCityId(cityId: CityId): CampusConfig[] {
  return CITIES[cityId].campusIds.map((campusId) => CAMPUSES[campusId]);
}

export function cityHasMultipleCampuses(cityId: CityId): boolean {
  return CITIES[cityId].campusIds.length > 1;
}

export function getCityMapStatus(cityId: CityId): MapCityPin['status'] {
  const hasActive = getCampusesByCityId(cityId).some((campus) => campus.status === 'active');
  return hasActive ? 'active' : 'coming_soon';
}

export function getMapCityPins(): MapCityPin[] {
  return getAllCities().map((city) => ({
    id: city.id,
    shortName: city.shortName,
    mapPosition: city.mapPosition,
    status: getCityMapStatus(city.id),
  }));
}

/** @deprecated Usar `getMapCityPins` o `getAllCities`. */
export function getAllSedes(): CampusConfig[] {
  return CAMPUS_IDS.map((id) => CAMPUSES[id]);
}

export function getActiveCampuses(): CampusConfig[] {
  return CAMPUS_IDS.map((id) => CAMPUSES[id]).filter((campus) => campus.status === 'active');
}

/** @deprecated Usar `getActiveCampuses`. */
export function getActiveSedes(): CampusConfig[] {
  return getActiveCampuses();
}
