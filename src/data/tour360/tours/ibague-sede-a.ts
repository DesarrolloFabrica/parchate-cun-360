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
        position: { yaw: '1.6deg', pitch: '-9.8deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir a Ingreso a la sede',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
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
        position: {
          "yaw": "166.1deg",
          "pitch": "-18.9deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a la Entrada',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '2',
        to: '3',
        position: {
          "yaw": "331.0deg",
          "pitch": "-6.7deg"
      },
        label: 'Interior de Canchas',
        tooltipTitle: 'Ir a Canchas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '2',
        to: '4',
        position: {
          "yaw": "60.0deg",
          "pitch": "-14.7deg"
      },
        label: 'Avanzar a Telecampus',
        tooltipTitle: 'Ingreso al telecampus',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "135.0deg",
          "pitch": "-8.4deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Lobby',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
      }),
      createTourLink({
        from: '3',
        to: '6Aud',
        position: {
          "yaw": "252.5deg",
          "pitch": "-9.7deg"
      },
        label: 'Avanzar a Canchas',
        tooltipTitle: 'Ir a auditorio',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: { yaw: '-150deg', pitch: '-18deg' },
        label: 'Volver a Lobby',
        tooltipTitle: 'Regresar',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
      }),
      createTourLink({
        from: '4',
        to: '5TC',
        position: {
          "yaw": "300.1deg",
          "pitch": "-9.1deg"
      },
        label: 'Avanzar a Salon de Juegos',
        tooltipTitle: 'Ingreso al salon de juegos',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),

  //OFICINA TELECAMPUS
  createIbagueNode({
    id: '5TC',
    caption: 'Telecampus oficina',
    description: 'Telecampus oficina.',
    gpsIndex: 5,
    links: [
      createTourLink({
        from: '5TC',
        to: '4',
        position: { yaw: '-145deg', pitch: '-18deg' },
        label: 'Regresar',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),

  //CANCHAS 1
  createIbagueNode({
    id: '6Aud',
    caption: 'Entrada de Auditorio',
    description: 'Entrada de Auditorio.',
    gpsIndex: 6,
    links: [
      createTourLink({
        from: '6Aud',
        to: '3',
        position: {
          "yaw": "227.4deg",
          "pitch": "-12.3deg"
      },
        label: 'Volver',
        tooltipTitle: 'Volver a Entrada de Canchas',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '6Aud',
        to: '6B',
        position: {
          "yaw": "345.4deg",
          "pitch": "-15.7deg"
      },
        label: 'Auditorio',
        tooltipTitle: 'Ingreso al auditorio',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '6Aud',
        to: '7',
        position: {
          "yaw": "111.8deg",
          "pitch": "-22.6deg"
      },
        label: 'Avanzar a Canchas',
        tooltipTitle: 'Ir a Interior de sede',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
    "yaw": "67.1deg",
    "pitch": "-0.5deg"
},
        label: 'Regresar',
        tooltipTitle: 'Volver a canchas',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "56.5deg",
          "pitch": "-3.0deg"
      },
        label: 'Volver a Canchas 1',
        tooltipTitle: 'Volver a auditorio - Lobby',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '7',
        to: '7A',
        position: {
          "yaw": "189.9deg",
          "pitch": "-14.3deg"
      },
        label: 'Sala de Moda',
        tooltipTitle: 'Ir a la Sala de Alta Moda',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '7',
        to: '11',
        position: {
          "yaw": "264.1deg",
          "pitch": "-3.6deg"
      },
        label: 'Cafeteria',
        tooltipTitle: 'Ir a 11 (izquierda)',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "23.4deg",
          "pitch": "2.7deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Canchas',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "200.6deg",
          "pitch": "-1.4deg"
      },
        label: 'Volver a Mitad de canchas',
        tooltipTitle: 'Mitad de canchas: Alta moda',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '11',
        to: '9',
        position: {
          "yaw": "250.3deg",
          "pitch": "-9.4deg"
      },
        label: 'Cesped sintetico',
        tooltipTitle: 'Ir a Cesped sintético - Sala de sistemas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '11',
        to: '10bien',
        position: {
          "yaw": "146.4deg",
          "pitch": "-5.5deg"
      },
        label: 'Oficina de bienestar',
        tooltipTitle: 'Ir a Oficina de bienestar',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '11',
        to: '12A',
        position: {
          "yaw": "63.0deg",
          "pitch": "-5.8deg"
      },
        label: 'Segundo piso',
        tooltipTitle: 'Subir a segundo piso',
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
        position: {
          "yaw": "282.3deg",
          "pitch": "-4.7deg"
      },
        label: 'Volver a Cafeteria',
        tooltipTitle: 'Regresar a canchas - Cafeteria - Escaleras Piso 1',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '9',
        to: '10',
        position: {
          "yaw": "155.7deg",
          "pitch": "-18.4deg"
      },
        label: 'Avanzar a Pasillo Lateral',
        tooltipTitle: 'Ir a Sala de Sistemas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createIbagueNode({
    id: '10',
    caption: 'Pasillo Lateral',
    description: 'Pasillo Lateral.',
    gpsIndex: 13,
    links: [
      createTourLink({
        from: '10',
        to: '9',
        position: {
          "yaw": "221.4deg",
          "pitch": "-16.3deg"},
        label: 'Regresar',
        tooltipTitle: 'Volver a Cesped',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '10',
        to: '10sis',
        position: {
          "yaw": "354.8deg",
          "pitch": "-10.4deg"
      },
        label: 'Sala de sistemas',
        tooltipTitle: 'Ingreso a sala de sistemas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        to: '11',
        position: {
          "yaw": "198.0deg",
          "pitch": "2.8deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Cafeteria',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        to: '10',
        position: {
          "yaw": "165.3deg",
          "pitch": "-14.9deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Pasillo Lateral',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "321.0deg",
          "pitch": "-7.7deg"
      },
        label: 'Bajar a Piso 1',
        tooltipTitle: 'Volver al piso 1 - Cafeteria',
        direction: 'forward',
        styleVariant: 'down-arrow',
        rotationDeg: -180,
      }),
      createTourLink({
        from: '12A',
        to: '12B',
        position: {
          "yaw": "130.0deg",
          "pitch": "-1.8deg"
      },
        label: 'Emisora',
        tooltipTitle: 'Avanzar a emisora',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '12A',
        to: '13A',
        position: {
          "yaw": "221.7deg",
          "pitch": "4.4deg"
      },
        label: 'Avanzar a Pasillo Piso 2',
        tooltipTitle: 'Avanzar a Sala de Dibujo y Auditorio',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
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
        position: { yaw: '-145deg', pitch: '-18deg' },
        label: 'Regresar',
        tooltipTitle: 'Volver a Piso 2 - Ingreso',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "134.6deg",
          "pitch": "-0.1deg"
      },
        label: 'Volver a entrada',
        tooltipTitle: 'Volver a entrada de piso 2',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '13A',
        to: '13B',
        position: {
          "yaw": "205.9deg",
          "pitch": "-1.5deg"
      },
        label: 'Sala de dibujo',
        tooltipTitle: 'Avanzar a sala de dibujo',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '13A',
        to: '13C',
        position: {
          "yaw": "244.6deg",
          "pitch": "-0.0deg"
      },
      label: 'Auditorio piso 2',
      tooltipTitle: 'Avanzar al Auditorio piso 2',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '13A',
        to: '14',
        position: upFloorPosition(),
        label: 'Subir piso 3',
        tooltipTitle: 'Subir a Piso 3',
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
        position: { yaw: '-145deg', pitch: '-18deg' },
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
        position: {
          "yaw": "138.5deg",
          "pitch": "-1.1deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Piso 2 - Pasillo',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        label: 'Bajar a Piso 2',
        tooltipTitle: 'Volver a Piso 2 - Pasillo',
        direction: 'back',
        styleVariant: 'down-arrow',
        rotationDeg: 180,
      }),
      createTourLink({
        from: '14',
        to: '14A',
        position: {
          "yaw": "84.2deg",
          "pitch": "-4.6deg"
      },
        label: 'Avanzar a Sala de música',
        tooltipTitle: 'Ir por el pasillo lateral a Sala de música',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '14',
        to: '15P3',
        position: {
          "yaw": "353.2deg",
          "pitch": "-4.8deg"
      },
        label: 'Pasillo izquierdo',
        tooltipTitle: 'Ir por el pasillo izquierdo a Biblioteca',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createIbagueNode({
    id: '14A',
    caption: 'Pasillo derecho',
    description: 'Ingreso a la sala de música Piso 3.',
    gpsIndex: 22,
    links: [
      createTourLink({
        from: '14A',
        to: '14',
        position: {
          "yaw": "282.2deg",
          "pitch": "1.5deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Entrada piso 3',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '14A',
        to: '14B',
        position: {
          "yaw": "208.9deg",
          "pitch": "-9.0deg"
      },
        label: 'Sala de música',
        tooltipTitle: 'Ir a Sala de música',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "162.9deg",
          "pitch": "-15.8deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Entrada Sala de música',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "98.8deg",
          "pitch": "3.9deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a entrada piso 3',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '15P3',
        to: '15a',
        position: {
          "yaw": "217.5deg",
          "pitch": "-3.9deg"
      },
        label: 'Biblioteca',
        tooltipTitle: 'Avanzar a Biblioteca',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        position: {
          "yaw": "163.7deg",
          "pitch": "-13.6deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a pasillo izquierdo',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
