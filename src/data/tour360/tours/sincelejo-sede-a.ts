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

const forwardPosition = (nodeNumber: number): Tour360ManualPosition => ({
  yaw: `${14 + (nodeNumber % 5) * 8}deg`,
  pitch: '-18deg',
});

const backPosition = (nodeNumber: number): Tour360ManualPosition => ({
  yaw: `${-150 + (nodeNumber % 5) * 7}deg`,
  pitch: '-16deg',
});

const getStyleVariant = (nodeNumber: number): 'floor-arrow' | 'three-d-arrow' =>
  nodeNumber <= 4 ? 'floor-arrow' : 'three-d-arrow';

type SincelejoLinkInput = {
  from: number;
  to: number;
  direction: 'forward' | 'back';
  position: Tour360ManualPosition;
};

const createTourLink = ({
  from,
  to,
  direction,
  position,
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
      rotationDeg: isForward ? 110 : 220,
      scale: isForward ? 1 : 0.95,
      direction,
      styleVariant: getStyleVariant(from),
    },
  };
};

const createSincelejoNode = (nodeNumber: number): Tour360Node => {
  const panorama = sincelejoPanoramaPath(nodeNumber);
  const links: Tour360Link[] = [];

  if (nodeNumber > 1) {
    links.push(
      createTourLink({
        from: nodeNumber,
        to: nodeNumber - 1,
        direction: 'back',
        position: backPosition(nodeNumber),
      }),
    );
  }

  if (nodeNumber < SINCELEJO_NODE_COUNT) {
    links.push(
      createTourLink({
        from: nodeNumber,
        to: nodeNumber + 1,
        direction: 'forward',
        position: forwardPosition(nodeNumber),
      }),
    );
  }

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

export const sincelejoSedeANodes: Tour360Node[] = Array.from(
  { length: SINCELEJO_NODE_COUNT },
  (_, index) => createSincelejoNode(index + 1),
);

export const sincelejoSedeATourConfig: Tour360Config = {
  id: 'sincelejo-sede-a',
  label: 'Sede Sincelejo A',
  startNodeId: SINCELEJO_SEDE_A_START_NODE_ID,
  thumbnail: sincelejoPanoramaPath(1),
  nodes: sincelejoSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
