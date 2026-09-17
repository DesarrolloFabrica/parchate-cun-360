#!/usr/bin/env node
/**
 * Validación pre-build/deploy del Tour 360.
 * Ejecutar: npm run validate:tour
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];

const REQUIRED_PUBLIC_FILES = [
  'public/panoramas/Sede_A/Calle_A.png',
  'public/panoramas/Sede_A/3SA.jpeg',
  'public/panoramas/Sede_A/5SA.png',
  'public/panoramas/Sede_A/6SA.png',
  'public/panoramas/Sede_A/LobbySA.png',
  'public/panoramas/Sede_A_optimized/Calle_A.jpg',
  'public/panoramas/Sede_A_optimized/3SA.jpg',
  'public/panoramas/Sede_A_optimized/5SA.jpg',
  'public/panoramas/Sede_A_optimized/6SA.jpg',
  'public/panoramas/Sede_A_optimized/LobbySA.jpg',
  'public/panoramas/iconos/MARCO.png',
  'public/panoramas/iconos/AS.png',
  'public/panoramas/iconos/alizon.png',
  'public/panoramas/sede_test.png',
  'public/panoramas/Sede FPH/1-InicioSf.jpg',
  'public/panoramas/Sede FPH/2-LlegadaSf.jpeg',
  'public/panoramas/Sede FPH/3-EntradaSf.jpeg',
  'public/panoramas/Sede FPH/4-entrada-sedeSf.png',
  'public/panoramas/Sede FPH/4-patio.png',
  'public/panoramas/Sede FPH/5-zonaverde.png',
  'public/panoramas/Sede FPH/6-12S.png',
  'public/panoramas/Sede FPH/7-13S.png',
  'public/panoramas/Sede_FPH_optimized/1-InicioSf.jpg',
  'public/panoramas/Sede_FPH_optimized/2-LlegadaSf.jpg',
  'public/panoramas/Sede_FPH_optimized/3-EntradaSf.jpg',
  'public/panoramas/Sede_FPH_optimized/4-entrada-sedeSf.jpg',
  'public/panoramas/Sede_FPH_optimized/4-patio.jpg',
  'public/panoramas/Sede_FPH_optimized/5-zonaverde.jpg',
  'public/panoramas/Sede_FPH_optimized/6-12S.jpg',
  'public/panoramas/Sede_FPH_optimized/7-13S.jpg',
  'public/panoramas/Sincelejo/1.png',
  'public/panoramas/Sincelejo/2.png',
  'public/panoramas/Sincelejo/3.png',
  'public/panoramas/Sincelejo/4.png',
  'public/panoramas/Sincelejo/5.png',
  'public/panoramas/Sincelejo/6.png',
  'public/panoramas/Sincelejo/7.png',
  'public/panoramas/test_optimized/sede_test.jpg',
  'public/panoramas/monteria/1.png',
  'public/panoramas/monteria/2.png',
  'public/panoramas/monteria/3.png',
  'public/panoramas/monteria/4.png',
  'public/panoramas/monteria/5.png',
  'public/panoramas/monteria/6.png',
  'public/panoramas/monteria/7.png',
  'public/panoramas/monteria/8.png',
  'public/panoramas/monteria/9.png',
  'public/panoramas/monteria/10.png',
  'public/panoramas/monteria/11.png',
  'public/panoramas/monteria/12.png',
  'public/panoramas/monteria/13.png',
  'public/panoramas/monteria/14.png',
  'public/panoramas/monteria/15.png',
  'public/panoramas/monteria/16.png',
  'public/panoramas/monteria/17.png',
  'public/panoramas/monteria/18.png',
  'public/panoramas/Santa Marta/1A.png',
  'public/panoramas/Santa Marta/2A.png',
  'public/panoramas/Santa Marta/3A.png',
  'public/panoramas/Santa Marta/4A.png',
  'public/panoramas/Santa Marta/5A.jpg',
  'public/panoramas/Santa Marta/6A.png',
  'public/panoramas/Santa Marta/7A.png',
  'public/panoramas/Santa Marta/8A.png',
  'public/panoramas/Santa Marta/9A.png',
  'public/panoramas/Santa Marta/10A.png',
  'public/panoramas/Santa Marta/11B.png',
  'public/panoramas/Santa Marta/12B.png',
  'public/panoramas/Santa Marta/13B.png',
  'public/panoramas/Neiva/1 FACHADA – ENTRADA.png',
  'public/panoramas/Neiva/2ENTRADA, INGRESO A TELECAMPUS - CANCHAS.png',
  'public/panoramas/Neiva/3.TELECAMPUS – CANCHAS.png',
  'public/panoramas/Neiva/4.png',
  'public/panoramas/Neiva/5.BLOQUE C BIBLIOTECA, SALONES DE CONFECCIONES.png',
  'public/panoramas/Neiva/6.png',
  'public/panoramas/Neiva/7.png',
  'public/panoramas/Neiva/8.BLOQUE D SALA DE SISTEMAS 1-2-3  SALON DE AEROGRAFIA  LABORATORIO DE COMUNICACIÓN Y TELEVISION  SOPORTE TECNICO.png',
  'public/panoramas/Neiva/9AG.png',
  'public/panoramas/Neiva/10D.png',
  'public/panoramas/Neiva/11TV.png',
  'public/panoramas/Neiva/12A.png',
  'public/panoramas/Neiva/12B.png',
  'public/panoramas/Neiva/14 BLOQUE A.png',
  'public/panoramas/Neiva/15A.png',
  'public/panoramas/Neiva/15B.png',
];

function walkFiles(dir, extensions, results = []) {
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walkFiles(fullPath, extensions, results);
      continue;
    }

    if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

function validatePublicAssets() {
  for (const relativePath of REQUIRED_PUBLIC_FILES) {
    const absolutePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`Falta asset público requerido: ${relativePath}`);
    }

  }
}

function validateSourcePatterns() {
  const sourceFiles = [
    ...walkFiles(path.join(rootDir, 'src'), ['.ts', '.tsx']),
  ];

  const emptyImportPattern = /from\s+['"]\s*['"]/;
  const windowsAbsPattern = /[A-Za-z]:\\/;
  const unixUserAbsPattern = /\/Users\/|\/home\/[^/]+\//;
  const hardcodedPublicAssetPattern = /['"]\/assets\/[^'"]+['"]/;

  for (const filePath of sourceFiles) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');

    if (emptyImportPattern.test(content)) {
      errors.push(`Import vacío detectado en ${relativePath}`);
    }

    if (windowsAbsPattern.test(content) || unixUserAbsPattern.test(content)) {
      errors.push(`Ruta absoluta del sistema detectada en ${relativePath}`);
    }

    if (
      hardcodedPublicAssetPattern.test(content) &&
      !relativePath.includes('validate-tour-assets')
    ) {
      warnings.push(
        `Ruta /assets/ hardcodeada (usar import.meta.env.BASE_URL) en ${relativePath}`,
      );
    }
  }
}

function validateMapSelectorIndependence() {
  const mapSelectorPath = path.join(rootDir, 'src/components/TourMapSelector.tsx');
  const content = fs.readFileSync(mapSelectorPath, 'utf8');

  if (/import\.meta\.glob/.test(content)) {
    errors.push('TourMapSelector no debe usar import.meta.glob (dependencia local frágil).');
  }

  if (/from\s+['"].*assets\/imagenes/.test(content)) {
    errors.push('TourMapSelector no debe importar imágenes desde src/assets.');
  }
}

function validateTourDataImports() {
  const tourDir = path.join(rootDir, 'src/data/tour360');
  if (!fs.existsSync(tourDir)) {
    errors.push('No existe src/data/tour360');
    return;
  }

  const tourFiles = walkFiles(tourDir, ['.ts']);
  for (const filePath of tourFiles) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');

    if (/import\s+\w+\s+from\s+['"][^'"]+\.(png|jpg|jpeg|webp)['"]/.test(content)) {
      errors.push(
        `Import estático de imagen en ${relativePath}. Usar panoramaUrls.ts o public/.`,
      );
    }
  }
}

validatePublicAssets();
validateSourcePatterns();
validateMapSelectorIndependence();
validateTourDataImports();

console.log('--- Validación Tour 360 (build/deploy) ---');

if (warnings.length > 0) {
  console.warn('\nAdvertencias:');
  for (const warning of warnings) {
    console.warn(`  ⚠ ${warning}`);
  }
}

if (errors.length > 0) {
  console.error('\nErrores:');
  for (const error of errors) {
    console.error(`  ✗ ${error}`);
  }
  process.exit(1);
}

console.log('\n✓ Validación completada sin errores.');
if (warnings.length > 0) {
  console.log(`  (${warnings.length} advertencia(s) — revisar antes de deploy)`);
}
