import type { MarkerConfig } from '@photo-sphere-viewer/markers-plugin';
import CalleA from '../../assets/imagenes/Sede_A/Calle_A.png';
import Entrada_A from '../../assets/imagenes/Sede_A/3SA.png';
import DescansoSA from '../../assets/imagenes/Sede_A/5SA.png';
import BibliotecaSA from '../../assets/imagenes/Sede_A/6SA.png';
import EntradaLobbySA from '../../assets/imagenes/Sede_A/LobbySA.png';
import MarcoInfo from '../assets/imagenes/MARCO.png';

type GpsPosition = [number, number, number?];

//Longitud, L
const calleAGps: GpsPosition = [-74.0819, 4.648, 0];
const entradaAGps: GpsPosition = [-74.08184, 4.64802, 0];
const entradaLobbySAGps: GpsPosition = [74.0818, 4.648055, 0];
const descansoSAGps: GpsPosition = [74.08176, 4.64809, 0];
const bibliotecaSAGps: GpsPosition = [-74.08171, 4.64813, 0];

export type TourHotspotDirection = 'forward' | 'back';
export type TourHotspotStyleVariant = 'floor-arrow' | 'three-d-arrow';

export type Tour360Link = {
  nodeId: string;
  gps: GpsPosition;
  data: {
    id: string;
    originSceneId: string;
    destinationSceneId: string;
    label: string;
    visibleText: string;
    tooltipTitle: string;
    tooltipImage: string;
    /** Gira la flecha/icono dentro de la escena 360. No afecta el label. */
    rotationDeg: number;
    scale: number;
    direction?: TourHotspotDirection;
    styleVariant?: TourHotspotStyleVariant;
  };
};

export type Tour360Node = {
  id: string;
  panorama: string;
  name: string;
  thumbnail: string;
  caption: string;
  description: string;
  defaultYaw: string;
  defaultPitch: string;
  gps: GpsPosition;
  links: Tour360Link[];
  markers?: MarkerConfig[];
};

export const TOUR360_START_NODE_ID = 'CalleA'; // Nodo de inicio

export const tour360Nodes: Tour360Node[] = [
  {
    id: 'CalleA',
    panorama: CalleA,
    thumbnail: CalleA,
    name: 'Calle_A',
    caption: 'Primera calle',
    description: 'Primera calle del recorrido 360 local.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: calleAGps,
    markers: [ //Marcadores de la calle A 
      {
        id: 'calle-a-marco-image-layer',
        imageLayer: MarcoInfo,
        // Ajusta estos valores para ubicar mejor MARCO.png dentro de Calle_A.
        position: {
          yaw: 90,
          pitch: 0,
        },
        size: {
          width: 820,
          height: 440,
        },
        tooltip: 'Haz clic para ver más información',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: MarcoInfo,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
    ],
    links: [
      {
        nodeId: 'Entrada_A',
        gps: entradaAGps,
        data: {
          id: 'CalleA-to-Entrada_A',
          originSceneId: 'CalleA',
          destinationSceneId: 'Entrada_A',
          label: 'Entrada sede principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Entrada para la sede principal',
          tooltipImage: Entrada_A,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 360,
          scale: 1,
          direction: 'forward',
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },

  //ENTRADA PARA LA SEDE PRINCIPAL 
  {
    id: 'Entrada_A',
    panorama: Entrada_A,
    thumbnail: Entrada_A,
    name: 'Entrada_A',
    caption: 'Entrada para la sede principal',
    description: 'Acceso hacia la sede principal desde la primera calle.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaAGps,
        markers: [ //Marcadores de la ENTRADA PRINCIPAL 
      {
        id: 'calle-a-marco-image-layer',
        imageLayer: MarcoInfo,
        // Ajusta estos valores para ubicar mejor MARCO.png dentro de Calle_A.
        position: {
          yaw: 90,
          pitch: 0,
        },
        size: {
          width: 820,
          height: 440,
        },
        tooltip: 'Haz clic para ver más información',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: MarcoInfo,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
    ],
    links: [
      {
        nodeId: 'CalleA',
        gps: calleAGps,
        data: {
          id: 'Entrada_A-to-CalleA',
          originSceneId: 'Entrada_A',
          destinationSceneId: 'CalleA',
          label: 'Primera calle',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Volver a la primera calle',
          tooltipImage: CalleA,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 100,
          scale: 2,
          direction: 'back',
          styleVariant: 'floor-arrow',
        },
      },
      {
        nodeId: 'EntradaLobbySA',
        gps: entradaLobbySAGps,
        data: {
          id: 'Entrada_A-to-EntradaLobbySA',
          originSceneId: 'Entrada_A',
          destinationSceneId: 'EntradaLobbySA',
          label: 'Lobby principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Lobby de la sede principal',
          tooltipImage: EntradaLobbySA,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 180,
          scale: 1,
          direction: 'forward',
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },
  { //ENTRADA DE LOBBY 
    id: 'EntradaLobbySA',
    panorama: EntradaLobbySA,
    thumbnail: EntradaLobbySA,
    name: 'EntradaLobbySA',
    caption: 'Lobby de la sede principal',
    description: 'Lobby de la sede principal y punto de conexion hacia la sala de descanso.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaLobbySAGps,
    links: [
      {
        nodeId: 'Entrada_A',
        gps: entradaAGps,
        data: {
          id: 'EntradaLobbySA-to-Entrada_A',
          originSceneId: 'EntradaLobbySA',
          destinationSceneId: 'Entrada_A',
          label: 'Entrada sede principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Regresar a Entrada_A',
          tooltipImage: Entrada_A,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 180,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
      {
        nodeId: 'DescansoSA',
        gps: descansoSAGps,
        data: {
          id: 'EntradaLobbySA-to-DescansoSA',
          originSceneId: 'EntradaLobbySA',
          destinationSceneId: 'DescansoSA',
          label: 'Sala de descanso',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Sala de descanso',
          tooltipImage: DescansoSA,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 0,
          scale: 1,
          direction: 'forward',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
  {
    id: 'DescansoSA',
    panorama: DescansoSA,
    thumbnail: DescansoSA,
    name: 'DescansoSA',
    caption: 'Sala de descanso',
    description: 'Sala de descanso dentro del recorrido 360.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: descansoSAGps,
    links: [
      {
        nodeId: 'EntradaLobbySA',
        gps: entradaLobbySAGps,
        data: {
          id: 'DescansoSA-to-EntradaLobbySA',
          originSceneId: 'DescansoSA',
          destinationSceneId: 'EntradaLobbySA',
          label: 'Lobby principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Regresar al lobby',
          tooltipImage: EntradaLobbySA,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 180,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
      {
        nodeId: 'BibliotecaSA',
        gps: bibliotecaSAGps,
        data: {
          id: 'DescansoSA-to-BibliotecaSA',
          originSceneId: 'DescansoSA',
          destinationSceneId: 'BibliotecaSA',
          label: 'Biblioteca',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Biblioteca',
          tooltipImage: BibliotecaSA,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 0,
          scale: 1,
          direction: 'forward',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
  {
    id: 'BibliotecaSA',
    panorama: BibliotecaSA,
    thumbnail: BibliotecaSA,
    name: 'BibliotecaSA',
    caption: 'Biblioteca',
    description: 'Biblioteca de la sede principal.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: bibliotecaSAGps,
    links: [
      {
        nodeId: 'DescansoSA',
        gps: descansoSAGps,
        data: {
          id: 'BibliotecaSA-to-DescansoSA',
          originSceneId: 'BibliotecaSA',
          destinationSceneId: 'DescansoSA',
          label: 'Sala de descanso',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Volver a la sala de descanso',
          tooltipImage: DescansoSA,
          // rotationDeg permite girar individualmente la flecha dentro de la escena.
          // Ajustar este valor para orientar el botón hacia la puerta, pasillo o destino visual.
          rotationDeg: 180,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
];

export const tour360AvailablePanoramaFiles = [
  {
    id: 'CalleA',
    panorama: CalleA,
    name: 'CalleA',
    fileName: 'Calle_A.png',
  },
  {
    id: 'Entrada_A',
    panorama: Entrada_A,
    name: 'Entrada_A',
    fileName: '3SA.png',
  },
  {
    id: 'EntradaLobbySA',
    panorama: EntradaLobbySA,
    name: 'EntradaLobbySA',
    fileName: 'LobbySA.png',
  },
  {
    id: 'DescansoSA',
    panorama: DescansoSA,
    name: 'DescansoSA',
    fileName: '5SA.png',
  },
  {
    id: 'BibliotecaSA',
    panorama: BibliotecaSA,
    name: 'BibliotecaSA',
    fileName: '6SA.png',
  },
];
