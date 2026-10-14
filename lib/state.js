import { services } from '../data/services.js';

// Selección de la cita en curso. Solo vive en el navegador (sessionStorage): no reserva nada.
const KEY = 'ms-booking';
const listeners = new Set();
let state = { services: [], barber: null, date: null, time: null }; // barber: id | 'any' | null; date 'YYYY-MM-DD', time 'HH:MM' (solo ejemplo visual)

try {
  const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
  if (saved && Array.isArray(saved.services)) {
    state = { services: saved.services.filter((id) => services.some((s) => s.id === id)), barber: saved.barber ?? null, date: saved.date ?? null, time: saved.time ?? null };
  }
} catch { /* sin almacenamiento: continúa en memoria */ }

const emit = () => {
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignorar */ }
  listeners.forEach((fn) => fn(state));
};

export const getState = () => state;
export const subscribe = (fn) => { listeners.add(fn); fn(state); return () => listeners.delete(fn); };

export function toggleService(id) {
  const has = state.services.includes(id);
  state = { ...state, services: has ? state.services.filter((s) => s !== id) : [...state.services, id] };
  emit();
}
export function addService(id) {
  if (!state.services.includes(id)) { state = { ...state, services: [...state.services, id] }; emit(); }
}
export function setBarber(id) { state = { ...state, barber: state.barber === id ? null : id }; emit(); }
export function setDate(d) { const same = state.date === d; state = { ...state, date: same ? null : d, time: same ? null : state.time }; emit(); }
export function setTime(t) { state = { ...state, time: state.time === t ? null : t }; emit(); }
export function reset() { state = { services: [], barber: null, date: null, time: null }; emit(); }

export const total = () => state.services.reduce((n, id) => n + (services.find((s) => s.id === id)?.price ?? 0), 0);
