import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

const MONTERIA_NODE_COUNT = 18;
export const MONTERIA_SEDE_A_START_NODE_ID = '1';
const MONTERIA_STAIR_NODE_IDS = new Set([4, 5, 6, 11, 12, 13, 15, 16]);

const monteriaPanoramaPath = (nodeNumber: number) =>
  getPublicPanoramaUrl(`monteria/${nodeNumber}.png`);

const monteriaGps = (nodeNumber: number): GpsPosition => [
  -75.881 + nodeNumber * 0.00004,
  8.748 + nodeNumber * 0.00003,
  0,
];

const forwardPosition = (nodeNumber: number): Tour360ManualPosition => ({
  yaw: MONTERIA_STAIR_NODE_IDS.has(nodeNumber)
    ? '52deg'
    : `${14 + (nodeNumber % 5) * 8}deg`,
  pitch: MONTERIA_STAIR_NODE_IDS.has(nodeNumber) ? '-21deg' : '-18deg',
});

const backPosition = (nodeNumber: number): Tour360ManualPosition => ({
  yaw: MONTERIA_STAIR_NODE_IDS.has(nodeNumber)
    ? '-52deg'
    : `${-150 + (nodeNumber % 5) * 7}deg`,
  pitch: MONTERIA_STAIR_NODE_IDS.has(nodeNumber) ? '-21deg' : '-16deg',
});

const getStyleVariant = (nodeNumber: number) =>
  nodeNumber <= 5 ? 'floor-arrow' : 'three-d-arrow';

const getRotationDeg = (nodeNumber: number, direction: 'forward' | 'back') => {
  if (!MONTERIA_STAIR_NODE_IDS.has(nodeNumber)) {
    return direction === 'forward' ? 110 : 220;
  }

  return direction === 'forward' ? 0 : 180;
};

type MonteriaLinkInput = {
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
}: MonteriaLinkInput): Tour360Link => {
  const targetImage = monteriaPanoramaPath(to);
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
      rotationDeg: getRotationDeg(from, direction),
      scale: isForward ? 1 : 0.95,
      direction,
      // Regla inicial: 1 a 5 exterior/llegada, 6 a 18 interior.
      styleVariant: getStyleVariant(from),
    },
  };
};

const createMonteriaNode = (nodeNumber: number): Tour360Node => {
  const panorama = monteriaPanoramaPath(nodeNumber);
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

  if (nodeNumber < MONTERIA_NODE_COUNT) {
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
    name: `Sede Monteria - Punto ${nodeNumber}`,
    caption: `Punto ${nodeNumber}`,
    description: `Punto ${nodeNumber} del recorrido 360 de la Sede Monteria.`,
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: monteriaGps(nodeNumber),
    links,
  };
};

export const monteriaSedeANodes: Tour360Node[] = Array.from(
  { length: MONTERIA_NODE_COUNT },
  (_, index) => createMonteriaNode(index + 1),
);

export const monteriaSedeATourConfig: Tour360Config = {
  id: 'monteria-sede-a',
  label: 'Sede Monteria',
  startNodeId: MONTERIA_SEDE_A_START_NODE_ID,
  thumbnail: monteriaPanoramaPath(1),
  nodes: monteriaSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
