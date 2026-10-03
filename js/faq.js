// Question-picker assistant. No free text, no network.
import { FAQ } from './config.js';
export function initFaq() {
  const root = document.getElementById('ai'); if (!root) return;
  const btn = root.querySelector('.ai-btn'), panel = root.querySelector('.ai-panel'), list = root.querySelector('.ai-q'), out = root.querySelector('.ai-a');
  list.innerHTML = FAQ.map((f, i) => `<li><button type="button" data-i="${i}">${f[0]}</button></li>`).join('');
  const set = open => { panel.hidden = !open; btn.setAttribute('aria-expanded', open); if (open) list.querySelector('button').focus(); };
  btn.addEventListener('click', () => set(panel.hidden));
  root.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); btn.focus(); } });
  list.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    list.querySelectorAll('button').forEach(x => x.removeAttribute('aria-current')); b.setAttribute('aria-current', 'true');
    out.textContent = FAQ[b.dataset.i][1];
  });
}