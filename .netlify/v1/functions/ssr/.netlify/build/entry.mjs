import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_hr2aYd00.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/invite.astro.mjs');
const _page2 = () => import('./pages/admin/user/_id_.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/admin/grant-access.astro.mjs');
const _page5 = () => import('./pages/api/admin/invite.astro.mjs');
const _page6 = () => import('./pages/api/admin/revoke-access.astro.mjs');
const _page7 = () => import('./pages/api/admin/users.astro.mjs');
const _page8 = () => import('./pages/api/auth/callback.astro.mjs');
const _page9 = () => import('./pages/api/auth/signin.astro.mjs');
const _page10 = () => import('./pages/api/auth/signout.astro.mjs');
const _page11 = () => import('./pages/api/content/_documentid_.astro.mjs');
const _page12 = () => import('./pages/auth/check-email.astro.mjs');
const _page13 = () => import('./pages/auth/error.astro.mjs');
const _page14 = () => import('./pages/markdown-page.astro.mjs');
const _page15 = () => import('./pages/posts/_slug_.astro.mjs');
const _page16 = () => import('./pages/posts.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/invite.astro", _page1],
    ["src/pages/admin/user/[id].astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/admin/grant-access.ts", _page4],
    ["src/pages/api/admin/invite.ts", _page5],
    ["src/pages/api/admin/revoke-access.ts", _page6],
    ["src/pages/api/admin/users.ts", _page7],
    ["src/pages/api/auth/callback.ts", _page8],
    ["src/pages/api/auth/signin.ts", _page9],
    ["src/pages/api/auth/signout.ts", _page10],
    ["src/pages/api/content/[documentId].ts", _page11],
    ["src/pages/auth/check-email.astro", _page12],
    ["src/pages/auth/error.astro", _page13],
    ["src/pages/markdown-page.md", _page14],
    ["src/pages/posts/[slug].astro", _page15],
    ["src/pages/posts/index.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "66afad57-24c7-46b6-a05f-017d93343e48"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
