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

/** Archivos en `public/panoramas/Neiva/` (nombres ASCII para evitar fallos de carga). */
const FILES = {
  '1': '1-fachada.png',
  '2': '2-entrada.png',
  '3': '3-telecampus.png',
  '4': '4.png',
  '5': '5-bloque-c.png',
  '6': '6.png',
  '7': '7.png',
  '8': '8-bloque-d.png',
  '9AG': '9AG.png',
  '10D': '10D.png',
  '11TV': '11TV.png',
  '12A': '12A.png',
  '12B': '12B.png',
  '14': '14-bloque-a.png',
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
        position:
        {yaw: '2.1deg', pitch: '-19.6deg'},
        label: 'Avanzar',
        tooltipTitle: 'Ir a entrada Telecampus',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
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
        position: {
          yaw: "197.1deg",
          pitch: "-14.6deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a fachada',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
      }),
      createTourLink({
        from: '2',
        to: '3',
        position: {
          yaw: "18.6deg",
          pitch: "-14.8deg"
      },
        label: 'Avanzar',
        tooltipTitle: 'Ir a Telecampus',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
      }),
      createTourLink({
        from: '2',
        to: '14',
        position: {
          "yaw": "71.0deg",
          "pitch": "-14.3deg"
      },
        label: 'Acceder a Bloque A',
        tooltipTitle: 'Bloque A',
        direction: 'forward',
        styleVariant: 'floor-arrow',
        rotationDeg: -45,
      }),
    ],
  }),
  createNeivaNode({
    id: '3',
    caption: 'Telecampus',
    description: 'Hub central: puedes avanzar a Bienestar o acceder a Bloque C.',
    gpsIndex: 3,
    links: [
      // Anillo ~90° + pitches distintos: menos solape visual y de hitbox.
      createTourLink({
        from: '3',
        to: '2',
        position: { yaw: '-160deg', pitch: '-14deg' },
        label: 'Regresar',
        tooltipTitle: 'Volver a entrada',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 340,
      }),
      createTourLink({
        from: '3',
        to: '4',
        position: {
          "yaw": "310.6deg",
          "pitch": "-13.0deg"
      },
        label: 'Oficina Telecampus',
        tooltipTitle: 'Telecampus - Oficina Bienestar',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '3',
        to: '5',
        position: {
          "yaw": "77.6deg",
          "pitch": "-15.6deg"
      },
        label: 'Acceder a Bloque C',
        tooltipTitle: 'Bloque C',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '4',
    caption: 'Telecampus',
    description: 'Oficina Bienestar.',
    gpsIndex: 4,
    links: [
      createTourLink({
        from: '4',
        to: '3',
        position: {
          "yaw": "357.3deg",
          "pitch": "-6.4deg"
      },
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -90,
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
        position: {
          "yaw": "81.4deg",
          "pitch": "-18.7deg"
      },
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'floor-arrow',
        rotationDeg: -45,
      }),
      createTourLink({
        from: '5',
        to: '8',
        position: {
          "yaw": "210.5deg",
          "pitch": "-20.2deg"
      },
        label: 'Acceder a Bloque D',
        tooltipTitle: 'Bloque D',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '5',
        to: '6',
        position: {
          "yaw": "344.0deg",
          "pitch": "-25.6deg"
      },
        label: 'Biblioteca',
        tooltipTitle: 'Bloque C - Biblioteca',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '5',
        to: '7',
        position: {
          "yaw": "287.2deg",
          "pitch": "-25.6deg"
      },
        label: 'Salon de Confeccion',
        tooltipTitle: 'Salon de Confeccion',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '6',
    caption: 'Bloque C - Biblioteca',
    description: 'Biblioteca del Bloque C.',
    gpsIndex: 6,
    links: [
      createTourLink({
        from: '6',
        to: '5',
        position: {
          "yaw": "149.8deg",
          "pitch": "-5.8deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque C',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '7',
    caption: 'Salon de Confeccion',
    description: 'Salon de Confeccion del Bloque C.',
    gpsIndex: 7,
    links: [
      createTourLink({
        from: '7',
        to: '5',
        position: {
          "yaw": "163.6deg",
          "pitch": "-22.2deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque C',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
        to: '5',
        position: {
          "yaw": "86.3deg",
          "pitch": "-10.5deg"
      },
        label: 'Volver a Bloque C',
        tooltipTitle: 'Volver a Bloque C',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '8',
        to: '9AG',
        position: {
          "yaw": "17.8deg",
          "pitch": "-20.9deg"
      },
        label: 'Salon de Aerografia',
        tooltipTitle: 'Salon de Aerografia',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '8',
        to: '10D',
        position: {
          "yaw": "310.0deg",
          "pitch": "-21.3deg"
      },
        label: 'Sala de sistemas',
        tooltipTitle: 'Sala de sistemas',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '8',
        to: '11TV',
        position: {
          "yaw": "217.6deg",
          "pitch": "-13.7deg"
      },
        label: 'Ir a Estudio de Radio y TV',
        tooltipTitle: 'Estudio de Radio y TV',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '9AG',
    caption: 'Salon de Aerografia',
    description: 'Rama 9AG del Bloque D.',
    gpsIndex: 9,
    links: [
      createTourLink({
        from: '9AG',
        to: '8',
        position: { yaw: '-150deg', pitch: '-18deg' },
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque D',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
      }),
    ],
  }),
  createNeivaNode({
    id: '10D',
    caption: 'Sala de sistemas',
    description: 'Final de la rama 9AG → 10D.',
    gpsIndex: 10,
    links: [
      createTourLink({
        from: '10D',
        to: '8',
        position: {
          "yaw": "164.4deg",
          "pitch": "-26.2deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque D',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '11TV',
    caption: 'Estudio de Radio y TV',
    description: 'Estudio de Radio y TV.',
    gpsIndex: 11,
    links: [
      createTourLink({
        from: '11TV',
        to: '8',
        position: {
          "yaw": "91.6deg",
          "pitch": "-11.9deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque D',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '11TV',
        to: '12A',
        position: {
          "yaw": "345.2deg",
          "pitch": "-4.7deg"
      },
        label: 'Estudio Radio',
        tooltipTitle: 'Ir a Estudio de radio',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '11TV',
        to: '12B',
        position: {
          "yaw": "245.9deg",
          "pitch": "-2.5deg"
      },
        label: 'Estudio TV',
        tooltipTitle: 'Ir a Estudio de televisión',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '12A',
    caption: 'Estudio de radio',
    description: 'Estudio de radio.',
    gpsIndex: 12,
    links: [
      createTourLink({
        from: '12A',
        to: '11TV',
        position: {
          "yaw": "142.6deg",
          "pitch": "-29.8deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Estudio de Radio y TV',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '12B',
    caption: 'Estudio de televisión',
    description: 'Estudio de televisión.',
    gpsIndex: 13,
    links: [
      createTourLink({
        from: '12B',
        to: '11TV',
        position: { yaw: '-140deg', pitch: '-18deg' },
        label: 'Regresar',
        tooltipTitle: 'Volver a Estudio de radio',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 220,
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
        position: {
          "yaw": "205.2deg",
          "pitch": "-16.7deg"
      },
        label: 'Volver a Telecampus',
        tooltipTitle: 'Volver a Telecampus',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '14',
        to: '15A',
        position: {
          "yaw": "11.6deg",
          "pitch": "-16.6deg"
      },
        label: 'Salón',
        tooltipTitle: 'Ingresar a Salon de clase',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '15A',
    caption: 'Salon de clase',
    description: 'Interior Bloque A, punto 15A.',
    gpsIndex: 15,
    links: [
      createTourLink({
        from: '15A',
        to: '14',
        position: {
          "yaw": "172.1deg",
          "pitch": "-10.2deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a Bloque A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
      createTourLink({
        from: '15A',
        to: '15B',
        position: {
          "yaw": "265.1deg",
          "pitch": "-11.3deg"
      },
        label: 'Salon de musica',
        tooltipTitle: 'Ingresar a Salon de musica',
        direction: 'forward',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
      }),
    ],
  }),
  createNeivaNode({
    id: '15B',
    caption: 'Salon de musica',
    description: 'Ultima estacion del Bloque A.',
    gpsIndex: 16,
    links: [
      createTourLink({
        from: '15B',
        to: '15A',
        position: {
          "yaw": "172.4deg",
          "pitch": "-25.5deg"
      },
        label: 'Regresar',
        tooltipTitle: 'Volver a 15A',
        direction: 'back',
        styleVariant: 'three-d-arrow',
        rotationDeg: 0,
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
