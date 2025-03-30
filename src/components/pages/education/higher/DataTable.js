import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React from 'react';

// ==========================================
// TEMA E ESTILOS
// ==========================================
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
  
  const HEADERS = {
    // Cabeçalhos padrão
    default: ['total'],

    municipio: ['cityName', 'total'],
    modalidade: ['upper_education_mod_name', 'total'],
    regimeDeTrabalho: ['work_regime_name', 'total']
  };

  const HEADER_DISPLAY_NAMES = {
    total: 'Total',
    cityName: 'Município',
    upper_education_mod_name: 'Modalidade',
    work_regime_name: 'Regime de Trabalho'
  };

  const hasNoData = (data, tableDataArray, municipioDataArray) => {
    return !data || !data.result || tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0) &&
    municipioDataArray.every(arr => !Array.isArray(arr) || arr.length === 0);
  };

  const BasicTable = ({ headers, data, formatTotal = false, sortField = null }) => {
    const sortedData = sortField
      ? [...data].sort((a, b) => Number(a[sortField]) - Number(b[sortField]))
      : data;
  
    return (
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <StyledTableHead>
            <TableRow>
              {headers.map(header => (
                <BoldTableCell key={header}>
                  {HEADER_DISPLAY_NAMES[header] || header}
                </BoldTableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                {headers.map(header => (
                  <CenteredTableCell key={header}>
                    {header === 'total' && formatTotal
                      ? `${Number(item[header] || 0).toFixed(2)}%`
                      : item[header]?.toString() || ''}
                  </CenteredTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

const DataTable = ({
  data,
  municipioData,
  isHistorical,
  isModalidadeSelected,
  isRegimeSelected
}) => {

  const tableDataArray = [data?.result || []];
  const municipioDataArray = municipioData?.map(m => ({
    cityName: m.cityName,
    total: m.result?.[0]?.total || 0,
  }));

  if (hasNoData(data, tableDataArray, municipioDataArray)) {
    return (
      <ThemeProvider theme={theme}>
        <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
          Nenhum dado disponível
        </Paper>
      </ThemeProvider>
    );
  }

  // Renderização de tabela histórica
  const renderHistoricalTable = () => {
    // Determinar quais colunas extras precisamos baseado nos filtros
    const getExtraColumns = () => {
      if (isModalidadeSelected) {
        return {
          id: 'upper_education_mod_id',
          name: 'upper_education_mod_name',
          label: 'Modalidade'
        };
      }
      if (isRegimeSelected) {
        return {
          id: 'work_regime_id',
          name: 'work_regime_name',
          label: 'Regime de Trabalho'
        };
      }
      return null;
    };

    const extraColumn = getExtraColumns();

    if (!extraColumn) {
      // Para dados históricos simples (sem filtros)
      const yearMap = new Map();
      data.result.forEach(item => {
        yearMap.set(item.year, (yearMap.get(item.year) || 0) + Number(item.total || 0));
      });

      const sortedYears = [...yearMap.keys()].sort((a, b) => a - b);

      return (
        <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="historical table">
              <StyledTableHead>
                <TableRow>
                  {sortedYears.map(year => (
                    <BoldTableCell key={year}>{year}</BoldTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                <TableRow>
                  {sortedYears.map(year => (
                    <CenteredTableCell key={year}>
                      {yearMap.get(year)}
                    </CenteredTableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      );
    }

    // Para dados históricos com filtros
    const categoryYearMap = new Map();
    const years = new Set();
    const categories = new Set();
    const categoryIds = new Map();

    // Primeiro passo: organizar os dados
    data.result.forEach(item => {
      const year = item.year;
      const categoryName = item[extraColumn.name];
      const categoryId = item[extraColumn.id];
      years.add(year);
      categories.add(categoryName);
      categoryIds.set(categoryName, categoryId);

      if (!categoryYearMap.has(categoryName)) {
        categoryYearMap.set(categoryName, new Map());
      }
      categoryYearMap.get(categoryName).set(year, (categoryYearMap.get(categoryName).get(year) || 0) + Number(item.total || 0));
    });

    const sortedYears = [...years].sort((a, b) => a - b);
    const sortedCategories = [...categories].sort((a, b) => {
      return Number(categoryIds.get(a)) - Number(categoryIds.get(b));
    });

    return (
      <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="historical table">
            <StyledTableHead>
              <TableRow>
                <BoldTableCell>{extraColumn.label}</BoldTableCell>
                {sortedYears.map(year => (
                  <BoldTableCell key={year}>{year}</BoldTableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {sortedCategories.map(category => {
                const yearMap = categoryYearMap.get(category);

                return (
                  <TableRow key={category}>
                    <CenteredTableCell>{category}</CenteredTableCell>
                    {sortedYears.map(year => (
                      <CenteredTableCell key={year}>
                        {yearMap.get(year) || 0}
                      </CenteredTableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  const renderSimpleTable = (filterType) => {
    let headers, tableData, sortField, formatTotal, usePagination = false, note = null;

    switch (filterType) {
      case 'modalidade':
        headers = HEADERS.modalidade;
        tableData = data.result;
        sortField = 'upper_education_mod_id';
        break;
      case 'regimeDeTrabalho':
        headers = HEADERS.regimeDeTrabalho;
        tableData = data.result;
        sortField = 'work_regime_id';
        break;
      default:
        return null;
    }

    return (
      <Paper sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
        <BasicTable
          headers={headers}
          data={tableData}
          sortField={sortField}
          formatTotal={formatTotal}
          usePagination={usePagination}
          note={note}
        />
      </Paper>
    );
  };

  const hasNoFilters = !isModalidadeSelected && !isRegimeSelected;
  const hasCrossFilters = false;

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Tabela histórica */}
        {isHistorical && renderHistoricalTable()}

        {/* Tabela simples (sem filtros) */}
        {!isHistorical && hasNoFilters && (
          <>
            {/* Tabela de dados gerais */}
            {tableDataArray.map((tableData, index) => (
              <Paper key={index} sx={{ backgroundColor: theme.palette.background.default, marginBottom: 2 }}>
                <BasicTable
                  headers={HEADERS.default}
                  data={tableData}
                />
          </Paper>
            ))}
            {/* Tabela de municípios */}
            {municipioDataArray.length > 0 && (
              <Paper sx={{ backgroundColor: theme.palette.background.default, marginBottom: 2 }}>
                <BasicTable
                  headers={HEADERS.municipio}
                  data={municipioDataArray}
                />
          </Paper>
        )}
          </>
        )}

        {/* Tabelas simples com filtros individuais */}
        {!isHistorical && !hasCrossFilters && (
          <>
            {isModalidadeSelected && renderSimpleTable('modalidade')}
            {isRegimeSelected && renderSimpleTable('regimeDeTrabalho')}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DataTable;
