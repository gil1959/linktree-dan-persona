## linkree dan persona

**Mata Kuliah** : Pemrograman Web  
**Jenis Proyek** : Website Personal (Linktree dan persona)  
**Bahasa Pemrograman** : JavaScript (Node.js), HTML, CSS

---

## DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)  
2. [Deskripsi Website](#2-deskripsi-website)  
3. [Teknologi yang Digunakan](#3-teknologi-yang-digunakan)  
4. [Struktur Direktori Proyek](#4-struktur-direktori-proyek)  
5. [Penjelasan Komponen Utama](#5-penjelasan-komponen-utama)  
6. [Fitur Linktree - Penjelasan Teknis](#6-fitur-linktree--penjelasan-teknis)  
7. [Fitur Persona Finder - Penjelasan Teknis](#7-fitur-persona-finder--penjelasan-teknis)  
8. [Cara Menjalankan Proyek](#8-cara-menjalankan-proyek)  
9. [Kesimpulan](#9-kesimpulan)  

---

## 1. Pendahuluan

### 1.1 Latar Belakang

Dalam era digital saat ini, kebutuhan untuk menyatukan berbagai tautan media sosial dan profesi ke dalam satu halaman web tunggal semakin tinggi. Platform seperti Linktree telah menjadi solusi umum, namun cenderung menghasilkan tampilan yang seragam dan kurang mencerminkan kepribadian pemiliknya.

Proyek ini hadir sebagai alternatif yang dibangun secara mandiri (*self-hosted*), dengan memadukan fungsi linktree yang praktis bersama estetika desain retro bergaya 8-bit yang autentik. Desain yang diusung terinspirasi dari antarmuka permainan video klasik era 1980-an hingga 1990-an, mencakup efek CRT, tipografi pixel, animasi sprite karakter, dan sistem statistik bergaya RPG.

## 2. Deskripsi Website

Website ini merupakan halaman *personal hub* yang berfungsi sebagai pusat navigasi menuju berbagai profil media sosial dan tautan penting milik pemilik. Secara visual, website ini meniru estetika terminal komputer dan konsol game jadul dengan sejumlah elemen khas:

**Elemen Visual Utama:**

- *CRT Overlay* - Lapisan transparan yang mensimulasikan efek layar tabung katoda (CRT), termasuk goresan horizontal (*scanlines*) dan efek vignette pada sudut layar.
- *Boot Screen* - Layar pemuatan bergaya inisialisasi sistem yang muncul saat halaman pertama kali dibuka.
- *Pixel Avatar* - Karakter sprite 8-bit yang dirender menggunakan elemen SVG dengan properti `image-rendering: pixelated`.
- *Stat Panel* - Panel statistik karakter bergaya RPG yang menampilkan HP, MP, XP, serta atribut STR/INT/DEX/WIS.
- *Ticker Tape* - Baris teks berjalan di bagian bawah layar, menyerupai papan tanda digital.
- *Now Playing* - Komponen simulasi pemutar musik bergaya retro.

**Fitur Interaktif:**

- Tombol *toggle* antara tema gelap (*Dark Mode*) dan tema terang (*Light Mode*).
- Efek suara sintetis berbasis Web Audio API yang diputar saat hover dan klik.
- *Konami Code Easter Egg* - kode rahasia yang mengaktifkan efek visual kejutan.
- Sistem notifikasi *achievement* bergaya game.
- Kanvas HTML5 dengan animasi latar belakang (*starfield*, pixel rain, shooting stars).
- *Persona Finder* - Fitur interaktif yang menganalisis input pengguna dan menghasilkan output berupa persona unik bergaya RPG.

---

## 3. Teknologi yang Digunakan

### 3.1 Node.js

Node.js adalah *runtime* JavaScript berbasis *engine* V8 dari Google yang memungkinkan JavaScript dijalankan di luar lingkungan browser, yaitu di sisi server. Dalam proyek ini, Node.js berperan sebagai fondasi platform server yang menjalankan proses aplikasi web.

**Versi yang digunakan:** Node.js v18 ke atas (direkomendasikan LTS).

### 3.2 Express.js

Express.js adalah *framework* web minimalis untuk Node.js yang menyederhanakan penanganan permintaan HTTP. Dalam proyek ini, Express.js digunakan untuk:

- Menyajikan (*serve*) file-file statis dari direktori `public/` kepada browser klien.
- Menangani permintaan `GET` pada rute `/` sehingga browser dapat mengakses `index.html`.
- Menentukan port server dan mencetak informasi *startup* ke konsol.

**Ketergantungan yang digunakan:** `express` versi `^4.18.2`.

### 3.3 HTML5

HTML5 digunakan sebagai tulang punggung struktur halaman web. Seluruh elemen antarmuka seperti header, panel karakter, daftar tautan, formulir Persona Finder, hingga overlay CRT dibangun menggunakan markup HTML5 semantik.

Penggunaan HTML5 yang spesifik dalam proyek ini meliputi:

- Elemen `<canvas>` untuk render animasi latar belakang berbasis piksel.
- Elemen `<svg>` *inline* untuk merender ikon dan karakter sprite dengan kualitas piksel yang dapat diskalakan.
- Atribut `aria-label`, `role`, dan `aria-live` untuk aksesibilitas (*accessibility*).
- Elemen formulir (`<input>`, `<select>`, `<button>`) pada fitur Persona Finder.

### 3.4 CSS3 (Vanilla)

CSS3 digunakan untuk seluruh aspek visual dan animasi tanpa utilitas pihak ketiga seperti Tailwind atau Bootstrap. Pendekatan ini memberikan kontrol penuh atas setiap detail desain.

Fitur CSS3 yang dimanfaatkan secara intensif:

| Fitur CSS | Kegunaan dalam Proyek |
|---|---|
| Custom Properties (`--var`) | Sistem token desain untuk warna, bayangan, dan tipografi |
| `@keyframes` | Menyusun 20+ animasi: glitch, float, scanline, boot, dll. |
| CSS Grid & Flexbox | Tata letak responsif dua kolom (panel karakter + panel tautan) |
| `image-rendering: pixelated` | Menjaga ketajaman sprite SVG pada skala berapapun |
| `clip-path` | Membentuk efek glitch pada teks nama |
| Pseudo-elements `::before/::after` | Lapisan overlay CRT, garis scan, dan aksen dekorasi |
| `[data-theme]` attribute selector | Mendukung sistem *dark/light mode* |
| `repeating-linear-gradient` | Menciptakan pola piksel dan garis scan |

### 3.5 JavaScript (ES6+, Vanilla)

JavaScript murni (*Vanilla JS*) tanpa *framework* digunakan untuk seluruh logika interaktif di sisi klien. Fitur ES6+ yang digunakan meliputi *arrow functions*, *template literals*, *destructuring*, `const`/`let`, *optional chaining* (`?.`), `Array.from`, `requestAnimationFrame`, dan *async patterns* berbasis `setTimeout`.

Modul fungsional yang diimplementasikan dalam `main.js`:

- Mesin boot dengan progress bar bertahap.
- Web Audio API untuk efek suara sintetis (gelombang kotak / *square wave*).
- Kanvas HTML5 untuk animasi latar belakang.
- Manajemen tema dengan penyimpanan di `localStorage`.
- Kursor piksel kustom berbasis posisi mouse.
- Deteksi Konami Code melalui event keyboard.
- Sistem achievement popup.
- Logika lengkap Persona Finder.

---

## 4. Struktur Direktori Proyek

```
personalinktree/
│
├── index.js                  # Server utama (Express.js)
├── package.json              # Konfigurasi proyek dan dependensi NPM
├── package-lock.json         # Snapshot versi dependensi yang terkunci
│
└── public/                   # Direktori file statis yang disajikan ke klien
    ├── index.html            # Halaman utama (struktur HTML)
    ├── css/
    │   └── style.css         # Sistem desain lengkap dan seluruh animasi
    └── js/
        └── main.js           # Mesin JavaScript interaktif
```

---

## 5. Penjelasan Komponen Utama

### 5.1 Server Utama - `index.js`

File ini merupakan titik masuk (*entry point*) aplikasi Node.js yang mendefinisikan dan menjalankan server web.

```javascript
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Melayani semua file dalam direktori public/ sebagai aset statis
app.use(express.static(path.join(__dirname, 'public')));

// Jalankan server pada port yang ditentukan
app.listen(PORT, () => {
  console.log(` ► Server running at http://localhost:${PORT}`);
});
```

**Penjelasan alur:**

1. Modul `express` dan `path` dimuat menggunakan `require`.
2. Middleware `express.static` dikonfigurasi untuk memetakan direktori `public/` sebagai akar (*root*) file statis. Artinya, permintaan ke `http://localhost:3000/` akan secara otomatis mengembalikan file `public/index.html`.
3. Server mulai mendengarkan koneksi pada port yang ditentukan oleh variabel lingkungan `PORT`, atau port `3000` sebagai nilai default.

### 5.2 Konfigurasi Proyek - `package.json`

```json
{
  "name": "personalinktree",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

Perintah `npm start` menjalankan `node index.js`. Untuk pengembangan aktif, perintah `npm run dev` menggunakan `nodemon` agar server otomatis *restart* saat ada perubahan file (memerlukan instalasi `nodemon` secara terpisah).

### 5.3 Sistem Token Desain - `style.css`

Sistem desain dibangun di atas CSS Custom Properties yang dideklarasikan pada selektor `:root`. Pendekatan ini memungkinkan seluruh halaman beralih tema hanya dengan mengganti nilai variabel pada atribut `data-theme`.

```css
:root {
  /* Palet Warna Utama */
  --bg-deep:      #05050f;
  --bg-card:      #0d0d1f;
  --accent-green: #00ff9d;
  --accent-pink:  #ff007f;
  --accent-blue:  #00b4ff;
  --accent-yellow:#ffd700;
  --accent-purple:#b060ff;

  /* Tipografi */
  --font-pixel: 'Press Start 2P', monospace;
  --font-retro: 'VT323', monospace;

  /* Bayangan cahaya (glow) per warna aksen */
  --glow-green:  0 0 6px #00ff9d, 0 0 12px rgba(0,255,157,0.4);
  --glow-pink:   0 0 6px #ff007f, 0 0 12px rgba(255,0,127,0.4);
}

[data-theme="light"] {
  --bg-deep:   #f5e6c8;
  --bg-card:   #ede0b8;
  --text-normal: #2d1a0e;
  /* ... dan seterusnya */
}
```

---

## 6. Fitur Linktree - Penjelasan Teknis

### 6.1 Boot Screen

Boot Screen adalah lapisan penuh yang menutupi seluruh konten halaman saat pertama kali dimuat. Implementasinya menggunakan elemen `<div>` dengan `position: fixed` dan `z-index` tinggi.

**Markup HTML:**

```html
<div class="boot-screen" id="bootScreen">
  <div class="boot-content">
    <div class="boot-title">■ SYSTEM BOOT ■</div>
    <div class="boot-bar-wrap">
      <div class="boot-bar">
        <div class="boot-progress" id="bootProgress"></div>
      </div>
      <div class="boot-pct" id="bootPct">0%</div>
    </div>
    <div class="boot-log" id="bootLog">INITIALIZING...</div>
  </div>
</div>
```

**Logika JavaScript (`runBoot`):**

Fungsi ini mensimulasikan proses booting dengan menginkrementasi variabel `progress` secara acak hingga mencapai 100, kemudian menyembunyikan layar boot dengan menambahkan kelas `hidden` yang memicu transisi CSS.

```javascript
function runBoot() {
  let progress = 0;
  let logIdx   = 0;

  const interval = setInterval(() => {
    // Kenaikan acak antara 2 hingga 9 persen per iterasi
    const step = Math.random() * 7 + 2;
    progress   = Math.min(progress + step, 100);

    // Perbarui lebar progress bar dan teks persentase
    bar.style.width  = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';

    // Ganti teks log saat ambang persentase baru terpenuhi
    const newIdx = Math.floor((progress / 100) * BOOT_LOGS.length);
    if (newIdx > logIdx) {
      logIdx = newIdx;
      log.textContent = BOOT_LOGS[logIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      // Sembunyikan boot screen setelah jeda singkat
      setTimeout(() => screen.classList.add('hidden'), 400);
    }
  }, 75); // Dieksekusi setiap 75 milidetik
}
```

### 6.2 Efek CRT Overlay

Efek CRT diimplementasikan murni menggunakan CSS tanpa gambar eksternal. Dua elemen `<div>` bertumpuk di atas konten utama dengan `pointer-events: none` agar tidak menghalangi interaksi.

```css
/* Garis-garis horizontal (scanlines) */
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.15) 3px,
    rgba(0, 0, 0, 0.15) 4px
  );
}

/* Efek penggelapan sudut (vignette) */
.vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

/* Kedipan ringan pada seluruh container untuk mensimulasikan flicker CRT */
@keyframes crt-flicker {
  0%,100% { opacity: 1;    }
  92%      { opacity: 0.96; }
  97.5%    { opacity: 0.97; }
}
```

### 6.3 Panel Karakter - Pixel Avatar

Avatar karakter dirender secara programatik menggunakan JavaScript yang menyuntikkan markup SVG ke dalam elemen `<div id="playerAvatar">`. Setiap piksel karakter direpresentasikan oleh sebuah elemen `<rect>` dalam SVG.

```javascript
function buildAvatar() {
  const el = document.getElementById('playerAvatar');
  el.innerHTML = `
    <svg viewBox="0 0 16 21" width="80" height="105"
         style="image-rendering:pixelated">
      <!-- Setiap rect adalah satu piksel karakter -->
      <!-- Rambut -->
      <rect x="4" y="0" width="8" height="1" fill="#3d1c0a"/>
      <!-- Wajah -->
      <rect x="3" y="3" width="10" height="6" fill="#ffc9a0"/>
      <!-- Mata -->
      <rect x="4" y="4" width="2" height="2" fill="#2d1a0e"/>
      <!-- Kilap mata -->
      <rect x="5" y="4" width="1" height="1" fill="#ffffff"/>
      <!-- ... dan seterusnya untuk setiap bagian karakter -->
    </svg>
  `;
}
```

Animasi *floating* (karakter bergerak naik-turun) diterapkan melalui CSS:

```css
@keyframes idle-float {
  0%,100% { transform: translateY(0px);  }
  50%      { transform: translateY(-8px); }
}
.pixel-avatar { animation: idle-float 2s ease-in-out infinite; }
```

### 6.4 Panel Statistik Karakter

Panel statistik menampilkan tiga jenis bilah kemajuan (*progress bar*) untuk HP, MP, dan XP, serta empat nilai atribut mini (STR, INT, DEX, WIS) dalam grid. Setiap bilah dianimasikan dari nol saat boot screen selesai.

```javascript
function animateStatBars() {
  document.querySelectorAll('.stat-fill').forEach(fill => {
    const target = fill.style.width; // Simpan nilai target (misal "85%")
    fill.style.width = '0%';         // Reset ke nol
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = target;   // Terapkan kembali untuk memicu transisi CSS
      });
    });
  });
}
```

Penggunaan dua `requestAnimationFrame` bersarang diperlukan untuk memastikan browser sempat merender state awal (0%) sebelum transisi dimulai.

### 6.5 Sistem Suara - Web Audio API

Seluruh efek suara dihasilkan secara sintetis menggunakan Web Audio API tanpa berkas audio eksternal. Fungsi inti `beep` menciptakan gelombang kotak (*square wave*) yang khas pada game retro.

```javascript
function beep(freq = 440, dur = 0.1, type = 'square', vol = 0.08) {
  const ctx  = getAudio(); // Mendapatkan atau membuat AudioContext
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;                                    // 'square' untuk nuansa retro
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  // Volume turun secara eksponensial menuju nol (envelope release)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + dur);
}
```

**Parameter fungsi `beep`:**

| Parameter | Tipe | Nilai Default | Keterangan |
|---|---|---|---|
| `freq` | `number` | `440` | Frekuensi nada dalam Hz |
| `dur` | `number` | `0.1` | Durasi nada dalam detik |
| `type` | `string` | `'square'` | Bentuk gelombang (`'square'`, `'sine'`, `'sawtooth'`) |
| `vol` | `number` | `0.08` | Volume awal (rentang 0.0–1.0) |

### 6.6 Animasi Latar Belakang - Canvas HTML5

Fungsi `initBackground` menginisialisasi kanvas HTML5 yang merender tiga lapisan animasi secara bersamaan dalam satu *render loop*:

**Lapisan 1 - Bintang berkelip:** 120 objek bintang diinisialisasi dengan posisi, fase, dan kecepatan acak. Setiap frame, nilai `phase` diinkrementasi, kemudian nilai sinus-nya dikonversi menjadi nilai opasitas sehingga bintang tampak berdenyut.

**Lapisan 2 - Pixel rain (Dark Mode):** Kolom karakter Katakana Jepang (rentang Unicode `0x30A0–0x30FF`) jatuh dari atas kanvas, menyerupai efek *Matrix digital rain* namun sangat transparan (opasitas 0.02–0.10) sehingga berfungsi sebagai tekstur latar belakang.

**Lapisan 3 - Shooting stars:** Partikel bintang jatuh yang dirender sebagai garis pendek dengan jejak piksel (*pixel trail*), secara periodik muncul dan menghilang.

```javascript
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isDark) {
    // Render ketiga lapisan dalam mode gelap
    renderStars();
    renderPixelRain();
    renderShootingStars();
  } else {
    // Hanya partikel debu halus dalam mode terang
    renderDustParticles();
  }

  requestAnimationFrame(draw); // Loop tanpa henti
}
```

### 6.7 Konami Code Easter Egg

Konami Code adalah kombinasi tombol `↑ ↑ ↓ ↓ ← → ← → B A` yang terkenal dari dunia game. Implementasinya memanfaatkan *event listener* pada event keyboard untuk mencocokkan urutan input pengguna.

```javascript
const KONAMI_SEQ = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];

function initKonami() {
  let seq = []; // Buffer untuk menyimpan tombol yang baru ditekan

  document.addEventListener('keydown', e => {
    seq.push(e.key);
    // Potong buffer agar hanya menyimpan N tombol terakhir
    seq = seq.slice(-KONAMI_SEQ.length);

    if (seq.join(',') === KONAMI_SEQ.join(',')) {
      sfxKonami();
      showAchievement('KONAMI CODE ACTIVATED', '30 LIVES!');
      // Aktifkan efek visual rainbow selama 3.5 detik
      document.querySelector('.game-wrap').classList.add('rainbow-mode');
      setTimeout(() => {
        document.querySelector('.game-wrap').classList.remove('rainbow-mode');
      }, 3500);
    }
  });
}
```

### 6.8 Toggle Tema Gelap / Terang

Tema disimpan menggunakan `localStorage` sehingga preferensi pengguna tetap tersimpan saat halaman dimuat ulang. Pergantian tema dilakukan dengan mengubah nilai atribut `data-theme` pada elemen `<html>`, yang kemudian ditangkap oleh selektor CSS `[data-theme="light"]`.

```javascript
function applyTheme(theme) {
  // Mengubah atribut HTML yang ditangkap selektor CSS
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme); // Perbarui ikon tombol (matahari / bulan)
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('retro-theme', next); // Simpan preferensi
  sfxTheme(); // Putar efek suara
});
```

---

## 7. Fitur Persona Finder - Penjelasan Teknis

### 7.1 Gambaran Umum

Persona Finder adalah fitur interaktif yang meminta pengguna mengisi tiga buah input, kemudian mengolah kombinasi input tersebut untuk menghasilkan output berupa "persona" bergaya karakter RPG. Fitur ini sepenuhnya berjalan di sisi klien tanpa pemanggilan API eksternal.

**Alur proses secara keseluruhan:**

```
Input Pengguna (Nama + Hobi + Angka)
    |
    v
Validasi Input (Hobi harus dipilih)
    |
    v
Tampilkan Loading Animasi (1.8 detik)
    |
    v
Hitung Tier berdasarkan Angka Keberuntungan
    |
    v
Hitung Rarity berdasarkan Tier + Angka
    |
    v
Ambil Data Persona dari PERSONA_DB
    |
    v
Render Hasil (Ikon, Judul, Deskripsi, Stat Bars, Rarity)
```

### 7.2 Struktur Data - `PERSONA_DB`

Seluruh data persona disimpan dalam sebuah objek JavaScript literal bernama `PERSONA_DB`. Objek ini memiliki 10 kunci yang masing-masing merepresentasikan satu kategori hobi.

```javascript
const PERSONA_DB = {
  coding: {
    label: 'DEVELOPER',   // Nama kelas yang ditampilkan
    color: '#00ff9d',      // Warna aksen untuk persona ini
    tiers: [
      // Tier 0 - Angka Keberuntungan 1-3
      {
        title: 'The Bug Whisperer',
        desc:  'Machines speak to you in their native tongue...',
        stats: { STR: 60, INT: 99, DEX: 70, WIS: 80 }
      },
      // Tier 1 - Angka Keberuntungan 4-7
      {
        title: 'The Tech Innovator',
        desc:  'You build tomorrow one line at a time...',
        stats: { STR: 65, INT: 95, DEX: 75, WIS: 88 }
      },
      // Tier 2 - Angka Keberuntungan 8-10
      {
        title: 'The Code Wizard',
        desc:  'Ancient algorithms bow before you...',
        stats: { STR: 70, INT: 99, DEX: 80, WIS: 95 }
      }
    ]
  },
  // ... 9 hobi lainnya dengan struktur yang sama
};
```

**Daftar hobi yang tersedia beserta warna aksennya:**

| Kunci | Label | Warna Aksen |
|---|---|---|
| `gaming` | GAMER | `#7289da` (Biru ungu) |
| `coding` | DEVELOPER | `#00ff9d` (Hijau neon) |
| `music` | MUSICIAN | `#ff007f` (Merah muda) |
| `art` | ARTIST | `#ff8c42` (Oranye) |
| `sports` | ATHLETE | `#ff3344` (Merah) |
| `reading` | SCHOLAR | `#ffd700` (Emas) |
| `cooking` | ALCHEMIST | `#e05c00` (Oranye tua) |
| `travel` | EXPLORER | `#00b4ff` (Biru) |
| `photography` | VISIONARY | `#a8ff3e` (Hijau terang) |
| `writing` | STORYTELLER | `#d0a0ff` (Ungu muda) |

### 7.3 Logika Penentuan Tier - Fungsi `getTier`

**Definisi fungsi:**

```javascript
function getTier(num) {
  if (num <= 3) return 0;
  if (num <= 7) return 1;
  return 2;
}
```

**Deskripsi:**
Fungsi `getTier` menerima sebuah bilangan bulat yang merepresentasikan Angka Keberuntungan pengguna (rentang 1–10), kemudian mengembalikan indeks tier (0, 1, atau 2) yang akan digunakan untuk memilih entri dalam array `tiers` pada `PERSONA_DB`.

**Parameter:**

| Parameter | Tipe | Rentang | Keterangan |
|---|---|---|---|
| `num` | `number` (integer) | 1–10 | Angka Keberuntungan yang diinput pengguna |

**Nilai kembalian (*return value*):**

| Kondisi Input | Nilai Kembalian | Makna |
|---|---|---|
| `num` antara 1–3 | `0` | Tier Rendah |
| `num` antara 4–7 | `1` | Tier Menengah |
| `num` antara 8–10 | `2` | Tier Tinggi |

**Tabel pemetaan lengkap:**

| Angka Keberuntungan | Tier | Nama Tier |
|:---:|:---:|---|
| 1 | 0 | Rendah |
| 2 | 0 | Rendah |
| 3 | 0 | Rendah |
| 4 | 1 | Menengah |
| 5 | 1 | Menengah |
| 6 | 1 | Menengah |
| 7 | 1 | Menengah |
| 8 | 2 | Tinggi |
| 9 | 2 | Tinggi |
| 10 | 2 | Tinggi |

### 7.4 Logika Penentuan Rarity - Fungsi `getRarity`

**Definisi fungsi:**

```javascript
function getRarity(num, tier) {
  const score = tier * 2 + Math.floor(num / 3);
  return Math.min(score, RARITY.length - 1); // Dibatasi maksimal 4
}
```

**Deskripsi:**
Fungsi `getRarity` menghitung indeks tingkat kelangkaan (*rarity*) berdasarkan kombinasi nilai tier dan angka keberuntungan. Formula yang digunakan adalah `tier × 2 + floor(num / 3)`, yang kemudian dibatasi pada nilai maksimal 4 menggunakan `Math.min`.

**Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `num` | `number` | Angka Keberuntungan pengguna (1–10) |
| `tier` | `number` | Hasil kembalian dari fungsi `getTier` (0, 1, atau 2) |

**Struktur data `RARITY`:**

```javascript
const RARITY = [
  { gem: '◇', text: 'COMMON RANK',    color: '#8888aa' }, // Indeks 0
  { gem: '◆', text: 'UNCOMMON RANK',  color: '#00ff9d' }, // Indeks 1
  { gem: '◈', text: 'RARE RANK',      color: '#00b4ff' }, // Indeks 2
  { gem: '❖', text: 'EPIC RANK',      color: '#b060ff' }, // Indeks 3
  { gem: '★', text: 'LEGENDARY RANK', color: '#ffd700' }, // Indeks 4
];
```

**Tabel pemetaan rarity berdasarkan input:**

| Angka | Tier | Skor (`tier×2+⌊num/3⌋`) | Rarity |
|:---:|:---:|:---:|---|
| 1 | 0 | 0 + 0 = **0** | Common |
| 2 | 0 | 0 + 0 = **0** | Common |
| 3 | 0 | 0 + 1 = **1** | Uncommon |
| 4 | 1 | 2 + 1 = **3** | Epic |
| 5 | 1 | 2 + 1 = **3** | Epic |
| 6 | 1 | 2 + 2 = **4** | Legendary |
| 7 | 1 | 2 + 2 = **4** | Legendary |
| 8 | 2 | 4 + 2 = **4** | Legendary |
| 9 | 2 | 4 + 3 → min(7,4) = **4** | Legendary |
| 10 | 2 | 4 + 3 → min(7,4) = **4** | Legendary |

### 7.5 Fungsi `initStepper` - Kontrol Angka Keberuntungan

**Definisi fungsi:**

```javascript
function initStepper() {
  let num = 7; // Nilai awal default

  function updateDisplay() {
    valEl.textContent   = num;
    hidden.value        = num;
    // Tampilkan bintang penuh dan kosong sesuai angka
    starsEl.textContent = '★'.repeat(num) + '☆'.repeat(10 - num);
  }

  dec.addEventListener('click', () => {
    if (num > 1) { num--; updateDisplay(); beep(330, 0.04); }
  });
  inc.addEventListener('click', () => {
    if (num < 10) { num++; updateDisplay(); beep(440, 0.04); }
  });
}
```

**Input:** Interaksi *click* pada tombol `◄` (kurangi) dan `►` (tambah).

**Output:** Pembaruan tampilan angka, baris bintang (`★`/`☆`), dan nilai tersembunyi pada `<input type="hidden">` yang akan dibaca saat formulir disubmit.

**Batasan nilai:** Nilai minimum adalah 1 dan maksimum adalah 10. Penekanan tombol di luar batas tidak mengubah nilai.

### 7.6 Fungsi `typewriter` - Efek Pengetikan Teks

**Definisi fungsi:**

```javascript
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
```

**Deskripsi:**
Fungsi ini menganimasikan penampilan teks karakter demi karakter pada sebuah elemen DOM, memberikan efek visual seperti teks yang sedang diketik. Rekursi `setTimeout` digunakan sebagai pengganti `setInterval` untuk memastikan setiap karakter benar-benar tampil sebelum karakter berikutnya dimulai.

**Parameter:**

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `el` | `HTMLElement` | - | Elemen DOM tujuan teks |
| `text` | `string` | - | Teks yang akan dianimasikan |
| `speed` | `number` | `22` | Jeda antar karakter dalam milidetik |

**Output:** Tidak mengembalikan nilai; memodifikasi properti `textContent` elemen secara langsung.

### 7.7 Fungsi `buildStatBars` - Render Bilah Statistik Vertikal

**Definisi fungsi:**

```javascript
function buildStatBars(container, stats, accentColor) {
  container.innerHTML = '';

  Object.entries(stats).forEach(([name, val]) => {
    const col = document.createElement('div');
    col.className = 'pf-stat-col';
    col.innerHTML = `
      <div class="pf-stat-name">${name}</div>
      <div class="pf-stat-bar-v">
        <div class="pf-stat-fill-v"
             data-target="${val}"
             style="background:${accentColor};height:0%">
        </div>
      </div>
      <div class="pf-stat-val" style="color:${accentColor}">${val}</div>
    `;
    container.appendChild(col);
  });

  // Animasi: terapkan height setelah dua frame untuk memicu transisi CSS
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.pf-stat-fill-v').forEach(fill => {
        fill.style.height = fill.dataset.target + '%';
      });
    });
  });
}
```

**Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `container` | `HTMLElement` | Elemen wrapper untuk kolom-kolom stat |
| `stats` | `object` | Objek `{STR, INT, DEX, WIS}` dari data persona |
| `accentColor` | `string` | Kode warna CSS (hex) sesuai hobi yang dipilih |

**Output:** Menghasilkan empat kolom DOM yang berisi bilah vertikal teranim dengan tinggi berdasarkan nilai numerik tiap atribut (0–99 dipetakan sebagai 0%–99% tinggi bilah).

### 7.8 Fungsi `showPersonaResult` - Render Hasil Persona

**Definisi fungsi:**

```javascript
function showPersonaResult(name, hobby, num) {
  const data    = PERSONA_DB[hobby];          // Data hobi dari database
  const tier    = getTier(num);               // Hitung tier
  const persona = data.tiers[tier];           // Ambil persona pada tier tersebut
  const rarityIdx = getRarity(num, tier);     // Hitung indeks rarity
  const rarity    = RARITY[rarityIdx];        // Ambil data rarity

  // Render setiap komponen hasil ke DOM...
  titleEl.textContent      = persona.title.toUpperCase();
  titleEl.style.color      = data.color;
  typewriter(descEl, persona.desc, 18);       // Animasi deskripsi
  classEl.textContent      = data.label;
  iconEl.innerHTML         = HOBBY_ICONS[hobby];
  buildStatBars(statsEl, persona.stats, data.color);

  // Tampilkan rarity badge
  gemEl.textContent        = rarity.gem;
  rarityTextEl.textContent = rarity.text;

  pfResult.hidden = false; // Tampilkan panel hasil

  // Trigger achievement jika rarity Legendary
  if (rarityIdx >= 4) {
    setTimeout(() => showAchievement('LEGENDARY PERSONA', `You are ${persona.title}!`), 600);
  }
}
```

**Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `name` | `string` | Nama yang diinput pengguna (diubah ke huruf kapital) |
| `hobby` | `string` | Kunci hobi dari `PERSONA_DB` (misal `'coding'`) |
| `num` | `number` | Angka Keberuntungan yang dipilih (1–10) |

**Output:** Merender seluruh komponen panel hasil ke halaman dan menampilkannya. Jika rarity yang dihasilkan adalah Legendary (indeks 4), notifikasi *achievement* juga ditampilkan secara otomatis.

### 7.9 Contoh Skenario Lengkap

**Skenario:** Pengguna memasukkan Nama "Ragil", Hobi "CODING / DEV", dan Angka Keberuntungan "9".

```
Input   : name = "Ragil", hobby = "coding", num = 9

Proses  :
  getTier(9)          → tier = 2  (karena 9 > 7)
  PERSONA_DB["coding"].tiers[2]
                      → { title: "The Code Wizard", 
                          desc: "Ancient algorithms bow before you...",
                          stats: {STR:70, INT:99, DEX:80, WIS:95} }
  getRarity(9, 2)     → score = 2×2 + ⌊9/3⌋ = 4 + 3 = 7
                      → min(7, 4) = 4  → RARITY[4]

Output  :
  - Judul persona     : THE CODE WIZARD
  - Kelas             : DEVELOPER
  - Warna aksen       : #00ff9d (Hijau neon)
  - Deskripsi         : "Ancient algorithms bow before you..." (typewriter)
  - Stat bars         : STR=70, INT=99, DEX=80, WIS=95 (animasi vertikal)
  - Rarity            : ★ LEGENDARY RANK
  - Achievement popup : "LEGENDARY PERSONA - You are The Code Wizard!"
```

---

## 8. Cara Menjalankan Proyek

**Persyaratan sistem:**
- Node.js versi 18 atau lebih baru
- NPM (terkandung dalam instalasi Node.js)
- Browser modern (Chrome, Firefox, Edge, atau Safari)

**Langkah instalasi dan menjalankan:**

```bash
# 1. Masuk ke direktori proyek
cd personalinktree

# 2. Instal dependensi (hanya perlu dilakukan sekali)
npm install

# 3. Jalankan server
npm start

# 4. Buka browser dan akses alamat berikut:
#    http://localhost:3000
```

---

## 9. Kesimpulan

Proyek Persona Linktree - Retro 8-Bit Edition berhasil mengimplementasikan sebuah website personal yang fungsional dan estetis menggunakan tumpukan teknologi (*technology stack*) yang ringan namun ekspresif. Beberapa capaian teknis yang patut dicatat:

**Pertama,** desain antarmuka berhasil mencapai estetika retro 8-bit yang autentik melalui kombinasi tipografi pixel (Press Start 2P, VT323), animasi CSS murni tanpa *library* animasi pihak ketiga, dan render karakter sprite berbasis SVG. Efek CRT, scanline, dan glitch berhasil mensimulasikan tampilan monitor jadul secara meyakinkan.

**Kedua,** seluruh interaktivitas dibangun menggunakan JavaScript murni (Vanilla JS) tanpa ketergantungan pada *framework* seperti React atau Vue. Hal ini membuktikan bahwa pengalaman pengguna yang kaya dapat dicapai menggunakan API bawaan browser seperti Web Audio API, Canvas API, dan CSS Custom Properties.

**Ketiga,** fitur Persona Finder berhasil mengimplementasikan sistem inferensi sederhana berbasis tabel data (*lookup table*) yang menghasilkan 30 kombinasi output unik dari tiga variabel input. Meskipun logikanya deterministik (bukan menggunakan kecerdasan buatan), hasilnya terasa personal dan menghibur bagi pengguna.

**Keempat,** server Node.js dengan Express.js memberikan fondasi yang kokoh untuk penyajian file statis, dengan kemungkinan pengembangan di masa depan ke arah API dinamis tanpa perlu mengganti *runtime* yang digunakan.

---

