import fs from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
import type { Plugin } from 'vite'

export type AstroSVGComponentsIntegrationOptions = {
  /**
   * If true, will export as Astro component if `as` isn't specified.
   *
   * Otherwise will export as Astro component only if '?as=component'
   */
  byDefault?: boolean
}

export default function AstroSVGComponents({
  byDefault = false,
}: AstroSVGComponentsIntegrationOptions = {}): AstroIntegration {
  let astroPlugin
  const getPath = (id: string) => {
    let [p, qs] = id.split('?')
    if (p.startsWith('/@fs')) {
      p = p.slice(4)
    }
    return [p, qs] as const
  }
  const shouldProcess = (p: string, qs: string) => {
    if (!p.endsWith('svg')) return false
    const params = new URLSearchParams(qs)
    return (byDefault && !Array.from(params.entries()).length) || params.has('astrosvg')
  }

  const ViteAstroSvgComponents: Plugin = {
    name: 'astro-svg-components',
    enforce: 'pre',
    configResolved(config) {
      astroPlugin = config.plugins.find((p) => p.name === 'astro:build')
    },
    async load(id) {
      const [p, qs] = getPath(id)

      if (!shouldProcess(p, qs)) return
      const source = await fs.readFile(p, { encoding: 'utf8' })
      const svgWithProps = source
        .replace(/([{}])/g, "{'$1'}")
        .replace(/(?<=<svg.*?)(>)/i, '{...Astro.props}>')
      const result = `
        ---
        ---
        ${svgWithProps}
        `
      return result
    },
    transform(code, id, opts) {
      const [p, qs] = getPath(id)
      if (!shouldProcess(p, qs)) return
      return astroPlugin.transform(code, `${id}.astro`, opts)
    },
  }

  return {
    name: 'astro-svg-components',
    hooks: {
      'astro:config:setup'(options) {
        options.updateConfig({
          vite: {
            plugins: [ViteAstroSvgComponents],
          },
        })
      },
    },
  }
}

export const globSVG = (pattern: string) =>
  Object.values(import.meta.glob(pattern, { as: 'astrosvg', eager: true, import: 'default' }))
