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

const ApiDataTable = ({ data, municipioData, isEtapaSelected, isLocalidadeSelected, isDependenciaSelected }) => {
  const tableDataArray = [data?.result || []];
  const municipioDataArray = municipioData?.map(m => ({
    cityName: m.cityName,
    total: m.result?.[0]?.total || 0,
    // year: m.result?.[0]?.year || "Desconhecido",
  }));

  // Validação dos dados
  if (
    (!data?.result?.byEtapaAndLocalidade || data.result.byEtapaAndLocalidade.length === 0) &&
    (!data?.result?.byEtapaAndDependencia || data.result.byEtapaAndDependencia.length === 0) &&
    (!data?.result?.byLocalidadeAndDependencia || data.result.byLocalidadeAndDependencia.length === 0) &&
    (!Array.isArray(data?.result) || data.result.length === 0) &&
    tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0) &&
    municipioDataArray.every(arr => !Array.isArray(arr) || arr.length === 0)
  ) {
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

  // Headers para a tabela de município
  const municipioHeaders = ['cityName', 'total'];
  const municipioHeaderDisplayNames = {
    cityName: 'Município',
    total: 'Total',
    // year: 'Ano',
  };

  // Headers para a tabela de etapa
  const etapaHeaders = ['education_level_mod_name', 'total'];
  const etapaHeaderDisplayNames = {
    education_level_mod_name: 'Etapa',
    total: 'Total',
  };

  // Headers para a tabela de localidade
  const localidadeHeaders = ['location_name', 'total'];
  const localidadeHeaderDisplayNames = {
    location_name: 'Localidade',
    total: 'Total',
  };

  // Headers para a tabela de dependência administrativa
  const dependenciaHeaders = ['adm_dependency_detailed_name', 'total'];
  const dependenciaHeaderDisplayNames = {
    adm_dependency_detailed_name: 'Dependência Administrativa',
    total: 'Total',
  };

  // Nova lógica para renderizar a tabela combinada
  if ((isEtapaSelected && isLocalidadeSelected) ||
      (isEtapaSelected && isDependenciaSelected) ||
      (isLocalidadeSelected && isDependenciaSelected)) {

    let crossedData;
    let rowHeader;
    let columnHeader;
    let rowField;
    let columnField;
    let rowIdField;
    let columnIdField;

    if (isLocalidadeSelected && isDependenciaSelected) {
      crossedData = data?.result?.byLocalidadeAndDependencia || [];
      rowHeader = "Localidade";
      columnHeader = "Dependência Administrativa";
      rowField = "location_name";
      columnField = "adm_dependency_detailed_name";
      rowIdField = "location_id";
      columnIdField = "adm_dependency_detailed_id";
    } else if (isEtapaSelected && isDependenciaSelected) {
      crossedData = data?.result?.byEtapaAndDependencia || [];
      rowHeader = "Etapa";
      columnHeader = "Dependência Administrativa";
      rowField = "education_level_mod_name";
      columnField = "adm_dependency_detailed_name";
      rowIdField = "education_level_mod_id";
      columnIdField = "adm_dependency_detailed_id";
    } else {
      crossedData = data?.result?.byEtapaAndLocalidade || [];
      rowHeader = "Etapa";
      columnHeader = "Localidade";
      rowField = "education_level_mod_name";
      columnField = "location_name";
      rowIdField = "education_level_mod_id";
      columnIdField = "location_id";
    }

    // Criar estrutura de dados para a tabela
    const uniqueRows = new Map();
    const uniqueColumns = new Map();
    const cellValues = new Map();

    // Processar os dados cruzados
    crossedData.forEach(item => {
      const rowId = item[rowIdField];
      const columnId = item[columnIdField];
      const rowName = item[rowField];
      const columnName = item[columnField];
      const total = item.total;

      uniqueRows.set(rowId, rowName);
      uniqueColumns.set(columnId, columnName);
      cellValues.set(`${rowId}-${columnId}`, total);
    });

    // Ordenar as linhas e colunas por ID numericamente
    const sortedUniqueRows = new Map([...uniqueRows.entries()].sort((a, b) => {
      const numA = parseInt(a[0], 10);
      const numB = parseInt(b[0], 10);
      return numA - numB;
    }));

    const sortedUniqueColumns = new Map([...uniqueColumns.entries()].sort((a, b) => {
      const numA = parseInt(a[0], 10);
      const numB = parseInt(b[0], 10);
      return numA - numB;
    }));

    // Calcular totais das linhas
    const rowTotals = new Map();
    sortedUniqueRows.forEach((_, rowId) => {
      const total = Array.from(sortedUniqueColumns.keys())
        .reduce((sum, colId) => sum + (cellValues.get(`${rowId}-${colId}`) || 0), 0);
      rowTotals.set(rowId, total);
    });

    // Calcular totais das colunas
    const columnTotals = new Map();
    sortedUniqueColumns.forEach((_, colId) => {
      const total = Array.from(sortedUniqueRows.keys())
        .reduce((sum, rowId) => sum + (cellValues.get(`${rowId}-${colId}`) || 0), 0);
      columnTotals.set(colId, total);
    });

    return (
      <ThemeProvider theme={theme}>
        <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="combined table">
              <TableHead>
                <TableRow>
                  <BoldTableCell>{rowHeader}</BoldTableCell>
                  {Array.from(sortedUniqueColumns.entries()).map(([id, name]) => (
                    <BoldTableCell key={id}>{name}</BoldTableCell>
                  ))}
                  <BoldTableCell>Total</BoldTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(sortedUniqueRows.entries()).map(([rowId, rowName]) => (
                  <TableRow key={rowId}>
                    <CenteredTableCell>{rowName}</CenteredTableCell>
                    {Array.from(sortedUniqueColumns.keys()).map(columnId => (
                      <CenteredTableCell key={columnId}>
                        {cellValues.get(`${rowId}-${columnId}`) || 0}
                      </CenteredTableCell>
                    ))}
                    <CenteredTableCell>{rowTotals.get(rowId)}</CenteredTableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <BoldTableCell>Total</BoldTableCell>
                  {Array.from(sortedUniqueColumns.keys()).map(columnId => (
                    <BoldTableCell key={columnId}>
                      {columnTotals.get(columnId)}
                    </BoldTableCell>
                  ))}
                  <BoldTableCell>
                    {Array.from(rowTotals.values()).reduce((sum, total) => sum + total, 0)}
                  </BoldTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Primeira tabela */}
        {!isEtapaSelected && !isLocalidadeSelected && !isDependenciaSelected && tableDataArray.map((tableData, tableIndex) => (
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

        {/* Segunda tabela para município */}
        {!isEtapaSelected && !isLocalidadeSelected && !isDependenciaSelected && municipioDataArray.length > 0 && // Verifica se há dados
          <Paper
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="municipio table">
                <StyledTableHead>
                  <TableRow>
                    {municipioHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {municipioHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {municipioDataArray.map((item, index) => (
                    <TableRow key={index}>
                      {municipioHeaders.map(header => (
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
        }

        {/* Nova tabela para etapa */}
        {isEtapaSelected && (
          <Paper
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="etapa table">
                <StyledTableHead>
                  <TableRow>
                    {etapaHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {etapaHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result.map((item, index) => (
                    <TableRow key={index}>
                      {etapaHeaders.map(header => (
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
        )}

        {isLocalidadeSelected && (
          <Paper
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="localidade table">
                <StyledTableHead>
                  <TableRow>
                    {localidadeHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {localidadeHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result.map((item, index) => (
                    <TableRow key={index}>
                      {localidadeHeaders.map(header => (
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
        )}

        {isDependenciaSelected && (
          <Paper
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}

          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="dependencia table">
                <StyledTableHead>
                  <TableRow>
                    {dependenciaHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {dependenciaHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result.map((item, index) => (
                    <TableRow key={index}>
                      {dependenciaHeaders.map(header => (
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
        )}
      </div>
    </ThemeProvider>
  );
};

export default ApiDataTable;