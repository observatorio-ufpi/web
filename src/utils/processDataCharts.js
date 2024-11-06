import { municipios } from "./municipios.mapping";

export const processMDEData = (rawData, colorPalette) => {
    const labels = [];
    const percentages = [];
    const backgroundColors = [];
    const borderColors = [];
    const municipalityColorsTemp = {};

    Object.entries(rawData).forEach(([year, dataPerYear]) => {
      Object.keys(dataPerYear).forEach((key) => {
        dataPerYear[key].forEach((municipality) => {
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
        dataPerYear[key].forEach((municipality) => {
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
