import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

const BarChart = ({ chartData, title }) => {
  const chartRef = React.useRef(null);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <h3>{title}</h3>
      <Bar
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
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
                    enabled: true
                    },
                    pinch: {
                    enabled: true
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
    </div>
  );
};

export default BarChart;
