import type { MarkerConfig } from '@photo-sphere-viewer/markers-plugin';

export type GpsPosition = [number, number, number?];
export type Tour360ManualPosition =
  | {
      yaw: string | number;
      pitch: string | number;
    }
  | {
      textureX: number;
      textureY: number;
    };

export type TourHotspotDirection = 'forward' | 'back';
export type TourHotspotStyleVariant = 'floor-arrow' | 'three-d-arrow' | 'up-arrow' | 'down-arrow';

export type Tour360Link = {
  nodeId: string;
  gps?: GpsPosition;
  position?: Tour360ManualPosition;
  data: {
    id: string;
    originSceneId: string;
    destinationSceneId: string;
    label: string;
    visibleText: string;
    tooltipTitle: string;
    tooltipImage: string;
    rotationDeg: number;
    scale: number;
    direction?: TourHotspotDirection;
    styleVariant?: TourHotspotStyleVariant;
  };
};

export type Tour360Node = {
  id: string;
  panorama: string;
  name: string;
  thumbnail: string;
  caption: string;
  description: string;
  defaultYaw: string;
  defaultPitch: string;
  /** Solo requerido cuando el tour usa positionMode "gps"; en modo manual (yaw/pitch por link) no hace falta. */
  gps?: GpsPosition;
  links: Tour360Link[];
  markers?: MarkerConfig[];
};

/**
 * Configuración completa de un tour por sede.
 * Compatible con Photo Sphere Viewer + VirtualTourPlugin.
 */
export type Tour360Config = {
  id: string;
  label: string;
  startNodeId: string;
  nodes: Tour360Node[];
  /** Miniatura para listados del mapa (opcional; se infiere del nodo inicial si falta). */
  thumbnail?: string;
  /**
   * true cuando el tour usa panoramas temporales mientras se suben los finales.
   * Ver `pendingAssetPaths` para las rutas objetivo en public/tours/.
   */
  isPlaceholder?: boolean;
  /**
   * Rutas relativas bajo public/tours/ que aún deben agregarse al repositorio.
   * Ejemplo: "bogota/sede-2/entrada.jpg"
   */
  pendingAssetPaths?: string[];
};

export type Tour360Campus = {
  id: string;
  title: string;
  thumbnail: string;
  tourConfigId: string;
  /** Posición opcional del pin en el mapa estilizado del TourMapSelector (porcentaje 0–100). */
  marker?: {
    x: number;
    y: number;
  };
};

export type Tour360Location = {
  id: string;
  department: string;
  city: string;
  label: string;
  marker: {
    x: number;
    y: number;
  };
  campuses: Tour360Campus[];
};
