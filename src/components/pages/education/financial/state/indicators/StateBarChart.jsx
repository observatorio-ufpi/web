import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaDownload, FaUndo } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import '../../../../../../style/Buttons.css';
import { parseLooseNumber } from '../../../../../../utils/numberFormatUtils.js';
import { downloadChartPngWithBackground } from '../../../../../../utils/chartExportUtils.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

const StateBarChart = ({ chartData, title }) => {
  const chartRef = React.useRef(null);
  const hasData = Boolean(chartData?.labels?.length) && Boolean(chartData?.datasets?.length);

  const exportChart = () => {
    if (chartRef.current) {
      const fileName = title && title.trim() ? title.replace(/\s+/g, '_') : 'chart';
      downloadChartPngWithBackground(chartRef.current, fileName, '#ffffff');
    }
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const downloadTableData = async () => {
    const fonte = "Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI";

    // Criar workbook com ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OPEPI/UFPI';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet('Dados');
    
    // Cabeçalho com colunas dos datasets
    const headers = ['Ano', ...chartData.datasets.map(dataset => dataset.label)];
    const numCols = headers.length;
    
    // Adicionar título
    worksheet.addRow([title]);
    worksheet.mergeCells(1, 1, 1, numCols);
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Linha vazia
    worksheet.addRow([]);
    
    // Cabeçalhos
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
    headerRow.alignment = { horizontal: 'center' };
    
    // Dados
    chartData.labels.forEach((label, index) => {
      const dataRow = [label];
      chartData.datasets.forEach(dataset => {
        const value = dataset.data[index];
        const parsed = typeof value === 'number' ? value : parseLooseNumber(value);
        dataRow.push(parsed === null ? value : parsed);
      });
      worksheet.addRow(dataRow);
    });
    
    // Linha vazia
    worksheet.addRow([]);
    
    // Fonte
    worksheet.addRow([fonte]);
    
    // Configurar largura das colunas
    worksheet.getColumn(1).width = 12;
    for (let i = 2; i <= numCols; i++) {
      worksheet.getColumn(i).width = 18;
      worksheet.getColumn(i).numFmt = '"R$" #,##0.00';
      worksheet.getColumn(i).alignment = { horizontal: 'right' };
    }
    
    // Salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${title.replace(/\s+/g, '_')}.xlsx`);
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
        <MuiTooltip title="Exportar para Excel">
          <span>
            <Button
              variant="contained"
              color="success"
              onClick={downloadTableData}
              startIcon={<FaFileExcel />}
              className="action-button"
              size="small"
              disabled={!hasData}
              sx={{
                minWidth: '120px',
                '@media (max-width: 600px)': {
                  minWidth: '40px',
                  padding: '6px !important',
                  '& .MuiButton-startIcon': { margin: 0 },
                  '& .button-text': { display: 'none' },
                  '& svg': { fontSize: '20px' },
                },
              }}
            >
              <span className="button-text">Excel</span>
            </Button>
          </span>
        </MuiTooltip>
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
