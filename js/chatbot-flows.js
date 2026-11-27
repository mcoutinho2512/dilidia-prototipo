/* =============================================================
   Chatbot Di Lidia — perguntas, respostas e fluxos (por regras)
   Edite os textos aqui. Sem IA externa, sem custo por mensagem.
   Reaproveitável: troque este arquivo e o config.js em outro projeto.

   Cada nó:
     text(ctx)  -> texto da resposta (ctx: greeting, unit, hours, demo, phone)
     unit: true -> pergunta a unidade antes, se ainda não houver
     action     -> ação na página: showMenu | startOrder | whatsappContact
     options    -> botões: { label, go } | { label, action } | { label, href(ctx) }
   Regra: só informações confirmadas. Nada sobre reservas.
   ============================================================= */
(function (root) {
'use strict';

const BACK = { label: 'Voltar ao menu principal', go: 'start' };
const NOT_CONFIRMED = 'ainda não foram confirmadas nesta demonstração';

const flows = {
  title: 'Atendimento Di Lidia',
  subtitle: 'Demonstração · respostas automáticas',
  launcherLabel: 'Abrir atendimento',
  unitQuestion: 'Para qual unidade?',
  changeUnitLabel: 'Trocar de unidade',

  nodes: {
    start: {
      text: ctx => `${ctx.greeting}! Olá! Seja bem-vindo à demonstração do atendimento digital da Di Lidia. Como podemos ajudar?`,
      options: [
        { label: 'Consultar cardápio', go: 'cardapio' },
        { label: 'Montar meu pedido', go: 'pedido' },
        { label: 'Conhecer as unidades', go: 'unidades' },
        { label: 'Horários de funcionamento', go: 'horarios' },
        { label: 'Informações sobre entrega', go: 'entrega' },
        { label: 'Informações sobre retirada', go: 'retirada' },
        { label: 'Falar com um atendente', go: 'atendente' }
      ]
    },

    cardapio: {
      unit: true,
      action: 'showMenu',
      text: ctx => `Abri o cardápio da unidade ${ctx.unit.name}. Você pode navegar pelas categorias ou buscar por sabor ou ingrediente.`,
      options: [{ label: 'Montar meu pedido', go: 'pedido' }, BACK]
    },

    pedido: {
      unit: true,
      action: 'startOrder',
      text: ctx => `Para montar seu pedido em ${ctx.unit.name}, toque em "Adicionar" nos itens do cardápio. Antes de enviar, você revisa a mensagem completa.`,
      options: [{ label: 'Ver meu carrinho', action: 'openCart' }, BACK]
    },

    unidades: {
      unit: true,
      text: ctx => [
        `Di Lidia ${ctx.unit.name}`,
        ctx.unit.address,
        `Telefones: ${ctx.unit.phones.map(p => p[0]).join(' · ')}`,
        `Instagram: @${ctx.unit.instagram}`,
        ctx.hours.state === 'unconfirmed' ? 'Horário: a confirmar com a unidade.' : `Agora: ${ctx.hours.label.toLowerCase()}.`
      ].join('\n'),
      options: [
        { label: 'Ver no mapa', href: ctx => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Di Lidia ' + ctx.unit.address) },
        { label: 'Cardápio desta unidade', go: 'cardapio' },
        { label: 'Horário de funcionamento', go: 'horarios' },
        BACK
      ]
    },

    horarios: {
      unit: true,
      text: ctx => {
        const h = ctx.hours;
        if (h.state === 'unconfirmed') return `O horário de funcionamento da unidade ${ctx.unit.name} ainda não foi confirmado nesta demonstração. Confirme diretamente com a unidade pelo telefone ${ctx.phone}.`;
        if (h.state === 'open') return `A unidade ${ctx.unit.name} está aberta agora, até ${h.until}.`;
        if (h.state === 'soon') return `A unidade ${ctx.unit.name} abre em breve, às ${h.opensAt}.`;
        return `A unidade ${ctx.unit.name} está fechada no momento.${h.opensAt ? ` Abre ${h.when} às ${h.opensAt}.` : ''}`;
      },
      options: [{ label: 'Ver outra unidade', go: 'horarios', changeUnit: true }, BACK]
    },

    entrega: {
      unit: true,
      text: ctx => `As condições de entrega da unidade ${ctx.unit.name} (bairros atendidos, taxa e prazo) ${NOT_CONFIRMED}. Confirme diretamente com a unidade pelo telefone ${ctx.phone}.`,
      options: [{ label: 'Falar com um atendente', go: 'atendente' }, BACK]
    },

    retirada: {
      unit: true,
      text: ctx => `As condições de retirada na unidade ${ctx.unit.name} (disponibilidade e tempo de preparo) ${NOT_CONFIRMED}. Endereço: ${ctx.unit.address}.`,
      options: [
        { label: 'Ver no mapa', href: ctx => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Di Lidia ' + ctx.unit.address) },
        { label: 'Falar com um atendente', go: 'atendente' },
        BACK
      ]
    },

    atendente: {
      unit: true,
      action: 'whatsappContact',
      text: ctx => ctx.demo
        ? `Nesta demonstração, nenhuma mensagem é enviada para a pizzaria. Abri uma prévia da mensagem que iria para o WhatsApp da unidade ${ctx.unit.name}.`
        : `Vou abrir o WhatsApp da unidade ${ctx.unit.name} para você falar com um atendente.`,
      options: [BACK]
    }
  }
};

root.DL = root.DL || {};
root.DL.chatFlows = flows;
if (typeof module !== 'undefined') module.exports = flows;
})(typeof window !== 'undefined' ? window : globalThis);
