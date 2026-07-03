# Párchate CUN 360 — Documentación de Funcionamiento

> Interfaz de onboarding (inducción) institucional para estudiantes nuevos de la **CUN** (Corporación Unificada Nacional de Educación Superior), tanto en modalidad **virtual** como **presencial**.

Este documento explica cómo está construido el aplicativo, qué librerías utiliza, cómo se organiza el código y cuál es la lógica principal de cada sección.

---

## 1. ¿Qué es el aplicativo?

Es una **aplicación web de una sola página (SPA)** hecha en React que sirve como portal de bienvenida gamificado para estudiantes que ingresan a la universidad. La idea central es que el estudiante "se parche" (integre) a la institución a través de una experiencia interactiva que combina:

- Un **recorrido virtual 360°** navegable por las instalaciones de la sede.
- **Rutas de estaciones** (mapas por niveles) que el estudiante debe completar en orden para aprender sobre el campus físico y el ecosistema digital.
- Un **cronograma / calendario** de actividades institucionales.
- Recursos interactivos: revistas tipo flipbook, fichas de estudio 3D, glosario, tableros de Power BI, etc.

La experiencia arranca con una **pantalla de introducción (IntroLoader)** que muestra un video de bienvenida y un comparador tipo "antes/después" con un deslizador para elegir entre modalidad virtual y presencial.

---

## 2. Stack tecnológico y librerías

### 2.1 Núcleo

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| **React** | ^19.0.1 | Librería de UI basada en componentes |
| **React DOM** | ^19.0.1 | Renderizado de React en el navegador |
| **TypeScript** | ~5.8.2 | Tipado estático del proyecto |
| **Vite** | ^6.2.3 | Bundler y servidor de desarrollo (HMR) |
| **React Router DOM** | ^7.18.0 | Enrutamiento de la SPA |

### 2.2 Estilos

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| **Tailwind CSS** | ^4.1.14 | Framework de utilidades CSS |
| **@tailwindcss/vite** | ^4.1.14 | Integración de Tailwind con Vite |
| **autoprefixer** | ^10.4.21 | Prefijos CSS automáticos |

El tema visual se define en `src/index.css` mediante el bloque `@theme` de Tailwind v4:

```2:13:parchate-cun-360/src/index.css
@import "tailwindcss";

@theme {
  --color-brand-green-main: #35B84A;
  --color-brand-green-neon: #9BFF00;
  --color-brand-green-dark: #0B3D2E;
  --color-brand-blue-dark: #172B6B;
  --color-brand-white: #ffffff;
  
  --font-sans: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-display: 'Anton', sans-serif;
}
```

- **Colores de marca**: verde neón (`#9BFF00`), verde principal (`#35B84A`), verde oscuro de fondo (`#0B3D2E`) y azul oscuro (`#172B6B`).
- **Tipografías**: `Anton` para títulos (`font-display`) y `Montserrat` para el cuerpo (`font-sans`), cargadas desde Google Fonts.

### 2.3 Recorrido 360°

Basado en la suite **Photo Sphere Viewer** (v5.14.1):

- `@photo-sphere-viewer/core` — visor base de panoramas equirectangulares.
- `@photo-sphere-viewer/virtual-tour-plugin` — enlaza escenas (nodos) para crear recorridos navegables.
- `@photo-sphere-viewer/markers-plugin` — marcadores interactivos (imágenes, videos, personajes guía).
- `@photo-sphere-viewer/gallery-plugin` — galería de miniaturas.
- `@photo-sphere-viewer/autorotate-plugin` — rotación automática de la cámara.

### 2.4 Animación e íconos

| Herramienta | Rol |
|-------------|-----|
| **motion** (`motion/react`, antes Framer Motion) | Animaciones y transiciones de UI (`AnimatePresence`, `motion.div`) |
| **lottie-web** | Reproducción de animaciones Lottie (p. ej. el ícono animado de la Tierra en `Earth.json`) |
| **lucide-react** | Set de íconos SVG |

### 2.5 Backend / build auxiliar (presentes pero no centrales)

- **express** y **@types/express**: servidor Node (para despliegue/`server.js`).
- **dotenv**: manejo de variables de entorno (p. ej. `GEMINI_API_KEY`).
- **@google/genai**: SDK de Google Gemini (declarado como capacidad, ver `metadata.json`).
- **esbuild**, **tsx**: utilidades de build/ejecución.

> Nota: aunque `@google/genai` está declarado en dependencias y `metadata.json` menciona `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, el código de la interfaz actual no realiza llamadas activas a Gemini; queda como capacidad disponible para funciones futuras (p. ej. el asistente "Cami").

---

## 3. Cómo ejecutar el proyecto

**Prerrequisitos:** Node.js instalado.

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Configurar la clave de Gemini en .env.local
#    GEMINI_API_KEY=tu_clave

# 3. Ejecutar en desarrollo
npm run dev        # levanta Vite en el puerto 3000, host 0.0.0.0
```

Otros scripts (`package.json`):

- `npm run build` — compila para producción con Vite.
- `npm run preview` — sirve la build de producción.
- `npm run lint` — verificación de tipos con `tsc --noEmit`.

La configuración de Vite (`vite.config.ts`) registra los plugins de React y Tailwind, define el alias `@` hacia la raíz del proyecto y permite desactivar el HMR mediante la variable `DISABLE_HMR`.

---

## 4. Estructura del proyecto

```
parchate-cun-360/
├── index.html                 # Punto de entrada HTML (monta #root)
├── vite.config.ts             # Configuración de Vite (React + Tailwind + alias @)
├── tsconfig.json              # Configuración de TypeScript
├── package.json               # Dependencias y scripts
├── metadata.json              # Metadatos de la app (nombre, capacidades)
└── src/
    ├── main.tsx               # Bootstrap de React + BrowserRouter
    ├── App.tsx                # Layout raíz y definición de rutas
    ├── navigation.ts          # Tipos y helpers de rutas / pestañas
    ├── index.css              # Tema Tailwind + estilos globales
    ├── types.ts               # Interfaces de dominio (config, eventos, hotspots...)
    ├── data.ts                # Datos mock (tutoriales, features, calendario, hotspots)
    ├── data/
    │   ├── tour360Nodes.ts        # Nodos/escenas del recorrido 360
    │   └── tour360MediaHotspots.ts# Marcadores multimedia por nodo
    ├── styles/
    │   ├── tour360.css            # Estilos del visor 360
    │   └── tour360-hotspots.css   # Estilos de las flechas/hotspots
    ├── assets/                 # Imágenes, íconos y animaciones Lottie
    └── components/             # Componentes de UI (ver sección 6)
```

---

## 5. Arranque y enrutamiento

### 5.1 Punto de entrada

`src/main.tsx` monta la aplicación dentro de `<BrowserRouter>` y `<StrictMode>`:

```7:13:parchate-cun-360/src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

### 5.2 Rutas

`src/App.tsx` define el layout global (header fijo + `IntroLoader`) y las rutas con React Router:

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `UnifiedOnboardingHub` | Hub principal con pestañas (tour 360, campus, digital, cronograma, secciones bloqueadas) |
| `/virtual` | `VirtualOnboarding` | Inducción de la modalidad 100% virtual |
| `/presencial` | `PresencialOnboarding` | Inducción de la modalidad presencial |
| `*` | `Navigate` | Redirige cualquier ruta desconocida a la ruta válida más cercana |

### 5.3 Modelo de navegación (`src/navigation.ts`)

Centraliza la lógica de rutas y pestañas de forma tipada:

- `AppRoute`: `'home' | 'hub' | 'virtual' | 'presencial'`.
- `HubTab`: pestañas internas del hub (`recorrido360`, `cun360`, `cdigital`, `cronograma`, y tres secciones bloqueadas: `soporteLocked`, `parcheLocked`, `bienestarLocked`).
- Helpers `getRouteFromPathname()` / `getPathForRoute()` para convertir entre la URL del navegador y el tipo de ruta interno.
- La pestaña activa del hub se controla mediante un **query param** (`?tab=...`) leído con `useSearchParams`, de modo que el estado de la pestaña queda reflejado en la URL.

---

## 6. Componentes principales y su lógica

### 6.1 `IntroLoader`
Pantalla de introducción a pantalla completa (overlay `z-9999`) que se muestra al iniciar.

- **Popup de video**: reproduce un video de bienvenida (iframe de Google Drive) con una cuenta regresiva (`INTRO_VIDEO_COUNTDOWN_SECONDS = 95`) que lo cierra automáticamente; también se puede saltar.
- **Comparador con deslizador**: dos imágenes (virtual vs. presencial) superpuestas con un `<input type="range">` a pantalla completa. Cuando el deslizador se lleva a un extremo (≤6% o ≥94%), la intro se cierra (`setVisible(false)`).
- **Animación "idle"**: mientras el usuario no interactúa, el deslizador oscila solo mediante una función seno.
- **Persistencia**: al cerrarse guarda `cun-intro-completed` en `localStorage` y emite un evento global `cun-intro-completed`.

### 6.2 `Header`
Cabecera fija (sticky) con:
- Logo/marca "PÁRCHATE CUN" (clic → vuelve a `home`).
- Una "píldora" central que indica el modo actual (Virtual / Hub / Presencial) con íconos animados.
- Botón "Inicio" para volver a la ruta principal (visible fuera de `home`).

### 6.3 `UnifiedOnboardingHub` (ruta `/`)
Es el corazón de la aplicación. Presenta un contenedor con **pestañas tipo carpeta**. Estado y lógica clave:

- **Pestaña activa** vía `?tab=` en la URL (`useSearchParams`). Por defecto `recorrido360`.
- **Recorrido 360 (`recorrido360`)**: monta el componente `VirtualTour360` con los nodos definidos en `tour360Nodes`.
- **Rutas de estaciones (`cun360` y `cdigital`)**: dos "tableros" con **9 estaciones** cada uno, posicionadas sobre un mapa SVG mediante coordenadas `coordinateX/coordinateY` (porcentajes).
  - Cada estación tiene un tipo: `video`, `pdf` o `infografia`, y se abre en un **modal**.
  - **Progresión lineal obligatoria**: `handleOpenStation` verifica que la estación anterior esté completada. Si no lo está, muestra una alerta de "estación bloqueada" (`stationLockWarning`) y no permite avanzar.
  - El estado `completedStations` (array de IDs) registra el avance; hay una **barra de progreso** que calcula el porcentaje por pista (`c360*` o `cdig*`).
  - El modal soporta: reproductor de video (iframe de YouTube), lector de PDF simulado con paginación, y grid de infografía.
- **Cronograma (`cronograma`)**: calendario mensual (Junio 2026) construido con `Array.from({ length: 30 })`. Al seleccionar un día se muestran las actividades de `calendarActivities`, clasificadas por tipo (`academic`, `wellness`, `tech`) con estilos de color por categoría.
- **Secciones bloqueadas** (`soporteLocked`, `parcheLocked`, `bienestarLocked`): pantallas de "próximamente" que se activarán en el semestre.
- **Animaciones**: `AnimatePresence` de `motion` para transicionar entre pestañas y modales.
- **Ícono animado**: `AnimatedEarthIcon` usa `lottie-web` para reproducir `assets/iconos/Earth.json`.

### 6.4 `VirtualTour360`
Encapsula el visor de Photo Sphere Viewer. Lógica principal:

- En un `useEffect` crea la instancia `new Viewer({...})` sobre un `containerRef`, con navbar (`zoom`, `move`, `fullscreen`, `gallery`, `autorotate`, `markers`) y los plugins configurados:
  - **VirtualTourPlugin** en `positionMode: 'gps'` y `renderMode: '3d'`, recibiendo los `nodes` y el `startNodeId`. Usa transiciones con efecto `fade`.
  - **AutorotatePlugin** con puntos clave (keypoints) predefinidos.
  - **GalleryPlugin**, **MarkersPlugin**.
- **Flechas de navegación personalizadas**: `createTourArrowElement` genera un `<button>` HTML con clases CSS propias (`tour-hotspot`) para cada enlace, con dirección (`forward`/`back`) y variante de estilo (`floor-arrow` / `three-d-arrow`).
- **Marcadores multimedia**: al seleccionar un marcador (`select-marker`), según su `data.action` abre:
  - un **modal de video** (`open-video-modal`) con iframe, o
  - un **popup de imagen** (`open-image-popup`).
- Escucha el evento `node-changed` para actualizar el título del nodo actual y sincronizar el estado (`currentNodeId`).
- Limpieza: en el `return` del `useEffect` destruye el visor y remueve listeners para evitar fugas de memoria.

### 6.5 `VirtualOnboarding` (ruta `/virtual`)
Inducción de la modalidad virtual, organizada en tres pestañas "carpeta":
1. **Sedes & Alumnos**: selector de sedes (`sedesVirtuales`) + mapa de conexiones (`WorldConnectionsMap`).
2. **Ecosistema Digital**: sub-pestañas interactivas — Revistas (flipbook con paginación), Fichas (tarjetas con flip 3D vía CSS `[transform:rotateY(180deg)]`), FunCUN (mascota animada con control de velocidad) y Glosario (visor con zoom).
3. **Cronograma Académico**: usa el componente `ActivityCalendar`.

### 6.6 `PresencialOnboarding` (ruta `/presencial`)
Inducción presencial con tres vistas:
1. **Recorrido 360**: incrusta `Campus360Tour`.
2. **Calendario Power BI**: incrusta `PowerBIEmbed`.
3. **Cronograma de Actividades**: calendario mensual interactivo con datos de `cronogramaEvents` (Junio/Julio 2026), con detalle del evento por día seleccionado.
- Incluye un efecto lúdico: al hacer clic en el fondo se lanzan "estrellas" animadas (`handleSparkleClick`).

### 6.7 `Campus360Tour`
Recorrido 360 alternativo que incrusta un tour externo de **Panoee** vía `<iframe>`, acompañado de un explorador de "hotspots" del campus (`campusHotspots` de `data.ts`) con foto, descripción y servicios.

### 6.8 `PowerBIEmbed`
Incrusta un reporte de **Power BI** mediante `<iframe>`, con la URL tomada de `onboardingConfig.powerBiEmbedUrl` (`src/data.ts`). Incluye un botón de "recargar" que reasigna el `src` del iframe.

### 6.9 Otros componentes de apoyo
- `ShortsTutorials` — tutoriales cortos en video.
- `ActivityCalendar` — calendario reutilizable de actividades.
- `WorldConnectionsMap` — mapa animado de conexiones/sedes.
- `MonthlySmartAlerts` — alertas mensuales (actualmente comentado en `App.tsx`).
- `LineArtDecorations`, `LineartBackgrounds` — decoraciones SVG "line-art" de fondo.
- `HomeOnboarding`, `UserPlatformPreview` — componentes de pantallas/vistas complementarias.

---

## 7. Modelo de datos

El aplicativo funciona con **datos estáticos (mock)** definidos en TypeScript; no consume una API en tiempo de ejecución.

### 7.1 `src/types.ts`
Interfaces de dominio: `OnboardingConfig`, `TutorialShort`, `PlatformFeature`, `CalendarEvent`, `CampusHotspot`, etc.

### 7.2 `src/data.ts`
Contiene la configuración global (`onboardingConfig`, con la URL de Power BI y datos de la institución) y colecciones mock: `homeToolShorts`, `virtualTutorials`, `presencialTutorials`, `platformFeatures`, `calendarEvents`, `campusHotspots`, `virtualMaterials`.

### 7.3 `src/data/tour360Nodes.ts`
Define las **escenas (nodos)** del recorrido 360. Cada `Tour360Node` incluye:
- `id`, `panorama` (imagen equirectangular importada como asset), `thumbnail`, `name`, `caption`, `description`.
- `gps` (coordenadas usadas por el plugin en modo GPS).
- `links[]`: enlaces a otros nodos con metadatos de la flecha (etiqueta, texto visible, rotación, escala, dirección, variante de estilo).
- `markers[]`: marcadores opcionales (imágenes de guías/personajes, videos).

El recorrido definido conecta: `CalleA → Entrada_A → EntradaLobbySA → DescansoSA → BibliotecaSA` (más un nodo `SphereTest` de pruebas). El nodo inicial es `TOUR360_START_NODE_ID = 'CalleA'`.

### 7.4 `src/data/tour360MediaHotspots.ts`
Marcadores multimedia (p. ej. videos) asociados a nodos concretos del tour (`tour360MediaMarkersByNode`).

---

## 8. Estilos y experiencia visual

- **Tailwind CSS v4** con tema personalizado (colores/fuentes de marca) en `index.css`.
- Estética **"cyber/neón"** sobre fondo verde oscuro: bordes brillantes, animaciones `neonGlow`, patrones de rejilla line-art y curvas punteadas que representan "rutas de aprendizaje".
- **Animaciones** con `motion/react` para transiciones entre pestañas, apertura de modales y microinteracciones.
- Estilos específicos del tour 360 en `src/styles/tour360.css` y `src/styles/tour360-hotspots.css` (flechas de navegación, modal de video, tooltips).

---

## 9. Resumen del flujo de usuario

1. **Entrada** → aparece `IntroLoader` con video de bienvenida; el usuario lo salta o espera la cuenta regresiva.
2. **Deslizador** → mueve el control a un extremo para entrar; la intro se marca como completada en `localStorage`.
3. **Hub principal (`/`)** → navega por pestañas:
   - Explora el **recorrido 360** interactivo.
   - Completa las **estaciones** de Campus 360 y CDigital en orden (progresión lineal con bloqueos).
   - Consulta el **cronograma** de actividades.
4. **Modalidades** → desde el header o rutas puede ir a la inducción **virtual** (`/virtual`) o **presencial** (`/presencial`), cada una con sus propias herramientas (mapas, flipbooks, fichas, Power BI, tours externos).

---

## 10. Notas y consideraciones

- La app es **frontend puro** en su comportamiento actual: todos los contenidos (videos, PDFs, infografías, calendarios) provienen de datos mock o de iframes externos (YouTube, Google Drive, Power BI, Panoee).
- La capacidad de **Gemini** está declarada pero no se usa activamente en la UI; es un punto de extensión para un futuro asistente conversacional ("Cami").
- El estado de avance (`completedStations`) vive solo en memoria del componente; no hay persistencia en backend, por lo que se reinicia al recargar (salvo el flag de la intro, que sí usa `localStorage`).
- Varios componentes/bloques (p. ej. `MonthlySmartAlerts`, el badge de ayuda del header, el nodo `SphereTest`) están **comentados o en modo prueba** en el código.
