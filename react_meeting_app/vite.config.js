import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certs/172.17.20.38-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "certs/172.17.20.38.pem")
      ),
    },
    host: "172.17.20.38", // Replace with your IP address
    port: 5173, // Optional: Specify a port
  },
});
