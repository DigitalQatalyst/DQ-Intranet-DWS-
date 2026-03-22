/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_AI_CHAT_ENDPOINT?: string;
  readonly VITE_ENABLE_LIVE_AI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
