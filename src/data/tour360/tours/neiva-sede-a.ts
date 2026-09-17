import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

const neivaPanoramaPath = (fileName: string) =>
  getPublicPanoramaUrl(`Neiva/${fileName}`);

/** Archivos reales en `public/panoramas/Neiva/`. */
const FILES = {
  '1': '1 FACHADA – ENTRADA.png',
  '2': '2ENTRADA, INGRESO A TELECAMPUS - CANCHAS.png',
  '3': '3.TELECAMPUS – CANCHAS.png',
  '4': '4.png',
  '5': '5.BLOQUE C BIBLIOTECA, SALONES DE CONFECCIONES.png',
  '6': '6.png',
  '7': '7.png',
  '8': '8.BLOQUE D SALA DE SISTEMAS 1-2-3  SALON DE AEROGRAFIA  LABORATORIO DE COMUNICACIÓN Y TELEVISION  SOPORTE TECNICO.png',
  '9AG': '9AG.png',
  '10D': '10D.png',
  '11TV': '11TV.png',
  '12A': '12A.png',
  '12B': '12B.png',
  '14': '14 BLOQUE A.png',
  '15A': '15A.png',
  '15B': '15B.png',
} as const;

type NeivaNodeId = keyof typeof FILES;

const panorama = (id: NeivaNodeId) => neivaPanoramaPath(FILES[id]);

const gps = (index: number): GpsPosition => [
  -75.282 + index * 0.00005,
  2.927 + index * 0.00004,
  0,
];

const forwardPosition = (yaw: string): Tour360ManualPosition => ({
  yaw,
  pitch: '-18deg',
});

const backPosition = (yaw: string): Tour360ManualPosition => ({
  yaw,
  pitch: '-16deg',
});

export const NEIVA_SEDE_A_START_NODE_ID = '1';

type NeivaLinkInput = {
  from: NeivaNodeId;
  to: NeivaNodeId;
  position: Tour360ManualPosition;
  label: string;
  tooltipTitle: string;
  direction: 'forward' | 'back';
  styleVariant: 'floor-arrow' | 'three-d-arrow';
  rotationDeg: number;
  scale?: number;
};

const createTourLink = ({
  from,
  to,
  position,
  label,
  tooltipTitle,
  direction,
  styleVariant,
  rotationDeg,
  scale = 1,
}: NeivaLinkInput): Tour360Link => ({
  nodeId: to,
  position,
  data: {
    id: `${from}-to-${to}`,
    originSceneId: from,
    destinationSceneId: to,
    label,
    visibleText: label,
    tooltipTitle,
    tooltipImage: panorama(to),
    rotationDeg,
    scale,
    direction,
    styleVariant,
  },
});

const createNeivaNode = ({
  id,
  caption,
  description,
  gpsIndex,
  links,
}: {
  id: NeivaNodeId;
  caption: string;
  description: string;
  gpsIndex: number;
  links: Tour360Link[];
}): Tour360Node => {
  const image = panorama(id);
  return {
    id,
    panorama: image,
    thumbnail: image,
    name: `Sede Neiva - ${caption}`,
    caption,
    description,
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: gps(gpsIndex),
    links,
  };
};

/**
 * Recorrido Neiva:
 * 1 Fachada → 2 Entrada → 3 Telecampus
 * Desde 3:
 *   - Avanzar a 4
 *   - Bloque A (14) → 15A → 15B
 *   - Bloque C (5) → 6 → 7
 *   - Bloque D (8) → (9AG → 10D) | (11TV → 12A → 12B)
 */
export const neivaSedeANodes: Tour360Node[] = [
  createNeivaNode({
    id: '1',
    caption: 'Fachada entrada',
    description: 'Fachada e ingreso principal de la Sede Neiva.',
    gpsIndex: 1,
    links: [
      createTourLink({
        from: '1',
        to: '2',
        position: forwardPosition('12deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a entrada Telecampus',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '2',
    caption: 'Entrada Telecampus',
    description: 'Ingreso a Telecampus y zona de canchas.',
    gpsIndex: 2,
    links: [
      createTourLink({
        from: '2',
        to: '1',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a fachada',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '2',
        to: '3',
        position: forwardPosition('20deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a Telecampus',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '3',
    caption: 'Telecampus',
    description: 'Hub central: puedes avanzar a 4 o acceder a Bloque A, Bloque C o Bloque D.',
    gpsIndex: 3,
    links: [
      createTourLink({
        from: '3',
        to: '2',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a entrada',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '3',
        to: '4',
        position: forwardPosition('10deg'),
        label: 'Avanzar a 4',
        tooltipTitle: 'Avanzar a 4',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
      createTourLink({
        from: '3',
        to: '14',
        position: forwardPosition('-55deg'),
        label: 'Acceder a Bloque A',
        tooltipTitle: 'Bloque A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 70,
      }),
      createTourLink({
        from: '3',
        to: '5',
        position: forwardPosition('55deg'),
        label: 'Acceder a Bloque C',
        tooltipTitle: 'Bloque C',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
      createTourLink({
        from: '3',
        to: '8',
        position: forwardPosition('110deg'),
        label: 'Acceder a Bloque D',
        tooltipTitle: 'Bloque D',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 140,
      }),
    ],
  }),
  createNeivaNode({
    id: '4',
    caption: 'Punto 4',
    description: 'Estacion 4 del recorrido de Neiva.',
    gpsIndex: 4,
    links: [
      createTourLink({
        from: '4',
        to: '3',
        position: backPosition('-150deg'),
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),

  // ——— Bloque C ———
  createNeivaNode({
    id: '5',
    caption: 'Bloque C',
    description: 'Bloque C: biblioteca y salones de confecciones.',
    gpsIndex: 5,
    links: [
      createTourLink({
        from: '5',
        to: '3',
        position: backPosition('-150deg'),
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '5',
        to: '6',
        position: forwardPosition('28deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 6',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '6',
    caption: 'Bloque C · 6',
    description: 'Interior Bloque C, punto 6.',
    gpsIndex: 6,
    links: [
      createTourLink({
        from: '6',
        to: '5',
        position: backPosition('-140deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque C',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '6',
        to: '7',
        position: forwardPosition('36deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 7',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '7',
    caption: 'Bloque C · 7',
    description: 'Ultima estacion del Bloque C.',
    gpsIndex: 7,
    links: [
      createTourLink({
        from: '7',
        to: '6',
        position: backPosition('-132deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 6',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),

  // ——— Bloque D ———
  createNeivaNode({
    id: '8',
    caption: 'Bloque D',
    description: 'Bloque D: salas de sistemas, aerografia, TV y soporte. Bifurca a 9AG o 11TV.',
    gpsIndex: 8,
    links: [
      createTourLink({
        from: '8',
        to: '3',
        position: backPosition('-150deg'),
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '8',
        to: '9AG',
        position: forwardPosition('-40deg'),
        label: 'Ir a 9AG',
        tooltipTitle: 'Ruta 9AG → 10D',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 70,
      }),
      createTourLink({
        from: '8',
        to: '11TV',
        position: forwardPosition('45deg'),
        label: 'Ir a 11TV',
        tooltipTitle: 'Ruta 11TV → 12B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '9AG',
    caption: 'Bloque D · 9AG',
    description: 'Rama 9AG del Bloque D.',
    gpsIndex: 9,
    links: [
      createTourLink({
        from: '9AG',
        to: '8',
        position: backPosition('-140deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque D',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '9AG',
        to: '10D',
        position: forwardPosition('28deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 10D',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '10D',
    caption: 'Bloque D · 10D',
    description: 'Final de la rama 9AG → 10D.',
    gpsIndex: 10,
    links: [
      createTourLink({
        from: '10D',
        to: '9AG',
        position: backPosition('-132deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 9AG',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),
  createNeivaNode({
    id: '11TV',
    caption: 'Bloque D · 11TV',
    description: 'Rama de television del Bloque D.',
    gpsIndex: 11,
    links: [
      createTourLink({
        from: '11TV',
        to: '8',
        position: backPosition('-140deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque D',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '11TV',
        to: '12A',
        position: forwardPosition('28deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 12A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '12A',
    caption: 'Bloque D · 12A',
    description: 'Continuacion de la rama 11TV.',
    gpsIndex: 12,
    links: [
      createTourLink({
        from: '12A',
        to: '11TV',
        position: backPosition('-132deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 11TV',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '12A',
        to: '12B',
        position: forwardPosition('36deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 12B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '12B',
    caption: 'Bloque D · 12B',
    description: 'Final de la rama 11TV → 12B.',
    gpsIndex: 13,
    links: [
      createTourLink({
        from: '12B',
        to: '12A',
        position: backPosition('-124deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 12A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),

  // ——— Bloque A ———
  createNeivaNode({
    id: '14',
    caption: 'Bloque A',
    description: 'Acceso al Bloque A.',
    gpsIndex: 14,
    links: [
      createTourLink({
        from: '14',
        to: '3',
        position: backPosition('-150deg'),
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '14',
        to: '15A',
        position: forwardPosition('28deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 15A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '15A',
    caption: 'Bloque A · 15A',
    description: 'Interior Bloque A, punto 15A.',
    gpsIndex: 15,
    links: [
      createTourLink({
        from: '15A',
        to: '14',
        position: backPosition('-140deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '15A',
        to: '15B',
        position: forwardPosition('36deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 15B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createNeivaNode({
    id: '15B',
    caption: 'Bloque A · 15B',
    description: 'Ultima estacion del Bloque A.',
    gpsIndex: 16,
    links: [
      createTourLink({
        from: '15B',
        to: '15A',
        position: backPosition('-132deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 15A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),
];

export const neivaSedeATourConfig: Tour360Config = {
  id: 'neiva-sede-a',
  label: 'Sede Neiva',
  startNodeId: NEIVA_SEDE_A_START_NODE_ID,
  thumbnail: panorama('1'),
  nodes: neivaSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
