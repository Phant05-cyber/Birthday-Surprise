const screens = document.querySelectorAll(".screen");
const progressDots = document.querySelectorAll(".progress-dot");

function showStep(stepNumber) {
  screens.forEach((screen) => screen.classList.remove("active"));
  document.getElementById(`step${stepNumber}`).classList.add("active");

  progressDots.forEach((dot, index) => {
    dot.classList.toggle("active-dot", index === stepNumber - 1);
  });
}

// STEP 1: Open the envelope
const envelopeButton = document.getElementById("openEnvelope");
envelopeButton.addEventListener("click", () => {
  const envelope = document.querySelector(".envelope");
  envelope.classList.add("open");

  // Wait for the envelope animation before changing the screen.
  setTimeout(() => showStep(2), 750);
});

// STEP 2: Go to the wish page
document.getElementById("toWish").addEventListener("click", () => {
  showStep(3);
});

// STEP 3: Save the wish and celebrate
const wishForm = document.getElementById("wishForm");
wishForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const wish = document.getElementById("wishInput").value.trim();

  if (wish === "") {
    alert("Please write your wish first.");
    return;
  }

  document.getElementById("wishResult").textContent = `Your wish: “${wish}”`;
  showStep(4);
  startFireworks();
});

// STEP 4: Replay
document.getElementById("restart").addEventListener("click", () => {
  document.querySelector(".envelope").classList.remove("open");
  document.getElementById("wishInput").value = "";
  document.getElementById("wishResult").textContent = "";
  stopFireworks();
  showStep(1);
});

// Simple fireworks animation using Canvas
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.55;
  const colors = ["#f4a7c1", "#f7d58b", "#a8d8ea", "#d5b5f5", "#ffffff"];

  for (let i = 0; i < 55; i++) {
    const angle = (Math.PI * 2 * i) / 55;
    const speed = Math.random() * 3 + 1;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateFireworks() {
  ctx.fillStyle = "rgba(9, 10, 18, 0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.045) createFirework();

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.015;
    particle.life -= 0.009;

    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  particles = particles.filter((particle) => particle.life > 0);

  animationId = requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  resizeCanvas();
  particles = [];
  if (animationId === null) animateFireworks();
}

function stopFireworks() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
