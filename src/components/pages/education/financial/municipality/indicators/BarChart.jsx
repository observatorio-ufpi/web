import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaDownload, FaUndo } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import '../../../../../../style/Buttons.css';

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

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const downloadTableData = () => {
    const wb = XLSX.utils.book_new();
    const fonte = "Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI";

    // Preparar dados para o Excel com título e fonte
    const wsData = [
      [title], // Linha do título
      [], // Linha vazia
      ['Município', 'Ano', 'Valor'], // Cabeçalho
      ...chartData.labels.map((label, index) => {
        const [ano, municipio] = label.split(' - ');
        return [
          municipio, // Município primeiro
          ano,       // Ano depois
          chartData.datasets[0].data[index]
        ];
      }),
      [], // Linha vazia
      [fonte], // Linha da fonte
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Mesclar célula do título
    const numCols = 3;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    // Salvar arquivo
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={{ height: 500 }}>
        <Bar
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: title,
                font: { size: 16, weight: 'bold', family: 'Roboto, sans-serif' },
                color: '#333',
                padding: { top: 10, bottom: 20 }
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#333',
                bodyColor: '#333',
                borderColor: '#4CAF50',
                borderWidth: 2,
                cornerRadius: 8,
                displayColors: true,
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 12
              },
              zoom: {
                pan: { enabled: true, mode: 'xy', threshold: 10, modifierKey: 'ctrl' },
                zoom: {
                  wheel: { enabled: true, modifierKey: 'ctrl' },
                  pinch: { enabled: true },
                  mode: 'xy',
                  limits: { y: { min: 0, max: 'original' } }
                },
              },
            },
            scales: {
              x: {
                grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', lineWidth: 0.5 },
                ticks: { font: { size: 11, family: 'Roboto, sans-serif' }, color: '#666', maxRotation: 45, minRotation: 0 },
                border: { display: true, color: '#ddd' }
              },
              y: {
                title: { display: true, text: 'Valor', font: { size: 12, weight: 'bold', family: 'Roboto, sans-serif' }, color: '#333' },
                beginAtZero: true,
                grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', lineWidth: 0.5 },
                ticks: {
                  font: { size: 11, family: 'Roboto, sans-serif' },
                  color: '#666',
                  callback: function(value) { return typeof value === 'number' ? value.toLocaleString('pt-BR') : value; }
                },
                border: { display: true, color: '#ddd' }
              },
            },
            elements: {
              bar: {
                borderRadius: 8,
                borderSkipped: false,
                backgroundColor: 'rgba(156, 39, 176, 0.8)',
                borderColor: 'rgba(156, 39, 176, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(156, 39, 176, 1)',
                hoverBorderColor: 'rgba(156, 39, 176, 1)',
              }
            }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, marginTop: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary" onClick={downloadTableData} startIcon={<FaFileExcel />} className="action-button" size="small">
          <span className="button-text">Baixar Tabela</span>
        </Button>
        <Button variant="contained" color="secondary" onClick={exportChart} startIcon={<FaDownload />} className="action-button" size="small">
          <span className="button-text">Baixar Gráfico</span>
        </Button>
        <Button variant="outlined" color="info" onClick={resetZoom} startIcon={<FaUndo />} size="small" sx={{ borderColor: '#9C27B0', color: '#9C27B0', '&:hover': { borderColor: '#7B1FA2', backgroundColor: 'rgba(156, 39, 176, 0.04)' } }}>
          Resetar Zoom
        </Button>
      </Box>
      {/* Tabela de dados */}
      {chartData.labels && chartData.labels.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Município</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ano</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const allNull = chartData.datasets[0].data.every(
                  valor => valor === '-' || valor === null || valor === undefined || valor === 0
                );
                if (allNull) {
                  return (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: '#d9534f', padding: '16px', fontWeight: 'bold' }}>
                        Nenhum dado disponível para o município selecionado.
                      </td>
                    </tr>
                  );
                }
                return chartData.labels.map((label, idx) => {
                  let municipio = '';
                  let ano = '';
                  // Tenta extrair município e ano do label
                  if (label.includes(' - ')) {
                    const parts = label.split(' - ');
                    ano = parts[0];
                    municipio = parts[1];
                  } else if (label.match(/\d{4}/)) {
                    ano = label.match(/\d{4}/)[0];
                    municipio = label.replace(ano, '').trim();
                  } else {
                    municipio = label;
                  }
                  const valor = chartData.datasets[0].data[idx];
                  return (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{municipio}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ano}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{typeof valor === 'number' ? valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : valor}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  
  );
};

export default BarChart;
