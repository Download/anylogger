// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json' assert { type: "json" };

export default [
	{
		input: pkg.main,

		output: [
      // commonjs build
			{ file: pkg.cjs,  name: 'anylogger', format: 'cjs', strict: false, exports: 'default' },

      // browser-friendly build
			{ file: pkg.iife,  name: 'anylogger', format: 'iife', strict: false },
		]
	}
];
