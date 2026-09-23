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
};

const createTourLink = ({
  from,
  to,
  direction,
  position,
  rotationDeg,
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
      styleVariant: getStyleVariant(from),
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
          yaw: '315.3deg',
          pitch: '-7.6deg',
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
        position: { yaw: '-136deg', pitch: '-16deg' },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 2,
        to: 3,
        direction: 'forward',
        position: { yaw: '30deg', pitch: '-18deg' },
        rotationDeg: 0,
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
        position: { yaw: '-129deg', pitch: '-16deg' },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 3,
        to: 4,
        direction: 'forward',
        position: { yaw: '38deg', pitch: '-18deg' },
        rotationDeg: 0,
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
        position: { yaw: '-122deg', pitch: '-16deg' },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 4,
        to: 5,
        direction: 'forward',
        position: { yaw: '46deg', pitch: '-18deg' },
        rotationDeg: 0,
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
        position: { yaw: '-150deg', pitch: '-16deg' },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 5,
        to: 6,
        direction: 'forward',
        position: { yaw: '14deg', pitch: '-18deg' },
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
        position: { yaw: '-143deg', pitch: '-16deg' },
        rotationDeg: 0,
      }),
      createTourLink({
        from: 6,
        to: 7,
        direction: 'forward',
        position: { yaw: '22deg', pitch: '-18deg' },
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
