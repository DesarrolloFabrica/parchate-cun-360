<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c032d388-351f-4fc1-b38b-d8cd0d4740d9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Verificar Tour 360 antes de desplegar

1. Genera el build:
   `npm run build`
2. Prueba el build local:
   `npm run preview`
3. Abre la ruta del Tour 360 y revisa DevTools:
   - Console: no debe haber errores `404`, `CORS`, `MIME`, `Failed to fetch`, `Unexpected token <` o `panorama-error`.
   - Network: las imagenes 360 deben responder `200` y `content-type` de imagen (`image/png`, `image/jpeg` o `image/webp`).
   - Al abrir directamente la URL de cada panorama debe verse la imagen, no `index.html`.

Para Google Cloud/Firebase/Cloud Run, sube siempre toda la carpeta `dist`, incluyendo `dist/assets`. Si `npm run preview` funciona pero Google Cloud no, el problema suele estar en el hosting: assets no subidos, fallback que devuelve HTML para imagenes, MIME incorrecto o una ruta base distinta a `/`.
