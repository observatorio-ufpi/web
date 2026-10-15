// Tokens da identidade visual do OPEPI — fonte única das cores e da fonte.
// Os mesmos valores estão declarados em CSS (src/index.css, bloco @theme) para
// uso via classes do Tailwind (bg-brand, text-muted, border-line...).
// Ao mudar um valor aqui, mude lá também.

export const cores = {
  // Marca
  marca: '#8E4A2E', // terracota — ação principal, links (6,6:1 com texto branco)
  marcaEscura: '#733A23', // hover, ênfase
  areia: '#F3E6DE', // etiquetas, cabeçalho de tabela, fundos de destaque
  areiaEscura: '#EBD8CC', // coluna Total da tabela
  textoSobreAreia: '#5C3420',

  // Neutros
  tinta: '#2A2019', // títulos e números
  texto: '#4A3B30', // corpo
  textoSuave: '#7A6A5E', // legendas, rótulos (5,2:1 sobre branco)
  linha: '#E7DED6', // bordas e divisórias
  linhaForte: '#D9C9BC', // borda de campos e botões secundários
  superficie: '#FFFFFF',
  fundo: '#F6F3F2', // fundo do site
  zebra: '#FCFAF8', // linhas alternadas de tabela

  // Com significado
  atende: '#2E6E4F', // cumpriu o mínimo legal
  atencao: '#A65A0B', // avisos (ex.: valores corrigidos pelo IPCA)
  naoAtende: '#A33A2B', // abaixo do mínimo, erros

  // Séries de gráfico, nesta ordem
  series: ['#8E4A2E', '#D98E1E', '#2F6B7A', '#5E8C4A', '#7A4E6E'],

  // Paleta estendida para gráficos com muitas séries (ex.: composição com 10+ itens).
  // Começa pelas 5 séries principais; as seguintes alternam claro/escuro para
  // que séries vizinhas se distingam também pela luminosidade, não só pelo matiz.
  seriesEstendida: [
    '#8E4A2E', '#D98E1E', '#2F6B7A', '#5E8C4A', '#7A4E6E',
    '#D4A28A', '#6FA8B8', '#A6C08E', '#B88AAC', '#E8C07A',
    '#5C2E1C', '#1F4A55', '#3B5A2E', '#4F2F46', '#8C6A14',
    '#B9A99C', '#C8664A', '#4A7F8C', '#7E9E5E', '#9A6B8E',
  ],
};

export const fonte = '"Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
