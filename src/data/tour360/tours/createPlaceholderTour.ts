import {
  KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  getPublicTourPanoramaUrl,
} from '../panoramaUrls';
import type { Tour360Config } from '../types';

export type PlaceholderTourParams = {
  id: string;
  label: string;
  /** Slug de carpeta, ej. "bogota/sede-2" → public/tours/bogota/sede-2/ */
  tourFolder: string;
  startSceneId?: string;
  /** Panorama temporal mientras no exista el asset final */
  fallbackPanorama?: string;
  pendingScenes?: Array<{
    sceneId: string;
    fileName: string;
  }>;
};

/**
 * Genera un tour mínimo de un solo nodo para sedes sin recorrido completo.
 * Las rutas finales quedan documentadas en pendingAssetPaths sin romper el build.
 */
export function createPlaceholderTourConfig({
  id,
  label,
  tourFolder,
  startSceneId = 'entrada',
  fallbackPanorama = KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  pendingScenes = [{ sceneId: 'entrada', fileName: 'entrada.jpg' }],
}: PlaceholderTourParams): Tour360Config {
  const pendingAssetPaths = pendingScenes.map(
    (scene) => `${tourFolder}/${scene.fileName}`,
  );

  const primaryScene = pendingScenes[0];
  const targetPanoramaUrl = getPublicTourPanoramaUrl(
    `${tourFolder}/${primaryScene.fileName}`,
  );

  return {
    id,
    label,
    startNodeId: startSceneId,
    thumbnail: fallbackPanorama,
    isPlaceholder: true,
    pendingAssetPaths,
    nodes: [
      {
        id: startSceneId,
        // Usar fallback verificado hasta que exista targetPanoramaUrl en public/tours/
        panorama: fallbackPanorama,
        thumbnail: fallbackPanorama,
        name: `${label} — En preparación`,
        caption: 'Recorrido en preparación',
        description: `Panorama objetivo: ${targetPanoramaUrl}. Sustituir fallback cuando el asset esté en public/tours/.`,
        defaultYaw: '0deg',
        defaultPitch: '0deg',
        gps: [0, 0, 0],
        links: [],
      },
    ],
  };
}
