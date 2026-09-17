import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
  GpsPosition,
  Tour360Config,
  Tour360Link,
  Tour360ManualPosition,
  Tour360Node,
} from '../types';

const santaMartaPanoramaPath = (fileName: string) =>
  getPublicPanoramaUrl(`Santa Marta/${fileName}`);

/** Extensiones según archivos reales en `public/panoramas/Santa Marta/`. */
const SantaMarta1A = santaMartaPanoramaPath('1A.png');
const SantaMarta2A = santaMartaPanoramaPath('2A.png');
const SantaMarta3A = santaMartaPanoramaPath('3A.png');
const SantaMarta4A = santaMartaPanoramaPath('4A.png');
const SantaMarta5A = santaMartaPanoramaPath('5A.jpg');
const SantaMarta6A = santaMartaPanoramaPath('6A.png');
const SantaMarta7A = santaMartaPanoramaPath('7A.png');
const SantaMarta8A = santaMartaPanoramaPath('8A.png');
const SantaMarta9A = santaMartaPanoramaPath('9A.png');
const SantaMarta10A = santaMartaPanoramaPath('10A.png');
const SantaMarta11B = santaMartaPanoramaPath('11B.png');
const SantaMarta12B = santaMartaPanoramaPath('12B.png');
const SantaMarta13B = santaMartaPanoramaPath('13B.png');

const santaMarta1AGps: GpsPosition = [-74.211, 11.241, 0];
const santaMarta2AGps: GpsPosition = [-74.2109, 11.24104, 0];
const santaMarta3AGps: GpsPosition = [-74.2108, 11.24108, 0];
const santaMarta4AGps: GpsPosition = [-74.2107, 11.24112, 0];
const santaMarta5AGps: GpsPosition = [-74.2106, 11.24116, 0];
const santaMarta6AGps: GpsPosition = [-74.2105, 11.2412, 0];
const santaMarta7AGps: GpsPosition = [-74.2104, 11.24124, 0];
const santaMarta8AGps: GpsPosition = [-74.2103, 11.24128, 0];
const santaMarta9AGps: GpsPosition = [-74.2102, 11.24132, 0];
const santaMarta10AGps: GpsPosition = [-74.2101, 11.24136, 0];
const santaMarta11BGps: GpsPosition = [-74.2111, 11.2411, 0];
const santaMarta12BGps: GpsPosition = [-74.2112, 11.24116, 0];
const santaMarta13BGps: GpsPosition = [-74.2113, 11.24122, 0];

const forwardPosition = (yaw: string): Tour360ManualPosition => ({
  yaw,
  pitch: '-18deg',
});

const backPosition = (yaw: string): Tour360ManualPosition => ({
  yaw,
  pitch: '-16deg',
});

export const SANTA_MARTA_SEDE_A_START_NODE_ID = '1A';

type SantaMartaLinkInput = {
  from: string;
  to: string;
  position: Tour360ManualPosition;
  targetImage: string;
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
  targetImage,
  label,
  tooltipTitle,
  direction,
  styleVariant,
  rotationDeg,
  scale = 1,
}: SantaMartaLinkInput): Tour360Link => ({
  nodeId: to,
  position,
  data: {
    id: `${from}-to-${to}`,
    originSceneId: from,
    destinationSceneId: to,
    label,
    visibleText: label,
    tooltipTitle,
    tooltipImage: targetImage,
    rotationDeg,
    scale,
    direction,
    styleVariant,
  },
});

const createSantaMartaNode = ({
  id,
  panorama,
  caption,
  description,
  gps,
  links,
}: {
  id: string;
  panorama: string;
  caption: string;
  description: string;
  gps: GpsPosition;
  links: Tour360Link[];
}): Tour360Node => ({
  id,
  panorama,
  thumbnail: panorama,
  name: `Sede Santa Marta - ${id}`,
  caption,
  description,
  defaultYaw: '0deg',
  defaultPitch: '0deg',
  gps,
  links,
});

/**
 * Recorrido:
 * - Troncal: 1A → 10A
 * - Bifurcación en 2A: volver a 1A | avanzar a 3A | avanzar a 11B
 * - Rama B: 11B → 12B → 13B (regreso a 2A desde 11B)
 */
export const santaMartaSedeANodes: Tour360Node[] = [
  createSantaMartaNode({
    id: '1A',
    panorama: SantaMarta1A,
    caption: 'Inicio del recorrido',
    description: 'Punto inicial del recorrido 360 de la Sede Santa Marta.',
    gps: santaMarta1AGps,
    links: [
      createTourLink({
        from: '1A',
        to: '2A',
        position: forwardPosition('12deg'),
        targetImage: SantaMarta2A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 2A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '2A',
    panorama: SantaMarta2A,
    caption: 'Bifurcación 2A',
    description: 'Desde aquí puedes continuar por la ruta A (3A) o tomar la rama B (11B).',
    gps: santaMarta2AGps,
    links: [
      createTourLink({
        from: '2A',
        to: '1A',
        position: backPosition('-150deg'),
        targetImage: SantaMarta1A,
        label: 'Volver a 1A',
        tooltipTitle: 'Volver a 1A',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '2A',
        to: '3A',
        // Calle derecha del cruce
        position: forwardPosition('48deg'),
        targetImage: SantaMarta3A,
        label: 'Avanzar a 3A',
        tooltipTitle: 'Avanzar a 3A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
      createTourLink({
        from: '2A',
        to: '11B',
        // Calle izquierda (Hotel La Economia)
        position: forwardPosition('-42deg'),
        targetImage: SantaMarta11B,
        label: 'Avanzar a 11B',
        tooltipTitle: 'Avanzar a 11B',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 70,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '3A',
    panorama: SantaMarta3A,
    caption: 'Estacion 3A',
    description: 'Tercera estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta3AGps,
    links: [
      createTourLink({
        from: '3A',
        to: '2A',
        position: backPosition('-140deg'),
        targetImage: SantaMarta2A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 2A',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '3A',
        to: '4A',
        position: forwardPosition('28deg'),
        targetImage: SantaMarta4A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 4A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '4A',
    panorama: SantaMarta4A,
    caption: 'Estacion 4A',
    description: 'Cuarta estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta4AGps,
    links: [
      createTourLink({
        from: '4A',
        to: '3A',
        position: backPosition('-132deg'),
        targetImage: SantaMarta3A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 3A',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '4A',
        to: '5A',
        position: forwardPosition('36deg'),
        targetImage: SantaMarta5A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 5A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '5A',
    panorama: SantaMarta5A,
    caption: 'Estacion 5A',
    description: 'Quinta estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta5AGps,
    links: [
      createTourLink({
        from: '5A',
        to: '4A',
        position: backPosition('-124deg'),
        targetImage: SantaMarta4A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 4A',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '5A',
        to: '6A',
        position: forwardPosition('44deg'),
        targetImage: SantaMarta6A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 6A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '6A',
    panorama: SantaMarta6A,
    caption: 'Estacion 6A',
    description: 'Sexta estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta6AGps,
    links: [
      createTourLink({
        from: '6A',
        to: '5A',
        position: backPosition('-116deg'),
        targetImage: SantaMarta5A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 5A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '6A',
        to: '7A',
        position: forwardPosition('52deg'),
        targetImage: SantaMarta7A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 7A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '7A',
    panorama: SantaMarta7A,
    caption: 'Estacion 7A',
    description: 'Septima estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta7AGps,
    links: [
      createTourLink({
        from: '7A',
        to: '6A',
        position: backPosition('-108deg'),
        targetImage: SantaMarta6A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 6A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '7A',
        to: '8A',
        position: forwardPosition('60deg'),
        targetImage: SantaMarta8A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 8A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '8A',
    panorama: SantaMarta8A,
    caption: 'Estacion 8A',
    description: 'Octava estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta8AGps,
    links: [
      createTourLink({
        from: '8A',
        to: '7A',
        position: backPosition('-100deg'),
        targetImage: SantaMarta7A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 7A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '8A',
        to: '9A',
        position: forwardPosition('68deg'),
        targetImage: SantaMarta9A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 9A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '9A',
    panorama: SantaMarta9A,
    caption: 'Estacion 9A',
    description: 'Novena estacion del recorrido 360 de Santa Marta (ruta A).',
    gps: santaMarta9AGps,
    links: [
      createTourLink({
        from: '9A',
        to: '8A',
        position: backPosition('-92deg'),
        targetImage: SantaMarta8A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 8A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '9A',
        to: '10A',
        position: forwardPosition('76deg'),
        targetImage: SantaMarta10A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 10A',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '10A',
    panorama: SantaMarta10A,
    caption: 'Estacion 10A',
    description: 'Ultima estacion de la ruta A del recorrido 360 de Santa Marta.',
    gps: santaMarta10AGps,
    links: [
      createTourLink({
        from: '10A',
        to: '9A',
        position: backPosition('-84deg'),
        targetImage: SantaMarta9A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 9A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '11B',
    panorama: SantaMarta11B,
    caption: 'Estacion 11B',
    description: 'Inicio de la rama B del recorrido 360 de Santa Marta.',
    gps: santaMarta11BGps,
    links: [
      createTourLink({
        from: '11B',
        to: '2A',
        position: backPosition('-150deg'),
        targetImage: SantaMarta2A,
        label: 'Volver a 2A',
        tooltipTitle: 'Volver a 2A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '11B',
        to: '12B',
        position: forwardPosition('28deg'),
        targetImage: SantaMarta12B,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 12B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '12B',
    panorama: SantaMarta12B,
    caption: 'Estacion 12B',
    description: 'Segunda estacion de la rama B del recorrido 360 de Santa Marta.',
    gps: santaMarta12BGps,
    links: [
      createTourLink({
        from: '12B',
        to: '11B',
        position: backPosition('-140deg'),
        targetImage: SantaMarta11B,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 11B',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
      createTourLink({
        from: '12B',
        to: '13B',
        position: forwardPosition('36deg'),
        targetImage: SantaMarta13B,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 13B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 110,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '13B',
    panorama: SantaMarta13B,
    caption: 'Estacion 13B',
    description: 'Ultima estacion de la rama B del recorrido 360 de Santa Marta.',
    gps: santaMarta13BGps,
    links: [
      createTourLink({
        from: '13B',
        to: '12B',
        position: backPosition('-132deg'),
        targetImage: SantaMarta12B,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 12B',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),
];

export const santaMartaSedeATourConfig: Tour360Config = {
  id: 'santa-marta-sede-a',
  label: 'Sede Santa Marta',
  startNodeId: SANTA_MARTA_SEDE_A_START_NODE_ID,
  thumbnail: SantaMarta1A,
  nodes: santaMartaSedeANodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};
