import path from 'node:path'
import { defineConfig } from 'astro/config'

import astroSvgComnponents from '@foxpro/astro-svg-components'

// https://astro.build/config
export default defineConfig({
  integrations: [astroSvgComnponents()],
  vite: {
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve('.'),
        },
      ],
    },
  },
})
