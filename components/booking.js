import { h, qs } from '../lib/dom.js';
import { picture } from '../lib/images.js';
import { barbers } from '../data/barbers.js';
import { services, money } from '../data/services.js';
import { business } from '../data/business.js';
import { subscribe, toggleService, setBarber, setDate, setTime, total, reset } from '../lib/state.js';
import logoUrl from '../assets/brand/logo.png';

// RESERVA: prepara el resumen de la cita y lleva a Barbizo. No reserva ni muestra disponibilidad.
// Qué funciona: elegir servicios y barbero (solo en este navegador) y abrir Barbizo.
// Qué depende de Barbizo (sin verificar): fecha/hora, disponibilidad, confirmación, preselección por URL.
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const hour12 = (h24) => `${((h24 + 11) % 12) + 1}:00 ${h24 < 12 ? 'am' : 'pm'}`;
// Franjas de 1 h dentro del horario del salón (la captura de Barbizo muestra franjas horarias).
const slotHours = () => {
  const from = parseInt(business.hours.open, 10);
  const to = parseInt(business.hours.close, 10);
  return Array.from({ length: to - from }, (_, k) => from + k);
};
const longDate = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/^./, (c) => c.toUpperCase());

// EJEMPLO VISUAL de la selección de fecha y hora. No consulta ni afirma disponibilidad.
function demoPicker(st, view, onView) {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + view, 1);
  const y = base.getFullYear();
  const m = base.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (base.getDay() + 6) % 7; // la semana empieza en lunes
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());

  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push(h('span', { 'aria-hidden': 'true' }));
  for (let d = 1; d <= days; d += 1) {
    const key = iso(y, m, d);
    const closed = new Date(y, m, d).getDay() === 0; // domingo cerrado (confirmado)
    const off = closed || key < todayIso;
    cells.push(h('button', {
      type: 'button', class: `cal__d ${st.date === key ? 'is-on' : ''} ${key === todayIso ? 'is-today' : ''}`,
      disabled: off ? '' : null, 'aria-pressed': String(st.date === key), 'data-k': `d-${key}`,
      title: closed ? 'Domingo cerrado' : null, 'aria-label': `${d} de ${MONTHS[m]}${closed ? ', domingo cerrado' : ''}`,
      onclick: () => setDate(key),
    }, String(d)));
  }

  return h('div', { class: 'demo' },
    h('p', { class: 'demo__note' }, h('span', { class: 'demo__tag' }, 'Ejemplo visual'),
      ' Así se verá elegir fecha y hora. La disponibilidad real se consulta en Barbizo.'),
    h('div', { class: 'cal' },
      h('div', { class: 'cal__head' },
        h('button', { type: 'button', class: 'cal__nav', 'aria-label': 'Mes anterior', disabled: view <= 0 ? '' : null, 'data-k': 'prev', onclick: () => onView(view - 1) }, '‹'),
        h('strong', {}, `${MONTHS[m]} ${y}`),
        h('button', { type: 'button', class: 'cal__nav', 'aria-label': 'Mes siguiente', disabled: view >= 2 ? '' : null, 'data-k': 'next', onclick: () => onView(view + 1) }, '›')),
      h('div', { class: 'cal__grid', role: 'group', 'aria-label': 'Días' },
        ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((w) => h('span', { class: 'cal__w', 'aria-hidden': 'true' }, w)), cells)),
    h('div', { class: 'slots', role: 'group', 'aria-label': 'Horas de ejemplo' },
      slotHours().map((hr) => {
        const key = `${String(hr).padStart(2, '0')}:00`;
        return h('button', {
          type: 'button', class: `slot-btn ${st.time === key ? 'is-on' : ''}`, 'aria-pressed': String(st.time === key),
          disabled: st.date ? null : '', 'data-k': `t-${key}`, onclick: () => setTime(key),
        }, hour12(hr));
      })));
}

export function initBooking() {
  const stepsEl = qs('#steps');
  const ticket = qs('#ticket');
  const float = qs('#float-cta');
  const reserva = qs('#reserva');

  let view = 0; // meses desde el actual (0–2)
  let last = null;
  let inView = false;
  const syncFloat = () => { float.hidden = !(float.dataset.has && !inView); };

  const onView = (v) => { view = v; render(last); };
  const render = (st) => {
    last = st;
    const focusKey = document.activeElement?.dataset?.k;
    const chosen = st.services.map((id) => services.find((s) => s.id === id));
    const barber = st.barber === 'any' ? null : barbers.find((b) => b.id === st.barber);

    // ---- Pasos
    stepsEl.innerHTML = '';
    stepsEl.append(
      step(1, 'Servicios', chosen.length > 0,
        chosen.length
          ? h('ul', { class: 'chips' }, chosen.map((s) => h('li', {},
              h('button', { type: 'button', class: 'chip', 'aria-label': `Quitar ${s.name}`, onclick: () => toggleService(s.id) }, s.name, h('i', { 'aria-hidden': 'true' }, '×')))))
          : h('p', {}, 'Aún no has elegido servicios. ', h('a', { href: '#servicios' }, 'Elegir servicios'))),
      step(2, 'Barbero', Boolean(st.barber),
        h('div', { class: 'pick' },
          h('button', { type: 'button', class: `pick__any ${st.barber === 'any' ? 'is-on' : ''}`, 'data-k': 'b-any', 'aria-pressed': String(st.barber === 'any'), onclick: () => setBarber('any') }, 'El próximo disponible'),
          h('ul', { class: 'pick__list' }, barbers.map((b) => h('li', {},
            h('button', { type: 'button', class: `pick__b ${st.barber === b.id ? 'is-on' : ''}`, 'data-k': `b-${b.id}`, 'aria-pressed': String(st.barber === b.id), onclick: () => setBarber(b.id) },
              h('span', { class: 'pick__av' }, picture(`barberos/${b.id}`, { alt: '' })), h('span', {}, b.name.split(' ')[0]))))))),
      step(3, 'Fecha y hora', Boolean(st.date && st.time), demoPicker(st, view, onView), 'Ejemplo'),
      step(4, 'Confirmación', false,
        h('p', {}, 'La cita se confirma en Barbizo, donde te pedirán iniciar sesión.'), 'En Barbizo'));

    // ---- Ticket (resumen; no es una cita confirmada)
    ticket.innerHTML = '';
    ticket.append(
      h('div', { class: 'ticket__stub' },
        barber ? h('span', { class: 'ticket__av' }, picture(`barberos/${barber.id}`, { alt: '' })) : h('span', { class: 'ticket__av ticket__av--empty', 'aria-hidden': 'true' }, '?'),
        h('span', { class: 'ticket__who' }, st.barber === 'any' ? 'Próximo disponible' : barber ? barber.name : 'Barbero por elegir')),
      h('div', { class: 'ticket__main' },
        h('img', { src: logoUrl, alt: 'MENSSIDE Hair Salon', class: 'ticket__logo' }),
        chosen.length
          ? h('ul', { class: 'ticket__list' }, chosen.map((s) => h('li', {}, h('span', {}, s.name), h('span', {}, money(s.price)))))
          : h('p', { class: 'ticket__empty' }, 'Tu resumen aparecerá aquí.'),
        st.date ? h('p', { class: 'ticket__when' }, h('span', {}, 'Fecha y hora (ejemplo)'), h('strong', {}, `${longDate(st.date)}${st.time ? ` · ${hour12(parseInt(st.time, 10))}` : ''}`)) : null,
        chosen.length ? h('p', { class: 'ticket__total' }, h('span', {}, 'Total de referencia'), h('strong', {}, money(total()))) : null,
        h('a', { class: 'btn btn--solid ticket__cta', href: business.booking.url, target: '_blank', rel: 'noopener noreferrer' },
          'Continuar en Barbizo ', h('span', { 'aria-hidden': 'true' }, '↗')),
        chosen.length || st.barber || st.date ? h('button', { class: 'link-btn', type: 'button', onclick: reset }, 'Vaciar selección') : null),
      h('div', { class: 'ticket__side' },
        h('span', { class: 'label' }, 'Sede'), h('strong', {}, 'Cerro Colorado'),
        h('span', { class: 'ticket__status' }, 'Resumen — no es una cita confirmada')));

    // ---- Botón flotante
    if (chosen.length) {
      float.textContent = `${chosen.length} ${chosen.length === 1 ? 'servicio' : 'servicios'} · ${money(total())} — Ver mi cita`;
      float.dataset.has = '1';
    } else { float.dataset.has = ''; }
    syncFloat();
    if (focusKey) stepsEl.querySelector(`[data-k="${focusKey}"]`)?.focus({ preventScroll: true });
  };
  subscribe(render);

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; syncFloat(); }, { threshold: 0.2 }).observe(reserva);
  float.addEventListener('click', () => reserva.scrollIntoView({ behavior: 'smooth' }));
}

function step(n, title, done, body, badge) {
  return h('li', { class: `step ${done ? 'is-done' : ''}` },
    h('span', { class: 'step__n', 'aria-hidden': 'true' }, done ? '✓' : String(n)),
    h('div', { class: 'step__body' },
      h('h3', {}, title, badge ? h('span', { class: 'step__badge' }, badge) : null),
      body));
}
