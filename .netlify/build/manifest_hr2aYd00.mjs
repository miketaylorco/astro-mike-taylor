import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import 'piccolore';
import { o as NOOP_MIDDLEWARE_HEADER, p as decodeKey } from './chunks/astro/server_YtkIaNi7.mjs';
import 'clsx';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/","cacheDir":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/node_modules/.astro/","outDir":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/dist/","srcDir":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/src/","publicDir":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/public/","buildClientDir":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/dist/","buildServerDir":"file:///Users/miketaylor/My%20Websites/astro-mike-taylor/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"auth/check-email/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/auth/check-email","isIndex":false,"type":"page","pattern":"^\\/auth\\/check-email\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"check-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/check-email.astro","pathname":"/auth/check-email","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"auth/error/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/auth/error","isIndex":false,"type":"page","pattern":"^\\/auth\\/error\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"error","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/error.astro","pathname":"/auth/error","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"markdown-page/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/markdown-page","isIndex":false,"type":"page","pattern":"^\\/markdown-page\\/?$","segments":[[{"content":"markdown-page","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/markdown-page.md","pathname":"/markdown-page","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.CQQ0XDMq.css"}],"routeData":{"route":"/admin/invite","isIndex":false,"type":"page","pattern":"^\\/admin\\/invite\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/invite.astro","pathname":"/admin/invite","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.CQQ0XDMq.css"}],"routeData":{"route":"/admin/user/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/user\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"user","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/user/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.CQQ0XDMq.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/grant-access","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/grant-access\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"grant-access","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/grant-access.ts","pathname":"/api/admin/grant-access","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/invite","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/invite\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/invite.ts","pathname":"/api/admin/invite","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/revoke-access","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/revoke-access\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"revoke-access","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/revoke-access.ts","pathname":"/api/admin/revoke-access","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/users","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/users\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/users.ts","pathname":"/api/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/callback","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/callback\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/callback.ts","pathname":"/api/auth/callback","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signin","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signin\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signin.ts","pathname":"/api/auth/signin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signout.ts","pathname":"/api/auth/signout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/content/[documentid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/content\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"documentId","dynamic":true,"spread":false}]],"params":["documentId"],"component":"src/pages/api/content/[documentId].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.CQQ0XDMq.css"}],"routeData":{"route":"/posts/[slug]","isIndex":false,"type":"page","pattern":"^\\/posts\\/([^/]+?)\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/posts/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.CQQ0XDMq.css"}],"routeData":{"route":"/posts","isIndex":true,"type":"page","pattern":"^\\/posts\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/posts/index.astro","pathname":"/posts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/invite.astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/user/[id].astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/auth/check-email.astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/auth/error.astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/markdown-page.md",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/posts/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/posts/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/admin/invite@_@astro":"pages/admin/invite.astro.mjs","\u0000@astro-page:src/pages/admin/user/[id]@_@astro":"pages/admin/user/_id_.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin/grant-access@_@ts":"pages/api/admin/grant-access.astro.mjs","\u0000@astro-page:src/pages/api/admin/invite@_@ts":"pages/api/admin/invite.astro.mjs","\u0000@astro-page:src/pages/api/admin/revoke-access@_@ts":"pages/api/admin/revoke-access.astro.mjs","\u0000@astro-page:src/pages/api/admin/users@_@ts":"pages/api/admin/users.astro.mjs","\u0000@astro-page:src/pages/api/auth/callback@_@ts":"pages/api/auth/callback.astro.mjs","\u0000@astro-page:src/pages/api/auth/signin@_@ts":"pages/api/auth/signin.astro.mjs","\u0000@astro-page:src/pages/api/auth/signout@_@ts":"pages/api/auth/signout.astro.mjs","\u0000@astro-page:src/pages/api/content/[documentId]@_@ts":"pages/api/content/_documentid_.astro.mjs","\u0000@astro-page:src/pages/auth/check-email@_@astro":"pages/auth/check-email.astro.mjs","\u0000@astro-page:src/pages/auth/error@_@astro":"pages/auth/error.astro.mjs","\u0000@astro-page:src/pages/markdown-page@_@md":"pages/markdown-page.astro.mjs","\u0000@astro-page:src/pages/posts/[slug]@_@astro":"pages/posts/_slug_.astro.mjs","\u0000@astro-page:src/pages/posts/index@_@astro":"pages/posts.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_hr2aYd00.mjs","/Users/miketaylor/My Websites/astro-mike-taylor/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/user/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.PCE1UBlg.js","/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/invite.astro?astro&type=script&index=0&lang.ts":"_astro/invite.astro_astro_type_script_index_0_lang.irMMvS1C.js","/Users/miketaylor/My Websites/astro-mike-taylor/src/components/Button.astro?astro&type=script&index=0&lang.ts":"_astro/Button.astro_astro_type_script_index_0_lang.1VWk6V9Z.js","/Users/miketaylor/My Websites/astro-mike-taylor/src/components/ProtectedContent.astro?astro&type=script&index=0&lang.ts":"_astro/ProtectedContent.astro_astro_type_script_index_0_lang._8Y2UePD.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/user/[id].astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".access-toggle\").forEach(c=>{c.addEventListener(\"click\",async n=>{const e=n.target,o=e.dataset.userId,r=e.dataset.articleId,s=e.dataset.hasAccess===\"true\";e.disabled=!0,e.textContent=\"Loading...\";try{const a=await fetch(s?\"/api/admin/revoke-access\":\"/api/admin/grant-access\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({userId:o,sanityDocumentId:r})});if(a.ok){const t=!s;e.dataset.hasAccess=t.toString(),e.textContent=t?\"Revoke Access\":\"Grant Access\",e.style.backgroundColor=t?\"rgb(220 38 38)\":\"rgb(22 163 74)\"}else{const t=await a.json();alert(t.error||\"Operation failed\"),e.textContent=s?\"Revoke Access\":\"Grant Access\"}}catch{alert(\"An error occurred\"),e.textContent=s?\"Revoke Access\":\"Grant Access\"}finally{e.disabled=!1}})});"],["/Users/miketaylor/My Websites/astro-mike-taylor/src/pages/admin/invite.astro?astro&type=script&index=0&lang.ts","const i=document.getElementById(\"invite-form\"),e=document.getElementById(\"message\"),c=document.getElementById(\"invite-link-container\"),s=document.getElementById(\"invite-link\"),t=document.getElementById(\"copy-link\");i?.addEventListener(\"submit\",async d=>{d.preventDefault();const n=i.querySelector('button[type=\"submit\"]');n.disabled=!0,n.textContent=\"Sending...\",e.classList.add(\"hidden\"),c.classList.add(\"hidden\");try{const a=new FormData(i),r=await fetch(\"/api/admin/invite\",{method:\"POST\",body:a}),o=await r.json();r.ok?(e.textContent=\"Invite sent successfully!\",e.className=\"mt-6 p-4 rounded-lg bg-green-50 text-green-700\",e.classList.remove(\"hidden\"),o.inviteLink&&(s.value=o.inviteLink,c.classList.remove(\"hidden\")),i.reset()):(e.textContent=o.error||\"Failed to send invite\",e.className=\"mt-6 p-4 rounded-lg bg-red-50 text-red-700\",e.classList.remove(\"hidden\"))}catch{e.textContent=\"An error occurred. Please try again.\",e.className=\"mt-6 p-4 rounded-lg bg-red-50 text-red-700\",e.classList.remove(\"hidden\")}finally{n.disabled=!1,n.textContent=\"Send Invite\"}});t?.addEventListener(\"click\",async()=>{try{await navigator.clipboard.writeText(s.value),t.textContent=\"Copied!\",setTimeout(()=>{t.textContent=\"Copy\"},2e3)}catch{s.select(),document.execCommand(\"copy\"),t.textContent=\"Copied!\",setTimeout(()=>{t.textContent=\"Copy\"},2e3)}});"],["/Users/miketaylor/My Websites/astro-mike-taylor/src/components/ProtectedContent.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const o=document.querySelector(\".protected-content\");if(!o)return;const a=o.getAttribute(\"data-document-id\");if(!(o.getAttribute(\"data-authenticated\")===\"true\")||!a)return;const d=o.querySelector(\".loading-state\"),s=o.querySelector(\".loaded-content\"),l=o.querySelector(\".error-state\"),i=o.querySelector(\".error-message\");async function u(){try{const e=await fetch(`/api/content/${a}`),t=await e.json();if(!e.ok)throw new Error(t.error||\"Failed to load content\");if(d?.classList.add(\"hidden\"),s?.classList.remove(\"hidden\"),t.body&&Array.isArray(t.body)){const n=f(t.body);s&&(s.innerHTML=n)}}catch(e){console.error(\"Error fetching protected content:\",e),d?.classList.add(\"hidden\"),l?.classList.remove(\"hidden\"),i&&e instanceof Error&&(i.textContent=e.message)}}function f(e){return e.map(t=>{if(t._type===\"block\"){const n=t.style||\"normal\",c=h(n),r=m(n),p=g(t.children||[]);return`<${c}${r?` class=\"${r}\"`:\"\"}>${p}</${c}>`}return\"\"}).join(\"\")}function h(e){return{h1:\"h1\",h2:\"h2\",h3:\"h3\",h4:\"h4\",blockquote:\"blockquote\",normal:\"p\",lead:\"p\",small:\"p\",callout:\"div\"}[e]||\"p\"}function m(e){return{lead:\"text-lg text-gray-600\",small:\"text-sm\",callout:\"bg-blue-50 border-l-4 border-blue-500 p-4 my-4\"}[e]||\"\"}function g(e){return e.map(t=>{if(t._type===\"span\"){let n=y(t.text||\"\");return(t.marks||[]).forEach(r=>{r===\"strong\"&&(n=`<strong>${n}</strong>`),r===\"em\"&&(n=`<em>${n}</em>`),r===\"code\"&&(n=`<code>${n}</code>`),r===\"underline\"&&(n=`<u>${n}</u>`),r===\"strike-through\"&&(n=`<s>${n}</s>`)}),n}return\"\"}).join(\"\")}function y(e){const t=document.createElement(\"div\");return t.textContent=e,t.innerHTML}u()});"]],"assets":["/_astro/index.CQQ0XDMq.css","/favicon.svg","/_astro/Button.astro_astro_type_script_index_0_lang.1VWk6V9Z.js","/auth/check-email/index.html","/auth/error/index.html","/markdown-page/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"7Ci4aLoHsG5U63BON85MU3cO7roHk/1V889prrsdgtQ=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
