// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
	{
		input: pkg.src,

		output: [
      // commonjs build
			{ file: pkg.main,  name: 'anylogger', format: 'cjs', strict: false, exports: 'default' },

      // browser-friendly build
			{ file: pkg.iife,  name: 'anylogger', format: 'iife', strict: false },
		]
	}
];
