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
export const ENABLE_MEDIA_MARKERS = false;

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

const normalizePanoramaUrlForCompare = (url: string) => {
  try {
    return decodeURIComponent(new URL(url, window.location.origin).pathname);
  } catch {
    return decodeURIComponent(url.split('?')[0]);
  }
};

const isSamePanoramaUrl = (left: string, right: string) =>
  normalizePanoramaUrlForCompare(left) === normalizePanoramaUrlForCompare(right);

export const VirtualTour360: React.FC<VirtualTour360Props> = ({
  nodes: nodesProp,
  initialNodeId: initialNodeIdProp,
  selectedCampus: _selectedCampus = null,
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
  const fallbackPanorama = defaultPanorama || DEPLOY_FALLBACK_PANORAMA || KNOWN_GOOD_PLACEHOLDER_PANORAMA;
  const virtualTourPositionMode = safeNodes.some((node) =>
    node.links?.some((link) => Boolean(link.position)),
  )
    ? 'manual'
    : 'gps';
  const currentNode =
    safeNodes.find((node) => node.id === currentNodeId) ??
    safeStartNode;

  const getMarkersForNode = (nodeId: string) => {
    const nodeMarkers = safeNodes.find((node) => node.id === nodeId)?.markers ?? [];
    const mediaMarkers = tour360MediaMarkersByNode[nodeId] ?? [];
    const markersById = new Map<string, any>();

    for (const marker of [...nodeMarkers, ...mediaMarkers]) {
      const markerId = typeof marker?.id === 'string' ? marker.id : JSON.stringify(marker);
      markersById.set(markerId, marker);
    }

    return Array.from(markersById.values());
  };

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

    if (width === 0 || height === 0) {
      setViewerError(`El contenedor no tiene tamano valido: ${width}x${height}`);
      return;
    }

    let viewer: Viewer | null = null;
    let virtualTourForCleanup: any = null;
    let handleNodeChanged: ((event: any) => void) | null = null;
    let markersPluginForCleanup: any = null;
    let handleMarkerSelect: ((event: any) => void) | null = null;
    let handleVideoHotspotKeydown: ((event: KeyboardEvent) => void) | null = null;
    const failedPanoramaUrls = new Set<string>();

    const buildResilientTourNodes = () =>
      safeNodes.map((node) => {
        const nodePanoramaFailed = Array.from(failedPanoramaUrls).some((failedPanorama) =>
          isSamePanoramaUrl(failedPanorama, node.panorama),
        );
        const patchedPanorama = nodePanoramaFailed ? fallbackPanorama : node.panorama;

        return {
          ...node,
          panorama: patchedPanorama,
          thumbnail: nodePanoramaFailed ? fallbackPanorama : node.thumbnail,
          links: node.links?.map((link) => {
            const destination = safeNodes.find((candidate) => candidate.id === link.nodeId);
            const destinationFailed = destination
              ? Array.from(failedPanoramaUrls).some((failedPanorama) =>
                  isSamePanoramaUrl(failedPanorama, destination.panorama),
                )
              : false;

            return destinationFailed
              ? {
                  ...link,
                  data: {
                    ...link.data,
                    tooltipImage: fallbackPanorama,
                  },
                }
              : link;
          }),
        };
      });

    try {
      validateVirtualTourNodes(nodes, initialNodeId);

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
            positionMode: virtualTourPositionMode,
            renderMode: '3d',
            preload: false,
            showLinkTooltip: true,
            // nodes/startNodeId se pasan aqui (en construccion) para que el plugin
            // controle la carga inicial del panorama de punta a punta. Si en su
            // lugar se llama a virtualTour.setNodes() despues de crear el Viewer,
            // este ya arranco su propia carga via viewerConfig.panorama y ambas
            // cargas compiten por el mismo panorama: la carga en curso se aborta
            // para reiniciarla, lo que a veces dispara panorama-error de forma
            // espuria (mas facil de reproducir con paneles pesados o lentos).
            nodes: buildResilientTourNodes(),
            startNodeId: safeStartNode.id,
            // Funcion en vez de objeto fijo: el plugin la llama con
            // (toNode, fromNode, fromLink) en cada cambio de nodo. Solo
            // forzamos `rotateTo` con defaultYaw/defaultPitch del nodo
            // cuando NO venimos siguiendo una flecha (fromLink es null: es
            // la carga inicial del tour o un salto directo, ej. desde el
            // mapa). Si venimos de una flecha, no devolvemos `rotateTo` y el
            // plugin sigue con su comportamiento normal: girar hacia el
            // punto por donde "entraste" (continuidad del recorrido).
            transitionOptions: (toNode: any, _fromNode: any, fromLink: any) => {
              const base = {
                showLoader: true,
                effect: 'fade',
                speed: '20rpm',
                rotation: true,
              };

              if (!fromLink && (toNode?.defaultYaw || toNode?.defaultPitch)) {
                return {
                  ...base,
                  rotateTo: {
                    yaw: toNode.defaultYaw ?? '0deg',
                    pitch: toNode.defaultPitch ?? '0deg',
                  },
                };
              }

              return base;
            },
            ...(ENABLE_CUSTOM_TOOLTIP
              ? { getLinkTooltip: enhanceTourLinkTooltip }
              : {}),
            ...(ENABLE_CUSTOM_ARROWS
              ? {
                  arrowStyle: {
                    element: createTourArrowElement,
                    className: 'tour-hotspot-link',
                    // Hitbox compacta: solo el círculo/chevron (~64px). El label
                    // se dibuja fuera con overflow visible + pointer-events:none.
                    size: { width: 64, height: 64 },
                  },
                }
              : {}),
          },
        ]);

        viewerConfig = {
          container: containerRef.current,
          // Sin `panorama` aqui: VirtualTourPlugin ya recibio nodes/startNodeId
          // arriba y carga el panorama inicial el mismo. Si tambien se define
          // `panorama` en este nivel, el Viewer dispara una segunda carga del
          // mismo archivo que compite con la del plugin (ver comentario arriba).
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

      if (import.meta.env.DEV) {
        // Ayuda para ubicar flechas manualmente (yaw/pitch): en DevTools,
        // apunta la camara al punto exacto donde quieres la flecha y corre
        // `psvAim()` en la consola. Imprime el { yaw, pitch } en grados listo
        // para pegar en el campo `position` del link correspondiente.
        (window as any).__psvViewer = viewer;
        (window as any).psvAim = () => {
          const pos = viewer?.getPosition();
          if (!pos) return null;
          const toDeg = (rad: number) => `${((rad * 180) / Math.PI).toFixed(1)}deg`;
          const result = { yaw: toDeg(pos.yaw), pitch: toDeg(pos.pitch) };
          console.log('[Tour360] position: { yaw, pitch } =', result);
          return result;
        };
      }

      if (ENABLE_VIRTUAL_TOUR) {
        const virtualTour = viewer.getPlugin(VirtualTourPlugin) as any;
        virtualTourForCleanup = virtualTour;

        // El plugin ya recibio nodes/startNodeId en su config de construccion
        // (ver viewerConfig arriba), asi que el nodo inicial se carga una sola
        // vez sin competir con ninguna otra carga. 'node-changed' cubre tanto
        // ese primer nodo como las navegaciones posteriores.
        handleNodeChanged = (event: any) => {
          const nextNodeId = event?.node?.id ?? event?.nodeId ?? null;

          if (nextNodeId) {
            setCurrentNodeId(nextNodeId);
            if (ENABLE_MEDIA_MARKERS) {
              const markersPlugin = viewer?.getPlugin(MarkersPlugin) as any;
              markersPlugin?.setMarkers?.(getMarkersForNode(nextNodeId));
            }
          }

          setViewerReady(true);
          setViewerError(null);
        };

        virtualTour?.addEventListener?.('node-changed', handleNodeChanged);

        if (ENABLE_MEDIA_MARKERS) {
          const markersPlugin = viewer.getPlugin(MarkersPlugin) as any;
          markersPluginForCleanup = markersPlugin;
          markersPlugin?.setMarkers?.(getMarkersForNode(safeStartNode.id));
        }
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

      const handleReady = () => {
        // Reajustar canvas tras el layout/escala del stage (evita recorte y fallos).
        requestAnimationFrame(() => {
          try {
            viewer?.autoSize?.();
          } catch {
            /* ignore */
          }
        });
        setViewerReady(true);
        setViewerError(null);
      };

      const handlePanoramaError = (event: any) => {
        console.error('[Tour360] Panorama load failed:', event);
        const failedPanorama =
          typeof event?.panorama === 'string'
            ? event.panorama
            : typeof event?.node?.panorama === 'string'
              ? event.node.panorama
              : null;
        const failedNode =
          (failedPanorama
            ? safeNodes.find((node) => isSamePanoramaUrl(node.panorama, failedPanorama))
            : null) ??
          (typeof event?.node?.id === 'string'
            ? safeNodes.find((node) => node.id === event.node.id)
            : null) ??
          currentNode;
        const recoveryNodeId = failedNode?.id ?? safeStartNode.id;

        if (failedPanorama && failedPanorama !== fallbackPanorama) {
          failedPanoramaUrls.add(failedPanorama);
        }

        try {
          const virtualTour = virtualTourForCleanup;
          const recoveryNodes = buildResilientTourNodes();

          if (virtualTour?.setNodes && recoveryNodeId) {
            virtualTour.setNodes(recoveryNodes, recoveryNodeId);
            setCurrentNodeId(recoveryNodeId);
            setViewerReady(true);
            setViewerError(null);
            return;
          }

          viewer?.setPanorama?.(fallbackPanorama);
          setViewerReady(true);
          setViewerError(null);
        } catch (recoveryError) {
          console.error('[Tour360] Error recuperando panorama fallido:', recoveryError);
          setViewerError(
            event?.error instanceof Error
              ? event.error.message
              : 'No se pudo cargar el panorama 360',
          );
        }
      };

      viewer.addEventListener('ready', handleReady);
      viewer.addEventListener('panorama-error', handlePanoramaError);

      const resizeObserver =
        typeof ResizeObserver !== 'undefined' && containerRef.current
          ? new ResizeObserver(() => {
              try {
                viewer?.autoSize?.();
              } catch {
                /* ignore */
              }
            })
          : null;
      if (containerRef.current && resizeObserver) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver?.disconnect();
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
      console.error('[Tour360] Error creando Photo Sphere Viewer:', error);
      setViewerError(
        error instanceof Error
          ? error.message
          : 'Error desconocido creando Photo Sphere Viewer',
      );
    }

    return () => {
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
