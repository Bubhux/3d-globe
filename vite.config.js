// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from '@remix-run/dev';

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
    assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl', '**/*.svg', '**/*.png', '**/*.jpg'],
    esbuild: {
        treeShaking: true,
    },
    build: {
        assetsInlineLimit: 1024,
        manifest: true,
        outDir: "build/client",
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT' || warning.message.includes('sideEffects')) {
                    return;
                }
                warn(warning);
            },
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return;
                        }
                        return 'vendor';
                    }
                },
            },
        },
        minify: 'terser',
        chunkSizeWarningLimit: 2000,
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, 'app'),
            '~app': resolve(__dirname, 'app'),
        },
    },
    plugins: [
        svgr(),
        mdx({
            rehypePlugins: [[rehypeImgSize, { dir: 'app' }], rehypeSlug, rehypePrism],
            remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
            providerImportSource: '@mdx-js/react',
        }),
        remixCloudflareDevProxy(),
        remix({
            mode: 'static',
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
