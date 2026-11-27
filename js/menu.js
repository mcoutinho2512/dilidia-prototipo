/* =============================================================
   Cardápio Di Lidia — dados confirmados no site oficial
   (dilidia.com.br/cardapio-itaipu.html e cardapio-pendotiba.html,
   consultados em 26/11/2026).
   Regra: não inventar preços, produtos, tamanhos ou regras.
   price null = "valor a consultar com a unidade".
   ============================================================= */
(function (root) {
'use strict';
const L=(s)=>s.split('|').map(x=>{const [n,p,d]=x.split('~');return {n,p:+p,d}});
const P=(rows)=>rows.trim().split('\n').map(r=>{const c=r.split(';');return {n:c[0],d:c[1],v:c.slice(2).map(Number)}});
const M={
itaipu:[
 {id:'entradas',t:'Entradas',it:L('Alcatra fatiada~62.90|Linguiça (unidade)~10.90|Galeto simples~39.90|½ galeto~25.90|Pão de alho (unidade)~10.90|Queijo coalho (unidade)~18.90|Caldinho de feijão~22.90')},
 {id:'pratos',t:'Pratos da casa',note:'Acompanham arroz, farofa de ovos, fritas e molho à campanha, exceto quando indicado.',it:L('Churrasco Di Lidia~379.90~Galeto, linguiça, picanha, lombo suíno, contrafilé, pão de alho e queijo coalho. Com arroz, farofa de ovos, fritas, molho à campanha, salada de maionese e banana à milanesa|Galeto completo~99.90|½ galeto~69.90|Picanha completa~289.90|½ picanha~199.90|Picanha à campanha (individual)~110.90|Contrafilé grill completo~199.90|½ contrafilé~129.90|Contrafilé à campanha (individual)~89.90|Miolo de alcatra completo~209.90|½ miolo de alcatra~139.90|Filé mignon completo~249.90|½ filé mignon~179.90|Churrasco misto~205.90|Medalhão à piamontese~229.90~Arroz à piamontese, medalhão ao molho madeira e fritas|Filé à parmegiana~229.90~Arroz e purê de batata|Filé de frango à parmegiana~99.90~Arroz e purê de batata|Filé de frango grelhado~99.90~Arroz, mix de legumes e purê de batata')},
 {id:'espetinhos',t:'Espetinhos na brasa',note:'Versões à campanha acompanham arroz, farofa de ovos, fritas e molho à campanha.',it:L('Carne simples~42.90|Carne à campanha~52.90|Frango simples~29.90|Frango à campanha~39.90|Misto simples~39.90|Misto à campanha~49.90')},
 {id:'guarnicoes',t:'Guarnições e saladas',it:L('Arroz à piamontese~38.90|Arroz simples~17.90|Farofa~17.90|Feijão da casa~17.90|Molho à campanha~14.90|Batata frita~32.90|Banana na brasa (3 un.)~18.90|Guarnição à campanha~48.90|Maionese~36.90|Salada simples~19.90~Alface, tomate e cebola|Salada mista~28.90~Alface, tomate, azeitonas e cebola|Salada da casa~42.90~Alface, rúcula, palmito, tomate, ervilha, azeitonas, cebola, enroladinhos de queijo e presunto')},
 {id:'massas',t:'Massas',note:'Escolha a massa — inhoque, canelone, rondelli, fettuccine ou lasanha — e o molho. Lasanha, canelone e rondelli levam queijo e presunto.',it:L('Ao sugo~59.90|Bolonhesa~64.90|Carbonara~64.90|Molho branco~64.90|4 queijos~64.90~Ricota, provolone, catupiry e muçarela|Frango ao sugo~64.90|Frango com molho branco~64.90|Gorgonzola~79.90~Molho branco e gorgonzola|Carne seca ao sugo~79.90|Carne seca com molho branco~79.90|Camarão ao sugo~82.90|Camarão ao molho branco~82.90')},
 {id:'kids',t:'Prato kids',note:'Até 12 anos.',it:L('Bifinho~39.90~Arroz, feijão, farofa e fritas (troque as fritas por purê)|Franguinho~29.90~Arroz, feijão, farofa e fritas (troque as fritas por purê)|Macarrãozinho~28.90~Molho sugo, bolonhesa ou caldo de feijão')},
 {id:'pizzas',t:'Pizzas salgadas',pz:1,note:'Borda recheada de catupiry ou cream cheese: + R$ 20,00 (família e grande) ou + R$ 16,00 (média e brotinho).',it:P(`À moda Di Lidia;Muçarela, presunto, palmito, atum, ervilha, bacon, ovos, parmesão, cebola, azeitonas, orégano;114.9;97.9;75.9;58.9
À moda do chefe;Muçarela, presunto, palmito, ervilha, bacon, ovos, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
À moda da casa;Muçarela, lombo canadense, catupiry, palmito, bacon, ovos, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Alho e óleo;Muçarela, alho, azeitona, orégano;97.9;82.9;58.9;46.9
Aliche nacional;Muçarela, aliche, azeitona, orégano;99.9;85.9;66.9;50.9
Atum com muçarela;Muçarela, atum, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Australiana;Abacaxi, presunto, muçarela, orégano;99.9;85.9;66.9;50.9
Bacon;Muçarela, bacon, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Baiacatu;Calabresa moída, catupiry, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Calabresa;Muçarela, calabresa, parmesão, cebola, azeitona, orégano;99.9;85.9;66.9;50.9
Calabresa poró;Muçarela, calabresa, alho-poró, cream cheese, azeitona, orégano;108.9;92.9;71.9;55.9
Calabresa suprema;Calabresa, catupiry, palmito, milho, azeitona, orégano;108.9;92.9;71.9;55.9
Camarão;Muçarela ou catupiry, camarão, parmesão, cebola, azeitona, orégano;124.9;102.9;88.9;70.9
Camarão da casa;Muçarela, camarão, catupiry, abacaxi, bacon, orégano;127.9;105.9;93.9;73.9
Camarão poró;Muçarela, camarão, alho-poró, cream cheese, azeitona, orégano;127.9;105.9;93.9;73.9
Canadense;Muçarela, lombo canadense, creme de leite com milho, azeitona, orégano;99.9;85.9;66.9;50.9
Carbonara;Muçarela, catupiry, bacon, ovos, azeitona, orégano;108.9;92.9;71.9;55.9
Carioca;Muçarela, presunto, parmesão, cebola, azeitona, orégano;99.9;85.9;66.9;50.9
Carne seca;Muçarela ou catupiry, carne seca, cebola, azeitona, orégano;114.9;97.9;75.9;58.9
Carne seca com queijo coalho;Muçarela, carne seca, queijo coalho, cebola, azeitona, orégano;127.9;105.9;93.9;73.9
Catupiry;Catupiry, azeitona, orégano;108.9;92.9;71.9;55.9
Catupiry com frango;Catupiry, frango, azeitona, orégano;108.9;92.9;71.9;55.9
Champignon;Muçarela, champignon, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Costela desfiada com pimenta biquinho;Catupiry ou cream cheese, costela bovina desfiada, pimenta biquinho, azeitona, orégano;127.9;105.9;93.9;73.9
Frango;Muçarela, frango, cebola, parmesão, azeitona, orégano;99.9;85.9;66.9;50.9
Frango poró;Muçarela, frango, alho-poró, cream cheese, azeitona, orégano;108.9;92.9;71.9;55.9
Gorgonzola;Muçarela, gorgonzola, azeitona, orégano;108.9;92.9;71.9;55.9
Japonesa;Muçarela, atum, aliche, camarão, parmesão, cebola, azeitona, orégano;127.9;105.9;93.9;73.9
Lombo com muçarela;Muçarela, lombo canadense, parmesão, cebola, azeitona, orégano;99.9;85.9;66.9;50.9
Marguerita;Muçarela, tomate, manjericão, azeitona, orégano;99.9;85.9;66.9;50.9
Mexicana;Muçarela, frango, milho verde, cebola, parmesão, bacon, azeitona, orégano;99.9;85.9;66.9;50.9
Mista;Muçarela, calabresa, champignon, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Muçarela;Muçarela, azeitona, orégano;95.9;81.9;57.9;45.9
Namorados;Muçarela, catupiry, palmito, azeitona, orégano;108.9;92.9;71.9;55.9
Palmito com muçarela;Muçarela, palmito, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Peperone;Muçarela, peperone, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Pizzaiolo;Muçarela, presunto, champignon, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Portuguesa;Muçarela, presunto, calabresa, ervilha, palmito, ovos, bacon, parmesão, cebola, azeitona, orégano;108.9;92.9;71.9;55.9
Provolone;Muçarela, provolone, azeitona, orégano;104.9;90.9;68.9;52.9
Ricota simples;Ricota, muçarela, azeitona, orégano;99.9;85.9;66.9;50.9
Ricota com bacon;Ricota, muçarela, calabresa, palmito, bacon, azeitona, orégano;108.9;92.9;71.9;55.9
Rúcula com tomate seco;Muçarela de búfala, rúcula, tomate seco, azeitona, orégano;114.9;97.9;75.9;58.9
4 queijos;Muçarela, gorgonzola, provolone, ricota, azeitona, orégano;108.9;92.9;71.9;55.9
3 queijos;Muçarela, provolone, gorgonzola, azeitona, orégano;99.9;85.9;66.9;50.9`)},
 {id:'doces',t:'Pizzas doces',pz:1,note:'Borda doce: chocolate ao leite, chocolate branco ou doce de leite.',it:P(`Abacaxi crocante;Catupiry, abacaxi, chocolate branco;108.9;92.9;71.9;55.9
Banana crocante;Catupiry, banana, chocolate branco;108.9;92.9;71.9;55.9
Banana;Muçarela, banana, açúcar, canela;99.9;85.9;67.9;51.9
Brownie;Chocolate, brownie triturado;114.9;97.9;75.9;58.9
Chocolate;Muçarela, chocolate, castanha ou granulado;108.9;92.9;71.9;55.9
Chocobanana;Muçarela, banana, chocolate, granulado;114.9;97.9;75.9;58.9
Doce de leite com banana;Muçarela, banana, açúcar, canela, doce de leite;108.9;92.9;71.9;55.9
Confete;Muçarela, chocolate, confete;114.9;97.9;75.9;58.9
Romeu e Julieta;Catupiry, goiabada cremosa;99.9;85.9;67.9;51.9
Morango com chocolate ao leite;Muçarela, chocolate, morango, granulado;127.9;105.9;93.9;73.9`)},
 {id:'esfihas',t:'Esfihas',it:L('Salgadas tradicionais~22.90~Calabresa, carioca, catupiry, catupiry com frango, frango, lombo, marguerita, muçarela|Salgadas especiais~24.90~4 queijos, atum, australiana, baiacatu, canadense, carne seca, champignon, gorgonzola, namorados, palmito, peperone, provolone, rúcula com tomate seco|Salgadas premium~25.90~Calabresa poró, calabresa suprema, carbonara, frango poró|Camarão, carne seca com coalho ou portuguesa~27.90|Camarão da casa, camarão poró ou costela com pimenta biquinho~28.90|Doces~22.90~Banana, Romeu e Julieta|Doces especiais~24.90~Chocolate, chocobanana, doce de leite com banana|Doces crocantes~25.90~Abacaxi crocante, banana crocante, brownie|Morango com chocolate~28.90')},
 {id:'sobremesas',t:'Sobremesas',it:L('Brownie com sorvete~35.90|Petit gâteau com sorvete~35.90|Sobremesas no pote~18.90|Esfiha Suprema Banana Split~39.90~Esfiha de banana com açúcar e canela, sorvete de creme, calda de caramelo, castanhas e chantilly|Esfiha Suprema Brownie~39.90~Esfiha de chocolate, sorvete de creme, calda de chocolate, brownie, castanhas e chantilly|Esfiha Suprema Chocolate com Morango~39.90~Esfiha de chocolate, sorvete de creme, calda e pedaços de morango, castanha e chantilly|Esfiha Suprema Mini Churros~39.90~Esfiha de doce de leite, açúcar e canela, sorvete de creme, calda de caramelo e mini churros')},
 {id:'bebidas',t:'Bebidas e drinks',it:L('Chopp Brahma — caneca~13.90|Chopp Brahma — tulipa~12.90|Chopp Brahma — garotinho~9.90|Cerveja long neck~15.90|Refrigerante KS 290 ml~8.90|Refrigerante lata~9.90|H2O / Limoneto~10.90|Mate Leão~9.90|Ice tea~9.90|Guaravita~6.90|Água com ou sem gás~6.90|Suco de frutas (copo)~15.90~Abacaxi, acerola, caju, cupuaçu, graviola, laranja, limonada, manga, maracujá e morango|Jarra de suco de laranja~46.90|Suco em lata~9.90|Soda italiana~12.90~Frutas vermelhas, limão siciliano ou maçã verde|Caipirinha~16.90|Caipivodka~24.90|Gin tropical~39.90~Gin, Red Bull tropical, anis-estrelado e zimbro|Gin Red~39.90~Gin, Red Bull melancia, canela e pimenta-rosa|Campari ou Martini (dose)~15.90|Whisky Red Label (dose)~28.90')},
 {id:'vinhos',t:'Carta de vinhos',it:L('Vinho da casa — taça~24.90|Vinho da casa — jarra P~36.90|Vinho da casa — jarra G~59.90|Miolo Reserva Pinot Noir~117.00~Brasil · Campanha Gaúcha|Miolo Reserva Merlot~117.00~Brasil · Campanha Meridional|Miolo Reserva Cabernet~102.00~Brasil · Campanha Meridional|New Roads Red Wine~65.00~Argentina · Mendoza|El Supremo Malbec~83.00~Argentina · Mendoza|El Supremo Blend~64.00~Argentina · Mendoza|Viejo Feo Pinot~118.00~Chile · Vale do Maule|Viejo Feo Cabernet~112.00~Chile · Vale do Maule|Volantin Carmenère~96.00~Chile|Julia Florista~82.00~Portugal · Lisboa|Porta 6 Tinto~101.00~Portugal · Lisboa|Coragem Touriga~161.00~Portugal · Lisboa|La Vache Espagnole~81.00~Espanha · Jumilla|Mr Rabbit Cabernet Sauvignon~143.00~França · Languedoc|Viejo Feo Cabernet 375 ml~84.00~Meia garrafa|Porta 6 Tinto 375 ml~75.00~Meia garrafa')}
],
pendotiba:[
 {id:'entradas',t:'Petiscos e saladas',it:L('Linguiça (unidade)~9.90|Bolinho de bacalhau (12 un.)~55.90|Batata com bacon e cheddar~45.90|Gurjão de frango~60.90|Porção de parmesão, alho, azeitona ou aliche~9.90|Salada mista~35.90~Tomate, alface, azeitonas e cebola|Salada da casa~50.90~Alface, rúcula, palmito, tomate, presunto, queijo, ervilha, azeitona e cebola')},
 {id:'pratos',t:'Pratos da casa',note:'Galeto e carnes acompanham arroz, fritas, farofa e molho à campanha.',it:L('Galeto na brasa~94.90|½ galeto~77.90|Picanha na brasa (aprox. 900 g)~219.90|½ picanha (aprox. 450 g)~169.90|Churrasco de contrafilé~169.90|½ contrafilé~117.90|Churrasco misto~199.90|Strogonoff de frango~102.90~Arroz e fritas|Filé de frango à parmegiana~104.90~Presunto, queijo e molho ao sugo, com arroz e purê de batatas')},
 {id:'executivos',t:'Pratos executivos',note:'Acompanham arroz, feijão, farofa e fritas.',it:L('Calabresa acebolada~34.90|Filé de frango grelhado~37.90|Contrafilé~59.90|Picanha~67.90')},
 {id:'guarnicoes',t:'Guarnições',it:L('Molho à campanha~15.90|Arroz~18.90|Farofa~25.90|Batata frita~29.90|Feijão da casa~15.90|Banana na brasa (3 un.)~15.90')},
 {id:'massas',t:'Massas',note:'Escolha a massa — inhoque, inhoque de batata-doce, canelone, lasanha, fettuccine ou rondelli — e o molho.',it:L('Bolonhesa~54.90|Ao sugo~54.90|Frango ao sugo~54.90|4 queijos~54.90|Molho branco~54.90|Frango com molho branco~54.90|Parisiense~54.90|Carbonara~69.90|Carne seca~69.90|Camarão~78.90')},
 {id:'pizzas',t:'Pizzas salgadas',pz:1,note:'Adicionais: cheddar ou catupiry + R$ 7,00 · cream cheese + R$ 8,00 · ingrediente extra + R$ 5,00.',it:P(`Muçarela;Muçarela, orégano, azeitona;90.9;80.9;55.9;44.9
À moda Di Lidia;Muçarela, presunto, palmito, atum, ervilha, parmesão, bacon, ovos, cebola, azeitona, orégano;100.9;85.9;65.9;49.9
À moda do chefe;Como a À moda Di Lidia, sem atum;100.9;85.9;65.9;49.9
Alho e óleo;Muçarela, alho, azeitona, orégano;93.9;80.9;61.9;47.9
Aliche nacional;Muçarela, aliche nacional, azeitona, orégano;95.9;81.9;63.9;47.9
Atum com muçarela e cebola;Muçarela, atum, cebola, parmesão, azeitona, orégano;100.9;85.9;65.9;48.9
Australiana;Presunto, abacaxi, muçarela, orégano;95.9;81.9;63.9;47.9
Bacon;Muçarela, bacon, cebola, parmesão, azeitona, orégano;100.9;85.9;65.9;48.9
Barletta;Muçarela de búfala, peito de peru, tomate, manjericão, orégano;100.9;82.9;65.9;48.9
Berinjela;Muçarela, berinjela, palmito, tomate seco, cebola, azeitona, orégano;100.9;82.9;65.9;48.9
Calabresa;Muçarela, calabresa, cebola, parmesão, azeitona, orégano;95.9;80.9;63.9;47.9
Camarão;Muçarela, camarão, cebola, parmesão, azeitona, orégano;114.9;95.9;83.9;63.9
Camarão da casa;Muçarela, camarão, catupiry, bacon, abacaxi, azeitona, orégano;119.9;97.9;85.9;68.9
Camarão especial;Muçarela, camarão, cream cheese, alho-poró, alho torrado, azeitona, orégano;119.9;97.9;85.9;68.9
Canadense;Muçarela, lombo, creme de leite com milho verde, azeitona, orégano;95.9;81.9;62.9;48.9
Carioca;Muçarela, presunto, cebola, parmesão, azeitona, orégano;95.9;81.9;63.9;47.9
Carne seca;Muçarela, carne seca, cebola, parmesão, azeitona, orégano;103.9;87.9;67.9;51.9
Catupiry;Catupiry, azeitona, orégano;100.9;84.9;65.9;48.9
Catupiry com frango;Catupiry, frango, azeitona, orégano;100.9;82.9;63.9;48.9
Catupiry com frango II;Catupiry, frango, ervilha, cebola, parmesão, azeitona, orégano;95.9;82.9;62.9;48.9
Carbonara;Muçarela, catupiry, bacon, ovos, cebola, parmesão, azeitona, orégano;100.9;85.9;65.9;49.9
Champignon;Muçarela, champignon, cebola, parmesão, azeitona, orégano;100.9;81.9;65.9;49.9
Chevalier;Muçarela, atum, ervilha, palmito, champignon, cebola, parmesão, azeitona, orégano;95.9;82.9;62.9;48.9
Cinco queijos;Gorgonzola, ricota, muçarela, provolone, catupiry, azeitona, orégano;101.9;82.9;65.9;48.9
Costela especial;Muçarela, costela desfiada, catupiry ou cream cheese, pimenta biquinho, cebola, parmesão, azeitona, orégano;114.9;97.9;83.9;67.9
Dom Camilo;Muçarela, calabresa, ricota, ervilha, cebola, parmesão, azeitona, orégano;100.9;82.9;62.9;48.9
Escarola;Muçarela, escarola, parmesão, aliche ou bacon, cebola, azeitona, orégano;95.9;81.9;63.9;47.9
Frango;Muçarela, frango, ervilha, cebola, parmesão, azeitona, orégano;95.9;81.9;63.9;47.9
Gorgonzola;Muçarela, gorgonzola, azeitona, orégano;100.9;81.9;65.9;50.9
Gorgonzola com atum e milho;Muçarela, gorgonzola, atum, milho verde, azeitona, orégano;100.9;81.9;65.9;51.9
Japonesa;Muçarela, atum, aliche, camarão, parmesão, cebola, azeitona, orégano;119.9;101.9;86.9;63.9
Lombinho;Muçarela, lombo canadense, cebola, parmesão, azeitona, orégano;95.9;81.9;63.9;47.9
Lombinho com milho verde;Muçarela, lombo canadense, milho verde, parmesão, cebola, azeitona, orégano;95.9;81.9;63.9;48.9
Macilliana;Muçarela, peito de peru, champignon, milho verde, tomate seco, cebola, parmesão, orégano;96.9;82.9;62.9;48.9
Manjericão;Muçarela de búfala, manjericão, tomate, azeitona, orégano;99.9;84.9;65.9;49.9
Manjerona;Muçarela de búfala, manjericão, palmito, champignon, tomate seco, cebola, parmesão, azeitona, orégano;100.9;82.9;65.9;49.9
Marguerita;Muçarela, manjericão, tomate, parmesão, azeitona, orégano;96.9;81.9;63.9;47.9
Mexicana;Muçarela, frango, milho verde, cebola, parmesão, bacon, azeitona, orégano;95.9;81.9;62.9;47.9
Milho verde;Muçarela, milho verde, atum, parmesão, cebola, azeitona, orégano;95.9;81.9;63.9;47.9
Mineira;Ricota coberta com muçarela, parmesão, orégano;95.9;81.9;63.9;47.9
Mista;Muçarela, calabresa, champignon, parmesão, cebola, azeitona, orégano;100.9;81.9;63.9;47.9
Namorados;Catupiry, palmito, coberta com muçarela, azeitona, orégano;100.9;82.9;63.9;48.9
Napolli;Muçarela de búfala, peito de peru, ricota, tomate, azeitona, orégano;95.9;84.9;65.9;59.9
Palmito com muçarela;Muçarela, palmito, cebola, parmesão, azeitona, orégano;100.9;82.9;65.9;48.9
Parmed'Oro;Muçarela, tomate, parmesão, azeitona, orégano;95.9;81.9;63.9;47.9
Peperone;Muçarela, peperone, cebola, parmesão, azeitona, orégano;100.9;82.9;65.9;48.9
Pizzaiolo;Muçarela, presunto, champignon, parmesão, cebola, azeitona, orégano;100.9;82.9;65.9;48.9
Portuguesa;Muçarela, presunto, ervilha, palmito, calabresa, ovos, cebola, bacon, parmesão, azeitona, orégano;100.9;82.9;65.9;48.9
Provolone;Provolone derretido, muçarela, orégano;95.9;81.9;63.9;47.9
Quatro queijos;Gorgonzola, ricota, muçarela, provolone, azeitona, orégano;96.9;82.9;65.9;48.9
Regatella;Muçarela, presunto, peperone, milho verde, ovos, cebola, parmesão, azeitona, orégano;96.9;82.9;65.9;48.9
Ricota;Ricota, palmito, calabresa, cebola, muçarela, parmesão, azeitona, orégano;96.9;82.9;65.9;48.9
Romarolla;Catupiry, frango, milho verde, tomate seco, cebola, azeitona, orégano;96.9;82.9;65.9;48.9
Rúcula;Muçarela de búfala, rúcula, tomate seco, azeitona, orégano;99.9;84.9;65.9;49.9
Tofitella;Muçarela de búfala, peperone, champignon, tomate seco, cebola, azeitona, orégano;96.9;82.9;65.9;48.9
Tomate seco;Muçarela, tomate seco, azeitona, orégano;96.9;82.9;65.9;48.9
Tomate seco II;Muçarela de búfala, tomate seco, azeitona, orégano;99.9;84.9;65.9;49.9
Três queijos;Gorgonzola, provolone, muçarela, azeitona, orégano;96.9;80.9;61.9;47.9
Turruta;Catupiry com milho verde, muçarela, azeitona, orégano;96.9;82.9;65.9;48.9`)},
 {id:'doces',t:'Pizzas doces',pz:1,it:P(`Abacaxi com chocolate;Muçarela, chocolate, abacaxi, granulado;101.9;83.9;65.9;48.9
Banana com canela e açúcar;Muçarela, banana, canela, açúcar;91.9;77.9;59.9;46.9
Chocobanana;Muçarela, banana, chocolate, granulado;99.9;83.9;65.9;48.9
Chocolate;Muçarela, chocolate, granulado;98.9;81.9;65.9;47.9
Chocolate com morango;Muçarela, morango, chocolate, granulado;99.9;85.9;65.9;48.9
Morango Maravilha;Morango, catupiry, chocolate branco;94.9;81.9;65.9;48.9
Prestígio;Muçarela, chocolate branco, coco, chocolate;94.9;81.9;66.9;48.9
Romeu e Julieta;Catupiry, goiabada;93.9;80.9;59.9;46.9
Sedução;Banana ou abacaxi, catupiry, chocolate branco;94.9;81.9;65.9;47.9
Sensação;Muçarela, chocolate, morango, bombom, castanha de caju;93.9;80.9;65.9;49.9`)},
 {id:'esfihas',t:'Esfihas',it:L('Tradicionais~21.90~Alho, aliche, atum, bacon, calabresa, champignon, escarola, frango, lombo, palmito, peperone ou presunto com muçarela; catupiry; catupiry com frango; provolone; queijo|Sabores especiais~23.90~Australiana, berinjela, canadense, carbonara, carne seca, gorgonzola, marguerita, mista, namorados, napolli, pizzaiolo, quatro queijos, rúcula|Premium~28.90~Camarão, camarão da casa, camarão especial, costela especial, portuguesa, creme de avelã|Doces~21.90~Banana com canela e açúcar, chocolate, Romeu e Julieta|Doces especiais~23.90~Chocobanana, chocolate com morango, Morango Maravilha, Prestígio, Sedução, Sensação')},
 {id:'bebidas',t:'Bebidas e vinhos',it:L('Chopp (caneca)~13.90|Cerveja long neck~14.90|Refrigerante lata~10.90|H2O 500 ml~11.90|Água mineral~6.00|Suco de laranja~13.90|Sucos em lata~10.90|Jarra de suco de laranja P~35.90|Jarra de suco de laranja G~55.90|Ice tea pêssego 300 ml~9.90|Mate 300 ml~9.90|Caipirinha~22.00|Caipivodka~25.00|Vinho (caneca ou taça)~18.90|Jarra de vinho P~35.90|Jarra de vinho G~43.90|Almadén~65.90~Brasil|Santa Carolina~56.90~Chile|Casillero del Diablo~78.90~Chile|Santa Helena~85.90~Chile|Piriquita~104.90~Portugal|Casal Garcia~104.90~Portugal')}
]};

/* Tamanhos de pizza, na ordem dos preços (v[0..3]). */
const SIZES = ['Família', 'Grande', 'Média', 'Brotinho'];

const cat = (u, id) => M[u].find(c => c.id === id);

/* --- Itaipu: massas, bordas e esfihas --- */
cat('itaipu', 'massas').choose = { label: 'Massa', options: ['Inhoque', 'Canelone', 'Rondelli', 'Fettuccine', 'Lasanha'] };
cat('itaipu', 'pizzas').addons = { type: 'single', label: 'Borda recheada', options: [
  { label: 'Sem borda recheada', price: 0 },
  { label: 'Borda de catupiry', price: [20, 20, 16, 16] },
  { label: 'Borda de cream cheese', price: [20, 20, 16, 16] }] };
/* Valor da borda doce não informado no site oficial: fica "a consultar". */
cat('itaipu', 'doces').addons = { type: 'single', label: 'Borda doce', options: [
  { label: 'Sem borda', price: 0 },
  { label: 'Borda de chocolate ao leite', price: null },
  { label: 'Borda de chocolate branco', price: null },
  { label: 'Borda de doce de leite', price: null }] };
cat('itaipu', 'esfihas').it = [
  { n: 'Esfiha salgada tradicional', p: 22.90, opts: ['Calabresa', 'Carioca', 'Catupiry', 'Catupiry com frango', 'Frango', 'Lombo', 'Marguerita', 'Muçarela'] },
  { n: 'Esfiha salgada especial', p: 24.90, opts: ['4 queijos', 'Atum', 'Australiana', 'Baiacatu', 'Canadense', 'Carne seca', 'Champignon', 'Gorgonzola', 'Namorados', 'Palmito com muçarela', 'Peperone', 'Provolone', 'Rúcula com tomate seco'] },
  { n: 'Esfiha salgada premium', p: 25.90, opts: ['Calabresa poró', 'Calabresa suprema', 'Carbonara', 'Frango poró'] },
  { n: 'Esfiha salgada da casa', p: 27.90, opts: ['Camarão', 'Carne seca com queijo coalho', 'Portuguesa'] },
  { n: 'Esfiha salgada especial da casa', p: 28.90, opts: ['Camarão da casa', 'Camarão poró', 'Costela desfiada com pimenta biquinho'] },
  { n: 'Esfiha doce', p: 22.90, opts: ['Banana', 'Romeu e Julieta'] },
  { n: 'Esfiha doce especial', p: 24.90, opts: ['Chocolate', 'Chocobanana', 'Doce de leite com banana'] },
  { n: 'Esfiha doce crocante', p: 25.90, opts: ['Abacaxi crocante', 'Banana crocante', 'Brownie'] },
  { n: 'Esfiha de morango com chocolate', p: 28.90 }];

/* --- Pendotiba: massas, adicionais e esfihas --- */
cat('pendotiba', 'massas').choose = { label: 'Massa', options: ['Inhoque', 'Inhoque de batata-doce', 'Canelone', 'Lasanha', 'Fettuccine', 'Rondelli'] };
cat('pendotiba', 'pizzas').addons = { type: 'multi', label: 'Adicionais', options: [
  { label: 'Cheddar', price: 7 }, { label: 'Catupiry', price: 7 },
  { label: 'Cream cheese', price: 8 }, { label: 'Ingrediente extra (informe nas observações)', price: 5 }] };
cat('pendotiba', 'esfihas').it = [
  { n: 'Esfiha tradicional', p: 21.90, opts: ['Alho com muçarela', 'Aliche com muçarela', 'Atum com muçarela', 'Bacon com muçarela', 'Calabresa com muçarela', 'Catupiry', 'Catupiry com frango', 'Champignon com muçarela', 'Escarola com muçarela', 'Frango com muçarela', 'Lombo com muçarela', 'Palmito com muçarela', 'Peperone com muçarela', 'Presunto com muçarela', 'Provolone', 'Queijo'] },
  { n: 'Esfiha especial', p: 23.90, opts: ['Australiana', 'Berinjela', 'Canadense', 'Carbonara', 'Carne seca', 'Gorgonzola', 'Marguerita', 'Mista', 'Namorados', 'Napolli', 'Pizzaiolo', 'Quatro queijos', 'Rúcula'] },
  { n: 'Esfiha premium', p: 28.90, opts: ['Camarão', 'Camarão da casa', 'Camarão especial', 'Costela especial', 'Portuguesa', 'Creme de avelã'] },
  { n: 'Esfiha doce', p: 21.90, opts: ['Banana com canela e açúcar', 'Chocolate', 'Romeu e Julieta'] },
  { n: 'Esfiha doce especial', p: 23.90, opts: ['Chocobanana', 'Chocolate com morango', 'Morango Maravilha', 'Prestígio', 'Sedução', 'Sensação'] }];

/* Identificador estável de cada item: unidade|categoria|nome */
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
Object.keys(M).forEach(u => M[u].forEach(c => c.it.forEach(i => { i.key = u + '|' + c.id + '|' + slug(i.n); if (Number.isNaN(i.p)) i.p = null; })));

const api = { units: M, SIZES, slug, find: key => { const [u, c] = key.split('|'); const ct = (M[u] || []).find(x => x.id === c); return ct ? { cat: ct, item: ct.it.find(i => i.key === key) } : null; } };
root.DL = root.DL || {}; root.DL.menu = api;
if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
