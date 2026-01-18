import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sanity({
      projectId: "0f5m14sf",
      dataset: "production",
      useCdn: false,
    }),
  ],
});
