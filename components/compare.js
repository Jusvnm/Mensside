import { h, qs } from '../lib/dom.js';
import { slotUrl, showPending, placeholder } from '../lib/images.js';
import { pairs as declared } from '../data/pairs.js';

// Comparador antes/después. Solo se muestra con pares reales guardados en
// src/assets/photos/resultados/par-NN-antes.* y par-NN-despues.* (con autorización del cliente).
// En desarrollo (o con ?slots) aparece con huecos rotulados para ver el componente.
export function initCompare() {
  const section = qs('#resultados');
  const stage = qs('#results-stage');
  const pairs = [];
  // 1) Pares declarados en src/data/pairs.js (solo los autorizados)
  declared.filter((d) => d.authorized).forEach((d, i) => {
    const before = slotUrl(d.before);
    const after = slotUrl(d.after);
    if (before && after) pairs.push({ before, after, k: `d${i}`, caption: d.caption, posBefore: d.posBefore, posAfter: d.posAfter });
  });
  // 2) Pares sueltos resultados/par-NN-antes.* y par-NN-despues.*
  for (let n = 1; n <= 6; n += 1) {
    const k = String(n).padStart(2, '0');
    const before = slotUrl(`resultados/par-${k}-antes`);
    const after = slotUrl(`resultados/par-${k}-despues`);
    if (before && after) pairs.push({ before, after, k });
  }
  if (!pairs.length && !showPending) return;
  if (!pairs.length) pairs.push({ before: null, after: null, k: '01' });

  pairs.forEach((p) => stage.append(buildSlider(p)));
  section.hidden = false;
}

function buildSlider({ before, after, k, caption, posBefore, posAfter }) {
  let pos = 50;
  const side = (url, id, tag, objPos) => {
    if (!url) return placeholder(id, tag);
    const img = h('img', { src: url, alt: `${tag} del corte`, draggable: 'false', loading: 'lazy', decoding: 'async' });
    if (objPos) img.style.objectPosition = objPos;
    return img;
  };

  const beforeLayer = h('div', { class: 'cmp__before' }, side(before, `resultados/par-${k}-antes`, 'Antes', posBefore));
  const handle = h('button', {
    class: 'cmp__handle', type: 'button', role: 'slider',
    'aria-label': 'Comparar antes y después', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '50',
  }, h('span', { 'aria-hidden': 'true' }, '‹ ›'));
  const el = h('div', { class: 'cmp', style: '--pos:50%' },
    h('div', { class: 'cmp__after' }, side(after, `resultados/par-${k}-despues`, 'Después', posAfter)),
    beforeLayer,
    h('span', { class: 'cmp__tag cmp__tag--l', 'aria-hidden': 'true' }, 'Antes'),
    h('span', { class: 'cmp__tag cmp__tag--r', 'aria-hidden': 'true' }, 'Después'),
    handle);

  const set = (v) => {
    pos = Math.min(100, Math.max(0, v));
    el.style.setProperty('--pos', `${pos}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(pos)));
  };
  const fromEvent = (e) => { const r = el.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };

  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-drag');
    fromEvent(e);
  });
  el.addEventListener('pointermove', (e) => { if (el.hasPointerCapture(e.pointerId)) fromEvent(e); });
  const end = (e) => { el.classList.remove('is-drag'); if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  handle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === 'ArrowLeft') { set(pos - step); e.preventDefault(); }
    if (e.key === 'ArrowRight') { set(pos + step); e.preventDefault(); }
    if (e.key === 'Home') { set(0); e.preventDefault(); }
    if (e.key === 'End') { set(100); e.preventDefault(); }
  });
  if (!caption) return el;
  return h('figure', { class: 'cmp-fig' }, el, h('figcaption', {}, h('span', { class: 'g__kind' }, 'Foto real'), ` · ${caption}`));
}
