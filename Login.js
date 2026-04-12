// ============================================================
//  LOGIN PAGE JAVASCRIPT
//  Simple localStorage-based auth — no backend needed
// ============================================================

// Switch between Login and Signup tabs
function showTab(tab) {
  var loginForm  = document.getElementById("loginForm");
  var signupForm = document.getElementById("signupForm");
  var tabLogin   = document.getElementById("tabLogin");
  var tabSignup  = document.getElementById("tabSignup");

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    tabLogin.classList.add("auth-tab--active");
    tabSignup.classList.remove("auth-tab--active");
  } else {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    tabSignup.classList.add("auth-tab--active");
    tabLogin.classList.remove("auth-tab--active");
  }

  // Clear any error messages when switching tabs
  document.getElementById("loginError").textContent = "";
  document.getElementById("signupError").textContent = "";
  document.getElementById("signupSuccess").textContent = "";
}

// ── SIGNUP ──────────────────────────────────────────────────
function handleSignup() {
  var name     = document.getElementById("signupName").value.trim();
  var email    = document.getElementById("signupEmail").value.trim();
  var password = document.getElementById("signupPassword").value;
  var errorEl  = document.getElementById("signupError");
  var successEl = document.getElementById("signupSuccess");

  // Clear previous messages
  errorEl.textContent   = "";
  successEl.textContent = "";

  // Basic checks
  if (name === "") {
    errorEl.textContent = "Please enter your name.";
    return;
  }
  if (email === "" || email.indexOf("@") === -1) {
    errorEl.textContent = "Please enter a valid email.";
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = "Password must be at least 6 characters.";
    return;
  }

  // Check if email is already registered
  // We store all users as a JSON string in localStorage
  var usersJSON = localStorage.getItem("rb_users");
  var users = usersJSON ? JSON.parse(usersJSON) : [];

  var alreadyExists = users.find(function(u) {
    return u.email === email;
  });

  if (alreadyExists) {
    errorEl.textContent = "An account with this email already exists.";
    return;
  }

  // Save the new user
  users.push({ name: name, email: email, password: password });
  localStorage.setItem("rb_users", JSON.stringify(users));

  successEl.textContent = "Account created! You can now log in.";

  // Clear the fields
  document.getElementById("signupName").value     = "";
  document.getElementById("signupEmail").value    = "";
  document.getElementById("signupPassword").value = "";

  // Switch to login tab after 1.5 seconds
  setTimeout(function() {
    showTab("login");
  }, 1500);
}

// ── LOGIN ────────────────────────────────────────────────────
function handleLogin() {
  var email    = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value;
  var errorEl  = document.getElementById("loginError");

  errorEl.textContent = "";

  if (email === "" || email.indexOf("@") === -1) {
    errorEl.textContent = "Please enter a valid email.";
    return;
  }
  if (password === "") {
    errorEl.textContent = "Please enter your password.";
    return;
  }

  // Load users from localStorage
  var usersJSON = localStorage.getItem("rb_users");
  var users = usersJSON ? JSON.parse(usersJSON) : [];

  // Find a user that matches email AND password
  var foundUser = users.find(function(u) {
    return u.email === email && u.password === password;
  });

  if (!foundUser) {
    errorEl.textContent = "Wrong email or password. Try again.";
    return;
  }

  // Save who is currently logged in
  localStorage.setItem("rb_loggedIn", JSON.stringify(foundUser));

  // Go to the main page
  window.location.href = "index.html";
}

// ── AUTO-REDIRECT ────────────────────────────────────────────
// If someone is already logged in, skip the login page
var loggedIn = localStorage.getItem("rb_loggedIn");
if (loggedIn) {
  window.location.href = "index.html";
}