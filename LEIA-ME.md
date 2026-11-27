# Di Lidia — demonstração comercial (v2)

Protótipo de novo site para a Di Lidia Pizzaria e Galeteria (Niterói), feito pela MC Consultoria em TI. **Não é o site oficial** e não foi contratado pela pizzaria.

- Site oficial: https://dilidia.com.br
- Protótipo publicado (v1): https://mcoutinho2512.github.io/dilidia-prototipo/
- Ponto de restauração: tag Git `v1-prototipo` (a versão v1, publicada em 26/11/2026)

## Estrutura

| Arquivo | O que tem |
| --- | --- |
| `index.html` | Marcação da página. Sem dados de cardápio nem regras. |
| `css/site.css` | Visual, com a mesma paleta e tipografia da v1. |
| `js/config.js` | **Configuração central**: modo demonstração, reservas, unidades, telefones, WhatsApp, horários, analytics. |
| `js/menu.js` | Cardápio das duas unidades, conforme o site oficial, com tamanhos, bordas, adicionais, massas e sabores de esfiha. |
| `js/hours.js` | Indicador de funcionamento: fuso America/Sao_Paulo, vários períodos por dia, períodos após a meia-noite e exceções por data. |
| `js/cart.js` | Núcleo do carrinho: preços, subtotal, mensagem do WhatsApp e persistência. |
| `js/chatbot-flows.js` | **Todas as perguntas e respostas do chatbot**. É só editar aqui. |
| `js/chatbot.js` | Motor e interface do chatbot. É reaproveitável em outros projetos. |
| `js/analytics.js` | Camada de eventos para uma futura ferramenta de análise. |
| `js/app.js` | Interface: unidades, cardápio, carrinho e diálogos. |
| `seo/structured-data.json` | Modelo de dados estruturados para o site **contratado**. Não é publicado na demo. |
| `tests/unit.test.js` | Testes de lógica (Node). |
| `tests/e2e.py` | Testes no navegador (Playwright + Chrome). |
| `robots.txt` | Bloqueia a indexação da demonstração. |

O site é 100% estático, sem backend, banco de dados ou serviço pago. Funciona em GitHub Pages, Cloudflare Pages ou qualquer VPS com Nginx.

## Chaves de configuração (`js/config.js`)

- `demoMode: true` — nenhum pedido ou contato é encaminhado à pizzaria. O cliente monta o pedido, vê a mensagem pronta e pode copiá-la, mas o botão de envio fica desativado. **Mude para `false` só depois da aprovação comercial e com os números de WhatsApp confirmados.**
- `reservationsEnabled: false` — reservas não aparecem em lugar nenhum. A v1 não tinha sistema de reservas, só uma frase no rodapé ("Reserve sua mesa..."), que foi removida.
- `units.*.hours: null` — exibe "Horário não confirmado". Para ativar o indicador, preencha conforme o modelo no próprio arquivo:
  - dias de 0 (domingo) a 6 (sábado);
  - vários períodos por dia;
  - períodos que passam da meia-noite (ex.: `['18:00','01:00']`);
  - exceções por data (feriados).
- `analytics.debug: true` — mostra os eventos no console.

## Fluxo de pedido

1. O cliente escolhe a unidade e adiciona itens. Pizzas pedem o tamanho; massas pedem o tipo de massa; esfihas pedem o sabor. Bordas e adicionais aparecem com o preço oficial. Toda linha aceita observações.
2. O carrinho fica salvo no navegador (`localStorage`) por 24 horas e pertence a uma única unidade. Ao trocar de unidade com itens, o site pede confirmação antes de limpar.
3. O subtotal só é calculado com preços do cardápio. A borda doce de Itaipu não tem preço no site oficial, então aparece como "valor a consultar" e o total definitivo não é mostrado. Nenhuma taxa de entrega é calculada.
4. O cliente revisa a mensagem antes de enviar. Fora do modo demo, o botão abre `https://wa.me/<número>?text=<mensagem>`, sem API paga.

## Eventos analíticos (`js/analytics.js`)

Os eventos são:
- `menu_view`, `menu_search` (só o tamanho do termo e o número de resultados);
- `unit_select`, `cart_add`, `cart_remove`, `order_started`;
- `whatsapp_click` (com `demo: true/false`);
- `chat_open`, `chat_option`, `location_click`;
- `cart_abandon` (saiu da página com itens sem revisar a mensagem).

Os eventos vão para `window.DL_EVENTS` e **nada sai do navegador**. Para ligar uma ferramenta (GA4, Plausible, Umami), use `DL.analytics.setAdapter(ev => ...)`. Só passam as propriedades da lista do arquivo: nunca observações, mensagem ou dados pessoais.

Importante: `whatsapp_click` é intenção de contato, **não é venda**.

## Testes

```bash
node --test tests/unit.test.js            # lógica: horários, preços, mensagem, carrinho, chatbot
python3 -m http.server 8765 &              # servidor local
python3 tests/e2e.py http://127.0.0.1:8765/  # navegador: desktop 1366 px e celular 390 px
```

## Publicar (somente com autorização)

1. Envie todos os arquivos (mantendo as pastas `css/` e `js/`) para o repositório `mcoutinho2512/dilidia-prototipo`, branch `main`.
2. O GitHub Pages publica em cerca de 1 minuto.
3. Para voltar à v1: `git checkout v1-prototipo`.

## Quando o projeto for contratado

1. **Ativar a indexação:**
   - troque `noindex, nofollow, noarchive` por `index, follow` no `index.html`;
   - em `robots.txt`, use `Allow: /` e `Sitemap: https://dilidia.com.br/sitemap.xml`;
   - adicione `<link rel="canonical" href="https://dilidia.com.br/">`;
   - cole o conteúdo de `seo/structured-data.json` em um `<script type="application/ld+json">`, com os horários confirmados.
2. Retire a faixa `.demo-bar` e ajuste o rodapé.
3. Mude `demoMode` para `false`.
4. Copie as imagens para `images/` e troque `imageBase` em `config.js` e as URLs do `index.html`.

## O que depende de autorização ou confirmação

- **Marca, logo e fotos:** todos vêm de dilidia.com.br/images/ e pertencem à Di Lidia. Estão em uso só para demonstração.
- **Horários de funcionamento** das duas unidades.
- **WhatsApp de Itaipu:** o site oficial mostra 99615-3636, mas o botão dele abre 2609-3636.
- **Entrega e retirada:** área atendida, taxa, prazo e tempo de preparo.
- **Preços de Pendotiba:** as colunas do site oficial pareciam invertidas e foram reordenadas. A pizza Namorados aparecia com R$ 82,80 em um dos tamanhos (aqui ficou R$ 82,90).
- **Preço da borda doce** (Itaipu).
- **Pizza meio a meio:** não consta no cardápio oficial, então não foi implementada.
