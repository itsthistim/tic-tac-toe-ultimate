import concurrently from "concurrently";
import path from "node:path";
import fs from "node:fs";

const entryPoints = ["./src/lib/multiplayer/server"];

const { result } = concurrently(
	entryPoints.map((entryPoint) => {
		if (!fs.statSync(entryPoint)) throw Error(`Incorrect path: ${entryPoint}`);

		return {
			command: `tsx watch ${entryPoint}`,
			name: path.basename(entryPoint, path.extname(entryPoint))
		};
	}),
	{
		prefix: "name",
		killOthers: ["failure", "success"],
		restartTries: 3
	}
);

result.catch((e) => {
	console.error("Server failed to start:", e);
});
