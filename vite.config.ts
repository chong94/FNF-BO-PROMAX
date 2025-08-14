import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/user": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
      "/list/agent": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
      "/list/member": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
      "/list/pending/deposit": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
      "/statistics/company-self": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
      "/profile": {
        target: "https://dominic.fnfgame.org",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
