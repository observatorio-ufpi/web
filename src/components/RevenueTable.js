import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx'; // Importando todos os métodos da biblioteca xlsx

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
      tableHeader: '#cccccc',
    },
  },
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.tableHeader,
}));

const BoldTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const RevenueTable = ({ data, transformDataFunction, standardizeTypeFunction, tableMapping }) => {
  const { years, typeToYearToValue } = transformDataFunction(data, standardizeTypeFunction);
  const types = Object.keys(tableMapping);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Tipo de Receita', ...years],
      ...types.map((type) => {
        return [
          type,
          ...years.map((year) => {
            // Verifica se typeToYearToValue[type] e typeToYearToValue[type][year] não são undefined
            if (typeToYearToValue[type] && typeToYearToValue[type][year] !== undefined) {
              return typeToYearToValue[type][year].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            } else {
              return '-';
            }
          }),
        ];
      }),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Receitas');
    XLSX.writeFile(wb, 'receitas.xlsx');
  };

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <StyledTableHead>
            <TableRow>
              <BoldTableCell>Tipo de Receita</BoldTableCell>
              {years.map((year) => (
                <BoldTableCell key={year} align="right">
                  {year}
                </BoldTableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {type}
                </TableCell>
                {years.map((year) => (
                  <TableCell key={year} align="right">
                    {typeToYearToValue[type] && typeToYearToValue[type][year] !== undefined
                      ? typeToYearToValue[type][year].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ marginTop: 2 }}>
        Exportar para Excel
      </Button>
    </ThemeProvider>
  );
};

export default RevenueTable;
