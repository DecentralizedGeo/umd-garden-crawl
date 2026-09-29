/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUBMISSIONS_MAP_URL?: string;
  readonly PUBLIC_GARDEN_REFERENCE_MAP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
