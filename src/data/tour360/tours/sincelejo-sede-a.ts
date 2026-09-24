import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

const SINCELEJO_NODE_COUNT = 7;
export const SINCELEJO_SEDE_A_START_NODE_ID = '1';

const sincelejoPanoramaPath = (nodeNumber: number) =>
  getPublicPanoramaUrl(`Sincelejo/${nodeNumber}.png`);

const sincelejoGps = (nodeNumber: number): GpsPosition => [
  -75.398 + nodeNumber * 0.00004,
  9.304 + nodeNumber * 0.00003,
  0,
];

const getStyleVariant = (nodeNumber: number): 'floor-arrow' | 'three-d-arrow' =>
  nodeNumber <= 4 ? 'floor-arrow' : 'three-d-arrow';

type SincelejoLinkInput = {
  from: number;
  to: number;
  direction: 'forward' | 'back';
  position: Tour360ManualPosition;
  rotationDeg: number;
  styleVariant?: 'floor-arrow' | 'three-d-arrow';
};

const createTourLink = ({
  from,
  to,
  direction,
  position,
  rotationDeg,
  styleVariant = getStyleVariant(from),
}: SincelejoLinkInput): Tour360Link => {
  const targetImage = sincelejoPanoramaPath(to);
  const isForward = direction === 'forward';

  return {
    nodeId: String(to),
    position,
    data: {
      id: `${from}-to-${to}`,
      originSceneId: String(from),
      destinationSceneId: String(to),
      label: isForward ? 'Avanzar' : 'Regresar',
      visibleText: isForward ? 'Avanzar' : 'Regresar',
      tooltipTitle: isForward ? `Ir al punto ${to}` : `Regresar al punto ${to}`,
      tooltipImage: targetImage,
      rotationDeg,
      scale: isForward ? 1 : 0.95,
      direction,
      styleVariant,
    },
  };
};

const createSincelejoNode = ({
  nodeNumber,
  links,
}: {
  nodeNumber: number;
  links: Tour360Link[];
}): Tour360Node => {
  const panorama = sincelejoPanoramaPath(nodeNumber);

  return {
    id: String(nodeNumber),
    panorama,
    thumbnail: panorama,
    name: `Sede Sincelejo - Punto ${nodeNumber}`,
    caption: nodeNumber === 1 ? 'Inicio del recorrido' : `Punto ${nodeNumber}`,
    description:
      nodeNumber === SINCELEJO_NODE_COUNT
        ? 'Ultima estacion del recorrido 360 de Sincelejo.'
        : `Punto ${nodeNumber} del recorrido 360 de la Sede Sincelejo.`,
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: sincelejoGps(nodeNumber),
    links,
  };
};

export const sincelejoSedeANodes: Tour360Node[] = [
  createSincelejoNode({
    nodeNumber: 1,
    links: [
      createTourLink({
        from: 1,
        to: 2,
        direction: 'forward',
        position: {
          "yaw": "173.0deg",
          "pitch": "-1.0deg"
      },
        rotationDeg: -90,
      }),
    ],
  }),
  createSincelejoNode({
    nodeNumber: 2,
    links: [
      createTourLink({
        from: 2,
        to: 1,
        direction: 'back',
        position: {
          "yaw": "3.5deg",
          "pitch": "-2.8deg"
      },
        rotationDeg: -90,
      }),
      createTourLink({
        from: 2,
        to: 3,
        direction: 'forward',
        position: {
          "yaw": "86.2deg",
          "pitch": "-2.0deg"
      },
        rotationDeg: -90,
      }),
    ],
  }),
  createSincelejoNode({
    nodeNumber: 3,
    links: [
      createTourLink({
        from: 3,
        to: 2,
        direction: 'back',
        position: {
          "yaw": "158.0deg",
          "pitch": "-25.5deg"
      },
        rotationDeg: 0,
        styleVariant: 'three-d-arrow',
      }),
      createTourLink({
        from: 3,
        to: 4,
        direction: 'forward',
        position: {
          "yaw": "347.1deg",
          "pitch": "25.8deg"
      },
        rotationDeg: 0,
        styleVariant: 'three-d-arrow',
      }),
    ],
  }),
  createSincelejoNode({
    nodeNumber: 4,
    links: [
      createTourLink({
        from: 4,
        to: 3,
        direction: 'back',
        position: {
          "yaw": "176.0deg",
          "pitch": "-13.9deg"
      },
        rotationDeg: 0,
        styleVariant: 'three-d-arrow',
      }),
      createTourLink({
        from: 4,
        to: 5,
        direction: 'forward',
        position: {
          "yaw": "350.7deg",
          "pitch": "0.1deg"
      },
        rotationDeg: 0,
        styleVariant: 'three-d-arrow',
      }),
    ],
  }),
  createSincelejoNode({
    nodeNumber: 5,
    links: [
      createTourLink({
        from: 5,
        to: 4,
        direction: 'back',
        position: {
          "yaw": "137.5deg",
          "pitch": "-7.5deg"
      },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 5,
        to: 6,
        direction: 'forward',
        position: {
          "yaw": "233.4deg",
          "pitch": "-9.4deg"
      },
        rotationDeg: 0,
      }),
    ],
  }),
  createSincelejoNode({
    nodeNumber: 6,
    links: [
      createTourLink({
        from: 6,
        to: 5,
        direction: 'back',
        position: {
          "yaw": "50.0deg",
          "pitch": "-6.1deg"
      },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 6,
        to: 7,
        direction: 'forward',
        position: {
          "yaw": "303.8deg",
          "pitch": "-25.7deg"
      },
        rotationDeg: 0,
      }),
    ],
  }),
  createSincelejoNode({
    nodeNumber: 7,
    links: [
      createTourLink({
        from: 7,
        to: 6,
        direction: 'back',
        position: { yaw: '-136deg', pitch: '-16deg' },
        rotationDeg: 0,
      }),
    ],
  }),
];

export const sincelejoSedeATourConfig: Tour360Config = {
  id: 'sincelejo-sede-a',
  label: 'Sede Sincelejo A',
  startNodeId: SINCELEJO_SEDE_A_START_NODE_ID,
  thumbnail: sincelejoPanoramaPath(1),
  nodes: sincelejoSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
