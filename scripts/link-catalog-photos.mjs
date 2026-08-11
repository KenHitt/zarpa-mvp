#!/usr/bin/env node
/**
 * Lista fotos en Storage/catalog y genera SQL para vincularlas al catálogo.
 * Uso: node scripts/link-catalog-photos.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env.local');

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error('No se encontró .env.local');
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

const FOLDER_TO_EXPERIENCE = {
  derrepente: 'Río y Catarata Derrepente',
  'de-repente': 'Río y Catarata Derrepente',
  'huayna capac': 'Cueva Hayna Cápac',
  'huayna-capac': 'Cueva Hayna Cápac',
  'hayna-capac': 'Cueva Hayna Cápac',
  honolulu: 'Catarata Honolulu',
  lechuzas: 'Cueva de las Lechuzas',
  'bosque-piedras': 'Bosque de Piedras',
  'bella-durmiente': 'La Bella Durmiente',
  transporte: 'Transporte turístico',
  'city-tour': 'City tour Tingo María',
};

const FOLDER_TO_HOTEL = {
  dconchis: "Hotel Turístico D'Conchis",
  'd-conchis': "Hotel Turístico D'Conchis",
  caruzo: 'Caruzo Hotel',
  'madera-verde': 'Hotel Madera Verde',
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

async function listFolder(db, prefix) {
  const { data, error } = await db.storage.from('catalog').list(prefix, {
    limit: 100,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error) throw error;
  return data ?? [];
}

async function collectImages(db, basePrefix) {
  const images = [];
  const top = await listFolder(db, basePrefix);

  for (const item of top) {
    const path = basePrefix ? `${basePrefix}/${item.name}` : item.name;
    if (item.id === null) {
      // carpeta
      const nested = await listFolder(db, path);
      for (const file of nested) {
        if (!IMAGE_EXT.test(file.name)) continue;
        images.push({ path: `${path}/${file.name}`, folder: item.name, file: file.name });
      }
    } else if (IMAGE_EXT.test(item.name)) {
      images.push({ path, folder: basePrefix.split('/').pop() || basePrefix, file: item.name });
    }
  }
  return images;
}

function publicUrl(baseUrl, path) {
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return `${baseUrl}/storage/v1/object/public/catalog/${encoded}`;
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o claves en .env.local');
    process.exit(1);
  }

  const db = createClient(url, key);
  const [expImages, hotelImages] = await Promise.all([
    collectImages(db, 'experiencias'),
    collectImages(db, 'hoteles'),
  ]);

  if (!expImages.length && !hotelImages.length) {
    console.log('No se encontraron imágenes en catalog/experiencias/ ni catalog/hoteles/');
    console.log('Sube archivos .jpg/.webp dentro de subcarpetas (ej. experiencias/derrepente/foto.jpg)');
    process.exit(0);
  }

  console.log('-- Pegar en Supabase SQL Editor\n');

  for (const img of expImages) {
    const key = img.folder.toLowerCase();
    const name = FOLDER_TO_EXPERIENCE[key];
    const photoUrl = publicUrl(url, img.path);
    if (!name) {
      console.log(`-- ⚠ Carpeta "${img.folder}" sin mapeo. URL: ${photoUrl}`);
      continue;
    }
    console.log(
      `update public.experiences set photos = array['${photoUrl}'] where name = '${escapeSql(name)}';`
    );
  }

  for (const img of hotelImages) {
    const key = img.folder.toLowerCase();
    const name = FOLDER_TO_HOTEL[key];
    const photoUrl = publicUrl(url, img.path);
    if (!name) {
      console.log(`-- ⚠ Carpeta "${img.folder}" sin mapeo. URL: ${photoUrl}`);
      continue;
    }
    console.log(`update public.hotels set photos = array['${photoUrl}'] where name = '${escapeSql(name)}';`);
  }

  console.log('\n-- Verificar');
  console.log("select name, photos from public.experiences where photos <> '{}';");
  console.log("select name, photos from public.hotels where photos <> '{}';");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
