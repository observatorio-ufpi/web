import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaDownload, FaUndo } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { Box, Tooltip as MuiTooltip } from '@mui/material';
import '../../../../../../style/Buttons.css';
import { formatPtBrCurrency, formatPtBrNumber, formatPtBrPercent, parseLooseNumber } from '../../../../../../utils/numberFormatUtils.js';
import { downloadChartPngWithBackground } from '../../../../../../utils/chartExportUtils.js';
import { cores } from '../../../../../../theme/tokens';
import { FONTE_EXPORTACAO, EXCEL_CABECALHO_FUNDO, EXCEL_CABECALHO_TEXTO } from '../../../../../../utils/exportStyle';

const estiloCabecalho = {
  backgroundColor: cores.areia,
  color: cores.textoSobreAreia,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  textAlign: 'left',
  padding: '10px 16px',
  borderBottom: `1px solid ${cores.linha}`,
};
const estiloCelula = { padding: '11px 16px', borderBottom: `1px solid ${cores.linha}` };

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, zoomPlugin);

const BarChart = ({ chartData, title }) => {
  const chartRef = React.useRef(null);
  const isPercent = Boolean(title && title.includes('%'));
  const hasData = Boolean(chartData?.labels?.length) && Boolean(chartData?.datasets?.length);

  const parsedRows = React.useMemo(() => {
    const rows = [];
    const years = new Set();

    (chartData?.labels || []).forEach((label, idx) => {
      let municipio = '';
      let ano = '';

      if (typeof label === 'string') {
        if (label.includes(' - ')) {
          const parts = label.split(' - ');
          ano = parts[0];
          municipio = parts.slice(1).join(' - ');
        } else {
          const match = label.match(/\d{4}/);
          if (match) {
            ano = match[0];
            municipio = label.replace(match[0], '').trim();
          } else {
            municipio = label;
          }
        }
      }

      if (ano) years.add(String(ano));

      rows.push({
        municipio,
        ano,
        valor: chartData?.datasets?.[0]?.data?.[idx],
      });
    });

    const uniqueYears = Array.from(years);
    const singleYear = uniqueYears.length === 1 ? uniqueYears[0] : null;

    return { rows, singleYear };
  }, [chartData]);

  const hideYearColumn = Boolean(parsedRows.singleYear);

  // Forma do gráfico conforme os dados (antes: sempre uma barra por "ano - município",
  // todas da mesma cor, com dezenas de rótulos ilegíveis no eixo):
  //  - vários municípios e vários anos (até 12 municípios) → uma linha por município ao longo dos anos
  //  - um município só → barras com o ano no eixo
  //  - um ano só → barras com o nome do município no eixo
  const { tipoGrafico, dadosGrafico } = React.useMemo(() => {
    const rows = parsedRows.rows;
    const municipiosUnicos = [...new Set(rows.map((r) => r.municipio).filter(Boolean))];
    const anosUnicos = [...new Set(rows.map((r) => r.ano).filter(Boolean))].sort();
    const numeroOuNulo = (v) => {
      const n = typeof v === "number" ? v : parseLooseNumber(v);
      return Number.isFinite(n) ? n : null;
    };
    if (anosUnicos.length > 1 && municipiosUnicos.length >= 2 && municipiosUnicos.length <= 12) {
      const valor = (m, a) => {
        const r = rows.find((x) => x.municipio === m && x.ano === a);
        return r ? numeroOuNulo(r.valor) : null;
      };
      return {
        tipoGrafico: 'linha',
        dadosGrafico: {
          labels: anosUnicos,
          datasets: municipiosUnicos.map((m, i) => {
            const cor = cores.seriesEstendida[i % cores.seriesEstendida.length];
            return {
              label: m,
              data: anosUnicos.map((a) => valor(m, a)),
              borderColor: cor,
              backgroundColor: cor,
              borderWidth: 2.5,
              pointRadius: 3,
              pointHoverRadius: 5,
              tension: 0.2,
              spanGaps: true,
            };
          }),
        },
      };
    }
    if (municipiosUnicos.length === 1 && anosUnicos.length > 1 && chartData?.datasets?.length) {
      return { tipoGrafico: 'barra', dadosGrafico: { ...chartData, labels: rows.map((r) => r.ano || r.municipio) } };
    }
    if (anosUnicos.length === 1 && chartData?.datasets?.length) {
      return { tipoGrafico: 'barra', dadosGrafico: { ...chartData, labels: rows.map((r) => r.municipio || r.ano) } };
    }
    return { tipoGrafico: 'barra', dadosGrafico: chartData };
  }, [parsedRows, chartData]);
  const ComponenteGrafico = tipoGrafico === 'linha' ? Line : Bar;
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
    const fonte = FONTE_EXPORTACAO;

    // Criar workbook com ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OPEPI/UFPI';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet('Dados');
    
    // Adicionar título
    worksheet.addRow([title]);
    const numCols = hideYearColumn ? 2 : 3;
    worksheet.mergeCells(1, 1, 1, numCols);
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Linha vazia
    worksheet.addRow([]);
    
    // Cabeçalhos
    const headerRow = worksheet.addRow(['Município', 'Ano', isPercent ? 'Valor (%)' : 'Valor (R$)']);
    headerRow.font = { bold: true, color: { argb: EXCEL_CABECALHO_TEXTO } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_CABECALHO_FUNDO } };
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

    if (hideYearColumn) {
      // Quando a pesquisa Ã© para um Ãºnico ano, remover a coluna "Ano".
      worksheet.spliceColumns(2, 1);
    }
    
    // Configurar largura das colunas
    worksheet.getColumn(1).width = 30;
    if (!hideYearColumn) {
      worksheet.getColumn(2).width = 10;
    }
    const valueCol = hideYearColumn ? 2 : 3;
    worksheet.getColumn(valueCol).width = 18;
    worksheet.getColumn(valueCol).numFmt = isPercent ? '#,##0.00' : '"R$" #,##0.00';
    worksheet.getColumn(valueCol).alignment = { horizontal: 'right' };
    
    // Salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${title.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={{ height: 500 }}>
        <ComponenteGrafico
          ref={chartRef}
          data={dadosGrafico}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: { display: tipoGrafico === 'linha', position: 'bottom', labels: { usePointStyle: true, font: { family: 'Public Sans, system-ui, sans-serif', size: 12 }, color: '#2A2019' } },
              title: {
                display: true,
                text: title,
                font: { size: 20, weight: 'bold', family: 'Public Sans, system-ui, sans-serif' },
                color: '#2A2019',
                padding: { top: 10, bottom: 20 }
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#333',
                bodyColor: '#333',
                borderColor: '#D9C9BC',
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
                ticks: { font: { size: 11, family: 'Public Sans, system-ui, sans-serif' }, color: '#7A6A5E', maxRotation: 45, minRotation: 0 },
                border: { display: true, color: '#E7DED6' }
              },
              y: {
                title: { display: true, text: isPercent ? 'Valor (%)' : 'Valor (R$)', font: { size: 12, weight: 'bold', family: 'Public Sans, system-ui, sans-serif' }, color: '#2A2019' },
                beginAtZero: true,
                grid: { display: true, color: 'rgba(0, 0, 0, 0.05)', lineWidth: 0.5 },
                ticks: {
                  font: { size: 11, family: 'Public Sans, system-ui, sans-serif' },
                  color: '#7A6A5E',
                  callback: function(value) {
                    if (typeof value !== 'number') return value;
                    return isPercent
                      ? `${formatPtBrNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`
                      : formatPtBrCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                  }
                },
                border: { display: true, color: '#E7DED6' }
              },
            },
            elements: {
              bar: {
                borderRadius: 8,
                borderSkipped: false,
                backgroundColor: 'rgba(142, 74, 46, 0.85)',
                borderColor: '#733A23',
                borderWidth: 2,
                hoverBackgroundColor: '#733A23',
                hoverBorderColor: '#733A23',
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
              color="primary"
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
        <Button variant="outlined" color="primary" onClick={exportChart} startIcon={<FaDownload />} className="action-button" size="small">
          <span className="button-text">Baixar Gráfico</span>
        </Button>
        <Button variant="text" color="primary" onClick={resetZoom} startIcon={<FaUndo />} size="small">
          Resetar Zoom
        </Button>
      </Box>
      {/* Tabela de dados */}
      {chartData.labels && chartData.labels.length > 0 && (
        <Box sx={{ marginTop: 4, border: `1px solid ${cores.linha}`, borderRadius: '14px', overflow: 'hidden', backgroundColor: cores.superficie }}>
          {/* Mesmo visual das tabelas de dados (cabeçalho areia, linhas alternadas) */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: cores.tinta }}>
            <thead>
              <tr>
                <th style={estiloCabecalho}>Município</th>
                {!hideYearColumn && <th style={estiloCabecalho}>Ano</th>}
                <th style={{ ...estiloCabecalho, textAlign: 'right' }}>{isPercent ? 'Valor (%)' : 'Valor (R$)'}</th>
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
                      <td colSpan={hideYearColumn ? 2 : 3} style={{ textAlign: 'center', color: cores.textoSuave, padding: '24px', fontStyle: 'italic' }}>
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
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? cores.zebra : cores.superficie }}>
                      <td style={{ ...estiloCelula, fontWeight: 600 }}>{municipio}</td>
                      {!hideYearColumn && <td style={estiloCelula}>{ano}</td>}
                      <td style={{ ...estiloCelula, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatValue(valor)}</td>
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
