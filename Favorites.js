// ============================================================
//  FAVORITES PAGE — favorites.js
// ============================================================

var favContainer = document.getElementById("favorites-container");
var emptyMsg     = document.getElementById("emptyMsg");

function loadFavorites() {
  // Load saved favorites from localStorage
  var favsJSON  = localStorage.getItem("rb_favorites");
  var favorites = favsJSON ? JSON.parse(favsJSON) : [];

  if (favorites.length === 0) {
    // Show empty state message
    emptyMsg.classList.remove("hidden");
    favContainer.innerHTML = "";
    return;
  }

  emptyMsg.classList.add("hidden");
  favContainer.innerHTML = "";

  // Build a card for each saved favorite using .forEach() HOF
  favorites.forEach(function(q, index) {
    var card = document.createElement("div");
    card.classList.add("quote-card");

    card.innerHTML =
      '<p class="quote-text">"' + q.quote + '"</p>' +
      '<p class="quote-author">— ' + q.author + '</p>' +
      '<button class="fav-btn fav-btn--active" onclick="removeFavorite(' + index + ')">🗑 Remove</button>';

    favContainer.appendChild(card);
  });
}

function removeFavorite(index) {
  // Load current favorites
  var favsJSON  = localStorage.getItem("rb_favorites");
  var favorites = favsJSON ? JSON.parse(favsJSON) : [];

  // Remove the one at this index
  favorites.splice(index, 1);

  // Save back
  localStorage.setItem("rb_favorites", JSON.stringify(favorites));

  // Re-render the page
  loadFavorites();
}

// ── START ────────────────────────────────────────────────────
loadFavorites();