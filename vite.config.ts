import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/(user|list|statistics|profile)": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
