// Utilidades para contenidos alojados en Google Drive.
// Drive no es un CDN de video: el visor `/preview` descarga varios MB de JS
// antes de mostrar algo. Estas funciones permiten usar recursos más livianos
// (miniaturas) y ofrecer alternativas cuando el visor tarda o falla.

const DRIVE_FILE_ID_PATTERNS = [
  /drive\.google\.com\/file\/d\/([^/?#]+)/,
  /drive\.google\.com\/(?:uc|open|thumbnail)\?(?:.*&)?id=([^&#]+)/,
];

export const getDriveFileId = (url: string | undefined | null): string | null => {
  if (!url) return null;

  for (const pattern of DRIVE_FILE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
};

export const isDriveUrl = (url: string | undefined | null): boolean => Boolean(getDriveFileId(url));

/**
 * Miniatura estática servida por Drive (imagen liviana, sin cargar el visor).
 * `width` es el ancho máximo solicitado en px.
 */
export const getDriveThumbnailUrl = (url: string | undefined | null, width = 640): string | null => {
  const id = getDriveFileId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${width}` : null;
};

/** Enlace para abrir el archivo directamente en Drive (pestaña nueva). */
export const getDriveViewUrl = (url: string | undefined | null): string | null => {
  const id = getDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/view` : null;
};

/** Enlace de descarga directa del archivo. */
export const getDriveDownloadUrl = (url: string | undefined | null): string | null => {
  const id = getDriveFileId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : null;
};

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

/** true cuando el navegador reporta ahorro de datos o una red 2G. */
export const isSlowConnection = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!connection) return false;

  return Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType ?? '');
};
