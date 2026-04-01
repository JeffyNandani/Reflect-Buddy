let allQuotes = [];

// Get DOM elements
const container = document.getElementById("quotes-container");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const promptsContainer = document.getElementById("prompts-container");

// ── QUOTES ──────────────────────────────────────────────────

// Using quoteslate.io — free, no key needed, works in browser
function fetchQuotes() {
  container.innerHTML = "<p>Loading quotes...</p>";

  fetch("https://quoteslate.vercel.app/api/quotes?limit=12")
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      allQuotes = data.quotes; // array of { quote, author }
      renderQuotes(allQuotes);
    })
    .catch(function() {
      // If API fails, show fallback quotes
      allQuotes = [
        { quote: "The unexamined life is not worth living.", author: "Socrates" },
        { quote: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
        { quote: "You cannot travel the path until you have become the path itself.", author: "Buddha" },
        { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { quote: "The only journey is the journey within.", author: "Rainer Maria Rilke" },
        { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" }
      ];
      renderQuotes(allQuotes);
    });
}

function renderQuotes(quotes) {
  container.innerHTML = ""; // clear old content

  if (quotes.length === 0) {
    container.innerHTML = "<p>No quotes found.</p>";
    return;
  }

  quotes.forEach(function(q) {
    var card = document.createElement("div");
    card.classList.add("quote-card");

    card.innerHTML = `
      <p class="quote-text">"${q.quote}"</p>
      <p class="quote-author">— ${q.author}</p>
    `;

    container.appendChild(card);
  });
}

function filterAndSort() {
  var searchText = searchInput.value.toLowerCase();
  var sortBy = sortSelect.value;

  // Step 1: Filter
  var filtered = allQuotes.filter(function(q) {
    return q.quote.toLowerCase().includes(searchText) ||
           q.author.toLowerCase().includes(searchText);
  });

  // Step 2: Sort
  if (sortBy === "author") {
    filtered.sort(function(a, b) {
      return a.author.localeCompare(b.author);
    });
  } else if (sortBy === "length") {
    filtered.sort(function(a, b) {
      return a.quote.length - b.quote.length;
    });
  }

  // Step 3: Show
  renderQuotes(filtered);
}

// Listen for typing in search box
searchInput.addEventListener("input", filterAndSort);

// Listen for sort dropdown change
sortSelect.addEventListener("change", filterAndSort);


// ── PROMPTS ─────────────────────────────────────────────────

function fetchPrompts() {
  fetch("data/prompts.json")
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      renderPrompts(data);
    })
    .catch(function() {
      promptsContainer.innerHTML = "<p>Could not load prompts.</p>";
    });
}

function renderPrompts(prompts) {
  promptsContainer.innerHTML = "";

  prompts.forEach(function(p) {
    var card = document.createElement("div");
    card.classList.add("prompt-card");
    card.innerHTML = `<p>${p.text}</p>`;
    promptsContainer.appendChild(card);
  });
}


// ── START ────────────────────────────────────────────────────
fetchQuotes();
fetchPrompts();