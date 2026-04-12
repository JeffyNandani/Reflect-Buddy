// ============================================================
//  DARK MODE — included on every page
// ============================================================

// When the page first loads, check if dark mode was saved
var savedTheme = localStorage.getItem("rb_theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  updateToggleButton();
}

// Toggle dark mode on/off
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  // Save the choice so it stays after page reload
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("rb_theme", "dark");
  } else {
    localStorage.setItem("rb_theme", "light");
  }

  updateToggleButton();
}

// Update the button text to match current mode
function updateToggleButton() {
  var btn = document.getElementById("darkToggle");
  if (!btn) return;

  if (document.body.classList.contains("dark")) {
    btn.textContent = "☀️ Light";
  } else {
    btn.textContent = "🌙 Dark";
  }
}