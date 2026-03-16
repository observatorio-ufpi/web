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
import { formatPtBrCurrency, formatPtBrNumber, formatPtBrPercent, parseLooseNumber } from '../../../../../../utils/numberFormatUtils.js';
import { downloadChartPngWithBackground } from '../../../../../../utils/chartExportUtils.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

const BarChart = ({ chartData, title }) => {
  const chartRef = React.useRef(null);
  const isPercent = Boolean(title && title.includes('%'));
  const hasData = Boolean(chartData?.labels?.length) && Boolean(chartData?.datasets?.length);
  const formatValue = (v) => {
    if (v === null || v === undefined || v === '' || v === '-') return '-';
    if (isPercent) return formatPtBrPercent(v, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatPtBrCurrency(v, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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
    
    // Adicionar título
    worksheet.addRow([title]);
    worksheet.mergeCells(1, 1, 1, 3);
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Linha vazia
    worksheet.addRow([]);
    
    // Cabeçalhos
    const headerRow = worksheet.addRow(['Município', 'Ano', isPercent ? 'Valor (%)' : 'Valor (R$)']);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
    headerRow.alignment = { horizontal: 'center' };
    
    // Dados
    chartData.labels.forEach((label, index) => {
      const [ano, municipio] = label.split(' - ');
      const value = chartData.datasets[0].data[index];
      const parsed = typeof value === 'number' ? value : parseLooseNumber(value);
      const numValue = parsed === null ? value : parsed;
      worksheet.addRow([municipio, ano, numValue]);
    });
    
    // Linha vazia
    worksheet.addRow([]);
    
    // Fonte
    worksheet.addRow([fonte]);
    
    // Configurar largura das colunas
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 18;
    worksheet.getColumn(3).numFmt = isPercent ? '#,##0.00' : '"R$" #,##0.00';
    worksheet.getColumn(3).alignment = { horizontal: 'right' };
    
    // Salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${title.replace(/\s+/g, '_')}.xlsx`);
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
                font: { size: 20, weight: 'bold', family: 'Roboto, sans-serif' },
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
                padding: 12,
                callbacks: {
                  label: function(context) {
                    const value = context.parsed.y;
                    const formatted = isPercent
                      ? formatPtBrPercent(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : formatPtBrCurrency(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    return `${context.dataset.label}: ${formatted}`;
                  }
                }
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
                title: { display: true, text: isPercent ? 'Valor (%)' : 'Valor (R$)', font: { size: 12, weight: 'bold', family: 'Roboto, sans-serif' }, color: '#333' },
                beginAtZero: true,
                grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', lineWidth: 0.5 },
                ticks: {
                  font: { size: 11, family: 'Roboto, sans-serif' },
                  color: '#666',
                  callback: function(value) {
                    if (typeof value !== 'number') return value;
                    return isPercent
                      ? `${formatPtBrNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`
                      : formatPtBrCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                  }
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
        <MuiTooltip title="Exportar para Excel">
          <span>
            <Button
              variant="contained"
              color="success"
              onClick={downloadTableData}
              startIcon={<FaFileExcel />}
              className="action-button"
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
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>{isPercent ? 'Valor (%)' : 'Valor (R$)'}</th>
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
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatValue(valor)}</td>
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
