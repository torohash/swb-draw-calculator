import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		strictPort: true, // ポートが被っていたらエラー
		host: true, // 0.0.0.0でリッスン（Docker環境用）
		open: true,
	},
	preview: {
		port: 3000,
		host: true,
	},
});
