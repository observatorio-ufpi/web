import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

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

const ApiDataTable = ({ data }) => {
  // Extrair o array de resultado do objeto de resposta
  const tableData = data?.result || [];

  // Validação dos dados
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
          Nenhum dado disponível
        </Paper>
      </ThemeProvider>
    );
  }

  const headers = Object.keys(tableData[0]).filter(header => header === 'total');

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper sx={{ backgroundColor: theme.palette.background.default }}>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <StyledTableHead>
                <TableRow>
                  {headers.map(header => (
                    <BoldTableCell key={header}>{header}</BoldTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow key={index}>
                    {headers.map(header => (
                      <CenteredTableCell key={header}>
                        {item[header]?.toString() || ''}
                      </CenteredTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default ApiDataTable;