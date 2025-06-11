import { preact } from '@preact/preset-vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['activeTab', 'declarativeContent', 'storage', 'webRequest'],
    host_permissions: [
      'https://open.spotify.com/*',
      'https://*.spotify.com/track-playback/v1/*',
      'https://translate.google.com/*',
      'https://speed.cloudflare.com/*'
    ],
    externally_connectable: {
      ids: ['*'],
      matches: ['https://open.spotify.com/*'],
      accepts_tls_channel_id: false,
    },
    web_accessible_resources: [
      {
        resources: ["destroy-tippy.js"],
        matches: ['https://open.spotify.com/*']
      }
    ]
  },
  modules: ['@wxt-dev/unocss'],
  imports: false,
  webExt: {
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  vite: () => ({
    plugins: [
      preact(),
    ],
  }),
});
