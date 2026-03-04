import { municipios } from "./municipios.mapping";

// Função genérica para processar dados de indicadores simples (valor único)
export const processGenericIndicatorData = (rawData, colorPalette, labelPrefix = 'Valor') => {
  const labels = [];
  const values = [];
  const backgroundColors = [];
  const borderColors = [];
  const municipalityColorsTemp = {};

  // Os dados podem vir em rawData.data (paginado) ou diretamente em rawData
  const dataToProcess = rawData?.data || rawData;

  if (!dataToProcess || typeof dataToProcess !== 'object') {
    return {
      chartData: {
        labels: [],
        datasets: [{
          label: labelPrefix,
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        }],
      },
      municipalityColors: {},
    };
  }

  // Processar dados agrupados por município ou ano
  Object.entries(dataToProcess).forEach(([groupKey, groupData]) => {
    if (typeof groupData !== 'object' || groupData === null) return;

    // groupData pode ter várias chaves como revenues0708, revenues0914, etc.
    Object.entries(groupData).forEach(([periodKey, periodData]) => {
      if (!Array.isArray(periodData)) return;

      periodData.forEach((item) => {
        const codigoMunicipio = item.codigoMunicipio;
        const nomeMunicipio = municipios[codigoMunicipio]?.nomeMunicipio || codigoMunicipio;
        const ano = item.ano;

        // Buscar o valor no array indicador
        const indicador = item.indicador || [];
        const indicadorData = indicador[0]; // Geralmente há apenas um indicador
        const valor = indicadorData?.valor ?? indicadorData?.porcentagem ?? 0;

        labels.push(`${ano} - ${nomeMunicipio}`);
        values.push(typeof valor === 'number' ? valor.toFixed(2) : valor);

        if (!municipalityColorsTemp[codigoMunicipio]) {
          const colorIndex = Object.keys(municipalityColorsTemp).length % colorPalette.length;
          municipalityColorsTemp[codigoMunicipio] = {
            color: colorPalette[colorIndex],
            name: nomeMunicipio,
          };
        }

        backgroundColors.push(municipalityColorsTemp[codigoMunicipio].color);
        borderColors.push(municipalityColorsTemp[codigoMunicipio].color);
      });
    });
  });

  return {
    chartData: {
      labels: labels,
      datasets: [
        {
          label: labelPrefix,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    municipalityColors: municipalityColorsTemp,
  };
};

// Funções especializadas usando a função genérica
export const processParticipacaoImpostosPropriosData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Participação Impostos Próprios');
};

export const processParticipacaoTransferenciasData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Participação Transferências');
};

export const processRazaoImpostosTransferenciasData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, 'Razão Impostos/Transferências [%]');
};

export const processRazaoTransferenciasImpostosData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, 'Razão Transferências/Impostos [%]');
};

export const processParticipacaoFundebData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Participação FUNDEB');
};

export const processParticipacaoFundebMdeData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Participação Fundeb na MDE');
};

export const processResultadoLiquidoFundebData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Resultado Líquido Fundeb');
};

export const processParticipacaoComplementacaoUniaoData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Complementação da União');
};

export const processDespesaPessoalAtivoData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Despesa Pessoal Ativo');
};

export const processDespesaPessoalInativoData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Despesa Pessoal Inativo');
};

export const processDespesaCapitalData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Despesa de Capital');
};

export const processTransferenciasPrivadasData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Transferências Instituições Privadas');
};

export const processVaatEducacaoInfantilData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Aplicação VAAT Educação Infantil');
};

export const processVaatDespesaCapitalData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, '% Aplicação VAAT Despesa de Capital');
};

export const processRpebData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, 'RPEb (R$)');
};

export const processDespesaTotalMdeData = (rawData, colorPalette) => {
  return processGenericIndicatorData(rawData, colorPalette, 'Despesa Total MDE (R$)');
};

export const processMDEData = (rawData, colorPalette) => {
    const labels = [];
    const percentages = [];
    const backgroundColors = [];
    const borderColors = [];
    const municipalityColorsTemp = {};

    Object.entries(rawData).forEach(([year, dataPerYear]) => {
      Object.keys(dataPerYear).forEach((key) => {
        Object.entries(dataPerYear[key]).forEach(([key, data]) => {
          data.forEach((municipality) => {
            const codigoMunicipio = municipality.codigoMunicipio;
            const nomeMunicipio = municipios[codigoMunicipio]?.nomeMunicipio || "";
            const ano = municipality.ano;

            const cumprimentoLimites = Object.values(municipality).find(
              prop => Array.isArray(prop) && prop.some(item =>
                item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS' ||
                item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS_MDE' ||
                item.tipo === "PERCENTUAL_DE_APLICACAO_MDE_SOBRE_RECEITA_LIQUIDA_IMPOSTOS" ||
                item.tipo === "PERCENTUAL_APLICADO_MDE"
              )
            );

            const percentageData = cumprimentoLimites?.find(item =>
              item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS' ||
              item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS_MDE' ||
              item.tipo === "PERCENTUAL_DE_APLICACAO_MDE_SOBRE_RECEITA_LIQUIDA_IMPOSTOS" ||
              item.tipo === "PERCENTUAL_APLICADO_MDE"
            );

            const percentageApplied = percentageData?.porcentagem || percentageData?.valor || 0;

            labels.push(`${ano} - ${nomeMunicipio}`);
            percentages.push(percentageApplied.toFixed(2));

            if (!municipalityColorsTemp[codigoMunicipio]) {
              const colorIndex = Object.keys(municipalityColorsTemp).length % colorPalette.length;
              municipalityColorsTemp[codigoMunicipio] = {
                color: colorPalette[colorIndex],
                name: nomeMunicipio
              };
            }

            backgroundColors.push(municipalityColorsTemp[codigoMunicipio].color);
            borderColors.push(municipalityColorsTemp[codigoMunicipio].color);
          });
        });
      });
    });

    return {
      chartData: {
        labels: labels,
        datasets: [
          {
            label: '% Aplicado em MDE',
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

export const processBasicEducationData = (rawData, colorPalette) => {
    const labels = [];
    const percentages = [];
    const backgroundColors = [];
    const borderColors = [];
    const municipalityColorsTemp = {};

    Object.entries(rawData).forEach(([year, dataPerYear]) => {
      Object.keys(dataPerYear).forEach((key) => {
        Object.entries(dataPerYear[key]).forEach(([key, data]) => {
          data.forEach((municipality) => {
            const codigoMunicipio = municipality.codigoMunicipio;
            const nomeMunicipio = municipios[codigoMunicipio]?.nomeMunicipio || "";
            const ano = municipality.ano;

            const cumprimentoLimites = Object.values(municipality).find(
            prop => Array.isArray(prop) && prop.some(item =>
                item.tipo === 'MINIMO_60_PORCENTO_DO_FUNDEF_NA_REMUNERACAO_ENSINO_FUNDAMENTAL' ||
                item.tipo === 'MINIMO_60_PORCENTO_FUNDEB_REMUNERACAO_MAGISTERIO_EDUCACAO' ||
                item.tipo === "MINIMO_60_PORCENTO_FUNDEB_REMUNERACAO_MAGISTERIO" ||
                item.tipo === "PERCENTUAL_APLICADO_PROFISSIONAIS_EDUCACAO"
            )
            );

            const percentageData = cumprimentoLimites?.find(item =>
                item.tipo === 'MINIMO_60_PORCENTO_DO_FUNDEF_NA_REMUNERACAO_ENSINO_FUNDAMENTAL' ||
                item.tipo === 'MINIMO_60_PORCENTO_FUNDEB_REMUNERACAO_MAGISTERIO_EDUCACAO' ||
                item.tipo === "MINIMO_60_PORCENTO_FUNDEB_REMUNERACAO_MAGISTERIO" ||
                item.tipo === "PERCENTUAL_APLICADO_PROFISSIONAIS_EDUCACAO"
            );

            const percentageApplied = percentageData?.despesasRealizadasPercentual || percentageData?.valor || percentageData?.porcentagem || 0;

            labels.push(`${ano} - ${nomeMunicipio}`);
            percentages.push(percentageApplied.toFixed(2));

            if (!municipalityColorsTemp[codigoMunicipio]) {
            const colorIndex = Object.keys(municipalityColorsTemp).length % colorPalette.length;
            municipalityColorsTemp[codigoMunicipio] = {
                color: colorPalette[colorIndex],
                name: nomeMunicipio
            };
            }

            backgroundColors.push(municipalityColorsTemp[codigoMunicipio].color);
            borderColors.push(municipalityColorsTemp[codigoMunicipio].color);
          }); 
        });
      });
    });

    return {
        chartData: {
        labels: labels,
        datasets: [
            {
            label: '% do Fundeb nos profissionais de Educação',
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
