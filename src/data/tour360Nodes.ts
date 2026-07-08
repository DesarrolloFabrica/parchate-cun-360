/**
 * Re-export de compatibilidad.
 * El tour completo de Sede Bogotá 1 vive en ./tour360/tours/bogota-sede-1.ts.
 * Nuevas sedes: registrar en ./tour360/index.ts, no aquí.
 */

export type {
  GpsPosition,
  Tour360Link,
  Tour360Node,
  TourHotspotDirection,
  TourHotspotStyleVariant,
} from './tour360/types';

export {
  BOGOTA_SEDE_1_START_NODE_ID as TOUR360_START_NODE_ID,
  bogotaSede1Nodes as tour360Nodes,
  bogotaSede1AvailablePanoramaFiles as tour360AvailablePanoramaFiles,
} from './tour360/tours/bogota-sede-1';

export {
  getTour360ConfigById,
  getTour360ConfigThumbnail,
  tour360Configs,
} from './tour360';
