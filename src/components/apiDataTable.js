import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React from 'react';

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
  const tableDataArray = [data?.result || []];

  // Validação dos dados
  if (tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0)) {
    return (
      <ThemeProvider theme={theme}>
        <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
          Nenhum dado disponível
        </Paper>
      </ThemeProvider>
    );
  }

  // Pega os headers do primeiro conjunto de dados que tiver conteúdo
  const firstValidData = tableDataArray.find(arr => arr.length > 0)?.[0] || {};
  const headers = Object.keys(firstValidData).filter(header => header === 'total');

  const headerDisplayNames = {
    total: 'Total',
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {tableDataArray.map((tableData, tableIndex) => (
          <Paper
            key={tableIndex}
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <StyledTableHead>
                  <TableRow>
                    {headers.map(header => (
                      <BoldTableCell key={header}>
                        {headerDisplayNames[header] || header}
                      </BoldTableCell>
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
        ))}
      </div>
    </ThemeProvider>
  );
};

export default ApiDataTable;