import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import '../../../../../style/Buttons.css';

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
      tableHeader: '#cccccc',
    },
  },
  typography: {
    fontSize: 14,
  },
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.tableHeader,
}));

const BoldTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  minWidth: '8rem',
  textAlign: 'center',
  verticalAlign: 'middle',
  '@media (max-width: 600px)': {
    minWidth: '6rem',
  },
}));

const CenteredTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  verticalAlign: 'middle',
}));

const StateRevenueTable = ({ csvData, tableName }) => {
  const [data, setData] = useState({
    types: [],
    years: [],
    valuesByTypeAndYear: {}
  });

  useEffect(() => {
    if (csvData) {
      parseCSVData(csvData);
    }
  }, [csvData]);

  const parseCSVData = (csvText) => {
    // Verificar se csvText é uma string
    if (typeof csvText !== 'string') {
      console.error('csvText não é uma string:', csvText);
      setData({ types: [], years: [], valuesByTypeAndYear: {} });
      return;
    }

    // Remover qualquer conteúdo HTML que possa estar no texto
    const cleanText = csvText.replace(/<[^>]*>/g, '');
    
    // Dividir por linhas, ignorando linhas vazias
    const lines = cleanText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error('Nenhuma linha encontrada no CSV');
      setData({ types: [], years: [], valuesByTypeAndYear: {} });
      return;
    }
    
    console.log('Primeiras linhas do CSV:', lines.slice(0, 3));
    
    // Função para analisar uma linha CSV respeitando aspas
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      if (current) {
        result.push(current.trim());
      }
      
      return result;
    };
    
    // Analisar a primeira linha para obter os anos
    const headerParts = parseCSVLine(lines[0]);
    headerParts.shift(); // Remover o primeiro item (célula vazia ou "Tipo")
    const years = headerParts;
    
    console.log('Anos extraídos:', years);
    
    // Processar linhas de dados (tipos de impostos)
    const types = [];
    const valuesByTypeAndYear = {};
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      // Verificar se a linha tem dados suficientes
      if (values.length <= 1) continue;
      
      // O primeiro valor é o tipo de imposto
      const type = values[0].replace(/^"|"$/g, ''); // Remover aspas se existirem
      types.push(type);
      
      // Inicializar objeto para este tipo
      valuesByTypeAndYear[type] = {};
      
      // Processar valores para cada ano
      for (let j = 0; j < years.length; j++) {
        const year = years[j];
        const value = values[j + 1];
        
        // Converter para número, preservando o valor completo
        if (value) {
          // Remover caracteres não numéricos, exceto ponto, vírgula e hífen
          const cleanValue = value.replace(/[^\d.,-]/g, '');
          
          // Substituir vírgula por ponto para conversão correta
          // Importante: no Brasil, usamos vírgula como separador decimal
          const normalizedValue = cleanValue.replace(/\./g, '').replace(/,/g, '.');
          
          const numValue = parseFloat(normalizedValue);
          valuesByTypeAndYear[type][year] = isNaN(numValue) ? value : numValue;
        } else {
          valuesByTypeAndYear[type][year] = null;
        }
      }
    }
    
    console.log('Tipos processados:', types);
    console.log('Valores por tipo e ano:', valuesByTypeAndYear);
    
    setData({ types, years, valuesByTypeAndYear });
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Preparar dados para Excel com anos nas linhas e tipos nas colunas
    const wsData = [
      ['Ano', ...data.types],
      ...data.years.map(year => [
        year,
        ...data.types.map(type => 
          data.valuesByTypeAndYear[type][year] !== undefined && data.valuesByTypeAndYear[type][year] !== null
            ? data.valuesByTypeAndYear[type][year]
            : '-'
        )
      ])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Dados do Estado');
    const fileName = `${tableName}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Configurar título
    doc.setFontSize(16);
    doc.text(tableName, 14, 15);
    doc.setFontSize(12);
    doc.text('Dados do Estado', 14, 25);
    
    // Preparar cabeçalho e dados
    const headers = ['Ano', ...data.types];
    
    // Preparar dados para a tabela
    const tableData = data.years.map(year => [
      year,
      ...data.types.map(type => {
        const value = data.valuesByTypeAndYear[type][year];
        return typeof value === 'number' 
          ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : value || '-';
      })
    ]);
    
    // Gerar tabela
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: {
          halign: 'left'
        },
        ...Array(data.types.length).fill().reduce((acc, _, i) => ({
          ...acc,
          [i + 1]: {
            halign: 'right'
          }
        }), {})
      },
      headStyles: {
        fillColor: [0, 76, 199],
        halign: 'center',
        fontSize: 9,
        fontStyle: 'bold'
      },
      theme: 'grid',
      didDrawPage: function(data) {
        // Ajusta automaticamente a largura das colunas baseado no conteúdo
        const columnWidth = doc.internal.pageSize.width / (headers.length + 1);
        data.table.columns.forEach((column) => {
          column.minWidth = columnWidth;
        });
      }
    });
    
    // Salvar PDF
    doc.save(`${tableName}.pdf`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper sx={{ backgroundColor: theme.palette.background.default }}>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="state revenue table">
              <StyledTableHead>
                <TableRow>
                  <BoldTableCell>Ano</BoldTableCell>
                  {data.types.map((type) => (
                    <BoldTableCell key={type} align="center">
                      {type}
                    </BoldTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {data.years.map((year, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <BoldTableCell component="th" scope="row">
                      {year}
                    </BoldTableCell>
                    {data.types.map((type, idx) => {
                      const value = data.valuesByTypeAndYear[type][year];
                      return (
                        <CenteredTableCell key={idx} align="center">
                          {typeof value === 'number' 
                            ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : value || '-'}
                        </CenteredTableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: '10px' }}>
          <Button
            variant="contained"
            color="success"
            onClick={downloadExcel}
            startIcon={<FaFileExcel />}
            className="action-button"
          >
            <span className="button-text">Excel</span>
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={downloadPDF}
            startIcon={<FaFilePdf />}
            className="action-button"
          >
            <span className="button-text">PDF</span>
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default StateRevenueTable; 