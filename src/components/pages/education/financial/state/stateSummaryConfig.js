// Cards de resumo das tabelas estaduais (mesmo componente das municipais:
// municipality/tables/SummaryCards.jsx). Os nomes de coluna são os cabeçalhos
// dos CSVs em src/files/estado_tabela_N.csv — se um cabeçalho mudar lá, mude aqui.

const minimoFundebProfissionais = (ano) => (ano <= 2020 ? 60 : 70);

export const RESUMO_ESTADO = {
  tabela1: [
    { card: 'total', coluna: 'TOTAL IMPOSTOS PRÓPRIOS', rotulo: 'Total arrecadado' },
    { card: 'maiorParte', total: 'TOTAL IMPOSTOS PRÓPRIOS', rotulo: 'Maior fonte' },
    { card: 'evolucao', coluna: 'TOTAL IMPOSTOS PRÓPRIOS', rotulo: 'Total por ano' },
  ],
  tabela2: [
    { card: 'total', coluna: 'Receita Líquida de impostos próprios', rotulo: 'Receita líquida de impostos próprios' },
    { card: 'evolucao', coluna: 'Receita Líquida de impostos próprios', rotulo: 'Total por ano' },
  ],
  tabela3: [
    { card: 'total', coluna: 'TOTAL_RECEITAS_TRANSFERENCIAS', rotulo: 'Total recebido' },
    { card: 'maiorParte', total: 'TOTAL_RECEITAS_TRANSFERENCIAS', rotulo: 'Maior transferência' },
    { card: 'evolucao', coluna: 'TOTAL_RECEITAS_TRANSFERENCIAS', rotulo: 'Total por ano' },
  ],
  tabela4: [
    { card: 'total', coluna: 'TOTAL_RECEITAS_TRANSFERENCIAS', rotulo: 'Total líquido recebido' },
    { card: 'maiorParte', total: 'TOTAL_RECEITAS_TRANSFERENCIAS', rotulo: 'Maior transferência' },
    { card: 'evolucao', coluna: 'TOTAL_RECEITAS_TRANSFERENCIAS', rotulo: 'Total por ano' },
  ],
  tabela5: [
    { card: 'total', coluna: 'TOTAL RECEITAS LÍQUIDAS', rotulo: 'Receita líquida total' },
    { card: 'maiorParte', total: 'TOTAL RECEITAS LÍQUIDAS', rotulo: 'Maior componente' },
    { card: 'evolucao', coluna: 'TOTAL RECEITAS LÍQUIDAS', rotulo: 'Total por ano' },
  ],
  tabela6: [
    { card: 'total', coluna: 'TOTAL RECEITAS ADICIONAIS', rotulo: 'Total de receitas adicionais' },
    { card: 'maiorParte', total: 'TOTAL RECEITAS ADICIONAIS', rotulo: 'Maior fonte' },
    { card: 'evolucao', coluna: 'TOTAL RECEITAS ADICIONAIS', rotulo: 'Total por ano' },
  ],
  tabela7: [
    { card: 'total', coluna: 'Total do Fundeb no Estado (com aplicação)', rotulo: 'Total do Fundeb' },
    { card: 'saldo', coluna: 'Resultado Líquido (ganhos ou perdas)', rotulo: 'Saldo da redistribuição' },
    { card: 'evolucao', coluna: 'Total do Fundeb no Estado (com aplicação)', rotulo: 'Total por ano' },
  ],
  tabela8: [
    { card: 'total', coluna: 'TOTAL COMPOSIÇÃO COMPLEMENTAÇÃO', rotulo: 'Complementação da União' },
    { card: 'maiorParte', total: 'TOTAL COMPOSIÇÃO COMPLEMENTAÇÃO', partes: ['VAAF', 'VAAT', 'VAAR'], rotulo: 'Maior modalidade' },
    { card: 'evolucao', coluna: 'TOTAL COMPOSIÇÃO COMPLEMENTAÇÃO', rotulo: 'Total por ano' },
  ],
  // Mínimo de 25% da receita de impostos em MDE (CF, art. 212)
  tabela9: [
    { card: 'limite', coluna: '% aplicado em MDE', minimo: 25, rotulo: 'Aplicado em MDE' },
    { card: 'cumprimento', coluna: '% aplicado em MDE', minimo: 25, rotulo: 'Cumpriu os 25%' },
    { card: 'total', coluna: 'Valor aplicado em MDE', rotulo: 'Valor aplicado em MDE' },
  ],
  // Fundeb: 60% (magistério) até 2020; 70% (profissionais da educação básica) a partir de 2021
  tabela10: [
    { card: 'limite', coluna: '% aplicado com profissionais da Educação Básica', minimo: minimoFundebProfissionais, rotulo: 'Do Fundeb para profissionais' },
    { card: 'cumprimento', coluna: '% aplicado com profissionais da Educação Básica', minimo: minimoFundebProfissionais, rotulo: 'Cumpriu o mínimo' },
    { card: 'total', coluna: 'Despesas com profissionais da Educação básica', rotulo: 'Gasto com profissionais' },
  ],
  tabela11: [
    { card: 'total', coluna: 'TOTAL', rotulo: 'Total gasto em MDE' },
    {
      card: 'maiorParte',
      total: 'TOTAL',
      // Creche e Pré-escola ficam de fora: já estão somadas em Educação Infantil
      partes: [
        'Educação Infantil', 'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Educação Especial',
        'Educação de Jovens e Adultos', 'Ensino Profissional não integrado ao profissional',
        'Administração Geral', 'Transporte Escolar', 'Outras',
      ],
      rotulo: 'Área com mais gasto',
    },
    { card: 'evolucao', coluna: 'TOTAL', rotulo: 'Total por ano' },
  ],
  tabela12: [
    { card: 'total', coluna: 'Total RPEB', rotulo: 'RPEB' },
    { card: 'evolucao', coluna: 'Total RPEB', rotulo: 'Total por ano' },
  ],
  // Sem selo de mínimo do VAAT aqui: a regra de 50% na educação infantil é pensada
  // para as redes municipais; para o Estado mostramos só o gasto total
  tabela13: [
    { card: 'total', coluna: 'TOTAL GERAL DE DESPESAS COM EDUCAÇÃO', rotulo: 'Total gasto com educação' },
    { card: 'evolucao', coluna: 'TOTAL GERAL DE DESPESAS COM EDUCAÇÃO', rotulo: 'Total por ano' },
  ],
};
