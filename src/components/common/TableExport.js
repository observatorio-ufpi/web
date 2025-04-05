import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

/**
 * Componente para exportar tabelas para PDF e Excel
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados da tabela
 * @param {Array} props.headers - Cabeçalhos da tabela
 * @param {Object} props.headerDisplayNames - Mapeamento de nomes de cabeçalhos para exibição
 * @param {string} props.fileName - Nome do arquivo para download (sem extensão)
 * @param {string} props.tableTitle - Título da tabela (opcional)
 */
const TableExport = ({ 
  data, 
  headers, 
  headerDisplayNames, 
  fileName = 'tabela_exportada',
  tableTitle = '',
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
      console.log('Headers:', displayHeaders);
      console.log('Table Rows:', tableRows);

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

      pdf.save(`${generateFileName()}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      alert('Erro ao exportar para PDF. Verifique o console para mais detalhes.');
    }
  };

  // Função para exportar para Excel
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    try {
      // Preparar dados para o Excel
      const excelData = data.map(item => {
        const row = {};
        headers.forEach(header => {
          const displayName = headerDisplayNames[header] || header;
          row[displayName] = item[header]?.toString() || '';
        });
        return row;
      });

      // Criar planilha
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

      // Converter para binário e salvar
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `${generateFileName()}.xlsx`);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      alert('Erro ao exportar para Excel. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-start', 
      gap: '12px',
      margin: '16px 0 0 0'  
    }}>
      <Tooltip title="Exportar para PDF">
        <Button 
          variant="contained"
          sx={{ 
            backgroundColor: '#f44336', 
            '&:hover': { 
              backgroundColor: '#d32f2f' 
            },
            padding: '8px 16px',
            minWidth: '120px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}
          onClick={exportToPDF}
          startIcon={<FaFilePdf size={18} />}
        >
          <span style={{ fontWeight: 500 }}>PDF</span>
        </Button>
      </Tooltip>
      <Tooltip title="Exportar para Excel">
        <Button 
          variant="contained"
          sx={{ 
            backgroundColor: '#4caf50', 
            '&:hover': { 
              backgroundColor: '#388e3c' 
            },
            padding: '8px 16px',
            minWidth: '120px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }}
          onClick={exportToExcel}
          startIcon={<FaFileExcel size={18} />}
        >
          <span style={{ fontWeight: 500 }}>Excel</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default TableExport;
