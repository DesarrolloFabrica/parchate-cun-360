import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';
import { tour360MediaMarkersByNode } from '../data/tour360MediaHotspots';

import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';
import '../styles/tour360.css';
import '../styles/tour360-hotspots.css';
import { HudGlassModal } from './HudGlassModal';

import {
  TOUR360_START_NODE_ID,
  tour360Nodes,
  type TourHotspotDirection,
  type TourHotspotStyleVariant,
} from '../data/tour360Nodes';
import {
  DEPLOY_FALLBACK_PANORAMA,
  KNOWN_GOOD_PLACEHOLDER_PANORAMA,
  type Tour360Campus,
  type Tour360Config,
} from '../data/tour360';


interface VirtualTour360Props {
  nodes?: TourNode[];
  initialNodeId?: string;
  selectedCampus?: Tour360Campus | null;
  tourConfig?: Tour360Config | null;
}

type TourLink = {
  nodeId: string;
  [key: string]: any;
};

type TourNode = {
  id: string;
  panorama: string;
  thumbnail?: string;
  name?: string;
  caption?: string;
  links?: TourLink[];
  markers?: any[];
  [key: string]: any;
};

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

export const ENABLE_VIRTUAL_TOUR = true;
export const ENABLE_MARKERS = true;
export const ENABLE_GALLERY = true;
export const ENABLE_CUSTOM_TOOLTIP = true;
export const ENABLE_CUSTOM_ARROWS = true;
export const ENABLE_MEDIA_MARKERS = true;

const ENABLE_TOUR_NAVBAR = true;
const ENABLE_REPOSITIONED_ARROWS = true;
const ENABLE_MARCO_PREVIEW = false;
const ENABLE_DRIVE_VIDEO_MARKER = false;
const ENABLE_SECTION_GUIDE = true;

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

function validateVirtualTourNodes(nodes: TourNode[], startNodeId: string) {
  if (!nodes.length) {
    throw new Error('No hay nodos configurados para el Tour 360.');
  }

  const ids = new Set(nodes.map((node) => node.id));

  if (!ids.has(startNodeId)) {
    throw new Error(`El startNodeId "${startNodeId}" no existe en nodes.`);
  }

  for (const node of nodes) {
    if (!node.id) {
      throw new Error('Hay un nodo sin id.');
    }

    if (!node.panorama) {
      throw new Error(`El nodo "${node.id}" no tiene panorama.`);
    }

    for (const link of node.links ?? []) {
      if (!ids.has(link.nodeId)) {
        throw new Error(
          `Link roto: "${node.id}" apunta a "${link.nodeId}", pero ese nodo no existe.`,
        );
      }
    }
  }
}

/*
 * Usa el tooltip HTML por defecto del VirtualTourPlugin (name + thumbnail + caption
 * del nodo destino) y agrega la descripcion cuando existe.
 */
const enhanceTourLinkTooltip = (
  content: string,
  _link: TourLink,
  node: TourNode,
) => {
  if (!content || !node.description || content.includes(node.description)) {
    return content;
  }

  return `${content}<p class="psv-virtual-tour-tooltip-desc">${node.description}</p>`;
};

// TEMP PSV DEFAULT TEST:
// Se desactivan plugins, nodos, hotspots, galeria y rutas temporalmente para validar
// Photo Sphere Viewer base en npm run preview. Restaurar la implementacion completa
// despues de confirmar que este visor default carga correctamente.
export const VirtualTour360: React.FC<VirtualTour360Props> = ({
  nodes: nodesProp,
  initialNodeId: initialNodeIdProp,
  selectedCampus = null,
  tourConfig = null,
}) => {
  const nodes = tourConfig?.nodes ?? nodesProp ?? tour360Nodes;
  const initialNodeId = tourConfig?.startNodeId ?? initialNodeIdProp ?? TOUR360_START_NODE_ID;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(initialNodeId ?? null);
  const [activeImagePopup, setActiveImagePopup] = useState<ImageMarkerPopup | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoMarkerPopup | null>(null);

  const defaultPanorama =
    tour360Nodes.find((node) => node.id === TOUR360_START_NODE_ID)?.panorama ??
    tour360Nodes[0]?.panorama ??
    DEPLOY_FALLBACK_PANORAMA ??
    KNOWN_GOOD_PLACEHOLDER_PANORAMA;

  const fallbackNode: TourNode = {
    id: 'psv-test',
    panorama: defaultPanorama,
    thumbnail: defaultPanorama,
    name: 'PSV Test',
  };

  const startNode = nodes.find((node) => node.id === initialNodeId) ?? nodes[0];
  const safeStartNode = startNode ?? fallbackNode;
  const safeNodes = (nodes.length > 0 ? nodes : [fallbackNode]).map((node) => ({
    ...node,
    thumbnail: node.thumbnail ?? node.panorama,
  }));
  const currentNode =
    safeNodes.find((node) => node.id === currentNodeId) ??
    safeStartNode;
  const currentSectionTitle =
    selectedCampus?.title ??
    currentNode?.name ??
    currentNode?.caption ??
    currentNode?.id ??
    'Ruta sede A';

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
    if (!containerRef.current || viewerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    console.log('[PSV TEST] container size:', { width, height });

    if (width === 0 || height === 0) {
      setViewerError(`El contenedor no tiene tamano valido: ${width}x${height}`);
      return;
    }

    let viewer: Viewer | null = null;
    let virtualTourForCleanup: any = null;
    let handleNodeChanged: ((event: any) => void) | null = null;
    let currentNodeFallbackId: number | null = null;
    let markersPluginForCleanup: any = null;
    let handleMarkerSelect: ((event: any) => void) | null = null;
    let handleVideoHotspotKeydown: ((event: KeyboardEvent) => void) | null = null;

    try {
      validateVirtualTourNodes(nodes, initialNodeId);

      console.table(
        safeNodes.map((node) => ({
          id: node.id,
          panorama: node.panorama,
          thumbnail: node.thumbnail,
          links: node.links?.map((link) => link.nodeId).join(', '),
        })),
      );

      let viewerConfig: any;

      if (ENABLE_VIRTUAL_TOUR) {
        const plugins: any[] = [];

        if (ENABLE_MARKERS || ENABLE_MEDIA_MARKERS) {
          plugins.push(
            MarkersPlugin.withConfig({
              clickEventOnMarker: false,
            }),
          );
        }

        if (ENABLE_GALLERY) {
          plugins.push([
            GalleryPlugin,
            {
              thumbnailSize: { width: 200, height: 100 },
              visibleOnLoad: false,
              hideOnClick: true,
            },
          ]);
        }

        plugins.push([
          VirtualTourPlugin,
          {
            positionMode: 'gps',
            renderMode: '3d',
            nodes: safeNodes,
            startNodeId: safeStartNode.id,
            preload: false,
            showLinkTooltip: true,
            transitionOptions: {
              showLoader: true,
              effect: 'fade',
              speed: '20rpm',
              rotation: true,
            },
            ...(ENABLE_CUSTOM_TOOLTIP
              ? { getLinkTooltip: enhanceTourLinkTooltip }
              : {}),
            ...(ENABLE_CUSTOM_ARROWS
              ? {
                  arrowStyle: {
                    element: createTourArrowElement,
                    className: 'tour-hotspot-link',
                    size: { width: 180, height: 150 },
                  },
                }
              : {}),
          },
        ]);

        viewerConfig = {
          container: containerRef.current,
          navbar: ENABLE_TOUR_NAVBAR
            ? ['zoom', 'move', 'markers', 'gallery', 'fullscreen']
            : ['zoom', 'move', 'fullscreen'],
          mousewheel: true,
          size: {
            width: '100%',
            height: '100%',
          },
          plugins,
        };
      } else {
        viewerConfig = {
          container: containerRef.current,
          panorama: safeStartNode.panorama,
          navbar: ENABLE_TOUR_NAVBAR
            ? ['zoom', 'move', 'fullscreen']
            : ['zoom', 'move', 'fullscreen'],
        };
      }

      viewer = new Viewer(viewerConfig);
      viewerRef.current = viewer;

      if (ENABLE_VIRTUAL_TOUR) {
        const virtualTour = viewer.getPlugin(VirtualTourPlugin) as any;
        virtualTourForCleanup = virtualTour;

        console.log('[Tour360 TEST] VirtualTourPlugin:', virtualTour);
        console.log('[Tour360 TEST] Current node:', virtualTour?.getCurrentNode?.());

        handleNodeChanged = (event: any) => {
          const nextNodeId = event?.node?.id ?? event?.nodeId ?? null;

          if (nextNodeId) {
            console.log('[Tour360] node changed:', nextNodeId);
            setCurrentNodeId(nextNodeId);
          }

          setViewerReady(true);
          setViewerError(null);
        };

        virtualTour?.addEventListener?.('node-changed', handleNodeChanged);

        if (ENABLE_MEDIA_MARKERS) {
          const markersPlugin = viewer.getPlugin(MarkersPlugin) as any;
          markersPluginForCleanup = markersPlugin;
          const currentNode = virtualTour?.getCurrentNode?.();
          const currentNodeId = currentNode?.id ?? safeStartNode.id;
          const mediaMarkers = tour360MediaMarkersByNode[currentNodeId] ?? [];

          console.log('[Tour360 TEST] Media markers:', {
            currentNodeId,
            count: mediaMarkers.length,
            mediaMarkers,
          });

          markersPlugin?.setMarkers?.(mediaMarkers);
        }

        currentNodeFallbackId = window.setTimeout(() => {
          const currentPluginNode = virtualTour?.getCurrentNode?.();

          if (currentPluginNode?.id) {
            console.log('[Tour360 TEST] Fallback ready:', currentPluginNode.id);
            setCurrentNodeId(currentPluginNode.id);
            setViewerReady(true);
            setViewerError(null);
          }
        }, 1200);
      }

      const markersPlugin = viewer.getPlugin(MarkersPlugin) as any;
      markersPluginForCleanup = markersPluginForCleanup ?? markersPlugin;

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

      handleMarkerSelect = (event: any) => {
        const data = event.marker?.data ?? event.marker?.config?.data;

        if (openVideoFromMarkerData(data)) {
          return;
        }

        if (data?.action !== 'open-image-popup' || typeof data.image !== 'string') {
          return;
        }

        setActiveImagePopup({
          title: typeof data.title === 'string' ? data.title : 'Imagen informativa',
          image: data.image,
          alt: typeof data.alt === 'string' ? data.alt : 'Imagen informativa del tour 360',
        });
      };

      handleVideoHotspotKeydown = (event: KeyboardEvent) => {
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

      markersPluginForCleanup?.addEventListener?.('select-marker', handleMarkerSelect);
      viewer.container.addEventListener('keydown', handleVideoHotspotKeydown);

      console.log('[PSV TEST] viewer creado correctamente');

      const handleReady = () => {
        console.log('[PSV TEST] viewer ready');
        setViewerReady(true);
        setViewerError(null);
      };

      const handlePanoramaError = (event: any) => {
        console.error('[PSV TEST] panorama-error:', event);
        setViewerError(
          event?.error instanceof Error
            ? event.error.message
            : 'No se pudo cargar el panorama de prueba',
        );
      };

      viewer.addEventListener('ready', handleReady);
      viewer.addEventListener('panorama-error', handlePanoramaError);

      return () => {
        if (currentNodeFallbackId !== null) {
          window.clearTimeout(currentNodeFallbackId);
        }
        if (virtualTourForCleanup && handleNodeChanged) {
          virtualTourForCleanup.removeEventListener?.('node-changed', handleNodeChanged);
        }
        if (markersPluginForCleanup && handleMarkerSelect) {
          markersPluginForCleanup.removeEventListener?.('select-marker', handleMarkerSelect);
        }
        if (handleVideoHotspotKeydown) {
          viewer?.container.removeEventListener('keydown', handleVideoHotspotKeydown);
        }
        viewer?.removeEventListener('ready', handleReady);
        viewer?.removeEventListener('panorama-error', handlePanoramaError);
        viewer?.destroy();
        viewerRef.current = null;
      };
    } catch (error) {
      console.error('[PSV TEST] error creando viewer:', error);
      setViewerError(
        error instanceof Error
          ? error.message
          : 'Error desconocido creando Photo Sphere Viewer',
      );
    }

    return () => {
      if (currentNodeFallbackId !== null) {
        window.clearTimeout(currentNodeFallbackId);
      }
      if (virtualTourForCleanup && handleNodeChanged) {
        virtualTourForCleanup.removeEventListener?.('node-changed', handleNodeChanged);
      }
      if (markersPluginForCleanup && handleMarkerSelect) {
        markersPluginForCleanup.removeEventListener?.('select-marker', handleMarkerSelect);
      }
      if (handleVideoHotspotKeydown) {
        viewer?.container.removeEventListener('keydown', handleVideoHotspotKeydown);
      }
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, []);

  return (
        <div className="relative h-full w-full bg-black">
          <div ref={containerRef} className="h-full w-full bg-black" />
    
          <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:left-4 sm:top-4 sm:max-w-[24rem] sm:px-5">
            <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 sm:text-xs">
              {selectedCampus ? 'Recorrido activo' : 'Tour 360'}
            </p>
            <h2 className="m-0 mt-1 truncate font-['Montserrat'] text-lg font-black leading-tight text-white sm:text-xl md:text-2xl">
              {currentSectionTitle}
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
