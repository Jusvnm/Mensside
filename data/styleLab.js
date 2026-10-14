// Style Lab DEMOSTRATIVO. Reglas fijas sobre opciones predefinidas: no es IA ni analiza fotos.
// Las sugerencias son orientaciones generales de barbería, no datos comerciales del salón.

export const steps = [
  { key: 'face', title: '¿Qué forma tiene tu rostro?', hint: 'Elige la que más se parezca.',
    options: [
      { id: 'ovalado', label: 'Ovalado' },
      { id: 'redondo', label: 'Redondo' },
      { id: 'cuadrado', label: 'Cuadrado' },
      { id: 'alargado', label: 'Alargado' },
      { id: 'corazon', label: 'Corazón' },
    ] },
  { key: 'hair', title: '¿Cómo es tu cabello?', hint: 'Al natural, sin peinar.',
    options: [
      { id: 'liso', label: 'Liso' },
      { id: 'ondulado', label: 'Ondulado' },
      { id: 'rizado', label: 'Rizado' },
      { id: 'fino', label: 'Fino o poco denso' },
    ] },
  { key: 'style', title: '¿Qué estilo buscas?', hint: 'Piensa en cómo quieres sentirte.',
    options: [
      { id: 'clasico', label: 'Clásico', note: 'Limpio, atemporal' },
      { id: 'moderno', label: 'Moderno', note: 'Actual, marcado' },
      { id: 'atrevido', label: 'Atrevido', note: 'Con carácter' },
    ] },
  { key: 'upkeep', title: '¿Cuánto mantenimiento aceptas?', hint: 'Entre visitas y peinado diario.',
    options: [
      { id: 'bajo', label: 'Poco', note: 'Me peino y salgo' },
      { id: 'medio', label: 'Moderado', note: 'Algo de producto' },
      { id: 'alto', label: 'Mucho', note: 'Me gusta cuidarlo' },
    ] },
  { key: 'beard', title: '¿Y la barba?', hint: 'Última pregunta.',
    options: [
      { id: 'no', label: 'Sin barba' },
      { id: 'si', label: 'Corte y barba' },
      { id: 'solo', label: 'Solo barba' },
    ] },
];

// [principal, alternativa] según estilo × cabello
const cuts = {
  clasico: {
    liso: ['Corte clásico lateral con raya', 'Taper clásico'],
    ondulado: ['Clásico texturizado a tijera', 'Taper clásico'],
    rizado: ['Clásico a tijera con volumen controlado', 'Taper en los laterales'],
    fino: ['Clásico corto peinado hacia atrás', 'Corte a tijera de forma natural'],
  },
  moderno: {
    liso: ['Degradado con textura arriba', 'Mod cut'],
    ondulado: ['Degradado medio con ondas definidas', 'Mullet corto'],
    rizado: ['Degradado bajo con rizos definidos', 'Mullet moderno'],
    fino: ['Degradado con flequillo texturizado', 'Mod cut'],
  },
  atrevido: {
    liso: ['Mullet moderno', 'Degradado alto con textura'],
    ondulado: ['Mullet con ondas', 'Degradado alto con volumen'],
    rizado: ['Mullet de rizos', 'Degradado alto con rizos arriba'],
    fino: ['Mod cut con flequillo largo', 'Mullet corto texturizado'],
  },
};

const faceNotes = {
  ovalado: 'Tu rostro admite casi cualquier forma: decide por comodidad y rutina.',
  redondo: 'Gana altura arriba y mantén los laterales cortos para alargar visualmente.',
  cuadrado: 'Suaviza los ángulos con textura arriba; los laterales limpios resaltan la mandíbula.',
  alargado: 'Evita demasiada altura: algo de volumen lateral o un flequillo equilibra las proporciones.',
  corazon: 'Equilibra frente y mandíbula con algo de largo arriba y laterales no demasiado rasurados.',
};

const hairNotes = {
  liso: 'Con cabello liso, la textura y el producto mate marcan la diferencia.',
  ondulado: 'Aprovecha el movimiento natural: menos peinado, más forma.',
  rizado: 'El rizo se define mejor con tijera y buena hidratación.',
  fino: 'Con poca densidad conviene un corte que dé cuerpo y evite pesar.',
};

const upkeepNotes = {
  bajo: 'Visita sugerida cada 6–8 semanas. Elige una versión simple, sin estilizado diario.',
  medio: 'Visita sugerida cada 4–6 semanas, con un poco de producto.',
  alto: 'Visita sugerida cada 2–4 semanas para mantener el contorno impecable.',
};

export function recommend(a) {
  if (a.beard === 'solo') {
    return {
      title: 'Perfilado y forma de barba',
      alt: null,
      serviceId: 'barba',
      notes: [faceNotes[a.face], upkeepNotes[a.upkeep]],
    };
  }
  const [main, alt] = cuts[a.style][a.hair];
  const serviceId = a.beard === 'si' ? 'corte-barba' : a.style === 'clasico' ? 'corte-clasico' : 'corte-moderno';
  return {
    title: main,
    alt,
    serviceId,
    notes: [faceNotes[a.face], hairNotes[a.hair], upkeepNotes[a.upkeep]],
  };
}
