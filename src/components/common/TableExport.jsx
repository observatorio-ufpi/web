import { Button, Tooltip } from '@mui/material';
import { saveAs } from 'file-saver';
import React from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { EXCEL_CABECALHO_FUNDO, PDF_CABECALHO_FUNDO } from '../../utils/exportStyle';
import MenuExportar from './MenuExportar';
import { carregarLogo, topoConteudoPdf, finalizarPdfComLogo } from '../../utils/logoExportacao';
import { carregarExcelJS, carregarHtml2canvas, carregarJsPDF } from '../../utils/bibliotecasExportacao';

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

      const jsPDF = await carregarJsPDF();
      const pdf = new jsPDF('l', 'pt', 'a4');
      // Cabeçalho com a logo em todas as páginas: o conteúdo começa abaixo dele
      const logo = await carregarLogo();
      const topo = topoConteudoPdf(pdf);

      // Adicionar título se fornecido
      if (tableTitle) {
        pdf.setFontSize(16);
        pdf.text(tableTitle, 40, topo + 14);
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
              // Ano e códigos ficam como estão (antes saía "2.007");
              // os demais números ganham separador de milhar
              tableRow.push(/^(ano|year)$|codigo/i.test(header) ? String(value) : formatNumberWithComma(value));
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
        startY: tableTitle ? topo + 28 : topo + 8,
        margin: { top: topo + 6, right: 40, bottom: 40, left: 40 },
        styles: { overflow: 'linebreak', cellWidth: 'auto', fontSize: 10, halign: 'left', valign: 'middle' },
        headStyles: { fillColor: PDF_CABECALHO_FUNDO, textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { valign: 'middle' },
        columnStyles: columnStyles
      });

      // Adicionar o gráfico em uma nova página se existir
      if (chartRef?.current) {
        pdf.addPage();
        const html2canvas = await carregarHtml2canvas();
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');

        // Calcular dimensões para o gráfico
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Verificar se o gráfico cabe na página
        const maxWidth = pageWidth - 80; // 40px de margem em cada lado
        const maxHeight = pageHeight - topo - 50; // abaixo do cabeçalho, com margem embaixo

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
        const y = topo + (pageHeight - topo - 30 - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      }

      finalizarPdfComLogo(pdf, logo);
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
      const ExcelJS = await carregarExcelJS();
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'OPEPI/UFPI';
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
        fgColor: { argb: EXCEL_CABECALHO_FUNDO }
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
      <MenuExportar
        opcoes={[
          { rotulo: 'Planilha (Excel)', detalhe: '.xlsx, com valores numéricos', icone: <FaFileExcel />, acao: exportToExcel },
          ...(showPdfExport
            ? [{ rotulo: 'Documento (PDF)', detalhe: 'pronto para imprimir', icone: <FaFilePdf />, acao: exportToPDF }]
            : []),
        ]}
      />
    </div>
  );
};

export default TableExport;
