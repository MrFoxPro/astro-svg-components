import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'

/** @type {import('rollup').RollupOptions} */
const config = {
  input: './package/index.ts',
  treeshake: 'smallest',
  output: [
    {
      format: 'es',
      dir: 'dist/es',
      entryFileNames: '[name].mjs',
    },
    {
      format: 'cjs',
      dir: 'dist/cjs',
      entryFileNames: '[name].cjs',
    },
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    babel({
      extensions: ['.ts'],
      babelHelpers: 'bundled',
      presets: ['@babel/preset-typescript'],
      exclude: /node_modules\//,
    }),
  ],
}
export default config
