import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
              priority: 20,
            },
            {
              name: "firebase-vendor",
              test: /node_modules[\\/](@firebase|firebase)[\\/]/,
              maxSize: 450_000,
              entriesAware: true,
              entriesAwareMergeThreshold: 20_000,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
