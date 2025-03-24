document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get("mood");

    const response = await fetch(`/get-playlists?mood=${mood}`);
    const playlists = await response.json();

    const container = document.getElementById("playlist-container");
    playlists.forEach(playlist => {
        let div = document.createElement("div");
        div.innerHTML = `<h3>${playlist.name}</h3> <a href="${playlist.url}" target="_blank">Open on Spotify</a>`;
        container.appendChild(div);
    });
});
