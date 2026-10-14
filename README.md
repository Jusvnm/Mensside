# MENSSIDE Hair Salon — prototipo web

Vite + JavaScript vanilla. Se ejecuta en local; la publicación (dominio y hosting) queda para una fase posterior.

```
npm install
npm run dev       # http://127.0.0.1:5173  (en desarrollo se ven los huecos de imágenes pendientes)
npm run build     # genera dist/
npm run preview   # http://127.0.0.1:4173  (como se vería publicado)
```

Parámetros útiles en la URL: `?nointro` (omite la intro), `?theme=day|night`, `?slots` (muestra huecos y reseñas de muestra).

## Estructura
```
index.html               secciones y SEO (JSON-LD con datos verificados)
src/main.js              arranque
src/data/                datos editables: negocio, servicios, barberos, reseñas, pares antes/después, Style Lab, imágenes
src/components/          un archivo por sección/componente
src/lib/                 utilidades: DOM, imágenes, estado de la cita, movimiento, scroll, tema
src/styles/              tokens (día/noche), base, secciones, componentes, movimiento
src/assets/brand/        logo oficial (logo-original.png = archivo original con sombra)
src/assets/photos/       fotos por carpeta; ver docs/IMAGENES.md
docs/IMAGENES.md         qué imágenes faltan y prompts para Antigravity
```

## Estado de los datos (src/data/business.js)
| Dato | Estado |
|---|---|
| Coordenadas | Confirmadas por el cliente |
| Domingo cerrado | Confirmado |
| Dirección (Calle Miguel Grau 110, Cerro Colorado) y horario Lun–Sáb 10:00 am – 8:00 pm | Confirmados por el cliente |
| Fotos (retratos, hero, salón, servicios, galería) | Aportadas por el cliente, optimizadas (JPG, sin metadatos) |
| Antes/después | Par real aportado por el cliente en `src/data/pairs.js` (`authorized: true`). Para más pares: guardar las fotos y añadir una entrada allí |
| Selección de fecha y hora | **Solo ejemplo visual** rotulado; no consulta disponibilidad (`booking.demo` en `business.js`) |
| Teléfono / WhatsApp | **No existen**: no se muestran |
| Servicios y precios | Transcritos de las capturas de Barbizo. Duraciones: no figuran, no se muestran |
| Barberos | Nombres y fotos aportados por el cliente. Especialidades: no verificadas, no se muestran |
| Reseñas | **No hay verificadas.** 3 muestras ocultas en producción (ver `src/data/reviews.js`) |
| Ruta desde Plaza Las Américas | Calculada con OpenStreetMap (Nominatim + OSRM), guardada en `business.js` |

## Reservas (honesto)
La web **no reserva ni muestra disponibilidad**. Prepara el resumen (servicios + barbero) en el navegador y abre
`https://app.barbizo.com/login`. Pendiente de verificar con Barbizo: enlace público por sede, parámetros en la URL, iframe, API.

## Movimiento
Bandas que corren en sentidos opuestos (aceleran al bajar y se invierten al subir), lema que se ilumina palabra a palabra,
sello giratorio en el hero, subrayado que se dibuja, foto del hero que "respira", carrete automático de la galería,
parallax en fondos y figuras flotantes (tijeras, peine), barberos que flotan y se inclinan con el cursor, botones magnéticos,
cursor con retraso y barra de progreso. Todo usa solo `transform`/`opacity`.
El botón ⏸ de la cabecera pausa todo; `prefers-reduced-motion` lo desactiva y las bandas pasan a ser desplazables a mano.

## Accesibilidad y rendimiento
`prefers-reduced-motion` desactiva animaciones; navegación por teclado con foco visible; enlace "Saltar al contenido";
tamaños táctiles ≥ 40 px; JS ≈ 15 kB gzip; fuentes autoalojadas (Instrument Serif y Hanken Grotesk).
El día/noche es solo un efecto visual y no refleja el horario del salón.
