import { h, reduceMotion } from '../lib/dom.js';
import logoUrl from '../assets/brand/logo.png';

// Intro de marca: el logo oficial aparece centrado y la pantalla se parte en dos "lados" (MENS | SIDE).
// Se muestra una vez por sesión; se omite con prefers-reduced-motion o ?nointro.
export function initIntro() {
  const params = new URLSearchParams(location.search);
  let seen = false;
  try { seen = sessionStorage.getItem('ms-intro') === '1'; } catch { /* ignorar */ }
  if (reduceMotion() || params.has('nointro') || seen) return Promise.resolve();

  const half = (side) =>
    h('div', { class: `intro__half intro__half--${side}` },
      h('div', { class: 'intro__stage' }, h('img', { src: logoUrl, alt: '', class: 'intro__logo' })));

  const el = h('div', { class: 'intro', 'aria-hidden': 'true' }, half('l'), half('r'), h('i', { class: 'intro__seam' }));
  document.body.append(el);
  document.documentElement.classList.add('is-intro');
  const main = document.getElementById('contenido');
  main?.setAttribute('inert', '');

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.remove();
      main?.removeAttribute('inert');
      document.documentElement.classList.remove('is-intro');
      try { sessionStorage.setItem('ms-intro', '1'); } catch { /* ignorar */ }
      resolve();
    };
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => { el.classList.add('is-out'); document.documentElement.classList.add('is-intro-out'); }, 1900);
    setTimeout(finish, 3000);
    el.addEventListener('click', () => { el.classList.add('is-out'); setTimeout(finish, 700); });
  });
}
