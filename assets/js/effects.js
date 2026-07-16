/**
 * CHQ Portal Framework v1.0.0
 * Visual Effects Module
 * Copyright © 2026 CHQ Company. All rights reserved.
 * Author & Principal Architect: Richard Chen (ChenHongQiang)
 */

// ── Particle Background (Login Page) ──
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        gold: Math.random() > 0.7,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    this.particles.forEach((p, i) => {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          this.ctx.beginPath();
          this.ctx.strokeStyle = p.gold || p2.gold
            ? `rgba(201, 162, 39, ${opacity})`
            : `rgba(161, 161, 166, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });

    // Update and draw particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx -= dx * 0.0003;
          p.vy -= dy * 0.0003;
        }
      }

      // Boundary bounce
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.gold
        ? `rgba(201, 162, 39, ${p.opacity})`
        : `rgba(161, 161, 166, ${p.opacity})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ── Aurora Background Gradient ──
class AuroraBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;
    this.resize();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }

  animate() {
    this.time += 0.003;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Create aurora gradient
    const gradient = this.ctx.createLinearGradient(0, 0, w, h);
    const hue1 = (this.time * 10) % 360;
    const hue2 = (this.time * 15 + 120) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 40%, 8%, 1)`);
    gradient.addColorStop(0.5, `hsla(${hue2}, 30%, 6%, 1)`);
    gradient.addColorStop(1, `hsla(${(hue1 + 180) % 360}, 35%, 7%, 1)`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, w, h);

    // Add floating orbs
    for (let i = 0; i < 3; i++) {
      const x = w * (0.3 + 0.4 * Math.sin(this.time + i * 2.1));
      const y = h * (0.3 + 0.4 * Math.cos(this.time * 0.7 + i * 1.3));
      const r = 150 + 80 * Math.sin(this.time + i);

      const orb = this.ctx.createRadialGradient(x, y, 0, x, y, r);
      orb.addColorStop(0, `rgba(201, 162, 39, ${0.03 + 0.02 * Math.sin(this.time + i)})`);
      orb.addColorStop(0.5, `rgba(183, 110, 121, ${0.02 + 0.015 * Math.cos(this.time + i)})`);
      orb.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = orb;
      this.ctx.fillRect(0, 0, w, h);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ── Theme Manager ──
const ThemeManager = {
  key: 'chq_portal_theme',

  init() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      // Default dark
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.bindToggle();
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(this.key, next);
    
    // Animate transition
    document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  },

  bindToggle() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }
};

// ── Mouse Glow Effect ──
class MouseGlow {
  constructor() {
    this.glow = document.createElement('div');
    this.glow.className = 'mouse-glow';
    this.glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(this.glow);
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.glow.style.left = e.clientX + 'px';
      this.glow.style.top = e.clientY + 'px';
      this.glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      this.glow.style.opacity = '0';
    });
  }
}

// ── Page Transition ──
const PageTransition = {
  overlay: null,

  init() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--bg-primary);
      z-index: 9998;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(this.overlay);
  },

  fadeOut() {
    if (!this.overlay) return;
    this.overlay.style.opacity = '1';
    return new Promise(resolve => setTimeout(resolve, 400));
  },

  fadeIn() {
    if (!this.overlay) return;
    this.overlay.style.opacity = '0';
  }
};

// ── Clock Widget ──
function initClock() {
  const el = document.getElementById('clock-widget');
  if (!el) return;

  function update() {
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' });
    el.innerHTML = `<span class="clock-time">${time}</span><span class="clock-date">${date}</span>`;
  }

  update();
  setInterval(update, 1000);
}

// ── Initialize All Effects ──
document.addEventListener('DOMContentLoaded', () => {
  // Login page effects
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    new ParticleSystem(particleCanvas);
  }

  const auroraCanvas = document.getElementById('aurora-canvas');
  if (auroraCanvas) {
    new AuroraBackground(auroraCanvas);
  }

  // Global effects
  ThemeManager.init();
  
  if (!window.matchMedia('(pointer: coarse)').matches) {
    new MouseGlow();
  }

  PageTransition.init();
  initClock();
});

window.CHQEffects = {
  ParticleSystem,
  AuroraBackground,
  ThemeManager,
  MouseGlow,
  PageTransition,
};
