import express from "express";
import { createServer } from "http";
import path from "path";
import { Multiplayer } from "./lib/multiplayer/server";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

// Serve static files from the Astro build output directory
// Assuming the build output is in 'dist' relative to the project root
// and this file is in 'src'
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

// Initialize the Multiplayer server with the HTTP server
new Multiplayer(server);

// Handle SPA routing - send all requests to index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(distPath, "index.html"));
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
