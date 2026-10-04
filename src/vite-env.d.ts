/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import type { i18n as I18nInstance } from 'i18next'

declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly BASE_URL: string
    readonly PROD: boolean
    readonly DEV: boolean
    readonly MODE: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface AppReadiness {
    i18n: I18nInstance
    ready: Promise<void>
  }

  interface Window {
    i18n: I18nInstance
    appReady: AppReadiness
  }
}

export {}