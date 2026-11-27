/* =============================================================
   Indicador de funcionamento — fuso America/Sao_Paulo
   Estados: open | closed | soon | unconfirmed
   Suporta vários períodos por dia, períodos após a meia-noite
   e exceções por data. Funções puras (testáveis no Node).
   ============================================================= */
(function (root) {
'use strict';

const TZ = 'America/Sao_Paulo';
const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const pad = n => String(n).padStart(2, '0');
const fmt = min => { const m = ((min % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };

/* Data e hora locais no fuso informado, a partir de um instante. */
function localParts(now, tz) {
  const p = {};
  new Intl.DateTimeFormat('en-US', { timeZone: tz || TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' })
    .formatToParts(now).forEach(x => { p[x.type] = x.value; });
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { date: `${p.year}-${p.month}-${p.day}`, weekday: wd, minutes: Number(p.hour) * 60 + Number(p.minute), hour: Number(p.hour) };
}

/* Soma dias a uma data YYYY-MM-DD (aritmética de calendário, sem fuso). */
function addDays(date, n) {
  const d = new Date(date + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n);
  return { date: d.toISOString().slice(0, 10), weekday: d.getUTCDay() };
}

/* Períodos de um dia: a exceção da data substitui o horário semanal. */
function periodsFor(hours, date, weekday) {
  const ex = (hours.exceptions || []).find(e => e.date === date);
  const list = ex ? ex.periods : ((hours.weekly || {})[weekday] || []);
  return list.map(([a, b]) => { const s = toMin(a); let e = toMin(b); if (e <= s) e += 1440; return { s, e }; });
}

function status(hours, now, tz) {
  if (!hours || !hours.weekly) return { state: 'unconfirmed', label: 'Horário não confirmado' };
  const soon = hours.soonMinutes == null ? 60 : hours.soonMinutes;
  const t = localParts(now || new Date(), tz);

  /* Aberto agora? Hoje, ou um período de ontem que passou da meia-noite. */
  const y = addDays(t.date, -1);
  for (const p of periodsFor(hours, y.date, y.weekday)) {
    if (p.e > 1440 && t.minutes < p.e - 1440) return { state: 'open', label: 'Aberto agora', until: fmt(p.e) };
  }
  for (const p of periodsFor(hours, t.date, t.weekday)) {
    if (t.minutes >= p.s && t.minutes < p.e) return { state: 'open', label: 'Aberto agora', until: fmt(p.e) };
  }

  /* Próxima abertura nos próximos 7 dias. */
  for (let d = 0; d <= 7; d++) {
    const day = d === 0 ? t : addDays(t.date, d);
    const starts = periodsFor(hours, day.date, day.weekday).map(p => p.s).filter(s => d > 0 || s > t.minutes).sort((a, b) => a - b);
    if (starts.length) {
      const wait = d * 1440 + starts[0] - t.minutes;
      const when = d === 0 ? 'hoje' : d === 1 ? 'amanhã' : ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][day.weekday];
      if (wait <= soon) return { state: 'soon', label: 'Abre em breve', opensAt: fmt(starts[0]), when, inMinutes: wait };
      return { state: 'closed', label: 'Fechado no momento', opensAt: fmt(starts[0]), when };
    }
  }
  return { state: 'closed', label: 'Fechado no momento' };
}

/* Saudação pelo horário de Brasília. */
function greeting(now, tz) {
  const h = localParts(now || new Date(), tz).hour;
  return h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
}

const api = { status, greeting, localParts };
root.DL = root.DL || {};
root.DL.hours = api;
if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
