import { getPublicPanoramaUrl } from '../panoramaUrls';
import type {
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
const SantaMarta5A = santaMartaPanoramaPath('5A.png');
const SantaMarta6A = santaMartaPanoramaPath('6A.jpg');
const SantaMarta6B = santaMartaPanoramaPath('6B.png');
const SantaMarta8A = santaMartaPanoramaPath('8A.png');
const SantaMarta9A = santaMartaPanoramaPath('9A.png');
const SantaMarta10A = santaMartaPanoramaPath('10A.png');
const SantaMarta11A = santaMartaPanoramaPath('11A.png');
const SantaMarta11B = santaMartaPanoramaPath('11B.png');
const SantaMarta12B = santaMartaPanoramaPath('12B.png');
const SantaMarta13B = santaMartaPanoramaPath('13B.png');

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
  links,
}: {
  id: string;
  panorama: string;
  caption: string;
  description: string;
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
  links,
});

/**
 * Recorrido:
 * - Troncal: 1A → 10A
 * - Bifurcación en 2A: volver a 1A | avanzar a 3A | avanzar a 11A
 * - Rama B: 11A → 11B → 12B → 13B (cada uno regresa al anterior)
 */
export const santaMartaSedeANodes: Tour360Node[] = [
  createSantaMartaNode({
    id: '1A',
    panorama: SantaMarta1A,
    caption: 'Inicio del recorrido',
    description: 'Punto inicial del recorrido 360 de la Sede Santa Marta.',
    links: [
      createTourLink({
        from: '1A',
        to: '2A',
        position: {
          "yaw": "177.6deg",
          "pitch": "2.1deg"
      },
        targetImage: SantaMarta2A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a 2A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '2A',
    panorama: SantaMarta2A,
    caption: 'Entrada de Sede A',
    description: 'Desde aquí puedes continuar por la ruta para la sede A o Avanzar hacia la sede B',
    links: [
      createTourLink({
        from: '2A',
        to: '1A',
        position: {
          "yaw": "352.4deg",
          "pitch": "-14.6deg"
      },
        targetImage: SantaMarta1A,
        label: 'Volver',
        tooltipTitle: 'Volver a inicio',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 0.95,
      }),
      createTourLink({
        from: '2A',
        to: '3A',
        // Calle derecha del cruce
        position: {
          "yaw": "100.4deg",
          "pitch": "-8.1deg"
      },
        targetImage: SantaMarta3A,
        label: 'SEDE A',
        tooltipTitle: 'Avanzar a Entrada de Sede A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
      }),
      createTourLink({
        from: '2A',
        to: '11A',
        // Calle izquierda (Hotel La Economia)
        position: {
          "yaw": "183.6deg",
          "pitch": "-3.1deg"
      },
        targetImage: SantaMarta11A,
        label: 'Entrada de Sede B',
        tooltipTitle: 'Avanzar a entrada de Sede B',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -80,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '3A',
    panorama: SantaMarta3A,
    caption: 'Sede A',
    description: 'Sede A del recorrido 360 de Santa Marta.',
    links: [
      createTourLink({ //DEVOLVERSE
        from: '3A',
        to: '2A',
        position: {
          "yaw": "132.8deg",
          "pitch": "-11.9deg"
      },
        targetImage: SantaMarta2A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a entrada de Sede A',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 1,
      }),
      createTourLink({ //IR A PATIO 
        from: '3A',
        to: '4A',
        position: {
          "yaw": "235.0deg",
          "pitch": "-12.0deg"
      },
        targetImage: SantaMarta4A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a Fachada de Biblioteca',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -60,
        scale: 1,
      }),
      createTourLink({ //IR HACIA TELECAMPUS ENTRADA 
        from: '3A',
        to: '5A',
        position: {
          "yaw": "20.2deg",
          "pitch": "-10.0deg"
      },
        targetImage: SantaMarta5A,
        label: 'TELECAMPUS',
        tooltipTitle: 'Ir a telecampus',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 1,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '4A',
    panorama: SantaMarta4A,
    caption: 'Estacion 4A',
    description: 'Cuarta estacion del recorrido 360 de Santa Marta (ruta A).',
    links: [
      createTourLink({
        from: '4A',
        to: '3A',
        position: {
          "yaw": "94.4deg",
          "pitch": "-6.2deg"
      },
        targetImage: SantaMarta3A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a Entrada',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: 290,
        scale: 0.95,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '5A',
    panorama: SantaMarta5A,
    caption: 'Estacion 5A',
    description: 'Quinta estacion del recorrido 360 de Santa Marta (ruta A).',
    links: [
      createTourLink({
        from: '5A',
        to: '3A',
        position: {
          "yaw": "342.1deg",
          "pitch": "-2.0deg"
      },
        targetImage: SantaMarta3A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a Entrada de Sede A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '5A',
        to: '6A',
        position: {
          "yaw": "263.0deg",
          "pitch": "-2.6deg"
      },
        targetImage: SantaMarta6A,
        label: 'Vinculaciones',
        tooltipTitle: 'Ir a Sala de vinculaciones',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '5A',
        to: '8A',
        position: {
          "yaw": "23.1deg",
          "pitch": "-1.9deg"
      },
        targetImage: SantaMarta8A,
        label: 'Plazoleta',
        tooltipTitle: 'Salir a plazoleta',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '6A',
    panorama: SantaMarta6A,
    caption: 'Estacion 6A',
    description: 'Sexta estacion del recorrido 360 de Santa Marta (ruta A).',
    links: [
      createTourLink({
        from: '6A',
        to: '5A',
        position: {
          "yaw": "9.8deg",
          "pitch": "3.6deg"
      },
        targetImage: SantaMarta5A,
        label: 'Volver a Telecampus',
        tooltipTitle: 'Regresar a Telecampus',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1.2,
      }),
      createTourLink({
        from: '6A',
        to: '6B',
        position: {
          "yaw": "321.4deg",
          "pitch": "-4.3deg"
      },
        targetImage: SantaMarta6B,
        label: 'Coworking',
        tooltipTitle: 'Ir a 6B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 1,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '6B',
    panorama: SantaMarta6B,
    caption: 'Estacion 6B',
    description: 'Estacion 6B del recorrido 360 de Santa Marta (ruta A).',
    links: [
      createTourLink({
        from: '6B',
        to: '6A',
        position: { yaw: '-108deg', pitch: '-16deg' },
        targetImage: SantaMarta6A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a 6A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
        scale: 0.95,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '8A',
    panorama: SantaMarta8A,
    caption: 'Estacion 8A',
    description: 'Octava estacion del recorrido 360 de Santa Marta (ruta A).',
    links: [
      createTourLink({
        from: '8A',
        to: '5A',
        position: {
          "yaw": "184.7deg",
          "pitch": "-19.7deg"
      },
        targetImage: SantaMarta5A,
        label: 'Telecampus',
        tooltipTitle: 'Regresar a Telecampus',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '8A',
        to: '9A',
        position: {
          "yaw": "350.1deg",
          "pitch": "-18.9deg"
      },
        targetImage: SantaMarta9A,
        label: 'Avanzar',
        tooltipTitle: 'Ir a escaleras para area Administrativa',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '9A',
    panorama: SantaMarta9A,
    caption: 'Estacion 9A',
    description: 'Novena estacion del recorrido 360 de Santa Marta (ruta A).',
    links: [
      createTourLink({
        from: '9A',
        to: '8A',
        position: {
          "yaw": "146.3deg",
          "pitch": "-12.2deg"
      },
        targetImage: SantaMarta8A,
        label: 'Regresar',
        tooltipTitle: 'Regresar a Plazoleta',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '9A',
        to: '10A',
        position: {
          "yaw": "296.9deg",
          "pitch": "-13.8deg"
      },
        targetImage: SantaMarta10A,
        label: 'Subir piso',
        tooltipTitle: 'Ir a Escaleras de piso 2 - Area Administrativa',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '10A',
    panorama: SantaMarta10A,
    caption: 'Estacion 10A',
    description: 'Ultima estacion de la ruta A del recorrido 360 de Santa Marta.',
    links: [
      createTourLink({
        from: '10A',
        to: '9A',
        position: {
          "yaw": "82.3deg",
          "pitch": "-8.6deg"
      },
        targetImage: SantaMarta9A,
        label: 'Bajar',
        tooltipTitle: 'Regresar a pasillo de Piso 1',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '11A',
    panorama: SantaMarta11A,
    caption: 'Entrada de Sede B',
    description: 'Entrada de la Sede B del recorrido 360 de Santa Marta.',
    links: [
      // Posicion de prueba (nuevo nodo, sin arrow original que preservar):
      // ajustar yaw/pitch con psvAim() apuntando la camara al punto real.
      createTourLink({
        from: '11A',
        to: '2A',
        position: { yaw: '0deg', pitch: '-10deg' },
        targetImage: SantaMarta2A,
        label: 'Volver',
        tooltipTitle: 'Volver a Entrada de Sede A',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
        scale: 0.95,
      }),
      createTourLink({
        from: '11A',
        to: '11B',
        position: { yaw: '180deg', pitch: '-10deg' },
        targetImage: SantaMarta11B,
        label: 'Avanzar',
        tooltipTitle: 'Avanzar a Sede B',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -180,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '11B',
    panorama: SantaMarta11B,
    caption: 'Estacion 11B',
    description: 'Inicio de la rama B del recorrido 360 de Santa Marta.',
    links: [
      createTourLink({
        from: '11B',
        to: '11A',
        position: {
          "yaw": "10.8deg",
          "pitch": "-18.2deg"
      },
        targetImage: SantaMarta11A,
        label: 'Volver',
        tooltipTitle: 'Volver a Entrada de Sede B',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '11B',
        to: '12B',
        position: {
          "yaw": "213.7deg",
          "pitch": "-15.9deg"
      },
        targetImage: SantaMarta12B,
        label: 'Avanzar',
        tooltipTitle: 'Ir a Bloque de Sede B',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '12B',
    panorama: SantaMarta12B,
    caption: 'Estacion 12B',
    description: 'Segunda estacion de la rama B del recorrido 360 de Santa Marta.',
    links: [
      createTourLink({
        from: '12B',
        to: '11B',
        position: {
          "yaw": "130.7deg",
          "pitch": "-23.1deg"
      },
        targetImage: SantaMarta11B,
        label: 'Plazoleta',
        tooltipTitle: 'Regresar a Plazoleta',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
        scale: 0.95,
      }),
      createTourLink({
        from: '12B',
        to: '13B',
        position: {
          "yaw": "228.5deg",
          "pitch": "-20.5deg"
      },
        targetImage: SantaMarta13B,
        label: 'Cancha',
        tooltipTitle: 'Ir a Canchas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createSantaMartaNode({
    id: '13B',
    panorama: SantaMarta13B,
    caption: 'Estacion 13B',
    description: 'Ultima estacion de la rama B del recorrido 360 de Santa Marta.',
    links: [
      createTourLink({
        from: '13B',
        to: '12B',
        position: { yaw: '-132deg', pitch: '-16deg' },
        targetImage: SantaMarta12B,
        label: 'Regresar',
        tooltipTitle: 'Regresar a Bloque B',
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
