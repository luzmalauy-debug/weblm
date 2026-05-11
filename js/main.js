const TOTAL_FRAMES = 247;

const canvas      = document.getElementById('videoCanvas');
const ctx         = canvas.getContext('2d');
const loader      = document.getElementById('loader');
const loaderBar   = document.getElementById('loaderBar');
const loaderPct   = document.getElementById('loaderPct');
const navbar      = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const scrollHint  = document.getElementById('scrollHint');
const spacer      = document.querySelector('.page-spacer');
const sceneDots   = document.querySelectorAll('.scene-dot');
const sceneEls    = [
  document.getElementById('scene1'),
  document.getElementById('scene2'),
  document.getElementById('scene3'),
  document.getElementById('scene4'),
  document.getElementById('scene5'),
];

const frames = new Array(TOTAL_FRAMES).fill(null);
let loadedCount  = 0;
let currentFrame = 0;
let rafPending   = false;
let allLoaded    = false;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(currentFrame);
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

function drawFrame(idx) {
  const img = frames[idx];
  if (!img || !img.complete || !img.naturalWidth) return;
  const cw = canvas.width, ch = canvas.height;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const w = iw * scale, h = ih * scale;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

function preloadFrames() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `frames/frame_${String(i).padStart(4, '0')}.jpg`;
    img.decoding = 'async';
    img.onload = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      loaderBar.style.width = pct + '%';
      loaderPct.textContent = pct + '%';
      if (i === 1) drawFrame(0);
      if (loadedCount === TOTAL_FRAMES) onAllLoaded();
    };
    frames[i - 1] = img;
  }
}

function onAllLoaded() {
  allLoaded = true;
  loader.classList.add('hidden');
  drawFrame(0);
  onScroll();
}

// Progress 0→1 as user scrolls through the full spacer (one video playthrough)
function getVideoProgress() {
  const scrollable = spacer.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.max(0, Math.min(1, window.scrollY / scrollable));
}

// Switch scene based on progress: 5 equal segments of 20% each
function updateScenes(p) {
  const idx = Math.min(4, Math.floor(p * 5));
  sceneEls.forEach((el, i) => el.classList.toggle('active', i === idx));
  sceneDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
}

function onScroll() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    if (!allLoaded) return;

    const p = getVideoProgress();
    const frameIdx = Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1);
    if (frameIdx !== currentFrame) {
      currentFrame = frameIdx;
      drawFrame(frameIdx);
    }

    progressBar.style.width = (p * 100) + '%';
    navbar.classList.toggle('solid', window.scrollY > 60);
    scrollHint.classList.toggle('hidden', window.scrollY > 80);
    updateScenes(p);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
preloadFrames();
