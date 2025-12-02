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
const RATIO_TYPES = ['liquid_enrollment_ratio', 'gloss_enrollment_ratio', 'rate_school_new'];

// Nota para tabelas de etapa escolar
const ETAPA_ESCOLA_NOTE = "Nota: Ao selecionar etapa e modalidade de oferta ao montar sua consulta, temos os seguintes significados das abreviações: CRE – creche; PRE - pré-escola; EF-AI - Ensino Fundamental - Anos Iniciais; EF-AF - Ensino Fundamental - Anos Finais; MULTIETAPA - Ed. Infantil Unificada/Multietapa/Multissérie/Correção fluxo; EM - Ensino Médio; EJA - Educação de Jovens e Adultos; PROF - Educação Profissional; EE - Educação Especial Exclusivo.";

// Configurações de cabeçalhos para diferentes tipos de tabelas
const HEADERS = {
  // Cabeçalhos padrão
  default: ['total'],

  // Cabeçalhos para município
  municipio: ['municipality_name', 'total'],

  // Cabeçalhos para etapa
  etapa: ['education_level_mod_name', 'total'],

  // Cabeçalhos para localidade
  localidade: ['location_name', 'total'],

  // Cabeçalhos para dependência administrativa
  dependencia: ['adm_dependency_detailed_name', 'total'],

  // Cabeçalhos para vínculo funcional
  vinculo: ['contract_type_name', 'total'],

  // Cabeçalhos para formação docente
  formacaoDocente: ['initial_training_name', 'total'],

  // Cabeçalhos para faixa etária
  faixaEtaria: ['age_range_name', 'total']
};

// Nomes de exibição para cabeçalhos
const HEADER_DISPLAY_NAMES = {
  total: 'Total',
  cityName: 'Município',
  municipality_name: 'Município',
  education_level_mod_name: 'Etapa',
  location_name: 'Localidade',
  adm_dependency_detailed_name: 'Dependência Administrativa',
  contract_type_name: 'Vínculo Funcional',
  initial_training_name: 'Formação Docente',
  age_range_name: 'Faixa Etária'
};

// Configurações para tabelas cruzadas
const CROSS_TABLE_CONFIGS = {
  // Etapa x Localidade
  etapaLocalidade: {
    dataKey: 'byEtapaAndLocalidade',
    config: {
      rowField: 'education_level_mod_name',
      rowIdField: 'education_level_mod_id',
      columnField: 'location_name',
      columnIdField: 'location_id',
      rowHeader: 'Etapa'
    }
  },

  // Etapa x Dependência
  etapaDependencia: {
    dataKey: 'byEtapaAndDependencia',
    config: {
      rowField: 'education_level_mod_name',
      rowIdField: 'education_level_mod_id',
      columnField: 'adm_dependency_detailed_name',
      columnIdField: 'adm_dependency_detailed_id',
      rowHeader: 'Etapa'
    }
  },

  // Localidade x Dependência
  localidadeDependencia: {
    dataKey: 'byLocalidadeAndDependencia',
    config: {
      rowField: 'location_name',
      rowIdField: 'location_id',
      columnField: 'adm_dependency_detailed_name',
      columnIdField: 'adm_dependency_detailed_id',
      rowHeader: 'Localidade'
    }
  },

  // Etapa x Vínculo
  etapaVinculo: {
    dataKey: 'byEtapaAndVinculo',
    config: {
      rowField: 'education_level_mod_name',
      rowIdField: 'education_level_mod_id',
      columnField: 'contract_type_name',
      columnIdField: 'contract_type_id',
      rowHeader: 'Etapa'
    }
  },

  // Localidade x Vínculo
  localidadeVinculo: {
    dataKey: 'byLocalidadeAndVinculo',
    config: {
      rowField: 'location_name',
      rowIdField: 'location_id',
      columnField: 'contract_type_name',
      columnIdField: 'contract_type_id',
      rowHeader: 'Localidade'
    }
  },

  // Dependência x Vínculo
  dependenciaVinculo: {
    dataKey: 'byDependenciaAndVinculo',
    config: {
      rowField: 'adm_dependency_detailed_name',
      rowIdField: 'adm_dependency_detailed_id',
      columnField: 'contract_type_name',
      columnIdField: 'contract_type_id',
      rowHeader: 'Dependência Administrativa'
    }
  },

  // Localidade x Formação Docente
  localidadeFormacaoDocente: {
    dataKey: 'byLocalidadeAndFormacaoDocente',
    config: {
      rowField: 'location_name',
      rowIdField: 'location_id',
      columnField: 'initial_training_name',
      columnIdField: 'initial_training_id',
      rowHeader: 'Localidade'
    }
  },

  // Dependência x Formação Docente
  dependenciaFormacaoDocente: {
    dataKey: 'byDependenciaAndFormacaoDocente',
    config: {
      rowField: 'adm_dependency_detailed_name',
      rowIdField: 'adm_dependency_detailed_id',
      columnField: 'initial_training_name',
      columnIdField: 'initial_training_id',
      rowHeader: 'Dependência Administrativa'
    }
  },

  // Vínculo x Formação Docente
  vinculoFormacaoDocente: {
    dataKey: 'byVinculoAndFormacaoDocente',
    config: {
      rowField: 'contract_type_name',
      rowIdField: 'contract_type_id',
      columnField: 'initial_training_name',
      columnIdField: 'initial_training_id',
      rowHeader: 'Vínculo Funcional'
    }
  },

  // Etapa x Formação Docente
  etapaFormacaoDocente: {
    dataKey: 'byEtapaAndFormacaoDocente',
    config: {
      rowField: 'education_level_mod_name',
      rowIdField: 'education_level_mod_id',
      columnField: 'initial_training_name',
      columnIdField: 'initial_training_id',
      rowHeader: 'Etapa'
    }
  },

  // Município x Etapa
  municipioEtapa: {
    dataKey: 'byMunicipioAndEtapa',
    config: {
      rowField: 'municipality_name',
      rowIdField: 'municipality_id',
      columnField: 'education_level_mod_name',
      columnIdField: 'education_level_mod_id',
      rowHeader: 'Município'
    }
  },

  // Município x Dependência
  municipioDependencia: {
    dataKey: 'byMunicipioAndDependencia',
    config: {
      rowField: 'municipality_name',
      rowIdField: 'municipality_id',
      columnField: 'adm_dependency_detailed_name',
      columnIdField: 'adm_dependency_detailed_id',
      rowHeader: 'Município'
    }
  },

  // Município x Localidade
  municipioLocalidade: {
    dataKey: 'byMunicipioAndLocalidade',
    config: {
      rowField: 'municipality_name',
      rowIdField: 'municipality_id',
      columnField: 'location_name',
      columnIdField: 'location_id',
      rowHeader: 'Município'
    }
  }
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


// Obtém a configuração para tabela cruzada com base nos filtros selecionados
const getCrossTableConfig = (filters, type, year) => {
  const { isEtapaSelected, isLocalidadeSelected, isDependenciaSelected, isVinculoSelected, isFormacaoDocenteSelected, isMunicipioSelected } = filters;

  if (isEtapaSelected && isLocalidadeSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.etapaLocalidade.dataKey,
      ...CROSS_TABLE_CONFIGS.etapaLocalidade.config
    };
  }

  if (isEtapaSelected && isDependenciaSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.etapaDependencia.dataKey,
      ...CROSS_TABLE_CONFIGS.etapaDependencia.config
    };
  }

  if (isLocalidadeSelected && isDependenciaSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.localidadeDependencia.dataKey,
      ...CROSS_TABLE_CONFIGS.localidadeDependencia.config
    };
  }

  if (isEtapaSelected && isVinculoSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.etapaVinculo.dataKey,
      ...CROSS_TABLE_CONFIGS.etapaVinculo.config
    };
  }

  if (isLocalidadeSelected && isVinculoSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.localidadeVinculo.dataKey,
      ...CROSS_TABLE_CONFIGS.localidadeVinculo.config
    };
  }

  if (isDependenciaSelected && isVinculoSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.dependenciaVinculo.dataKey,
      ...CROSS_TABLE_CONFIGS.dependenciaVinculo.config
    };
  }

  if (isLocalidadeSelected && isFormacaoDocenteSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.localidadeFormacaoDocente.dataKey,
      ...CROSS_TABLE_CONFIGS.localidadeFormacaoDocente.config
    };
  }

  if (isDependenciaSelected && isFormacaoDocenteSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.dependenciaFormacaoDocente.dataKey,
      ...CROSS_TABLE_CONFIGS.dependenciaFormacaoDocente.config
    };
  }

  if (isVinculoSelected && isFormacaoDocenteSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.vinculoFormacaoDocente.dataKey,
      ...CROSS_TABLE_CONFIGS.vinculoFormacaoDocente.config
    };
  }

  if (isEtapaSelected && isFormacaoDocenteSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.etapaFormacaoDocente.dataKey,
      ...CROSS_TABLE_CONFIGS.etapaFormacaoDocente.config
    };
  }

  // Configurações com municipality
  if (isMunicipioSelected && isEtapaSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.municipioEtapa.dataKey,
      ...CROSS_TABLE_CONFIGS.municipioEtapa.config
    };
  }

  if (isMunicipioSelected && isDependenciaSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.municipioDependencia.dataKey,
      ...CROSS_TABLE_CONFIGS.municipioDependencia.config
    };
  }

  if (isMunicipioSelected && isLocalidadeSelected) {
    return {
      dataKey: CROSS_TABLE_CONFIGS.municipioLocalidade.dataKey,
      ...CROSS_TABLE_CONFIGS.municipioLocalidade.config
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

// Verifica se os dados estão vazios
const hasNoData = (data, tableDataArray, municipioDataArray) => {
  const noFilterData = !Array.isArray(data?.result) || data.result.length === 0;
  const noCrossData = !data?.result?.byEtapaAndLocalidade?.length &&
                      !data?.result?.byEtapaAndDependencia?.length &&
                      !data?.result?.byLocalidadeAndDependencia?.length &&
                      !data?.result?.byEtapaAndVinculo?.length &&
                      !data?.result?.byLocalidadeAndVinculo?.length &&
                      !data?.result?.byDependenciaAndVinculo?.length &&
                      !data?.result?.byLocalidadeAndFormacaoDocente?.length &&
                      !data?.result?.byDependenciaAndFormacaoDocente?.length &&
                      !data?.result?.byVinculoAndFormacaoDocente?.length &&
                      !data?.result?.byEtapaAndFormacaoDocente?.length &&
                      !data?.result?.byMunicipioAndLocalidade?.length &&
                      !data?.result?.byMunicipioAndEtapa?.length &&
                      !data?.result?.byMunicipioAndDependencia?.length;

  return noFilterData && noCrossData &&
         tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0) &&
         municipioDataArray.every(arr => !Array.isArray(arr) || arr.length === 0);
};

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

// Componente para renderizar a fonte
const SourceFooter = ({ source = "Laboratório de Dados Educacionais - LDE" }) => (
  <div style={{
    textAlign: 'right',
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic'
  }}>
    Fonte: {source}
  </div>
);

// Componente de tabela básica
const BasicTable = React.forwardRef(({ headers, data, formatTotal = false, sortField = null, showTotal = false, totalValue = 0, showSource = false, usePagination = false, page = 0, rowsPerPage = 10, handleChangePage = null, handleChangeRowsPerPage = null }, ref) => {
  const sortedData = sortField
    ? [...data].sort((a, b) => Number(a[sortField]) - Number(b[sortField]))
    : data;

  // Separar dados paginados e linha de total
  // Verificar se há linha de total nos dados originais
  const totalRow = sortedData.find(item => item.cityName === 'Total' || item.nome === 'Total');
  const dataWithoutTotal = sortedData.filter(item => item.cityName !== 'Total' && item.nome !== 'Total');

  const dataToShow = usePagination
    ? dataWithoutTotal.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  return (
    <>
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
            {dataToShow.map((item, index) => {
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
                        : header === 'total'
                          ? formatNumber(item[header])
                          : item[header]?.toString() || ''}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {/* Linha de total opcional */}
            {showTotal && !usePagination && (
              <TableRow>
                {headers.map(header => (
                  <BoldTableCell key={header}>
                    {header === 'total' && formatTotal
                      ? `${Number(totalValue).toFixed(2)}%`
                      : header === 'total'
                        ? formatNumber(totalValue)
                        : 'Total'}
                  </BoldTableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {usePagination && handleChangePage && handleChangeRowsPerPage && (
        <TablePagination
          component="div"
          count={dataWithoutTotal.length}
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
      )}

      {showSource && <SourceFooter />}
    </>
  );
});

// Componente de tabela com paginação
const PaginatedTable = ({
  headers,
  data,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  formatTotal = false,
  sortField = null,
  note = null,
  ref
}) => {
  const sortedData = sortField
    ? [...data].sort((a, b) => Number(a[sortField]) - Number(b[sortField]))
    : data;

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
            {sortedData
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
        count={sortedData.length}
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
      {note && <p>{note}</p>}

      <SourceFooter />
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
  isEtapaSelected,
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
            {Array.from(uniqueRows.entries())
              .slice(type === 'school/count' && isEtapaSelected ? page * rowsPerPage : 0,
                    type === 'school/count' && isEtapaSelected ? page * rowsPerPage + rowsPerPage : undefined)
              .map(([rowId, rowName]) => (
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
      {type === 'school/count' && isEtapaSelected && (
        <TablePagination
          component="div"
          count={uniqueRows.size}
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
      )}

      <SourceFooter />
    </>
  );
};

const ApiDataTable = ({
  data,
  municipioData,
  isEtapaSelected,
  isLocalidadeSelected,
  isDependenciaSelected,
  isVinculoSelected = false,
  isFormacaoDocenteSelected = false,
  isFaixaEtariaSelected = false,
  isMunicipioSelected = false,
  isHistorical,
  type,
  year,
  title = '',
  showConsolidated = false
}) => {
  // Estados para paginação
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Referências para as tabelas e gráficos
  const chartRef = React.useRef(null);
  const crossChartRef = React.useRef(null);
  const simpleChartRef = React.useRef(null);
  const tableRefs = {
    historical: React.useRef(null),
    default: React.useRef(null),
    municipio: React.useRef(null),
    etapa: React.useRef(null),
    localidade: React.useRef(null),
    dependencia: React.useRef(null),
    vinculo: React.useRef(null),
    formacaoDocente: React.useRef(null),
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

  // Preparação de dados
  const tableDataArray = [data?.result || []];
  const municipioDataArray = municipioData?.map(m => ({
    cityName: m.cityName,
    total: m.result?.[0]?.total || 0,
  }));

  // Verificação de dados vazios
  if (hasNoData(data, tableDataArray, municipioDataArray)) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#6c757d'
        }}>
          Nenhum dado disponível para os filtros selecionados
        </div>
      </ThemeProvider>
    );
  }

  // Renderização de tabela histórica
  const renderHistoricalTable = () => {
    // Se há dados de múltiplas cidades, renderizar cada cidade separadamente
    if (municipioData && Array.isArray(municipioData) && municipioData.length > 0) {
      return (
        <div>
          {municipioData.map((cityData, cityIndex) => {
            const cityName = cityData.cityName || `Cidade ${cityIndex + 1}`;
            const cityResult = cityData.result || [];

            if (!cityResult || cityResult.length === 0) return null;

            // Criar referência específica para esta cidade
            const cityTableRef = React.createRef();
            const cityChartRef = React.createRef();

            return (
              <div key={cityIndex} style={{ marginBottom: '2rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
                  {cityName}
                </h3>
                {renderHistoricalTableForCity(cityResult, cityTableRef, cityChartRef, cityName)}
              </div>
            );
          })}
        </div>
      );
    }

    // Renderização normal para dados consolidados
    return renderHistoricalTableForCity(data.result, tableRefs.historical, chartRef);
  };

  const renderHistoricalTableForCity = (resultData, tableRef, chartRef, cityName = null) => {
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
      if (isDependenciaSelected) {
        return {
          id: 'adm_dependency_detailed_id',
          name: 'adm_dependency_detailed_name',
          label: 'Dependência'
        };
      }
      if (isVinculoSelected) {
        return {
          id: 'contract_type_id',
          name: 'contract_type_name',
          label: 'Vínculo'
        };
      }
      if (isFormacaoDocenteSelected) {
        return {
          id: 'initial_training_id',
          name: 'initial_training_name',
          label: 'Formação Docente'
        };
      }
      if (isFaixaEtariaSelected) {
        return {
          id: 'age_range_id',
          name: 'age_range_name',
          label: 'Faixa Etária'
        };
      }
      if (isMunicipioSelected) {
        return {
          id: 'municipality_id',
          name: 'municipality_name',
          label: 'Município'
        };
      }
      return null;
    };

    const extraColumn = getExtraColumns();

    if (!extraColumn) {
      // Para dados históricos simples (sem filtros)
      const yearMap = new Map();
      resultData.forEach(item => {
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
      let exportHeaders, headerDisplayNames;
      exportHeaders = ['year', 'total'];
      headerDisplayNames = { year: 'Ano', total: 'Total' };

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

          <SourceFooter />

          <TableExport
            data={exportData}
            headers={exportHeaders}
            headerDisplayNames={headerDisplayNames}
            fileName={cityName ? `dados_historicos_${cityName.toLowerCase().replace(/\s+/g, '_')}` : "dados_historicos"}
            tableTitle={cityName ? `Dados Históricos - ${cityName}` : (title || "Dados Históricos")}
            tableRef={tableRef}
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
    resultData.forEach(item => {
      const year = item.year;
      const categoryName = item[extraColumn.name];
      const categoryId = item[extraColumn.id];
      years.add(year);

      // CORREÇÃO: Agrupar apenas por ID
      const categoryKey = categoryId;
      categories.add(categoryKey);
      categoryIds.set(categoryKey, categoryId);

      if (!categoryYearMap.has(categoryKey)) {
        categoryYearMap.set(categoryKey, new Map());
      }

      // Somar valores se já existir dados para este ID+ano
      const currentTotal = categoryYearMap.get(categoryKey).get(year) || 0;
      categoryYearMap.get(categoryKey).set(year, currentTotal + (Number(item.total) || 0));
    });

    // Converter Set para Array e ordenar
    const sortedYears = [...years].sort((a, b) => a - b);

    const sortedCategories = [...categories].sort((a, b) => {
      return Number(categoryIds.get(a)) - Number(categoryIds.get(b));
    });

    // Preparar dados para exportação
    const exportData = [];
    sortedCategories.forEach(categoryId => {
      // Buscar o nome da categoria nos dados originais
      const categoryItem = resultData.find(item => item[extraColumn.id] == categoryId);
      const categoryName = categoryItem ? categoryItem[extraColumn.name] : `ID ${categoryId}`;
      const row = { [extraColumn.label]: categoryName };
      sortedYears.forEach(year => {
        row[year] = categoryYearMap.get(categoryId)?.get(year) || 0;
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
              {sortedCategories
                .slice(
                  (type === 'school/count' && isEtapaSelected) || isMunicipioSelected ? page * rowsPerPage : 0,
                  (type === 'school/count' && isEtapaSelected) || isMunicipioSelected ? page * rowsPerPage + rowsPerPage : undefined
                )
                .map(categoryId => {
                  const yearMap = categoryYearMap.get(categoryId);
                  // Buscar o nome da categoria nos dados originais
                  const categoryItem = resultData.find(item => item[extraColumn.id] == categoryId);
                  const categoryName = categoryItem ? categoryItem[extraColumn.name] : `ID ${categoryId}`;

                  return (
                    <TableRow key={categoryId}>
                      <CenteredTableCell>{categoryName}</CenteredTableCell>
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

        {((type === 'school/count' && isEtapaSelected) || isMunicipioSelected) && (
          <TablePagination
            component="div"
            count={sortedCategories.length}
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
        )}
        {type === 'school/count' && isEtapaSelected && (
          <p>{ETAPA_ESCOLA_NOTE}</p>
        )}

        <SourceFooter />

        {!(type === 'school/count' && isEtapaSelected) && !isMunicipioSelected && (
          <div ref={chartRef}>
            <HistoricalChart
              data={{ result: resultData }}
              type={type}
              isEtapaSelected={isEtapaSelected}
              isLocalidadeSelected={isLocalidadeSelected}
              isDependenciaSelected={isDependenciaSelected}
              isVinculoSelected={isVinculoSelected}
              isFormacaoDocenteSelected={isFormacaoDocenteSelected}
              isFaixaEtariaSelected={isFaixaEtariaSelected}
              isMunicipioSelected={isMunicipioSelected}
            />
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          <TableExport
            data={exportData}
            headers={exportHeaders}
            headerDisplayNames={headerDisplayNames}
            fileName={cityName ? `dados_historicos_${cityName.toLowerCase().replace(/\s+/g, '_')}` : "dados_historicos"}
            tableTitle={cityName ? `Dados Históricos - ${cityName}` : (title || "Dados Históricos")}
            tableRef={tableRef}
            chartRef={chartRef}
          />
        </div>
      </div>
    );
  };

  // Função para gerar título correto para combinações de filtros
  const getCrossTableTitle = () => {
    const selectedFilters = [];
    if (isEtapaSelected) selectedFilters.push('Etapa');
    if (isLocalidadeSelected) selectedFilters.push('Localidade');
    if (isDependenciaSelected) selectedFilters.push('Dependência');
    if (isVinculoSelected) selectedFilters.push('Vínculo');
    if (isFormacaoDocenteSelected) selectedFilters.push('Formação Docente');
    if (isFaixaEtariaSelected) selectedFilters.push('Faixa Etária');
    if (isMunicipioSelected) selectedFilters.push('Município');

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

  // Renderização de tabela cruzada
  const renderCrossTable = (tempData = null, tempConfig = null) => {
    const filters = { isEtapaSelected, isLocalidadeSelected, isDependenciaSelected, isVinculoSelected, isFormacaoDocenteSelected, isMunicipioSelected };
    const config = tempConfig || getCrossTableConfig(filters, type, year);

    if (!config) return null;

    const dataSource = tempData || data;
    const crossedData = dataSource?.result?.[config.dataKey] || [];

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
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto', border: '2px solid #ccc', borderRadius: '4px' }} ref={tableRefs.cross}>
          <Table sx={{ minWidth: 650 }} aria-label="combined table" style={{ backgroundColor: theme.palette.background.default }}>
            <StyledTableHead>
              <TableRow>
                <BoldTableCell>{config.rowHeader}</BoldTableCell>
                {Array.from(uniqueColumns.entries()).map(([id, name]) => (
                  <BoldTableCell key={id}>{name}</BoldTableCell>
                ))}
                <BoldTableCell>Total</BoldTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {Array.from(uniqueRows.entries())
                .slice(type === 'school/count' && isEtapaSelected ? page * rowsPerPage : 0,
                      type === 'school/count' && isEtapaSelected ? page * rowsPerPage + rowsPerPage : undefined)
                .map(([rowId, rowName]) => (
                  <TableRow key={rowId}>
                    <CenteredTableCell>{rowName}</CenteredTableCell>
                    {Array.from(uniqueColumns.keys()).map(columnId => (
                      <CenteredTableCell key={columnId}>
                        {isRatioType(type)
                          ? `${Number(cellValues.get(`${rowId}-${columnId}`) || 0).toFixed(2)}%`
                          : formatNumber(cellValues.get(`${rowId}-${columnId}`) || 0)}
                      </CenteredTableCell>
                    ))}
                    <CenteredTableCell>{formatNumber(rowTotals.get(rowId))}</CenteredTableCell>
                  </TableRow>
                ))}
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
            </TableBody>
          </Table>
        </TableContainer>

        <SourceFooter />

        {/* Adicionar gráficos para tabelas cruzadas */}
        {!(type === 'school/count' && isEtapaSelected) && !isMunicipioSelected && renderCrossTableCharts(uniqueRows, uniqueColumns, cellValues, config.rowHeader)}

        <TableExport
          data={exportData}
          headers={exportHeaders}
          headerDisplayNames={headerDisplayNames}
          fileName="dados_cruzados"
          tableTitle={title || "Dados Cruzados"}
          tableRef={tableRefs.cross}
          chartRef={crossChartRef}
        />
        {type === 'school/count' && isEtapaSelected && (
          <TablePagination
            component="div"
            count={uniqueRows.size}
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
        )}
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
        case 'dependencia':
          return 'adm_dependency_detailed_name';
        case 'vinculo':
          return 'contract_type_name';
        case 'formacaoDocente':
          return 'initial_training_name';
        case 'faixaEtaria':
          return 'age_range_name';
        case 'municipio':
          return 'municipality_name';
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

  // Renderização de tabela simples
  const renderSimpleTable = (filterType) => {
    let headers, tableData, sortField, formatTotal, usePagination = false, note = null;

    switch (filterType) {
      case 'etapa':
        headers = HEADERS.etapa;
        tableData = data.result;
        usePagination = type === 'school/count';
        note = type === 'school/count' ? ETAPA_ESCOLA_NOTE : null;
        break;

      case 'localidade':
        headers = HEADERS.localidade;
        tableData = data.result;
        break;

      case 'dependencia':
        headers = HEADERS.dependencia;
        tableData = data.result;
        sortField = 'adm_dependency_detailed_id';
        formatTotal = isRatioType(type);
        break;

      case 'vinculo':
        headers = HEADERS.vinculo;
        tableData = data.result;
        sortField = 'contract_type_id';
        formatTotal = isRatioType(type);
        break;

      case 'formacaoDocente':
        headers = HEADERS.formacaoDocente;
        tableData = data.result;
        sortField = 'initial_training_id';
        formatTotal = isRatioType(type);
        break;

      case 'faixaEtaria':
        headers = HEADERS.faixaEtaria;
        tableData = data.result;
        sortField = 'age_range_id';
        formatTotal = true;
        break;

      case 'municipio':
        headers = HEADERS.municipio;
        tableData = data.result;
        sortField = 'municipality_id';
        formatTotal = false;
        usePagination = true;
        break;

      default:
        return null;
    }

    // Calcular total para adicionar linha de total
    const totalValue = tableData.reduce((sum, item) => sum + Number(item.total || 0), 0);

    // Preparar dados para exportação incluindo linha de total
    const exportData = tableData.map(item => {
      const row = {};
      headers.forEach(header => {
        row[header] = item[header];
      });
      return row;
    });

    // Adicionar linha de total aos dados de exportação
    const totalRow = {};
    headers.forEach(header => {
      if (header === 'total') {
        totalRow[header] = totalValue;
      } else {
        totalRow[header] = 'Total';
      }
    });
    exportData.push(totalRow);

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
              {tableData
                .slice(
                  (type === 'school/count' && isEtapaSelected) || filterType === 'municipio' ? page * rowsPerPage : 0,
                  (type === 'school/count' && isEtapaSelected) || filterType === 'municipio' ? page * rowsPerPage + rowsPerPage : undefined
                )
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
              {/* Linha de total - não mostrar quando há paginação para município */}
              {!(filterType === 'municipio' && usePagination) && (
                <TableRow>
                  {headers.map(header => (
                    <BoldTableCell key={header}>
                      {header === 'total' && formatTotal
                        ? `${Number(totalValue).toFixed(2)}%`
                        : header === 'total'
                          ? formatNumber(totalValue)
                          : 'Total'}
                    </BoldTableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {usePagination && (
          <TablePagination
            component="div"
            count={tableData.length}
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
        )}

        {note && (
          <div style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#333',
            lineHeight: '1.4'
          }}>
            {note}
          </div>
        )}

        <SourceFooter />

        {/* Adicionar gráficos para tabelas simples */}
        {!(type === 'school/count' && filterType === 'etapa') && filterType !== 'municipio' && renderSimpleTableCharts(filterType, tableData)}

        <TableExport
          data={exportData}
          headers={exportHeaders}
          headerDisplayNames={headerDisplayNames}
          fileName={`dados_por_${filterType}`}
          tableTitle={title || getTableTitle(filterType)}
          tableRef={tableRefs[filterType]}
          chartRef={simpleChartRef}
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
      case 'dependencia':
        return 'Dados por Dependência Administrativa';
      case 'vinculo':
        return 'Dados por Vínculo Funcional';
      case 'formacaoDocente':
        return 'Dados por Formação Docente';
      case 'faixaEtaria':
        return 'Dados por Faixa Etária';
      case 'municipio':
        return 'Dados por Município';
      default:
        return `Dados por ${filterType}`;
    }
  };

  // Função para determinar headers baseado nos filtros selecionados
  const getHeadersForCityData = () => {
    if (isEtapaSelected) return HEADERS.etapa;
    if (isLocalidadeSelected) return HEADERS.localidade;
    if (isDependenciaSelected) return HEADERS.dependencia;
    if (isMunicipioSelected) return HEADERS.municipio;
    return HEADERS.default;
  };

  // Função para consolidar dados mantendo categorias separadas
  const consolidateDataByCategory = () => {
    if (!municipioData || municipioData.length === 0) return [];

    // Determinar qual campo usar baseado no filtro selecionado
    const getCategoryField = () => {
      if (isEtapaSelected) return 'education_level_mod_name';
      if (isLocalidadeSelected) return 'location_name';
      if (isDependenciaSelected) return 'adm_dependency_detailed_name';
      if (isVinculoSelected) return 'contract_type_name';
      if (isFormacaoDocenteSelected) return 'initial_training_name';
      if (isFaixaEtariaSelected) return 'age_range_name';
      if (isMunicipioSelected) return 'municipality_name';
      return 'total';
    };

    const categoryField = getCategoryField();
    const consolidatedMap = new Map();

    // Consolidar dados de todas as cidades
    municipioData.forEach(cityData => {
      const cityResult = cityData.result || [];
      cityResult.forEach(item => {
        const category = item[categoryField] || 'N/A';
        const total = Number(item.total) || 0;

        if (consolidatedMap.has(category)) {
          consolidatedMap.set(category, consolidatedMap.get(category) + total);
        } else {
          consolidatedMap.set(category, total);
        }
      });
    });

    // Converter Map para array
    return Array.from(consolidatedMap.entries()).map(([category, total]) => ({
      [categoryField]: category,
      total: total
    }));
  };

  // Função para renderizar dados individuais por cidade
  const renderIndividualCityData = () => {
    if (!municipioData || municipioData.length === 0) return null;

    const headers = getHeadersForCityData();

    return (
      <div>
        {municipioData.map((cityData, index) => {
          const cityName = cityData.cityName || `Cidade ${index + 1}`;
          const cityResult = cityData.result || [];

          if (!cityResult || cityResult.length === 0) return null;

          // Criar referências específicas para esta cidade
          const cityTableRef = React.createRef();
          const cityChartRef = React.createRef();

          // Se há cross filters, renderizar tabela cruzada para esta cidade
          if (hasCrossFilters) {
            const filters = { isEtapaSelected, isLocalidadeSelected, isDependenciaSelected, isVinculoSelected, isFormacaoDocenteSelected, isMunicipioSelected };
            const config = getCrossTableConfig(filters, type, year);

            if (!config) return null;

            // Criar objeto data temporário com os dados desta cidade
            const tempData = {
              result: {
                [config.dataKey]: cityResult
              }
            };

            return (
              <div key={index} style={{ marginBottom: '2rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
                  {cityName}
                </h3>
                {renderCrossTable(tempData, config)}
              </div>
            );
          }

          return (
            <div key={index} style={{ marginBottom: '2rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
                {cityName}
              </h3>

              {/* Renderizar tabela para esta cidade */}
              <BasicTable
                headers={headers}
                data={cityResult}
                formatTotal={isRatioType(type)}
                showTotal={true}
                totalValue={cityResult.reduce((sum, it) => sum + Number(it.total || 0), 0)}
                showSource={true}
                ref={cityTableRef}
              />

              {/* Gráfico para esta cidade */}
              {cityResult.length > 0 && !isMunicipioSelected && (
                <div style={{ marginTop: '1rem' }} ref={cityChartRef}>
                  <EnhancedPieChart
                    data={cityResult.map(item => ({
                      name: item.education_level_mod_name || item.location_name || item.adm_dependency_detailed_name || item.contract_type_name || item.initial_training_name || item.age_range_name || item.municipality_name || 'N/A',
                      value: Number(item.total) || 0
                    }))}
                    title={`Distribuição - ${cityName}`}
                    height={400}
                  />
                </div>
              )}

              {/* Exportação para esta cidade */}
              <TableExport
                data={cityResult}
                headers={headers}
                headerDisplayNames={HEADER_DISPLAY_NAMES}
                fileName={`dados_${cityName.toLowerCase().replace(/\s+/g, '_')}`}
                tableTitle={`Dados - ${cityName}`}
                tableRef={cityTableRef}
                chartRef={cityChartRef}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Determinar qual tipo de tabela renderizar
  const hasCrossFilters = (
    (isEtapaSelected && isLocalidadeSelected) ||
    (isEtapaSelected && isDependenciaSelected) ||
    (isLocalidadeSelected && isDependenciaSelected) ||
    (isMunicipioSelected && isEtapaSelected) ||
    (isMunicipioSelected && isDependenciaSelected) ||
    (isMunicipioSelected && isLocalidadeSelected)
  );

  const hasNoFilters = !isEtapaSelected && !isLocalidadeSelected && !isDependenciaSelected && !isMunicipioSelected;

  // Verificar se há dados de múltiplas cidades (filtros territoriais)
  const hasMultipleCities = municipioData && municipioData.length > 0;

  // Verificar se há filtros territoriais combinados com outros filtros
  const hasTerritorialWithOtherFilters = hasMultipleCities && (isEtapaSelected || isLocalidadeSelected || isDependenciaSelected || isMunicipioSelected);


  // Renderização principal
  return (
    <ThemeProvider theme={theme}>
      <div>
            {/* Série Histórica - Dados individuais por cidade */}
            {isHistorical && hasTerritorialWithOtherFilters && !showConsolidated && (
              <div>
                {renderHistoricalTable()}
              </div>
            )}

            {/* Série Histórica - Dados consolidados */}
            {isHistorical && hasTerritorialWithOtherFilters && showConsolidated && (
              <div>
                {renderHistoricalTableForCity(data.result, tableRefs.historical, chartRef)}
              </div>
            )}

            {/* Série Histórica - Sem filtros territoriais */}
            {isHistorical && !hasTerritorialWithOtherFilters && (
              <div>
                {renderHistoricalTable()}
              </div>
            )}

            {/* Tabela cruzada consolidada - apenas quando não há filtros territoriais OU quando toggle está ativado */}
            {!isHistorical && hasCrossFilters && (!hasTerritorialWithOtherFilters || showConsolidated) && renderCrossTable()}

        {/* Dados individuais por cidade (quando há filtros territoriais combinados com outros filtros e não está em modo consolidado) */}
        {!isHistorical && hasTerritorialWithOtherFilters && !showConsolidated && municipioDataArray.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {renderIndividualCityData()}
          </div>
        )}

        {/* Dados consolidados (quando há filtros territoriais combinados com outros filtros e está em modo consolidado) */}
        {!isHistorical && hasTerritorialWithOtherFilters && showConsolidated && municipioDataArray.length > 0 && !hasCrossFilters && (
          <div style={{ marginTop: '2rem' }}>
            {/* Tabela consolidada por categoria */}
            <div>
              <BasicTable
                headers={getHeadersForCityData()}
                data={consolidateDataByCategory()}
                formatTotal={isRatioType(type)}
                showSource={true}
                ref={tableRefs.default}
              />

              {/* Gráfico para dados consolidados */}
              {consolidateDataByCategory().length > 0 && !isMunicipioSelected && (
                <div style={{ marginTop: '1rem' }}>
                  <EnhancedPieChart
                    data={consolidateDataByCategory().map(item => {
                      // Determinar qual campo usar baseado no filtro selecionado
                      let name = 'N/A';
                      if (isEtapaSelected) name = item.education_level_mod_name;
                      else if (isLocalidadeSelected) name = item.location_name;
                      else if (isDependenciaSelected) name = item.adm_dependency_detailed_name;
                      else if (isVinculoSelected) name = item.contract_type_name;
                      else if (isFormacaoDocenteSelected) name = item.initial_training_name;
                      else if (isFaixaEtariaSelected) name = item.age_range_name;
                      else if (isMunicipioSelected) name = item.municipality_name;

                      return {
                        name: name || 'N/A',
                        value: Number(item.total) || 0
                      };
                    })}
                    title="Distribuição Consolidada"
                    height={500}
                  />
                </div>
              )}

              <TableExport
                data={consolidateDataByCategory()}
                headers={getHeadersForCityData()}
                headerDisplayNames={HEADER_DISPLAY_NAMES}
                fileName="dados_consolidados"
                tableTitle={title || "Dados Consolidados"}
                tableRef={tableRefs.default}
              />
            </div>
          </div>
        )}

        {/* Tabela simples (sem filtros) */}
        {!isHistorical && hasNoFilters && (
          <>
            {/* Tabela de dados gerais */}
            {municipioDataArray.length === 0 && tableDataArray.map((tableData, index) => (
              <div key={index}>
                <BasicTable
                  headers={HEADERS.default}
                  data={tableData}
                  formatTotal={isRatioType(type)}
                  showSource={true}
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

            {/* Tabela de municípios consolidada */}
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
                  showSource={true}
                  usePagination={true}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
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
        {!isHistorical && !hasCrossFilters && !hasMultipleCities && (
          <>
            {isEtapaSelected && renderSimpleTable('etapa')}
            {isLocalidadeSelected && renderSimpleTable('localidade')}
            {isDependenciaSelected && renderSimpleTable('dependencia')}
            {isMunicipioSelected && renderSimpleTable('municipio')}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default ApiDataTable;