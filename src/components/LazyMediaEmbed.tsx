import React, { useEffect, useState } from 'react';
import { getDriveThumbnailUrl, getDriveViewUrl, isDriveUrl } from '../utils/driveMedia';
import '../styles/lazy-media-embed.css';

const DEFAULT_TIMEOUT_MS = 15000;
// Videos de Drive: si en este tiempo el reproductor no responde, se ofrece abrirlo en Drive.
const DRIVE_VIDEO_TIMEOUT_MS = 8000;

type LoadStatus = 'loading' | 'loaded' | 'slow';

interface LazyMediaEmbedProps {
  src: string;
  title: string;
  /** Clases del contenedor: reciben el tamaño que antes tenía el <iframe>. */
  className?: string;
  allow?: string;
  allowFullScreen?: boolean;
  /**
   * 'auto': monta el iframe de inmediato (con indicador de carga).
   * 'facade': muestra una miniatura y solo monta el iframe al hacer clic.
   */
  mode?: 'auto' | 'facade';
  posterUrl?: string | null;
  facadeLabel?: string;
  /**
   * Tiempo sin respuesta tras el cual se ofrecen alternativas
   * (por defecto 8 s para videos de Drive y 15 s para el resto).
   */
  timeoutMs?: number;
  variant?: 'media' | 'document';
}

/**
 * Iframe con carga diferida, indicador de progreso y alternativas cuando el
 * proveedor (Google Drive, YouTube...) tarda demasiado o no responde.
 */
export const LazyMediaEmbed: React.FC<LazyMediaEmbedProps> = ({
  src,
  title,
  className = '',
  allow = 'autoplay; fullscreen',
  allowFullScreen = true,
  mode = 'auto',
  posterUrl,
  facadeLabel = 'Reproducir video',
  timeoutMs,
  variant = 'media',
}) => {
  const [activated, setActivated] = useState(mode === 'auto');
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [attempt, setAttempt] = useState(0);
  const [posterFailed, setPosterFailed] = useState(false);
  // Se queda visible aunque Drive termine respondiendo tarde: si tardó, es
  // probable que el video tampoco se reproduzca bien.
  const [driveUnresponsive, setDriveUnresponsive] = useState(false);

  const isDriveVideo = variant === 'media' && isDriveUrl(src);
  const effectiveTimeoutMs = timeoutMs ?? (isDriveVideo ? DRIVE_VIDEO_TIMEOUT_MS : DEFAULT_TIMEOUT_MS);

  // Si cambia el recurso se reinicia el ciclo de carga.
  useEffect(() => {
    setActivated(mode === 'auto');
    setStatus('loading');
    setAttempt(0);
    setPosterFailed(false);
    setDriveUnresponsive(false);
  }, [src, mode]);

  useEffect(() => {
    if (!activated || status !== 'loading') return;

    const timer = window.setTimeout(() => {
      setStatus('slow');
      if (isDriveVideo) setDriveUnresponsive(true);
    }, effectiveTimeoutMs);
    return () => window.clearTimeout(timer);
  }, [activated, status, attempt, effectiveTimeoutMs, isDriveVideo]);

  const handleRetry = () => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  };

  const resolvedPoster = posterUrl === undefined ? getDriveThumbnailUrl(src, 960) : posterUrl;
  const externalUrl = getDriveViewUrl(src) ?? src;

  return (
    <div
      className={`lazy-media lazy-media--${variant} ${className}`.trim()}
      data-status={activated ? status : 'idle'}
    >
      {!activated ? (
        <button
          type="button"
          className="lazy-media__facade"
          onClick={() => setActivated(true)}
          aria-label={`${facadeLabel}: ${title}`}
        >
          {resolvedPoster && !posterFailed && (
            <img
              className="lazy-media__poster"
              src={resolvedPoster}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setPosterFailed(true)}
            />
          )}
          <span className="lazy-media__play" aria-hidden="true" />
          <span className="lazy-media__facade-label">{facadeLabel}</span>
        </button>
      ) : (
        <>
          <iframe
            key={attempt}
            className="lazy-media__frame"
            src={src}
            title={title}
            allow={allow}
            allowFullScreen={allowFullScreen}
            onLoad={() => setStatus('loaded')}
          />

          {/* Oculto por defecto: aparece solo si Drive no respondió a tiempo.
              Su reproductor necesita cookies de terceros, que Edge (prevención
              de seguimiento), Safari y Brave bloquean; en una pestaña propia de
              Drive el video sí se reproduce. */}
          {driveUnresponsive && (
            <a
              className={`lazy-media__external${status === 'loaded' ? '' : ' lazy-media__external--centered'}`}
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              ¿No se reproduce? Abrir en Drive ↗
            </a>
          )}

          {/* En videos de Drive el aviso de demora lo cubre el botón de arriba;
              el iframe queda visible por si Drive termina de cargar. */}
          {status !== 'loaded' && !(isDriveVideo && status === 'slow') && (
            <div className="lazy-media__status" role="status" aria-live="polite">
              {status === 'loading' ? (
                <>
                  <span className="lazy-media__spinner" aria-hidden="true" />
                  <span className="lazy-media__message">Cargando contenido…</span>
                </>
              ) : (
                <>
                  <span className="lazy-media__message">
                    El contenido está tardando más de lo normal. Puede deberse a la conexión.
                  </span>
                  <span className="lazy-media__actions">
                    <button type="button" className="lazy-media__action" onClick={handleRetry}>
                      Reintentar
                    </button>
                    <a
                      className="lazy-media__action lazy-media__action--secondary"
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir en Drive
                    </a>
                  </span>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
