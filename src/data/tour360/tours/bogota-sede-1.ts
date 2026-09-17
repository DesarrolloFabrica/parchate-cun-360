import { tour360MediaMarkersByNode } from '../../tour360MediaHotspots';
import { resolveLegacyPanoramaUrl, KNOWN_GOOD_PLACEHOLDER_PANORAMA } from '../panoramaUrls';
import type { GpsPosition, Tour360Config, Tour360Node } from '../types';

const CalleA = resolveLegacyPanoramaUrl('Calle_A.png');
const Entrada_A = resolveLegacyPanoramaUrl('3SA.jpeg');
const DescansoSA = resolveLegacyPanoramaUrl('5SA.png');
const BibliotecaSA = resolveLegacyPanoramaUrl('6SA.png');
const EntradaLobbySA = resolveLegacyPanoramaUrl('Sede_A/LobbySA.png');
const MarcoInfo = resolveLegacyPanoramaUrl('MARCO.png');
const GuiaAS = resolveLegacyPanoramaUrl('AS.png');
const GuiaEntradaSA = resolveLegacyPanoramaUrl('panoramas/iconos/alizon.png');
const SphereTestImage = resolveLegacyPanoramaUrl('sede_test.png');

const calleAGps: GpsPosition = [-75.0819, 4.64802, 0];
const entradaAGps: GpsPosition = [-74.07184, 4.64802, 0];
const entradaLobbySAGps: GpsPosition = [-74.0818, 4.648055, 0];
const descansoSAGps: GpsPosition = [-74.08176, 4.64809, 0];
const bibliotecaSAGps: GpsPosition = [-74.08171, 4.64813, 0];
const sphereTestGps: GpsPosition = [-74.08196, 4.64796, 0];
const entradaLobbyBackArrowGps: GpsPosition = [-74.08168, 4.648, 0];
const entradaLobbyNextArrowGps: GpsPosition = [-74.08192, 4.64812, 0];

export const BOGOTA_SEDE_1_START_NODE_ID = 'CalleA';

export const bogotaSede1Nodes: Tour360Node[] = [
  {
    id: 'CalleA',
    panorama: CalleA,
    thumbnail: CalleA,
    name: 'Ruta Sede A',
    caption: 'Primera calle',
    description: 'Primera calle del recorrido 360 local.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: calleAGps,
    markers: [
      {
        id: 'calle-a-marco-image-layer',
        imageLayer: MarcoInfo,
        position: { yaw: 90, pitch: 0 },
        size: { width: 820, height: 440 },
        tooltip: 'Haz clic para ver más información',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: MarcoInfo,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
      {
        id: 'Presentador',
        imageLayer: GuiaAS,
        position: { yaw: 1.49, pitch: -0.25 },
        size: { width: 341, height: 567 },
        tooltip: 'Haz clic para ver más información',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: GuiaAS,
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
          rotationDeg: 180,
          scale: 1,
          direction: 'forward',
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },
  {
    id: 'Entrada_A',
    panorama: Entrada_A,
    thumbnail: Entrada_A,
    name: 'Sede A',
    caption: 'Entrada para la sede principal',
    description: 'Acceso hacia la sede principal desde la primera calle.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaAGps,
    markers: [
      {
        id: 'Presentador',
        imageLayer: GuiaEntradaSA,
        position: { yaw: -0.4, pitch: -0.25 },
        size: { width: 341, height: 767 },
        tooltip: 'Alison: ¿Estas Listo?',
        data: {
          action: 'open-image-popup',
          title: 'Información del recorrido',
          image: GuiaEntradaSA,
          alt: 'Imagen informativa del recorrido CUN',
        },
      },
    ],
    links: [
      {
        nodeId: 'EntradaLobbySA',
        gps: calleAGps,
        data: {
          id: 'Entrada_A-to-EntradaLobbySA',
          originSceneId: 'Entrada_A',
          destinationSceneId: 'EntradaLobbySA',
          label: 'Lobby principal',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Lobby de la sede principal',
          tooltipImage: EntradaLobbySA,
          rotationDeg: 0,
          scale: 1,
          direction: 'forward',
          styleVariant: 'floor-arrow',
        },
      },
      {
        nodeId: 'CalleA',
        gps: entradaLobbySAGps,
        data: {
          id: 'Entrada_A-to-CalleA',
          originSceneId: 'Entrada_A',
          destinationSceneId: 'CalleA',
          label: 'Primera calle',
          visibleText: 'ENTRADA ( da clic aqu\u00ed ).',
          tooltipTitle: 'Volver a la primera calle',
          tooltipImage: CalleA,
          rotationDeg: 290,
          scale: 1,
          direction: 'back',
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },
  {
    id: 'EntradaLobbySA',
    panorama: EntradaLobbySA,
    thumbnail: EntradaLobbySA,
    name: 'Lobby Sede A',
    caption: 'Lobby de la sede principal',
    description: 'Lobby de la sede principal y punto de conexion hacia la sala de descanso.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: entradaLobbySAGps,
    markers: [...(tour360MediaMarkersByNode.EntradaLobbySA ?? [])],
    links: [
      {
        nodeId: 'Entrada_A',
        gps: entradaLobbyBackArrowGps,
        data: {
          id: 'EntradaLobbySA-to-Entrada_A',
          originSceneId: 'EntradaLobbySA',
          destinationSceneId: 'Entrada_A',
          label: 'Entrada sede principal',
          visibleText: 'REGRESAR',
          tooltipTitle: 'Regresar a Entrada_A',
          tooltipImage: Entrada_A,
          rotationDeg: 0,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
      {
        nodeId: 'DescansoSA',
        gps: entradaLobbyNextArrowGps,
        data: {
          id: 'EntradaLobbySA-to-DescansoSA',
          originSceneId: 'EntradaLobbySA',
          destinationSceneId: 'DescansoSA',
          label: 'Sala de descanso',
          visibleText: 'SALA DE DESCANSO',
          tooltipTitle: 'Sala de descanso',
          tooltipImage: DescansoSA,
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
    name: 'Sala de Descanso - Sede A',
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
          visibleText: 'REGRESAR A LOBBY.',
          tooltipTitle: 'Regresar al lobby',
          tooltipImage: EntradaLobbySA,
          rotationDeg: 0,
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
          visibleText: 'BIBLIOTECA.',
          tooltipTitle: 'Biblioteca',
          tooltipImage: BibliotecaSA,
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
    name: 'Biblioteca - Sede A',
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
          visibleText: 'REGRESAR.',
          tooltipTitle: 'Volver a la sala de descanso',
          tooltipImage: DescansoSA,
          rotationDeg: 180,
          scale: 0.95,
          direction: 'back',
          styleVariant: 'three-d-arrow',
        },
      },
    ],
  },
  {
    id: 'SphereTest',
    panorama: SphereTestImage,
    thumbnail: SphereTestImage,
    name: 'Modo test',
    caption: 'Imagen de prueba',
    description: 'Vista temporal para pruebas del tour.',
    defaultYaw: '0deg',
    defaultPitch: '0deg',
    gps: sphereTestGps,
    links: [
      {
        nodeId: 'CalleA',
        gps: calleAGps,
        data: {
          id: 'SphereTest-to-CalleA',
          originSceneId: 'SphereTest',
          destinationSceneId: 'CalleA',
          label: 'Volver al tour',
          visibleText: 'Volver',
          tooltipTitle: 'Volver a CalleA',
          tooltipImage: CalleA,
          rotationDeg: 180,
          scale: 1,
          direction: 'back',
          styleVariant: 'floor-arrow',
        },
      },
    ],
  },
];

export const bogotaSede1TourConfig: Tour360Config = {
  id: 'bogota-sede-1',
  label: 'Sede Bogotá 1',
  startNodeId: BOGOTA_SEDE_1_START_NODE_ID,
  thumbnail: KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  nodes: bogotaSede1Nodes,
  isPlaceholder: false,
  pendingAssetPaths: [],
};

export const bogotaSede1AvailablePanoramaFiles = [
  { id: 'CalleA', panorama: CalleA, name: 'CalleA', fileName: 'Calle_A.png' },
  { id: 'Entrada_A', panorama: Entrada_A, name: 'Entrada_A', fileName: '3SA.jpeg' },
  { id: 'EntradaLobbySA', panorama: EntradaLobbySA, name: 'EntradaLobbySA', fileName: 'LobbySA.png' },
  { id: 'DescansoSA', panorama: DescansoSA, name: 'DescansoSA', fileName: '5SA.png' },
  { id: 'BibliotecaSA', panorama: BibliotecaSA, name: 'BibliotecaSA', fileName: '6SA.png' },
  { id: 'SphereTest', panorama: SphereTestImage, name: 'Modo test', fileName: 'sede_test.png' },
];
