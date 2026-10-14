# MENSSIDE — Imágenes: qué falta, dónde va y prompts para Antigravity (Gemini)

**Flujo (manual, verificado):** Claude Code programa e integra. Antigravity/Gemini solo genera o mejora imágenes.
No hay integración automática Claude Code ↔ Antigravity (`agy models` no lista modelos de imagen; MCP vacío).
1. Genera la imagen en Antigravity con el prompt de abajo.
2. Guárdala en la ruta indicada, **con ese nombre** (jpg, png, webp o avif).
3. Aparece sola en la web (`npm run dev`). No hay que tocar código.
4. Dile a Claude "revisa las imágenes" para validar tamaño, peso y calidad.

Mientras falte un archivo, en `npm run dev` (o con `?slots` en la URL) se ve un hueco rotulado con la ruta exacta.
En la versión publicada, lo que no existe simplemente no se muestra.

Ruta base: `D:\claude\WebSites\Mensside\src\assets\photos\`

## 1. Fotografías REALES (prioridad 1 — no generar)
| Archivo | Uso | Proporción | Estado |
|---|---|---|---|
| `hero\hero-retrato.*` | Hero | vertical (≥ 700 px) | **Hecho** (682×1024). Se muestra en blanco y negro. |
| `barberos\<id>.*` (6) | Barberos y reserva | 1:1, fondo liso | **Hecho** (1024×1024). |
| `servicios\destacado.*` | Columna de Servicios | 4:5 | **Hecho** (768×1024). |
| `galeria\NN-nombre.*` | Galería (carrete en movimiento) y miniaturas de Servicios | cualquiera | **12 hechas** (2 van en el comparador antes/después). Más trabajos reales = más carrete. Pies de foto en `src/data/images.js`. |
| `galeria\ref-12-limpieza-facial.jpg` | Carrete y miniatura de Limpieza facial | 3:4 | Se rotula "Referencia visual" porque no muestra marca MENSSIDE. Si es del salón, quitar el prefijo `ref-` del nombre (y en `services.js` / `images.js`). |
| `resultados\par-01-antes.*` y `par-01-despues.*` | Antes/después | 4:5, mismo encuadre | Pendiente. Solo con autorización del cliente. |
| `servicios\destacado.*` | Columna de Servicios | 4:5 | Opcional. |

Ids de barberos: `yorvis-brito`, `cristian-rodriguez`, `diego-lopez`, `fabian-jimenez`, `zonte`, `bryan`.
En galería, un archivo que empiece por `ref-` se rotula "Referencia visual" (no es un trabajo del salón).

## 2. Imágenes CONCEPTUALES (prioridad 2 — opcionales)
**Estilo común (bloqueo de consistencia):** casi monocromo (negro, carbón, hueso), una sola luz cálida lateral desde la izquierda,
poca profundidad de campo, grano fino de película, sin texto, sin logotipos, sin marcas de agua, sin rostros reconocibles.
Dejar zona despejada para texto donde se indica.

### `fondos\herramientas.jpg` — 21:9, mín. 2400 px de ancho
Función: fondo tenue detrás del título de Servicios. Zona despejada: mitad izquierda.
> Cinematic macro photograph of barber tools resting on a matte-black leather station: a straight razor, steel scissors, a clipper and a comb. Single warm key light from the left, shallow depth of field, deep shadows, near-monochrome palette of black, charcoal and bone white, fine film grain. Keep the left half of the frame dark and empty. No people, no text, no logos, no watermark. 21:9.

### `fondos\sillon.jpg` — **hecho con una foto real** (sillones del salón, 1500×2000). Ya no hace falta generar nada.

### Vistas previas de servicio — 4:5, mín. 1200 × 1500 px (aparecen al pasar el cursor sobre cada servicio)
Mismo estilo, sin rostros: detalle de manos y herramientas, o nuca.
- `servicios\corte-clasico.jpg`
  > Close-up of a barber's hands cutting hair with steel scissors and a comb on the back of a client's head, no face visible, near-monochrome, warm side light from the left, shallow depth of field, fine film grain, no text, no logos. 4:5.
- `servicios\corte-moderno.jpg`
  > Close-up of a clipper blending a skin fade on the back of a client's head, no face visible, near-monochrome, warm side light from the left, shallow depth of field, fine film grain, no text, no logos. 4:5.
- `servicios\barba.jpg` (también se usa para "Corte y barba")
  > Close-up of a straight razor shaping the edge of a beard, only jawline and hand visible, no full face, near-monochrome, warm side light from the left, shallow depth of field, fine film grain, no text, no logos. 4:5.
- `servicios\limpieza-facial.jpg`
  > A folded white towel steaming beside a small dark ceramic bowl on a black stone surface, spa-like barber facial care mood, near-monochrome, warm side light from the left, shallow depth of field, fine film grain, no people, no text, no logos. 4:5.

## 3. Solo si no se consiguen los originales
Subir la foto real a Antigravity y pedir (guardar como `<mismo-nombre>.jpg`, sustituyendo al archivo pequeño):
> Upscale and denoise this photograph 2x. Preserve every face, tattoo, text and detail exactly as it is. Do not add, remove or restyle anything.

Revisar siempre que no cambie rasgos de las personas.

## 4. Lo que NO se genera
- Antes/después: nunca generados; deben ser clientes reales con autorización.
- Retratos de barberos y fotos del salón: reales.
- Logo: oficial, sin redibujar. El PNG tenía una sombra suave incorporada; se retiró y se amplió 2× (la versión original está en `src/assets/brand/logo-original.png`). Un SVG oficial sigue siendo lo ideal.
- El SVG de texto (Optima/Cinzel) no se usa: depende de fuentes del sistema y no reproduce las letras del logo oficial.
