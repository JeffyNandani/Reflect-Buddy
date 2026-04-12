// ============================================================
//  EXERCISES PAGE — exercises.js
// ============================================================

// All exercises defined as an array of objects
var exercises = [
  {
    id: 0,
    name: "Box Breathing",
    desc: "Used by Navy SEALs to stay calm under pressure. Breathe in, hold, breathe out, hold — each for 4 seconds.",
    icon: "🟦",
    steps: [
      { label: "Breathe In",  duration: 4 },
      { label: "Hold",        duration: 4 },
      { label: "Breathe Out", duration: 4 },
      { label: "Hold",        duration: 4 }
    ]
  },
  {
    id: 1,
    name: "4-7-8 Breathing",
    desc: "A calming technique: inhale for 4 seconds, hold for 7, exhale slowly for 8.",
    icon: "🌊",
    steps: [
      { label: "Breathe In",  duration: 4 },
      { label: "Hold",        duration: 7 },
      { label: "Breathe Out", duration: 8 }
    ]
  },
  {
    id: 2,
    name: "Deep Belly Breathing",
    desc: "Simple and effective. Breathe in slowly through your nose, and out through your mouth.",
    icon: "🌿",
    steps: [
      { label: "Breathe In",  duration: 5 },
      { label: "Breathe Out", duration: 5 }
    ]
  }
];

// ── DOM ELEMENTS ─────────────────────────────────────────────
var exContainer  = document.getElementById("exercises-container");
var playerSection = document.getElementById("exercisePlayer");
var playerTitle  = document.getElementById("playerTitle");
var playerDesc   = document.getElementById("playerDesc");
var breathCircle = document.getElementById("breathCircle");
var breathLabel  = document.getElementById("breathLabel");
var breathStepText = document.getElementById("breathStepText");

// ── ACTIVE EXERCISE STATE ────────────────────────────────────
var currentExercise = null;
var intervalId      = null;
var stepIndex       = 0;
var secondsLeft     = 0;

// ── RENDER EXERCISE CARDS ────────────────────────────────────
function renderExercises() {
  exContainer.innerHTML = "";

  // Using .forEach() HOF
  exercises.forEach(function(ex) {
    var card = document.createElement("article");
    card.classList.add("feature-card");

    card.innerHTML =
      '<div class="card-icon card-icon--blue" style="font-size:1.5rem">' + ex.icon + '</div>' +
      '<h3 class="card-title">' + ex.name + '</h3>' +
      '<p class="card-desc">' + ex.desc + '</p>' +
      '<button class="btn btn-primary" style="margin-top:0.5rem" onclick="openExercise(' + ex.id + ')">▶ Start</button>';

    exContainer.appendChild(card);
  });
}

// ── OPEN AN EXERCISE ─────────────────────────────────────────
function openExercise(id) {
  currentExercise = exercises[id];

  playerTitle.textContent = currentExercise.name;
  playerDesc.textContent  = currentExercise.desc;
  breathLabel.textContent = "Press Start";
  breathStepText.textContent = "";

  // Remove animation classes
  breathCircle.classList.remove("circle-expand", "circle-hold", "circle-shrink");

  // Show the player section
  playerSection.classList.remove("hidden");

  // Scroll down to the player
  playerSection.scrollIntoView({ behavior: "smooth" });

  // Stop any running exercise first
  stopExercise();
}

// ── START EXERCISE ───────────────────────────────────────────
function startExercise() {
  if (!currentExercise) return;

  stepIndex   = 0;
  secondsLeft = currentExercise.steps[0].duration;

  runStep();
}

// ── RUN ONE STEP ─────────────────────────────────────────────
function runStep() {
  var step = currentExercise.steps[stepIndex];

  // Update text
  breathLabel.textContent    = step.label;
  breathStepText.textContent = step.duration + " seconds";

  // Update animation on circle
  breathCircle.classList.remove("circle-expand", "circle-hold", "circle-shrink");

  if (step.label === "Breathe In") {
    breathCircle.classList.add("circle-expand");
  } else if (step.label === "Hold") {
    breathCircle.classList.add("circle-hold");
  } else {
    breathCircle.classList.add("circle-shrink");
  }

  secondsLeft = step.duration;

  // Count down every second
  intervalId = setInterval(function() {
    secondsLeft = secondsLeft - 1;
    breathStepText.textContent = secondsLeft + " seconds";

    if (secondsLeft <= 0) {
      clearInterval(intervalId);

      // Move to next step
      stepIndex = stepIndex + 1;

      if (stepIndex >= currentExercise.steps.length) {
        // All steps done — loop back to beginning
        stepIndex = 0;
      }

      runStep();
    }
  }, 1000);
}

// ── STOP EXERCISE ────────────────────────────────────────────
function stopExercise() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  breathLabel.textContent    = "Press Start";
  breathStepText.textContent = "";
  breathCircle.classList.remove("circle-expand", "circle-hold", "circle-shrink");
}

// ── START ────────────────────────────────────────────────────
renderExercises();