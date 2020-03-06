import { eslint } from 'rollup-plugin-eslint';
import minify from 'rollup-plugin-babel-minify';
import strip from '@rollup/plugin-strip';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: './src/index.js',
  plugins: [
    eslint(),
    minify(),
    strip(),
    cleanup(),
  ],
  output: {
    name: 'enumerize',
    file: 'index.js',
    format: 'umd',
    exports: 'named',
  },
};
