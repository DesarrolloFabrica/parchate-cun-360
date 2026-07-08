// Backup temporal del tour completo antes del diagnostico PSV default.
import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import '../styles/tour360.css';
import '../styles/tour360-hotspots.css';
import { HudGlassModal } from './HudGlassModal';
import {
  TOUR360_START_NODE_ID,
  tour360Nodes,
  type Tour360Node,
  type TourHotspotDirection,
  type TourHotspotStyleVariant,
} from '../data/tour360Nodes';

interface VirtualTour360Props {
  nodes?: Tour360Node[];
  initialNodeId?: string;
}

type TourArrowLink = {
  nodeId: string;
  data?: {
    id?: string;
    originSceneId?: string;
    destinationSceneId?: string;
    label?: string;
    visibleText?: string;
    tooltipTitle?: string;
    tooltipImage?: string;
    rotationDeg?: number;
    scale?: number;
    direction?: TourHotspotDirection;
    styleVariant?: TourHotspotStyleVariant;
  };
};

type ImageMarkerPopup = {
  title: string;
  image: string;
  alt: string;
};

type VideoMarkerPopup = {
  title: string;
  iframeSrc: string;
  description?: string;
};

const TOUR_NODE_ORDER = ['CalleA', 'Entrada_A', 'EntradaLobbySA', 'DescansoSA', 'BibliotecaSA'];

const getLinkLabel = (link: TourArrowLink) => {
  return typeof link.data?.label === 'string' ? link.data.label : link.nodeId;
};

const getHotspotDirection = (link: TourArrowLink): TourHotspotDirection => {
  if (link.data?.direction) {
    return link.data.direction;
  }

  const originIndex = TOUR_NODE_ORDER.indexOf(link.data?.originSceneId ?? '');
  const destinationIndex = TOUR_NODE_ORDER.indexOf(link.data?.destinationSceneId ?? link.nodeId);

  if (originIndex >= 0 && destinationIndex >= 0 && destinationIndex < originIndex) {
    return 'back';
  }

  return 'forward';
};

const getHotspotStyleVariant = (link: TourArrowLink): TourHotspotStyleVariant => {
  if (link.data?.styleVariant) {
    return link.data.styleVariant;
  }

  return link.data?.originSceneId === 'CalleA' || link.data?.originSceneId === 'Entrada_A'
    ? 'floor-arrow'
    : 'three-d-arrow';
};

const getVisibleText = (link: TourArrowLink) => {
  return link.data?.visibleText ?? link.data?.label ?? (getHotspotDirection(link) === 'back' ? 'Regresar' : 'Ingresar');
};

/*
 * Usa el tooltip HTML por defecto del VirtualTourPlugin (name + thumbnail + caption
 * del nodo destino) y agrega la descripción cuando existe.
 */
const enhanceTourLinkTooltip = (
  content: string,
  _link: TourArrowLink,
  node: Tour360Node,
) => {
  if (!content || !node.description || content.includes(node.description)) {
    return content;
  }

  return `${content}<p class="psv-virtual-tour-tooltip-desc">${node.description}</p>`;
};

const createTourArrowElement = (link: TourArrowLink) => {
  const labelText = getVisibleText(link);
  const direction = getHotspotDirection(link);
  const styleVariant = getHotspotStyleVariant(link);
  const rotationDeg = link.data?.rotationDeg ?? 0;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `tour-hotspot tour-hotspot--${styleVariant}`;
  button.setAttribute('aria-label', `${labelText}: ${getLinkLabel(link)}`);
  button.dataset.hotspotId = link.data?.id ?? 'hotspot-to-' + link.nodeId;
  button.dataset.originSceneId = link.data?.originSceneId ?? '';
  button.dataset.destinationSceneId = link.data?.destinationSceneId ?? link.nodeId;
  button.dataset.direction = direction;
  button.dataset.styleVariant = styleVariant;
  button.style.setProperty('--hotspot-rotation', `${rotationDeg}deg`);

  const label = document.createElement('span');
  label.className = 'tour-hotspot__label';
  label.textContent = labelText;

  const visual = document.createElement('span');
  visual.className = 'tour-hotspot__visual tour-hotspot__circle';

  const icon = document.createElement('span');
  icon.className = 'tour-hotspot__icon tour-hotspot__arrow';
  icon.setAttribute('aria-hidden', 'true');

  visual.append(icon);
  button.append(label, visual);

  return button;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Error desconocido inicializando el tour.';
};

const validateTourNodes = (nodes: Tour360Node[], startNodeId: string) => {
  if (nodes.length === 0) {
    throw new Error('No hay nodos configurados en tour360Nodes.');
  }

  const ids = new Set<string>();

  for (const node of nodes) {
    if (!node.id) {
      throw new Error('Hay un nodo sin id en tour360Nodes.');
    }

    if (ids.has(node.id)) {
      throw new Error(`El nodo ${node.id} esta duplicado en tour360Nodes.`);
    }

    ids.add(node.id);

    if (!node.panorama) {
      throw new Error(`El nodo ${node.id} no tiene panorama configurado.`);
    }
  }

  if (!ids.has(startNodeId)) {
    throw new Error(`El nodo inicial ${startNodeId} no existe en tour360Nodes.`);
  }

  for (const node of nodes) {
    for (const link of node.links ?? []) {
      if (!ids.has(link.nodeId)) {
        throw new Error(
          `El nodo ${node.id} tiene un link hacia ${link.nodeId}, pero ese nodo no existe.`,
        );
      }
    }
  }
};

const preloadImage = (src: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      reject(new Error(`No se pudo cargar la imagen del panorama: ${src}`));
    };

    image.src = src;
  });
};

const warnIfPanoramaRatioLooksWrong = (
  nodeId: string,
  src: string,
  width: number,
  height: number,
) => {
  if (!width || !height) {
    console.warn('[Tour360] No se pudieron leer dimensiones del panorama', { nodeId, src, width, height });
    return;
  }
}

export const VirtualTour360: React.FC<VirtualTour360Props> = ({
  nodes = tour360Nodes,
  initialNodeId = TOUR360_START_NODE_ID,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId);
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeImagePopup, setActiveImagePopup] = useState<ImageMarkerPopup | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoMarkerPopup | null>(null);
  const initialNode = nodes.find((node) => node.id === initialNodeId) ?? nodes[0];
  const initialPanoramaUrl = initialNode?.panorama;
  const currentNode = nodes.find((node) => node.id === currentNodeId) ?? nodes[0];
  const currentNodeTitle = currentNode?.name || currentNode?.caption || currentNode?.id || 'Recorrido 360';

  useEffect(() => {
    if (!activeVideo) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeVideo]);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current || nodes.length === 0) return;

    setViewerReady(false);
    setViewerError(null);
    setLoadProgress(0);

    let viewer: Viewer | null = null;
    let loadTimeoutId: number | null = null;
    let readyFallbackId: number | null = null;
    let lateReadyFallbackId: number | null = null;
    let imagePreloadCancelled = false;

    try {
      validateTourNodes(nodes, initialNodeId);

      const startNode = nodes.find((node) => node.id === initialNodeId) ?? nodes[0];
      preloadImage(startNode.panorama)

      const containerSize = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      };

      setCurrentNodeId(startNode.id);

      viewer = new Viewer({
        container: containerRef.current,
        panorama: startNode.panorama,
        defaultYaw: startNode.defaultYaw ?? 0,
        defaultPitch: startNode.defaultPitch ?? 0,
        navbar: [
          'zoom',
          'move',
        /*
          {
            id: 'test-mode',
            title: 'Modo test',
            content: 'TEST',
            onClick(viewer) {
              const virtualTour = viewer.getPlugin(VirtualTourPlugin) as any;
              virtualTour?.setCurrentNode?.('SphereTest');
            },
          },
          */
          'fullscreen',
          'gallery',
          'markers',
        ],
        mousewheel: true,
        size: { width: '100%', height: '100%' },
        plugins: [
          [
            GalleryPlugin,
            {
              thumbnailSize: { width: 200, height: 100 },
              visibleOnLoad: false,
              hideOnClick: true,
            },
          ],
          MarkersPlugin.withConfig({
            clickEventOnMarker: false,
          }),
          [
            VirtualTourPlugin,
            {
              positionMode: 'gps',
              renderMode: '3d',
              nodes,
              startNodeId: startNode.id,
              // En produccion los panoramas pesan bastante. Evita que el loader
              // se quede esperando la precarga de todas las escenas antes de mostrar la inicial.
              preload: true,
              // Hover nativo del plugin: muestra name + thumbnail + caption del nodo destino.
              showLinkTooltip: true,
              getLinkTooltip: enhanceTourLinkTooltip,
              transitionOptions: {
                showLoader: true,
                effect: 'fade',
                speed: '20rpm',
                rotation: true,
              },
              arrowStyle: {
                element: createTourArrowElement,
                className: 'tour-hotspot-link',
                size: { width: 130, height: 112 },
              },
            },
          ],
        ],
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('[Tour360] Error inicializando Photo Sphere Viewer:', error);
      setViewerError(message);
      return;
    }

    if (!viewer) return;

    viewerRef.current = viewer;

    const handleReady = () => {
      console.log('[Tour360] Photo Sphere Viewer ready');
      setViewerReady(true);
      setViewerError(null);
      if (loadTimeoutId !== null) {
        window.clearTimeout(loadTimeoutId);
        loadTimeoutId = null;
      }
    };

    const handlePanoramaLoad = (event: any) => {
      console.log('[Tour360] Panorama load start', event.panorama);
    };

    const handlePanoramaLoaded = () => {
      console.log('[Tour360] Panorama loaded');
      setViewerReady(true);
      setViewerError(null);
      setLoadProgress(100);
      if (loadTimeoutId !== null) {
        window.clearTimeout(loadTimeoutId);
        loadTimeoutId = null;
      }
    };

    const handlePanoramaError = (event: any) => {
      const panorama = typeof event.panorama === 'string' ? event.panorama : currentNode?.panorama;
      const message = getErrorMessage(event.error);
      console.error('[Tour360] Panorama load failed', {
        panorama,
        error: event.error,
      });
      setViewerError(
        `No se pudo cargar el panorama 360. Panorama: ${panorama ?? 'desconocido'}. Error: ${message}`,
      );
    };

    const handleLoadProgress = (event: any) => {
      if (typeof event.progress === 'number') {
        setLoadProgress(Math.max(0, Math.min(100, Math.round(event.progress))));
      }
    };

    viewer.addEventListener('ready', handleReady);
    viewer.addEventListener('panorama-load', handlePanoramaLoad);
    viewer.addEventListener('panorama-loaded', handlePanoramaLoaded);
    viewer.addEventListener('panorama-error', handlePanoramaError);
    viewer.addEventListener('load-progress', handleLoadProgress);

    const markReadyFromViewerState = (source: string) => {
      if (!viewer?.state.ready) {
        return;
      }

      console.log(`[Tour360] Viewer ready (${source})`);
      setViewerReady(true);
      setViewerError(null);
      setLoadProgress(100);

      if (loadTimeoutId !== null) {
        window.clearTimeout(loadTimeoutId);
        loadTimeoutId = null;
      }
    };

    readyFallbackId = window.setTimeout(() => {
      markReadyFromViewerState('viewer.state.ready fallback');
    }, 0);

    lateReadyFallbackId = window.setTimeout(() => {
      markReadyFromViewerState('delayed viewer.state.ready fallback');
    }, 1500);

    loadTimeoutId = window.setTimeout(() => {
      if (viewer?.state.ready) {
        markReadyFromViewerState('timeout guard');
        return;
      }

      const size = containerRef.current
        ? `${containerRef.current.clientWidth}x${containerRef.current.clientHeight}`
        : 'contenedor no disponible';

        /*
      setViewerError(
        `El Tour 360 sigue cargando despues de ${TOUR_LOAD_TIMEOUT_MS / 1000}s. Revisa en Network que el panorama inicial cargue con status 200 y MIME de imagen. Panorama inicial: ${nodes.find((node) => node.id === initialNodeId)?.panorama ?? nodes[0]?.panorama ?? 'desconocido'}. Tamano del contenedor: ${size}.`,
      );
      */
    },);

    const virtualTourPlugin = viewer.getPlugin(VirtualTourPlugin) as any;
    const handleNodeChanged = (event: { node?: { id?: string } }) => {
      if (typeof event.node?.id === 'string') {
        setCurrentNodeId(event.node.id);
        setActiveVideo(null);
      }
    };

    virtualTourPlugin?.addEventListener?.('node-changed', handleNodeChanged);

    const activeNode = virtualTourPlugin?.getCurrentNode?.();
    if (typeof activeNode?.id === 'string') {
      setCurrentNodeId(activeNode.id);
    }

    // Debug temporal para ubicar el video dentro de la escena.
    // Descomentar solo mientras se ajusta la posicion.
    /*
    viewer.addEventListener('click', ({ data }) => {
      console.log('Coordenadas para video:', {
        yaw: data.yaw,
        pitch: data.pitch,
      });
    });
    */

    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | undefined;
    const openVideoFromMarkerData = (data: any) => {
      if (data?.action !== 'open-video-modal' || typeof data.iframeSrc !== 'string') {
        return false;
      }

      setActiveVideo({
        title: typeof data.title === 'string' ? data.title : 'Video del recorrido',
        iframeSrc: data.iframeSrc,
        description: typeof data.description === 'string' ? data.description : undefined,
      });

      return true;
    };

    const handleMarkerSelect = (event: any) => {
      const data = event.marker?.data ?? event.marker?.config?.data;

      if (openVideoFromMarkerData(data)) {
        return;
      }

      if (event.marker?.id !== 'calle-a-marco-image-layer' || data?.action !== 'open-image-popup' || typeof data.image !== 'string') {
        return;
      }

      console.log('Marker MARCO seleccionado');

      setActiveImagePopup({
        title: typeof data.title === 'string' ? data.title : 'Imagen informativa',
        image: data.image,
        alt: typeof data.alt === 'string' ? data.alt : 'Imagen informativa del tour 360',
      });
    };

    const handleVideoHotspotKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const target = event.target as HTMLElement | null;
      const hotspot = target?.closest?.('.tour-video-hotspot') as HTMLElement | null;

      if (!hotspot) {
        return;
      }

      event.preventDefault();
      setActiveVideo({
        title: hotspot.dataset.videoTitle || 'Video del recorrido',
        iframeSrc: hotspot.dataset.videoIframeSrc || '',
        description: hotspot.dataset.videoDescription,
      });
    };

    markersPlugin?.addEventListener('select-marker', handleMarkerSelect);
    viewer.container.addEventListener('keydown', handleVideoHotspotKeydown);

    return () => {
      imagePreloadCancelled = true;
      if (loadTimeoutId !== null) {
        window.clearTimeout(loadTimeoutId);
      }
      if (readyFallbackId !== null) {
        window.clearTimeout(readyFallbackId);
      }
      if (lateReadyFallbackId !== null) {
        window.clearTimeout(lateReadyFallbackId);
      }
      viewer.removeEventListener('ready', handleReady);
      viewer.removeEventListener('panorama-load', handlePanoramaLoad);
      viewer.removeEventListener('panorama-loaded', handlePanoramaLoaded);
      viewer.removeEventListener('panorama-error', handlePanoramaError);
      viewer.removeEventListener('load-progress', handleLoadProgress);
      virtualTourPlugin?.removeEventListener?.('node-changed', handleNodeChanged);
      markersPlugin?.removeEventListener('select-marker', handleMarkerSelect);
      viewer.container.removeEventListener('keydown', handleVideoHotspotKeydown);
      viewerRef.current = null;
      viewer.destroy();
    };
  }, [initialNodeId, nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-sm font-semibold text-white">
        No hay escenas configuradas para el tour 360.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black">
      <div ref={containerRef} className="h-full w-full bg-black" />

      <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:left-4 sm:top-4 sm:max-w-[24rem] sm:px-5">
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 sm:text-xs">
          Tour 360
        </p>
        <h2 className="m-0 mt-1 truncate font-['Montserrat'] text-lg font-black leading-tight text-white sm:text-xl md:text-2xl">
          {currentNodeTitle}
        </h2>
      </div>

      <HudGlassModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        size="xl"
        title={activeVideo?.title}
        meta="Contenido multimedia del tour 360"
        bodyClassName="space-y-4"
      >
        {activeVideo?.description && (
          <p className="m-0 text-sm font-semibold leading-relaxed text-white/80">
            {activeVideo.description}
          </p>
        )}
        {activeVideo && (
          <div className="hud-glass-modal__media">
            <iframe
              className="hud-glass-modal__iframe"
              src={activeVideo.iframeSrc}
              title={activeVideo.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        )}
      </HudGlassModal>

      <HudGlassModal
        isOpen={Boolean(activeImagePopup)}
        onClose={() => setActiveImagePopup(null)}
        size="xl"
        title={activeImagePopup?.title}
        meta="Información del recorrido"
      >
        {activeImagePopup && (
          <div className="hud-glass-modal__media">
            <img
              src={activeImagePopup.image}
              alt={activeImagePopup.alt}
              className="hud-glass-modal__image"
            />
          </div>
        )}
      </HudGlassModal>
    </div>
  );
};

export default VirtualTour360;
