import { c as createComponent, d as createAstro, n as renderHead, k as renderSlot, r as renderTemplate } from './astro/server_YtkIaNi7.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Main = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Main;
  const { content } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${content.title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/miketaylor/My Websites/astro-mike-taylor/src/layouts/main.astro", void 0);

export { $$Main as $ };
