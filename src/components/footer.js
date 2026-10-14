import { h, qs } from '../lib/dom.js';
import { business } from '../data/business.js';

export function initFooter() {
  const cols = qs('#footer-cols');
  const link = (href, text, ext) => h('a', { href, target: ext ? '_blank' : null, rel: ext ? 'noopener noreferrer' : null }, text);
  cols.append(
    h('div', { class: 'fcol' },
      h('strong', {}, 'Ubicación'),
      h('span', {}, business.address.line),
      h('span', {}, business.city)),
    h('div', { class: 'fcol' },
      h('strong', {}, 'Navegación'),
      link('#servicios', 'Servicios'), link('#stylelab', 'Style Lab'), link('#barberos', 'Barberos'), link('#ubicacion', 'Ubicación')),
    h('div', { class: 'fcol' },
      h('strong', {}, 'Síguenos'),
      link(business.social.instagram, 'Instagram', true), link(business.social.facebook, 'Facebook', true)),
    h('div', { class: 'fcol' },
      h('strong', {}, 'Horario'),
      h('span', {}, `${business.hours.days}`),
      h('span', {}, business.hours.text),
      h('span', {}, business.sunday.text),
      link('#reserva', 'Reservar cita')));
}
