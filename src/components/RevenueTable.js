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
import React from 'react';
import * as XLSX from 'xlsx';
import { municipios } from '../utils/municipios.mapping';

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
  minWidth: '8rem', // Define a largura mínima de cada célula usando rem
  textAlign: 'center', // Centraliza o texto horizontalmente
  verticalAlign: 'middle', // Centraliza o texto verticalmente
  '@media (max-width: 600px)': {
    minWidth: '6rem', // Ajusta a largura mínima para telas menores
  },
}));

const CenteredTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center', // Centraliza o texto horizontalmente
  verticalAlign: 'middle', // Centraliza o texto verticalmente
}));

const RevenueTable = ({ data, transformDataFunction, standardizeTypeFunction, tableMapping, tableName, keyTable, groupType }) => {
  let rows
  let typeToRowToValue

  ({ rows, typeToRowToValue } = transformDataFunction(data, standardizeTypeFunction));


  const types = Object.keys(tableMapping);

  const downloadExcel = () => {
    if (groupType === 'municipio') {
      const wb = XLSX.utils.book_new();
      const wsData = [
        ['Ano', ...types],
        ...rows.map((row) => {
          return [
            row,
            ...types.map((type) => {
              if (typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined) {
                return typeToRowToValue[type][row];
              } else {
                return '-';
              }
            }),
          ];
        }),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Receitas');
      const fileName = `${tableName}_${keyTable}.xlsx`; // Nome do arquivo incluindo o nome da tabela e o município
      XLSX.writeFile(wb, fileName);
    }

    if (groupType === 'ano') {
      const wb = XLSX.utils.book_new();
      const wsData = [
        ['Municipio', ...types],
        ...rows.map((row) => {
          return [
            municipios[row]?.nomeMunicipio,
            ...types.map((type) => {
              if (typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined) {
                return typeToRowToValue[type][row];
              } else {
                return '-';
              }
            }),
          ];
        }),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Receitas');
      const fileName = `${tableName}_${keyTable}.xlsx`; // Nome do arquivo incluindo o nome da tabela e o município
      XLSX.writeFile(wb, fileName);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Configurar título
    doc.setFontSize(16);
    doc.text(tableName, 14, 15);
    doc.setFontSize(12);
    doc.text(`${groupType === 'municipio' ? 'Município' : 'Ano'}: ${groupType === 'municipio' ? municipios[keyTable]?.nomeMunicipio : keyTable}`, 14, 25);

    // Função para capitalizar texto
    const capitalizeText = (text) => {
      if (!text) return '';
      return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    // Preparar cabeçalho e dados como no Excel
    const headers = [groupType === 'ano' ? 'Municipio' : 'Ano', ...Object.keys(tableMapping)];

    // Preparar dados para a tabela
    const tableData = rows.map(row => [
      groupType === 'ano' ? municipios[row]?.nomeMunicipio : row,
      ...types.map(type =>
        typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
          ? typeToRowToValue[type][row].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '-'
      )
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
        ...Array(types.length).fill().reduce((acc, _, i) => ({
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
    doc.save(`${tableName}_${keyTable}.pdf`);
  };

  return (
    <ThemeProvider theme={theme}>
      <div> {/* Adiciona margem nas laterais */}
        <Paper sx={{ backgroundColor: theme.palette.background.default }}>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <StyledTableHead>
                <TableRow>
                  <BoldTableCell>{groupType === 'ano' ? 'Municipio' : 'Ano'}</BoldTableCell>
                  {types.map((type) => (
                    <BoldTableCell key={type} align="center">
                      {type}
                    </BoldTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <BoldTableCell component="th" scope="row">
                    {groupType === 'ano' ? `${municipios[row]?.nomeMunicipio}` : `${row}`}
                    </BoldTableCell>
                    {types.map((type) => (
                      <CenteredTableCell key={type} align="center">
                        {typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
                          ? typeToRowToValue[type][row].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : '-'}
                      </CenteredTableCell>
                    ))}
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
          >
            Excel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={downloadPDF}
            startIcon={<FaFilePdf />}
          >
            PDF
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default RevenueTable;
