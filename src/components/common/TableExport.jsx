import { Button, Tooltip } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';

/**
 * Componente para exportar tabelas para PDF e Excel
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados da tabela
 * @param {Array} props.headers - Cabeçalhos da tabela
 * @param {Object} props.headerDisplayNames - Mapeamento de nomes de cabeçalhos para exibição
 * @param {string} props.fileName - Nome do arquivo para download (sem extensão)
 * @param {string} props.tableTitle - Título da tabela (opcional)
 * @param {React.RefObject} props.chartRef - Referência para o gráfico (opcional)
 * @param {string} props.chartType - Tipo de gráfico: 'pie', 'bar', 'line' (opcional)
 * @param {Array} props.chartData - Dados específicos do gráfico (opcional)
 */
const TableExport = ({
  data,
  headers,
  headerDisplayNames,
  fileName = 'tabela_exportada',
  tableTitle = '',
  chartRef,
  showPdfExport = true, // Add this new prop
  chartType = 'bar',
  chartData = null
}) => {
  // Função para gerar um nome de arquivo baseado no título
  const generateFileName = () => {
    if (!tableTitle) return fileName;

    // Converter o título para um formato adequado para nome de arquivo
    // Remover caracteres especiais, substituir espaços por underscores e limitar o tamanho
    const sanitizedTitle = tableTitle
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '_')       // Substitui caracteres especiais por underscores
      .replace(/\s+/g, '_')            // Substitui espaços por underscores
      .toLowerCase()
      .substring(0, 100);              // Limita o tamanho para evitar nomes muito longos

    return sanitizedTitle || fileName;
  };

  // Função para preparar dados do gráfico baseado nos dados da tabela
  const prepareChartData = () => {
    if (chartData) return chartData;

    if (!data || data.length === 0) return null;

    // Detectar automaticamente se é gráfico de pizza ou barras baseado na estrutura dos dados
    const firstRow = data[0];
    const keys = Object.keys(firstRow);

    // Se tem apenas duas colunas (nome e valor), é pizza
    if (keys.length === 2) {
      const nameKey = keys.find(key => typeof firstRow[key] === 'string');
      const valueKey = keys.find(key => typeof firstRow[key] === 'number' || !isNaN(Number(firstRow[key])));

      if (nameKey && valueKey) {
        const pieChartData = {
          type: 'pie',
          categories: data.map(item => item[nameKey]),
          series: [{
            name: headerDisplayNames[valueKey] || valueKey,
            data: data.map(item => Number(item[valueKey]) || 0)
          }]
        };
        return pieChartData;
      }
    }

    // Se tem mais colunas, é gráfico de barras
    const nameKey = keys[0]; // Primeira coluna como categoria
    const dataKeys = keys.slice(1).filter(key => key !== 'Total'); // Demais colunas como séries (exceto Total)

    const barChartData = {
      type: 'bar',
      categories: data.map(item => item[nameKey]),
      series: dataKeys.map(key => ({
        name: headerDisplayNames[key] || key,
        data: data.map(item => Number(item[key]) || 0)
      }))
    };
    return barChartData;
  };

  // Função para exportar para PDF
  const exportToPDF = async () => {
    if (!data || data.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    try {
      const pdf = new jsPDF('l', 'pt', 'a4');

      // Adicionar título se fornecido
      if (tableTitle) {
        pdf.setFontSize(16);
        pdf.text(tableTitle, 40, 40);
      }

      // Preparar dados para o autoTable
      const displayHeaders = headers.map(header => headerDisplayNames[header] || header);

      // Criar dados para a tabela
      const tableRows = [];
      data.forEach(row => {
        const tableRow = [];
        headers.forEach(header => {
          // Verificar se a propriedade existe no objeto
          if (row.hasOwnProperty(header)) {
            const value = row[header];
            tableRow.push(value !== undefined && value !== null ? value.toString() : '');
          } else {
            tableRow.push('');
          }
        });
        tableRows.push(tableRow);
      });

            // Log para verificar dados e cabeçalhos
      console.log('Headers for PDF export:', displayHeaders);
      console.log('Table Rows for PDF export:', tableRows);

      // Adicionar a tabela com autoTable
      pdf.autoTable({
        head: [displayHeaders],
        body: tableRows,
        startY: tableTitle ? 60 : 40,
        margin: { top: 60, right: 40, bottom: 40, left: 40 },
        styles: { overflow: 'linebreak', cellWidth: 'auto', fontSize: 10, halign: 'center', valign: 'middle' },
        headStyles: { fillColor: [204, 204, 204], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { valign: 'middle' }
      });

      // Adicionar o gráfico em uma nova página se existir
      if (chartRef?.current) {
        pdf.addPage();
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');

        // Calcular dimensões para o gráfico
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 80; // 40px de margem em cada lado
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Centralizar o gráfico na página
        const x = 40;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      }

      pdf.save(`${generateFileName()}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      alert('Erro ao exportar para PDF. Verifique o console para mais detalhes.');
    }
  };

  // Função para exportar para Excel com tabela de dados para gráfico
  const exportToExcel = async () => {
    if (!data || data.length === 0) {
      console.warn('Não há dados para exportar');
      return;
    }

    try {
      // Criar workbook com ExcelJS
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Sistema de Observatório';
      workbook.created = new Date();

      // Preparar dados do gráfico
      const chartDataForExcel = prepareChartData();

      // Criar planilha de dados
      const dataWorksheet = workbook.addWorksheet('Dados');

      // Adicionar cabeçalhos
      const headerRow = headers.map(header => headerDisplayNames[header] || header);
      dataWorksheet.addRow(headerRow);

      // Estilizar cabeçalhos
      const headerRowObj = dataWorksheet.getRow(1);
      headerRowObj.font = { bold: true };
      headerRowObj.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }
      };

      // Adicionar dados (substituindo valores vazios por 0)
      data.forEach(item => {
        const row = [];
        headers.forEach(header => {
          const value = item[header];
          // Substituir valores vazios por 0 em colunas numéricas
          if (header === 'total' || typeof value === 'number' || !isNaN(Number(value))) {
            row.push(value === '' || value === null || value === undefined ? 0 : value);
          } else {
            row.push(value || '');
          }
        });
        dataWorksheet.addRow(row);
      });

      // Auto-ajustar largura das colunas
      dataWorksheet.columns.forEach(column => {
        column.width = 15;
      });

      if (chartDataForExcel) {
        // Criar planilha para dados do gráfico (apenas tabela)
        const chartWorksheet = workbook.addWorksheet('Gráfico');

        if (chartDataForExcel.type === 'pie') {
          // Dados para gráfico de pizza
          chartWorksheet.addRow(['Categoria', 'Valor']);
          chartDataForExcel.categories.forEach((category, index) => {
            const value = chartDataForExcel.series[0].data[index] || 0;
            chartWorksheet.addRow([category, value]);
          });
        } else {
          // Dados para gráfico de barras
          const headerRow = ['Categoria', ...chartDataForExcel.series.map(s => s.name)];
          chartWorksheet.addRow(headerRow);

          chartDataForExcel.categories.forEach((category, index) => {
            const row = [category];
            chartDataForExcel.series.forEach(series => {
              row.push(series.data[index] || 0);
            });
            chartWorksheet.addRow(row);
          });
        }

        // Estilizar cabeçalhos da planilha de gráfico
        const chartHeaderRow = chartWorksheet.getRow(1);
        chartHeaderRow.font = { bold: true };
        chartHeaderRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4CAF50' }
        };

        // Auto-ajustar largura das colunas
        chartWorksheet.columns.forEach(column => {
          column.width = 15;
        });
      }

      // Salvar arquivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${generateFileName()}.xlsx`);

    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      gap: '12px',
      margin: '16px 0 0 0'
    }}>
      <Tooltip title="Exportar para Excel">
        <Button
          variant="contained"
          color="success"
          onClick={exportToExcel}
          startIcon={<FaFileExcel size={18} />}
          sx={{
            minWidth: '120px',
            '@media (max-width: 600px)': {
              minWidth: '40px',
              padding: '6px !important',
              '& .MuiButton-startIcon': {
                margin: 0,
              },
              '& .button-text': {
                display: 'none',
              },
              '& svg': {
                fontSize: '20px',
              },
            },
          }}
        >
          <span className="button-text" style={{ fontWeight: 500 }}>Excel</span>
        </Button>
      </Tooltip>
      {showPdfExport && ( // Wrap with conditional rendering
        <Tooltip title="Exportar para PDF">
          <Button
            variant="contained"
            color="error"
            onClick={exportToPDF}
            startIcon={<FaFilePdf size={18} />}
            sx={{
              minWidth: '120px',
              '@media (max-width: 600px)': {
                minWidth: '40px',
                padding: '6px !important',
                '& .MuiButton-startIcon': {
                  margin: 0,
                },
                '& .button-text': {
                  display: 'none',
                },
                '& svg': {
                  fontSize: '20px',
                },
              },
            }}
          >
            <span className="button-text" style={{ fontWeight: 500 }}>PDF</span>
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default TableExport;
