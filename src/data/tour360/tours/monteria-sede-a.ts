import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

export const MONTERIA_SEDE_A_START_NODE_ID = '1';

const monteriaPanoramaPath = (nodeNumber: number) =>
  getPublicPanoramaUrl(`monteria/${nodeNumber}.png`);

const monteriaGps = (nodeNumber: number): GpsPosition => [
  -75.881 + nodeNumber * 0.00004,
  8.748 + nodeNumber * 0.00003,
  0,
];

type MonteriaLinkInput = {
  from: string;
  to: string;
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
}: MonteriaLinkInput): Tour360Link => ({
  nodeId: to,
  position,
  data: {
    id: `${from}-to-${to}`,
    originSceneId: from,
    destinationSceneId: to,
    label,
    visibleText: label,
    tooltipTitle,
    tooltipImage: monteriaPanoramaPath(Number(to)),
    rotationDeg,
    scale,
    direction,
    styleVariant,
  },
});

const createMonteriaNode = ({
  id,
  caption,
  description,
  gpsIndex,
  links,
}: {
  id: string;
  caption: string;
  description: string;
  gpsIndex: number;
  links: Tour360Link[];
}): Tour360Node => {
  const image = monteriaPanoramaPath(Number(id));
  return {
    id,
    panorama: image,
    thumbnail: image,
    name: `Sede Monteria - ${caption}`,
    caption,
    description,
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: monteriaGps(gpsIndex),
    links,
  };
};

/**
 * Recorrido Monteria: 1 → 2 → … → 10 y 6 ↔ 12 → … → 18 (punto 11 oculto).
 * Puntos 1-2: exterior/llegada (floor-arrow). Puntos 3+: three-d-arrow.
 */
export const monteriaSedeANodes: Tour360Node[] = [
  createMonteriaNode({
    id: '1',
    caption: 'Punto 1',
    description: 'Punto 1 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 1,
    links: [
      createTourLink({
        from: '1',
        to: '2',
        position: { yaw: '18.4deg', pitch: '-16.7deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir al punto 2',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '2',
    caption: 'Punto 2',
    description: 'Punto 2 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 2,
    links: [
      createTourLink({
        from: '2',
        to: '1',
        position: { yaw: '-136deg', pitch: '-16deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 1',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 180,
        scale: 0.95,
      }),
      createTourLink({
        from: '2',
        to: '3',
        position: { yaw: '30deg', pitch: '-18deg' },
        label: 'Entrar a Sede',
        tooltipTitle: 'Entrar a la Sede',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '3',
    caption: 'Punto 3',
    description: 'Punto 3 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 3,
    links: [
      createTourLink({
        from: '3',
        to: '2',
        position: { yaw: '-129deg', pitch: '-16deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 2',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '3',
        to: '4',
        position: { yaw: '38deg', pitch: '-18deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir al punto 4',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '4',
    caption: 'Punto 4',
    description: 'Punto 4 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 4,
    links: [
      createTourLink({
        from: '4',
        to: '3',
        position: {
          "yaw": "355.4deg",
          "pitch": "-17.3deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar al exterior',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '4',
        to: '5',
        position: {
          "yaw": "61.0deg",
          "pitch": "-14.9deg"
      },
        label: 'Escaleras',
        tooltipTitle: 'Ir al escaleras',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '5',
    caption: 'Punto 5',
    description: 'Punto 5 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 5,
    links: [
      createTourLink({
        from: '5',
        to: '4',
        position: { yaw: '-52deg', pitch: '-21deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 4',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '5',
        to: '6',
        position: { yaw: '52deg', pitch: '-21deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir al punto 6',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '6',
    caption: 'Punto 6',
    description: 'Piso 2 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 6,
    links: [
      createTourLink({
        from: '6',
        to: '5',
        position: {
          "yaw": "242.3deg",
          "pitch": "-23.5deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 5',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '6',
        to: '7',
        position: {
          "yaw": "338.4deg",
          "pitch": "-2.7deg"
      },
        label: 'Sala de juegos',
        tooltipTitle: 'Ir a SALA DE JUEGOS',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
      createTourLink({
        from: '6',
        to: '12',
        position: {
          "yaw": "279.5deg",
          "pitch": "-4.4deg"
      },
        label: 'Piso 3',
        tooltipTitle: 'Subir a siguiente piso',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '7',
    caption: 'Punto 7',
    description: 'Punto 7 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 7,
    links: [
      createTourLink({
        from: '7',
        to: '6',
        position: {
          "yaw": "68.3deg",
          "pitch": "-4.0deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar a escaleras ',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '7',
        to: '8',
        position: {
          "yaw": "274.8deg",
          "pitch": "-9.1deg"
      },
        label: 'Avanzar',
        tooltipTitle: 'Ir a salon de juegos',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '8',
    caption: 'Punto 8',
    description: 'Punto 8 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 8,
    links: [
      createTourLink({
        from: '8',
        to: '7',
        position: { yaw: '-129deg', pitch: '-16deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 7',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '8',
        to: '9',
        position: { yaw: '38deg', pitch: '-18deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir al punto 9',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '9',
    caption: 'Punto 9',
    description: 'Punto 9 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 9,
    links: [
      createTourLink({
        from: '9',
        to: '8',
        position: { yaw: '-122deg', pitch: '-16deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '9',
        to: '10',
        position: { yaw: '46deg', pitch: '-18deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir a Area administrativa',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '10',
    caption: 'Area administrativa',
    description: 'Area Administrativa del recorrido 360 de la Sede Monteria.',
    gpsIndex: 10,
    links: [
      createTourLink({
        from: '10',
        to: '9',
        position: { yaw: '-150deg', pitch: '-16deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 9',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),

    ],
  }),
  createMonteriaNode({
    id: '12',
    caption: 'Punto 12',
    description: 'Punto 12 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 12,
    links: [
      createTourLink({
        from: '12',
        to: '6',
        position: { yaw: '-52deg', pitch: '-21deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al piso 2',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '12',
        to: '13',
        position: { yaw: '52deg', pitch: '-21deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir al piso 3',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '13',
    caption: 'Piso 3',
    description: 'Piso 3del recorrido 360 de la Sede Monteria.',
    gpsIndex: 13,
    links: [
      createTourLink({
        from: '13',
        to: '12',
        position: {
          "yaw": "216.3deg",
          "pitch": "-29.0deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar al piso 2',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '13',
        to: '14',
        position:{
          "yaw": "333.0deg",
          "pitch": "-8.7deg"
      },
        label: 'Area de sistemas',
        tooltipTitle: 'Ir a Area de sistemas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),

      createTourLink({
        from: '13',
        to: '15',
        position: {
          "yaw": "276.5deg",
          "pitch": "-16.8deg"
      },
        label: 'Subir piso',
        tooltipTitle: 'Ir al ingreso de piso 4',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '14',
    caption: 'Area de sistemas',
    description: 'Punto 14 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 14,
    links: [
      createTourLink({
        from: '14',
        to: '13',
        position: { yaw: '-122deg', pitch: '-16deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar al punto 13',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
    ],
  }),
  createMonteriaNode({
    id: '15',
    caption: 'Punto 15',
    description: 'Punto 15 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 15,
    links: [
      createTourLink({
        from: '15',
        to: '13',
        position: { yaw: '-52deg', pitch: '-21deg' },
        label: 'Regresar',
        tooltipTitle: 'Regresar a la entrada del piso 3',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '15',
        to: '16',
        position: { yaw: '52deg', pitch: '-21deg' },
        label: 'Avanzar',
        tooltipTitle: 'Ir al punto 16',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '16',
    caption: 'Punto 16',
    description: 'Punto 16 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 16,
    links: [
      createTourLink({
        from: '16',
        to: '15',
        position: {
          "yaw": "239.4deg",
          "pitch": "-22.2deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar a piso de abajo',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '16',
        to: '17',
        position: {
          "yaw": "137.7deg",
          "pitch": "4.7deg"
      },
        label: 'Biblioteca',
        tooltipTitle: 'Ir a biblioteca',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
      createTourLink({
        from: '16',
        to: '19',
        position:       {
          "yaw": "297.4deg",
          "pitch": "-7.2deg"
      },
        label: 'Piso 5',
        tooltipTitle: 'Ir a piso 5',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '17',
    caption: 'Punto 17',
    description: 'Punto 17 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 17,
    links: [
      createTourLink({
        from: '17',
        to: '16',
        position: {
          "yaw": "329.5deg",
          "pitch": "-2.1deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar a pasillo piso 4',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '17',
        to: '18',
        position: {
          "yaw": "50.8deg",
          "pitch": "1.3deg"
      },
        label: 'Sala de juntas',
        tooltipTitle: 'Ir a sala de juntas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createMonteriaNode({
    id: '18',
    caption: 'Sala de juntas',
    description: 'Sala de juntas del recorrido 360 de la Sede Monteria.',
    gpsIndex: 18,
    links: [
      createTourLink({
        from: '18',
        to: '17',
        position: {
          "yaw": "341.0deg",
          "pitch": "-2.7deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar a biblioteca',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
    ],
  }),
  createMonteriaNode({
    id: '19',
    caption: 'Piso 5',
    description: 'Piso 5 del recorrido 360 de la Sede Monteria.',
    gpsIndex: 19,
    links: [
      createTourLink({
        from: '19',
        to: '16',
        position: {
          "yaw": "341.0deg",
          "pitch": "-20.6deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Regresar al piso 4',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
    ],
  }),
];

export const monteriaSedeATourConfig: Tour360Config = {
  id: 'monteria-sede-a',
  label: 'Sede Monteria',
  startNodeId: MONTERIA_SEDE_A_START_NODE_ID,
  thumbnail: monteriaPanoramaPath(1),
  nodes: monteriaSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
