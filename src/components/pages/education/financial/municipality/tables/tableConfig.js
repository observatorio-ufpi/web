// Configuração das 11 tabelas financeiras municipais: nome, transformação dos
// dados da API, mapeamento de colunas, correção monetária e cards de resumo.
// Compartilhada pela página de Municípios, pela comparação e pelo perfil do município.
import {
  transformDataForTableByYear,
  transformDataForTableRevenues,
} from "../../../../../../utils/dataTransformingUtils.jsx";
import {
  mapAdditionalMunicipalEducationRevenue,
  mapAllTables,
  mapAreasActivityExpense,
  mapBasicEducationMinimalPotential,
  mapComplementaryProtocol,
  mapComplementationFundebFundef,
  mapConstitutionalLimitMde,
  mapConstitutionalTransfersRevenue,
  mapExpensesBasicEducationFundeb,
  mapMunicipalFundebFundefComposition,
  mapMunicipalTaxesRevenues,
  mapOwnRevenues,
  standardizeTypeAdditionalEducationRevenues,
  standardizeTypeMunicipalTaxesRevenues,
  standardizedTypeAllTables,
  standardizedTypeAreasActivityExpense,
  standardizedTypeBasicEducationMinimalPotential,
  standardizedTypeComplementaryProtocol,
  standardizedTypeComplementationFundebFundef,
  standardizedTypeConstitutionalLimitMde,
  standardizedTypeConstitutionalTransfersRevenue,
  standardizedTypeExpensesBasicEducationFundeb,
  standardizedTypeMunicipalFundebFundefComposition,
  standardizedTypeOwnRevenues,
} from "../../../../../../utils/tablesMapping.jsx";

export const tableOptions = [
  { value: 'ownRevenues', label: 'Receita de impostos próprios' },
  { value: 'constitutionalTransfersRevenue', label: 'Receita de transferências constitucionais e legais' },
  { value: 'municipalTaxesRevenues', label: 'Receita Líquida de Impostos do Município' },
  { value: 'additionalEducationRevenue', label: 'Receitas adicionais da educação nos municípios.' },
  { value: 'municipalFundebFundefComposition', label: 'Composição do Fundeb nos municípios' },
  { value: 'complementationFundebFundef', label: 'Composição da complementação do Fundeb' },
  { value: 'constitutionalLimitMde', label: 'Aplicação do mínimo constitucional em MDE pelos municípios.' },
  { value: 'expensesBasicEducationFundeb', label: 'Despesas com profissionais da educação básica custeadas pelo Fundeb.' },
  { value: 'areasActivityExpense', label: 'Despesas em MDE por área de atuação' },
  { value: 'basicEducationMinimalPotential', label: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB)'},
  { value: 'complementaryProtocol', label: 'Protocolo Complementar' },
];

export const groupTypeOptions = [
  { value: 'desagregado', label: 'Desagregado (sem agrupamento)' },
  { value: 'municipio', label: 'Município' },
  { value: 'ano', label: 'Ano' },
];

// Config única por tabela — usada no render (renderTabela), no download avulso
// (downloadAllTables) e no consolidado (downloadAllTablesConsolidated).
// Antes esse objeto estava duplicado nos dois lugares; manter um só evita
// o tipo de divergência que já causou bug real (ver correção da Tabela 9).
export const TABLE_MAPPINGS = {
  ownRevenues: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeOwnRevenues,
    map: mapOwnRevenues,
    name: "Impostos_Proprios",
    displayName: "Impostos Próprios",
    resumo: [
      { card: "total", coluna: "Total de Receitas de Impostos Próprios", rotulo: "Total arrecadado" },
      { card: "maiorParte", total: "Total de Receitas de Impostos Próprios", rotulo: "Principal fonte de arrecadação" },
      { card: "evolucao", coluna: "Total de Receitas de Impostos Próprios", rotulo: "Evolução da arrecadação anual", periodoNoRotulo: true },
    ],
    monetaryCorrection: true,
  },
  constitutionalTransfersRevenue: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeConstitutionalTransfersRevenue,
    map: mapConstitutionalTransfersRevenue,
    name: "Receita_Transferencias_Constitucionais_Legais",
    displayName: "Receita de transferências constitucionais e legais",
    resumo: [
      { card: "total", coluna: "Total de Transferências Constitucionais e Legais", rotulo: "Total recebido" },
      { card: "maiorParte", total: "Total de Transferências Constitucionais e Legais", rotulo: "Maior transferência" },
      { card: "evolucao", coluna: "Total de Transferências Constitucionais e Legais", rotulo: "Total por ano" },
    ],
    monetaryCorrection: true,
  },
  municipalTaxesRevenues: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizeTypeMunicipalTaxesRevenues,
    map: mapMunicipalTaxesRevenues,
    name: "Receita_Liquida_Impostos_Municipio",
    displayName: "Receita Líquida de Impostos do Município",
    resumo: [
      { card: "total", coluna: "Total de Receita Líquida de Impostos", rotulo: "Receita líquida" },
      { card: "maiorParte", total: "Total de Receita Líquida de Impostos", rotulo: "Maior componente" },
      { card: "evolucao", coluna: "Total de Receita Líquida de Impostos", rotulo: "Total por ano" },
    ],
    monetaryCorrection: true,
  },
  additionalEducationRevenue: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizeTypeAdditionalEducationRevenues,
    map: mapAdditionalMunicipalEducationRevenue,
    name: "Receitas_Adicionais_Educacao_Municipio",
    displayName: "Receitas adicionais da educação nos municípios.",
    resumo: [
      { card: "total", coluna: "Total de Receitas Adicionais da Educação", rotulo: "Total das receitas adicionais" },
      { card: "maiorParte", total: "Total de Receitas Adicionais da Educação", rotulo: "Principal fonte de receita" },
      { card: "evolucao", coluna: "Total de Receitas Adicionais da Educação", rotulo: "Total por ano" },
    ],
    monetaryCorrection: true,
  },
  municipalFundebFundefComposition: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeMunicipalFundebFundefComposition,
    map: mapMunicipalFundebFundefComposition,
    name: "Composicao_Fundef_Fundeb_Municipio",
    displayName: "Composição do Fundeb nos municípios",
    resumo: [
      { card: "total", coluna: "Total do Fundeb", rotulo: "Total de recursos do Fundeb" },
      {
        card: "saldo",
        coluna: "Resultado Líquido (ganhos ou perdas = recebido - enviado)",
        rotulo: "Saldo líquido da redistribuição",
        textoPositivo: "O município recebeu mais recursos do Fundeb do que contribuiu para sua composição.",
        textoNegativo: "O município contribuiu mais para a composição do Fundeb do que recebeu de recursos.",
      },
      { card: "evolucao", coluna: "Total do Fundeb", rotulo: "Total por ano" },
    ],
  },
  complementationFundebFundef: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeComplementationFundebFundef,
    map: mapComplementationFundebFundef,
    name: "Composicao_Complementacao_Fundef_Fundeb",
    displayName: "Composição da complementação do Fundef/Fundeb",
    resumo: [
      { card: "total", coluna: "Total de Composição da Complementação do Fundeb", rotulo: "Total da complementação da União" },
      { card: "maiorParte", total: "Total de Composição da Complementação do Fundeb", partes: ["VAAF", "VAAT", "VAAR"], rotulo: "Principal modalidade de complementação" },
      { card: "evolucao", coluna: "Total de Composição da Complementação do Fundeb", rotulo: "Total por ano" },
    ],
  },
  areasActivityExpense: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeAreasActivityExpense,
    map: mapAreasActivityExpense,
    name: "Despesas_MDE_Area_Atuacao",
    displayName: "Despesas em MDE por área de atuação",
    resumo: [
      { card: "total", coluna: "Total de Despesas Típicas com MDE", rotulo: "Total das despesas em MDE" },
      {
        card: "maiorParte",
        total: "Total de Despesas Típicas com MDE",
        // Creche e Pré-escola ficam de fora: já estão somadas em Educação Infantil
        partes: ["Educação Infantil", "Ensino Fundamental", "Ensino Médio", "Ensino Superior", "Educação Especial", "Educação Jovens e Adultos", "Ensino Profissional não integrado ao ensino regular", "Outras"],
        rotulo: "Etapa com maiores despesas",
      },
      { card: "evolucao", coluna: "Total de Despesas Típicas com MDE", rotulo: "Total por ano" },
    ],
  },
  basicEducationMinimalPotential: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeBasicEducationMinimalPotential,
    map: mapBasicEducationMinimalPotential,
    name: "Receita_Potencial_Minima_Educacao_Basica",
    displayName: "Receita Potencial Mínima vinculada à Educação Básica",
    resumo: [
      { card: "total", coluna: "Total da RPEB", rotulo: "RPEB" },
      { card: "evolucao", coluna: "Total da RPEB", rotulo: "Total por ano" },
    ],
  },
  constitutionalLimitMde: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeConstitutionalLimitMde,
    map: mapConstitutionalLimitMde,
    name: "Limite_Constitucional_MDE_Municipio",
    displayName: "Aplicação do mínimo constitucional em MDE pelos municípios.",
    resumo: [
      // Mínimo de 25% da receita de impostos em MDE (CF, art. 212)
      {
        card: "limite", coluna: "% aplicado em MDE", minimo: 25, rotulo: "Percentual aplicado em MDE",
        rotuloMinimo: "Mínimo constitucional", textoAtende: "Atende ao mínimo constitucional", textoAbaixo: "Abaixo do mínimo constitucional",
      },
      { card: "cumprimento", coluna: "% aplicado em MDE", minimo: 25, rotulo: "Cumprimento do mínimo legal de 25%" },
      { card: "total", coluna: "Valor aplicado em MDE", rotulo: "Valor aplicado em MDE" },
    ],
  },
  expensesBasicEducationFundeb: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeExpensesBasicEducationFundeb,
    map: mapExpensesBasicEducationFundeb,
    name: "Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb",
    displayName: "Despesas com profissionais da educação básica custeadas pelo Fundeb.",
    resumo: [
      // Fundeb: 60% para o magistério até 2020 (Lei 11.494/2007); 70% para profissionais
      // da educação básica a partir de 2021 (Lei 14.113/2020)
      {
        card: "limite", coluna: "% aplicado com profissionais da Educação Básica", minimo: (ano) => (ano <= 2020 ? 60 : 70),
        rotulo: "Percentual do Fundeb destinado aos profissionais",
        textoAtende: "Atende ao mínimo legal", textoAbaixo: "Abaixo do mínimo legal",
      },
      { card: "cumprimento", coluna: "% aplicado com profissionais da Educação Básica", minimo: (ano) => (ano <= 2020 ? 60 : 70), rotulo: "Cumprimento do mínimo legal" },
      { card: "total", coluna: "Despesas com profissionais da Educação básica", rotulo: "Despesas com profissionais da educação", virgulaAntesDoAno: true, pontoFinal: true },
    ],
  },
  complementaryProtocol: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeComplementaryProtocol,
    map: mapComplementaryProtocol,
    name: "Protocolo_Complementar",
    displayName: "Protocolo Complementar",
    resumo: [
      // VAAT: 50% na educação infantil e 15% em despesas de capital (Lei 14.113/2020, arts. 27 e 28)
      // 0% = não recebeu complementação VAAT (a regra só vale para quem recebe)
      {
        card: "limite", coluna: "VAAT aplicado na educação infantil(%)", minimo: 50, rotulo: "VAAT aplicado na educação infantil",
        zeroSemAplicacao: true, textoSemAplicacao: "O percentual de aplicação é de 0% no período, pois o município não recebeu a complementação-VAAT. O percentual mínimo de 50% aplica-se somente aos municípios beneficiários dessa complementação.",
      },
      {
        card: "limite", coluna: "VAAT aplicado em despesas de capital(%)", minimo: 15, rotulo: "VAAT aplicado em despesas de capital", pontoFinal: true,
        zeroSemAplicacao: true, textoSemAplicacao: "O percentual de aplicação é de 0% no período, pois o município não recebeu a complementação-VAAT. O percentual mínimo de 15% aplica-se somente aos municípios beneficiários dessa complementação.",
      },
      { card: "total", coluna: "Total geral das despesas com educação", rotulo: "Total geral despesas com educação" },
    ],
  },
  allTables: {
    transformByMunicipio: transformDataForTableRevenues,
    transformByAno: transformDataForTableByYear,
    standardize: standardizedTypeAllTables,
    map: mapAllTables,
    name: "Tabelao_RREO",
    displayName: "Tabelão",
  },
};
