import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/apiService';
import BarChart from './BarChart';

const MDEChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const filters = {}; // Adicione filtros se necessário
        const data = await fetchData('constitutionalLimitMde', 'ano', filters); // substitua 'groupType' conforme necessário
        const processedData = processMDEData(data);
        setChartData(processedData);
      } catch (error) {
        console.error("Erro ao buscar dados MDE:", error);
      }
    };

    getData();
  }, []);

  const processMDEData = (rawData) => {
    const labels = [];
    const percentages = [];
    console.log(rawData)

    Object.entries(rawData).forEach(([year, dataPerYear]) => {
        Object.keys(dataPerYear).forEach((key) => {

            dataPerYear[key].forEach((municipality) => {
                console.log(dataPerYear[key])
              const codigoMunicipio = municipality.codigoMunicipio;
              const ano = municipality.ano;
              console.log(dataPerYear[key])

              const cumprimentoLimites = Object.values(municipality).find(
                prop => Array.isArray(prop) && prop.some(item =>
                  item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS' ||
                  item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS_MDE' || item.tipo === "PERCENTUAL_DE_APLICACAO_MDE_SOBRE_RECEITA_LIQUIDA_IMPOSTOS" || item.tipo === "PERCENTUAL_APLICADO_MDE"
                )
              );

              console.log(cumprimentoLimites)

              const percentageData = cumprimentoLimites?.find(item =>
                item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS' ||
                item.tipo === 'MINIMO_DE_25_PORCENTO_DAS_RECEITAS_RESULTANTES_DE_IMPOSTOS_MDE' || item.tipo === "PERCENTUAL_DE_APLICACAO_MDE_SOBRE_RECEITA_LIQUIDA_IMPOSTOS" || item.tipo === "PERCENTUAL_APLICADO_MDE"
              );

              const percentageApplied = percentageData?.porcentagem || percentageData?.valor || 0;

              labels.push(`${ano}`);
              percentages.push(percentageApplied.toFixed(2));
            });

        });
      });


    return {
      labels: labels,
      datasets: [
        {
          label: '% Aplicado em MDE',
          data: percentages,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return <BarChart chartData={chartData} title="% Aplicado em MDE por Município" />;
};

export default MDEChartComponent;
