import { municipios, Regioes, FaixaPopulacional } from './municipios.mapping';

// Filtros da página /municipios <-> query string da URL, pra que a consulta
// sobreviva ao F5 e possa ser compartilhada por link
// (ex.: /municipios?tabela=areasActivityExpense&municipio=220670&anoInicial=2019&anoFinal=2024).
// Usado pelo RevenueTableContainer (aplica e grava) e pela sidebar (mostra preenchido).

const ANO_MIN = 2007;
const ANO_MAX = 2024;

const TABELAS_VALIDAS = [
  'ownRevenues',
  'constitutionalTransfersRevenue',
  'municipalTaxesRevenues',
  'additionalEducationRevenue',
  'municipalFundebFundefComposition',
  'complementationFundebFundef',
  'constitutionalLimitMde',
  'expensesBasicEducationFundeb',
  'areasActivityExpense',
  'basicEducationMinimalPotential',
  'complementaryProtocol',
];

// Nome do parâmetro na URL -> campo do objeto de filtros
const PARAMS = {
  municipio: 'codigoMunicipio',
  territorio: 'territorioDeDesenvolvimentoMunicipio',
  faixa: 'faixaPopulacionalMunicipio',
  aglomerado: 'aglomeradoMunicipio',
  gre: 'gerenciaRegionalMunicipio',
};

const lerAno = (valor) => {
  const ano = Number(valor);
  return Number.isInteger(ano) && ano >= ANO_MIN && ano <= ANO_MAX ? ano : null;
};

// Retorna o objeto de filtros no mesmo formato que a sidebar envia,
// ou null se a URL não tiver nenhum filtro (a página abre vazia, como antes).
export const lerFiltrosMunicipaisDaUrl = (search) => {
  const params = new URLSearchParams(search);
  const temAlgumFiltro = ['tabela', 'anoInicial', 'anoFinal', ...Object.keys(PARAMS)].some((p) => params.has(p));
  if (!temAlgumFiltro) return null;

  const tabela = params.get('tabela');
  let anoInicial = lerAno(params.get('anoInicial')) ?? ANO_MIN;
  let anoFinal = lerAno(params.get('anoFinal')) ?? ANO_MAX;
  if (anoInicial > anoFinal) [anoInicial, anoFinal] = [anoFinal, anoInicial];

  const filtros = {
    tableType: TABELAS_VALIDAS.includes(tabela) ? tabela : 'ownRevenues',
    anoInicial,
    anoFinal,
  };
  Object.entries(PARAMS).forEach(([param, campo]) => {
    filtros[campo] = params.get(param) || null;
  });

  // Valores inválidos na URL (link editado à mão, link antigo) são ignorados em vez
  // de derrubar a consulta com erro da API
  if (filtros.territorioDeDesenvolvimentoMunicipio && !Regioes[filtros.territorioDeDesenvolvimentoMunicipio]) {
    filtros.territorioDeDesenvolvimentoMunicipio = null;
  }
  if (filtros.faixaPopulacionalMunicipio && !FaixaPopulacional[filtros.faixaPopulacionalMunicipio]) {
    filtros.faixaPopulacionalMunicipio = null;
  }
  ['aglomeradoMunicipio', 'gerenciaRegionalMunicipio'].forEach((campo) => {
    if (filtros[campo] && !/^\d{1,3}$/.test(filtros[campo])) filtros[campo] = null;
  });

  // Código de município inexistente é ignorado em vez de quebrar a consulta
  if (filtros.codigoMunicipio && !municipios[filtros.codigoMunicipio]) {
    filtros.codigoMunicipio = null;
  }
  filtros.nomeMunicipio = filtros.codigoMunicipio
    ? municipios[filtros.codigoMunicipio].nomeMunicipio
    : null;

  return filtros;
};

export const filtrosMunicipaisParaUrl = (filtros) => {
  const params = new URLSearchParams();
  if (filtros.tableType) params.set('tabela', filtros.tableType);
  Object.entries(PARAMS).forEach(([param, campo]) => {
    if (filtros[campo]) params.set(param, filtros[campo]);
  });
  if (filtros.anoInicial) params.set('anoInicial', filtros.anoInicial);
  if (filtros.anoFinal) params.set('anoFinal', filtros.anoFinal);
  return params;
};
