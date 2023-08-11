import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    server: {
      port: 3000,
      strictPort: true,
    },
    resolve: {
      alias: [
        // These aliases are only important to the build step
        { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
        { find: "@components", replacement: path.resolve(__dirname, "src/components") },
        { find: "@config", replacement: path.resolve(__dirname, "src/config") },
        { find: "@config", replacement: path.resolve(__dirname, "src/config") },
        { find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
        { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
        ...(env.NODE_ENV === "development"
          ? [{ find: "./runtimeConfig", replacement: "./runtimeConfig.browser" }]
          : []),
      ],
    },
    ...(env.NODE_ENV === "development" ? { define: { global: {} } } : {}),
  };
});
