import { h, qs } from '../lib/dom.js';
import { picture, slotUrl } from '../lib/images.js';
import { services, money } from '../data/services.js';
import { subscribe, toggleService } from '../lib/state.js';
import { initReveal } from '../lib/motion.js';

// Foto real que ilustra cada servicio (miniatura en la fila y vista previa al pasar el cursor).
// Se toma de src/assets/photos/<ruta>; un servicio sin foto queda sin miniatura.
const previewSlot = {
  'corte-clasico': 'galeria/09-peinado-clasico',
  'corte-moderno': 'galeria/08-degradado-en-la-nuca',
  'corte-barba': 'galeria/13-corte-y-barba',
  'barba': 'galeria/10-perfilado-de-barba',
  'limpieza-facial': 'galeria/ref-12-limpieza-facial', // referencia visual hasta confirmar que es del salón
  'corte-nino': 'galeria/06-corte-de-nino',
};

function thumb(id) {
  const url = id && slotUrl(id);
  return url ? h('img', { src: url, alt: '', loading: 'lazy', decoding: 'async' }) : null;
}

export function initServices() {
  const list = qs('#svc-list');
  const photo = qs('#services-photo');
  const featured = picture('servicios/destacado', { alt: 'Servicios de MENSSIDE' });
  if (featured) photo.append(featured); else photo.remove();

  // Vista previa flotante que sigue al puntero (solo si existen las imágenes)
  const preview = h('div', { class: 'svc-preview', 'aria-hidden': 'true' }, h('img', { alt: '' }));
  document.body.append(preview);
  const pimg = preview.firstChild;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const rows = services.map((s, i) => {
    const btn = h('button', { class: 'svc__row', type: 'button', 'aria-pressed': 'false', 'data-id': s.id },
      h('span', { class: 'svc__n' }, String(i + 1).padStart(2, '0')),
      h('span', { class: 'svc__main' },
        h('span', { class: 'svc__kind' }, s.kind),
        h('span', { class: 'svc__name' }, s.name),
        h('span', { class: 'svc__desc' }, s.desc)),
      h('span', { class: 'svc__thumb', 'aria-hidden': 'true' }, thumb(previewSlot[s.id])),
      h('span', { class: 'svc__price' }, money(s.price)),
      h('span', { class: 'svc__add', 'aria-hidden': 'true' }, h('i'), h('i')),
      h('span', { class: 'visually-hidden svc__state' }, 'Añadir a mi cita'));
    btn.addEventListener('click', () => toggleService(s.id));

    if (canHover && previewSlot[s.id] && slotUrl(previewSlot[s.id])) {
      btn.addEventListener('pointerenter', () => { pimg.src = slotUrl(previewSlot[s.id]); preview.classList.add('is-on'); });
      btn.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
      btn.addEventListener('pointermove', (e) => { preview.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 120}px, 0)`; });
    }
    const li = h('li', { class: 'svc', 'data-reveal': '', style: `--i:${i % 3}` }, btn);
    list.append(li);
    return { btn, id: s.id };
  });

  subscribe(({ services: chosen }) => {
    rows.forEach(({ btn, id }) => {
      const on = chosen.includes(id);
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('is-on', on);
      btn.querySelector('.svc__state').textContent = on ? 'Quitar de mi cita' : 'Añadir a mi cita';
    });
  });
  initReveal(list);
}
