document.addEventListener("DOMContentLoaded", function () {
    // Fetch Discord Presence
    async function fetchDiscordPresence() {
        try {
            let response = await fetch("https://api.lanyard.rest/v1/users/867658987418681374");
            let data = await response.json();

            if (data.success && data.data.discord_status) {
                let statusText = "Unknown";

                switch (data.data.discord_status) {
                    case "online":
                        statusText = "Online 🟢";
                        break;
                    case "idle":
                        statusText = "Idle 🌙";
                        break;
                    case "dnd":
                        statusText = "Do Not Disturb 🔴";
                        break;
                    case "offline":
                        statusText = "Offline ⚫";
                        break;
                }

                document.getElementById("discord-status").textContent = `Discord Status: ${statusText}`;
            }
        } catch (error) {
            document.getElementById("discord-status").textContent = "Error fetching status.";
        }
    }

    fetchDiscordPresence();
    setInterval(fetchDiscordPresence, 60000);

    // Fetch Last.fm Now Playing (Without Album Cover)
    async function fetchLastFM() {
        try {
            let response = await fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=FuyuFuyuki&api_key=ff60f99f6c8b0aab0946dc1548761e50&format=json");
            let data = await response.json();

            let track = data.recenttracks.track[0];
            let nowPlaying = track["@attr"]?.nowplaying ? "🎵 Now Playing" : "Last Played";

            document.getElementById("lastfm-track").textContent = track.name;
            document.getElementById("lastfm-artist").textContent = track.artist["#text"];
            document.getElementById("lastfm-status").textContent = nowPlaying;
        } catch (error) {
            document.getElementById("lastfm-status").textContent = "Error fetching music.";
        }
    }

    fetchLastFM();
    setInterval(fetchLastFM, 30000);
});
