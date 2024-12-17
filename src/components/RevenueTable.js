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

  const exportToExcel = () => {
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
        <Button variant="contained" color="success" onClick={exportToExcel} sx={{ marginTop: 2, marginBottom: 2 }}>
          Exportar para Excel
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default RevenueTable;
