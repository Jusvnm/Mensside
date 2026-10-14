import { h, qs } from '../lib/dom.js';
import { picture } from '../lib/images.js';
import { barbers } from '../data/barbers.js';
import { setBarber, subscribe } from '../lib/state.js';
import { initReveal } from '../lib/motion.js';

export function initBarbers() {
  const list = qs('#barber-list');
  const items = barbers.map((b, n) => {
    const media = h('span', { class: 'barber__media' });
    const img = picture(`barberos/${b.id}`, { alt: `${b.name}, barbero de MENSSIDE` });
    if (img) media.append(img);
    const btn = h('button', { class: 'barber__btn', type: 'button', 'aria-pressed': 'false', 'aria-label': `Elegir a ${b.name} para mi cita` },
      media,
      h('span', { class: 'barber__name' }, b.name),
      h('span', { class: 'barber__role' }, b.specialty ?? 'Barbero'),
      h('span', { class: 'barber__pick', 'aria-hidden': 'true' }, 'Elegir'));
    btn.addEventListener('click', () => { setBarber(b.id); });
    const li = h('li', { class: 'barber', 'data-reveal': '', style: `--i:${n}` }, btn);
    list.append(li);
    return { btn, id: b.id };
  });
  subscribe(({ barber }) => items.forEach(({ btn, id }) => {
    const on = barber === id;
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
    btn.querySelector('.barber__pick').textContent = on ? 'Elegido' : 'Elegir';
  }));
  initReveal(list);
}
