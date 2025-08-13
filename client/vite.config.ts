import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: isDev
      ? {
          host: "::",
          port: 8081,
          proxy: {
            "/api": {
              target: "http://localhost:3001", // your local backend
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined, // no dev server config in production

    build: {
      outDir: "dist",
    },

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
