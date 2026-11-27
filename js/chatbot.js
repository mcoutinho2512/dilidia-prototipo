/* =============================================================
   Chatbot por regras — motor e interface
   Textos e fluxos ficam em chatbot-flows.js. Histórico temporário
   em sessionStorage (some ao fechar a aba ou encerrar a conversa).
   ============================================================= */
(function () {
'use strict';
const DL = window.DL, C = DL.config, F = DL.chatFlows, U = C.units, track = DL.analytics.track;
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'dilidia-demo-chat-v1';
const el = { chat: $('#chat'), log: $('#chatLog'), opts: $('#chatOpts'), launch: $('#chatLaunch') };

let ss = null; try { ss = window.sessionStorage; } catch (e) { ss = null; }
let st = { history: [], unit: null, view: null };
try { const raw = ss && ss.getItem(KEY); if (raw) st = JSON.parse(raw); } catch (e) { /* ignora */ }
const save = () => { try { ss && ss.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignora */ } };

$('#chatTitle').textContent = F.title; $('#chatSub').textContent = F.subtitle;

const ctx = () => {
  const u = st.unit ? U[st.unit] : null;
  return { greeting: DL.hours.greeting(new Date(), C.timeZone), unit: u, demo: C.demoMode, phone: u ? u.phones[0][0] : '', hours: u ? DL.hours.status(u.hours, new Date(), C.timeZone) : null };
};
const isMobile = () => matchMedia('(max-width:600px)').matches;

function say(from, text) { st.history.push({ from, text }); if (st.history.length > 60) st.history = st.history.slice(-60); }
function renderLog() {
  el.log.innerHTML = st.history.map(m => `<div class="bub ${m.from === 'bot' ? 'bot' : 'me'}">${esc(m.text)}</div>`).join('');
  el.log.scrollTop = el.log.scrollHeight;
}
function currentOptions() {
  const v = st.view; if (!v) return [];
  if (v.type === 'unit') return Object.keys(U).map(k => ({ label: U[k].name, unit: k, then: v.pending })).concat([{ label: 'Voltar ao menu principal', go: 'start', sec: true }]);
  const node = F.nodes[v.id];
  const list = (node.options || []).map(o => ({ ...o }));
  if (node.unit && !list.some(o => o.changeUnit)) list.splice(list.length - 1, 0, { label: F.changeUnitLabel, go: v.id, changeUnit: true, sec: true });
  return list;
}
function renderOpts() {
  el.opts.innerHTML = currentOptions().map((o, i) => o.href
    ? `<a href="${esc(o.href(ctx()))}" target="_blank" rel="noopener" data-i="${i}">${esc(o.label)}</a>`
    : `<button type="button" data-i="${i}" class="${o.sec || o.go === 'start' ? 'sec' : ''}">${esc(o.label)}</button>`).join('');
}
function render() { renderLog(); renderOpts(); el.launch.classList.toggle('has-history', st.history.length > 0); save(); }

function runAction(a) {
  const app = DL.app; if (!app) return;
  if (a === 'showMenu') { app.showMenu(st.unit); if (isMobile()) minimize(); }
  else if (a === 'startOrder') { app.startOrder(st.unit, 'chat'); if (isMobile()) minimize(); }
  else if (a === 'openCart') { minimize(); app.openCart(); }
  else if (a === 'whatsappContact') { minimize(); app.whatsappContact(st.unit); }
}

function go(id, opts) {
  const node = F.nodes[id]; if (!node) return;
  if (opts && opts.changeUnit) st.unit = null;
  if (node.unit && !st.unit) { say('bot', F.unitQuestion); st.view = { type: 'unit', pending: id }; render(); return; }
  say('bot', node.text(ctx()));
  st.view = { type: 'node', id };
  render();
  if (node.action) runAction(node.action);
}

el.opts.addEventListener('click', e => {
  const b = e.target.closest('[data-i]'); if (!b) return;
  const o = currentOptions()[+b.dataset.i]; if (!o) return;
  if (o.href) { track('chat_option', { node: 'link' }); say('me', o.label); render(); return; } /* o link abre normalmente */
  say('me', o.label);
  if (o.unit) { st.unit = o.unit; track('unit_select', { unit: o.unit, source: 'chat' }); track('chat_option', { node: 'unit' }); go(o.then); return; }
  track('chat_option', { node: o.go || o.action || '' });
  if (o.action) { render(); runAction(o.action); return; }
  go(o.go, { changeUnit: o.changeUnit });
});

function open() {
  el.chat.classList.add('open'); el.chat.setAttribute('aria-hidden', 'false'); el.launch.setAttribute('aria-expanded', 'true'); document.body.classList.add('chat-open');
  track('chat_open', {});
  if (!st.history.length) go('start'); else render();
  setTimeout(() => { const f = el.opts.querySelector('button,a'); f && f.focus(); }, 60);
}
function minimize() {
  el.chat.classList.remove('open'); el.chat.setAttribute('aria-hidden', 'true'); el.launch.setAttribute('aria-expanded', 'false'); document.body.classList.remove('chat-open');
  el.launch.classList.toggle('has-history', st.history.length > 0);
}
function close() { st = { history: [], unit: null, view: null }; try { ss && ss.removeItem(KEY); } catch (e) { /* ignora */ } minimize(); el.launch.classList.remove('has-history'); el.launch.focus(); }

el.launch.addEventListener('click', () => (el.chat.classList.contains('open') ? minimize() : open()));
$('#chatMin').addEventListener('click', () => { minimize(); el.launch.focus(); });
$('#chatClose').addEventListener('click', close);
el.chat.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); minimize(); el.launch.focus(); } });
el.launch.classList.toggle('has-history', st.history.length > 0);

DL.chat = { open, minimize, close, go, state: () => st };
})();
