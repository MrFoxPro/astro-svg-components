Import SVG files as astro components

Install:
`pnpm i -D @foxpro/astro-svg-components`

Config:

```js
import astroSvgComnponents from '@foxpro/astro-svg-components'
export default defineConfig({
  integrations: [astroSvgComnponents()],
  // optional! alias
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
```

Astro file:

```jsx
---
import CircleIcon from '@/svgs/circle.svg?component-astro'
const icons = import.meta.glob('@/svgs/*.svg', { as: 'component-astro', eager: true })

import { globSVG } from '@foxpro/astro-svg-components'
const icons = globSVG('@/svgs/*.svg')
---
// Props are passed to <svg> element
<CircleIcon class="icon">
{icons.map((Icon) => <Icon class="icon" />)}
```

tsconfig:

```json
{
  "compilerOptions": {
    "types": ["@foxpro/astro-svg-components/types"]
  }
}
```
