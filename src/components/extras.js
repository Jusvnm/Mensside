import { qs, qsa, reduceMotion } from '../lib/dom.js';
import { spinOnScroll } from './marquee.js';

// Detalles de juego: cursor que sigue con retraso, botones magnéticos, tarjetas que se inclinan y sello giratorio.
export function initExtras() {
  toTop();
  spinOnScroll(qs('.badge__ring'));
  if (reduceMotion()) return;
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) { labels(); cursor(); magnetic(); tilt(); }
}

// Botón "volver arriba" con anillo de progreso (aparece tras bajar un poco).
function toTop() {
  const btn = document.getElementById('to-top');
  if (!btn) return;
  const sync = () => btn.classList.toggle('is-on', scrollY > 800);
  addEventListener('scroll', sync, { passive: true });
  sync();
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }));
}

// Texto que acompaña al cursor sobre elementos interactivos.
function labels() {
  const map = { '.reel': 'Pausa', '.cmp': 'Arrastra', '.barber__btn': 'Elegir', '.svc__row': 'Añadir', '.badge': 'Reservar' };
  Object.entries(map).forEach(([sel, text]) => qsa(sel).forEach((el) => { el.dataset.cursor = text; }));
}

function cursor() {
  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);
  let tx = -100, ty = -100, x = tx, y = ty;
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; ring.classList.add('is-on'); }, { passive: true });
  document.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
  document.addEventListener('pointerover', (e) => {
    const tagged = e.target.closest('[data-cursor]');
    ring.dataset.label = tagged ? tagged.dataset.cursor : '';
    ring.classList.toggle('has-label', Boolean(tagged));
    ring.classList.toggle('is-link', !tagged && Boolean(e.target.closest('a,button,[role="slider"]')));
  });
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
  const loop = () => {
    requestAnimationFrame(loop);
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    ring.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  };
  requestAnimationFrame(loop);
}

function magnetic() {
  const els = qsa('.btn, .icon-btn, .badge');
  els.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = 'translate .12s linear';
      el.style.translate = `${(dx * 0.18).toFixed(1)}px ${(dy * 0.28).toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'translate .5s cubic-bezier(.2,.7,.2,1)';
      el.style.translate = '0 0';
    });
  });
}

function tilt() {
  qsa('.barber__media, .cmp, .ticket').forEach((el) => {
    const amp = el.classList.contains('barber__media') ? 10 : 3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .1s linear';
      el.style.transform = `perspective(700px) rotateY(${(px * amp).toFixed(2)}deg) rotateX(${(-py * amp).toFixed(2)}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .6s cubic-bezier(.2,.7,.2,1)';
      el.style.transform = '';
    });
  });
}
