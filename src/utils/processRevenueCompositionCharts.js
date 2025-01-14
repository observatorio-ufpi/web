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
          const nomeMunicipio =
            municipios[codigoMunicipio]?.nomeMunicipio || "";
          const ano = municipality.ano;

          const indicador = municipality.indicador?.find(
            (item) => item.tipo === indicatorType
          );

          const percentageValue = indicador?.valor || 0;

          labels.push(`${ano} - ${nomeMunicipio}`);
          percentages.push(percentageValue.toFixed(2));

          if (!municipalityColorsTemp[codigoMunicipio]) {
            const colorIndex =
              Object.keys(municipalityColorsTemp).length % colorPalette.length;
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

export const processIptuData = createProcessFunction("IPTU");
export const processIssData = createProcessFunction("ISS");
export const processItbiData = createProcessFunction("ITBI");
export const processIrrfData = createProcessFunction("IRRF");
export const processIpvaData = createProcessFunction("COTA_PARTE_IPVA");
export const processIcmsData = createProcessFunction("COTA_PARTE_ICMS");
export const processFpmData = createProcessFunction("COTA_PARTE_FPM");
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
