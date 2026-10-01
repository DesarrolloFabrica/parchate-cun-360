// Detecta equipos/navegadores sin aceleración gráfica real y activa un modo
// liviano (`html.perf-lite`) que desactiva los efectos más costosos de pintar
// (backdrop-filter, brillos desenfocados, animaciones infinitas).
//
// Caso típico: Edge con "Usar aceleración de gráficos" desactivado o con la GPU
// en lista negra. Ahí el navegador renderiza por software (SwiftShader /
// Microsoft Basic Render Driver) y cada desenfoque se calcula en la CPU.
//
// Forzar manualmente para pruebas: ?perf=lite o ?perf=full en la URL.

const SOFTWARE_RENDERER_PATTERN = /swiftshader|basic render|llvmpipe|softpipe|software/i;

const isSoftwareRendering = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    // Con renderizado por software el navegador rechaza el contexto si se pide
    // `failIfMajorPerformanceCaveat`.
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) as WebGLRenderingContext | null;
    if (!gl) return true;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    return SOFTWARE_RENDERER_PATTERN.test(renderer);
  } catch {
    return false;
  }
};

const isLowEndDevice = (): boolean => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
};

export const applyPerformanceMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  const override = new URLSearchParams(window.location.search).get('perf');
  const lite = override === 'lite' || (override !== 'full' && (isSoftwareRendering() || isLowEndDevice()));

  document.documentElement.classList.toggle('perf-lite', lite);
  return lite;
};
