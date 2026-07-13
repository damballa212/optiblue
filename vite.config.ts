/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { VitePWA, type ManifestOptions } from "vite-plugin-pwa";

// Storefront público y panel admin son dos PWA en DOS ORÍGENES distintos
// (dos Firebase Hosting sites, mismo código fuente) — no un solo origen con
// manifest intercambiado por JS. Esa alternativa (probada primero) no
// funciona en Safari/iOS: Safari relee el HTML estático original al
// "Añadir a pantalla de inicio", ignorando el <link rel="manifest">
// modificado en el DOM. Google documenta este patrón (dos orígenes, cada
// uno con su manifest/SW estático) como la forma correcta de tener más de
// una PWA instalable en el mismo dominio. Ver decisión 2026-07-12 en
// Obsidian.
const target = process.env.VITE_APP_TARGET === "panel" ? "panel" : "storefront";

const storefrontManifest: Partial<ManifestOptions> = {
  id: "/",
  name: "OptiBlue — Óptica y oftalmología",
  short_name: "OptiBlue",
  description: "Catálogo, lentes adaptados, servicios visuales y sedes de OptiBlue en Venezuela.",
  start_url: "/",
  scope: "/",
  theme_color: "#0b2f6b",
  background_color: "#ffffff",
  icons: [
    { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/pwa-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
  shortcuts: [
    { name: "Catálogo", url: "/catalogo" },
    { name: "Cotizar lentes", url: "/lentes" },
  ],
};

const panelManifest: Partial<ManifestOptions> = {
  id: "/admin",
  name: "OptiBlue Panel",
  short_name: "Panel",
  description: "Bandeja de trabajo operativa de OptiBlue: pedidos, citas, cotizaciones, catálogo y sedes.",
  start_url: "/admin/hoy",
  scope: "/",
  theme_color: "#0b2f6b",
  background_color: "#002d63",
  icons: [
    { src: "/panel-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/panel-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/panel-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/panel-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

export default defineConfig({
  resolve: {
    alias: {
      "#app-target": fileURLToPath(
        new URL(target === "panel" ? "./src/apps/PanelApp.tsx" : "./src/apps/StorefrontApp.tsx", import.meta.url),
      ),
    },
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      // Dos entry points reales (no un solo sw.ts con un `if` en runtime):
      // un `if` no basta porque importar el SDK de Firebase Messaging tiene
      // efectos secundarios en el módulo con solo importarlo (registra sus
      // propios listeners de push), así que el storefront directamente
      // nunca debe incluir ese import en su bundle.
      filename: target === "panel" ? "sw.panel.ts" : "sw.storefront.ts",
      registerType: "prompt",
      injectRegister: false,
      devOptions: {
        enabled: false,
      },
      injectManifest: {
        // Las Cloud Functions (*.run.app) y Firestore (WebChannel) nunca deben
        // entrar al precache: son datos vivos, no shell estático.
        globPatterns: ["**/*.{js,css,html,woff2,png,svg,ico}"],
      },
      manifest: {
        lang: "es-VE",
        display: "standalone",
        ...(target === "panel" ? panelManifest : storefrontManifest),
      },
    }),
  ],
  test: {
    // Tests con @vitest-environment jsdom necesitan un origen no-opaco para
    // que window.localStorage exista (jsdom lo bloquea por defecto en about:blank).
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Firebase no se fuerza a un vendor group. Al dividirlo por tamaño,
          // Rolldown produjo imports estáticos cíclicos entre @firebase/app y
          // @firebase/logger: el build terminaba verde, pero el panel fallaba
          // antes de montar React con "is not a constructor".
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
});
