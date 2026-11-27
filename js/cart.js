/* =============================================================
   Carrinho de pedidos — núcleo (sem interface)
   Funções puras para preço, resumo e mensagem do WhatsApp,
   e um store com persistência em localStorage.
   Regras: nunca inventa preço; item sem preço confirmado = null;
   sem total definitivo se houver item sem preço; sem taxa de entrega;
   um carrinho pertence a UMA unidade.
   ============================================================= */
(function (root) {
'use strict';

const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const round2 = v => Math.round(v * 100) / 100;

/* Preço unitário de um item com tamanho e adicionais. null = a consultar. */
function unitPrice(item, cat, sizeIdx, addonIdxs) {
  let base = cat && cat.pz ? (item.v ? item.v[sizeIdx] : undefined) : item.p;
  if (base == null || Number.isNaN(base)) return null;
  for (const i of (addonIdxs || [])) {
    const opt = cat.addons && cat.addons.options[i];
    if (!opt) continue;
    const p = Array.isArray(opt.price) ? opt.price[sizeIdx] : opt.price;
    if (p == null) return null;
    base += p;
  }
  return round2(base);
}

/* Nome legível da linha, conforme o tipo de item. */
function lineName(item, cat, variation) {
  if (cat.id === 'pizzas') return 'Pizza ' + item.n;
  if (cat.id === 'doces') return 'Pizza doce ' + item.n;
  if (cat.id === 'massas' && variation) return variation + ' — ' + item.n;
  if (item.opts && variation) return item.n + ': ' + variation;
  return item.n;
}

function summarize(lines) {
  let subtotal = 0, count = 0, hasUnpriced = false;
  lines.forEach(l => { count += l.qty; if (l.unitPrice == null) hasUnpriced = true; else subtotal += l.unitPrice * l.qty; });
  subtotal = round2(subtotal);
  return { count, subtotal, hasUnpriced, total: hasUnpriced ? null : subtotal };
}

function describeLine(l) {
  let s = `${l.qty}x ${l.name}`;
  if (l.size) s += ` (${l.size})`;
  if (l.addons && l.addons.length) s += ' + ' + l.addons.join(' + ');
  s += l.unitPrice == null ? ' — valor a consultar' : ' — ' + brl(round2(l.unitPrice * l.qty));
  return s;
}

/* Mensagem do WhatsApp, gerada a partir das linhas do carrinho. */
function buildMessage(unitName, lines, notes) {
  const sum = summarize(lines);
  const out = ['Olá! Gostaria de consultar este pedido.', '', `Unidade: ${unitName}`, '', 'Itens:'];
  lines.forEach(l => { out.push('- ' + describeLine(l)); if (l.obs) out.push(`  Obs.: ${l.obs}`); });
  out.push('');
  if (sum.hasUnpriced) {
    out.push(sum.subtotal > 0 ? `Subtotal dos itens com preço no cardápio: ${brl(sum.subtotal)}. Há itens com valor a consultar.` : 'Os valores dos itens precisam ser consultados.');
  } else {
    out.push(`Subtotal pelo cardápio do site: ${brl(sum.subtotal)} (sem taxa de entrega).`);
  }
  if (notes && notes.trim()) { out.push(''); out.push(`Observações: ${notes.trim()}`); }
  out.push('', 'Gostaria de confirmar os valores, a disponibilidade e as condições de entrega ou retirada.', '', 'Obrigado!');
  return out.join('\n');
}

const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/* ---------- Store ---------- */
function createStore(opts) {
  const storage = opts.storage, key = opts.key, maxAgeMs = (opts.maxAgeHours || 24) * 3600e3;
  let state = { unit: null, lines: [], notes: '', ts: Date.now() };
  const listeners = [];

  try {
    const raw = storage && storage.getItem(key);
    if (raw) { const s = JSON.parse(raw); if (s && Array.isArray(s.lines) && Date.now() - (s.ts || 0) < maxAgeMs) state = { unit: s.unit || null, lines: s.lines, notes: s.notes || '', ts: s.ts }; }
  } catch (e) { /* armazenamento indisponível: carrinho só em memória */ }

  const save = () => { state.ts = Date.now(); try { storage && storage.setItem(key, JSON.stringify(state)); } catch (e) { /* ignora */ } listeners.forEach(fn => fn(state)); };
  const same = (a, b) => a.key === b.key && a.size === b.size && a.variation === b.variation && (a.addons || []).join('|') === (b.addons || []).join('|') && (a.obs || '') === (b.obs || '');

  return {
    get: () => state,
    subscribe: fn => listeners.push(fn),
    /* Retorna false se a linha for de outra unidade (a interface deve confirmar antes). */
    add(line) {
      if (state.unit && state.unit !== line.unit && state.lines.length) return false;
      state.unit = line.unit;
      const hit = state.lines.find(l => same(l, line));
      if (hit) hit.qty = Math.min(99, hit.qty + line.qty);
      else state.lines.push({ ...line, id: line.id || Math.random().toString(36).slice(2, 10) });
      save(); return true;
    },
    setQty(id, qty) { const l = state.lines.find(x => x.id === id); if (!l) return; if (qty <= 0) state.lines = state.lines.filter(x => x.id !== id); else l.qty = Math.min(99, qty); if (!state.lines.length) state.notes = ''; save(); },
    remove(id) { state.lines = state.lines.filter(x => x.id !== id); if (!state.lines.length) state.notes = ''; save(); },
    setNotes(t) { state.notes = String(t || '').slice(0, 200); save(); },
    setUnit(u) { state.unit = u; save(); },
    clear(unit) { state = { unit: unit || null, lines: [], notes: '', ts: Date.now() }; save(); },
    summary: () => summarize(state.lines)
  };
}

const api = { unitPrice, lineName, summarize, describeLine, buildMessage, waLink, createStore, brl };
root.DL = root.DL || {};
root.DL.cart = api;
if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
