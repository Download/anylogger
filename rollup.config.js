// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
	{
		input: pkg.main,
		output: [
      // browser-friendly UMD build
      { file: 'anylogger.umd.js',  format: 'umd' },
		]
	}
];
