// Datos del negocio. Estado de cada dato:
//   confirmado  -> lo confirmó el cliente
//   instagram   -> figura en el perfil oficial de Instagram
//   pendiente   -> no existe todavía; no se muestra en producción
export const business = {
  name: 'MENSSIDE',
  tagline: 'HAIR SALON',
  city: 'Cerro Colorado, Arequipa',
  address: { line: 'Calle Miguel Grau 110', status: 'confirmado' },
  geo: { lat: -16.375972, lng: -71.559667, status: 'confirmado' }, // aportado por el cliente
  hours: { days: 'Lunes a sábado', short: 'Lun–Sáb', open: '10:00', close: '20:00', text: '10:00 am – 8:00 pm', status: 'confirmado' },
  sunday: { text: 'Domingo cerrado', status: 'confirmado' },
  phone: { value: null, status: 'pendiente' },
  whatsapp: { value: null, status: 'pendiente' },
  social: {
    instagram: 'https://www.instagram.com/menssidesalon/',
    facebook: 'https://www.facebook.com/menssidesalon/',
  },
  // Único enlace público de reserva verificado (viene de la bio de Instagram).
  booking: { url: 'https://app.barbizo.com/login', provider: 'Barbizo', status: 'instagram', demo: true }, // demo: la selección de fecha y hora es solo un ejemplo visual
};

// Plaza de referencia (OpenStreetMap) y ruta peatonal real hacia el salón.
// Fuente: Nominatim + OSRM (datos © OpenStreetMap contributors, ODbL). Calculada una vez y guardada aquí.
export const route = {
  from: { name: 'Plaza Las Américas', lat: -16.3767277, lng: -71.5603334, bbox: [-16.3772552, -16.376206, -71.5608906, -71.5597728] }, // [sur, norte, oeste, este]
  to: { name: 'MENSSIDE', lat: -16.375972, lng: -71.559667 },
  distanceM: 202,
  coords: [
    [-71.560854, -16.376834], [-71.560947, -16.376414], [-71.560968, -16.376325], [-71.560906, -16.376314],
    [-71.560008, -16.376132], [-71.559904, -16.376112], [-71.559647, -16.376054],
  ],
  steps: [
    { text: 'Sal de la plaza por la Calle Mariano Melgar', meters: 58 },
    { text: 'Gira a la derecha por la Calle Miguel Grau', meters: 144 },
    { text: 'MENSSIDE queda a tu izquierda', meters: 0 },
  ],
};

export const mapLinks = {
  embed: `https://maps.google.com/maps?q=${business.geo.lat},${business.geo.lng}&z=18&hl=es&output=embed`,
  open: `https://www.google.com/maps/search/?api=1&query=${business.geo.lat},${business.geo.lng}`,
  fromMe: `https://www.google.com/maps/dir/?api=1&destination=${business.geo.lat},${business.geo.lng}&travelmode=walking`,
  fromPlaza: `https://www.google.com/maps/dir/?api=1&origin=${route.from.lat},${route.from.lng}&destination=${business.geo.lat},${business.geo.lng}&travelmode=walking`,
  waze: `https://waze.com/ul?ll=${business.geo.lat},${business.geo.lng}&navigate=yes`,
};
