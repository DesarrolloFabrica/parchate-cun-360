import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { LazyMediaEmbed } from './LazyMediaEmbed';
import {
  getDriveDownloadUrl,
  getDriveThumbnailUrl,
  getDriveViewUrl,
} from '../utils/driveMedia';
import '../styles/document-viewer.css';

const ZOOM_LEVELS = [1, 1.25, 1.5, 2, 2.5, 3];

interface DocumentViewerProps {
  /** URL `/preview` de Drive (o URL directa de la imagen). */
  src: string;
  /** URL directa de la imagen, si existe (tiene prioridad sobre la miniatura de Drive). */
  imageUrl?: string;
  title: string;
  alt?: string;
  /**
   * 'image': JPG/PNG mostrados como <img> (miniatura de Drive en alta resolución).
   * 'pdf': PDF multipágina en el visor de Drive.
   */
  kind: 'image' | 'pdf';
}

/**
 * Visor accesible para documentos e infografías con controles propios
 * (zoom, pantalla completa, abrir en Drive y descargar). No depende de los
 * controles del visor de Drive, que no aparecen para imágenes y cambian según
 * el navegador.
 */
export const DocumentViewer: React.FC<DocumentViewerProps> = ({ src, imageUrl, title, alt, kind }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const previousZoomRef = useRef(1);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

  const [zoomIndex, setZoomIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const zoom = ZOOM_LEVELS[zoomIndex];
  const imageSrc = kind === 'image' ? imageUrl || getDriveThumbnailUrl(src, 2000) : null;
  const showImage = Boolean(imageSrc) && !imageFailed;
  const externalUrl = getDriveViewUrl(src) ?? imageUrl ?? src;
  const downloadUrl = getDriveDownloadUrl(src) ?? imageUrl ?? null;
  const fullscreenSupported = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled);

  useEffect(() => {
    setZoomIndex(0);
    setImageFailed(false);
  }, [src, imageUrl]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mantiene centrado el punto que se estaba viendo al cambiar el zoom.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const previousZoom = previousZoomRef.current;
    previousZoomRef.current = zoom;
    if (!viewport || previousZoom === zoom) return;

    const ratio = zoom / previousZoom;
    viewport.scrollLeft = (viewport.scrollLeft + viewport.clientWidth / 2) * ratio - viewport.clientWidth / 2;
    viewport.scrollTop = (viewport.scrollTop + viewport.clientHeight / 2) * ratio - viewport.clientHeight / 2;
  }, [zoom]);

  const zoomIn = () => setZoomIndex((index) => Math.min(index + 1, ZOOM_LEVELS.length - 1));
  const zoomOut = () => setZoomIndex((index) => Math.max(index - 1, 0));
  const resetZoom = () => setZoomIndex(0);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void rootRef.current?.requestFullscreen?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomIn();
    } else if (event.key === '-') {
      event.preventDefault();
      zoomOut();
    } else if (event.key === '0') {
      event.preventDefault();
      resetZoom();
    }
  };

  // Arrastrar para desplazarse por la imagen ampliada.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!showImage || zoom === 1 || event.button !== 0) return;
    const viewport = event.currentTarget;
    dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    event.currentTarget.scrollLeft = drag.left - (event.clientX - drag.x);
    event.currentTarget.scrollTop = drag.top - (event.clientY - drag.y);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const canvasStyle = { width: `${zoom * 100}%`, height: `${zoom * 100}%` };

  return (
    <div
      ref={rootRef}
      className={`doc-viewer doc-viewer--${showImage ? 'image' : 'pdf'}`}
      onKeyDown={handleKeyDown}
    >
      <div className="doc-viewer__toolbar" role="toolbar" aria-label={`Controles de ${title}`}>
        <button
          type="button"
          className="doc-viewer__button"
          onClick={zoomOut}
          disabled={zoomIndex === 0}
          aria-label="Alejar"
          title="Alejar (−)"
        >
          <ZoomOut aria-hidden="true" />
        </button>
        <button
          type="button"
          className="doc-viewer__button doc-viewer__zoom-value"
          onClick={resetZoom}
          aria-label={`Zoom ${Math.round(zoom * 100)}%. Restablecer`}
          title="Restablecer zoom (0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className="doc-viewer__button"
          onClick={zoomIn}
          disabled={zoomIndex === ZOOM_LEVELS.length - 1}
          aria-label="Acercar"
          title="Acercar (+)"
        >
          <ZoomIn aria-hidden="true" />
        </button>

        <span className="doc-viewer__separator" aria-hidden="true" />

        {fullscreenSupported && (
          <button
            type="button"
            className="doc-viewer__button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          </button>
        )}
        <a
          className="doc-viewer__button"
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir en una pestaña nueva"
          title="Abrir en una pestaña nueva"
        >
          <ExternalLink aria-hidden="true" />
        </a>
        {downloadUrl && (
          <a
            className="doc-viewer__button"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar"
            title="Descargar"
          >
            <Download aria-hidden="true" />
          </a>
        )}
      </div>

      <div
        ref={viewportRef}
        className={`doc-viewer__viewport${showImage && zoom > 1 ? ' doc-viewer__viewport--pannable' : ''}`}
        tabIndex={0}
        role="region"
        aria-label={`${title}. Usa + y − para acercar o alejar.`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="doc-viewer__canvas" style={canvasStyle}>
          {showImage ? (
            <img
              className="doc-viewer__image"
              src={imageSrc!}
              alt={alt ?? title}
              decoding="async"
              draggable={false}
              referrerPolicy="no-referrer"
              onDoubleClick={() => setZoomIndex((index) => (index === 0 ? 3 : 0))}
              onError={() => setImageFailed(true)}
            />
          ) : (
            // El iframe se dibuja al tamaño del visor y se escala: así el zoom
            // también funciona sobre el visor de Drive (que es de otro dominio).
            <div
              className="doc-viewer__scaled"
              style={{ width: `${100 / zoom}%`, height: `${100 / zoom}%`, transform: `scale(${zoom})` }}
            >
              <LazyMediaEmbed
                src={src}
                title={title}
                className="doc-viewer__frame"
                allow="autoplay; fullscreen"
                variant="document"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
