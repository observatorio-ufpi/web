import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React from 'react';
import TableExport from '../../../common/TableExport';

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

  const BasicTable = ({ headers, data, formatTotal = false, sortField = null, ref }) => {
    const sortedData = sortField
      ? [...data].sort((a, b) => Number(a[sortField]) - Number(b[sortField]))
      : data;
  
    return (
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={ref}>
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
            {sortedData.map((item, index) => {
              // Verifica se o item atual é a linha de Total
              const isTotal = item.cityName === 'Total' || item.nome === 'Total';
              
              return (
                <TableRow key={index}>
                  {headers.map(header => (
                    <TableCell 
                      key={header} 
                      align="center"
                      sx={{ 
                        fontWeight: isTotal ? 'bold' : 'normal',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}
                    >
                      {header === 'total' && formatTotal
                        ? `${Number(item[header] || 0).toFixed(2)}%`
                        : item[header]?.toString() || ''}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
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
  isRegimeSelected,
  title = ''
}) => {

  // Referências para as tabelas
  const tableRefs = {
    historical: React.useRef(null),
    default: React.useRef(null),
    municipio: React.useRef(null),
    modalidade: React.useRef(null),
    regimeDeTrabalho: React.useRef(null)
  };

  const tableDataArray = [data?.result || []];
  const municipioDataArray = municipioData?.map(m => ({
    cityName: m.cityName,
    total: m.result?.[0]?.total || 0,
  }));

  if (hasNoData(data, tableDataArray, municipioDataArray)) {
    return (
      <ThemeProvider theme={theme}>
        <div>
          Nenhum dado disponível
        </div>
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

      // Preparar dados para exportação
      const exportData = sortedYears.map(year => ({ year, total: yearMap.get(year) }));

      return (
        <div>
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={tableRefs.historical}>
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
          <TableExport 
            data={exportData}
            headers={['year', 'total']}
            headerDisplayNames={{ year: 'Ano', total: 'Total' }}
            fileName="dados_historicos"
            tableTitle={title || "Dados Históricos"}
            tableRef={tableRefs.historical}
          />
        </div>
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

    // Preparar dados para exportação
    const exportData = [];
    sortedCategories.forEach(category => {
      const yearMap = categoryYearMap.get(category);
      const row = { [extraColumn.label]: category };
      sortedYears.forEach(year => {
        row[year] = yearMap.get(year) || 0;
      });
      exportData.push(row);
    });

    // Preparar headers para exportação
    const exportHeaders = [extraColumn.label, ...sortedYears.map(year => year.toString())];
    const headerDisplayNames = { [extraColumn.label]: extraColumn.label };
    sortedYears.forEach(year => {
      headerDisplayNames[year] = year.toString();
    });

    return (
      <div>
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={tableRefs.historical}>
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
        <TableExport 
          data={exportData}
          headers={exportHeaders}
          headerDisplayNames={headerDisplayNames}
          fileName={`dados_historicos_por_${extraColumn.label.toLowerCase()}`}
          tableTitle={title || `Dados Históricos por ${extraColumn.label}`}
          tableRef={tableRefs.historical}
        />
      </div>
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
      <div>
        <BasicTable
          headers={headers}
          data={tableData}
          sortField={sortField}
          formatTotal={formatTotal}
          usePagination={usePagination}
          note={note}
          ref={tableRefs[filterType]}
        />
        <TableExport 
          data={tableData}
          headers={headers}
          headerDisplayNames={HEADER_DISPLAY_NAMES}
          fileName={`dados_por_${filterType}`}
          tableTitle={title || `Dados por ${filterType === 'modalidade' ? 'Modalidade' : 'Regime de Trabalho'}`}
          tableRef={tableRefs[filterType]}
        />
      </div>
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
            {/* Tabela de dados gerais, apenas se não houver dados de municípios */}
            {municipioDataArray.length === 0 && tableDataArray.map((tableData, index) => (
              <div key={index}>
                <BasicTable
                  headers={HEADERS.default}
                  data={tableData}
                  ref={tableRefs.default}
                />
                <TableExport 
                  data={tableData}
                  headers={HEADERS.default}
                  headerDisplayNames={HEADER_DISPLAY_NAMES}
                  fileName="dados_gerais"
                  tableTitle={title || "Dados Gerais"}
                  tableRef={tableRefs.default}
                />
              </div>
            ))}
            {/* Tabela de municípios */}
            {municipioDataArray.length > 0 && (
              <div>
                <BasicTable
                  headers={HEADERS.municipio}
                  data={[
                    ...municipioDataArray,
                    {
                      cityName: 'Total', 
                      total: municipioDataArray.reduce((sum, item) => sum + item.total, 0),
                    },
                  ]}
                  ref={tableRefs.municipio}
                />
                <TableExport 
                  data={[
                    ...municipioDataArray,
                    {
                      cityName: 'Total',
                      total: municipioDataArray.reduce((sum, item) => sum + item.total, 0),
                    },
                  ]}
                  headers={HEADERS.municipio}
                  headerDisplayNames={HEADER_DISPLAY_NAMES}
                  fileName="dados_por_municipio"
                  tableTitle={title || "Dados por Município"}
                  tableRef={tableRefs.municipio}
                />
              </div>
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
