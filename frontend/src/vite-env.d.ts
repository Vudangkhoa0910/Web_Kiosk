/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_MQTT_HOST: string
  readonly VITE_MQTT_PORT: string
  readonly VITE_MQTT_USERNAME: string
  readonly VITE_MQTT_PASSWORD: string
  readonly VITE_DISABLE_MQTT: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// CSS Module declarations
declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module 'leaflet/dist/leaflet.css'
declare module '../../styles/tracking.css'
declare module './index.css'
declare module './styles/leaflet-custom.css'
