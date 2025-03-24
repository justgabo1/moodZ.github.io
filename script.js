document.addEventListener("DOMContentLoaded", function () {
    const moods = {
        happy: [
            { name: "BTS", link: "https://open.spotify.com/playlist/37i9dQZF1E4rlkYj6ItCDn" },
            { name: "Pitbull", link: "https://open.spotify.com/playlist/37i9dQZF1E4r0nzNspuQFK" },
            { name: "BBNO$", link: "https://open.spotify.com/playlist/37i9dQZF1E4m14w1NfDKCh" }
        ],
        sad: [
            { name: "TV Girl", link: "https://open.spotify.com/playlist/37i9dQZF1E4lFGdRLY5idQ" },
            { name: "Billie Eilish", link: "https://open.spotify.com/playlist/37i9dQZF1E4oee5QSbfqLN" },
            { name: "Beach House", link: "https://open.spotify.com/playlist/37i9dQZF1E4DemSGzmCZ29" }
        ],
        focus: [
            { name: "Lofi Girl", link: "https://open.spotify.com/playlist/37i9dQZF1E4yVfD4M4LwFh" },
            { name: "Hans Zimmer", link: "https://open.spotify.com/playlist/37i9dQZF1E4sbexosKtF5C" },
            { name: "Kordhell", link: "https://open.spotify.com/playlist/37i9dQZF1E4yleuWstyUDt" }
        ],
        angry: [
            { name: "Eminem", link: "https://open.spotify.com/playlist/37i9dQZF1E4uduXaJcMi49" },
            { name: "Slipknot", link: "https://open.spotify.com/playlist/37i9dQZF1E4m433mhB66fa" },
            { name: "Bring Me The Horizon", link: "https://open.spotify.com/playlist/37i9dQZF1E4jXFV0KMR1gU" }
        ]
    };

    const artistContainer = document.getElementById("artists-container");
    const savedList = document.getElementById("saved-list");
    const playlistContainer = document.getElementById("playlist-container");
    const scrollLeft = document.getElementById("scroll-left");
    const scrollRight = document.getElementById("scroll-right");
    const themeToggle = document.getElementById("theme-toggle");

    // Mood Selection
    document.querySelectorAll(".mood-btn").forEach(button => {
        button.addEventListener("click", function () {
            const selectedMood = this.getAttribute("data-mood");
            localStorage.setItem("selectedMood", selectedMood);
            window.location.href = "artists.html";
        });
    });

    // Show Artists based on selected mood
    function showArtists(mood) {
        if (!artistContainer) return;
        artistContainer.innerHTML = "";
        moods[mood].forEach(artist => {
            const btn = document.createElement("button");
            btn.classList.add("artist-btn");
            btn.textContent = artist.name;
            btn.addEventListener("click", () => savePlaylist(artist));
            artistContainer.appendChild(btn);
        });
    }

    // Save Playlist
    function savePlaylist(artist) {
        let saved = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
        if (!saved.find(item => item.name === artist.name)) {
            saved.push(artist);
            localStorage.setItem("savedPlaylists", JSON.stringify(saved));
            loadSavedPlaylists();
        }
    }

    // Load Saved Playlists
    function loadSavedPlaylists() {
        if (!savedList) return;
        savedList.innerHTML = "";
        let saved = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
        saved.forEach(artist => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${artist.link}" target="_blank">${artist.name}</a> <button class="remove-btn" data-name="${artist.name}">X</button>`;
            savedList.appendChild(li);
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                removePlaylist(this.getAttribute("data-name"));
            });
        });
    }

    // Remove Playlist
    function removePlaylist(name) {
        let saved = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
        saved = saved.filter(artist => artist.name !== name);
        localStorage.setItem("savedPlaylists", JSON.stringify(saved));
        loadSavedPlaylists();
    }

    loadSavedPlaylists();

    // Dark Mode Toggle
    function applyDarkMode() {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }

    applyDarkMode();

    if (themeToggle) {
        themeToggle.checked = localStorage.getItem("darkMode") === "enabled";
        themeToggle.addEventListener("change", function () {
            if (this.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("darkMode", "enabled");
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("darkMode", "disabled");
            }
        });
    }

    // Spotify Authentication
    document.getElementById("spotify-login")?.addEventListener("click", () => {
        window.location.href = "/auth/spotify";
    });

    // Load User Data
    fetch("/user")
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                document.getElementById("account-username").innerText = data.user.displayName;
            }
        })
        .catch(err => console.log("Not logged in"));

    // Logout
    document.getElementById("logout-btn")?.addEventListener("click", () => {
        window.location.href = "/logout";
    });
});
