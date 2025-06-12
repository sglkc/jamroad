import { defineConfig, presetIcons, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
  theme: {
    fontFamily: {
      default: '"Radio Canada Variable", sans-serif'
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      warn: true,
      collections: {
        my: () => import('@iconify-json/mynaui').then(i => i.icons)
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})
