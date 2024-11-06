import React, { useEffect, useState } from 'react';
import '../style/Chart.css';
import BarChart from './BarChart';

const ChartComponent = ({ indicatorType, processDataFunction, title, data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [municipalityColors, setMunicipalityColors] = useState({});

  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FFCD56', '#4D5360', '#00A878', '#FF6B6B', '#B9E769', '#FFA1B5',
    '#9C27B0', '#607D8B', '#8BC34A', '#795548', '#FFC107', '#3F51B5',
    '#673AB7', '#009688', '#CDDC39', '#FFC0CB', '#2196F3', '#F44336'
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const processedData = processDataFunction(data, colorPalette);  // Passando a função para processamento de dados
        setChartData(processedData.chartData);
        setMunicipalityColors(processedData.municipalityColors);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    getData();
  }, [indicatorType, processDataFunction]);

  return (
    <div className="indicators-container">
      <BarChart chartData={chartData} title={title} />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '100px', gap: '5px', fontSize: '13px' }}>
        {Object.values(municipalityColors).map((municipio, index) => (
          <div key={index} className="indicator-item">
            <span style={{
              width: '15px',
              height: '15px',
              backgroundColor: municipio.color,
              display: 'inline-block',
              marginRight: '5px'
            }}></span>
            <span>{municipio.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartComponent;
