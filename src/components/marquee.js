import { h, qs, reduceMotion } from '../lib/dom.js';
import { services } from '../data/services.js';

// Estado global de movimiento: lo controla el botón de pausa de la cabecera (WCAG 2.2.2).
export const motion = { paused: false };

export function initMotionToggle() {
  const btn = document.getElementById('motion-toggle');
  if (!btn) return;
  if (reduceMotion()) { btn.hidden = true; return; }
  btn.addEventListener('click', () => {
    motion.paused = !motion.paused;
    document.documentElement.dataset.motion = motion.paused ? 'paused' : 'on';
    btn.setAttribute('aria-pressed', String(motion.paused));
    btn.setAttribute('aria-label', motion.paused ? 'Reanudar animaciones' : 'Pausar animaciones');
  });
}

/**
 * Banda que se desplaza sola. La velocidad sube con el scroll y se invierte al subir.
 * track > group (el contenido). Se duplica el grupo para el bucle continuo.
 */
export function makeMarquee(track, { speed = 70, dir = -1, pauseOnHover = false } = {}) {
  const group = track.firstElementChild;
  track.parentElement.classList.add('is-static'); // sin JS/animación: contenido normal y desplazable
  if (!group || reduceMotion()) return;
  track.parentElement.classList.remove('is-static');

  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  track.append(clone);

  let width = group.offsetWidth;
  new ResizeObserver(() => { width = group.offsetWidth; }).observe(group);

  let x = 0;
  let rate = 1;
  let visible = false;
  let hover = false;
  let last = performance.now();
  let lastY = scrollY;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '200px' }).observe(track.parentElement);
  if (pauseOnHover) {
    track.parentElement.addEventListener('pointerenter', () => { hover = true; });
    track.parentElement.addEventListener('pointerleave', () => { hover = false; });
  }

  const tick = (t) => {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    const dy = scrollY - lastY;
    lastY = scrollY;
    if (!visible || !width) return;
    const v = dt > 0 ? dy / dt : 0; // px/s de scroll
    const boost = Math.max(-6, Math.min(6, v / 350));
    const target = motion.paused || hover ? 0 : 1 + boost; // baja = acelera, sube = invierte
    rate += (target - rate) * 0.08;
    if (target === 0 && Math.abs(rate) < 0.02) rate = 0;
    x += -dir * speed * rate * dt;
    track.style.transform = `translate3d(${(-(((x % width) + width) % width)).toFixed(2)}px,0,0)`;
  };
  requestAnimationFrame(tick);
}

/** Gira un elemento; el scroll lo acelera. */
export function spinOnScroll(el, { duration = 16000 } = {}) {
  if (!el || reduceMotion()) return;
  const anim = el.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration, iterations: Infinity });
  let lastY = scrollY;
  let rate = 1;
  const tick = () => {
    requestAnimationFrame(tick);
    const dy = scrollY - lastY;
    lastY = scrollY;
    const target = motion.paused ? 0 : 1 + Math.max(-8, Math.min(8, dy / 12));
    rate += (target - rate) * 0.1;
    if (target === 0 && Math.abs(rate) < 0.02) rate = 0;
    anim.playbackRate = rate;
  };
  requestAnimationFrame(tick);
}

/** Banda de lema + banda de servicios (nombres reales) que corren en sentidos opuestos. */
export function initBand() {
  const band = qs('#band');
  if (!band) return;
  const sep = () => h('i', { 'aria-hidden': 'true' }, '✦');

  const row = (cls, nodes) => h('div', { class: `band__row ${cls}` },
    h('div', { class: 'band__track' }, h('div', { class: 'band__group' }, nodes)));

  const slogan = [];
  for (let n = 0; n < 2; n += 1) {
    slogan.push(h('span', {}, 'Tu rostro'), sep(), h('em', {}, 'Tu estilo'), sep(), h('span', {}, 'Tu mejor versión'), sep());
  }
  const names = services.flatMap((s) => [h('span', {}, s.name), sep()]);

  const r1 = row('band__row--big', slogan);
  const r2 = row('band__row--line', names);
  band.append(r1, r2);
  makeMarquee(r1.firstElementChild, { speed: 90, dir: -1 });
  makeMarquee(r2.firstElementChild, { speed: 70, dir: 1 });
}
