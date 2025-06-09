let lastExact = null;

function fetchAndDisplayActivePlayersAndVisits() {
    const robloxUrl = "https://games.roblox.com/v1/games?universeIds=1147304238,5768456460,5117861193";
    const url = "https://corsproxy.io/?" + encodeURIComponent(robloxUrl);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                // sum the 'playing' values from all games
                const totalActive = data.data.reduce((sum, game) => sum + (game.playing || 0), 0);
                const elem = document.getElementById('active-players');
                if (elem) elem.textContent = totalActive.toLocaleString();

                // sum of visits from all games
                const totalVisits = data.data.reduce((sum, game) => sum + (game.visits || 0), 0);
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
                // update tooltip value
                lastExact = totalVisits;
                const exactElem = document.querySelector('.js-exact-visits');
                if (exactElem) exactElem.textContent = totalVisits.toLocaleString() + " visits";
            }
        })
        .catch(err => {
            const elem = document.getElementById('active-players');
            if (elem) elem.textContent = "N/A";

            const visitsElem = document.getElementById('total-visits');
            if(visitsElem) visitsElem.textContent = "N/A";

            const exactElem = document.querySelector('.js-exact-visits');
            if (exactElem) exactElem.textContent = "N/A";

            console.error("failed to fetch active players:", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayActivePlayersAndVisits();
    setInterval(fetchAndDisplayActivePlayersAndVisits, 2000); // refresh every 2 seconds

    // fetch immediately on hover for real-time tooltip
    const gameVisitsCard = document.querySelector('.stat-item .js-exact-visits')?.parentElement;
    if (gameVisitsCard) {
        gameVisitsCard.addEventListener('mouseenter', () => {
            fetchAndDisplayActivePlayersAndVisits();
        });
    }
});