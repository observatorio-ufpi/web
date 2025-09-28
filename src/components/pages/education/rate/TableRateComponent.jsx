import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React from 'react';
import EnhancedBarChart from '../../../common/EnhancedBarChart';
import EnhancedPieChart from '../../../common/EnhancedPieChart';
import TableExport from '../../../common/TableExport';
import HistoricalChart from '../HistoricalChart';

// ==========================================
// TEMA E ESTILOS
// ==========================================
const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
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

// ==========================================
// CONSTANTES E CONFIGURAÇÕES
// ==========================================

// Tipos de dados que usam formatação de porcentagem
const RATIO_TYPES = ['liquid_enrollment_ratio', 'gloss_enrollment_ratio', 'rate_school_new', 'pop_out_school', 'iliteracy_rate', 'superior_education_conclusion_tax', 'basic_education_conclusion', 'adjusted_liquid_frequency'];

// Configurações de cabeçalhos para diferentes tipos de tabelas
const HEADERS = {
  // Cabeçalhos padrão
  default: ['total'],

  // Cabeçalhos para etapa
  etapa: ['education_level_mod_name', 'total'],

  // Cabeçalhos para localidade
  localidade: ['location_name', 'total'],

  // Cabeçalhos para faixa etária
  faixaEtaria: ['age_range_name', 'total'],

  // Cabeçalhos para nível de instrução
  instruction_level: ['instruction_level_name', 'total']
};

// Nomes de exibição para cabeçalhos
const HEADER_DISPLAY_NAMES = {
  total: 'Total',
  education_level_mod_name: 'Etapa',
  location_name: 'Localidade',
  age_range_name: 'Faixa Etária',
  instruction_level_name: 'Nível de Instrução'
};

// Configurações para tabelas cruzadas
const CROSS_TABLE_CONFIGS = {
  // Localidade x Faixa Etária
  localidadeFaixaEtaria: {
    dataKey: 'result',
    config: {
      rowField: 'location_name',
      rowIdField: 'location_id',
      columnField: 'age_range_name',
      columnIdField: 'age_range_id',
      rowHeader: 'Localidade'
    }
  },

  // Faixa Etária x Localidade
  faixaEtariaLocalidade: {
    dataKey: 'result',
    config: {
      rowField: 'age_range_name',
      rowIdField: 'age_range_id',
      columnField: 'location_name',
      columnIdField: 'location_id',
      rowHeader: 'Faixa Etária'
    }
  },

  // Nível de Instrução x Localidade
  instructionLevelLocalidade: {
    dataKey: 'result',
    config: {
      rowField: 'instruction_level_name',
      rowIdField: 'instruction_level_id',
      columnField: 'location_name',
      columnIdField: 'location_id',
      rowHeader: 'Nível de Instrução'
    }
  },

  // Nível de Instrução x Faixa Etária
  instructionLevelFaixaEtaria: {
    dataKey: 'result',
    config: {
      rowField: 'instruction_level_name',
      rowIdField: 'instruction_level_id',
      columnField: 'age_range_name',
      columnIdField: 'age_range_id',
      rowHeader: 'Nível de Instrução'
    }
  },
};

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

// Verifica se o tipo de dados deve ser formatado como porcentagem
const isRatioType = (type) => RATIO_TYPES.includes(type);

// Formata números com pontos para separar milhares
const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('pt-BR');
};

// Verifica se os dados estão vazios
const hasNoData = (data) => {
  console.log('TableRateComponent - Dados recebidos:', data);

  // Verificar se data existe
  if (!data) {
    console.log('TableRateComponent - Data é null/undefined');
    return true;
  }

  // Verificar se data.result existe e é um array
  if (!Array.isArray(data.result)) {
    console.log('TableRateComponent - data.result não é um array:', data.result);
    return true;
  }

  // Verificar se o array está vazio
  if (data.result.length === 0) {
    console.log('TableRateComponent - data.result está vazio');
    return true;
  }

  console.log('TableRateComponent - Dados válidos encontrados:', data.result.length, 'itens');
  return false;
};

// Obtém a configuração para tabela cruzada com base nos filtros selecionados
const getCrossTableConfig = (filters, type, year) => {
  const { isLocalidadeSelected, isFaixaEtariaSelected, isInstructionLevelSelected } = filters;

  if (isLocalidadeSelected && isFaixaEtariaSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.localidadeFaixaEtaria.dataKey,
      ...CROSS_TABLE_CONFIGS.localidadeFaixaEtaria.config
    };
  }

  if (isInstructionLevelSelected && isLocalidadeSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.instructionLevelLocalidade.dataKey,
      ...CROSS_TABLE_CONFIGS.instructionLevelLocalidade.config
    };
  }

  if (isInstructionLevelSelected && isFaixaEtariaSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.instructionLevelFaixaEtaria.dataKey,
      ...CROSS_TABLE_CONFIGS.instructionLevelFaixaEtaria.config
    };
  }

  return null;
};

// Processa dados para tabela cruzada
const processCrossTableData = (data, rowIdField, columnIdField, rowField, columnField) => {
  const uniqueRows = new Map();
  const uniqueColumns = new Map();
  const cellValues = new Map();

  // Processar os dados
  data.forEach(item => {
    const rowId = item[rowIdField];
    const columnId = item[columnIdField];
    const rowName = item[rowField];
    const columnName = item[columnField];
    const total = item.total;

    uniqueRows.set(rowId, rowName);
    uniqueColumns.set(columnId, columnName);
    cellValues.set(`${rowId}-${columnId}`, total);
  });

  // Ordenar linhas e colunas por ID numericamente
  const sortedUniqueRows = new Map([...uniqueRows.entries()].sort((a, b) => {
    return parseInt(a[0], 10) - parseInt(b[0], 10);
  }));

  const sortedUniqueColumns = new Map([...uniqueColumns.entries()].sort((a, b) => {
    return parseInt(a[0], 10) - parseInt(b[0], 10);
  }));

  // Calcular totais das linhas
  const rowTotals = new Map();
  sortedUniqueRows.forEach((_, rowId) => {
    const total = Array.from(sortedUniqueColumns.keys())
      .reduce((sum, colId) => Number(sum) + Number(cellValues.get(`${rowId}-${colId}`) || 0), 0);
    rowTotals.set(rowId, total);
  });

  // Calcular totais das colunas
  const columnTotals = new Map();
  sortedUniqueColumns.forEach((_, colId) => {
    const total = Array.from(sortedUniqueRows.keys())
      .reduce((sum, rowId) => Number(sum) + Number(cellValues.get(`${rowId}-${colId}`) || 0), 0);
    columnTotals.set(colId, total);
  });

  return {
    uniqueRows: sortedUniqueRows,
    uniqueColumns: sortedUniqueColumns,
    cellValues,
    rowTotals,
    columnTotals
  };
};

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

// Componente de tabela básica
const BasicTable = ({ headers, data, formatTotal = false, ref }) => {
  return (
    <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={ref}>
      <Table sx={{ minWidth: 650 }} aria-label="data table" style={{ backgroundColor: theme.palette.background.default }}>
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
          {data.map((item, index) => (
            <TableRow key={index}>
              {headers.map(header => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  {header === 'total' && formatTotal
                    ? `${Number(item[header] || 0).toFixed(2)}%`
                    : header === 'total'
                      ? formatNumber(item[header])
                      : item[header]?.toString() || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Componente de tabela com paginação
const PaginatedTable = ({
  headers,
  data,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  formatTotal = false,
  ref
}) => {
  return (
    <>
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={ref}>
        <Table sx={{ minWidth: 650 }} aria-label="paginated table" style={{ backgroundColor: theme.palette.background.default }}>
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
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  {headers.map(header => (
                    <CenteredTableCell key={header}>
                      {header === 'total' && formatTotal
                        ? `${Number(item[header] || 0).toFixed(2)}%`
                        : header === 'total'
                          ? formatNumber(item[header])
                          : item[header]?.toString() || ''}
                    </CenteredTableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </>
  );
};

// Componente para tabela cruzada
const CrossTable = ({
  rowHeader,
  uniqueRows,
  uniqueColumns,
  cellValues,
  rowTotals,
  columnTotals,
  type,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  ref
}) => {
  const showTotals = !isRatioType(type);

  return (
    <>
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={ref}>
        <Table sx={{ minWidth: 650 }} aria-label="combined table" style={{ backgroundColor: theme.palette.background.default }}>
          <StyledTableHead>
            <TableRow>
              <BoldTableCell>{rowHeader}</BoldTableCell>
              {Array.from(uniqueColumns.entries()).map(([id, name]) => (
                <BoldTableCell key={id}>{name}</BoldTableCell>
              ))}
              {showTotals && <BoldTableCell>Total</BoldTableCell>}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {Array.from(uniqueRows.entries()).map(([rowId, rowName]) => (
              <TableRow key={rowId}>
                <CenteredTableCell>{rowName}</CenteredTableCell>
                {Array.from(uniqueColumns.keys()).map(columnId => (
                  <CenteredTableCell key={columnId}>
                    {isRatioType(type)
                      ? `${Number(cellValues.get(`${rowId}-${columnId}`) || 0).toFixed(2)}%`
                      : formatNumber(cellValues.get(`${rowId}-${columnId}`) || 0)}
                  </CenteredTableCell>
                ))}
                {showTotals &&
                  <CenteredTableCell>{formatNumber(rowTotals.get(rowId))}</CenteredTableCell>
                }
              </TableRow>
            ))}
            {showTotals && (
              <TableRow>
                <BoldTableCell>Total</BoldTableCell>
                {Array.from(uniqueColumns.keys()).map(columnId => (
                  <BoldTableCell key={columnId}>
                    {formatNumber(columnTotals.get(columnId))}
                  </BoldTableCell>
                ))}
                <BoldTableCell>
                  {formatNumber(Array.from(columnTotals.values()).reduce((sum, val) => sum + val, 0))}
                </BoldTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TableExport
        data={Array.from(uniqueRows.entries()).map(([rowId, rowName]) => {
          const rowData = { [rowHeader]: rowName };
          Array.from(uniqueColumns.entries()).forEach(([colId, colName]) => {
            rowData[colName] = cellValues.get(`${rowId}-${colId}`) || 0;
          });
          rowData.Total = rowTotals.get(rowId) || 0;
          return rowData;
        })}
        headers={[rowHeader, ...Array.from(uniqueColumns.values()), 'Total']}
        headerDisplayNames={{ [rowHeader]: rowHeader, Total: 'Total' }}
        fileName="dados_cruzados"
        tableTitle="Dados Cruzados"
        tableRef={ref}
      />
    </>
  );
};

const TableRateComponent = ({
  data,
  isEtapaSelected,
  isLocalidadeSelected,
  isHistorical,
  type,
  isFaixaEtariaSelected,
  year,
  isInstructionLevelSelected,
  title = ''
}) => {
  // Estados para paginação
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Referências para as tabelas e gráfico
  const chartRef = React.useRef(null);
  const crossChartRef = React.useRef(null);
  const simpleChartRef = React.useRef(null);
  const tableRefs = {
    historical: React.useRef(null),
    default: React.useRef(null),
    etapa: React.useRef(null),
    localidade: React.useRef(null),
    faixaEtaria: React.useRef(null),
    cross: React.useRef(null)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Verificação de dados vazios
  if (hasNoData(data)) {
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
      if (isEtapaSelected) {
        return {
          id: 'education_level_mod_id',
          name: 'education_level_mod_name',
          label: 'Etapa'
        };
      }
      if (isLocalidadeSelected) {
        return {
          id: 'location_id',
          name: 'location_name',
          label: 'Localidade'
        };
      }
      if (isFaixaEtariaSelected) {
        return {
          id: 'age_range_id',
          name: 'age_range_name',
          label: 'Faixa Etária'
        };
      }
      if (isInstructionLevelSelected) {
        return {
          id: 'instruction_level_id',
          name: 'instruction_level_name',
          label: 'Nível de Instrução'
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
      const exportData = [];
      sortedYears.forEach(year => {
        const row = { year };
        row.total = yearMap.get(year) || 0;
        exportData.push(row);
      });

      // Preparar headers para exportação
      const exportHeaders = ['year', 'total'];
      const headerDisplayNames = { year: 'Ano', total: 'Total' };

      return (
        <div>
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={tableRefs.historical}>
            <Table sx={{ minWidth: 650 }} aria-label="historical table" style={{ backgroundColor: theme.palette.background.default }}>
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
                      {isRatioType(type)
                        ? `${Number(yearMap.get(year) || 0).toFixed(2)}%`
                        : formatNumber(yearMap.get(year))}
                    </CenteredTableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableExport
            data={exportData}
            headers={exportHeaders}
            headerDisplayNames={headerDisplayNames}
            fileName="dados_historicos"
            tableTitle={title || "Dados Históricos"}
            tableRef={tableRefs.historical}
          />
        </div>
      );
    }

    // Organizar dados por categoria e ano
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
      categoryYearMap.get(categoryName).set(year, Number(item.total) || 0);
    });

    // Converter Set para Array e ordenar
    const sortedYears = [...years].sort((a, b) => a - b);

    const sortedCategories = [...categories].sort((a, b) => {
      return Number(categoryIds.get(a)) - Number(categoryIds.get(b));
    });

    // Preparar dados para exportação
    const exportData = [];
    sortedCategories.forEach(category => {
      const row = { [extraColumn.label]: category };
      sortedYears.forEach(year => {
        row[year] = categoryYearMap.get(category)?.get(year) || 0;
      });
      exportData.push(row);
    });

    // Preparar headers para exportação
    const exportHeaders = [extraColumn.label, ...sortedYears];
    const headerDisplayNames = { [extraColumn.label]: extraColumn.label };
    sortedYears.forEach(year => {
      headerDisplayNames[year] = year;
    });

    return (
      <div>
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={tableRefs.historical}>
          <Table sx={{ minWidth: 650 }} aria-label="historical table" style={{ backgroundColor: theme.palette.background.default }}>
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
                        {isRatioType(type)
                          ? `${Number(yearMap.get(year) || 0).toFixed(2)}%`
                          : formatNumber(yearMap.get(year) || 0)}
                      </CenteredTableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div ref={chartRef}>
          <HistoricalChart
            data={data}
            type={type}
            isEtapaSelected={isEtapaSelected}
            isLocalidadeSelected={isLocalidadeSelected}
            isFaixaEtariaSelected={isFaixaEtariaSelected}
            isInstructionLevelSelected={isInstructionLevelSelected}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <TableExport
            data={exportData}
            headers={exportHeaders}
            headerDisplayNames={headerDisplayNames}
            fileName="dados_historicos"
            tableTitle={title || "Dados Históricos"}
            tableRef={tableRefs.historical}
            chartRef={chartRef}
          />
        </div>
      </div>
    );
  };

  // Função para renderizar gráficos para tabelas simples
  const renderSimpleTableCharts = (filterType, tableData) => {
    if (!tableData || tableData.length === 0) return null;

    // Mapear os campos corretos para cada tipo de filtro
    const getFieldName = (filterType) => {
      switch (filterType) {
        case 'etapa':
          return 'education_level_mod_name';
        case 'localidade':
          return 'location_name';
        case 'faixaEtaria':
          return 'age_range_name';
        case 'instruction_level':
          return 'instruction_level_name';
        default:
          return Object.keys(tableData[0] || {}).find(key => key !== 'total');
      }
    };

    const fieldName = getFieldName(filterType);
    const chartData = tableData.map(item => ({
      name: item[fieldName] || 'N/A',
      value: Number(item.total) || 0
    }));

    // Determinar se deve usar gráfico de pizza ou barras baseado no número de itens
    const usePieChart = chartData.length <= 8 && chartData.length > 1;
    const chartTitle = getTableTitle(filterType);

    return (
      <div style={{ marginTop: '1rem' }} ref={simpleChartRef}>
        {usePieChart ? (
          <EnhancedPieChart
            data={chartData}
            title={`Distribuição por ${chartTitle.replace('Dados por ', '')}`}
            height={500}
          />
        ) : (
          <EnhancedPieChart
            data={chartData}
            title={chartTitle}
            height={500}
          />
        )}
      </div>
    );
  };

  // Função para gerar título correto para combinações de filtros
  const getCrossTableTitle = () => {
    const selectedFilters = [];
    if (isEtapaSelected) selectedFilters.push('Etapa');
    if (isLocalidadeSelected) selectedFilters.push('Localidade');
    if (isFaixaEtariaSelected) selectedFilters.push('Faixa Etária');
    if (isInstructionLevelSelected) selectedFilters.push('Nível de Instrução');

    if (selectedFilters.length === 2) {
      return `Combinação: ${selectedFilters[0]} × ${selectedFilters[1]}`;
    }
    return 'Combinação de Filtros';
  };

  // Função para renderizar gráficos para tabelas cruzadas
  const renderCrossTableCharts = (uniqueRows, uniqueColumns, cellValues, rowHeader) => {
    if (!uniqueRows || !uniqueColumns || uniqueRows.size === 0 || uniqueColumns.size === 0) {
      return null;
    }

    // Criar dados para gráfico de barras agrupadas
    const chartData = Array.from(uniqueRows.entries()).map(([rowId, rowName]) => {
      const rowData = { name: rowName };
      Array.from(uniqueColumns.entries()).forEach(([colId, colName]) => {
        rowData[colName] = Number(cellValues.get(`${rowId}-${colId}`) || 0);
      });
      return rowData;
    });

    // Para combinações de filtros, sempre usar gráfico de barras
    const chartTitle = getCrossTableTitle();

    return (
      <div style={{ marginTop: '1rem' }} ref={crossChartRef}>
        <EnhancedBarChart
          data={chartData}
          title={chartTitle}
          height={500}
          xAxisKey="name"
        />
      </div>
    );
  };

  // Renderização de tabela simples
  const renderSimpleTable = (filterType) => {
    let headers, tableData, formatTotal;

    switch (filterType) {
      case 'etapa':
        headers = HEADERS.etapa;
        tableData = data.result;
        formatTotal = isRatioType(type);
        break;

      case 'localidade':
        headers = HEADERS.localidade;
        tableData = data.result;
        formatTotal = isRatioType(type);
        break;

      case 'faixaEtaria':
        headers = HEADERS.faixaEtaria;
        tableData = data.result;
        formatTotal = true;
        break;

      case 'instruction_level':
        headers = HEADERS.instruction_level;
        tableData = data.result;
        formatTotal = isRatioType(type);
        break;

      default:
        return null;
    }

    // Preparar dados para exportação
    const exportData = tableData.map(item => {
      const row = {};
      headers.forEach(header => {
        row[header] = item[header];
      });
      return row;
    });

    // Preparar headers para exportação
    const exportHeaders = headers;
    const headerDisplayNames = {};
    headers.forEach(header => {
      headerDisplayNames[header] = HEADER_DISPLAY_NAMES[header] || header;
    });

    return (
      <div>
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={tableRefs[filterType]}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ backgroundColor: theme.palette.background.default }}>
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
              {tableData.map((item, index) => (
                <TableRow key={index}>
                  {headers.map(header => (
                    <CenteredTableCell key={header}>
                      {header === 'total' && formatTotal
                        ? `${Number(item[header] || 0).toFixed(2)}%`
                        : header === 'total'
                          ? formatNumber(item[header])
                          : item[header]?.toString() || ''}
                    </CenteredTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Adicionar gráficos para tabelas simples */}
        {renderSimpleTableCharts(filterType, tableData)}

        <TableExport
          data={exportData}
          headers={exportHeaders}
          headerDisplayNames={headerDisplayNames}
          fileName={`dados_por_${filterType}`}
          tableTitle={title || getTableTitle(filterType)}
          tableRef={tableRefs[filterType]}
        />
      </div>
    );
  };

  // Função para obter título legível para cada tipo de filtro
  const getTableTitle = (filterType) => {
    switch (filterType) {
      case 'etapa':
        return 'Dados por Etapa';
      case 'localidade':
        return 'Dados por Localidade';
      case 'faixaEtaria':
        return 'Dados por Faixa Etária';
      case 'instruction_level':
        return 'Dados por Nível de Instrução';
      default:
        return `Dados por ${filterType}`;
    }
  };

  // Renderização de tabela cruzada
  const renderCrossTable = () => {
    const filters = { isLocalidadeSelected, isFaixaEtariaSelected, isInstructionLevelSelected };
    const config = getCrossTableConfig(filters, type, year);

    if (!config) return null;

    const crossedData = data?.result || [];

    // Processamento de dados cruzados
    const { uniqueRows, uniqueColumns, cellValues, rowTotals, columnTotals } = processCrossTableData(
      crossedData,
      config.rowIdField,
      config.columnIdField,
      config.rowField,
      config.columnField
    );

    // Preparar dados para exportação
    const exportData = [];
    Array.from(uniqueRows.entries()).forEach(([rowId, rowName]) => {
      const rowData = { [config.rowHeader]: rowName };
      Array.from(uniqueColumns.entries()).forEach(([colId, colName]) => {
        rowData[colName] = cellValues.get(`${rowId}-${colId}`) || 0;
      });
      rowData.Total = rowTotals.get(rowId) || 0;
      exportData.push(rowData);
    });

    // Adicionar linha de total
    const totalRow = { [config.rowHeader]: 'Total' };
    Array.from(uniqueColumns.entries()).forEach(([colId, colName]) => {
      totalRow[colName] = columnTotals.get(colId) || 0;
    });
    totalRow.Total = Array.from(columnTotals.values()).reduce((sum, val) => sum + val, 0);
    exportData.push(totalRow);

    // Preparar headers para exportação
    const exportHeaders = [config.rowHeader, ...Array.from(uniqueColumns.values()), 'Total'];
    const headerDisplayNames = { [config.rowHeader]: config.rowHeader, Total: 'Total' };
    Array.from(uniqueColumns.values()).forEach(col => {
      headerDisplayNames[col] = col;
    });

    return (
      <div>
        <CrossTable
          rowHeader={config.rowHeader}
          uniqueRows={uniqueRows}
          uniqueColumns={uniqueColumns}
          cellValues={cellValues}
          rowTotals={rowTotals}
          columnTotals={columnTotals}
          type={type}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          ref={tableRefs.cross}
        />

        {/* Adicionar gráficos para tabelas cruzadas */}
        {renderCrossTableCharts(uniqueRows, uniqueColumns, cellValues, config.rowHeader)}
      </div>
    );
  };

  // Determinar qual tipo de tabela renderizar
  const hasCrossFilters = (isLocalidadeSelected && isFaixaEtariaSelected) || (isInstructionLevelSelected && isLocalidadeSelected) || (isInstructionLevelSelected && isFaixaEtariaSelected);
  const hasNoFilters = !isEtapaSelected && !isLocalidadeSelected && !isFaixaEtariaSelected && !isInstructionLevelSelected;

  // Renderização principal
  return (
    <ThemeProvider theme={theme}>
      <div>
        {isHistorical && (
          <div>
            {renderHistoricalTable()}
          </div>
        )}

        {/* Tabela cruzada */}
        {!isHistorical && hasCrossFilters && renderCrossTable()}

        {/* Tabela simples (sem filtros) */}
        {!isHistorical && hasNoFilters && (
          <div>
            <BasicTable
              headers={HEADERS.default}
              data={data.result}
              formatTotal={isRatioType(type)}
              ref={tableRefs.default}
            />
            <TableExport
              data={data.result}
              headers={HEADERS.default}
              headerDisplayNames={HEADER_DISPLAY_NAMES}
              fileName="dados_gerais"
              tableTitle={title || "Dados Gerais"}
              tableRef={tableRefs.default}
            />
          </div>
        )}

        {/* Tabelas simples com filtros individuais */}
        {!isHistorical && !hasCrossFilters && !hasNoFilters && (
          <>
            {isEtapaSelected && renderSimpleTable('etapa')}
            {isLocalidadeSelected && renderSimpleTable('localidade')}
            {isFaixaEtariaSelected && renderSimpleTable('faixaEtaria')}
            {isInstructionLevelSelected && renderSimpleTable('instruction_level')}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default TableRateComponent;
