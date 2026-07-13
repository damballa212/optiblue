// Genera el set completo de íconos PWA en public/ a partir de assets-src/brand/.
// Uso: npm run icons:generate
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const masterSvg = join(root, "assets-src/brand/icon-master.svg");
const panelMasterSvg = join(root, "assets-src/brand/icon-master-panel.svg");
const faviconSvg = join(root, "assets-src/brand/favicon.svg");
const publicDir = join(root, "public");

// Cada maestro ya es full-bleed con la marca dentro de la zona segura maskable,
// así que "any" y "maskable" comparten arte; se emiten ambos porque el manifest
// los declara por separado y podrían divergir en el futuro.
// El panel admin usa la variante de fondo navy (icon-master-panel.svg) para
// que su ícono se distinga del storefront en el Dock/taskbar: son dos PWA
// instalables en orígenes separados (ver vite.config.ts).
const targets = [
  { source: masterSvg, size: 512, name: "pwa-512.png" },
  { source: masterSvg, size: 192, name: "pwa-192.png" },
  { source: masterSvg, size: 512, name: "pwa-maskable-512.png" },
  { source: masterSvg, size: 192, name: "pwa-maskable-192.png" },
  { source: masterSvg, size: 180, name: "apple-touch-icon.png" },
  { source: panelMasterSvg, size: 512, name: "panel-512.png" },
  { source: panelMasterSvg, size: 192, name: "panel-192.png" },
  { source: panelMasterSvg, size: 512, name: "panel-maskable-512.png" },
  { source: panelMasterSvg, size: 192, name: "panel-maskable-192.png" },
  { source: panelMasterSvg, size: 180, name: "panel-apple-touch-icon.png" },
];

const FAVICON_ICO_SIZES = [16, 32, 48];

async function renderPng(source, size) {
  return sharp(source, { density: 300 }).resize(size, size).png().toBuffer();
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  for (const { source, size, name } of targets) {
    await writeFile(join(publicDir, name), await renderPng(source, size));
    console.log(`✓ public/${name} (${size}x${size})`);
  }

  const icoPngs = await Promise.all(
    FAVICON_ICO_SIZES.map((size) => renderPng(faviconSvg, size)),
  );
  await writeFile(join(publicDir, "favicon.ico"), await pngToIco(icoPngs));
  console.log(`✓ public/favicon.ico (${FAVICON_ICO_SIZES.join(", ")})`);

  await copyFile(faviconSvg, join(publicDir, "favicon.svg"));
  console.log("✓ public/favicon.svg");
}

main().catch((error) => {
  console.error("Error generando íconos:", error);
  process.exitCode = 1;
});
