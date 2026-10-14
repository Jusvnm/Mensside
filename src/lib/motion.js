import { qsa, reduceMotion } from './dom.js';

/** Revela con una entrada suave los elementos [data-reveal] al entrar en pantalla. */
export function initReveal(root = document) {
  const els = qsa('[data-reveal]:not(.is-in)', root);
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/** Progreso de scroll del hero (--p) y puntero (--mx/--my) como variables CSS. Solo transform/opacity en CSS. */
export function initHeroMotion() {
  const hero = document.getElementById('inicio');
  if (!hero || reduceMotion()) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    hero.style.setProperty('--p', p.toFixed(3));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  if (matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', (x - 0.5).toFixed(3));
      hero.style.setProperty('--my', (y - 0.5).toFixed(3));
      hero.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      hero.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    }, { passive: true });
  }
}

/** Escala del monumento del pie al llegar (0.94 -> 1). */
export function initFooterMark() {
  const mark = document.querySelector('.footer__mark');
  if (!mark || reduceMotion()) return;
  const io = new IntersectionObserver(([e]) => {
    mark.style.setProperty('--fs', e.isIntersecting ? e.intersectionRatio.toFixed(2) : '0');
  }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
  io.observe(document.querySelector('.footer'));
}
