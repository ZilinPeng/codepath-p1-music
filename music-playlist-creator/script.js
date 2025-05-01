
// State
let likedSet = new Set();
let currentPlaylist = null;

// Utility: Fisher–Yates shuffle
function shuffleArray(arr) {
  let m = arr.length, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

// Render the grid of playlist tiles
function renderGrid(list) {
  const grid = document.getElementById("playlist-grid");
  grid.innerHTML = ""; 
  list.forEach(pl => {
    const tile = document.createElement("div");
    tile.className = "playlist-tile";
    tile.innerHTML = `
      <img src="${pl.coverImage}" alt="${pl.name}">
      <div class="playlist-info">
        <h3>${pl.name}</h3>
        <p>by ${pl.author}</p>
        <div class="likes">
          <span class="count">${pl.likes}</span>
          <button class="heart ${likedSet.has(pl.id)? 'liked':''}">♥</button>
        </div>
      </div>
    `;
    // Open modal on image or info click
    tile.querySelector("img, .playlist-info").addEventListener("click", () => {
      openModal(pl);
    });
    // Like/unlike
    const heartBtn = tile.querySelector(".heart");
    heartBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (likedSet.has(pl.id)) {
        likedSet.delete(pl.id);
        pl.likes--;
        heartBtn.classList.remove("liked");
      } else {
        likedSet.add(pl.id);
        pl.likes++;
        heartBtn.classList.add("liked");
      }
      tile.querySelector(".count").textContent = pl.likes;
    });
    grid.appendChild(tile);
  });
}

// Populate and show the modal
function openModal(pl) {
  currentPlaylist = pl;
  document.getElementById("modal-cover").src = pl.coverImage;
  document.getElementById("modal-name").textContent = pl.name;
  document.getElementById("modal-author").textContent = `by ${pl.author}`;
  renderSongList(pl.songs);
  document.getElementById("modal-overlay").classList.remove("hidden");
}

// Render a list of songs inside the modal
function renderSongList(songs) {
  const ul = document.getElementById("modal-songs");
  ul.innerHTML = "";
  songs.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.title} — ${s.artist} (${s.duration})`;
    ul.appendChild(li);
  });
}

// Close modal
document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("modal-overlay").classList.add("hidden");
});
document.getElementById("modal-overlay").addEventListener("click", e => {
  if (e.target.id === "modal-overlay") {
    e.target.classList.add("hidden");
  }
});

// Search & Clear
document.getElementById("search-btn").addEventListener("click", () => {
  const q = document.getElementById("search-input").value.toLowerCase();
  const filtered = playlists.filter(pl =>
    pl.name.toLowerCase().includes(q) ||
    pl.author.toLowerCase().includes(q)
  );
  renderGrid(filtered);
});
document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  renderGrid(playlists);
});

// Sort
document.getElementById("sort-select").addEventListener("change", e => {
  const val = e.target.value;
  let sorted = [...playlists];
  if (val === "name") {
    sorted.sort((a,b) => a.name.localeCompare(b.name));
  } else if (val === "likes") {
    sorted.sort((a,b) => b.likes - a.likes);
  } else if (val === "date") {
    sorted.sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }
  renderGrid(sorted);
});

// Shuffle in modal
document.getElementById("shuffle-btn").addEventListener("click", () => {
  if (!currentPlaylist) return;
  const copy = shuffleArray([...currentPlaylist.songs]);
  renderSongList(copy);
});

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderGrid(playlists);
});