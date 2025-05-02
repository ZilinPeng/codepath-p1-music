let playlists = [];
let likedSet = new Set();
let currentPlaylist = null;

// Fisher-Yates Shuffle
function shuffleArray(arr) {
  let m = arr.length, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

// Function to render all playlist cards
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
            <button class="heart ${likedSet.has(pl.id) ? 'liked' : ''}">♥</button>
          </div>
        </div>
      `;

      // Open modal when tile clicked
      tile.addEventListener("click", () => {
        openModal(pl);
      });

      // Like button logic
      const heartBtn = tile.querySelector(".heart");
      heartBtn.addEventListener("click", (e) => {
        e.stopPropagation();  // Prevent the click from also opening the modal

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

// Show playlist details in modal
function openModal(pl) {
  currentPlaylist = pl;
  document.getElementById("modal-cover").src = pl.coverImage;
  document.getElementById("modal-name").textContent = pl.name;
  document.getElementById("modal-author").textContent = `by ${pl.author}`;
  renderSongList(pl.songs);
  document.getElementById("modal-overlay").classList.remove("hidden");
}

function renderSongList(songs) {
  const ul = document.getElementById("modal-songs");
  ul.innerHTML = "";
  songs.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.title} — ${s.artist} (${s.duration})`;
    ul.appendChild(li);
  });
}

// Modal close
document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("modal-overlay").classList.add("hidden");
});
document.getElementById("modal-overlay").addEventListener("click", e => {
  if (e.target.id === "modal-overlay") {
    e.target.classList.add("hidden");
  }
});

// Search
document.getElementById("search-btn").addEventListener("click", () => {
  const q = document.getElementById("search-input").value.toLowerCase();
  const filtered = playlists.filter(pl =>
    pl.name.toLowerCase().includes(q) ||
    pl.author.toLowerCase().includes(q)
  );
  renderGrid(filtered);
});

document.getElementById("search-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Stop form submission or other default actions
      const q = event.target.value.toLowerCase();
      const filtered = playlists.filter(pl =>
        pl.name.toLowerCase().includes(q) ||
        pl.author.toLowerCase().includes(q)
      );
      renderGrid(filtered);
    }
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
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (val === "likes") {
    sorted.sort((a, b) => b.likes - a.likes);
  } else if (val === "date") {
    sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }
  renderGrid(sorted);
});

// Shuffle in modal
document.getElementById("shuffle-btn").addEventListener("click", () => {
  if (!currentPlaylist) return;
  const copy = shuffleArray([...currentPlaylist.songs]);
  renderSongList(copy);
});

// Fetch the JSON and initialize
document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/data.json")
    .then(res => res.json())
    .then(data => {
      playlists = data.playlists;
      renderGrid(playlists);
    })
    .catch(err => console.error("Failed to load playlists:", err));
});