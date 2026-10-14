// Registro de imágenes: dónde va cada una. Basta con guardar el archivo con ese nombre
// (cualquier extensión jpg/png/webp/avif) en src/assets/photos/<carpeta>/ y aparece sola.
// kind: real = fotografía auténtica · concepto = generada en Antigravity · referencia = inspiración rotulada
// Pies de foto de la galería (clave = ruta sin extensión). Si falta, se deduce del nombre del archivo.
export const captions = {
  'galeria/01-el-salon': 'El salón',
  'galeria/02-el-equipo-en-accion': 'El equipo en acción',
  'galeria/03-los-sillones-y-la-sala-de-espera': 'Los sillones y la sala de espera',
  'galeria/04-rizos-con-volumen': 'Rizos con volumen',
  'galeria/05-mullet-rizado-con-degradado': 'Mullet rizado con degradado',
  'galeria/06-corte-de-nino': 'Corte de niño',
  'galeria/07-degradado-en-las-patillas': 'Degradado en las patillas',
  'galeria/08-degradado-en-la-nuca': 'Degradado en la nuca',
  'galeria/09-peinado-clasico': 'Peinado clásico',
  'galeria/10-perfilado-de-barba': 'Perfilado de barba',
  'galeria/11-barba-en-el-salon': 'Barba en el salón',
  'galeria/ref-12-limpieza-facial': 'Limpieza facial',
  'galeria/13-corte-y-barba': 'Corte y barba',
};

export const slots = [
  { id: 'hero/hero-retrato', ratio: '1/1', kind: 'real', where: 'Hero (retrato protagonista)', have: true },
  { id: 'fondos/herramientas', ratio: '21/9', kind: 'concepto', where: 'Fondo de Servicios (opcional)' },
  { id: 'fondos/sillon', ratio: '3/4', kind: 'real', where: 'Fondo de Reserva', have: true },
  { id: 'servicios/destacado', ratio: '4/5', kind: 'real', where: 'Servicios, columna izquierda' },
  { id: 'servicios/corte-clasico', ratio: '4/5', kind: 'concepto', where: 'Vista previa al pasar sobre el servicio' },
  { id: 'servicios/corte-moderno', ratio: '4/5', kind: 'concepto', where: 'Vista previa del servicio' },
  { id: 'servicios/barba', ratio: '4/5', kind: 'concepto', where: 'Vista previa del servicio (también Corte y barba)' },
  { id: 'servicios/limpieza-facial', ratio: '4/5', kind: 'concepto', where: 'Vista previa del servicio' },
  { id: 'barberos/<id>', ratio: '1/1', kind: 'real', where: 'Retrato de cada barbero (6)', have: true },
  { id: 'resultados/par-01-antes', ratio: '4/5', kind: 'real', where: 'Antes y después (requiere autorización)' },
  { id: 'resultados/par-01-despues', ratio: '4/5', kind: 'real', where: 'Antes y después (requiere autorización)' },
];
