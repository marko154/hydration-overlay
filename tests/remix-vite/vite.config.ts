import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { hydrationOverlay } from "@builder.io/react-hydration-overlay/vite";

export default defineConfig({
  plugins: [hydrationOverlay(), remix(), tsconfigPaths()],
});
