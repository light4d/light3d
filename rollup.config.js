import pkg from './package.json';

import resolve from 'rollup-plugin-node-resolve';

module.exports = {
    input: 'src/index.js',
    output:[
        {
            format: 'iife',
            name: 'light3d',
            file: pkg.main
        },
        {
            format: 'iife',
            name: 'light3d',
            file:"../../lightbook/light3d.jsdoc/light3d.js"
        }],
    plugins: [ resolve() ]
};
