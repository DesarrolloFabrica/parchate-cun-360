import type { Tour360Node } from '../data/tour360Nodes';

export type CityId =
  | 'bogota'
  | 'ibague'
  | 'medellin'
  | 'monteria'
  | 'neiva'
  | 'santa-marta'
  | 'sincelejo'
  | 'barranquilla';

export type CampusId =
  | 'bogota-sede-a'
  | 'bogota-sede-fph'
  | 'bogota-sede-gi'
  | 'bogota-sede-e'
  | 'bogota-sede-j'
  | 'bogota-sede-d'
  | 'bogota-sede-c'
  | 'ibague-campus'
  | 'medellin-campus'
  | 'monteria-campus'
  | 'neiva-campus'
  | 'santa-marta-campus'
  | 'sincelejo-campus'
  | 'barranquilla-campus';

/** Alias de compatibilidad: el parámetro `?sede=` resuelve a un campus. */
export type SedeId = CampusId;

export type SedeStatus = 'active' | 'coming_soon';

export interface SedeMapPosition {
  /** Posición en el SVG del mapa de Colombia (0–100 %) */
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

export interface SedeTour360Config {
  enabled: boolean;
  startNodeId: string;
  nodes: Tour360Node[];
}

export interface SedeNarrative {
  chapter?: string;
  mission?: string;
  title: string;
  description: string;
  nextStep?: string;
  reward?: string;
  ctaLabel?: string;
  guide: string;
}

export interface CityConfig {
  id: CityId;
  name: string;
  shortName: string;
  region: string;
  mapPosition: SedeMapPosition;
  campusIds: CampusId[];
}

export interface CampusConfig {
  id: CampusId;
  cityId: CityId;
  name: string;
  shortName: string;
  status: SedeStatus;
  previewImage: string;
  tour360: SedeTour360Config;
  narrative: SedeNarrative;
}

/** Alias de compatibilidad con componentes que aún usan `SedeConfig`. */
export type SedeConfig = CampusConfig;

/** Pin del mapa nacional (ciudad). */
export interface MapCityPin {
  id: CityId;
  shortName: string;
  mapPosition: SedeMapPosition;
  status: SedeStatus;
}

export function isCampusTour360Available(campus: CampusConfig): boolean {
  return campus.status === 'active' && campus.tour360.enabled && campus.tour360.nodes.length > 0;
}

/** @deprecated Usar `isCampusTour360Available`. */
export function isSedeTour360Available(sede: CampusConfig): boolean {
  return isCampusTour360Available(sede);
}
