import { h, qs } from '../lib/dom.js';
import { folder, showPending, placeholder } from '../lib/images.js';
import { captions } from '../data/images.js';
import { makeMarquee } from './marquee.js';
import { pairs } from '../data/pairs.js';

// Galería en carrete: las fotos corren solas (más rápido al hacer scroll, se detienen al pasar el cursor).
// Fuente: todo archivo guardado en src/assets/photos/galeria/ (orden alfabético).
// Prefijo "ref-" en el nombre = "Referencia visual" (no es un trabajo del salón).
export function initGallery() {
  const section = qs('#galeria');
  const flow = qs('#gallery-flow');

  const inPairs = new Set(pairs.filter((d) => d.authorized).flatMap((d) => [d.before, d.after])); // ya se muestran en Antes y después
  const items = folder('galeria').filter(({ id }) => !inPairs.has(id)).map(({ id, url }) => {
    const name = id.split('/').pop();
    const isRef = name.startsWith('ref-');
    return {
      url, kind: isRef ? 'referencia' : 'real',
      caption: captions[id] ?? name.replace(/^ref-/, '').replace(/^\d+-/, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()),
      alt: name.replace(/^\d+-/, '').replace(/-/g, ' '),
    };
  });
  if (showPending && items.length < 4) items.push({ pending: 'galeria/06-trabajo', kind: 'real', caption: 'Pendiente: más trabajos reales' });
  if (!items.length) return;

  const figs = items.map((it, n) => h('figure', { class: 'rf', style: `--n:${n}` },
    h('div', { class: 'rf__media' },
      it.pending ? placeholder(it.pending, 'Foto pendiente')
        : h('img', { src: it.url, alt: it.alt, loading: 'eager', decoding: 'async', draggable: 'false' })),
    h('figcaption', {}, h('span', { class: `g__kind g__kind--${it.kind}` }, it.kind === 'real' ? 'Foto real' : 'Referencia visual'), ` · ${it.caption}`)));

  const track = h('div', { class: 'reel__track' }, h('div', { class: 'reel__group' }, figs));
  flow.append(track);
  flow.classList.add('reel');
  section.hidden = false;
  makeMarquee(track, { speed: 60, dir: -1, pauseOnHover: true });
}
