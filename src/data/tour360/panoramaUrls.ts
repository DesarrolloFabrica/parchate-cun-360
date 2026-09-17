/**
 * Resolución de URLs de panoramas para Tour 360.
 *
 * Estrategia (sin imports estáticos frágiles):
 * 1. Bundled: archivos en src/assets/imagenes/ vía import.meta.glob (build-time).
 * 2. Public panoramas: public/panoramas/{path} (deploy estable, sin hash).
 * 3. Public tours: public/tours/{path} (estructura objetivo por sede).
 *
 * Para sedes en preparación, usar resolveTourPanorama() con fallbackKnownPublic
 * apuntando a un panorama existente hasta que exista el archivo final.
 */

const bundledImageModules = import.meta.glob('../../assets/imagenes/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const baseUrl = import.meta.env.BASE_URL;

export const TOUR_PUBLIC_ROOT = `${baseUrl}tours/`;
export const PANORAMA_PUBLIC_ROOT = `${baseUrl}panoramas/`;

/** Panorama de respaldo verificado y optimizado para Photo Sphere Viewer. */
export const KNOWN_GOOD_PLACEHOLDER_PANORAMA = `${PANORAMA_PUBLIC_ROOT}Sede_A_optimized/Calle_A.jpg`;

/** Fallback PSV verificado en public/panoramas/ (misma imagen que Calle A, nombre estable). */
export const DEPLOY_FALLBACK_PANORAMA = KNOWN_GOOD_PLACEHOLDER_PANORAMA;

/**
 * Assets de panorama con copia verificada en public/panoramas/.
 * Priorizar estas rutas en deploy evita URLs hasheadas de Vite.
 */
const PUBLIC_PANORAMA_ALIASES: Record<string, string> = {
  'Calle_A.png': 'Sede_A_optimized/Calle_A.jpg',
  '3SA.jpeg': 'Sede_A_optimized/3SA.jpg',
  '5SA.png': 'Sede_A_optimized/5SA.jpg',
  '6SA.png': 'Sede_A_optimized/6SA.jpg',
  'Sede_A/LobbySA.png': 'Sede_A_optimized/LobbySA.jpg',
  'MARCO.png': 'iconos/MARCO.png',
  'AS.png': 'iconos/AS.png',
  'iconos/alizon.png': 'iconos/alizon.png',
  'sede_test.png': 'test_optimized/sede_test.jpg',
};

export function resolvePanoramaUrl(options: {
  bundledAssetPath?: string;
  publicPanoramaPath?: string;
  /** public = rutas estables en deploy; bundled = hash Vite en dev/prod */
  prefer?: 'public' | 'bundled';
}): string {
  const prefer = options.prefer ?? 'public';
  const bundled = options.bundledAssetPath
    ? getBundledPanoramaUrl(options.bundledAssetPath)
    : null;
  const publicUrl = options.publicPanoramaPath
    ? getPublicPanoramaUrl(options.publicPanoramaPath)
    : null;

  if (prefer === 'public') {
    if (publicUrl) return publicUrl;
    if (bundled) return bundled;
  } else {
    if (bundled) return bundled;
    if (publicUrl) return publicUrl;
  }

  return KNOWN_GOOD_PLACEHOLDER_PANORAMA;
}

export function normalizeAssetPath(path: string): string {
  return path
    .replace(/^\/?assets\/imagenes\//, '')
    .replace(/^\/?src\/assets\/imagenes\//, '')
    .replace(/^\/?panoramas\//, '')
    .replace(/^\/?tours\//, '')
    .replace(/\\/g, '/');
}

/**
 * Busca una imagen empaquetada en src/assets/imagenes/.
 * Devuelve null si no existe (no lanza error en build).
 */
export function getBundledPanoramaUrl(assetPath: string): string | null {
  const normalizedPath = normalizeAssetPath(assetPath);
  const moduleKey = `../../assets/imagenes/${normalizedPath}`;
  return bundledImageModules[moduleKey] ?? null;
}

/** URL estable en public/panoramas/ (codifica espacios y caracteres especiales por segmento). */
export function getPublicPanoramaUrl(relativePath: string): string {
  const encodedPath = normalizeAssetPath(relativePath)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${PANORAMA_PUBLIC_ROOT}${encodedPath}`;
}

/**
 * URL objetivo en public/tours/{city}/{sede}/{file}.
 * No valida existencia: seguro para build/deploy.
 */
export function getPublicTourPanoramaUrl(relativePath: string): string {
  return `${TOUR_PUBLIC_ROOT}${normalizeAssetPath(relativePath)}`;
}

type ResolveTourPanoramaOptions = {
  /** Ruta relativa en public/tours/, ej. "bogota/sede-2/entrada.jpg" */
  tourRelativePath: string;
  /** Ruta opcional en src/assets/imagenes/ */
  bundledAssetPath?: string;
  /** Ruta opcional en public/panoramas/ */
  publicPanoramaPath?: string;
  /** Fallback cuando el asset final aún no existe */
  fallbackKnownPublic?: string;
};

/**
 * Resuelve la mejor URL disponible para un panorama de tour.
 * Prioridad: bundled → public/panoramas → public/tours → fallback.
 */
export function resolveTourPanorama({
  tourRelativePath,
  bundledAssetPath,
  publicPanoramaPath,
  fallbackKnownPublic = KNOWN_GOOD_PLACEHOLDER_PANORAMA,
}: ResolveTourPanoramaOptions): string {
  if (bundledAssetPath) {
    const bundled = getBundledPanoramaUrl(bundledAssetPath);
    if (bundled) return bundled;
  }

  if (publicPanoramaPath) {
    return getPublicPanoramaUrl(publicPanoramaPath);
  }

  // Ruta objetivo documentada; PSV la usará cuando el archivo exista en public/tours/.
  // Mientras tanto, en placeholders usamos fallbackKnownPublic explícitamente
  // desde createPlaceholderTourConfig — no desde aquí en producción de sede 1.
  void tourRelativePath;
  return fallbackKnownPublic;
}

/** Atajo para tours: prioriza public/panoramas cuando hay copia en repo. */
export function resolveLegacyPanoramaUrl(assetOrPublicPath: string): string {
  const normalizedPath = normalizeAssetPath(assetOrPublicPath);
  const publicAlias = PUBLIC_PANORAMA_ALIASES[normalizedPath] ?? normalizedPath;

  return resolvePanoramaUrl({
    bundledAssetPath: assetOrPublicPath,
    publicPanoramaPath: PUBLIC_PANORAMA_ALIASES[normalizedPath] ? publicAlias : undefined,
    prefer: 'public',
  });
}
