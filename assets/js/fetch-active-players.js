function fetchAndDisplayActivePlayers() {
    const robloxUrl = "https://games.roblox.com/v1/games?universeIds=1147304238,5768456460";
    const url = "https://corsproxy.io/?" + encodeURIComponent(robloxUrl);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                // sum the 'playing' values from all games
                const totalActive = data.data.reduce((sum, game) => sum + (game.playing || 0), 0);
                const elem = document.getElementById('active-players');
                if (elem) elem.textContent = totalActive.toLocaleString();
            }
        })
        .catch(err => {
            const elem = document.getElementById('active-players');
            if (elem) elem.textContent = "N/A";
            console.error("Failed to fetch active players:", err);
        });
}

// call this after the hero component is loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayActivePlayers();
    setInterval(fetchAndDisplayActivePlayers, 60000); // refresh every 60 seconds
});