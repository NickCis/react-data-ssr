import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import filesize from 'rollup-plugin-filesize';
import sourceMaps from 'rollup-plugin-sourcemaps';

const shared = {
  input: 'src/index.js',
  external: ['react', 'prop-types'],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  exports: 'named',
};

export default [
  Object.assign({}, shared, {
    output: {
      name: 'ReactDataSSR',
      file:
        process.env.NODE_ENV === 'production'
          ? './dist/react-data-ssr.umd.min.js'
          : './dist/react-data-ssr.umd.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      replace({
        exclude: 'node_modules/**',
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
      resolve(),
      commonjs({
        include: /node_modules/,
      }),
      sourceMaps(),
      process.env.NODE_ENV === 'production' && filesize(),
      process.env.NODE_ENV === 'production' && uglify(),
    ],
  }),

  Object.assign({}, shared, {
    output: [
      {
        file: 'dist/react-data-ssr.es6.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/react-data-ssr.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs({
        include: /node_modules/,
      }),
      sourceMaps(),
    ],
  }),
];
