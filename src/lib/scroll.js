import { qsa, reduceMotion } from './dom.js';

// Efectos ligados al scroll: barra de progreso, parallax [data-speed] y texto que se ilumina [data-scrub].
// Solo escribe variables CSS (--sp, --py, --on); el movimiento real se hace con transform/opacity en CSS.
export function initScrollFX() {
  const scrubs = qsa('[data-scrub]');
  scrubs.forEach((el) => {
    // Cada palabra en su propio span (el texto completo sigue siendo legible por lectores de pantalla)
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'sw'; s.setAttribute('aria-hidden', 'true'); s.textContent = w;
      el.append(s, i < words.length - 1 ? ' ' : '');
    });
  });
  if (reduceMotion()) return;

  const par = qsa('[data-speed]');
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    document.documentElement.style.setProperty('--sp', Math.min(1, scrollY / max).toFixed(4));

    for (const el of par) {
      const host = el.parentElement.getBoundingClientRect();
      if (host.bottom < -300 || host.top > vh + 300) continue;
      el.style.setProperty('--py', `${((host.top + host.height / 2 - vh / 2) * parseFloat(el.dataset.speed)).toFixed(1)}px`);
    }

    for (const s of scrubs) {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height + vh * 0.45)));
      const words = s.querySelectorAll('.sw');
      const n = words.length;
      words.forEach((w, i) => w.style.setProperty('--on', Math.min(1, Math.max(0, p * (n + 3) - i)).toFixed(2)));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}
