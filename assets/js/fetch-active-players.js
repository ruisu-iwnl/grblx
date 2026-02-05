const STATS_URL = "stats.json";
const FETCH_TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 30000;
const HOVER_REFRESH_MIN_MS = 8000;

let cachedData = null;
let cachedAtMs = 0;
let inFlight = null;
let lastHoverRequestAtMs = 0;

function fetchJsonWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    return fetch(url, { ...options, signal: controller.signal })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .finally(() => clearTimeout(timeoutId));
}

function normalizeAndDisplayStats(data) {
    if (!data) return;
    const totalActive = Number(data.totalActive ?? 0);
    const activeElem = document.getElementById('active-players');
    if (activeElem) activeElem.textContent = totalActive.toLocaleString();

    const totalVisits = Number(data.totalVisits ?? 0);
    const visitsElem = document.getElementById('total-visits');
    if (visitsElem) {
        let display = "";
        if (totalVisits >= 1_000_000_000) {
            display = totalVisits.toString().slice(0, 3) + "B+";
        } else if (totalVisits >= 1_000_000) {
            display = totalVisits.toString().slice(0, 3) + "M+";
        } else if (totalVisits >= 1_000) {
            display = totalVisits.toString().slice(0, 3) + "K+";
        } else {
            display = totalVisits.toString();
        }
        visitsElem.textContent = display;
    }

    const exactElem = document.querySelector('.js-exact-visits');
    if (exactElem) exactElem.textContent = `${totalVisits.toLocaleString()} visits`;
}

function setStatsToNA() {
    const activeElem = document.getElementById('active-players');
    if (activeElem) activeElem.textContent = "N/A";

    const visitsElem = document.getElementById('total-visits');
    if (visitsElem) visitsElem.textContent = "N/A";

    const exactElem = document.querySelector('.js-exact-visits');
    if (exactElem) exactElem.textContent = "N/A";
}

async function fetchRobloxData() {
    const nowMs = Date.now();
    if (cachedData && nowMs - cachedAtMs < CACHE_TTL_MS) {
        return cachedData;
    }

    if (inFlight) return inFlight;

    inFlight = (async () => {
        try {
            const stats = await fetchJsonWithTimeout(STATS_URL, { cache: "no-store" });
            if (!stats) throw new Error("Invalid stats response");
            cachedData = stats;
            cachedAtMs = Date.now();
            return stats;
        } finally {
            inFlight = null;
        }
    })();

    return inFlight;
}

async function fetchAndDisplayActivePlayersAndVisits() {
    try {
        const data = await fetchRobloxData();
        if (data && data.data) {
            normalizeAndDisplayStats(data);
        } else if (cachedData) {
            normalizeAndDisplayStats(cachedData);
        } else {
            setStatsToNA();
        }
    } catch (err) {
        if (cachedData) {
            normalizeAndDisplayStats(cachedData);
        } else {
            setStatsToNA();
        }
        console.error("failed to fetch active players:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayActivePlayersAndVisits();
    setInterval(fetchAndDisplayActivePlayersAndVisits, 30000); // refresh every 30 seconds

    // fetch immediately on hover for real-time tooltip
    const gameVisitsCard = document.querySelector('.stat-item .js-exact-visits')?.parentElement;
    if (gameVisitsCard) {
        gameVisitsCard.addEventListener('mouseenter', () => {
            const nowMs = Date.now();
            if (nowMs - lastHoverRequestAtMs < HOVER_REFRESH_MIN_MS) {
                if (cachedData) normalizeAndDisplayStats(cachedData);
                return;
            }
            lastHoverRequestAtMs = nowMs;
            fetchAndDisplayActivePlayersAndVisits();
        });
    }
});
