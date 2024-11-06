import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

const BarChart = ({ chartData, title }) => {
  const chartRef = React.useRef(null);

  const exportChart = () => {
    if (chartRef.current) {
      const base64Image = chartRef.current.toBase64Image();
      const fileName = title && title.trim() ? title.replace(/\s+/g, '_') : 'chart'; // Verifica se title está disponível e não vazio
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `${fileName}.png`; // Formata o nome do arquivo
      link.click();
    }
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      <Bar
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: title,
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy',
                threshold: 5,
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'xy',
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: '% Aplicado',
              },
              beginAtZero: true,
            },
          },
        }}
      />
      <button onClick={exportChart} style={{ marginTop: '10px' }}>
        Exportar Gráfico
      </button>
    </div>
  );
};

export default BarChart;
