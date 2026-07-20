/* ============================================
   SANTERI RANTANEN — PORTFOLIO
   Quantum-Enhanced Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initQuantumField();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSkillBars();
  initSmoothScroll();
  initContactForm();
  animateCounters();
  initQuantumScramble();
  initFloatingSymbols();
  initMeasurementRipple();
  initWaveDividers();
  initScanLine();
  initQuantumGlitch();
  initCryoTempIndicator();
  initFrostParticles();
  initCryostatViz();
  initPageTransitions();
  initThemeToggle();
  init3DModel();
  initCustomCursor();
  initLightbox();
  initRadarChart();
  initMobileMenu();
});

/* ============================================
   QUANTUM FIELD — Qubit Particle System
   Entangled pairs, superposition, wave functions,
   measurement collapse on click
   ============================================ */
function initQuantumField() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let qubits = [];
  let entanglements = [];
  let animationId = null;
  const mouse = { x: null, y: null, clicked: false, cx: 0, cy: 0 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  canvas.addEventListener('click', e => {
    mouse.clicked = true;
    mouse.cx = e.clientX;
    mouse.cy = e.clientY;
  });

  /* --- Qubit Class --- */
  class Qubit {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2.5 + 1;
      this.phase = Math.random() * Math.PI * 2;
      this.phaseSpeed = 0.01 + Math.random() * 0.02;
      this.waveAmp = 2 + Math.random() * 5;
      this.waveFreq = 0.5 + Math.random() * 1.5;
      this.superposition = true;
      this.state = 0;
      this.blend = 0.5;
      this.measureTime = 0;
      this.flash = 0;
    }

    update(t) {
      this.phase += this.phaseSpeed;

      // Quantum wave-function oscillation around base position
      this.x = this.baseX + Math.sin(this.phase * this.waveFreq) * this.waveAmp;
      this.y = this.baseY + Math.cos(this.phase * this.waveFreq * 0.7) * this.waveAmp;

      // Slow drift
      this.baseX += this.vx;
      this.baseY += this.vy;

      // Wrap around
      if (this.baseX < -30) this.baseX = canvas.width + 30;
      if (this.baseX > canvas.width + 30) this.baseX = -30;
      if (this.baseY < -30) this.baseY = canvas.height + 30;
      if (this.baseY > canvas.height + 30) this.baseY = -30;

      // Superposition: oscillate between |0⟩ and |1⟩
      if (this.superposition) {
        this.blend = (Math.sin(this.phase * 1.5) + 1) / 2;
      }

      // Collapse decay → return to superposition after 4s
      if (!this.superposition) {
        this.flash *= 0.93;
        if (t - this.measureTime > 4000) {
          this.superposition = true;
        }
      }

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          const f = (130 - d) / 130;
          this.x += (dx / d) * f * 2;
          this.y += (dy / d) * f * 2;
        }
      }
    }

    measure(t) {
      this.superposition = false;
      this.state = Math.random() > 0.5 ? 0 : 1;
      this.blend = this.state;
      this.measureTime = t;
      this.flash = 1;
    }

    draw() {
      const b = this.blend;
      const r = Math.round(0 + 124 * b);
      const g = Math.round(212 - 154 * b);
      const bv = Math.round(255 - 18 * b);

      // Probability cloud (superposition only)
      if (this.superposition) {
        const cs = this.size * 7;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, cs);
        grad.addColorStop(0, `rgba(${r},${g},${bv},0.12)`);
        grad.addColorStop(1, `rgba(${r},${g},${bv},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, cs, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Measurement collapse flash
      if (this.flash > 0.01) {
        const fs = this.size * (10 + this.flash * 20);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, fs);
        grad.addColorStop(0, `rgba(${r},${g},${bv},${this.flash * 0.5})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${bv},${this.flash * 0.2})`);
        grad.addColorStop(1, `rgba(${r},${g},${bv},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, fs, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Core qubit dot
      const alpha = this.superposition ? 0.45 + Math.sin(this.phase * 3) * 0.3 : 0.9;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${bv},${alpha})`;
      ctx.fill();

      // Orbital ring for collapsed qubits
      if (!this.superposition && this.flash > 0.05) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4 * (1 + this.flash), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${bv},${this.flash * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // Create qubits
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 150);
  for (let i = 0; i < count; i++) qubits.push(new Qubit());

  // Create entangled pairs
  const pairCount = Math.floor(count / 5);
  const used = new Set();
  for (let i = 0; i < pairCount; i++) {
    let a, b;
    do { a = Math.floor(Math.random() * count); } while (used.has(a));
    do { b = Math.floor(Math.random() * count); } while (used.has(b) || b === a);
    used.add(a); used.add(b);
    entanglements.push([a, b]);
  }

  /* --- Draw entanglement beams --- */
  function drawEntanglements(t) {
    entanglements.forEach(([ai, bi]) => {
      const a = qubits[ai], b = qubits[bi];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      if (dist > 350) return;

      const opacity = Math.max(0, (350 - dist) / 350) * 0.18;
      const pulse = (Math.sin(t * 0.003 + ai) + 1) / 2;

      // Curved entanglement beam
      const cx = (a.x + b.x) / 2 + Math.sin(t * 0.002 + ai) * 25;
      const cy = (a.y + b.y) / 2 + Math.cos(t * 0.002 + bi) * 25;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cx, cy, b.x, b.y);

      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, `rgba(0,212,255,${opacity * pulse})`);
      grad.addColorStop(0.5, `rgba(180,130,255,${opacity * pulse * 1.6})`);
      grad.addColorStop(1, `rgba(124,58,237,${opacity * pulse})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8 + pulse;
      ctx.stroke();

      // Entanglement indicator — small diamond at midpoint
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const ds = 2.5 + pulse * 2;
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = `rgba(180,130,255,${opacity * pulse * 2})`;
      ctx.fillRect(-ds / 2, -ds / 2, ds, ds);
      ctx.restore();
    });
  }

  /* --- Draw dual wave functions across canvas --- */
  function drawWaveFunction(t) {
    const mid = canvas.height * 0.45;

    // Wave |ψ₁⟩ — cyan
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 3) {
      const y = mid
        + Math.sin(x * 0.007 + t * 0.0008) * 35
        + Math.sin(x * 0.013 - t * 0.0012) * 18
        + Math.sin(x * 0.003 + t * 0.0006) * 50;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(0,212,255,0.04)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Wave |ψ₂⟩ — violet, phase-shifted
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 3) {
      const y = mid
        + Math.sin(x * 0.007 + t * 0.0008 + Math.PI) * 35
        + Math.sin(x * 0.013 - t * 0.0012 + Math.PI / 2) * 18
        + Math.sin(x * 0.003 + t * 0.0006 + Math.PI) * 50;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(124,58,237,0.03)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  /* --- Proximity connection lines --- */
  function drawProximityLines() {
    for (let i = 0; i < qubits.length; i++) {
      for (let j = i + 1; j < qubits.length; j++) {
        const d = Math.hypot(qubits[i].x - qubits[j].x, qubits[i].y - qubits[j].y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(qubits[i].x, qubits[i].y);
          ctx.lineTo(qubits[j].x, qubits[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${((100 - d) / 100) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* --- Main animation loop --- */
  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Measurement collapse on click
    if (mouse.clicked) {
      qubits.forEach(q => {
        if (Math.hypot(q.x - mouse.cx, q.y - mouse.cy) < 160) q.measure(t);
      });
      // Entangled partner auto-collapse to opposite state
      entanglements.forEach(([ai, bi]) => {
        const a = qubits[ai], b = qubits[bi];
        if (!a.superposition && b.superposition) {
          b.measure(t); b.state = 1 - a.state; b.blend = b.state;
        } else if (!b.superposition && a.superposition) {
          a.measure(t); a.state = 1 - b.state; a.blend = a.state;
        }
      });
      mouse.clicked = false;
    }

    drawWaveFunction(t);
    qubits.forEach(q => { q.update(t); q.draw(); });
    drawProximityLines();
    drawEntanglements(t);

    animationId = requestAnimationFrame(animate);
  }

  animate(0);

  // Pause off-screen for performance
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!animationId) animationId = requestAnimationFrame(animate); }
    else { cancelAnimationFrame(animationId); animationId = null; }
  });
  obs.observe(canvas);
}

/* ============================================
   QUANTUM TEXT SCRAMBLE
   Hero subtitle decoheres from quantum notation
   into readable text
   ============================================ */
function initQuantumScramble() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;

  const finalText = el.textContent.trim();
  const chars = '|⟩ψΨφℏ∞αβ01+-×∇∂∫ΣΔΩ⊗⊕';
  const len = finalText.length;
  let resolved = 0;

  function scramble() {
    let out = '';
    for (let i = 0; i < len; i++) {
      if (i < resolved) out += finalText[i];
      else if (finalText[i] === ' ' || finalText[i] === '\n') out += finalText[i];
      else out += chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = out;

    if (resolved < len) {
      // Resolve 1–3 chars per frame for a fast-cascade feel
      resolved += Math.random() > 0.2 ? (Math.random() > 0.5 ? 2 : 1) : 0;
      requestAnimationFrame(() => setTimeout(scramble, 22));
    } else {
      el.textContent = finalText;
    }
  }

  setTimeout(scramble, 1400);
}

/* ============================================
   FLOATING QUANTUM SYMBOLS
   |0⟩ |1⟩ |ψ⟩ ℏ H X Z CNOT drift in background
   ============================================ */
function initFloatingSymbols() {
  const symbols = ['|0⟩','|1⟩','|ψ⟩','|φ⟩','ℏ','H','X','Z','CNOT','|+⟩','|-⟩','T','S','∇ψ','⊗','Ĥ','Ω'];
  const layer = document.createElement('div');
  layer.className = 'quantum-symbols-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  for (let i = 0; i < 35; i++) {
    const s = document.createElement('span');
    s.className = 'quantum-float-symbol';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.fontSize = (0.7 + Math.random() * 1.4) + 'rem';
    s.style.animationDuration = (15 + Math.random() * 25) + 's';
    s.style.animationDelay = -(Math.random() * 20) + 's';
    s.style.opacity = 0.04 + Math.random() * 0.1;
    layer.appendChild(s);
  }
}

/* ============================================
   MEASUREMENT RIPPLE
   Click anywhere → concentric collapse rings
   with state readout
   ============================================ */
function initMeasurementRipple() {
  document.addEventListener('click', e => {
    if (e.target.closest('form, button, a, input, textarea, select, label')) return;

    const ripple = document.createElement('div');
    ripple.className = 'quantum-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);

    for (let i = 0; i < 5; i++) {
      const ring = document.createElement('div');
      ring.className = 'quantum-ripple-ring';
      ring.style.animationDelay = (i * 0.12) + 's';
      ripple.appendChild(ring);
    }

    // State collapse readout
    const label = document.createElement('span');
    label.className = 'quantum-ripple-state';
    label.textContent = Math.random() > 0.5 ? '|0⟩ collapsed' : '|1⟩ collapsed';
    ripple.appendChild(label);

    setTimeout(() => ripple.remove(), 2200);
  });
}

/* ============================================
   WAVE FUNCTION DIVIDERS
   Animated sine-wave SVGs between sections
   ============================================ */
function initWaveDividers() {
  const sections = document.querySelectorAll('.about, .experience, .skills, .interests, .contact');

  sections.forEach((section, idx) => {
    const div = document.createElement('div');
    div.className = 'wave-divider';
    div.setAttribute('aria-hidden', 'true');

    // Each divider gets slightly different wave parameters
    const a1 = 12 + idx * 3;
    const a2 = 8 + idx * 2;

    div.innerHTML = `
      <svg viewBox="0 0 1440 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path class="wave-path wave-p1" d="" fill="none" stroke="rgba(0,212,255,0.12)" stroke-width="1"/>
        <path class="wave-path wave-p2" d="" fill="none" stroke="rgba(124,58,237,0.08)" stroke-width="1"/>
      </svg>`;

    section.parentNode.insertBefore(div, section);

    // Animate wave paths
    const svg = div.querySelector('svg');
    const p1 = svg.querySelector('.wave-p1');
    const p2 = svg.querySelector('.wave-p2');
    let phase = idx * 1.2;

    function animateWave() {
      phase += 0.015;
      let d1 = 'M0,25 ', d2 = 'M0,25 ';
      for (let x = 0; x <= 1440; x += 8) {
        const y1 = 25 + Math.sin(x * 0.006 + phase) * a1 + Math.sin(x * 0.012 - phase * 0.7) * a2;
        const y2 = 25 + Math.sin(x * 0.006 + phase + Math.PI) * a1 * 0.7 + Math.cos(x * 0.01 + phase * 0.5) * a2;
        d1 += `L${x},${y1} `;
        d2 += `L${x},${y2} `;
      }
      p1.setAttribute('d', d1);
      p2.setAttribute('d', d2);
      requestAnimationFrame(animateWave);
    }

    // Only animate when visible
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) animateWave();
    }, { threshold: 0 });
    obs.observe(div);
  });
}

/* ============================================
   ENERGY SCAN LINE
   Horizontal photon sweeping down the page
   ============================================ */
function initScanLine() {
  const line = document.createElement('div');
  line.className = 'quantum-scan-line';
  line.setAttribute('aria-hidden', 'true');
  document.body.appendChild(line);
}

/* ============================================
   QUANTUM GLITCH — Section titles
   Occasional micro-glitch on headings
   ============================================ */
function initQuantumGlitch() {
  const titles = document.querySelectorAll('.section-title');
  titles.forEach(title => {
    title.classList.add('quantum-glitch-target');
  });

  // Randomly trigger subtle glitch
  setInterval(() => {
    const idx = Math.floor(Math.random() * titles.length);
    const t = titles[idx];
    if (!t) return;
    t.classList.add('quantum-glitching');
    setTimeout(() => t.classList.remove('quantum-glitching'), 200);
  }, 4000);
}

/* ============================================
   NAVBAR (unchanged)
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    let current = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 120) current = s.id; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  });
}

/* ============================================
   MOBILE MENU (unchanged)
   ============================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL REVEAL (unchanged)
   ============================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================
   SKILL BARS (unchanged)
   ============================================ */
function initSkillBars() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        setTimeout(() => { fill.style.width = fill.getAttribute('data-width') + '%'; }, 200);
        observer.unobserve(fill);
      }
    }),
    { threshold: 0.3 }
  );
  document.querySelectorAll('.skill-bar-fill').forEach(bar => observer.observe(bar));
}

/* ============================================
   FROSTY NAV SCROLL
   ============================================ */
function initSmoothScroll() {
  const overlay = document.createElement('div');
  overlay.className = 'frost-transition-overlay';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#hero') {
        // Just smooth scroll for top links
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        
        // 1. Freeze screen
        overlay.classList.remove('frost-shatter');
        overlay.classList.add('frost-active');
        
        // 2. Wait for freeze, then jump & shatter
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'instant' });
          
          setTimeout(() => {
            overlay.classList.remove('frost-active');
            overlay.classList.add('frost-shatter');
          }, 50);
        }, 500); // Wait 500ms for frost to build up
      }
    });
  });
}

/* ============================================
   CONTACT FORM (unchanged)
   ============================================ */
function initContactForm() {
  // Let FormSubmit.co handle the native form submission.
}
/* ============================================
   COUNTER ANIMATION (unchanged)
   ============================================ */
function animateCounters() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;
        let cur = 0;
        const inc = target / 45;
        const timer = setInterval(() => {
          cur += inc;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = Math.floor(cur) + suffix;
        }, 30);
        observer.unobserve(el);
      }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach(c => observer.observe(c));
}

/* ============================================
   CRYOSTAT TEMPERATURE INDICATOR
   Scroll-driven thermometer: 300 K → 10 mK
   Shows dilution refrigerator cooling stages
   ============================================ */
function initCryoTempIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'cryo-temp-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  indicator.innerHTML = `
    <div class="cryo-temp-track">
      <div class="cryo-temp-fill"></div>
      <div class="cryo-temp-stages">
        <div class="cryo-stage" style="top:0%"><span class="cryo-stage-dot"></span><span class="cryo-stage-label">300 K</span><span class="cryo-stage-name">Room temp</span></div>
        <div class="cryo-stage" style="top:18%"><span class="cryo-stage-dot"></span><span class="cryo-stage-label">50 K</span><span class="cryo-stage-name">1st stage</span></div>
        <div class="cryo-stage" style="top:40%"><span class="cryo-stage-dot"></span><span class="cryo-stage-label">4 K</span><span class="cryo-stage-name">Pulse tube</span></div>
        <div class="cryo-stage" style="top:58%"><span class="cryo-stage-dot"></span><span class="cryo-stage-label">1 K</span><span class="cryo-stage-name">Still</span></div>
        <div class="cryo-stage" style="top:78%"><span class="cryo-stage-dot"></span><span class="cryo-stage-label">100 mK</span><span class="cryo-stage-name">Cold plate</span></div>
        <div class="cryo-stage" style="top:97%"><span class="cryo-stage-dot"></span><span class="cryo-stage-label">10 mK</span><span class="cryo-stage-name">Mixing chamber</span></div>
      </div>
    </div>
    <div class="cryo-temp-readout">
      <div class="cryo-temp-value">300</div>
      <div class="cryo-temp-unit">K</div>
    </div>
    <div class="cryo-temp-title">CRYOSTAT</div>
  `;
  document.body.appendChild(indicator);

  const fill = indicator.querySelector('.cryo-temp-fill');
  const valueEl = indicator.querySelector('.cryo-temp-value');
  const unitEl = indicator.querySelector('.cryo-temp-unit');
  const stages = indicator.querySelectorAll('.cryo-stage');

  function update() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    // Fill the cooling track
    fill.style.height = (progress * 100) + '%';

    // Exponential temperature: 300K → 0.01K (10 mK)
    const temp = 300 * Math.pow(0.01 / 300, progress);

    if (temp >= 1) {
      valueEl.textContent = temp >= 10 ? Math.round(temp) : temp.toFixed(1);
      unitEl.textContent = 'K';
    } else {
      valueEl.textContent = (temp * 1000) >= 10 ? Math.round(temp * 1000) : (temp * 1000).toFixed(1);
      unitEl.textContent = 'mK';
    }

    // Light up passed stages
    const stagePositions = [0, 0.18, 0.40, 0.58, 0.78, 0.97];
    stages.forEach((stage, i) => {
      stage.classList.toggle('cryo-stage-active', progress >= stagePositions[i] - 0.02);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================
   FROST PARTICLES
   Falling ice crystals across the whole page
   ============================================ */
function initFrostParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'frost-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let crystals = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Crystal {
    constructor(startDistributed) {
      this.x = Math.random() * canvas.width;
      this.y = startDistributed ? Math.random() * canvas.height : -20 - Math.random() * 80;
      this.size = 3 + Math.random() * 8;
      this.speed = 0.2 + Math.random() * 0.6;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.008 + Math.random() * 0.015;
      this.wobbleAmp = 0.3 + Math.random() * 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.008;
      this.opacity = 0.08 + Math.random() * 0.18;
      this.branches = 6;
    }

    update() {
      this.y += this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * this.wobbleAmp;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 30) {
        this.y = -30;
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      // Hexagonal outline
      ctx.beginPath();
      for (let i = 0; i < this.branches; i++) {
        const a = (Math.PI * 2 / this.branches) * i - Math.PI / 2;
        const px = Math.cos(a) * this.size;
        const py = Math.sin(a) * this.size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(180, 220, 255, 0.5)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Internal crystal branches
      for (let i = 0; i < 3; i++) {
        const a = (Math.PI / 3) * i;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * this.size * 0.85, Math.sin(a) * this.size * 0.85);
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a + Math.PI) * this.size * 0.85, Math.sin(a + Math.PI) * this.size * 0.85);
        // Small side branches
        const bx = Math.cos(a) * this.size * 0.5;
        const by = Math.sin(a) * this.size * 0.5;
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(a + 1) * this.size * 0.25, by + Math.sin(a + 1) * this.size * 0.25);
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(a - 1) * this.size * 0.25, by + Math.sin(a - 1) * this.size * 0.25);
        ctx.strokeStyle = 'rgba(150, 210, 255, 0.35)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Center glow
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.6);
      grad.addColorStop(0, 'rgba(180, 230, 255, 0.12)');
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
    }
  }

  // Create crystals
  const count = Math.min(Math.floor(canvas.width / 30), 50);
  for (let i = 0; i < count; i++) {
    crystals.push(new Crystal(true));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    crystals.forEach(c => { c.update(); c.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================
   CRYOSTAT VISUALIZATION
   Animated dilution refrigerator cross-section
   in the hero background
   ============================================ */
function initCryostatViz() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const container = document.createElement('div');
  container.className = 'cryostat-viz';
  container.setAttribute('aria-hidden', 'true');

  // Stages of a dilution refrigerator (name, width%, color)
  const stages = [
    { label: '300 K',   w: 100, color: 'rgba(255,150,50,0.25)',  glow: 'rgba(255,150,50,0.1)' },
    { label: '50 K',    w: 88,  color: 'rgba(200,180,100,0.2)',  glow: 'rgba(200,180,100,0.08)' },
    { label: '4 K',     w: 76,  color: 'rgba(100,200,220,0.2)',  glow: 'rgba(100,200,220,0.08)' },
    { label: '1 K',     w: 64,  color: 'rgba(50,180,255,0.22)',  glow: 'rgba(50,180,255,0.1)' },
    { label: '100 mK',  w: 52,  color: 'rgba(0,212,255,0.25)',   glow: 'rgba(0,212,255,0.12)' },
    { label: '10 mK',   w: 40,  color: 'rgba(124,58,237,0.3)',   glow: 'rgba(124,58,237,0.15)' },
  ];

  let html = '<div class="cryostat-body">';

  stages.forEach((s, i) => {
    html += `
      <div class="cryostat-stage" style="--stage-width:${s.w}%; --stage-color:${s.color}; --stage-glow:${s.glow}; --stage-delay:${i * 0.3}s">
        <div class="cryostat-plate"></div>
        <div class="cryostat-label">${s.label}</div>
        <div class="cryostat-rod-left"></div>
        <div class="cryostat-rod-right"></div>
      </div>`;
  });

  html += '</div>';
  // Add connecting vertical rods
  html += '<div class="cryostat-outer-shell"></div>';
  container.innerHTML = html;
  hero.appendChild(container);
}

/* ============================================
   SPACE WARP PAGE TRANSITION
   Triggered on .page-transition-link click
   ============================================ */
function initPageTransitions() {
  const links = document.querySelectorAll('.page-transition-link');
  if (links.length === 0 && !document.body.classList.contains('subpage')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'space-warp-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  let w, h;
  let stars = [];
  let animationId;
  let warpSpeed = 0;
  let isWarping = false;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Initialize stars
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      color: Math.random() > 0.5 ? '#00d4ff' : (Math.random() > 0.5 ? '#7c3aed' : '#ffffff')
    });
  }

  function draw() {
    ctx.fillStyle = 'rgba(6, 6, 15, 0.2)'; // trailing effect
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    stars.forEach(star => {
      star.z -= warpSpeed;
      if (star.z <= 0) {
        star.x = (Math.random() - 0.5) * 2000;
        star.y = (Math.random() - 0.5) * 2000;
        star.z = 2000;
      }

      const x = cx + (star.x / star.z) * 1000;
      const y = cy + (star.y / star.z) * 1000;
      const r = Math.max(0.1, 2 - (star.z / 1000));

      const px = cx + (star.x / (star.z + warpSpeed * 2)) * 1000;
      const py = cy + (star.y / (star.z + warpSpeed * 2)) * 1000;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.strokeStyle = star.color;
      ctx.lineWidth = r;
      ctx.stroke();
    });

    if (isWarping || warpSpeed > 0.1) {
      animationId = requestAnimationFrame(draw);
    }
  }

  // Handle Outbound Clicks
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href');
      
      canvas.classList.add('warp-active');
      isWarping = true;
      warpSpeed = 0;
      
      // Ramp up speed
      const rampUp = setInterval(() => {
        warpSpeed += 2;
        if (warpSpeed > 50) clearInterval(rampUp);
      }, 30);
      
      draw();

      setTimeout(() => {
        window.location.href = target;
      }, 1200);
    });
  });

  // Handle Entrance (if we are on a subpage)
  if (document.body.classList.contains('subpage-entrance')) {
    canvas.classList.add('warp-active');
    isWarping = true;
    warpSpeed = 50;
    draw();

    setTimeout(() => {
      // Ramp down speed
      const rampDown = setInterval(() => {
        warpSpeed -= 2;
        if (warpSpeed <= 0) {
          clearInterval(rampDown);
          isWarping = false;
          canvas.classList.remove('warp-active');
          setTimeout(() => canvas.remove(), 500);
        }
      }, 30);
    }, 100);
  }
}

/* ============================================
   THEME TOGGLE
   ============================================ */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'light') {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ============================================
   3D MODEL (THREE.JS)
   ============================================ */
function init3DModel() {
  const container = document.getElementById('model-container');
  if (!container || typeof THREE === 'undefined') return;

  // Remove loading text
  const loader = container.querySelector('.model-loading');
  if (loader) loader.remove();

  const scene = new THREE.Scene();
  // We want the background to be transparent to show the container's background
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.enablePan = false;

  // Materials
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.0
  });
  
  const copperMaterial = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    metalness: 0.8,
    roughness: 0.4
  });

  const silverMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    metalness: 0.9,
    roughness: 0.1
  });

  // Group for the Full Dilution Refrigerator System
  const systemGroup = new THREE.Group();

  // Helper function to create a plate
  function createPlate(radius, y, thickness, material) {
    const geo = new THREE.CylinderGeometry(radius, radius, thickness, 64);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = y;
    systemGroup.add(mesh);
    return mesh;
  }

  // Helper function to create support pillars between two heights
  function createPillars(radius, y1, y2, count, pillarRadius, material) {
    const height = Math.abs(y1 - y2);
    const midY = (y1 + y2) / 2;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const geo = new THREE.CylinderGeometry(pillarRadius, pillarRadius, height, 16);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(Math.cos(angle) * (radius - 0.4), midY, Math.sin(angle) * (radius - 0.4));
      systemGroup.add(mesh);
    }
  }

  // 1. RT Flange (Room Temperature)
  createPlate(4.5, 6, 0.4, silverMaterial);

  // 2. 50K Flange
  createPlate(4.2, 4, 0.3, goldMaterial);
  createPillars(4.2, 6, 4, 3, 0.15, silverMaterial); // Supports

  // 3. 4K Flange
  createPlate(4.0, 2, 0.3, goldMaterial);
  createPillars(4.0, 4, 2, 3, 0.12, silverMaterial);

  // 4. Still Plate
  createPlate(3.5, -0.5, 0.3, goldMaterial);
  createPillars(3.5, 2, -0.5, 3, 0.1, silverMaterial);

  // 5. Cold Plate
  createPlate(3.2, -2.5, 0.25, goldMaterial);
  createPillars(3.2, -0.5, -2.5, 3, 0.08, silverMaterial);

  // 6. Mixing Chamber Plate (MC)
  createPlate(3.0, -4.5, 0.4, goldMaterial);
  createPillars(3.0, -2.5, -4.5, 3, 0.08, silverMaterial);

  // Central Cooling Column & Heat Exchangers (Copper)
  const centralGeo = new THREE.CylinderGeometry(0.8, 0.6, 10.5, 32);
  const centralColumn = new THREE.Mesh(centralGeo, copperMaterial);
  centralColumn.position.y = 0.75;
  systemGroup.add(centralColumn);

  // Coiled Heat Exchanger (between Still and Cold Plate)
  const coilGeo = new THREE.TorusKnotGeometry(0.8, 0.15, 100, 16, 2, 15);
  const coil = new THREE.Mesh(coilGeo, copperMaterial);
  coil.position.y = -1.5;
  coil.scale.set(1, 0.4, 1);
  systemGroup.add(coil);

  // Mixing Chamber Body (Below MC Plate)
  const mcBodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
  const mcBody = new THREE.Mesh(mcBodyGeo, copperMaterial);
  mcBody.position.y = -5.5;
  systemGroup.add(mcBody);

  // Wiring looms (Cyan glowing lines running down)
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.5 });
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 12, 8);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.set(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5);
    systemGroup.add(wire);
  }

  // Adjust group position to center it in view
  systemGroup.position.y = -0.5;
  systemGroup.scale.set(0.6, 0.6, 0.6); // Scale down slightly to fit the full height

  scene.add(systemGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 10, 10);
  scene.add(dirLight);
  
  const pointLight = new THREE.PointLight(0x00d4ff, 1.2, 30); // Cyan glow from bottom
  pointLight.position.set(0, -8, 0);
  scene.add(pointLight);

  let targetCameraPos = new THREE.Vector3(12, 2, 12);
  let targetControlCenter = new THREE.Vector3(0, 0, 0);

  camera.position.copy(targetCameraPos);
  controls.target.copy(targetControlCenter);

  // Button Click Handlers
  const buttons = document.querySelectorAll('.model-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const target = e.target.getAttribute('data-target');
      if (target === 'full') {
        targetCameraPos.set(12, 2, 12);
        targetControlCenter.set(0, 0, 0);
      } else if (target === 'rt') {
        targetCameraPos.set(6, 6, 6);
        targetControlCenter.set(0, 5, 0);
      } else if (target === 'still') {
        targetCameraPos.set(5, 0, 5);
        targetControlCenter.set(0, 0.5, 0);
      } else if (target === 'mc') {
        targetCameraPos.set(4, -5, 4);
        targetControlCenter.set(0, -4, 0);
      }
    });
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera tweening
    camera.position.lerp(targetCameraPos, 0.05);
    controls.target.lerp(targetControlCenter, 0.05);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ============================================
   SURPRISE FEATURE: CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    // Using left/top avoids conflicting with CSS transform animations (like spin)
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const interactables = document.querySelectorAll('a, button, .gallery-item');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'custom-cursor-ripple';
    // Position ripple exactly at click coordinates
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
}

/* ============================================
   LIGHTBOX MODAL
   ============================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // Only run on pages with a lightbox

  const lightboxImg = document.getElementById('lightbox-img');
  const captionText = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  
  // Get all gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightbox.classList.add('active');
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title').innerText;
      const desc = item.querySelector('.gallery-desc').innerText;
      
      lightboxImg.src = img.src;
      captionText.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
    });
  });

  // Close when clicking the X
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // Close when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

/* ============================================
   RADAR CHART (SKILLS)
   ============================================ */
function initRadarChart() {
  const ctx = document.getElementById('skillsRadarChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const data = {
    labels: ['CAD & 3D Modeling', 'Manufacturing (DFM/DFA)', 'Cryogenics', 'Robotics & Automation', 'FEM Simulation', 'Project Management'],
    datasets: [{
      label: 'Proficiency',
      data: [95, 90, 85, 80, 75, 85],
      backgroundColor: 'rgba(0, 212, 255, 0.2)', // Cyan with transparency
      borderColor: '#00d4ff', // Solid Cyan
      pointBackgroundColor: '#fff',
      pointBorderColor: '#00d4ff',
      pointHoverBackgroundColor: '#00d4ff',
      pointHoverBorderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const skillDetails = {
    'CAD & 3D Modeling': [
      '<b>SolidWorks:</b> Advanced surface modeling & master modeling (95%)',
      '<b>Siemens NX:</b> Large assembly management & parametric design (90%)',
      '<b>Creo / Pro-E:</b> Top-down design methodology (75%)',
      '<b>AutoCAD / Inventor:</b> 2D drafting & legacy conversions (85%)'
    ],
    'Manufacturing (DFM/DFA)': [
      '<b>Sheet Metal Design:</b> Bend deductions, laser cutting optimization (97%)',
      '<b>Plastic Parts:</b> Injection molding, draft angles, ribbing (82%)',
      '<b>GD&T:</b> Strict tolerance analysis & technical drawing (90%)',
      '<b>Machining & Welding:</b> Design for CNC and manual fabrication (88%)'
    ],
    'Cryogenics': [
      '<b>Dilution Refrigerators:</b> System architecture for mK temperatures (85%)',
      '<b>Thermal Dynamics:</b> Heat transfer & radiation shielding (80%)',
      '<b>Vacuum Technology:</b> Flange sealing & leak detection (85%)'
    ],
    'Robotics & Automation': [
      '<b>Kinematics:</b> Joint hierarchy & automated payload handling (85%)',
      '<b>Pneumatics & Hydraulics:</b> Actuator sizing & logic (80%)',
      '<b>Mechatronics:</b> Sensor integration & PLC basics (Tia Portal) (75%)'
    ],
    'FEM Simulation': [
      '<b>Structural Analysis:</b> Static load & stress testing (80%)',
      '<b>Thermal Analysis:</b> Heat dissipation in vacuum environments (75%)',
      '<b>Fatigue & Modal:</b> Vibrational resonance testing (70%)'
    ],
    'Project Management': [
      '<b>PDM/PLM:</b> Teamcenter, Windchill, SolidPDM (90%)',
      '<b>Agile/Scrum:</b> Sprints & cross-functional team leadership (85%)',
      '<b>Client Relations:</b> Requirements gathering & technical presentations (85%)'
    ]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      onClick: (event, elements, chart) => {
        // Trigger for the nearest element even if not exactly intersecting
        if (!elements || elements.length === 0) {
          elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true);
        }
        
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          const label = chart.data.labels[index];
          showSkillDetails(label);
        }
      },
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: {
            color: '#c4c4cc',
            font: { size: 14, family: "'Inter', sans-serif" }
          },
          ticks: {
            display: false,
            max: 100,
            min: 0,
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 16, family: "'Inter', sans-serif" },
          bodyFont: { size: 14, family: "'Space Mono', monospace" },
          padding: 15,
          callbacks: {
            label: function(context) {
              return ` Mastery: ${context.raw}% (Click for details)`;
            }
          }
        }
      }
    }
  };

  new Chart(ctx, config);

  function showSkillDetails(categoryName) {
    const modal = document.getElementById('skill-modal');
    const title = document.getElementById('skill-detail-title');
    const list = document.getElementById('skill-detail-list');

    title.innerText = `> ${categoryName}`;
    list.innerHTML = '';

    const details = skillDetails[categoryName] || [];
    details.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `• ${item}`;
      list.appendChild(li);
    });

    modal.classList.add('active');
  }

  // Modal Close Logic
  const modal = document.getElementById('skill-modal');
  const closeBtn = document.getElementById('skill-modal-close');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}
