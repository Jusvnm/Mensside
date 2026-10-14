// Día / noche: efecto visual por hora local o preferencia. NO refleja el horario del salón.
const root = document.documentElement;

export function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const sync = () => {
    const night = root.dataset.theme === 'night';
    btn.setAttribute('aria-pressed', String(night));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', night ? '#0a0a0b' : '#f1ede6');
  };
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'night' ? 'day' : 'night';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    try { localStorage.setItem('ms-theme', next); } catch { /* ignorar */ }
    setTimeout(() => root.classList.remove('theme-anim'), 500);
    sync();
  });
  sync();
}
