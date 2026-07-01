/* script.js — Nikhil Kumar Cloud Resume Portfolio */

/* ── 1. NAVBAR ── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveSection();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

/* ── 2. TERMINAL TYPEWRITER ── */
const typeTarget = document.getElementById('typeTarget');
const phrases = [
  'whoami',
  'Cloud & DevOps Engineer',
  'aws configure --profile nikhil',
  'terraform init && terraform apply',
  'git push origin main  # deploys to AWS ✓',
  'echo "Building the cloud, one service at a time."',
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingTimeout;

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typeTarget.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingTimeout = setTimeout(type, 500);
      return;
    }
  } else {
    typeTarget.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      typingTimeout = setTimeout(() => { isDeleting = true; type(); }, 1800);
      return;
    }
  }
  typingTimeout = setTimeout(type, isDeleting ? 35 : 70);
}
type();

/* ── 3. PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.001;
      this.hue = Math.random() < 0.4 ? 20 : 190; // orange or cyan
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const a = Math.max(0, this.life * 0.7);
      ctx.fillStyle = this.hue === 20
        ? `rgba(255,107,53,${a})`
        : `rgba(0,212,255,${a})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    const count = Math.floor((W * H) / 7000);
    particles = Array.from({ length: count }, () => new Particle());
  }
  buildParticles();

  // Connection lines
  function drawConnections() {
    const MAX_DIST = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,107,53,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }
  loop();

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    document.hidden ? cancelAnimationFrame(raf) : loop();
  });
})();

/* ── 4. SCROLL FADE-IN ── */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);

      // Trigger progress bars inside achievement cards
      entry.target.querySelectorAll('.ach-bar-fill').forEach(bar => {
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));

/* ── 5. ANIMATED COUNTERS ── */
const counterEls = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ── 6. VISITOR COUNTER ── */

const COUNTER_API =
  "https://y2sjbdf5v6slc5cz5wg537niuy0xhdjj.lambda-url.us-east-1.on.aws/";

async function fetchVisitorCount() {
  const counterElement = document.getElementById("visitorCount");
  const statusElement = document.getElementById("vcStatus");

  try {
    const response = await fetch(COUNTER_API);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    console.log("Visitor Counter Data:", data);
    // Lambda returns { "views": number }
    console.log("Response:", data);
console.log("Views:", data.views);
console.log("Type:", typeof data.views);

    counterElement.textContent = Number(data.views).toLocaleString();

    statusElement.textContent = "Live Visitor Counter";
    statusElement.style.color = "#00ff99";

  } catch (error) {
    console.error("Visitor Counter Error:", error);

    counterElement.textContent = "--";

    statusElement.textContent = "Unable to load visitor count";
    statusElement.style.color = "#ff6b6b";
  }
}

// Load counter when page opens
document.addEventListener("DOMContentLoaded", fetchVisitorCount);

/* ── 7. QR CODE PLACEHOLDER (dot-matrix) ── */
(function generateQR() {
  const grid = document.getElementById('qrGrid');
  if (!grid) return;
  // Pseudo-random stable QR-like pattern seeded from a string
  const seed = 'nikhilkumarcloud';
  function seededRand(i) {
    let h = 0;
    for (let j = 0; j < seed.length; j++) h = (Math.imul(31, h) + seed.charCodeAt(j)) | 0;
    h ^= i * 2654435761;
    h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 0xFFFFFFFF;
  }
  const size = 10;
  // Corner finder squares
  const corners = new Set();
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) corners.add(`${r},${c}`);
  for (let r = 0; r < 3; r++) for (let c = 7; c < 10; c++) corners.add(`${r},${c}`);
  for (let r = 7; r < 10; r++) for (let c = 0; c < 3; c++) corners.add(`${r},${c}`);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'qr-cell';
      const isCorner = corners.has(`${r},${c}`);
      const dark = isCorner || seededRand(r * size + c) > 0.5;
      cell.style.background = dark ? 'var(--text)' : 'transparent';
      grid.appendChild(cell);
    }
  }
})();

/* ── 8. SMOOTH ACTIVE LINK on load ── */
window.addEventListener('load', highlightActiveSection);

/* ── 9. DOWNLOAD FROM GOOGLE DRIVE ── */
async function downloadFileFromDrive(sharedLink, filename = 'download') {
  if (!sharedLink) return window.alert('No file link provided.');

  // Extract file ID from common Drive URL formats
  const idMatch = sharedLink.match(/\/d\/([a-zA-Z0-9_-]+)/) || sharedLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = idMatch ? idMatch[1] : null;
  if (!fileId) return window.open(sharedLink, '_blank');

  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error('Network response was not ok');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  } catch (err) {
    // If fetch is blocked by CORS or Drive returns an HTML confirmation page,
    // fall back to opening the Drive download URL in a new tab so user can confirm.
    window.open(downloadUrl, '_blank');
  }
}

const downloadBtn = document.getElementById('downloadResume');
if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const link = downloadBtn.dataset.driveLink;
    downloadFileFromDrive(link, 'Nikhil_Kumar_Resume.pdf');
  });
}
