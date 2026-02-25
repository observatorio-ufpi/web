import { Button, Tooltip } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';

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
 * @param {Function} props.fetchAllData - Função assíncrona que retorna todos os dados (sem paginação) para exportação
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
  chartData = null,
  fetchAllData = null
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

  // Função para formatar números com vírgula no lugar de ponto
  const formatNumberWithComma = (value) => {
    if (value === null || value === undefined || value === '') return '';

    // Se for string, verificar se já está formatado ou tem símbolos
    const strValue = value.toString().trim();

    // Se já tem % no final, apenas substituir ponto por vírgula
    if (strValue.includes('%')) {
      return strValue.replace('.', ',');
    }

    // Se já tem vírgula, retornar como está
    if (strValue.includes(',') && !strValue.includes('.')) {
      return strValue;
    }

    // Tentar converter para número
    const num = parseFloat(strValue.replace(',', '.').replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return strValue;

    // Formatar com locale pt-BR (usa vírgula como separador decimal)
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };


  // Função para exportar para PDF
  const exportToPDF = async () => {
    try {
      // Se há função fetchAllData, buscar todos os dados primeiro
      let exportData = data;
      console.log('exportToPDF: fetchAllData existe?', !!fetchAllData);
      if (fetchAllData) {
        console.log('exportToPDF: chamando fetchAllData');
        exportData = await fetchAllData();
        console.log('exportToPDF: dados recebidos', exportData?.length);
        if (!exportData || exportData.length === 0) {
          alert('Não há dados para exportar');
          return;
        }
      } else if (!data || data.length === 0) {
        alert('Não há dados para exportar');
        return;
      }

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
      exportData.forEach(row => {
        const tableRow = [];
        headers.forEach(header => {
          // Verificar se a propriedade existe no objeto
          if (row.hasOwnProperty(header)) {
            const value = row[header];
            if (value !== undefined && value !== null) {
              // Formatar números com vírgula
              tableRow.push(formatNumberWithComma(value));
            } else {
              tableRow.push('');
            }
          } else {
            tableRow.push('');
          }
        });
        tableRows.push(tableRow);
      });

            // Log para verificar dados e cabeçalhos
      console.log('Headers for PDF export:', displayHeaders);
      console.log('Table Rows for PDF export:', tableRows);

      // Identificar colunas numéricas para alinhar à direita
      const numericColumnIndices = [];
      if (tableRows.length > 0) {
        headers.forEach((header, index) => {
          // Verificar se a coluna é numérica (excluindo código e ano)
          const isNumericColumn = tableRows.some(row => {
            const value = row[index];
            if (value === '' || value === null || value === undefined) return false;
            // Remover formatação para verificar se é número
            const cleanValue = String(value).replace(/[.\s]/g, '').replace(',', '.');
            return !isNaN(parseFloat(cleanValue)) && isFinite(cleanValue);
          });
          // Não alinhar à direita colunas como código, município, ano, etc.
          const isTextColumn = header.toLowerCase().includes('codigo') || 
                               header.toLowerCase().includes('municipio') || 
                               header.toLowerCase().includes('nome') ||
                               header.toLowerCase().includes('tipo') ||
                               header === 'ano';
          if (isNumericColumn && !isTextColumn) {
            numericColumnIndices.push(index);
          }
        });
      }

      // Criar estilos de coluna para alinhar números à direita
      const columnStyles = {};
      numericColumnIndices.forEach(index => {
        columnStyles[index] = { halign: 'right' };
      });

      // Adicionar a tabela com autoTable
      pdf.autoTable({
        head: [displayHeaders],
        body: tableRows,
        startY: tableTitle ? 60 : 40,
        margin: { top: 60, right: 40, bottom: 40, left: 40 },
        styles: { overflow: 'linebreak', cellWidth: 'auto', fontSize: 10, halign: 'left', valign: 'middle' },
        headStyles: { fillColor: [204, 204, 204], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { valign: 'middle' },
        columnStyles: columnStyles
      });

      // Adicionar o gráfico em uma nova página se existir
      if (chartRef?.current) {
        pdf.addPage();
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');

        // Calcular dimensões para o gráfico
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Verificar se o gráfico cabe na página
        const maxWidth = pageWidth - 80; // 40px de margem em cada lado
        const maxHeight = pageHeight - 80; // 40px de margem em cima e embaixo

        let imgWidth, imgHeight;

        if (canvas.width / canvas.height > maxWidth / maxHeight) {
          // Gráfico é mais largo que alto - ajustar pela largura
          imgWidth = maxWidth;
          imgHeight = (canvas.height * imgWidth) / canvas.width;
        } else {
          // Gráfico é mais alto que largo - ajustar pela altura
          imgHeight = maxHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

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
    try {
      // Se há função fetchAllData, buscar todos os dados primeiro
      let exportData = data;
      console.log('exportToExcel: fetchAllData existe?', !!fetchAllData);
      if (fetchAllData) {
        console.log('exportToExcel: chamando fetchAllData');
        exportData = await fetchAllData();
        console.log('exportToExcel: dados recebidos', exportData?.length);
        if (!exportData || exportData.length === 0) {
          console.warn('Não há dados para exportar');
          return;
        }
      } else if (!data || data.length === 0) {
        console.warn('Não há dados para exportar');
        return;
      }

      // Criar workbook com ExcelJS
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Sistema de Observatório';
      workbook.created = new Date();


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
      headerRowObj.alignment = { horizontal: 'center', vertical: 'middle' };

      // Identificar colunas numéricas
      const numericColumnIndices = [];
      const textColumnNames = ['codigo', 'municipio', 'nome', 'tipo', 'ano', 'codigomunicipio', 'nomemunicipio'];
      headers.forEach((header, index) => {
        const isTextColumn = textColumnNames.some(name => header.toLowerCase().includes(name));
        if (!isTextColumn) {
          numericColumnIndices.push(index);
        }
      });

      // Adicionar dados (mantendo números como números)
      exportData.forEach(item => {
        const row = [];
        headers.forEach((header, index) => {
          const value = item[header];
          if (value === '' || value === null || value === undefined) {
            row.push('');
          } else if (numericColumnIndices.includes(index)) {
            // Converter para número se possível
            let numValue;
            if (typeof value === 'number') {
              numValue = value;
            } else {
              // Remover formatação brasileira (pontos de milhar, vírgula decimal)
              const cleanValue = String(value).replace(/[.\s]/g, '').replace(',', '.');
              numValue = parseFloat(cleanValue);
            }
            // Se for um número válido, usar como número; senão, usar valor original
            row.push(isNaN(numValue) ? value : numValue);
          } else {
            row.push(value);
          }
        });
        dataWorksheet.addRow(row);
      });

      // Aplicar formatação numérica e alinhamento às colunas numéricas
      numericColumnIndices.forEach(index => {
        const colNumber = index + 1; // ExcelJS usa índice baseado em 1
        dataWorksheet.getColumn(colNumber).numFmt = '#,##0.00'; // Formato brasileiro
        dataWorksheet.getColumn(colNumber).alignment = { horizontal: 'right', vertical: 'middle' };
      });

      // Alinhar colunas de texto à esquerda
      headers.forEach((header, index) => {
        if (!numericColumnIndices.includes(index)) {
          const colNumber = index + 1;
          dataWorksheet.getColumn(colNumber).alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });

      // Auto-ajustar largura das colunas
      dataWorksheet.columns.forEach(column => {
        column.width = 18;
      });


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
