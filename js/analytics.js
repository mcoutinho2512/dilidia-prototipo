/* =============================================================
   Camada de eventos analíticos (preparação)
   - Nada é enviado para fora do navegador nesta fase.
   - Eventos vão para window.DL_EVENTS; uma ferramenta futura
     (GA4, Plausible, Umami...) entra via DL.analytics.setAdapter().
   - Só propriedades da lista abaixo passam: nada de dados pessoais,
     observações ou texto das mensagens.
   - whatsapp_click NÃO é venda: é só intenção de contato.
   ============================================================= */
(function (root) {
'use strict';

const EVENTS = {
  menu_view: ['unit'],
  menu_search: ['unit', 'term_length', 'results'],
  unit_select: ['unit', 'source'],
  cart_add: ['unit', 'category', 'item', 'qty'],
  cart_remove: ['unit', 'category', 'item'],
  order_started: ['unit', 'lines', 'has_unpriced'],
  whatsapp_click: ['unit', 'context', 'demo'],
  chat_open: [],
  chat_option: ['node'],
  location_click: ['unit'],
  cart_abandon: ['unit', 'lines']
};

let adapter = null;
const cfg = () => ((root.DL && root.DL.config && root.DL.config.analytics) || { enabled: true, debug: false });

function track(name, props) {
  if (!cfg().enabled || !EVENTS[name]) return;
  const clean = {};
  EVENTS[name].forEach(k => {
    const v = props && props[k];
    if (typeof v === 'number' || typeof v === 'boolean') clean[k] = v;
    else if (typeof v === 'string') clean[k] = v.slice(0, 60);
  });
  const ev = { event: name, ts: new Date().toISOString(), ...clean };
  root.DL_EVENTS = root.DL_EVENTS || [];
  root.DL_EVENTS.push(ev);
  if (cfg().debug && root.console) root.console.info('[DL analytics]', ev);
  if (adapter) { try { adapter(ev); } catch (e) { /* adaptador nunca derruba o site */ } }
}

const api = { track, EVENTS, setAdapter: fn => { adapter = typeof fn === 'function' ? fn : null; } };
root.DL = root.DL || {};
root.DL.analytics = api;
if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
