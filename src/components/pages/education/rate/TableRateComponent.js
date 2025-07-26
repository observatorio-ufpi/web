import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import React from 'react';
import TableExport from '../../../common/TableExport';
import HistoricalChart from '../HistoricalChart';

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

// ==========================================
// CONSTANTES E CONFIGURAÇÕES
// ==========================================

// Tipos de dados que usam formatação de porcentagem
const RATIO_TYPES = ['liquid_enrollment_ratio', 'gloss_enrollment_ratio', 'rate_school_new', 'pop_out_school'];

// Configurações de cabeçalhos para diferentes tipos de tabelas
const HEADERS = {
  // Cabeçalhos padrão
  default: ['total'],

  // Cabeçalhos para etapa
  etapa: ['education_level_mod_name', 'total'],

  // Cabeçalhos para localidade
  localidade: ['location_name', 'total'],

  // Cabeçalhos para faixa etária
  faixaEtaria: ['age_range_name', 'total']
};

// Nomes de exibição para cabeçalhos
const HEADER_DISPLAY_NAMES = {
  total: 'Total',
  education_level_mod_name: 'Etapa',
  location_name: 'Localidade',
  age_range_name: 'Faixa Etária'
};

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

// Verifica se o tipo de dados deve ser formatado como porcentagem
const isRatioType = (type) => RATIO_TYPES.includes(type);

// Verifica se os dados estão vazios
const hasNoData = (data) => {
  return !Array.isArray(data?.result) || data.result.length === 0;
};

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

// Componente de tabela básica
const BasicTable = ({ headers, data, formatTotal = false, ref }) => {
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
        <Table sx={{ minWidth: 650 }} aria-label="paginated table">
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

const TableRateComponent = ({
  data,
  isEtapaSelected,
  isLocalidadeSelected,
  isHistorical,
  type,
  isFaixaEtariaSelected,
  year,
  title = ''
}) => {
  // Estados para paginação
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Referências para as tabelas e gráfico
  const chartRef = React.useRef(null);
  const tableRefs = {
    historical: React.useRef(null),
    default: React.useRef(null),
    etapa: React.useRef(null),
    localidade: React.useRef(null),
    faixaEtaria: React.useRef(null)
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
                      {isRatioType(type)
                        ? `${Number(yearMap.get(year) || 0).toFixed(2)}%`
                        : yearMap.get(year)}
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
                        {isRatioType(type)
                          ? `${Number(yearMap.get(year) || 0).toFixed(2)}%`
                          : yearMap.get(year) || 0}
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
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                        : item[header]?.toString() || ''}
                    </CenteredTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      default:
        return `Dados por ${filterType}`;
    }
  };

  // Determinar qual tipo de tabela renderizar
  const hasNoFilters = !isEtapaSelected && !isLocalidadeSelected && !isFaixaEtariaSelected;

  // Renderização principal
  return (
    <ThemeProvider theme={theme}>
      <div>
        {isHistorical && (
          <div>
            {renderHistoricalTable()}
          </div>
        )}

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
        {!isHistorical && !hasNoFilters && (
          <>
            {isEtapaSelected && renderSimpleTable('etapa')}
            {isLocalidadeSelected && renderSimpleTable('localidade')}
            {isFaixaEtariaSelected && renderSimpleTable('faixaEtaria')}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default TableRateComponent;
