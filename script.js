// ============================================================
//  QUOTES PAGE — script.js
//  Features: API fetch, search, sort, pagination, favorites
// ============================================================

// ── GLOBAL STATE ────────────────────────────────────────────
var allQuotes   = [];   // all quotes from the API
var currentPage = 1;    // which page we are on
var quotesPerPage = 9;  // how many quotes per page

// ── DOM ELEMENTS ─────────────────────────────────────────────
var container     = document.getElementById("quotes-container");
var searchInput   = document.getElementById("searchInput");
var sortSelect    = document.getElementById("sortSelect");
var spinner       = document.getElementById("spinner");
var paginationDiv = document.getElementById("pagination");
var promptsContainer = document.getElementById("prompts-container");

// ── FETCH QUOTES FROM API ────────────────────────────────────
function fetchQuotes() {
  // Show the loading spinner
  spinner.classList.remove("hidden");
  container.innerHTML = "";

  fetch("https://quoteslate.vercel.app/api/quotes?limit=30")
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      // Hide spinner when data arrives
      spinner.classList.add("hidden");
      allQuotes = data.quotes;
      renderPage();
    })
    .catch(function() {
      // If the API fails, use fallback quotes
      spinner.classList.add("hidden");
      allQuotes = [
        { quote: "The unexamined life is not worth living.", author: "Socrates" },
        { quote: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
        { quote: "You cannot travel the path until you have become the path itself.", author: "Buddha" },
        { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { quote: "The only journey is the journey within.", author: "Rainer Maria Rilke" },
        { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
        { quote: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
        { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
        { quote: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
        { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
      ];
      renderPage();
    });
}

// ── GET FILTERED + SORTED QUOTES ────────────────────────────
// This function uses Array HOFs (filter, sort) as required by the project
function getProcessedQuotes() {
  var searchText = searchInput.value.toLowerCase();
  var sortBy     = sortSelect.value;

  // Step 1: FILTER using Array .filter() HOF
  var filtered = allQuotes.filter(function(q) {
    return (
      q.quote.toLowerCase().includes(searchText) ||
      q.author.toLowerCase().includes(searchText)
    );
  });

  // Step 2: SORT using Array .sort() HOF
  if (sortBy === "author") {
    filtered.sort(function(a, b) {
      return a.author.localeCompare(b.author);
    });
  } else if (sortBy === "length") {
    filtered.sort(function(a, b) {
      return a.quote.length - b.quote.length;
    });
  }

  return filtered;
}

// ── RENDER QUOTES FOR THE CURRENT PAGE ──────────────────────
function renderPage() {
  var processed = getProcessedQuotes();

  // Work out which quotes go on this page (pagination)
  var startIndex = (currentPage - 1) * quotesPerPage;
  var endIndex   = startIndex + quotesPerPage;
  var pageQuotes = processed.slice(startIndex, endIndex);

  // Clear old cards
  container.innerHTML = "";

  if (pageQuotes.length === 0) {
    container.innerHTML = "<p style='color:var(--subtext)'>No quotes found. Try a different search.</p>";
    paginationDiv.innerHTML = "";
    return;
  }

  // Load saved favorites from localStorage
  var favsJSON = localStorage.getItem("rb_favorites");
  var favorites = favsJSON ? JSON.parse(favsJSON) : [];

  // Build a quote card for each quote using Array .forEach() HOF
  pageQuotes.forEach(function(q) {
    // Check if this quote is already a favorite
    var isFav = favorites.find(function(f) {
      return f.quote === q.quote;
    });

    var card = document.createElement("div");
    card.classList.add("quote-card");

    card.innerHTML =
      '<p class="quote-text">"' + q.quote + '"</p>' +
      '<p class="quote-author">— ' + q.author + '</p>' +
      '<button class="fav-btn ' + (isFav ? "fav-btn--active" : "") + '" ' +
        'onclick="toggleFavorite(this, \'' + encodeURIComponent(q.quote) + '\', \'' + encodeURIComponent(q.author) + '\')">' +
        (isFav ? "❤️ Saved" : "🤍 Save") +
      '</button>';

    container.appendChild(card);
  });

  // Render pagination buttons
  renderPagination(processed.length);
}

// ── TOGGLE FAVORITE ──────────────────────────────────────────
function toggleFavorite(button, encodedQuote, encodedAuthor) {
  var quote  = decodeURIComponent(encodedQuote);
  var author = decodeURIComponent(encodedAuthor);

  // Load current favorites
  var favsJSON  = localStorage.getItem("rb_favorites");
  var favorites = favsJSON ? JSON.parse(favsJSON) : [];

  // Check if it's already saved
  var existingIndex = -1;
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i].quote === quote) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex === -1) {
    // Not saved yet → add it
    favorites.push({ quote: quote, author: author });
    button.textContent = "❤️ Saved";
    button.classList.add("fav-btn--active");
  } else {
    // Already saved → remove it
    favorites.splice(existingIndex, 1);
    button.textContent = "🤍 Save";
    button.classList.remove("fav-btn--active");
  }

  // Save updated list back to localStorage
  localStorage.setItem("rb_favorites", JSON.stringify(favorites));
}

// ── PAGINATION ───────────────────────────────────────────────
function renderPagination(totalQuotes) {
  paginationDiv.innerHTML = "";

  var totalPages = Math.ceil(totalQuotes / quotesPerPage);

  if (totalPages <= 1) return; // no need for buttons if only 1 page

  // Previous button
  if (currentPage > 1) {
    var prevBtn = document.createElement("button");
    prevBtn.textContent = "← Prev";
    prevBtn.classList.add("page-btn");
    prevBtn.onclick = function() {
      currentPage = currentPage - 1;
      renderPage();
      window.scrollTo(0, 0);
    };
    paginationDiv.appendChild(prevBtn);
  }

  // Page number buttons
  for (var p = 1; p <= totalPages; p++) {
    var pageBtn = document.createElement("button");
    pageBtn.textContent = p;
    pageBtn.classList.add("page-btn");
    if (p === currentPage) {
      pageBtn.classList.add("page-btn--active");
    }
    // We need a closure here so the correct page number is captured
    pageBtn.onclick = (function(pageNum) {
      return function() {
        currentPage = pageNum;
        renderPage();
        window.scrollTo(0, 0);
      };
    })(p);
    paginationDiv.appendChild(pageBtn);
  }

  // Next button
  if (currentPage < totalPages) {
    var nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.classList.add("page-btn");
    nextBtn.onclick = function() {
      currentPage = currentPage + 1;
      renderPage();
      window.scrollTo(0, 0);
    };
    paginationDiv.appendChild(nextBtn);
  }
}

// ── SEARCH & SORT LISTENERS ──────────────────────────────────
searchInput.addEventListener("input", function() {
  currentPage = 1; // go back to page 1 when searching
  renderPage();
});

sortSelect.addEventListener("change", function() {
  currentPage = 1;
  renderPage();
});

// ── PROMPTS ──────────────────────────────────────────────────
function fetchPrompts() {
  fetch("data/prompts.json")
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      renderPrompts(data);
    })
    .catch(function() {
      // Hardcoded fallback prompts if the JSON file isn't found
      var fallbackPrompts = [
        { text: "What emotion am I carrying most strongly right now?" },
        { text: "What is one thing I am proud of today, however small?" },
        { text: "Is there something I need to let go of?" },
        { text: "What does my inner voice say when everything is quiet?" },
        { text: "What do I need more of in my life right now?" }
      ];
      renderPrompts(fallbackPrompts);
    });
}

function renderPrompts(prompts) {
  promptsContainer.innerHTML = "";

  // Using Array .forEach() HOF
  prompts.forEach(function(p) {
    var card = document.createElement("div");
    card.classList.add("prompt-card");
    card.innerHTML = "<p>" + p.text + "</p>";
    promptsContainer.appendChild(card);
  });
}

// ── START ────────────────────────────────────────────────────
fetchQuotes();
fetchPrompts();