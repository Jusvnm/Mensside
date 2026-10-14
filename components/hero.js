import { qs } from '../lib/dom.js';
import { picture } from '../lib/images.js';
import { business } from '../data/business.js';

export function initHero() {
  const fig = qs('#hero-photo');
  const img = picture('hero/hero-retrato', {
    alt: 'Barbero de MENSSIDE peinando el cabello de un cliente',
    eager: true,
  });
  if (img) fig.append(img);

  qs('#hero-meta').textContent =
    `${business.hours.short} ${business.hours.text} · ${business.sunday.text}`;
}
