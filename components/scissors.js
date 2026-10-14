import { h } from '../lib/dom.js';

// Indicador de carga de marca. Se usa solo durante esperas reales (p. ej. el mapa embebido).
export function scissors(label = 'Cargando') {
  const svg = `
  <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false">
    <g class="sc-blade sc-blade--a"><path d="M32 34 L58 10" /><circle cx="22" cy="46" r="7" /></g>
    <g class="sc-blade sc-blade--b"><path d="M32 34 L58 58" /><circle cx="22" cy="18" r="7" /></g>
    <circle cx="32" cy="34" r="1.6" class="sc-pin" />
  </svg>`;
  return h('div', { class: 'scissors', role: 'status' },
    h('span', { html: svg }),
    h('span', { class: 'scissors__label' }, `${label}…`));
}
