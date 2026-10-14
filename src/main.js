import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/components.css';
import './styles/motion.css';

import logoUrl from './assets/brand/logo.png';
import { qsa } from './lib/dom.js';
import { initTheme } from './lib/theme.js';
import { initReveal, initHeroMotion, initFooterMark } from './lib/motion.js';
import { initIntro } from './components/intro.js';
import { initHeader } from './components/header.js';
import { initHero } from './components/hero.js';
import { initServices } from './components/services.js';
import { initStyleLab } from './components/stylelab.js';
import { initBarbers } from './components/barbers.js';
import { initCompare } from './components/compare.js';
import { initGallery } from './components/gallery.js';
import { initReviews } from './components/reviews.js';
import { initBooking } from './components/booking.js';
import { initLocation } from './components/location.js';
import { initFooter } from './components/footer.js';
import { initBand, initMotionToggle } from './components/marquee.js';
import { initExtras } from './components/extras.js';
import { initScrollFX } from './lib/scroll.js';
import { picture } from './lib/images.js';

qsa('img[data-logo]').forEach((img) => { img.src = logoUrl; });

initTheme();
initHeader();
initHero();
initServices();
initStyleLab();
initBarbers();
initCompare();
initGallery();
initReviews();
initBooking();
initLocation();
initFooter();
initHeroMotion();
initFooterMark();

// Fondo de la reserva (foto real con parallax)
const bgHost = document.getElementById('booking-bg');
const bgImg = picture('fondos/sillon', { alt: '' });
if (bgHost && bgImg) {
  const wrap = document.createElement('div');
  wrap.className = 'booking__parallax';
  wrap.dataset.speed = '-0.12';
  wrap.append(bgImg);
  bgHost.append(wrap);
}

initMotionToggle();
initBand();
initExtras();
initScrollFX();

// El hero entra cuando termina la intro (o de inmediato si no hay intro).
const intro = initIntro();
document.documentElement.classList.add('ready');
Promise.resolve(intro).then(() => initReveal());
