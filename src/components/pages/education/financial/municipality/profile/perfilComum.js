// Constantes e funções usadas pelos perfis de município e de território.

export const ANO_FINAL = 2024;
// Período escolhido no topo (fica na URL: ?periodo=5|10|todos)
export const PERIODOS = [
  { valor: '5', rotulo: 'Últimos 5 anos', anoInicial: ANO_FINAL - 4 },
  { valor: '10', rotulo: 'Últimos 10 anos', anoInicial: ANO_FINAL - 9 },
  { valor: 'todos', rotulo: 'Desde 2007', anoInicial: 2007 },
];
export const PERIODO_PADRAO = '10';

export const SECOES = [
  { titulo: 'Arrecadação', tabelas: ['ownRevenues', 'constitutionalTransfersRevenue', 'municipalTaxesRevenues'] },
  { titulo: 'Fundeb', tabelas: ['municipalFundebFundefComposition', 'complementationFundebFundef'] },
  { titulo: 'Cumprimento dos mínimos legais', tabelas: ['constitutionalLimitMde', 'expensesBasicEducationFundeb', 'complementaryProtocol'] },
  { titulo: 'Gastos e recursos da educação', tabelas: ['areasActivityExpense', 'additionalEducationRevenue', 'basicEducationMinimalPotential'] },
];

// Mesmo formato que a página de Municípios usa: { ano: [registros] }
export const agruparPorAno = (dadosMunicipio) => {
  const porAno = {};
  Object.values(dadosMunicipio || {}).forEach((registros) => {
    if (!Array.isArray(registros)) return;
    registros.forEach((r) => {
      const ano = String(r.ano);
      (porAno[ano] = porAno[ano] || []).push(r);
    });
  });
  return porAno;
};

// Território: Regioes usa chave (VALE_DO_CANINDE) na API e nome ("Vale do Canindé") na tela.
// Na URL vira "vale-do-caninde".
export const slugTerritorio = (chave) => chave.toLowerCase().replace(/_/g, '-');
export const chaveTerritorio = (slug) => String(slug || '').toUpperCase().replace(/-/g, '_');
