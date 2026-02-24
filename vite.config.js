import { resolve } from 'path'

export default {
    base: '/XFreitas/',
    root: resolve(__dirname, 'src'),
    build: {
        outDir: '../dist'
    },
    publicDir: '../public',
    // Optional: Silence Sass deprecation warnings. See note below.
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'import',
                    'mixed-decls',
                    'color-functions',
                    'global-builtin',
                ],
            },
        },
    },
}