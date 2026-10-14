import { h, qs, reduceMotion } from '../lib/dom.js';
import { scissors } from './scissors.js';
import { business, route, mapLinks } from '../data/business.js';
import { showPending } from '../lib/images.js';

export function initLocation() {
  contactRows();
  mapBlock();
}

function contactRows() {
  const ul = qs('#contact-rows');
  const rows = [
    ['MENSSIDE Hair Salon', null],
    [business.address.line, mapLinks.open],
    [business.city, null],
    [`${business.hours.short} ${business.hours.text}`, null],
    [business.sunday.text, null],
  ];
  if (business.phone.value) rows.push([business.phone.value, `tel:${business.phone.value}`]);
  rows.forEach(([text, href], n) => {
    ul.append(h('li', { class: 'crow', 'data-reveal': '', style: `--i:${n}` },
      href ? h('a', { href, target: href.startsWith('http') ? '_blank' : null, rel: 'noopener noreferrer' }, text) : h('span', {}, text)));
  });
  ul.append(h('li', { class: 'crow crow--cta', 'data-reveal': '', style: `--i:${rows.length}` },
    h('a', { href: '#reserva' }, 'Reserva ', h('i', { class: 'arrow', 'aria-hidden': 'true' }, '→'))));
  if (showPending && !business.phone.value) {
    ul.append(h('li', { class: 'crow crow--pending' }, h('span', {}, 'Teléfono / WhatsApp — pendiente (no se muestra en producción)')));
  }
}

function mapBlock() {
  const block = qs('#map-block');

  // --- Mapa embebido (con indicador de carga real)
  const frameWrap = h('div', { class: 'map__frame' });
  const loader = scissors('Cargando mapa');
  const iframe = h('iframe', {
    title: 'Mapa de ubicación de MENSSIDE en Cerro Colorado', src: mapLinks.embed, loading: 'lazy',
    referrerpolicy: 'no-referrer-when-downgrade', allowfullscreen: '',
  });
  let loaded = false;
  iframe.addEventListener('load', () => { loaded = true; clearTimeout(fail); loader.classList.add('is-done'); setTimeout(() => loader.remove(), 400); });
  // Estado de error real: si el mapa no responde en 10 s, se ofrece el enlace directo.
  const fail = setTimeout(() => {
    if (loaded) return;
    loader.classList.add('is-error');
    loader.replaceChildren(h('div', { class: 'scissors__error', role: 'alert' },
      h('p', {}, 'No se pudo cargar el mapa.'),
      h('a', { class: 'btn', href: mapLinks.open, target: '_blank', rel: 'noopener noreferrer' }, 'Abrir en Google Maps ↗')));
  }, 10000);
  frameWrap.append(iframe, loader);

  // --- Esquema de la ruta real (geometría OSRM, proyección equirectangular)
  const W = 640, H = 360, P = 56;
  const [bs0, bn0, bw0, be0] = route.from.bbox;
  const lats = route.coords.map((c) => c[1]).concat(route.from.lat, route.to.lat, bs0, bn0);
  const lngs = route.coords.map((c) => c[0]).concat(route.from.lng, route.to.lng, bw0, be0);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = (maxLng - minLng) * k, spanY = maxLat - minLat;
  const s = Math.min((W - 2 * P) / spanX, (H - 2 * P) / spanY);
  const ox = (W - spanX * s) / 2, oy = (H - spanY * s) / 2;
  const pt = (lng, lat) => [ox + (lng - minLng) * k * s, oy + (maxLat - lat) * s];
  const pts = route.coords.map(([lng, lat]) => pt(lng, lat));
  const d = pts.map((p, n) => `${n ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const a = pts[0];
  const [bs, bn, bw, be] = route.from.bbox;
  const [rx1, ry1] = pt(bw, bn);
  const [rx2, ry2] = pt(be, bs);
  const b = pt(route.to.lng, route.to.lat);

  const svg = `
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="route-t route-d" class="route__svg">
    <title id="route-t">Ruta a pie desde ${route.from.name} hasta MENSSIDE</title>
    <desc id="route-d">Aproximadamente ${route.distanceM} metros: ${route.steps.map((x) => x.text).join('; ')}.</desc>
    <rect x="${rx1.toFixed(1)}" y="${ry1.toFixed(1)}" width="${(rx2 - rx1).toFixed(1)}" height="${(ry2 - ry1).toFixed(1)}" class="route__plaza" />
    <path d="${d}" class="route__base" />
    <path d="${d}" class="route__line" pathLength="1" />
    <g class="route__a"><circle cx="${a[0]}" cy="${a[1]}" r="7" /><text x="${a[0] + 16}" y="${a[1] + 6}">${route.from.name}</text></g>
    <g class="route__b"><circle class="pulse" cx="${b[0]}" cy="${b[1]}" r="9" /><circle cx="${b[0]}" cy="${b[1]}" r="6" /><text x="${b[0] - 14}" y="${b[1] - 14}" text-anchor="end">MENSSIDE</text></g>
  </svg>`;

  const steps = h('ol', { class: 'route__steps' }, route.steps.map((st) =>
    h('li', {}, st.text, st.meters ? h('span', {}, `${st.meters} m`) : null)));

  const links = h('div', { class: 'route__links' },
    h('a', { class: 'btn btn--solid', href: mapLinks.fromMe, target: '_blank', rel: 'noopener noreferrer' }, 'Cómo llegar desde mi ubicación ↗'),
    h('a', { class: 'btn', href: mapLinks.fromPlaza, target: '_blank', rel: 'noopener noreferrer' }, `Desde ${route.from.name} ↗`),
    h('a', { class: 'btn', href: mapLinks.waze, target: '_blank', rel: 'noopener noreferrer' }, 'Abrir en Waze ↗'));

  const card = h('div', { class: 'route', 'data-reveal': '' },
    h('p', { class: 'label' }, `Desde ${route.from.name} · ≈ ${route.distanceM} m a pie`),
    h('div', { html: svg }),
    steps,
    h('p', { class: 'route__credit' }, 'Esquema de la ruta calculado con datos de OpenStreetMap (© colaboradores de OpenStreetMap). Las indicaciones son orientativas.'),
    links);

  block.append(frameWrap, card);

  // Animación de la línea al entrar en pantalla
  if (!reduceMotion()) {
    new IntersectionObserver(([e], io) => { if (e.isIntersecting) { card.classList.add('is-drawn'); io.disconnect(); } }, { threshold: 0.35 }).observe(card);
  } else card.classList.add('is-drawn');
}
