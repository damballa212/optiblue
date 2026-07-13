import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const assetsDirectory = resolve("dist-panel/assets");
const adminChunks = (await readdir(assetsDirectory)).filter((file) =>
  /^AdminRoutes-[\w-]+\.js$/.test(file),
);

if (adminChunks.length !== 1) {
  throw new Error(
    `Se esperaba un chunk AdminRoutes compilado y se encontraron ${adminChunks.length}.`,
  );
}

const dom = new JSDOM('<div id="root"></div>', {
  url: "http://localhost/admin/login",
});

for (const key of [
  "window",
  "document",
  "navigator",
  "location",
  "localStorage",
  "HTMLElement",
  "MutationObserver",
  "CustomEvent",
  "Event",
  "Node",
]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key],
    configurable: true,
  });
}

globalThis.self = globalThis.window;
globalThis.fetch = async () => new Response("", { status: 200 });
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;

await import(pathToFileURL(resolve(assetsDirectory, adminChunks[0])).href);
console.log(`Smoke panel correcto: ${adminChunks[0]}`);
