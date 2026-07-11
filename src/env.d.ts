interface ImportMetaEnv {
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FUNCTIONS_BASE_URL?: string;
  readonly VITE_SEDES_FUNCTIONS_BASE_URL?: string;
  readonly VITE_PEDIDOS_FUNCTIONS_BASE_URL?: string;
  readonly VITE_CITAS_FUNCTIONS_BASE_URL?: string;
  readonly VITE_COTIZACIONES_FUNCTIONS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
