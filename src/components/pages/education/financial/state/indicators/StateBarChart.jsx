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

const StateBarChart = ({ chartData, title }) => {
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

    // Cabeçalho com colunas dos datasets
    const headers = ['Ano', ...chartData.datasets.map(dataset => dataset.label)];
    const numCols = headers.length;

    // Preparar dados para o Excel com título e fonte
    const wsData = [
      [title], // Linha do título
      [], // Linha vazia
      headers, // Cabeçalho
      ...chartData.labels.map((label, index) => {
        return [
          label,
          ...chartData.datasets.map(dataset => dataset.data[index])
        ];
      }),
      [], // Linha vazia
      [fonte], // Linha da fonte
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Mesclar célula do título
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    // Salvar arquivo
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: 500,
      padding: 2
    }}>
      <Bar
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  family: 'Roboto, sans-serif'
                }
              }
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 16,
                weight: 'bold',
                family: 'Roboto, sans-serif'
              },
              color: '#333',
              padding: {
                top: 10,
                bottom: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#333',
              bodyColor: '#333',
              borderColor: '#4CAF50',
              borderWidth: 2,
              cornerRadius: 8,
              displayColors: true,
              titleFont: {
                size: 13,
                weight: 'bold'
              },
              bodyFont: {
                size: 12
              },
              padding: 12,
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y;
                  if (typeof value === 'number') {
                    return `${context.dataset.label}: ${value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}`;
                  }
                  return `${context.dataset.label}: ${value}`;
                }
              }
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy',
                threshold: 10,
                modifierKey: 'ctrl',
              },
              zoom: {
                wheel: {
                  enabled: true,
                  modifierKey: 'ctrl',
                },
                pinch: {
                  enabled: true,
                },
                mode: 'xy',
                limits: {
                  y: { min: 0, max: 'original' }
                }
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 0.5
              },
              ticks: {
                font: {
                  size: 11,
                  family: 'Roboto, sans-serif'
                },
                color: '#666',
                maxRotation: 45,
                minRotation: 0
              },
              border: {
                display: true,
                color: '#ddd'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Valor',
                font: {
                  size: 12,
                  weight: 'bold',
                  family: 'Roboto, sans-serif'
                },
                color: '#333'
              },
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
                lineWidth: 0.5
              },
              ticks: {
                font: {
                  size: 11,
                  family: 'Roboto, sans-serif'
                },
                color: '#666',
                callback: function(value) {
                  if (typeof value === 'number') {
                    return value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    });
                  }
                  return value;
                }
              },
              border: {
                display: true,
                color: '#ddd'
              }
            },
          },
          elements: {
            bar: {
              borderRadius: 4,
              borderSkipped: false,
            }
          }
        }}
      />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        gap: 2, 
        marginTop: 3,
        flexWrap: 'wrap'
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadTableData}
          startIcon={<FaFileExcel />}
          className="action-button"
          size="small"
        >
          <span className="button-text">Baixar Tabela</span>
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={exportChart}
          startIcon={<FaDownload />}
          className="action-button"
          size="small"
        >
          <span className="button-text">Baixar Gráfico</span>
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={resetZoom}
          startIcon={<FaUndo />}
          size="small"
          sx={{ 
            borderColor: '#9C27B0',
            color: '#9C27B0',
            '&:hover': {
              borderColor: '#7B1FA2',
              backgroundColor: 'rgba(156, 39, 176, 0.04)'
            }
          }}
        >
          Resetar Zoom
        </Button>
      </Box>
    </Box>
  );
};

export default StateBarChart;
