import { qs, qsa } from '../lib/dom.js';

// Cabecera: se oculta al bajar y reaparece al subir; menú móvil a pantalla completa; enlace activo.
export function initHeader() {
  const header = qs('#header');
  const btn = qs('#menu-btn');
  const nav = qs('#nav');

  const setMenu = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    header.classList.toggle('is-menu', open);
    document.documentElement.classList.toggle('no-scroll', open);
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 860px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  let last = 0;
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('is-solid', y > 40);
      header.classList.toggle('is-hidden', y > 240 && y > last + 4 && !header.classList.contains('is-menu'));
      if (y < last - 4) header.classList.remove('is-hidden');
      last = y;
      ticking = false;
    });
  }, { passive: true });

  // Enlace activo según la sección visible
  const links = qsa('a', nav);
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const a = map.get(e.target.id);
      if (a && e.isIntersecting) { links.forEach((l) => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}
