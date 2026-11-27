/* =============================================================
   Configuração central da demonstração Di Lidia
   Tudo que muda entre demonstração e site contratado fica aqui.
   ============================================================= */
(function (root) {
'use strict';

const config = {
  /* Demonstração comercial não oficial (MC Consultoria em TI).
     true  = nenhum pedido é encaminhado à pizzaria; o cliente só vê a mensagem.
     false = os botões abrem o WhatsApp real da unidade (só após aprovação). */
  demoMode: true,

  /* Reservas: não há confirmação de que a pizzaria trabalha com reservas.
     Nenhum botão, texto ou fluxo de reserva é exibido enquanto for false. */
  reservationsEnabled: false,

  timeZone: 'America/Sao_Paulo',

  analytics: {
    enabled: true,   /* registra eventos na fila window.DL_EVENTS (nada sai do navegador) */
    debug: false     /* true = mostra os eventos no console */
  },

  cart: {
    storageKey: 'dilidia-demo-cart-v1',
    maxAgeHours: 24,
    maxObsLength: 140
  },

  units: {
    itaipu: {
      id: 'itaipu',
      name: 'Itaipu',
      fullName: 'Di Lidia Itaipu',
      subtitle: 'A primeira casa, com área kids',
      address: 'Av. Ewerton Xavier, 1926 — Itaipu, Niterói - RJ',
      phones: [['(21) 2709-3636', '+552127093636'], ['(21) 2609-3636', '+552126093636']],
      /* O site oficial exibe (21) 99615-3636, mas o botão dele abre 552126093636.
         A CONFIRMAR com a unidade antes de ativar os pedidos reais. */
      whatsapp: '552126093636',
      whatsappLabel: '(21) 2609-3636',
      instagram: 'dilidiaitaipu',
      photo: 'DSC_0280.webp',
      photoAlt: 'Picanha na brasa servida com arroz, fritas, farofa e molho à campanha',
      /* Horário NÃO informado no site oficial. Preencher quando confirmado. */
      hours: null
    },
    pendotiba: {
      id: 'pendotiba',
      name: 'Pendotiba',
      fullName: 'Di Lidia Pendotiba',
      subtitle: 'Pizzas, galeto e pratos executivos',
      address: 'Estr. Caetano Monteiro, 701, loja 103 — Pendotiba, Niterói - RJ',
      phones: [['(21) 2616-3997', '+552126163997'], ['(21) 2718-1964', '+552127181964']],
      whatsapp: '5521967214514',
      whatsappLabel: '(21) 96721-4514',
      instagram: 'dilidiapendotiba',
      photo: 'DSC_0250.webp',
      photoAlt: 'Pizza com ovos, cebola, azeitonas e ervilha',
      hours: null
    }
  },

  /* Modelo de horário (exemplo, NÃO usar sem confirmação):
     hours: {
       weekly: {            // 0 = domingo ... 6 = sábado
         5: [['18:00', '01:00']],          // passa da meia-noite
         6: [['11:30', '15:00'], ['18:00', '01:00']]  // vários períodos
       },
       exceptions: [ { date: '2026-12-24', periods: [['18:00', '22:00']], note: 'Véspera de Natal' },
                     { date: '2026-12-25', periods: [], note: 'Fechado no Natal' } ],
       soonMinutes: 60      // "Abre em breve" nesta janela
     } */

  imageBase: 'https://dilidia.com.br/images/'
};

root.DL = root.DL || {};
root.DL.config = config;
if (typeof module !== 'undefined') module.exports = config;
})(typeof window !== 'undefined' ? window : globalThis);
