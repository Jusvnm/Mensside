// Pares antes/después. before/after = ruta de la foto dentro de src/assets/photos (sin extensión).
// authorized: el cliente aportó las fotos y las presentó como el mismo cliente.
//   Pendiente: tener el consentimiento del cliente retratado por si lo pide.
// Los pares nuevos también pueden guardarse como resultados/par-NN-antes.* y resultados/par-NN-despues.* (se detectan solos).
export const pairs = [
  {
    before: 'galeria/04-rizos-con-volumen',
    after: 'galeria/05-mullet-rizado-con-degradado',
    caption: 'De cabello largo a mullet rizado con degradado',
    posBefore: '28% 22%',
    posAfter: '30% 28%',
    authorized: true,
  },
];
