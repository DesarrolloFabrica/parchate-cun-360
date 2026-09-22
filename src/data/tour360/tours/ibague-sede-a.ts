import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

const ibaguePanoramaPath = (fileName: string) =>
  getPublicPanoramaUrl(`Ibague/${fileName}`);

/** Archivos en `public/panoramas/Ibague/`. */
const FILES = {
  '1': '1.png',
  '2': '2.png',
  '3': '3.png',
  '4': '4.png',
  '5TC': '5TC.png',
  '6Aud': '6Aud.png',
  '6B': '6B.png',
  '7': '7.png',
  '7A': '7A.png',
  '9': '9.png',
  '10': '10.png',
  '10bien': '10bien.png',
  '10sis': '10sis.png',
  '11': '11.png',
  '12A': '12A.png',
  '12B': '12B.png',
  '13A': '13A.png',
  '13B': '13B.png',
  '13C': '13C.png',
  '14': '14.png',
  '14A': '14A.png',
  '14B': '14B.png',
  '15P3': '15P3.png',
  '15a': '15a.png',
} as const;

type IbagueNodeId = keyof typeof FILES;

const panorama = (id: IbagueNodeId) => ibaguePanoramaPath(FILES[id]);

const gps = (index: number): GpsPosition => [
  -75.232 + index * 0.00005,
  4.438 + index * 0.00004,
  0,
];

const forwardPosition = (yaw: string, pitch = '-20deg'): Tour360ManualPosition => ({
  yaw,
  pitch,
});

const backPosition = (yaw: string, pitch = '-18deg'): Tour360ManualPosition => ({
  yaw,
  pitch,
});

/** Subir piso: centro-arriba, separado de bajar. */
const upFloorPosition = (): Tour360ManualPosition => ({
  yaw: '18deg',
  pitch: '4deg',
});

/** Bajar piso / salida: atrás-abajo, sin solapar con subir. */
const downFloorPosition = (): Tour360ManualPosition => ({
  yaw: '-155deg',
  pitch: '-22deg',
});

export const IBAGUE_SEDE_A_START_NODE_ID = '1';

type IbagueLinkInput = {
  from: IbagueNodeId;
  to: IbagueNodeId;
  position: Tour360ManualPosition;
  label: string;
  tooltipTitle: string;
  direction: 'forward' | 'back';
  styleVariant: 'floor-arrow' | 'three-d-arrow' | 'up-arrow' | 'down-arrow';
  rotationDeg: number;
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
}: IbagueLinkInput): Tour360Link => ({
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
    scale: 1,
    direction,
    styleVariant,
  },
});

const createIbagueNode = ({
  id,
  caption,
  description,
  gpsIndex,
  links,
}: {
  id: IbagueNodeId;
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
    name: `Sede Ibagué - ${caption}`,
    caption,
    description,
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: gps(gpsIndex),
    links,
  };
};

/**
 * Recorrido Ibagué:
 * 1 → 2 → 3 → 6Aud → 6B | 7 → 7A | 11
 *   2 → 4 → 5TC
 *   11 → 9 → 10 → 10bien → 10sis
 *   11 → 12A → 12B | 13A → 13B | 13C | 14
 *     14 → 14A → 14B
 *     14 → 15P3 → 15a
 */
export const ibagueSedeANodes: Tour360Node[] = [
  createIbagueNode({
    id: '1',
    caption: 'Fachada exterior punto de encuentro',
    description: 'Fachada exterior punto de encuentro Cra 5 Calle 11.',
    gpsIndex: 1,
    links: [
      createTourLink({
        from: '1',
        to: '2',
        position: forwardPosition('12deg'),
        label: 'Avanzar',
        tooltipTitle: 'Ir a 2',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '2',
    caption: 'Ingreso a la sede CUN Ibagué',
    description: 'Ingreso a la sede CUN Ibagué.',
    gpsIndex: 2,
    links: [
      createTourLink({
        from: '2',
        to: '1',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 1',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '2',
        to: '3',
        position: forwardPosition('-70deg', '-22deg'),
        label: 'Acceder a 3',
        tooltipTitle: 'Ir a 3',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
      createTourLink({
        from: '2',
        to: '4',
        position: forwardPosition('70deg', '-22deg'),
        label: 'Avanzar a 4',
        tooltipTitle: 'Ir a 4 → 5TC',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '3',
    caption: 'Ingreso a Telecampus',
    description: 'Ingreso a Telecampus.',
    gpsIndex: 3,
    links: [
      createTourLink({
        from: '3',
        to: '2',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 2',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '3',
        to: '6Aud',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 6Aud',
        tooltipTitle: 'Ir a auditorio',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '4',
    caption: 'Telecampus',
    description: 'Telecampus.',
    gpsIndex: 4,
    links: [
      createTourLink({
        from: '4',
        to: '2',
        position: backPosition('-150deg'),
        label: 'Volver a 2',
        tooltipTitle: 'Volver a 2',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '4',
        to: '5TC',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 5TC',
        tooltipTitle: 'Ir a 5TC',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '5TC',
    caption: 'Telecampus oficina',
    description: 'Telecampus oficina.',
    gpsIndex: 5,
    links: [
      createTourLink({
        from: '5TC',
        to: '4',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 4',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '6Aud',
    caption: 'Entrada de Auditorio',
    description: 'Entrada de Auditorio.',
    gpsIndex: 6,
    links: [
      createTourLink({
        from: '6Aud',
        to: '3',
        position: backPosition('-150deg'),
        label: 'Volver a 3',
        tooltipTitle: 'Volver a 3',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '6Aud',
        to: '6B',
        position: forwardPosition('-70deg', '-22deg'),
        label: 'Ir a 6B',
        tooltipTitle: 'Ir a 6B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
      createTourLink({
        from: '6Aud',
        to: '7',
        position: forwardPosition('70deg', '-22deg'),
        label: 'Avanzar a 7',
        tooltipTitle: 'Ir a 7',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '6B',
    caption: 'Auditorio primer piso',
    description: 'Auditorio primer piso.',
    gpsIndex: 7,
    links: [
      createTourLink({
        from: '6B',
        to: '6Aud',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a auditorio',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '7',
    caption: 'Sede CUN Primer Piso Canchas',
    description: 'Sede CUN Primer Piso Canchas.',
    gpsIndex: 8,
    links: [
      createTourLink({
        from: '7',
        to: '6Aud',
        position: backPosition('-150deg'),
        label: 'Volver a 6Aud',
        tooltipTitle: 'Volver a auditorio',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '7',
        to: '7A',
        position: forwardPosition('70deg', '-22deg'),
        label: 'Ir a 7A',
        tooltipTitle: 'Ir a 7A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
      createTourLink({
        from: '7',
        to: '11',
        position: forwardPosition('-80deg', '-22deg'),
        label: 'Avanzar a 11',
        tooltipTitle: 'Ir a 11 (izquierda)',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
    ],
  }),
  createIbagueNode({
    id: '7A',
    caption: 'Sala de Alta Moda',
    description: 'Sala de Alta Moda.',
    gpsIndex: 9,
    links: [
      createTourLink({
        from: '7A',
        to: '7',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 7',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '11',
    caption: 'Cafetería Piso 1',
    description: 'Cafetería Piso 1.',
    gpsIndex: 11,
    links: [
      createTourLink({
        from: '11',
        to: '7',
        position: backPosition('-150deg'),
        label: 'Volver a 7',
        tooltipTitle: 'Volver a 7',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '11',
        to: '9',
        position: forwardPosition('-80deg', '-22deg'),
        label: 'Avanzar a 9',
        tooltipTitle: 'Ruta 9 → 10sis',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
      createTourLink({
        from: '11',
        to: '12A',
        position: upFloorPosition(),
        label: 'Subir piso a 12A',
        tooltipTitle: 'Subir a 12A',
        direction: 'forward',
        styleVariant: 'up-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createIbagueNode({
    id: '9',
    caption: 'Césped sintético y sillas cafetería',
    description: 'Césped sintético y sillas cafetería.',
    gpsIndex: 12,
    links: [
      createTourLink({
        from: '9',
        to: '11',
        position: backPosition('-150deg'),
        label: 'Volver a 11',
        tooltipTitle: 'Volver a 11',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '9',
        to: '10',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 10',
        tooltipTitle: 'Ir a 10',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '10',
    caption: 'Ingreso a Bienestar',
    description: 'Ingreso a Bienestar.',
    gpsIndex: 13,
    links: [
      createTourLink({
        from: '10',
        to: '9',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 9',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '10',
        to: '10bien',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 10bien',
        tooltipTitle: 'Ir a 10bien',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '10bien',
    caption: 'Oficina de bienestar',
    description: 'Oficina de bienestar.',
    gpsIndex: 14,
    links: [
      createTourLink({
        from: '10bien',
        to: '10',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 10',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '10bien',
        to: '10sis',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 10sis',
        tooltipTitle: 'Ir a 10sis',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '10sis',
    caption: 'Sala de sistemas',
    description: 'Sala de sistemas.',
    gpsIndex: 15,
    links: [
      createTourLink({
        from: '10sis',
        to: '10bien',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 10bien',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '12A',
    caption: 'Piso 2 - Ingreso emisora',
    description: 'Piso 2 - Ingreso emisora.',
    gpsIndex: 16,
    links: [
      createTourLink({
        from: '12A',
        to: '11',
        position: downFloorPosition(),
        label: 'Bajar a 11',
        tooltipTitle: 'Volver a 11',
        direction: 'back',
        styleVariant: 'down-arrow',
        rotationDeg: 180,
      }),
      createTourLink({
        from: '12A',
        to: '12B',
        position: forwardPosition('-70deg', '-22deg'),
        label: 'Avanzar a 12B',
        tooltipTitle: 'Ir a 12B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
      createTourLink({
        from: '12A',
        to: '13A',
        position: upFloorPosition(),
        label: 'Subir piso a 13A',
        tooltipTitle: 'Subir a 13A',
        direction: 'forward',
        styleVariant: 'up-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createIbagueNode({
    id: '12B',
    caption: 'Emisora',
    description: 'Emisora.',
    gpsIndex: 17,
    links: [
      createTourLink({
        from: '12B',
        to: '12A',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 12A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '13A',
    caption: 'Piso 2 - Ingreso sala de dibujo y auditorio',
    description: 'Piso 2 - Ingreso a sala de dibujo y auditorio.',
    gpsIndex: 18,
    links: [
      createTourLink({
        from: '13A',
        to: '12A',
        position: downFloorPosition(),
        label: 'Bajar a 12A',
        tooltipTitle: 'Volver a 12A',
        direction: 'back',
        styleVariant: 'down-arrow',
        rotationDeg: 180,
      }),
      createTourLink({
        from: '13A',
        to: '13B',
        position: forwardPosition('-80deg', '-22deg'),
        label: 'Avanzar a 13B',
        tooltipTitle: 'Ir a 13B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
      createTourLink({
        from: '13A',
        to: '13C',
        position: forwardPosition('80deg', '-22deg'),
        label: 'Avanzar a 13C',
        tooltipTitle: 'Ir a 13C',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
      createTourLink({
        from: '13A',
        to: '14',
        position: upFloorPosition(),
        label: 'Subir piso a 14',
        tooltipTitle: 'Subir a 14',
        direction: 'forward',
        styleVariant: 'up-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createIbagueNode({
    id: '13B',
    caption: 'Sala de dibujo',
    description: 'Sala de dibujo.',
    gpsIndex: 19,
    links: [
      createTourLink({
        from: '13B',
        to: '13A',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 13A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '13C',
    caption: 'Auditorio Piso 2',
    description: 'Auditorio Piso 2.',
    gpsIndex: 20,
    links: [
      createTourLink({
        from: '13C',
        to: '13A',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 13A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '14',
    caption: 'Piso 3',
    description: 'Piso 3.',
    gpsIndex: 21,
    links: [
      createTourLink({
        from: '14',
        to: '13A',
        position: downFloorPosition(),
        label: 'Bajar a 13A',
        tooltipTitle: 'Volver a 13A',
        direction: 'back',
        styleVariant: 'down-arrow',
        rotationDeg: 180,
      }),
      createTourLink({
        from: '14',
        to: '14A',
        position: forwardPosition('-70deg', '-22deg'),
        label: 'Avanzar a 14A',
        tooltipTitle: 'Ir a 14A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 250,
      }),
      createTourLink({
        from: '14',
        to: '15P3',
        position: forwardPosition('70deg', '-22deg'),
        label: 'Avanzar a 15P3',
        tooltipTitle: 'Ir a 15P3',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '14A',
    caption: 'Ingreso sala de música Piso 3',
    description: 'Ingreso a la sala de música Piso 3.',
    gpsIndex: 22,
    links: [
      createTourLink({
        from: '14A',
        to: '14',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 14',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '14A',
        to: '14B',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 14B',
        tooltipTitle: 'Ir a 14B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '14B',
    caption: 'Sala de música',
    description: 'Sala de música.',
    gpsIndex: 23,
    links: [
      createTourLink({
        from: '14B',
        to: '14A',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 14A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createIbagueNode({
    id: '15P3',
    caption: 'Ingreso biblioteca',
    description: 'Ingreso biblioteca (Interior piso 3).',
    gpsIndex: 24,
    links: [
      createTourLink({
        from: '15P3',
        to: '14',
        position: backPosition('-150deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 14',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '15P3',
        to: '15a',
        position: forwardPosition('28deg'),
        label: 'Avanzar a 15a',
        tooltipTitle: 'Ir a 15a',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createIbagueNode({
    id: '15a',
    caption: 'Biblioteca',
    description: 'Biblioteca.',
    gpsIndex: 25,
    links: [
      createTourLink({
        from: '15a',
        to: '15P3',
        position: backPosition('-145deg'),
        label: 'Regresar',
        tooltipTitle: 'Volver a 15P3',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
];

export const ibagueSedeATourConfig: Tour360Config = {
  id: 'ibague-sede-a',
  label: 'Sede Ibagué',
  startNodeId: IBAGUE_SEDE_A_START_NODE_ID,
  thumbnail: panorama('1'),
  nodes: ibagueSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
