document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("enter-overlay");
    const musicPlayer = document.getElementById("music-player");
    const audio = document.getElementById("audio-player");
    const coverImage = document.getElementById("cover-img");
    const songTitle = document.getElementById("song-title");
    const header = musicPlayer.querySelector(".music-header");

    // Danh sách nhạc
    const playlist = [
        {
            title: "Yukopi - 夏に咲く (feat. 初音ミク)",
            file: "song.mp3",
            cover: "cover.jpg"
        },
        {
            title: "オリジナル楽曲】ういこうせん / しぐれうい【にゃるら・Aiobahn +81】",
            file: "song3.mp3",
            cover: "cover3.jpg"
        },
        {
            title: "DECO*27 - ハローセカイ feat. 初音ミク",
            file: "song5.mp3",
            cover: "cover5.jpg"
        },
        {
            title: "雑魚 / 亞北ネル",
            file: "song6.mp3",
            cover: "cover6.jpg"
        },
        {
            title: "【オリジナル楽曲】Pris-Magic! / しぐれうい【烏屋茶房・篠崎あやと】",
            file: "song8.mp3",
            cover: "cover8.jpg"
        },
        {
            title: "【MV】MOTTAI／P丸様。",
            file: "song12.mp3",
            cover: "cover12.jpg"
        },
        {
            title: "DECO*27 - チェリーポップ feat. 初音ミク",
            file: "song13.mp3",
            cover: "cover13.jpg"
        },
        {
            title: "ふんわりディスコード",
            file: "song15.mp3",
            cover: "cover15.jpg"
        }
        
    ];

    let currentSong = Math.floor(Math.random() * playlist.length);

    function loadSong(index) {
        const song = playlist[index];
        audio.src = song.file;
        coverImage.src = song.cover;
        songTitle.textContent = song.title;
    }

    function playNextSong() {
        currentSong = (currentSong + 1) % playlist.length;
        loadSong(currentSong);
        audio.play();
    }

    // Khi kết thúc bài thì chuyển bài khác
    audio.addEventListener("ended", playNextSong);

    // Khi bấm để vào
    overlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
        musicPlayer.classList.add("visible");
        audio.volume = 0.1;
        loadSong(currentSong);
        audio.play().catch(() => console.log("Autoplay bị chặn"));
    });

    // Player có thể kéo
    function makeDraggable(element, handle) {
        let isDragging = false, offsetX = 0, offsetY = 0;

        const startDrag = (e) => {
            isDragging = true;
            const rect = element.getBoundingClientRect();
            offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
            offsetY = (e.clientY || e.touches[0].clientY) - rect.top;

            document.addEventListener("mousemove", onDrag);
            document.addEventListener("mouseup", stopDrag);
            document.addEventListener("touchmove", onDrag, { passive: false });
            document.addEventListener("touchend", stopDrag);
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            element.style.left = `${clientX - offsetX}px`;
            element.style.top = `${clientY - offsetY}px`;
            element.style.right = "unset";
            element.style.bottom = "unset";
        };

        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", stopDrag);
            document.removeEventListener("touchmove", onDrag);
            document.removeEventListener("touchend", stopDrag);
        };

        handle.addEventListener("mousedown", startDrag);
        handle.addEventListener("touchstart", startDrag, { passive: false });
    }

    makeDraggable(musicPlayer, header);

    // Tự thu nhỏ giao diện trên mobile
    function updateMusicPlayerLayout() {
        if (window.innerWidth <= 600) {
            musicPlayer.classList.add('collapsed');
        } else {
            musicPlayer.classList.remove('collapsed');
        }
    }

    updateMusicPlayerLayout();
    window.addEventListener('resize', updateMusicPlayerLayout);

    // Click ảnh bìa: mobile toggle, PC pause/play
    coverImage.addEventListener("click", () => {
        if (window.innerWidth <= 600) {
            musicPlayer.classList.toggle("collapsed");
        } else {
            if (audio.paused) audio.play();
            else audio.pause();
        }
    });

    // Lấy Discord presence từ Lanyard API
    async function fetchDiscordPresence() {
        try {
            const response = await fetch("https://api.lanyard.rest/v1/users/867658987418681374");
            const data = await response.json();

            if (data.success && data.data.discord_status) {
                let statusText = "Unknown";
                switch (data.data.discord_status) {
                    case "online": statusText = "Online 🟢"; break;
                    case "idle": statusText = "Idle 🌙"; break;
                    case "dnd": statusText = "Do Not Disturb ⛔"; break;
                    case "offline": statusText = "Offline ⚫"; break;
                }

                let customStatus = "";
                const activities = data.data.activities;
                if (activities && activities.length > 0) {
                    const customActivity = activities.find(a => a.type === 4);
                    if (customActivity && customActivity.state) {
                        if (customActivity.emoji) {
                            if (customActivity.emoji.id) {
                                const emojiURL = `https://cdn.discordapp.com/emojis/${customActivity.emoji.id}.${customActivity.emoji.animated ? "gif" : "png"}`;
                                customStatus = `<img src="${emojiURL}" alt="emoji" width="20" height="20" style="vertical-align: middle;"> ${customActivity.state}`;
                            } else {
                                customStatus = `${customActivity.emoji.name} ${customActivity.state}`;
                            }
                        } else {
                            customStatus = customActivity.state;
                        }
                    }
                }

                document.getElementById("discord-status").innerHTML = `
                    <p>Discord Status: ${statusText}</p>
                    ${customStatus ? `<p>${customStatus}</p>` : ""}
                `;
            }
        } catch (error) {
            document.getElementById("discord-status").textContent = "Error fetching status.";
        }
    }

    fetchDiscordPresence();
    setInterval(fetchDiscordPresence, 60000);
});

const discordIcon = document.getElementById("fuyufuyuki");

let copyTimeout;

discordIcon.addEventListener("click", async (event) => {
    event.preventDefault();

    const discordUsername = "fuyufuyuki";
    const tooltip = discordIcon.querySelector(".copy-tooltip");

    async function copyText(text) {
        // Preferred method: HTTPS or localhost
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        // Fallback for older browsers or insecure contexts
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.readOnly = true;

        Object.assign(textarea.style, {
            position: "fixed",
            left: "-9999px",
            top: "0",
            opacity: "0"
        });

        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length);

        const success = document.execCommand("copy");
        textarea.remove();

        if (!success) {
            throw new Error("Clipboard copy failed");
        }
    }

    try {
        await copyText(discordUsername);

        clearTimeout(copyTimeout);
        discordIcon.classList.remove("copied");

        // Restart animation
        void discordIcon.offsetWidth;
        discordIcon.classList.add("copied");

        tooltip.textContent = "Copied! ✓";

        discordIcon.querySelectorAll(
            ".copy-particle, .copy-ring"
        ).forEach(el => el.remove());

        // Expanding ring
        const ring = document.createElement("span");
        ring.className = "copy-ring";
        discordIcon.appendChild(ring);

        ring.addEventListener("animationend", () => ring.remove());

        // Sparkle particles
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement("span");
            particle.className = "copy-particle";
            particle.textContent = "✦";

            const angle = (i / 6) * Math.PI * 2;
            const distance = 35;

            particle.style.setProperty(
                "--dx",
                `${Math.cos(angle) * distance}px`
            );
            particle.style.setProperty(
                "--dy",
                `${Math.sin(angle) * distance}px`
            );

            discordIcon.appendChild(particle);
            particle.addEventListener(
                "animationend",
                () => particle.remove()
            );
        }

        copyTimeout = setTimeout(() => {
            discordIcon.classList.remove("copied");
            tooltip.textContent = "Copied!";
        }, 1500);

    } catch (error) {
        console.error("Discord copy error:", error);
        tooltip.textContent = "Copy failed!";
        discordIcon.classList.add("copied");

        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
            discordIcon.classList.remove("copied");
            tooltip.textContent = "Copied!";
        }, 2000);
    }
});
