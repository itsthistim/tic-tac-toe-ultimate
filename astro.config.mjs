// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import path from "path";

import svelte from "@astrojs/svelte";

const host = process.env.TAURI_DEV_HOST;

// https://astro.build/config
export default defineConfig({
    site: "https://intertyp.net",
    output: "static",
    integrations: [icon(), svelte()],
    devToolbar: {
        enabled: false
    },
    vite: {
        resolve: {
            alias: {
                "@": path.resolve("./src")
            }
        },
        clearScreen: false,
        server: {
            port: 5173,
            strictPort: true,
            hmr: host
                ? {
                        port: 1421
                  }
                : undefined,
            watch: {
                ignored: ["**/src-tauri/**"]
            }
        },
        envPrefix: ["VITE_", "TAURI_ENV_*"],
        build: {
            target: process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
            minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
            sourcemap: !!process.env.TAURI_ENV_DEBUG
        }
    },
    server: {
        port: 5173,
        host: host || false
    }
});