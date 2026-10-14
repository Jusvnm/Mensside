import { h } from './dom.js';

// Descubre automáticamente las fotos guardadas en src/assets/photos/<carpeta>/<nombre>.<ext>
const files = import.meta.glob('/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const ROOT = '/src/assets/photos/';

/** En desarrollo, o con ?slots en la URL, los huecos sin imagen se muestran rotulados. */
export const showPending = import.meta.env.DEV || new URLSearchParams(location.search).has('slots');

export function slotUrl(id) {
  const key = Object.keys(files).find((f) => f.startsWith(`${ROOT}${id}.`));
  return key ? files[key] : null;
}

export function folder(name) {
  return Object.keys(files)
    .filter((f) => f.startsWith(`${ROOT}${name}/`))
    .sort()
    .map((f) => ({ id: f.slice(ROOT.length).replace(/\.[^.]+$/, ''), url: files[f] }));
}

export function placeholder(id, label = 'Imagen pendiente') {
  return h('div', { class: 'slot', 'data-slot': id },
    h('span', { class: 'slot__tag' }, label),
    h('code', {}, `src/assets/photos/${id}.jpg`));
}

/** <img> si el archivo existe; si no, un hueco rotulado (solo en desarrollo) o null. */
export function picture(id, { alt = '', eager = false, className = '' } = {}) {
  const url = slotUrl(id);
  if (url) {
    return h('img', { src: url, alt, class: className, decoding: 'async', loading: eager ? 'eager' : 'lazy', draggable: 'false' });
  }
  return showPending ? placeholder(id) : null;
}
