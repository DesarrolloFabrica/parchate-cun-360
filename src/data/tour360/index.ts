/**
 * Registro central de tours 360 por sede.
 *
 * Estructura de assets objetivo (public/, sin import estático):
 *   public/tours/bogota/sede-{N}/{escena}.jpg
 *
 * Para agregar una sede nueva:
 * 1. Crear src/data/tour360/tours/{config-id}.ts con nodos y links PSV.
 * 2. Registrar aquí en tour360Configs.
 * 3. Vincular tourConfigId en src/data/tour360Locations.ts.
 *
 * Sedes sin recorrido completo: usar createPlaceholderTourConfig().
 */

import type { Tour360Config } from './types';
import { bogotaSede1TourConfig } from './tours/bogota-sede-1';
import { bogotaSede2TourConfig } from './tours/bogota-sede-2';
import { ibagueSedeATourConfig } from './tours/ibague-sede-a';
import { monteriaSedeATourConfig } from './tours/monteria-sede-a';
import { neivaSedeATourConfig } from './tours/neiva-sede-a';
import { santaMartaSedeATourConfig } from './tours/santa-marta-sede-a';
import { sincelejoSedeATourConfig } from './tours/sincelejo-sede-a';
import { createPlaceholderTourConfig } from './tours/createPlaceholderTour';
import { KNOWN_GOOD_PLACEHOLDER_PANORAMA } from './panoramaUrls';

const bogotaPlaceholderTours = [3, 4, 5, 6, 7, 8].map((sedeNumber) =>
  createPlaceholderTourConfig({
    id: `bogota-sede-${sedeNumber}`,
    label: `Sede Bogotá ${sedeNumber}`,
    tourFolder: `bogota/sede-${sedeNumber}`,
    pendingScenes: [
      { sceneId: 'entrada', fileName: 'entrada.jpg' },
      // Agregar más escenas cuando existan los assets:
      // { sceneId: 'lobby', fileName: 'lobby.jpg' },
    ],
  }),
);

export const tour360Configs: Record<string, Tour360Config> = {
  'bogota-sede-1': bogotaSede1TourConfig,
  'bogota-sede-2': bogotaSede2TourConfig,
  'ibague-sede-a': ibagueSedeATourConfig,
  'monteria-sede-a': monteriaSedeATourConfig,
  'neiva-sede-a': neivaSedeATourConfig,
  'santa-marta-sede-a': santaMartaSedeATourConfig,
  'sincelejo-sede-a': sincelejoSedeATourConfig,
  ...Object.fromEntries(bogotaPlaceholderTours.map((config) => [config.id, config])),
};

export const getTour360ConfigById = (tourConfigId: string): Tour360Config | null => {
  return tour360Configs[tourConfigId] ?? null;
};

export const getTour360ConfigThumbnail = (config: Tour360Config): string => {
  if (config.thumbnail) return config.thumbnail;

  const startNode =
    config.nodes.find((node) => node.id === config.startNodeId) ?? config.nodes[0];

  return startNode?.thumbnail ?? startNode?.panorama ?? KNOWN_GOOD_PLACEHOLDER_PANORAMA;
};

export type { Tour360Campus, Tour360Config, Tour360Link, Tour360Location, Tour360Node } from './types';
export type { TourHotspotDirection, TourHotspotStyleVariant, GpsPosition } from './types';
export {
  DEPLOY_FALLBACK_PANORAMA,
  KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  getBundledPanoramaUrl,
  getPublicPanoramaUrl,
  getPublicTourPanoramaUrl,
  resolveLegacyPanoramaUrl,
  resolvePanoramaUrl,
  resolveTourPanorama,
} from './panoramaUrls';
