'use strict';

/* ================================================================
   PERSONAL LINKTREE — Retro 8-bit JS Engine
   Features: Boot, Canvas BG, Cursor, Sounds, Theme, Konami, etc.
================================================================ */

// ── Constants ─────────────────────────────────────────────────────
const KONAMI_SEQ = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];

const BOOT_LOGS = [
  'INITIALIZING SYSTEM...',
  'LOADING PIXEL ENGINE...',
  'MOUNTING RETRO ASSETS...',
  'CONNECTING TO SERVER...',
  'LOADING PLAYER DATA...',
  'CALIBRATING CRT...',
  'RENDERING SPRITES...',
  'BOOT COMPLETE. WELCOME!',
];

const TRACKS = [
  'Retro Vibes — Pixel Dreams',
  '8-Bit Hero — NES Classics',
  'Chiptune Odyssey — Vol.3',
  'Dungeon Synth — Dark Realms',
  'Arcade Memories — Coin Op',
  'GameBoy Sessions — Handheld',
];

// ── Audio Context (lazy) ──────────────────────────────────────────
let _audioCtx = null;

function getAudio() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

/**
 * Play a retro beep.
 * @param {number} freq   - Frequency in Hz
 * @param {number} dur    - Duration in seconds
 * @param {string} type   - OscillatorType
 * @param {number} vol    - Volume 0-1
 */
function beep(freq = 440, dur = 0.1, type = 'square', vol = 0.08) {
  try {
    const ctx = getAudio();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch (_) { /* Audio unavailable */ }
}

function sfxHover()    { beep(523, 0.04, 'square', 0.06); }
function sfxClick()    { beep(659, 0.05, 'square', 0.08); setTimeout(() => beep(880, 0.07, 'square', 0.08), 55); }
function sfxTheme()    { beep(330, 0.05, 'square', 0.07); setTimeout(() => beep(494, 0.05, 'square', 0.07), 60); setTimeout(() => beep(659, 0.1, 'square', 0.07), 120); }
function sfxAchieve()  {
  [262, 330, 392, 523, 659].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'square', 0.1), i * 80));
}
function sfxBoot()     { beep(220, 0.08, 'square', 0.1); setTimeout(() => beep(440, 0.15, 'square', 0.08), 100); }
function sfxKonami()   {
  [220,247,262,294,330,370,415,440,494,523].forEach((f,i) => setTimeout(() => beep(f, 0.13, 'square', 0.1), i * 110));
}

// ── Boot Sequence ─────────────────────────────────────────────────
function runBoot() {
  const screen   = document.getElementById('bootScreen');
  const bar      = document.getElementById('bootProgress');
  const pct      = document.getElementById('bootPct');
  const log      = document.getElementById('bootLog');
  if (!screen) return;

  let progress  = 0;
  let logIdx    = 0;

  setTimeout(sfxBoot, 150);

  const interval = setInterval(() => {
    const step = Math.random() * 7 + 2;
    progress = Math.min(progress + step, 100);

    if (bar)  bar.style.width  = progress + '%';
    if (pct)  pct.textContent  = Math.floor(progress) + '%';

    // Cycle boot log messages
    const newIdx = Math.floor((progress / 100) * BOOT_LOGS.length);
    if (newIdx > logIdx && logIdx < BOOT_LOGS.length - 1) {
      logIdx = newIdx;
      if (log) log.textContent = BOOT_LOGS[Math.min(logIdx, BOOT_LOGS.length - 1)];
      beep(200 + logIdx * 30, 0.03, 'square', 0.04);
    }

    if (progress >= 100) {
      clearInterval(interval);
      if (log) log.textContent = BOOT_LOGS[BOOT_LOGS.length - 1];
      setTimeout(() => {
        sfxClick();
        screen.classList.add('hidden');
        setTimeout(() => {
          screen.style.display = 'none';
          animateStatBars();
          // Welcome achievement
          setTimeout(() => showAchievement('NEW VISITOR', 'Profile loaded successfully!'), 800);
        }, 650);
      }, 400);
    }
  }, 75);
}

// ── Theme Toggle ──────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('retro-theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const svg = document.getElementById('themeIcon');
  if (!svg) return;

  if (theme === 'dark') {
    // Sun icon (click to go light)
    svg.innerHTML = `
      <rect x="7" y="1" width="2" height="2" fill="currentColor"/>
      <rect x="7" y="13" width="2" height="2" fill="currentColor"/>
      <rect x="1" y="7" width="2" height="2" fill="currentColor"/>
      <rect x="13" y="7" width="2" height="2" fill="currentColor"/>
      <rect x="3" y="3" width="2" height="2" fill="currentColor"/>
      <rect x="11" y="3" width="2" height="2" fill="currentColor"/>
      <rect x="3" y="11" width="2" height="2" fill="currentColor"/>
      <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
      <rect x="5" y="5" width="6" height="6" fill="currentColor"/>
      <rect x="4" y="6" width="8" height="4" fill="currentColor"/>
      <rect x="6" y="4" width="4" height="8" fill="currentColor"/>
    `;
  } else {
    // Moon icon (click to go dark)
    svg.innerHTML = `
      <rect x="8"  y="1" width="4" height="2" fill="currentColor"/>
      <rect x="6"  y="2" width="6" height="1" fill="currentColor"/>
      <rect x="4"  y="3" width="4" height="9" fill="currentColor"/>
      <rect x="5"  y="3" width="7" height="2" fill="currentColor"/>
      <rect x="5"  y="11" width="7" height="2" fill="currentColor"/>
      <rect x="8"  y="12" width="5" height="1" fill="currentColor"/>
      <rect x="10" y="4" width="3" height="7" fill="currentColor"/>
    `;
  }
}

document.getElementById('themeToggle')?.addEventListener('click', () => {
  sfxTheme();
  const cur  = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('retro-theme', next);
});

// ── Background Canvas ─────────────────────────────────────────────
function initBackground() {
  const canvas = document.getElementById('pixel-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Stars
  const stars = Array.from({ length: 120 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    size:  Math.ceil(Math.random() * 2),
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.012 + 0.004,
  }));

  // Shooting stars
  const shooters = [];

  function spawnShooter() {
    if (shooters.length < 4 && document.documentElement.getAttribute('data-theme') !== 'light') {
      shooters.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.random() * 5 + 4,
        vy: Math.random() * 3 + 1,
        len: Math.random() * 70 + 40,
        alpha: 1,
      });
    }
  }

  setInterval(spawnShooter, 2500);

  // Pixel rain columns (Matrix-style, dark mode only)
  const COLS = Math.floor(window.innerWidth / 14);
  const cols = Array.from({ length: COLS }, () => ({
    y:     Math.random() * -500,
    speed: Math.random() * 1.5 + 0.5,
    char:  String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
  }));

  let frame = 0;

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frame++;

    if (isDark) {
      // === DARK MODE: Stars + pixel rain columns ===

      // Stars
      stars.forEach(s => {
        s.phase += s.speed;
        const a = (Math.sin(s.phase) + 1) / 2 * 0.8;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      });

      // Pixel rain (sparse)
      if (frame % 6 === 0) {
        ctx.font = '10px monospace';
        cols.forEach((col, i) => {
          if (Math.random() > 0.98) {
            col.char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
          }
          const alpha = Math.random() * 0.08 + 0.02;
          ctx.fillStyle = `rgba(0,255,157,${alpha})`;
          ctx.fillText(col.char, i * 14, col.y);
          col.y += col.speed;
          if (col.y > canvas.height) {
            col.y = Math.random() * -200;
            col.speed = Math.random() * 1.5 + 0.5;
          }
        });
      }

      // Shooting stars
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y + s.len * 0.4);
        ctx.stroke();
        // Trail pixels
        ctx.fillStyle = '#00ff9d';
        for (let t = 0; t < s.len; t += 5) {
          ctx.globalAlpha = s.alpha * (1 - t / s.len) * 0.4;
          ctx.fillRect(Math.floor(s.x + t), Math.floor(s.y + t * 0.4), 1, 1);
        }
        ctx.restore();

        s.x     += s.vx;
        s.y     += s.vy;
        s.alpha -= 0.015;

        if (s.alpha <= 0 || s.x > canvas.width) {
          shooters.splice(i, 1);
        }
      }

    } else {
      // === LIGHT MODE: Floating dust particles ===
      stars.forEach(s => {
        s.phase += s.speed * 0.5;
        const a = (Math.sin(s.phase) + 1) / 2 * 0.15;
        ctx.fillStyle = `rgba(139, 100, 50, ${a})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      });
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ── Custom Cursor ─────────────────────────────────────────────────
function initCursor() {
  if ('ontouchstart' in window) return; // Touch devices use default

  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  const body = cursor.querySelector('.cursor-body');

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx - 7}px, ${my - 7}px)`;
  });

  document.addEventListener('mousedown', () => body.style.transform = 'scale(0.75)');
  document.addEventListener('mouseup',   () => body.style.transform = '');

  // Cursor changes on interactive elements
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => body.classList.remove('hovered'));
  });
}

// ── Stat Bar Animation ────────────────────────────────────────────
function animateStatBars() {
  document.querySelectorAll('.stat-fill').forEach(fill => {
    const target = fill.style.width;
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = target;
      });
    });
  });
}

// ── Now Playing ───────────────────────────────────────────────────
function initNowPlaying() {
  const el = document.getElementById('npTrack');
  if (!el) return;

  let idx = Math.floor(Math.random() * TRACKS.length);

  function setTrack() {
    el.textContent = TRACKS[idx];
    idx = (idx + 1) % TRACKS.length;
    // Reset np bar
    const fill = document.getElementById('npFill');
    if (fill) {
      fill.style.animationDuration = (Math.random() * 20 + 20) + 's';
      fill.style.animation = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.animation = '';
        });
      });
    }
  }

  setTrack();
  setInterval(setTrack, 30000);
}

// ── Link Sound Effects ────────────────────────────────────────────
function initLinkSounds() {
  document.querySelectorAll('.link-item').forEach(link => {
    link.addEventListener('mouseenter', sfxHover);
    link.addEventListener('click', sfxClick);
  });
}

// ── Konami Code Easter Egg ────────────────────────────────────────
function initKonami() {
  let seq = [];

  document.addEventListener('keydown', e => {
    seq.push(e.key);
    seq = seq.slice(-KONAMI_SEQ.length);

    if (seq.join(',') === KONAMI_SEQ.join(',')) {
      sfxKonami();
      showAchievement('KONAMI CODE ACTIVATED', '↑↑↓↓←→←→BA  30 LIVES!');

      // Rainbow mode for a few seconds
      document.querySelector('.game-wrap')?.classList.add('rainbow-mode');
      setTimeout(() => {
        document.querySelector('.game-wrap')?.classList.remove('rainbow-mode');
      }, 3500);

      seq = [];
    }
  });
}

// ── Achievement Popup ─────────────────────────────────────────────
let achieveTimer = null;

function showAchievement(title, desc) {
  const popup    = document.getElementById('achievementPopup');
  const descEl   = document.getElementById('achievementDesc');
  const titleEl  = popup?.querySelector('.achievement-title');
  if (!popup) return;

  if (titleEl) titleEl.textContent = title.toUpperCase();
  if (descEl)  descEl.textContent  = desc;

  popup.classList.add('show');
  sfxAchieve();

  clearTimeout(achieveTimer);
  achieveTimer = setTimeout(() => popup.classList.remove('show'), 4500);
}

// ── Score Counter Tick ────────────────────────────────────────────
function initScore() {
  const el = document.getElementById('scoreVal');
  if (!el) return;

  let score = 9999999;

  setInterval(() => {
    score += Math.floor(Math.random() * 100);
    el.textContent = score.toLocaleString().replace(/,/g, ',');
  }, 3000);
}

// ── Pixel Avatar SVG ──────────────────────────────────────────────
function buildAvatar() {
  const el = document.getElementById('playerAvatar');
  if (!el) return;

  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 21"
         width="80" height="105"
         style="image-rendering:pixelated;display:block">
      <!-- Hair -->
      <rect x="4" y="0" width="8" height="1" fill="#3d1c0a"/>
      <rect x="3" y="1" width="10" height="2" fill="#3d1c0a"/>
      <rect x="2" y="2" width="1" height="2" fill="#3d1c0a"/>
      <rect x="13" y="2" width="1" height="2" fill="#3d1c0a"/>
      <!-- Face -->
      <rect x="3" y="3" width="10" height="6" fill="#ffc9a0"/>
      <!-- Brows -->
      <rect x="4" y="3" width="3" height="1" fill="#3d1c0a"/>
      <rect x="9" y="3" width="3" height="1" fill="#3d1c0a"/>
      <!-- Eyes -->
      <rect x="4" y="4" width="2" height="2" fill="#2d1a0e"/>
      <rect x="10" y="4" width="2" height="2" fill="#2d1a0e"/>
      <!-- Eye shine -->
      <rect x="5" y="4" width="1" height="1" fill="#ffffff"/>
      <rect x="11" y="4" width="1" height="1" fill="#ffffff"/>
      <!-- Nose -->
      <rect x="7" y="6" width="2" height="1" fill="#cc9070"/>
      <!-- Mouth -->
      <rect x="5" y="7" width="1" height="1" fill="#cc5533"/>
      <rect x="6" y="8" width="4" height="1" fill="#cc5533"/>
      <rect x="10" y="7" width="1" height="1" fill="#cc5533"/>
      <!-- Neck -->
      <rect x="6" y="9" width="4" height="1" fill="#ffc9a0"/>
      <!-- Shirt body -->
      <rect x="2" y="10" width="12" height="5" fill="#1e3a8a"/>
      <!-- Shirt collar -->
      <rect x="6" y="10" width="4" height="1" fill="#f0f0f0"/>
      <rect x="7" y="10" width="2" height="2" fill="#f0f0f0"/>
      <!-- Shirt shading -->
      <rect x="3" y="11" width="1" height="3" fill="#162d70"/>
      <rect x="12" y="11" width="1" height="3" fill="#162d70"/>
      <!-- Arms (skin) -->
      <rect x="0" y="10" width="2" height="5" fill="#ffc9a0"/>
      <rect x="14" y="10" width="2" height="5" fill="#ffc9a0"/>
      <!-- Hands -->
      <rect x="0" y="15" width="2" height="2" fill="#ffc9a0"/>
      <rect x="14" y="15" width="2" height="2" fill="#ffc9a0"/>
      <!-- Belt -->
      <rect x="2" y="15" width="12" height="1" fill="#4a3728"/>
      <rect x="7" y="15" width="2" height="1" fill="#ffd700"/>
      <!-- Pants -->
      <rect x="2" y="16" width="5" height="4" fill="#1a3060"/>
      <rect x="9" y="16" width="5" height="4" fill="#1a3060"/>
      <rect x="7" y="16" width="2" height="3" fill="#0a0a18"/>
      <!-- Shoes -->
      <rect x="1" y="20" width="6" height="1" fill="#1a1a1a"/>
      <rect x="9" y="20" width="6" height="1" fill="#1a1a1a"/>
    </svg>
  `;
}

// ── Badge hover sfx ───────────────────────────────────────────────
function initBadgeSounds() {
  document.querySelectorAll('.badge-item').forEach(b => {
    b.addEventListener('mouseenter', () => beep(660, 0.03, 'square', 0.05));
  });
}

// ══════════════════════════════════════════════════════════════════
//  PERSONA FINDER
// ══════════════════════════════════════════════════════════════════

// ── Pixel art SVG icons per hobby class ───────────────────────────
const HOBBY_ICONS = {
  gaming: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="2" y="6" width="9" height="12" fill="#7289da"/>
    <rect x="13" y="6" width="9" height="12" fill="#7289da"/>
    <rect x="11" y="9" width="2" height="6" fill="#7289da"/>
    <rect x="4" y="11" width="5" height="2" fill="#fff"/>
    <rect x="6" y="9" width="1" height="6" fill="#fff"/>
    <rect x="15" y="9" width="2" height="2" fill="#ff007f"/>
    <rect x="19" y="11" width="2" height="2" fill="#00ff9d"/>
    <rect x="17" y="13" width="2" height="2" fill="#ffd700"/>
  </svg>`,
  coding: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="2" y="3" width="20" height="14" fill="#0a0a18"/>
    <rect x="3" y="4" width="18" height="12" fill="#0d0d2a"/>
    <rect x="4" y="6" width="1" height="1" fill="#00ff9d"/>
    <rect x="5" y="7" width="1" height="1" fill="#00ff9d"/>
    <rect x="6" y="8" width="1" height="1" fill="#00ff9d"/>
    <rect x="5" y="9" width="1" height="1" fill="#00ff9d"/>
    <rect x="4" y="10" width="1" height="1" fill="#00ff9d"/>
    <rect x="10" y="6" width="1" height="1" fill="#00ff9d"/>
    <rect x="11" y="7" width="1" height="1" fill="#00ff9d"/>
    <rect x="10" y="8" width="1" height="1" fill="#00ff9d"/>
    <rect x="14" y="6" width="6" height="1" fill="#ff007f"/>
    <rect x="14" y="8" width="4" height="1" fill="#ffd700"/>
    <rect x="14" y="10" width="5" height="1" fill="#00b4ff"/>
    <rect x="4" y="17" width="8" height="2" fill="#00ff9d"/>
    <rect x="8" y="15" width="8" height="2" fill="#00ff9d"/>
  </svg>`,
  music: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="12" y="2" width="1" height="12" fill="#ff007f"/>
    <rect x="13" y="2" width="7" height="4" fill="#ff007f"/>
    <rect x="8" y="13" width="6" height="4" fill="#ff007f"/>
    <rect x="6" y="15" width="4" height="4" fill="#ff007f"/>
    <rect x="18" y="8" width="4" height="4" fill="#ff007f"/>
    <rect x="20" y="6" width="2" height="4" fill="#ff007f"/>
  </svg>`,
  art: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="4" y="4" width="16" height="14" fill="#2a1a0a" rx="0"/>
    <rect x="5" y="5" width="14" height="12" fill="#f5e6c8"/>
    <rect x="7" y="7" width="3" height="3" fill="#ff3344"/>
    <rect x="12" y="7" width="3" height="3" fill="#1a6b1a"/>
    <rect x="7" y="12" width="3" height="3" fill="#1a4f8a"/>
    <rect x="12" y="12" width="3" height="3" fill="#ffd700"/>
    <rect x="10" y="10" width="4" height="2" fill="#b060ff"/>
    <rect x="9" y="18" width="6" height="2" fill="#4a3728"/>
    <rect x="7" y="20" width="10" height="1" fill="#4a3728"/>
  </svg>`,
  sports: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="10" y="1" width="4" height="3" fill="#ffd700"/>
    <rect x="8" y="4" width="8" height="2" fill="#ffd700"/>
    <rect x="9" y="7" width="2" height="4" fill="#ffd700"/>
    <rect x="13" y="7" width="2" height="4" fill="#ffd700"/>
    <rect x="7" y="6" width="2" height="6" fill="#ffd700"/>
    <rect x="15" y="6" width="2" height="6" fill="#ffd700"/>
    <rect x="9" y="11" width="6" height="3" fill="#ffd700"/>
    <rect x="8" y="14" width="3" height="6" fill="#ffd700"/>
    <rect x="13" y="14" width="3" height="6" fill="#ffd700"/>
    <rect x="6" y="20" width="5" height="2" fill="#ffd700"/>
    <rect x="13" y="20" width="5" height="2" fill="#ffd700"/>
  </svg>`,
  reading: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="4" y="4" width="8" height="16" fill="#8b4513"/>
    <rect x="5" y="5" width="7" height="14" fill="#f5e6c8"/>
    <rect x="6" y="7" width="5" height="1" fill="#8b4513"/>
    <rect x="6" y="9" width="5" height="1" fill="#8b4513"/>
    <rect x="6" y="11" width="5" height="1" fill="#8b4513"/>
    <rect x="6" y="13" width="3" height="1" fill="#8b4513"/>
    <rect x="12" y="4" width="8" height="16" fill="#6b3200"/>
    <rect x="13" y="5" width="7" height="14" fill="#fff8e7"/>
    <rect x="14" y="7" width="5" height="1" fill="#6b3200"/>
    <rect x="14" y="9" width="5" height="1" fill="#6b3200"/>
    <rect x="14" y="11" width="5" height="1" fill="#6b3200"/>
    <rect x="14" y="13" width="3" height="1" fill="#6b3200"/>
    <rect x="11" y="3" width="2" height="18" fill="#2d1800"/>
  </svg>`,
  cooking: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="4" y="10" width="16" height="8" fill="#8b4513"/>
    <rect x="5" y="11" width="14" height="6" fill="#c8762a"/>
    <rect x="6" y="12" width="12" height="4" fill="#ff8c00"/>
    <rect x="8" y="8" width="2" height="4" fill="#ff4400"/>
    <rect x="7" y="6" width="2" height="2" fill="#ff4400"/>
    <rect x="11" y="7" width="2" height="3" fill="#ff6600"/>
    <rect x="10" y="5" width="2" height="2" fill="#ffd700"/>
    <rect x="14" y="8" width="2" height="2" fill="#ff4400"/>
    <rect x="2" y="9" width="3" height="2" fill="#666"/>
    <rect x="19" y="9" width="3" height="2" fill="#666"/>
  </svg>`,
  travel: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="2" y="10" width="20" height="10" fill="#1a4f8a"/>
    <rect x="3" y="11" width="18" height="8" fill="#00b4ff" opacity="0.5"/>
    <rect x="6" y="4" width="12" height="8" fill="#00b4ff"/>
    <rect x="7" y="5" width="10" height="6" fill="#87ceeb"/>
    <rect x="9" y="7" width="6" height="2" fill="#fff"/>
    <rect x="11" y="1" width="2" height="4" fill="#ff3344"/>
    <rect x="11" y="2" width="3" height="2" fill="#ff3344"/>
  </svg>`,
  photography: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="2" y="7" width="20" height="14" fill="#333"/>
    <rect x="3" y="8" width="18" height="12" fill="#444"/>
    <rect x="8" y="5" width="8" height="4" fill="#333"/>
    <rect x="9" y="10" width="6" height="6" fill="#888"/>
    <rect x="10" y="11" width="4" height="4" fill="#aaa"/>
    <rect x="11" y="12" width="2" height="2" fill="#fff"/>
    <rect x="17" y="9" width="3" height="2" fill="#ffd700"/>
    <rect x="4" y="9" width="3" height="2" fill="#ff3344"/>
  </svg>`,
  writing: `<svg viewBox="0 0 24 24" width="40" height="40" style="image-rendering:pixelated">
    <rect x="4" y="3" width="14" height="18" fill="#f5e6c8"/>
    <rect x="3" y="4" width="14" height="18" fill="#fff8e7"/>
    <rect x="5" y="6" width="10" height="1" fill="#8b4513"/>
    <rect x="5" y="8" width="10" height="1" fill="#8b4513"/>
    <rect x="5" y="10" width="10" height="1" fill="#8b4513"/>
    <rect x="5" y="12" width="7" height="1" fill="#8b4513"/>
    <rect x="16" y="14" width="2" height="8" fill="#4a3728" style="transform:rotate(-45deg);transform-origin:16px 14px"/>
    <rect x="17" y="3" width="2" height="12" fill="#4a3728"/>
    <rect x="16" y="4" width="4" height="2" fill="#ffd700"/>
    <rect x="17" y="15" width="2" height="5" fill="#ff3344"/>
  </svg>`,
};

// ── Persona data matrix: 10 hobbies × 3 tiers ─────────────────────
const PERSONA_DB = {
  gaming: {
    label: 'GAMER', color: '#7289da',
    tiers: [
      { title: 'The Dungeon Explorer', desc: 'You methodically conquer every challenge. Patient and precise — obstacles are just puzzles waiting to be solved by your hand.', stats: { STR:75, INT:80, DEX:90, WIS:65 } },
      { title: 'The Speed Runner',     desc: 'Efficiency is your supreme art form. You find the fastest path through any labyrinth that life dares to throw at you.', stats: { STR:70, INT:85, DEX:99, WIS:72 } },
      { title: 'The Legendary Gamer', desc: 'You have mastered the grand game of existence itself. Your name is spoken in hushed and reverent tones across the realm.', stats: { STR:90, INT:90, DEX:96, WIS:85 } },
    ]
  },
  coding: {
    label: 'DEVELOPER', color: '#00ff9d',
    tiers: [
      { title: 'The Bug Whisperer',  desc: 'Machines speak to you in their native tongue. You debug reality itself with cold, methodical precision that others envy.', stats: { STR:60, INT:99, DEX:70, WIS:80 } },
      { title: 'The Tech Innovator', desc: 'You build tomorrow one line at a time. Every commit you push quietly reshapes the digital landscape of the future.', stats: { STR:65, INT:95, DEX:75, WIS:88 } },
      { title: 'The Code Wizard',    desc: 'Ancient algorithms bow before you. You see the matrix that underlies all existence and rewrite it at will.', stats: { STR:70, INT:99, DEX:80, WIS:95 } },
    ]
  },
  music: {
    label: 'MUSICIAN', color: '#ff007f',
    tiers: [
      { title: 'The Melody Maker', desc: 'You weave raw emotion into living sound. Every note you craft carries a story that words alone could never tell.', stats: { STR:65, INT:80, DEX:88, WIS:90 } },
      { title: 'The Beat Maestro', desc: 'Rhythm flows through your very bloodstream. You make the universe itself sway and dance to the tempo you create.', stats: { STR:70, INT:78, DEX:93, WIS:87 } },
      { title: 'The Rock Legend',  desc: 'You were born under a musical constellation. Music is not something you play — it is something you channel from beyond.', stats: { STR:92, INT:77, DEX:90, WIS:82 } },
    ]
  },
  art: {
    label: 'ARTIST', color: '#ff8c42',
    tiers: [
      { title: 'The Creative Soul', desc: 'You perceive beauty in what others blindly overlook. Your boundless imagination births entire worlds from pure nothing.', stats: { STR:58, INT:85, DEX:80, WIS:96 } },
      { title: 'The Visual Poet',  desc: 'Each brushstroke carries meaning only you fully understand. You translate the invisible into breathtaking visible form.', stats: { STR:60, INT:88, DEX:86, WIS:93 } },
      { title: 'The Pixel Artisan',desc: 'You craft entire universes from imagination alone. Every pixel you lay down carries the weight of divine intention.', stats: { STR:62, INT:92, DEX:96, WIS:90 } },
    ]
  },
  sports: {
    label: 'ATHLETE', color: '#ff3344',
    tiers: [
      { title: 'The Iron Will',       desc: 'Pain is simply your most dedicated training companion. Every setback in life tempers you further — like steel in fire.', stats: { STR:96, INT:68, DEX:85, WIS:80 } },
      { title: 'The Champion',         desc: 'Victory already knows you by name. Your relentless and burning dedication has inspired all who have witnessed it.', stats: { STR:98, INT:72, DEX:91, WIS:82 } },
      { title: 'The Athletic Legend', desc: 'You defy the known limits of human performance. Records crumble like ancient ruins before your determined footsteps.', stats: { STR:99, INT:76, DEX:97, WIS:86 } },
    ]
  },
  reading: {
    label: 'SCHOLAR', color: '#ffd700',
    tiers: [
      { title: 'The Knowledge Seeker', desc: 'Every book opens yet another door for your hungry mind. You accumulate understanding the way rivers accumulate water.', stats: { STR:55, INT:92, DEX:62, WIS:95 } },
      { title: 'The Wise Scholar',     desc: 'You carry the weight of accumulated ages. Others seek your wise counsel when the winding road grows dangerously dark.', stats: { STR:58, INT:96, DEX:65, WIS:99 } },
      { title: 'The Grand Sage',       desc: 'Ancient tomes yield their deepest and most guarded secrets to you alone. History itself has been your greatest teacher.', stats: { STR:60, INT:99, DEX:68, WIS:99 } },
    ]
  },
  cooking: {
    label: 'ALCHEMIST', color: '#e05c00',
    tiers: [
      { title: 'The Kitchen Alchemist', desc: 'You transmute the raw and ordinary into pure and lasting joy. Every meal you prepare is a small miracle of living chemistry.', stats: { STR:70, INT:88, DEX:92, WIS:85 } },
      { title: 'The Flavor Maestro',    desc: 'Taste itself serves as your boundless canvas. Your inspired creations unite strangers and turn them into beloved family.', stats: { STR:72, INT:90, DEX:94, WIS:88 } },
      { title: 'The Gourmet Legend',   desc: 'You have unlocked the final secret hiding within the nature of flavor. Even the divine reportedly weep at your inspired cuisine.', stats: { STR:75, INT:92, DEX:96, WIS:91 } },
    ]
  },
  travel: {
    label: 'EXPLORER', color: '#00b4ff',
    tiers: [
      { title: 'The Wanderer',         desc: 'Every horizon that appears calls out your true name. You discover the meaning of home precisely in the most unfamiliar.', stats: { STR:82, INT:84, DEX:88, WIS:91 } },
      { title: 'The World Explorer',  desc: 'You collect lived experiences, never mere possessions. Each journey taken illuminates yet another hidden facet of your soul.', stats: { STR:85, INT:87, DEX:91, WIS:93 } },
      { title: 'The Cosmic Traveler', desc: 'The entire world has grown too small for your expanding spirit. You explore not just places — but entirely new states of being.', stats: { STR:88, INT:90, DEX:93, WIS:97 } },
    ]
  },
  photography: {
    label: 'VISIONARY', color: '#a8ff3e',
    tiers: [
      { title: 'The Eye of Truth',     desc: 'You capture fleeting moments that all others simply let slip through their fingers like water through open hands.', stats: { STR:62, INT:82, DEX:88, WIS:93 } },
      { title: 'The Frame Architect',  desc: 'Reality itself becomes your chosen canvas. Through your perceptive lens, the utterly ordinary transforms into the extraordinary.', stats: { STR:64, INT:86, DEX:91, WIS:95 } },
      { title: 'The Immortal Witness', desc: 'You freeze time itself in its tracks. Your photographs will outlast empires and speak across the vast gulf of centuries.', stats: { STR:66, INT:90, DEX:94, WIS:98 } },
    ]
  },
  writing: {
    label: 'STORYTELLER', color: '#d0a0ff',
    tiers: [
      { title: 'The Wordsmith',   desc: 'You craft and wield sentences like both weapons and shields in perfect measure. Language bends willingly to your growing mastery.', stats: { STR:60, INT:90, DEX:75, WIS:94 } },
      { title: 'The Chronicler', desc: 'You document the raw human experience with unflinching clarity and heartbreaking beauty that moves all who encounter your work.', stats: { STR:62, INT:93, DEX:77, WIS:97 } },
      { title: 'The Legend Maker',desc: 'Your stories become timeless myths and your myths solidify into enduring truth. You are quietly writing the very history of tomorrow.', stats: { STR:65, INT:97, DEX:80, WIS:99 } },
    ]
  },
};

// Rarity config based on tier + lucky number combo
const RARITY = [
  { gem: '◇', text: 'COMMON RANK',    color: '#8888aa' },
  { gem: '◆', text: 'UNCOMMON RANK',  color: '#00ff9d' },
  { gem: '◈', text: 'RARE RANK',      color: '#00b4ff' },
  { gem: '❖', text: 'EPIC RANK',      color: '#b060ff' },
  { gem: '★', text: 'LEGENDARY RANK', color: '#ffd700' },
];

// ── Helper: compute tier from lucky number ─────────────────────────
function getTier(num) {
  if (num <= 3) return 0;
  if (num <= 7) return 1;
  return 2;
}

// ── Helper: compute rarity index ──────────────────────────────────
function getRarity(num, tier) {
  const score = tier * 2 + Math.floor(num / 3);
  return Math.min(score, RARITY.length - 1);
}

// ── Initialize stepper ────────────────────────────────────────────
function initStepper() {
  const dec     = document.getElementById('pfDec');
  const inc     = document.getElementById('pfInc');
  const valEl   = document.getElementById('pfStepVal');
  const starsEl = document.getElementById('pfStepStars');
  const hidden  = document.getElementById('pfNum');
  if (!dec || !inc) return;

  let num = 7;

  function updateDisplay() {
    if (valEl)   valEl.textContent   = num;
    if (hidden)  hidden.value        = num;
    if (starsEl) starsEl.textContent = '★'.repeat(num) + '☆'.repeat(10 - num);
  }

  updateDisplay();

  dec.addEventListener('click', () => {
    if (num > 1) { num--; updateDisplay(); beep(330, 0.04, 'square', 0.06); }
  });

  inc.addEventListener('click', () => {
    if (num < 10) { num++; updateDisplay(); beep(440, 0.04, 'square', 0.06); }
  });
}

// ── Typewriter effect for result description ───────────────────────
function typewriter(el, text, speed = 22) {
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    }
  }
  tick();
}

// ── Build vertical stat bars ───────────────────────────────────────
function buildStatBars(container, stats, accentColor) {
  container.innerHTML = '';
  Object.entries(stats).forEach(([name, val]) => {
    const col = document.createElement('div');
    col.className = 'pf-stat-col';

    col.innerHTML = `
      <div class="pf-stat-name">${name}</div>
      <div class="pf-stat-bar-v">
        <div class="pf-stat-fill-v" data-target="${val}"
             style="background:${accentColor};box-shadow:0 0 8px ${accentColor};height:0%"></div>
      </div>
      <div class="pf-stat-val" style="color:${accentColor}">${val}</div>
    `;
    container.appendChild(col);
  });

  // Animate bars after short delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.pf-stat-fill-v').forEach(fill => {
        const target = fill.dataset.target;
        fill.style.height = target + '%';
      });
    });
  });
}

// ── Main Persona Finder logic ──────────────────────────────────────
function initPersonaFinder() {
  const revealBtn  = document.getElementById('pfRevealBtn');
  const retryBtn   = document.getElementById('pfRetryBtn');
  const pfForm     = document.getElementById('pfForm');
  const pfLoading  = document.getElementById('pfLoading');
  const pfResult   = document.getElementById('pfResult');
  const pfLoadFill = document.getElementById('pfLoadFill');

  if (!revealBtn) return;

  // ── Reveal button click ────────────────────────────────────────
  revealBtn.addEventListener('click', () => {
    const name  = (document.getElementById('pfName')?.value || '').trim() || 'TRAVELER';
    const hobby = document.getElementById('pfHobby')?.value;
    const num   = parseInt(document.getElementById('pfNum')?.value || '7', 10);

    if (!hobby) {
      // Shake effect if no hobby selected
      const select = document.querySelector('.pf-select-wrap');
      select?.classList.add('shake');
      beep(150, 0.2, 'square', 0.1);
      setTimeout(() => select?.classList.remove('shake'), 500);
      return;
    }

    // Play reveal sound
    beep(220, 0.06, 'square', 0.08);
    setTimeout(() => beep(330, 0.06, 'square', 0.08), 80);
    setTimeout(() => beep(440, 0.06, 'square', 0.08), 160);

    // Show loading state
    pfForm.hidden    = true;
    pfResult.hidden  = true;
    pfLoading.hidden = false;

    // Animate loading bar
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) { progress = 100; clearInterval(loadInterval); }
      if (pfLoadFill) pfLoadFill.style.width = progress + '%';
    }, 80);

    // After "consulting" show result
    setTimeout(() => {
      pfLoading.hidden = true;
      showPersonaResult(name, hobby, num);
    }, 1800);
  });

  // ── Retry button click ─────────────────────────────────────────
  retryBtn?.addEventListener('click', () => {
    beep(440, 0.05, 'square', 0.07);
    pfResult.hidden  = true;
    pfForm.hidden    = false;
    // Reset loading bar
    if (pfLoadFill) pfLoadFill.style.width = '0%';
    // Reset select
    const hobby = document.getElementById('pfHobby');
    if (hobby) hobby.value = '';
    // Reset name
    const nameEl = document.getElementById('pfName');
    if (nameEl) nameEl.value = '';
    // Reset number
    const numEl = document.getElementById('pfNum');
    const valEl = document.getElementById('pfStepVal');
    const starsEl = document.getElementById('pfStepStars');
    if (numEl)   numEl.value        = '7';
    if (valEl)   valEl.textContent  = '7';
    if (starsEl) starsEl.textContent = '★★★★★★★☆☆☆';
  });

  // ── Sound on input focus ───────────────────────────────────────
  document.getElementById('pfName')?.addEventListener('focus',  () => beep(440, 0.03, 'square', 0.05));
  document.getElementById('pfHobby')?.addEventListener('change', () => beep(550, 0.04, 'square', 0.06));

  initStepper();
}

// ── Render persona result ──────────────────────────────────────────
function showPersonaResult(name, hobby, num) {
  const pfResult     = document.getElementById('pfResult');
  const data         = PERSONA_DB[hobby];
  const tier         = getTier(num);
  const persona      = data.tiers[tier];
  const rarityIdx    = getRarity(num, tier);
  const rarity       = RARITY[rarityIdx];

  // Populate name & greeting
  const pnameEl = document.getElementById('pfResultPName');
  if (pnameEl) pnameEl.textContent = name.toUpperCase();

  // Title with color
  const titleEl = document.getElementById('pfResultTitle');
  if (titleEl) {
    titleEl.textContent = persona.title.toUpperCase();
    titleEl.style.color = data.color;
    titleEl.style.textShadow = `0 0 8px ${data.color}, 0 0 16px ${data.color}40`;
  }

  // Typewriter description
  const descEl = document.getElementById('pfResultDesc');
  if (descEl) typewriter(descEl, persona.desc, 18);

  // Class badge
  const classEl = document.getElementById('pfResultClass');
  if (classEl) {
    classEl.textContent      = data.label;
    classEl.style.color      = data.color;
    classEl.style.borderColor = data.color;
  }

  // Icon
  const iconEl = document.getElementById('pfResultIcon');
  if (iconEl) {
    iconEl.innerHTML = HOBBY_ICONS[hobby] || '';
    iconEl.style.borderColor = data.color;
    iconEl.style.boxShadow   = `0 0 8px ${data.color}60`;
  }

  // Stat bars
  const statsEl = document.getElementById('pfResultStats');
  if (statsEl) buildStatBars(statsEl, persona.stats, data.color);

  // Rarity
  const gemEl = document.getElementById('pfRarityGem');
  const rarityTextEl = document.getElementById('pfRarityText');
  const rarityWrap = document.getElementById('pfResultRarity');
  if (gemEl) { gemEl.textContent = rarity.gem; gemEl.style.color = rarity.color; }
  if (rarityTextEl) { rarityTextEl.textContent = rarity.text; rarityTextEl.style.color = rarity.color; }
  if (rarityWrap) rarityWrap.style.borderColor = rarity.color;

  // Also update result card border
  const cardEl = document.getElementById('pfResultCard');
  if (cardEl) cardEl.style.borderColor = data.color;

  // Show result
  pfResult.hidden = false;

  // Achievement for legendary rank
  if (rarityIdx >= 4) {
    setTimeout(() => showAchievement('LEGENDARY PERSONA', `You are ${persona.title}!`), 600);
  }

  // Reveal fanfare
  [262, 330, 392, 523, 659, 784].forEach((f, i) =>
    setTimeout(() => beep(f, 0.15, 'square', 0.09), i * 70)
  );
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  buildAvatar();
  initBackground();
  initCursor();
  initLinkSounds();
  initBadgeSounds();
  initKonami();
  initScore();
  initNowPlaying();
  initPersonaFinder();
  runBoot();
});

