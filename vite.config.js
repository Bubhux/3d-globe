// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';

import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import rehypePrism from '@mapbox/rehype-prism';
import glsl from 'vite-plugin-glsl';
import svgr from 'vite-plugin-svgr';


export default defineConfig({
    assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl', '**/*.svg'],
    build: {
        assetsInlineLimit: 1024,
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, 'app'),
            '~app': resolve(__dirname, 'app'),
            '~static': resolve(__dirname, 'static'),
            '~data': resolve(__dirname, 'public/data'),
        },
    },
    plugins: [
        svgr(),
        mdx({
            rehypePlugins: [[rehypeImgSize, { dir: 'app' }], rehypeSlug, rehypePrism],
            remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
            providerImportSource: '@mdx-js/react',
        }),
        remix({
            routes(defineRoutes) {
                return defineRoutes(route => {
                    route('/', 'routes/home/route.js', { index: true });
                });
            },
        }),
        jsconfigPaths(),
        glsl(),
    ],
});
