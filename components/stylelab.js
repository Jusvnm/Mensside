import { h, qs, reduceMotion } from '../lib/dom.js';
import { steps, recommend } from '../data/styleLab.js';
import { services, money } from '../data/services.js';
import { addService } from '../lib/state.js';

// Iconos SVG propios (trazo simple) para cada opción.
const stroke = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const icons = {
  ovalado: `<ellipse cx="24" cy="24" rx="13" ry="19" ${stroke}/>`,
  redondo: `<circle cx="24" cy="24" r="18" ${stroke}/>`,
  cuadrado: `<rect x="9" y="6" width="30" height="36" rx="8" ${stroke}/>`,
  alargado: `<ellipse cx="24" cy="24" rx="11" ry="21" ${stroke}/>`,
  corazon: `<path d="M8 15C8 5 24 4 24 12c0-8 16-7 16 3 0 12-10 20-16 28C18 35 8 27 8 15Z" ${stroke}/>`,
  liso: `<path d="M14 6v36M24 6v36M34 6v36" ${stroke}/>`,
  ondulado: `<path d="M14 6c6 8-6 14 0 22s-6 8 0 14M24 6c6 8-6 14 0 22s-6 8 0 14M34 6c6 8-6 14 0 22s-6 8 0 14" ${stroke}/>`,
  rizado: `<path d="M12 10c8-6 12 6 4 6s-6-10 2-10M26 10c8-6 12 6 4 6s-6-10 2-10M12 28c8-6 12 6 4 6s-6-10 2-10M26 28c8-6 12 6 4 6s-6-10 2-10" ${stroke}/>`,
  fino: `<path d="M12 8v32M18 8v32M24 8v32M30 8v32M36 8v32" ${stroke} stroke-width="0.9"/>`,
  clasico: `<path d="M8 30c0-12 8-20 16-20s16 8 16 20M8 30h32M14 22c4-3 10-4 20 0" ${stroke}/>`,
  moderno: `<path d="M8 32c0-14 7-22 16-22s16 8 16 22M8 32h32M8 26h32M8 20h32" ${stroke}/>`,
  atrevido: `<path d="M6 30c2-14 8-22 18-22 8 0 14 6 18 22M6 30c-2 6 2 10 6 10M42 30c2 6-2 10-6 10M16 14l6-6 4 6 6-6 4 8" ${stroke}/>`,
  bajo: `<circle cx="24" cy="24" r="3" fill="currentColor"/><circle cx="14" cy="24" r="3" ${stroke}/><circle cx="34" cy="24" r="3" ${stroke}/>`,
  medio: `<circle cx="14" cy="24" r="3" fill="currentColor"/><circle cx="24" cy="24" r="3" fill="currentColor"/><circle cx="34" cy="24" r="3" ${stroke}/>`,
  alto: `<circle cx="14" cy="24" r="3" fill="currentColor"/><circle cx="24" cy="24" r="3" fill="currentColor"/><circle cx="34" cy="24" r="3" fill="currentColor"/>`,
  no: `<path d="M14 22c0 12 5 18 10 18s10-6 10-18" ${stroke} stroke-dasharray="2 4"/>`,
  si: `<path d="M12 18c0 18 5 24 12 24s12-6 12-24c-4 4-8 5-12 5s-8-1-12-5Z" ${stroke}/>`,
  solo: `<path d="M12 18c0 18 5 24 12 24s12-6 12-24c-4 4-8 5-12 5s-8-1-12-5Z" fill="currentColor" stroke="none" opacity=".9"/>`,
};
const icon = (id) => h('span', { class: 'lab__icon', html: `<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">${icons[id] ?? ''}</svg>` });

export function initStyleLab() {
  const panel = qs('#lab-panel');
  let i = 0;
  const answers = {};

  const render = () => {
    panel.innerHTML = '';
    panel.classList.remove('is-result');
    const step = steps[i];

    const progress = h('ol', { class: 'lab__progress', 'aria-label': `Paso ${i + 1} de ${steps.length}` },
      steps.map((_, n) => h('li', { class: n < i ? 'is-done' : n === i ? 'is-now' : '' })));

    const back = i > 0 ? h('button', { class: 'link-btn', type: 'button', onclick: () => { i -= 1; render(); } }, '← Atrás') : null;

    const group = h('div', { class: 'lab__options', role: 'radiogroup', 'aria-label': step.title },
      step.options.map((o, n) => {
        const btn = h('button', {
          class: 'lab__opt', type: 'button', role: 'radio', 'aria-checked': String(answers[step.key] === o.id),
          style: `--i:${n}`,
          onclick: () => {
            answers[step.key] = o.id;
            if (i < steps.length - 1) { i += 1; render(); } else { showResult(); }
          },
        }, icon(o.id), h('span', { class: 'lab__optlabel' }, o.label), o.note ? h('small', {}, o.note) : null);
        return btn;
      }));

    panel.append(
      h('div', { class: 'lab__head' }, h('span', { class: 'label' }, `Paso ${i + 1} / ${steps.length}`), back),
      progress,
      h('h3', { class: 'lab__q', tabindex: '-1' }, step.title),
      h('p', { class: 'lab__hint' }, step.hint),
      group);
    panel.classList.add('is-step');
    if (i > 0 || answers.face) panel.querySelector('.lab__q').focus({ preventScroll: true });
  };

  const showResult = () => {
    const r = recommend(answers);
    const svc = services.find((s) => s.id === r.serviceId);
    panel.innerHTML = '';
    panel.classList.add('is-result');

    const chips = steps.map((s) => {
      const o = s.options.find((x) => x.id === answers[s.key]);
      return h('li', {}, o?.label);
    });

    const card = h('article', { class: 'sheet' },
      h('div', { class: 'sheet__rail' },
        h('span', { class: 'snip', 'aria-hidden': 'true' }, '✂'),
        h('span', { class: 'label' }, 'Ficha de estilo'),
        h('ul', { class: 'sheet__chips' }, chips),
        h('p', { class: 'sheet__demo' }, 'Guía orientativa basada en tus respuestas. No es un análisis automático.')),
      h('div', { class: 'sheet__main' },
        h('p', { class: 'label' }, answers.beard === 'solo' ? 'Recomendación' : 'Corte recomendado'),
        h('h3', { class: 'sheet__title' }, r.title),
        r.alt ? h('p', { class: 'sheet__alt' }, 'Alternativa: ', h('em', {}, r.alt)) : null,
        h('ul', { class: 'sheet__notes' }, r.notes.map((n) => h('li', {}, n))),
        h('div', { class: 'sheet__svc' },
          h('span', { class: 'label' }, 'Servicio sugerido'),
          h('strong', {}, svc.name), h('span', {}, money(svc.price))),
        h('div', { class: 'sheet__actions' },
          h('a', {
            class: 'btn btn--solid', href: '#reserva',
            onclick: () => addService(r.serviceId),
          }, 'Añadir a mi cita'),
          h('button', { class: 'btn', type: 'button', onclick: () => { i = 0; Object.keys(answers).forEach((k) => delete answers[k]); render(); } }, 'Volver a empezar'))));
    panel.append(card);
    if (!reduceMotion()) card.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
    panel.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
  };

  render();
}
