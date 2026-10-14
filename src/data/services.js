// Servicios y precios transcritos de las capturas del sistema de reservas (Barbizo).
// La duración de cada servicio NO figura en las capturas: no se muestra.
export const services = [
  { id: 'corte-clasico', kind: 'Corte', name: 'Corte de cabello clásico', price: 50,
    desc: 'Corte tradicional con tijera o máquina, pensado para un estilo limpio, definido y de acabado profesional.' },
  { id: 'corte-moderno', kind: 'Corte', name: 'Corte de cabello moderno', price: 50,
    desc: 'Cortes actuales como degradado, mullet o mod cut, diseñados para un look fresco, marcado y en tendencia.' },
  { id: 'corte-barba', kind: 'Corte + barba', name: 'Corte y barba', price: 60,
    desc: 'Incluye corte completo y perfilado de barba, logrando un estilo uniforme, prolijo y totalmente renovado.' },
  { id: 'barba', kind: 'Barba', name: 'Barba', price: 25,
    desc: 'Rebajado y perfilado detallado para dar forma, definición y un acabado limpio que realce tu apariencia.' },
  { id: 'limpieza-facial', kind: 'Cuidado facial', name: 'Limpieza facial', price: 70,
    desc: 'Limpieza profunda con exfoliación, vapor y mascarilla para renovar la piel y dejarla suave e hidratada.' },
  { id: 'corte-nino', kind: 'Niños', name: 'Corte de niño', price: 50,
    desc: 'Corte de cabello para niños.' },
];

export const money = (n) => `S/ ${n.toFixed(2)}`;
