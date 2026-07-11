interface ImportMetaEnv {
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FUNCTIONS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
