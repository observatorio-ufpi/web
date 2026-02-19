import { municipios } from "./municipios.mapping";

const createProcessFunction = (indicatorType) => (rawData, colorPalette) => {
  let rows = [];
  const municipalityColorsTemp = {};

  // Extrair dados - verificar se vem com estrutura de paginação ou diretamente
  const dataToProcess = rawData?.data || rawData;
  
  if (!dataToProcess || typeof dataToProcess !== 'object') {
    console.warn('processIndicatorsData: dados inválidos ou vazios', rawData);
    return {
      chartData: {
        labels: [],
        datasets: [{
          label: `Composição ${indicatorType}`,
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        }],
      },
      municipalityColors: {},
    };
  }

  // Função auxiliar para processar cada item de dados
  const processDataItem = (item) => {
    const codigoMunicipio = item.codigoMunicipio;
    const nomeMunicipio = municipios[codigoMunicipio]?.nomeMunicipio || `Município ${codigoMunicipio}`;
    const ano = item.ano;
    const indicador = item.indicador?.find((ind) => ind.tipo === indicatorType);
    const percentageValue = indicador?.valor || 0;
    
    rows.push({ ano, nomeMunicipio, percentageValue, codigoMunicipio });
    
    if (!municipalityColorsTemp[codigoMunicipio]) {
      const colorIndex = Object.keys(municipalityColorsTemp).length % colorPalette.length;
      municipalityColorsTemp[codigoMunicipio] = {
        color: colorPalette[colorIndex],
        name: nomeMunicipio,
      };
    }
  };

  // Iterar pela estrutura de dados (pode ser agrupada por município ou por ano)
  Object.entries(dataToProcess).forEach(([groupKey, groupData]) => {
    // groupData é o objeto com os períodos (revenues0708, revenues0914, etc.)
    if (groupData && typeof groupData === 'object') {
      Object.entries(groupData).forEach(([periodKey, periodData]) => {
        // periodData é o array de dados do período
        if (Array.isArray(periodData)) {
          periodData.forEach((item) => {
            if (item && item.codigoMunicipio) {
              processDataItem(item);
            }
          });
        }
      });
    }
  });

  // Ordenar por ano e nomeMunicipio
  rows.sort((a, b) => {
    const anoA = parseInt(a.ano) || 0;
    const anoB = parseInt(b.ano) || 0;
    if (anoA !== anoB) return anoA - anoB;
    return (a.nomeMunicipio || '').localeCompare(b.nomeMunicipio || '');
  });

  const labels = rows.map(row => `${row.ano} - ${row.nomeMunicipio}`);
  const percentages = rows.map(row => {
    const value = parseFloat(row.percentageValue);
    return isNaN(value) ? 0 : value.toFixed(2);
  });
  const backgroundColors = rows.map(row => municipalityColorsTemp[row.codigoMunicipio]?.color || colorPalette[0]);
  const borderColors = backgroundColors;

  return {
    chartData: {
      labels: labels,
      datasets: [
        {
          label: `Composição ${indicatorType}`,
          data: percentages,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    municipalityColors: municipalityColorsTemp,
  };
};

export const processIptuData = createProcessFunction("IPTU");
export const processIssData = createProcessFunction("ISS");
export const processItbiData = createProcessFunction("ITBI");
export const processIrrfData = createProcessFunction("IRRF");
export const processIpvaData = createProcessFunction("COTA_PARTE_IPVA");
export const processIcmsData = createProcessFunction("COTA_PARTE_ICMS");
export const processFpmData = createProcessFunction("FPM");
export const processIofOuroData = createProcessFunction("COTA_PARTE_IOF_OURO");
export const processOutrasTransferenciasData = createProcessFunction(
  "OUTRAS_TRANSFERENCIAS"
);
export const processIcmsDesoneracaoData =
  createProcessFunction("ICMS_DESONERACAO");
export const processCotaParteIpiData = createProcessFunction("COTA_PARTE_IPI");
export const processCotaParteItrData = createProcessFunction("COTA_PARTE_ITR");
export const processParticipacaoReceitaImpostosProprios = createProcessFunction(
  "PARTICIPACAO_RECEITA_IMPOSTOS_PROPRIOS"
);
export const processParticipacaoTransferencias = createProcessFunction(
  "PARTICIPACAO_TRANSFERENCIAS"
);
export const processRazaoImpostosTransferencias = createProcessFunction(
  "RAZAO_IMPOSTOS_TRANSFERENCIAS"
);
export const processRazaoTransferenciasImpostos = createProcessFunction(
  "RAZAO_TRANSFERENCIAS_IMPOSTOS"
);
export const processParticipacaoFundeb = createProcessFunction(
  "PARTICIPACAO_FUNDEB"
);
export const processFundebParticipationMde = createProcessFunction(
  "PARTICIPACAO_FUNDEB_MDE"
);
export const processResultadoLiquidoFundeb = createProcessFunction(
  "RESULTADO_LIQUIDO_FUNDEB"
);
export const processParticipacaoComplementacaoUniao = createProcessFunction(
  "PARTICIPACAO_COMPLEMENTACAO_UNIAO"
);
export const processParticipacaoReceitasAdicionais = createProcessFunction(
  "PARTICIPACAO_RECEITAS_ADICIONAIS"
);
export const processMdeTotalExpense =
  createProcessFunction("DESPESA_TOTAL_MDE");
export const processMdePessoalAtivo =
  createProcessFunction("DESPESAS_PESSOAL_ATIVO_MDE");
export const processMdePessoalInativo = createProcessFunction(
  "DESPESAS_PESSOAL_INATIVO_MDE"
);
export const processMdeCapital = createProcessFunction("DESPESAS_CAPITAL_MDE");
export const processMdeTransferenciasInstituicoesPrivadas =
  createProcessFunction("TRANSFERENCIAS_INSTITUICOES_PRIVADAS_MDE");

export const processMdeResourcesApplicationControl = createProcessFunction(
  "APLICACAO_MDE"
);
export const processFundebResourcesApplicationControl = createProcessFunction(
  "APLICACAO_FUNDEB_PAG_PROFISSIONAIS_EDUCACAO"
);
export const processEducationalVaatResourcesApplicationControl = createProcessFunction(
  "APLICACAO_VAAT_EDUCACAO_INFANTIL"
);
export const processCapitalVaatResourcesApplicationControl = createProcessFunction(
  "APLICACAO_VAAT_DESPESA_CAPITAL"
);

export const processFundebFinancingCapacity = createProcessFunction(
  "PARTICIPACAO_FUNDEB_COMPOSICAO"
);
export const processRpebFinancingCapacity = createProcessFunction(
  "RPEB_FINANCING_CAPACITY"
);
