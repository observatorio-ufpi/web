import { municipios } from "./municipios.mapping";

const createProcessFunction = (indicatorType) => (rawData, colorPalette) => {
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

          const indicador = municipality.indicador?.find(
            (item) => item.tipo === indicatorType
          );

          const percentageValue = indicador?.valor || 0;

          labels.push(`${ano} - ${nomeMunicipio}`);
          percentages.push(percentageValue.toFixed(2));

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
  });

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


export const processFundebParticipationMde = createProcessFunction("FUNDEB_PARTICIPATION_MDE");
export const processResultadoLiquidoFundeb = createProcessFunction("RESULTADO_LIQUIDO_FUNDEB");
export const processParticipacaoComplementacaoUniao = createProcessFunction("PARTICIPACAO_COMPLEMENTACAO_UNIAO");