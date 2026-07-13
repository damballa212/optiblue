interface ImportMetaEnv {
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_VAPID_KEY?: string;
  readonly VITE_FUNCTIONS_BASE_URL?: string;
  readonly VITE_SEDES_FUNCTIONS_BASE_URL?: string;
  readonly VITE_PEDIDOS_FUNCTIONS_BASE_URL?: string;
  readonly VITE_CITAS_FUNCTIONS_BASE_URL?: string;
  readonly VITE_COTIZACIONES_FUNCTIONS_BASE_URL?: string;
  readonly VITE_NOTIFICACIONES_FUNCTIONS_BASE_URL?: string;
  // Storefront público y panel admin son dos builds/orígenes distintos
  // (ver vite.config.ts) — estas variables solo cambian el head estático
  // por target, vía interpolación nativa de Vite en index.html.
  readonly VITE_APP_TARGET?: "storefront" | "panel";
  readonly VITE_APPLE_TOUCH_ICON?: string;
  readonly VITE_APP_ROBOTS?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_MOBILE_TITLE?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_STOREFRONT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "#app-target" {
  import type { ComponentType } from "react";
  const App: ComponentType;
  export default App;
}
