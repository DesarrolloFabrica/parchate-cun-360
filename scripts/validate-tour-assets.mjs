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
  'public/panoramas/Sede_A/3SA.png',
  'public/panoramas/Sede_A/5SA.png',
  'public/panoramas/Sede_A/6SA.png',
  'public/panoramas/Sede_A/LobbySA.png',
  'public/panoramas/Sede_Test.png',
  'public/assets/calle-a-cjtfh270.png',
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
