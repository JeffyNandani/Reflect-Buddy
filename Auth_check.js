// ============================================================
//  AUTH CHECK — included on every protected page
//  If nobody is logged in, send them to login.html
// ============================================================

// Check if someone is logged in
var loggedInJSON = localStorage.getItem("rb_loggedIn");

if (!loggedInJSON) {
  // Not logged in → go to login page
  window.location.href = "login.html";
}

// Show the user's name in the navbar
var loggedInUser = JSON.parse(loggedInJSON);
var navUser = document.getElementById("navUser");
if (navUser && loggedInUser) {
  navUser.textContent = "Hi, " + loggedInUser.name + " 👋";
}

// Logout function (called by the Logout button in the navbar)
function logout() {
  localStorage.removeItem("rb_loggedIn");
  window.location.href = "login.html";
}