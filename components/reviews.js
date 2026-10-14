import { h, qs, reduceMotion } from '../lib/dom.js';
import { reviews } from '../data/reviews.js';
import { showPending } from '../lib/images.js';

// Reseñas: solo las verificadas se publican. Las MUESTRAS (verified:false) se ven únicamente en desarrollo / ?slots.
export function initReviews() {
  const list = reviews.filter((r) => r.verified || showPending);
  if (!list.length) return;
  const section = qs('#resenas');
  const stage = qs('#reviews-stage');
  const n = list.length;
  let i = 0;
  let timer = null;

  const words = (text) => text.split(' ').flatMap((w, k) => [h('span', { class: 'w', style: `--k:${k}` }, w), ' ']);
  const quote = (r, cls) => h('figure', { class: cls },
    h('blockquote', {}, cls === 'rv-lead' ? words(r.text) : r.text),
    h('figcaption', {}, r.who, !r.verified ? h('em', { class: 'sample-tag' }, ' MUESTRA · reemplazar por reseña real') : null));

  const dots = h('div', { class: 'rv-dots', role: 'tablist', 'aria-label': 'Reseñas' },
    list.map((_, k) => h('button', { type: 'button', role: 'tab', 'aria-label': `Reseña ${k + 1}`, onclick: () => go(k, true) })));

  const render = () => {
    stage.querySelectorAll('.rv-lead,.rv-corner').forEach((e) => e.remove());
    const lead = quote(list[i], 'rv-lead');
    stage.append(lead);
    if (n > 1) stage.append(quote(list[(i + 1) % n], 'rv-corner rv-corner--l'));
    if (n > 2) stage.append(quote(list[(i + 2) % n], 'rv-corner rv-corner--r'));
    [...dots.children].forEach((d, k) => d.setAttribute('aria-selected', String(k === i)));
    requestAnimationFrame(() => stage.classList.add('is-on'));
  };
  const go = (k, user = false) => {
    stage.classList.remove('is-on');
    setTimeout(() => { i = (k + n) % n; render(); }, reduceMotion() ? 0 : 320);
    if (user) restart();
  };
  const restart = () => { clearInterval(timer); if (n > 1 && !reduceMotion()) timer = setInterval(() => go(i + 1), 7500); };

  stage.append(dots);
  render();
  section.hidden = false;
  stage.addEventListener('pointerenter', () => clearInterval(timer));
  stage.addEventListener('pointerleave', restart);
  stage.addEventListener('focusin', () => clearInterval(timer));
  restart();
}
