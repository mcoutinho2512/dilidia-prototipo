/* =============================================================
   Di Lidia — interface da página (unidades, cardápio, carrinho,
   diálogos). Depende de config, menu, hours, analytics e cart.
   Expõe DL.app para o chatbot.
   ============================================================= */
(function () {
'use strict';
const DL = window.DL, C = DL.config, MENU = DL.menu, CART = DL.cart, track = DL.analytics.track;
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = CART.brl;
const ic = n => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const U = C.units;
const mapsUrl = u => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Di Lidia ' + U[u].address);
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

let storage = null;
try { storage = window.localStorage; storage.setItem('dl-t', '1'); storage.removeItem('dl-t'); } catch (e) { storage = null; }
const store = CART.createStore({ storage, key: C.cart.storageKey, maxAgeHours: C.cart.maxAgeHours });
let unit = store.get().unit || 'itaipu';
let orderStarted = false;

/* ---------------- anúncio para leitores de tela ---------------- */
const live = document.createElement('div');
live.className = 'sr'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live);
const announce = t => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); };

/* ---------------- unidades ---------------- */
function statusHtml(u) {
  const s = DL.hours.status(U[u].hours, new Date(), C.timeZone);
  const extra = s.state === 'open' ? ` <small>até ${esc(s.until)}</small>` : (s.opensAt ? ` <small>abre ${esc(s.when)} às ${esc(s.opensAt)}</small>` : '');
  return `<span class="status" data-state="${s.state}">${esc(s.label)}${extra}</span>`;
}
function renderUnits() {
  $('#unitsBox').innerHTML = Object.keys(U).map(k => {
    const u = U[k];
    const confirmed = u.hours && u.hours.weekly;
    return `<article class="unit reveal in" data-unit-card="${k}">
 <img src="${esc(C.imageBase + u.photo)}" alt="${esc(u.photoAlt)}" loading="lazy" width="540" height="386">
 <div class="body"><h3>${esc(u.fullName)}<small>${esc(u.subtitle)}</small></h3>
 <div data-status="${k}">${statusHtml(k)}</div>
 <dl>
  <div><dt>${ic('pin')}</dt><dd><a href="${mapsUrl(k)}" target="_blank" rel="noopener" data-loc="${k}">${esc(u.address)}</a></dd></div>
  <div><dt>${ic('tel')}</dt><dd>${u.phones.map(t => `<a href="tel:${t[1]}">${esc(t[0])}</a>`).join(' · ')}</dd></div>
  <div><dt>${ic('wa')}</dt><dd><button class="link" type="button" data-wa="${k}">WhatsApp ${esc(u.whatsappLabel)}</button></dd></div>
  <div><dt>${ic('ig')}</dt><dd><a href="https://www.instagram.com/${esc(u.instagram)}/" target="_blank" rel="noopener">@${esc(u.instagram)}</a></dd></div>
  <div><dt>${ic('clock')}</dt><dd>${confirmed ? 'Horários conforme a unidade' : 'Horário de funcionamento a confirmar por telefone com a unidade'}</dd></div>
 </dl>
 <div class="acts"><button class="btn btn-gold" type="button" data-act="order" data-unit="${k}">${ic('bag')}Pedir nesta unidade</button><a class="btn btn-line" href="${mapsUrl(k)}" target="_blank" rel="noopener" data-loc="${k}">Como chegar</a></div>
 </div></article>`;
  }).join('');
}
function refreshStatus() { Object.keys(U).forEach(k => { const el = document.querySelector(`[data-status="${k}"]`); if (el) el.innerHTML = statusHtml(k); }); }

/* ---------------- cardápio ---------------- */
const box = $('#menuBox'), chips = $('#chips'), q = $('#q');
function priceCell(v) { return v == null ? '<span class="fine">a consultar</span>' : brl(v); }
function renderMenu() {
  const term = norm(q.value.trim());
  const cats = MENU.units[unit].map(c => ({ ...c, it: term ? c.it.filter(i => norm(i.n + ' ' + (i.d || '') + ' ' + (i.opts || []).join(' ')).includes(term)) : c.it })).filter(c => c.it.length);
  chips.innerHTML = MENU.units[unit].map(c => `<button type="button" data-c="${c.id}">${esc(c.t)}</button>`).join('');
  $('#mUnit').innerHTML = `Cardápio e pedido da unidade <b>${esc(U[unit].name)}</b>`;
  box.innerHTML = cats.length ? cats.map(c => `<section class="cat" id="c-${c.id}"><h3>${esc(c.t)}</h3>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}${c.pz
    ? `<div class="scroll"><table class="pz"><thead><tr><th>Sabor</th>${MENU.SIZES.map(s => `<th>${s}</th>`).join('')}<th><span class="sr">Adicionar</span></th></tr></thead><tbody>${c.it.map(i => `<tr><td><b>${esc(i.n)}</b><small>${esc(i.d)}</small></td>${i.v.map((v, k) => `<td class="${k ? '' : 'f'}">${priceCell(v)}</td>`).join('')}<td class="a"><button class="add" type="button" data-add="${esc(i.key)}" aria-label="Adicionar ${esc(i.n)} ao pedido">+ Adicionar</button></td></tr>`).join('')}</tbody></table></div>`
    : `<div class="items">${c.it.map(i => `<div class="it"><b>${esc(i.n)}</b><span class="p">${priceCell(i.p)}</span><button class="add" type="button" data-add="${esc(i.key)}" aria-label="Adicionar ${esc(i.n)} ao pedido">+</button>${i.d || i.opts ? `<small>${esc(i.d || 'Sabores: ' + i.opts.join(', '))}</small>` : ''}</div>`).join('')}</div>`}</section>`).join('')
    : `<p class="empty">Nada encontrado para “${esc(q.value)}”. Tente outro sabor ou ingrediente.</p>`;
}
function goCat(id) { const el = document.getElementById('c-' + id) || $('#cardapio'); el.scrollIntoView({ behavior: 'smooth' }); }
function setMenuUnit(u, source) {
  unit = u;
  document.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.u === u)));
  if (!store.get().lines.length) store.setUnit(u);
  renderMenu(); renderCart();
  if (source !== 'init') track('unit_select', { unit: u, source: source || 'menu' });
}
/* Troca de unidade com pedido em andamento: pede confirmação. */
function requestUnit(u, source, then) {
  const st = store.get();
  if (u === unit && (!st.lines.length || st.unit === u)) { then && then(); return; }
  if (st.lines.length && st.unit && st.unit !== u) {
    openDialog({
      title: 'Trocar de unidade?',
      body: `<p class="desc" style="margin:0">Seu pedido tem ${st.lines.length === 1 ? '1 item' : st.lines.length + ' itens'} da unidade <b>${esc(U[st.unit].name)}</b>. Cada unidade tem cardápio e preços próprios, então os pedidos não se misturam.</p>`,
      foot: `<div class="actions"><button class="btn btn-gold" type="button" id="swYes">Limpar pedido e ir para ${esc(U[u].name)}</button><button class="btn btn-ghost" type="button" id="swNo">Continuar em ${esc(U[st.unit].name)}</button></div>`,
      onOpen: () => {
        $('#swYes').onclick = () => { store.clear(u); closeDialog(); setMenuUnit(u, source); announce('Pedido limpo. Unidade ' + U[u].name + ' selecionada.'); then && then(); };
        $('#swNo').onclick = () => { closeDialog(); setMenuUnit(st.unit, source); then && then(); };
      }
    });
    return;
  }
  setMenuUnit(u, source); then && then();
}

/* ---------------- diálogo genérico ---------------- */
const dlg = $('#dlg'), scrim = $('#scrim');
let lastFocus = null, dlgOnClose = null;
function openDialog(o) {
  lastFocus = document.activeElement;
  $('#dlgTitle').textContent = o.title;
  $('#dlgBody').innerHTML = o.body; $('#dlgFoot').innerHTML = o.foot || '';
  dlg.classList.add('open'); dlg.setAttribute('aria-hidden', 'false'); scrim.classList.add('show'); document.body.classList.add('lock');
  dlgOnClose = o.onClose || null;
  o.onOpen && o.onOpen();
  setTimeout(() => { const f = dlg.querySelector('input,select,textarea,button:not([data-close])'); (f || dlg.querySelector('[data-close]')).focus(); }, 50);
}
function closeDialog() {
  if (!dlg.classList.contains('open')) return;
  dlg.classList.remove('open'); dlg.setAttribute('aria-hidden', 'true');
  if (!cartEl.classList.contains('open')) { scrim.classList.remove('show'); document.body.classList.remove('lock'); }
  const cb = dlgOnClose; dlgOnClose = null; cb && cb();
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

/* ---------------- item → pedido ---------------- */
function openItem(key) {
  const f = MENU.find(key); if (!f || !f.item) return;
  const { cat, item } = f;
  const choose = cat.choose ? cat.choose : (item.opts ? { label: 'Sabor', options: item.opts } : null);
  const addon = cat.addons;
  const sizes = cat.pz ? `<fieldset><legend>Tamanho</legend><div class="sizes">${MENU.SIZES.map((s, k) => `<label class="opt"><input type="radio" name="size" value="${k}"> ${s}<span>${priceCell(item.v[k])}</span></label>`).join('')}</div></fieldset>` : '';
  const sel = choose ? `<label class="f">${esc(choose.label)}<select id="iChoose"><option value="">Escolha…</option>${choose.options.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>` : '';
  const adds = addon ? `<fieldset><legend>${esc(addon.label)}${addon.type === 'multi' ? ' (opcional)' : ''}</legend>${addon.options.map((o, k) => `<label class="opt"><input type="${addon.type === 'multi' ? 'checkbox' : 'radio'}" name="addon" value="${k}" ${addon.type === 'single' && k === 0 ? 'checked' : ''}> ${esc(o.label)}<span data-ap="${k}"></span></label>`).join('')}</fieldset>` : '';
  openDialog({
    title: CART.lineName(item, cat, null),
    body: `${item.d ? `<p class="desc">${esc(item.d)}</p>` : ''}${sizes}${sel}${adds}
      <label class="f">Observações (opcional)<textarea id="iObs" maxlength="${C.cart.maxObsLength}" placeholder="Ex.: sem cebola, bem passado"></textarea></label>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><span class="fine">Quantidade</span><div class="qty"><button type="button" id="iMinus" aria-label="Diminuir quantidade">−</button><span id="iQty">1</span><button type="button" id="iPlus" aria-label="Aumentar quantidade">+</button></div></div>`,
    foot: `<div class="sum"><span>Valor</span><span class="v" id="iPrice">—</span></div><p class="fine" id="iHint"></p><button class="btn btn-gold" type="button" id="iAdd">Adicionar ao pedido</button>`,
    onOpen: () => {
      let qty = 1;
      const get = () => {
        const s = dlg.querySelector('input[name=size]:checked');
        const sizeIdx = s ? +s.value : null;
        const addonIdxs = [...dlg.querySelectorAll('input[name=addon]:checked')].map(x => +x.value).filter(k => !(addon && addon.type === 'single' && k === 0));
        const variation = choose ? $('#iChoose').value : null;
        return { sizeIdx, addonIdxs, variation };
      };
      const upd = () => {
        const g = get();
        if (addon) addon.options.forEach((o, k) => { const el = dlg.querySelector(`[data-ap="${k}"]`); const p = Array.isArray(o.price) ? (g.sizeIdx == null ? null : o.price[g.sizeIdx]) : o.price; el.textContent = k === 0 && addon.type === 'single' ? '' : (Array.isArray(o.price) && g.sizeIdx == null) ? '' : p == null ? 'valor a consultar' : '+ ' + brl(p); });
        const missing = (cat.pz && g.sizeIdx == null) ? 'Escolha o tamanho.' : (choose && !g.variation) ? `Escolha ${choose.label.toLowerCase()}.` : '';
        const up = missing ? null : CART.unitPrice(item, cat, g.sizeIdx, g.addonIdxs);
        $('#iPrice').textContent = missing ? '—' : up == null ? 'A consultar' : brl(up * qty);
        $('#iHint').textContent = missing || (up == null ? 'Este item não tem valor confirmado no cardápio; a unidade informa o valor.' : '');
        $('#iAdd').disabled = !!missing;
      };
      dlg.querySelectorAll('input,select').forEach(el => el.addEventListener('change', upd));
      $('#iMinus').onclick = () => { qty = Math.max(1, qty - 1); $('#iQty').textContent = qty; upd(); };
      $('#iPlus').onclick = () => { qty = Math.min(99, qty + 1); $('#iQty').textContent = qty; upd(); };
      $('#iAdd').onclick = () => {
        const g = get();
        const line = {
          unit, key: item.key, cat: cat.id, name: CART.lineName(item, cat, g.variation),
          size: cat.pz ? MENU.SIZES[g.sizeIdx] : null, variation: g.variation || null,
          addons: g.addonIdxs.map(k => addon.options[k].label),
          obs: $('#iObs').value.trim().slice(0, C.cart.maxObsLength),
          qty, unitPrice: CART.unitPrice(item, cat, g.sizeIdx, g.addonIdxs)
        };
        if (!store.add(line)) return; /* outra unidade: bloqueado (não deve ocorrer pela interface) */
        track('cart_add', { unit, category: cat.id, item: item.n, qty });
        closeDialog(); announce(`${line.name} adicionado ao pedido.`);
        const bar = $('#cartBar'); bar.animate && bar.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 350 });
      };
      upd();
    }
  });
}

/* ---------------- carrinho ---------------- */
const cartEl = $('#cart');
function renderCart() {
  const st = store.get(), sum = store.summary();
  const bar = $('#cartBar');
  bar.classList.toggle('show', st.lines.length > 0);
  $('#cbCount').textContent = sum.count;
  $('#cbValue').textContent = sum.hasUnpriced ? (sum.subtotal ? brl(sum.subtotal) + '+' : 'a consultar') : brl(sum.subtotal);
  const u = st.unit || unit;
  if (!st.lines.length) {
    $('#cartBody').innerHTML = `<div class="d-unit"><span>Unidade: <b>${esc(U[u].name)}</b></span></div><div class="empty-cart"><p>Seu pedido está vazio.</p><p class="fine">Toque em “Adicionar” nos itens do cardápio.</p></div>`;
    $('#cartFoot').innerHTML = `<button class="btn btn-gold" type="button" data-act="menu">Ver o cardápio</button>`;
    return;
  }
  $('#cartBody').innerHTML = `<div class="d-unit"><span>Unidade: <b>${esc(U[st.unit].name)}</b></span><button class="link" type="button" data-act="switch">Trocar unidade</button></div>` +
    st.lines.map(l => `<div class="line" data-id="${esc(l.id)}"><b>${esc(l.qty + 'x ' + l.name)}</b><span class="price ${l.unitPrice == null ? 'q' : ''}">${l.unitPrice == null ? 'a consultar' : brl(l.unitPrice * l.qty)}</span>
      <div class="meta">${[l.size, ...(l.addons || [])].filter(Boolean).map(esc).join(' · ')}${l.obs ? `${l.size || (l.addons && l.addons.length) ? '<br>' : ''}Obs.: ${esc(l.obs)}` : ''}</div>
      <div class="ctl"><div class="qty"><button type="button" data-q="-1" aria-label="Diminuir ${esc(l.name)}">−</button><span>${l.qty}</span><button type="button" data-q="1" aria-label="Aumentar ${esc(l.name)}">+</button></div><button class="rm" type="button" data-rm aria-label="Remover ${esc(l.name)}">Remover</button></div></div>`).join('') +
    `<label class="f" style="margin-top:18px">Observações do pedido (opcional)<textarea id="cNotes" maxlength="200" placeholder="Ex.: retirar no balcão, troco para R$ 100">${esc(st.notes)}</textarea></label>`;
  $('#cartFoot').innerHTML = sum.hasUnpriced
    ? `<div class="sum"><span>Subtotal parcial</span><span class="v">${brl(sum.subtotal)}</span></div><p class="fine">Há itens com valor a consultar. O total, a disponibilidade e a entrega são confirmados pela unidade.</p><button class="btn btn-gold" type="button" data-act="review">Revisar mensagem</button>`
    : `<div class="sum"><span>Subtotal</span><span class="v">${brl(sum.subtotal)}</span></div><p class="fine">Pelos preços do cardápio, sem taxa de entrega. A unidade confirma valores e disponibilidade.</p><button class="btn btn-gold" type="button" data-act="review">Revisar mensagem</button>`;
}
function openCart() {
  lastFocus = document.activeElement;
  renderCart(); cartEl.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false'); scrim.classList.add('show'); document.body.classList.add('lock');
  setTimeout(() => cartEl.querySelector('[data-close]').focus(), 50);
}
function closeCart() {
  cartEl.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true');
  if (!dlg.classList.contains('open')) { scrim.classList.remove('show'); document.body.classList.remove('lock'); }
}
cartEl.addEventListener('click', e => {
  const line = e.target.closest('.line');
  if (e.target.closest('[data-q]') && line) { const l = store.get().lines.find(x => x.id === line.dataset.id); store.setQty(l.id, l.qty + Number(e.target.closest('[data-q]').dataset.q)); if (l.qty <= 0) track('cart_remove', { unit: l.unit, category: l.cat, item: l.name }); }
  else if (e.target.closest('[data-rm]') && line) { const l = store.get().lines.find(x => x.id === line.dataset.id); store.remove(l.id); track('cart_remove', { unit: l.unit, category: l.cat, item: l.name }); announce('Item removido.'); }
});
cartEl.addEventListener('input', e => { if (e.target.id === 'cNotes') store.setNotes(e.target.value); });
store.subscribe(() => { const a = document.activeElement; const keepNotes = a && a.id === 'cNotes'; if (!keepNotes) renderCart(); else { renderCartBarOnly(); } });
function renderCartBarOnly() { const st = store.get(), sum = store.summary(); $('#cartBar').classList.toggle('show', st.lines.length > 0); $('#cbCount').textContent = sum.count; }

/* ---------------- prévia da mensagem / WhatsApp ---------------- */
function previewMessage(u, text, context) {
  const demo = C.demoMode;
  track('whatsapp_click', { unit: u, context, demo });
  openDialog({
    title: 'Revise sua mensagem',
    body: `<p class="desc" style="margin:0">Mensagem para a unidade <b>${esc(U[u].name)}</b> · WhatsApp ${esc(U[u].whatsappLabel)}:</p><pre class="msg" id="msgText">${esc(text)}</pre>` +
      (demo ? `<div class="demo-note">Modo demonstração: esta mensagem não é enviada para a Di Lidia. No site contratado, o botão abre o WhatsApp da unidade já com este texto, e o cliente só confirma o envio.</div>` : ''),
    foot: `<div class="actions"><button class="btn btn-ghost" type="button" id="mCopy">Copiar mensagem</button>${demo
      ? `<button class="btn btn-wa" type="button" disabled aria-disabled="true">${ic('wa')}Envio desativado na demonstração</button>`
      : `<a class="btn btn-wa" id="mSend" href="${esc(CART.waLink(U[u].whatsapp, text))}" target="_blank" rel="noopener">${ic('wa')}Abrir no WhatsApp</a>`}</div>`,
    onOpen: () => {
      $('#mCopy').onclick = async () => {
        let ok = false;
        try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
          const r = document.createRange(); r.selectNodeContents($('#msgText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
          try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
        }
        $('#mCopy').textContent = ok ? 'Mensagem copiada' : 'Selecione o texto e copie';
      };
    }
  });
}
function reviewOrder() {
  const st = store.get(); if (!st.lines.length) return;
  const sum = store.summary();
  orderStarted = true;
  track('order_started', { unit: st.unit, lines: st.lines.length, has_unpriced: sum.hasUnpriced });
  previewMessage(st.unit, CART.buildMessage(U[st.unit].name, st.lines, st.notes), 'order');
}
function whatsappContact(u) {
  previewMessage(u, `Olá! Vim pelo site e gostaria de falar com um atendente da unidade ${U[u].name}.`, 'contact');
}

/* ---------------- eventos globais ---------------- */
document.addEventListener('click', e => {
  const t = e.target;
  const add = t.closest('[data-add]'); if (add) { openItem(add.dataset.add); return; }
  const act = t.closest('[data-act]');
  if (act) {
    const a = act.dataset.act;
    if (a === 'order') { e.preventDefault(); startOrder(act.dataset.unit || store.get().unit || unit, 'cta'); }
    else if (a === 'menu') { closeCart(); goCat(MENU.units[unit][0].id); }
    else if (a === 'review') reviewOrder();
    else if (a === 'switch') { const other = store.get().unit === 'itaipu' ? 'pendotiba' : 'itaipu'; requestUnit(other, 'cart'); }
    return;
  }
  const wa = t.closest('[data-wa]'); if (wa) { whatsappContact(wa.dataset.wa); return; }
  const loc = t.closest('[data-loc]'); if (loc) track('location_click', { unit: loc.dataset.loc });
  if (t.closest('[data-close]')) { if (t.closest('#dlg')) closeDialog(); else closeCart(); }
});
scrim.addEventListener('click', () => { if (dlg.classList.contains('open')) closeDialog(); else closeCart(); });
$('#cartBar').addEventListener('click', openCart);
document.querySelector('.seg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) requestUnit(b.dataset.u, 'menu'); });
chips.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (q.value) { q.value = ''; renderMenu(); } goCat(b.dataset.c); });
let qTimer;
q.addEventListener('input', () => { renderMenu(); clearTimeout(qTimer); qTimer = setTimeout(() => { if (q.value.trim()) track('menu_search', { unit, term_length: q.value.trim().length, results: box.querySelectorAll('[data-add]').length }); }, 800); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (dlg.classList.contains('open')) closeDialog(); else if (cartEl.classList.contains('open')) closeCart(); else hd.classList.remove('open'); }
  if (e.key === 'Tab') { const root = dlg.classList.contains('open') ? dlg : cartEl.classList.contains('open') ? cartEl : null; if (!root) return; const f = [...root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')].filter(x => x.offsetParent !== null); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); } }
});

function startOrder(u, source) {
  requestUnit(u, source, () => { closeCart(); goCat(MENU.units[unit][0].id); announce('Cardápio de ' + U[unit].name + '. Toque em Adicionar nos itens.'); });
}
function showMenu(u) { requestUnit(u, 'chat', () => goCat(MENU.units[unit][0].id)); }

/* menu visto (uma vez por unidade) */
const seen = {};
new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting && !seen[unit]) { seen[unit] = 1; track('menu_view', { unit }); } }), { threshold: .2 }).observe($('#cardapio'));
/* possível abandono: saiu com itens e sem revisar a mensagem */
addEventListener('pagehide', () => { const st = store.get(); if (st.lines.length && !orderStarted) track('cart_abandon', { unit: st.unit, lines: st.lines.length }); });

/* cabeçalho, menu mobile, animações (herdado da v1) */
const hd = $('#top'), mt = document.querySelector('.menu-t');
const onScroll = () => hd.classList.toggle('solid', scrollY > 40); onScroll(); addEventListener('scroll', onScroll, { passive: true });
mt.addEventListener('click', () => { const o = hd.classList.toggle('open'); mt.setAttribute('aria-expanded', String(o)); });
hd.querySelectorAll('ul a').forEach(a => a.addEventListener('click', () => { hd.classList.remove('open'); mt.setAttribute('aria-expanded', 'false'); }));
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('.card[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); q.value = ''; renderMenu(); goCat(a.dataset.go); }));

renderUnits(); setMenuUnit(unit, 'init'); renderCart();
setInterval(refreshStatus, 60000);

DL.app = { showMenu, startOrder, openCart, whatsappContact, getUnit: () => store.get().lines.length ? store.get().unit : unit, store, setMenuUnit, requestUnit };
})();
