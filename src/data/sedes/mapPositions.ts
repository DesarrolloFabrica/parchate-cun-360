import type { CityId, SedeMapPosition } from '../../types/sede';

/**
 * Posiciones visuales de pins sobre el SVG de Colombia (porcentaje 0–100).
 * Calibradas para `assets/maps/colombia-departments.svg` (viewBox 613×694).
 */
export const cityMapPositions: Record<CityId, SedeMapPosition> = {
  /** Cundinamarca — centro del país */
  bogota: { x: 48.5, y: 53, lat: 4.711, lng: -74.072 },
  /** Tolima — centro-occidente */
  ibague: { x: 44, y: 57, lat: 4.438, lng: -75.232 },
  /** Antioquia — noroccidente interior */
  medellin: { x: 46.5, y: 41.5, lat: 6.244, lng: -75.581 },
  /** Córdoba — costa Caribe interior */
  monteria: { x: 40, y: 20, lat: 8.748, lng: -75.881 },
  /** Huila — suroccidente interior */
  neiva: { x: 43, y: 65, lat: 2.927, lng: -75.282 },
  /** Magdalena — costa norte */
  'santa-marta': { x: 54, y: 7, lat: 11.241, lng: -74.211 },
  /** Sucre — Caribe interior */
  sincelejo: { x: 46, y: 16, lat: 9.304, lng: -75.398 },
  /** Atlántico — costa norte */
  barranquilla: { x: 45.5, y: 10.5, lat: 10.963, lng: -74.796 },
};

/** @deprecated Usar `cityMapPositions`. */
export const sedeMapPositions = cityMapPositions;
