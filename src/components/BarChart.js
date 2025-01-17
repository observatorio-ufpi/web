import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaDownload } from 'react-icons/fa';
import Button from '@mui/material/Button';
import '../style/Buttons.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

const BarChart = ({ chartData, title }) => {
  const chartRef = React.useRef(null);

  const exportChart = () => {
    if (chartRef.current) {
      const base64Image = chartRef.current.toBase64Image();
      const fileName = title && title.trim() ? title.replace(/\s+/g, '_') : 'chart';
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `${fileName}.png`;
      link.click();
    }
  };

  const downloadTableData = () => {
    const wb = XLSX.utils.book_new();

    // Preparar dados para o Excel
    const wsData = [
      ['Município', 'Ano', title], // Reordenado o cabeçalho
      ...chartData.labels.map((label, index) => {
        const [ano, municipio] = label.split(' - ');
        return [
          municipio, // Município primeiro
          ano,       // Ano depois
          chartData.datasets[0].data[index]
        ];
      })
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    // Salvar arquivo
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
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
                text: 'Valor', // depois deixar isso dinamico para passar quando chamar o componente
              },
              beginAtZero: true,
            },
          },
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'start', gap: '10px', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadTableData}
          startIcon={<FaFileExcel />}
          className="action-button"
        >
          <span className="button-text">Baixar Tabela</span>
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={exportChart}
          startIcon={<FaDownload />}
          className="action-button"
        >
          <span className="button-text">Baixar Gráfico</span>
        </Button>
      </div>
    </div>
  );
};

export default BarChart;
