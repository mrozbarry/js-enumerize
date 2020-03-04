import { eslint } from 'rollup-plugin-eslint';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: './index.js',
  plugins: [
    eslint(),
    minify(),
  ],
  output: {
    name: 'enumerize',
    file: 'index.es5.js',
    format: 'umd',
    exports: 'named',
  },
};
