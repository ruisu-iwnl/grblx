const ROBLOX_UNIVERSE_IDS = "1147304238,5768456460,5117861193";
const ROBLOX_URL = `https://games.roblox.com/v1/games?universeIds=${ROBLOX_UNIVERSE_IDS}`;

const timeoutMs = 8000;
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

async function main() {
    const response = await fetch(ROBLOX_URL, { signal: controller.signal });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid Roblox response");
    }

    const games = data.data.map((game) => ({
        id: game.id ?? null,
        name: game.name ?? null,
        playing: Number(game.playing ?? 0),
        visits: Number(game.visits ?? 0)
    }));

    const totalActive = games.reduce((sum, game) => sum + (game.playing || 0), 0);
    const totalVisits = games.reduce((sum, game) => sum + (game.visits || 0), 0);

    const payload = {
        updatedAt: new Date().toISOString(),
        totalActive,
        totalVisits,
        games
    };

    await writeFile(new URL("../../stats.json", import.meta.url), JSON.stringify(payload, null, 2) + "\n");
}

import { writeFile } from "node:fs/promises";

main()
    .catch((err) => {
        console.error("Failed to fetch Roblox stats:", err);
        process.exitCode = 1;
    })
    .finally(() => clearTimeout(timeoutId));
