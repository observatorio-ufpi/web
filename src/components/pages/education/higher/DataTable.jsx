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

// Componente para renderizar a fonte
const SourceFooter = ({ source = "Microdados do Censo da Educação Superior/INEP" }) => (
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

  const HEADERS = {
    // Cabeçalhos padrão
    default: ['total'],

    municipio: ['cityName', 'total'],
    municipioApi: ['municipality_name', 'total'],
    modalidade: ['upper_education_mod_name', 'total'],
    regimeDeTrabalho: ['work_regime_name', 'total'],
    formacaoDocente: ['initial_training_name', 'total'],
    categoriaAdministrativa: ['upper_adm_dependency_name', 'total'],
    faixaEtariaSuperior: ['age_student_code_name', 'total'],
    organizacaoAcademica: ['academic_level_name', 'total'],
    instituicaoEnsino: ['institution_name', 'total']
  };

  const HEADER_DISPLAY_NAMES = {
    total: 'Total',
    cityName: 'Município',
    municipality_name: 'Município',
    upper_education_mod_name: 'Modalidade',
    work_regime_name: 'Regime de Trabalho',
    initial_training_name: 'Formação Docente',
    upper_adm_dependency_name: 'Categoria Administrativa',
    age_student_code_name: 'Faixa Etária',
    academic_level_name: 'Organização Acadêmica',
    institution_name: 'Instituição de Ensino'
  };

  const CROSS_TABLE_CONFIGS = {
    modalidadeFaixaEtariaSuperior: {
      dataKey: 'byModalidadeAndFaixaEtariaSuperior',
      configs: {
        rowField: 'upper_education_mod_name',
        rowIdField: 'upper_education_mod_id',
        columnField: 'age_student_code_name',
        columnIdField: 'age_student_code_id',
        rowHeader: 'Modalidade'
      }
    },
    modalidadeOrganizacaoAcademica: {
      dataKey: 'byModalidadeAndOrganizacaoAcademica',
      configs: {
        rowField: 'upper_education_mod_name',
        rowIdField: 'upper_education_mod_id',
        columnField: 'academic_level_name',
        columnIdField: 'academic_level_id',
        rowHeader: 'Modalidade'
      }
    },
    modalidadeCategoriaAdministrativa: {
      dataKey: 'byModalidadeAndCategoriaAdministrativa',
      configs: {
        rowField: 'upper_education_mod_name',
        rowIdField: 'upper_education_mod_id',
        columnField: 'upper_adm_dependency_name',
        columnIdField: 'upper_adm_dependency_id',
        rowHeader: 'Modalidade'
      }
    },
    categoriaAdministrativaFaixaEtariaSuperior: {
      dataKey: 'byCategoriaAdministrativaAndFaixaEtariaSuperior',
      configs: {
        rowField: 'upper_adm_dependency_name',
        rowIdField: 'upper_adm_dependency_id',
        columnField: 'age_student_code_name',
        columnIdField: 'age_student_code_id',
        rowHeader: 'Categoria Administrativa'
      }
    },
    categoriaAdministrativaOrganizacaoAcademica: {
      dataKey: 'byCategoriaAdministrativaAndOrganizacaoAcademica',
      configs: {
        rowField: 'upper_adm_dependency_name',
        rowIdField: 'upper_adm_dependency_id',
        columnField: 'academic_level_name',
        columnIdField: 'academic_level_id',
        rowHeader: 'Categoria Administrativa'
      }
    },
    organizacaoAcademicaFaixaEtariaSuperior: {
      dataKey: 'byOrganizacaoAcademicaAndFaixaEtariaSuperior',
      configs: {
        rowField: 'academic_level_name',
        rowIdField: 'academic_level_id',
        columnField: 'age_student_code_name',
        columnIdField: 'age_student_code_id',
        rowHeader: 'Organização Acadêmica'
      }
    },
    categoriaAdministrativaRegime: {
      dataKey: 'byCategoriaAdministrativaAndRegime',
      configs: {
        rowField: 'upper_adm_dependency_name',
        rowIdField: 'upper_adm_dependency_id',
        columnField: 'work_regime_name',
        columnIdField: 'work_regime_id',
        rowHeader: 'Categoria Administrativa'
      }
    },
    categoriaAdministrativaFormacaoDocente: {
      dataKey: 'byCategoriaAdministrativaAndFormacaoDocente',
      configs: {
        rowField: 'upper_adm_dependency_name',
        rowIdField: 'upper_adm_dependency_id',
        columnField: 'initial_training_name',
        columnIdField: 'initial_training_id',
        rowHeader: 'Categoria Administrativa'
      }
    },
    organizacaoAcademicaRegime: {
      dataKey: 'byOrganizacaoAcademicaAndRegime',
      configs: {
        rowField: 'academic_level_name',
        rowIdField: 'academic_level_id',
        columnField: 'work_regime_name',
        columnIdField: 'work_regime_id',
        rowHeader: 'Organização Acadêmica'
      }
    },
    organizacaoAcademicaFormacaoDocente: {
      dataKey: 'byOrganizacaoAcademicaAndFormacaoDocente',
      configs: {
        rowField: 'academic_level_name',
        rowIdField: 'academic_level_id',
        columnField: 'initial_training_name',
        columnIdField: 'initial_training_id',
        rowHeader: 'Organização Acadêmica'
      }
    },
    // Novas combinações envolvendo Instituição de Ensino
    instituicaoEnsinoModalidade: {
      dataKey: 'byInstitutionAndModalidade',
      configs: {
        rowField: 'institution_name',
        rowIdField: 'institution_id',
        columnField: 'upper_education_mod_name',
        columnIdField: 'upper_education_mod_id',
        rowHeader: 'Instituição de Ensino',
      },
    },
    instituicaoEnsinoCategoriaAdministrativa: {
      dataKey: 'byInstitutionAndCategoriaAdministrativa',
      configs: {
        rowField: 'institution_name',
        rowIdField: 'institution_id',
        columnField: 'upper_adm_dependency_name',
        columnIdField: 'upper_adm_dependency_id',
        rowHeader: 'Instituição de Ensino',
      },
    },
    instituicaoEnsinoOrganizacaoAcademica: {
      dataKey: 'byInstitutionAndOrganizacaoAcademica',
      configs: {
        rowField: 'institution_name',
        rowIdField: 'institution_id',
        columnField: 'academic_level_name',
        columnIdField: 'academic_level_id',
        rowHeader: 'Instituição de Ensino',
      },
    },
    instituicaoEnsinoFaixaEtariaSuperior: {
      dataKey: 'byInstitutionAndFaixaEtariaSuperior',
      configs: {
        rowField: 'institution_name',
        rowIdField: 'institution_id',
        columnField: 'age_student_code_name',
        columnIdField: 'age_student_code_id',
        rowHeader: 'Instituição de Ensino',
      },
    },
    // Combinações envolvendo Município
    municipioModalidade: {
      dataKey: 'byMunicipioAndModalidade',
      configs: {
        rowField: 'municipality_name',
        rowIdField: 'municipality_id',
        columnField: 'upper_education_mod_name',
        columnIdField: 'upper_education_mod_id',
        rowHeader: 'Município',
      },
    },
    municipioCategoriaAdministrativa: {
      dataKey: 'byMunicipioAndCategoriaAdministrativa',
      configs: {
        rowField: 'municipality_name',
        rowIdField: 'municipality_id',
        columnField: 'upper_adm_dependency_name',
        columnIdField: 'upper_adm_dependency_id',
        rowHeader: 'Município',
      },
    },
    municipioOrganizacaoAcademica: {
      dataKey: 'byMunicipioAndOrganizacaoAcademica',
      configs: {
        rowField: 'municipality_name',
        rowIdField: 'municipality_id',
        columnField: 'academic_level_name',
        columnIdField: 'academic_level_id',
        rowHeader: 'Município',
      },
    },
    municipioFaixaEtariaSuperior: {
      dataKey: 'byMunicipioAndFaixaEtariaSuperior',
      configs: {
        rowField: 'municipality_name',
        rowIdField: 'municipality_id',
        columnField: 'age_student_code_name',
        columnIdField: 'age_student_code_id',
        rowHeader: 'Município',
      },
    },
  };

  const getCrossTableConfig = (filters) => {
    const { isModalidadeSelected, isRegimeSelected, isFormacaoDocenteSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected, isInstituicaoEnsinoSelected, isMunicipioSelected } = filters;

    if (isModalidadeSelected && isFaixaEtariaSuperiorSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.modalidadeFaixaEtariaSuperior.dataKey,
        ...CROSS_TABLE_CONFIGS.modalidadeFaixaEtariaSuperior.configs}
    }
    if (isModalidadeSelected && isOrganizacaoAcademicaSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.modalidadeOrganizacaoAcademica.dataKey,
        ...CROSS_TABLE_CONFIGS.modalidadeOrganizacaoAcademica.configs}
    }
    if (isModalidadeSelected && isCategoriaAdministrativaSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.modalidadeCategoriaAdministrativa.dataKey,
        ...CROSS_TABLE_CONFIGS.modalidadeCategoriaAdministrativa.configs}
    }
    if (isCategoriaAdministrativaSelected && isFaixaEtariaSuperiorSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaFaixaEtariaSuperior.dataKey,
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaFaixaEtariaSuperior.configs}
    }
    if (isCategoriaAdministrativaSelected && isOrganizacaoAcademicaSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaOrganizacaoAcademica.dataKey,
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaOrganizacaoAcademica.configs}
    }
    if (isOrganizacaoAcademicaSelected && isFaixaEtariaSuperiorSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.organizacaoAcademicaFaixaEtariaSuperior.dataKey,
        ...CROSS_TABLE_CONFIGS.organizacaoAcademicaFaixaEtariaSuperior.configs}
    }
    // Combinações com Instituição de Ensino
    if (isInstituicaoEnsinoSelected && isModalidadeSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.instituicaoEnsinoModalidade.dataKey, ...CROSS_TABLE_CONFIGS.instituicaoEnsinoModalidade.configs };
    }
    if (isInstituicaoEnsinoSelected && isCategoriaAdministrativaSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.instituicaoEnsinoCategoriaAdministrativa.dataKey, ...CROSS_TABLE_CONFIGS.instituicaoEnsinoCategoriaAdministrativa.configs };
    }
    if (isInstituicaoEnsinoSelected && isOrganizacaoAcademicaSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.instituicaoEnsinoOrganizacaoAcademica.dataKey, ...CROSS_TABLE_CONFIGS.instituicaoEnsinoOrganizacaoAcademica.configs };
    }
    if (isInstituicaoEnsinoSelected && isFaixaEtariaSuperiorSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.instituicaoEnsinoFaixaEtariaSuperior.dataKey, ...CROSS_TABLE_CONFIGS.instituicaoEnsinoFaixaEtariaSuperior.configs };
    }
    // Combinações com Município
    if (isMunicipioSelected && isModalidadeSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.municipioModalidade.dataKey, ...CROSS_TABLE_CONFIGS.municipioModalidade.configs };
    }
    if (isMunicipioSelected && isCategoriaAdministrativaSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.municipioCategoriaAdministrativa.dataKey, ...CROSS_TABLE_CONFIGS.municipioCategoriaAdministrativa.configs };
    }
    if (isMunicipioSelected && isOrganizacaoAcademicaSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.municipioOrganizacaoAcademica.dataKey, ...CROSS_TABLE_CONFIGS.municipioOrganizacaoAcademica.configs };
    }
    if (isMunicipioSelected && isFaixaEtariaSuperiorSelected) {
      return { dataKey: CROSS_TABLE_CONFIGS.municipioFaixaEtariaSuperior.dataKey, ...CROSS_TABLE_CONFIGS.municipioFaixaEtariaSuperior.configs };
    }
    if (isCategoriaAdministrativaSelected && isRegimeSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaRegime.dataKey,
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaRegime.configs}
    }
    if (isCategoriaAdministrativaSelected && isFormacaoDocenteSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaFormacaoDocente.dataKey,
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaFormacaoDocente.configs}
    }
    if (isOrganizacaoAcademicaSelected && isRegimeSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.organizacaoAcademicaRegime.dataKey,
        ...CROSS_TABLE_CONFIGS.organizacaoAcademicaRegime.configs}
    }
    if (isOrganizacaoAcademicaSelected && isFormacaoDocenteSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.organizacaoAcademicaFormacaoDocente.dataKey,
        ...CROSS_TABLE_CONFIGS.organizacaoAcademicaFormacaoDocente.configs}
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

  // Formata números com pontos para separar milhares
  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('pt-BR');
  };

  const hasNoData = (data, tableDataArray, municipioDataArray) => {
    const noFilterData = !Array.isArray(data?.result) || data.result.length === 0;

    // Verificar dados cruzados tanto em data.result quanto em data diretamente
    const noCrossData =
      // Verificar em data.result (estrutura aninhada)
      !data?.result?.byModalidadeAndFaixaEtariaSuperior?.length &&
      !data?.result?.byModalidadeAndOrganizacaoAcademica?.length &&
      !data?.result?.byModalidadeAndCategoriaAdministrativa?.length &&
      !data?.result?.byCategoriaAdministrativaAndFaixaEtariaSuperior?.length &&
      !data?.result?.byCategoriaAdministrativaAndOrganizacaoAcademica?.length &&
      !data?.result?.byOrganizacaoAcademicaAndFaixaEtariaSuperior?.length &&
      !data?.result?.byCategoriaAdministrativaAndRegime?.length &&
      !data?.result?.byCategoriaAdministrativaAndFormacaoDocente?.length &&
      !data?.result?.byOrganizacaoAcademicaAndRegime?.length &&
      !data?.result?.byOrganizacaoAcademicaAndFormacaoDocente?.length &&
      !data?.result?.byInstitutionAndModalidade?.length &&
      !data?.result?.byInstitutionAndCategoriaAdministrativa?.length &&
      !data?.result?.byInstitutionAndOrganizacaoAcademica?.length &&
      !data?.result?.byInstitutionAndFaixaEtariaSuperior?.length &&
      !data?.result?.byMunicipioAndModalidade?.length &&
      !data?.result?.byMunicipioAndCategoriaAdministrativa?.length &&
      !data?.result?.byMunicipioAndOrganizacaoAcademica?.length &&
      !data?.result?.byMunicipioAndFaixaEtariaSuperior?.length &&
      // Verificar em data diretamente (estrutura da API)
      !data?.byModalidadeAndFaixaEtariaSuperior?.length &&
      !data?.byModalidadeAndOrganizacaoAcademica?.length &&
      !data?.byModalidadeAndCategoriaAdministrativa?.length &&
      !data?.byCategoriaAdministrativaAndFaixaEtariaSuperior?.length &&
      !data?.byCategoriaAdministrativaAndOrganizacaoAcademica?.length &&
      !data?.byOrganizacaoAcademicaAndFaixaEtariaSuperior?.length &&
      !data?.byCategoriaAdministrativaAndRegime?.length &&
      !data?.byCategoriaAdministrativaAndFormacaoDocente?.length &&
      !data?.byOrganizacaoAcademicaAndRegime?.length &&
      !data?.byOrganizacaoAcademicaAndFormacaoDocente?.length &&
      !data?.byInstitutionAndModalidade?.length &&
      !data?.byInstitutionAndCategoriaAdministrativa?.length &&
      !data?.byInstitutionAndOrganizacaoAcademica?.length &&
      !data?.byInstitutionAndFaixaEtariaSuperior?.length &&
      !data?.byMunicipioAndModalidade?.length &&
      !data?.byMunicipioAndCategoriaAdministrativa?.length &&
      !data?.byMunicipioAndOrganizacaoAcademica?.length &&
      !data?.byMunicipioAndFaixaEtariaSuperior?.length;

    return noFilterData && noCrossData &&
           tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0) &&
           municipioDataArray.every(arr => !Array.isArray(arr) || arr.length === 0);
  };

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
              {/* Linha de total */}
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

const DataTable = ({
  data,
  municipioData,
  isHistorical,
  type,
  isModalidadeSelected,
  isRegimeSelected,
  isFormacaoDocenteSelected,
  isCategoriaAdministrativaSelected,
  isFaixaEtariaSuperiorSelected,
  isOrganizacaoAcademicaSelected,
  isInstituicaoEnsinoSelected,
  isMunicipioSelected,
  title = '',
  showConsolidated = false
}) => {

  // Estados para paginação
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Referências para as tabelas
  const tableRefs = {
    historical: React.useRef(null),
    default: React.useRef(null),
    municipio: React.useRef(null),
    modalidade: React.useRef(null),
    regimeDeTrabalho: React.useRef(null),
    formacaoDocente: React.useRef(null),
    categoriaAdministrativa: React.useRef(null),
    faixaEtariaSuperior: React.useRef(null),
    organizacaoAcademica: React.useRef(null),
    cross: React.useRef(null)
  };

  const chartRef = React.useRef(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableDataArray = [data?.result || []];

  // Calcular o total correto para cada município somando todos os itens do result
  const municipioDataArray = municipioData?.map(m => {
    const cityResult = m.result || [];
    const totalSum = cityResult.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    return {
      cityName: m.cityName,
      total: totalSum,
    };
  });

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
      if (isFormacaoDocenteSelected) {
        return {
          id: 'initial_training_id',
          name: 'initial_training_name',
          label: 'Formação Docente'
        };
      }
      if (isCategoriaAdministrativaSelected) {
        return {
          id: 'upper_adm_dependency_id',
          name: 'upper_adm_dependency_name',
          label: 'Categoria Administrativa'
        };
      }
      if (isFaixaEtariaSuperiorSelected) {
        return {
          id: 'age_student_code',
          name: 'age_student_code_name',
          label: 'Faixa Etária'
        };
      }
      if (isOrganizacaoAcademicaSelected) {
        return {
          id: 'academic_level',
          name: 'academic_level_name',
          label: 'Organização Acadêmica'
        };
      }
      if (isInstituicaoEnsinoSelected) {
        return {
          id: 'institution_id',
          name: 'institution_name',
          label: 'Instituição de Ensino'
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
      const exportData = sortedYears.map(year => ({ year, total: yearMap.get(year) }));

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
                      {formatNumber(yearMap.get(year))}
                    </CenteredTableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <SourceFooter />

          <TableExport
            data={exportData}
            headers={['year', 'total']}
            headerDisplayNames={{ year: 'Ano', total: 'Total' }}
            fileName={cityName ? `dados_historicos_${cityName.toLowerCase().replace(/\s+/g, '_')}` : "dados_historicos"}
            tableTitle={cityName ? `Dados Históricos - ${cityName}` : (title || "Dados Históricos")}
            tableRef={tableRef}
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
    resultData.forEach(item => {
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
                  isMunicipioSelected ? page * rowsPerPage : 0,
                  isMunicipioSelected ? page * rowsPerPage + rowsPerPage : undefined
                )
                .map(category => {
                  const yearMap = categoryYearMap.get(category);

                  return (
                    <TableRow key={category}>
                      <CenteredTableCell>{category}</CenteredTableCell>
                      {sortedYears.map(year => (
                        <CenteredTableCell key={year}>
                          {formatNumber(yearMap.get(year) || 0)}
                        </CenteredTableCell>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {isMunicipioSelected && (
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

        <SourceFooter />

        {!isInstituicaoEnsinoSelected && !isMunicipioSelected && (
          <div style={{ marginTop: '1rem' }}>
            <HistoricalChart
              data={{ result: resultData }}
              type={type}
              isModalidadeSelected={isModalidadeSelected}
              isRegimeSelected={isRegimeSelected}
              isCategoriaAdministrativaSelected={isCategoriaAdministrativaSelected}
              isFaixaEtariaSuperiorSelected={isFaixaEtariaSuperiorSelected}
              isOrganizacaoAcademicaSelected={isOrganizacaoAcademicaSelected}
              isFormacaoDocenteSelected={isFormacaoDocenteSelected}
            />
          </div>
        )}
        <TableExport
          data={exportData}
          headers={exportHeaders}
          headerDisplayNames={headerDisplayNames}
          fileName={cityName ? `dados_historicos_${cityName.toLowerCase().replace(/\s+/g, '_')}` : `dados_historicos_por_${extraColumn.label.toLowerCase()}`}
          tableTitle={cityName ? `Dados Históricos - ${cityName}` : (title || `Dados Históricos por ${extraColumn.label}`)}
          tableRef={tableRef}
        />
      </div>
    );
  };


  // Renderização de tabela cruzada
const renderCrossTable = (customData = null, customConfig = null) => {
  const filters = { isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected, isInstituicaoEnsinoSelected, isMunicipioSelected };
  const config = customConfig || getCrossTableConfig(filters);

  if (!config) return null;

  const dataSource = customData || data;

  // Tentar acessar os dados cruzados de diferentes formas:
  // 1. dataSource[dataKey] - quando os dados vêm direto da API
  // 2. dataSource.result[dataKey] - quando os dados estão aninhados em result (como objeto)
  // 3. Se result é um array, usar ele diretamente (para dados simples)
  let crossedData = [];
  if (Array.isArray(dataSource?.[config.dataKey])) {
    crossedData = dataSource[config.dataKey];
  } else if (dataSource?.result && !Array.isArray(dataSource.result) && Array.isArray(dataSource.result[config.dataKey])) {
    crossedData = dataSource.result[config.dataKey];
  }

  // Se não há dados cruzados, retornar null
  if (!crossedData || crossedData.length === 0) {
    return null;
  }

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
              .map(([rowId, rowName]) => (
                <TableRow key={rowId}>
                  <CenteredTableCell>{rowName}</CenteredTableCell>
                  {Array.from(uniqueColumns.keys()).map(columnId => (
                    <CenteredTableCell key={columnId}>
                      {formatNumber(cellValues.get(`${rowId}-${columnId}`) || 0)}
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

      {/* Gráficos desabilitados quando há filtro por Instituição de Ensino */}
      {!isInstituicaoEnsinoSelected && !isMunicipioSelected && renderCrossTableCharts(uniqueRows, uniqueColumns, cellValues, config.rowHeader)}

      <TableExport
        data={exportData}
        headers={exportHeaders}
        headerDisplayNames={headerDisplayNames}
        fileName="dados_cruzados"
        tableTitle={title || "Dados Cruzados"}
        tableRef={tableRefs.cross}
      />
    </div>
  );
};

  // Função para renderizar gráficos para tabelas simples
  const renderSimpleTableCharts = (filterType, tableData) => {
    if (filterType === 'instituicaoEnsino' || filterType === 'municipioApi') return null;
    if (!tableData || tableData.length === 0) return null;

    // Mapear os campos corretos para cada tipo de filtro
    const getFieldName = (filterType) => {
      switch (filterType) {
        case 'modalidade':
          return 'upper_education_mod_name';
        case 'regimeDeTrabalho':
          return 'work_regime_name';
        case 'formacaoDocente':
          return 'initial_training_name';
        case 'categoriaAdministrativa':
          return 'upper_adm_dependency_name';
        case 'faixaEtariaSuperior':
          return 'age_student_code_name';
      case 'organizacaoAcademica':
        return 'academic_level_name';
      case 'instituicaoEnsino':
        return 'institution_name';
      case 'municipioApi':
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
      <div style={{ marginTop: '1rem' }}>
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

  // Função para obter título legível para cada tipo de filtro
  const getTableTitle = (filterType) => {
    switch (filterType) {
      case 'modalidade':
        return 'Dados por Modalidade';
      case 'regimeDeTrabalho':
        return 'Dados por Regime de Trabalho';
      case 'formacaoDocente':
        return 'Dados por Formação Docente';
      case 'categoriaAdministrativa':
        return 'Dados por Categoria Administrativa';
      case 'faixaEtariaSuperior':
        return 'Dados por Faixa Etária';
      case 'organizacaoAcademica':
        return 'Dados por Organização Acadêmica';
      case 'instituicaoEnsino':
        return 'Dados por Instituição de Ensino';
      case 'municipioApi':
        return 'Dados por Município';
      default:
        return `Dados por ${filterType}`;
    }
  };

  // Função para determinar headers baseado nos filtros selecionados
  const getHeadersForCityData = () => {
    if (isModalidadeSelected) return HEADERS.modalidade;
    if (isRegimeSelected) return HEADERS.regimeDeTrabalho;
    if (isFormacaoDocenteSelected) return HEADERS.formacaoDocente;
    if (isCategoriaAdministrativaSelected) return HEADERS.categoriaAdministrativa;
    if (isFaixaEtariaSuperiorSelected) return HEADERS.faixaEtariaSuperior;
    if (isOrganizacaoAcademicaSelected) return HEADERS.organizacaoAcademica;
    if (isInstituicaoEnsinoSelected) return HEADERS.instituicaoEnsino;
    if (isMunicipioSelected) return HEADERS.municipioApi;
    return HEADERS.default;
  };

  // Função para consolidar dados mantendo categorias separadas
  const consolidateDataByCategory = () => {
    if (!municipioData || municipioData.length === 0) return [];

    // Determinar qual campo usar baseado no filtro selecionado
    const getCategoryField = () => {
      if (isModalidadeSelected) return 'upper_education_mod_name';
      if (isRegimeSelected) return 'work_regime_name';
      if (isFormacaoDocenteSelected) return 'initial_training_name';
      if (isCategoriaAdministrativaSelected) return 'upper_adm_dependency_name';
      if (isFaixaEtariaSuperiorSelected) return 'age_student_code_name';
      if (isOrganizacaoAcademicaSelected) return 'academic_level_name';
      if (isInstituicaoEnsinoSelected) return 'institution_name';
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

  // Função para consolidar dados cruzados de múltiplas cidades
  const consolidateCrossTableData = () => {
    if (!municipioData || municipioData.length === 0) return null;

    // Primeiro, vamos coletar todos os dados de todas as cidades
    const allData = [];
    municipioData.forEach(cityData => {
      const cityResult = cityData.result || [];
      cityResult.forEach(item => {
        allData.push(item);
      });
    });

    // Agrupar e somar por combinação de dimensões
    const consolidatedMap = new Map();

    allData.forEach(item => {
      // Criar chave única baseada nas dimensões (exceto total)
      let key = '';

      if (isInstituicaoEnsinoSelected) {
        key += `inst_${item.institution_id || 'na'}_${item.institution_name || 'N/A'}`;
      }
      if (isModalidadeSelected) {
        key += `_mod_${item.upper_education_mod_id || 'na'}_${item.upper_education_mod_name || 'N/A'}`;
      }
      if (isCategoriaAdministrativaSelected) {
        key += `_cat_${item.upper_adm_dependency_id || 'na'}_${item.upper_adm_dependency_name || 'N/A'}`;
      }
      if (isOrganizacaoAcademicaSelected) {
        key += `_org_${item.academic_level_id || 'na'}_${item.academic_level_name || 'N/A'}`;
      }
      if (isFaixaEtariaSuperiorSelected) {
        key += `_fx_${item.age_student_code_id || 'na'}_${item.age_student_code_name || 'N/A'}`;
      }
      if (isRegimeSelected) {
        key += `_reg_${item.work_regime_id || 'na'}_${item.work_regime_name || 'N/A'}`;
      }
      if (isFormacaoDocenteSelected) {
        key += `_form_${item.initial_training_id || 'na'}_${item.initial_training_name || 'N/A'}`;
      }
      if (isMunicipioSelected) {
        key += `_mun_${item.municipality_id || 'na'}_${item.municipality_name || 'N/A'}`;
      }

      const total = Number(item.total) || 0;

      if (consolidatedMap.has(key)) {
        const existing = consolidatedMap.get(key);
        existing.total += total;
      } else {
        consolidatedMap.set(key, { ...item, total });
      }
    });

    return Array.from(consolidatedMap.values());
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

          // Se há cross-filters, renderizar tabela cruzada para esta cidade
          if (hasCrossFilters) {
            const filters = { isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected, isInstituicaoEnsinoSelected, isMunicipioSelected };
            const config = getCrossTableConfig(filters);

            if (!config) {
              return null;
            }

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
                showTotal={true}
                totalValue={cityResult.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}
                showSource={true}
                ref={cityTableRef}
              />

              {/* Gráfico para esta cidade */}
              {cityResult.length > 0 && !isInstituicaoEnsinoSelected && !isMunicipioSelected && (
                <div style={{ marginTop: '1rem' }} ref={cityChartRef}>
                  <EnhancedPieChart
                    data={cityResult.map(item => ({
                      name: item.upper_education_mod_name || item.work_regime_name || item.initial_training_name || item.upper_adm_dependency_name || item.age_student_code_name || item.academic_level_name || item.institution_name || 'N/A',
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

    // Se há muitas colunas, usar gráfico de pizza para a primeira linha
    if (uniqueColumns.size > 6) {
      const firstRowData = Array.from(uniqueColumns.entries()).map(([colId, colName]) => ({
        name: colName,
        value: Number(cellValues.get(`${Array.from(uniqueRows.keys())[0]}-${colId}`) || 0)
      }));

      return (
        <div style={{ marginTop: '1rem' }}>
          <EnhancedPieChart
            data={firstRowData}
            title={`Distribuição - ${Array.from(uniqueRows.values())[0]}`}
            height={500}
          />
        </div>
      );
    }

    return (
      <div style={{ marginTop: '1rem' }}>
        <EnhancedBarChart
          data={chartData}
          title={`Comparação por ${rowHeader}`}
          height={500}
          xAxisKey="name"
        />
      </div>
    );
  };

  const renderSimpleTable = (filterType) => {
    let headers, tableData, sortField, formatTotal, usePagination = false, note = null;

    switch (filterType) {
      case 'modalidade':
        headers = HEADERS.modalidade;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'upper_education_mod_id';
        break;
      case 'regimeDeTrabalho':
        headers = HEADERS.regimeDeTrabalho;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'work_regime_id';
        break;
      case 'formacaoDocente':
        headers = HEADERS.formacaoDocente;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'initial_training_id';
        break;
      case 'categoriaAdministrativa':
        headers = HEADERS.categoriaAdministrativa;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'upper_adm_dependency_id';
        break;
      case 'faixaEtariaSuperior':
        headers = HEADERS.faixaEtariaSuperior;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'age_student_code';
        break;
      case 'organizacaoAcademica':
        headers = HEADERS.organizacaoAcademica;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'academic_level';
        break;
      case 'instituicaoEnsino':
        headers = HEADERS.instituicaoEnsino;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'institution_id';
        break;
      case 'municipioApi':
        headers = HEADERS.municipioApi;
        tableData = Array.isArray(data?.result) ? data.result : [];
        sortField = 'municipality_id';
        usePagination = true;
        break;
      default:
        return null;
    }

    // Calcular total para adicionar linha de total
    const safeRows = Array.isArray(tableData) ? tableData : [];
    const totalValue = safeRows.reduce((sum, item) => sum + Number(item.total || 0), 0);

    // Preparar dados para exportação incluindo linha de total
    const exportData = safeRows.map(item => {
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

    return (
      <div>
        <BasicTable
          headers={headers}
          data={tableData}
          sortField={sortField}
          formatTotal={formatTotal}
          showTotal={!usePagination}
          totalValue={totalValue}
          showSource={true}
          usePagination={usePagination}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          ref={tableRefs[filterType]}
        />

        {/* Adicionar gráficos para tabelas simples */}
        {renderSimpleTableCharts(filterType, tableData)}

        <TableExport
          data={exportData}
          headers={headers}
          headerDisplayNames={HEADER_DISPLAY_NAMES}
          fileName={`dados_por_${filterType}`}
          tableTitle={title || getTableTitle(filterType)}
          tableRef={tableRefs[filterType]}
        />
      </div>
    );
  };

  const hasNoFilters = !isModalidadeSelected && !isRegimeSelected && !isFormacaoDocenteSelected && !isCategoriaAdministrativaSelected && !isFaixaEtariaSuperiorSelected && !isOrganizacaoAcademicaSelected && !isInstituicaoEnsinoSelected && !isMunicipioSelected;
  const hasCrossFilters = (
    (isModalidadeSelected && isFaixaEtariaSuperiorSelected) ||
    (isModalidadeSelected && isOrganizacaoAcademicaSelected) ||
    (isModalidadeSelected && isCategoriaAdministrativaSelected) ||
    (isCategoriaAdministrativaSelected && isFaixaEtariaSuperiorSelected) ||
    (isCategoriaAdministrativaSelected && isOrganizacaoAcademicaSelected) ||
    (isOrganizacaoAcademicaSelected && isFaixaEtariaSuperiorSelected) ||
    (isCategoriaAdministrativaSelected && isRegimeSelected) ||
    (isCategoriaAdministrativaSelected && isFormacaoDocenteSelected) ||
    (isOrganizacaoAcademicaSelected && isRegimeSelected) ||
    (isOrganizacaoAcademicaSelected && isFormacaoDocenteSelected) ||
    // Combinações com Instituição de Ensino
    (isInstituicaoEnsinoSelected && isModalidadeSelected) ||
    (isInstituicaoEnsinoSelected && isCategoriaAdministrativaSelected) ||
    (isInstituicaoEnsinoSelected && isOrganizacaoAcademicaSelected) ||
    (isInstituicaoEnsinoSelected && isFaixaEtariaSuperiorSelected) ||
    // Combinações com Município
    (isMunicipioSelected && isModalidadeSelected) ||
    (isMunicipioSelected && isCategoriaAdministrativaSelected) ||
    (isMunicipioSelected && isOrganizacaoAcademicaSelected) ||
    (isMunicipioSelected && isFaixaEtariaSuperiorSelected)
  );

  // Verificar se há dados de múltiplas cidades (filtros territoriais)
  const hasMultipleCities = municipioData && municipioData.length > 0;

  // Verificar se há filtros territoriais combinados com outros filtros
  const hasTerritorialWithOtherFilters = hasMultipleCities && (isModalidadeSelected || isRegimeSelected || isFormacaoDocenteSelected || isCategoriaAdministrativaSelected || isFaixaEtariaSuperiorSelected || isOrganizacaoAcademicaSelected || isInstituicaoEnsinoSelected || isMunicipioSelected);

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

            {/* Tabela cruzada - NÃO exibir quando há filtros territoriais com outros filtros */}
            {!isHistorical && hasCrossFilters && !hasTerritorialWithOtherFilters && renderCrossTable()}

        {/* Dados individuais por cidade (quando há filtros territoriais combinados com outros filtros e não está em modo consolidado) */}
        {!isHistorical && hasTerritorialWithOtherFilters && !showConsolidated && municipioDataArray.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {renderIndividualCityData()}
          </div>
        )}

        {/* Dados consolidados (quando há filtros territoriais combinados com outros filtros e está em modo consolidado) */}
        {!isHistorical && hasTerritorialWithOtherFilters && showConsolidated && municipioDataArray.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {/* Se há cross-filters, renderizar tabela cruzada consolidada */}
            {hasCrossFilters ? (
              <div>
                {/* Criar objeto data temporário com os dados consolidados */}
                {(() => {
                  const consolidatedData = consolidateCrossTableData();
                  const filters = { isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected, isInstituicaoEnsinoSelected, isMunicipioSelected };
                  const config = getCrossTableConfig(filters);

                  if (!config || !consolidatedData) {
                    return <div>Não há dados para exibir</div>;
                  }

                  // Processar dados para formato de tabela cruzada
                  const tempData = {
                    result: {
                      [config.dataKey]: consolidatedData
                    }
                  };

                  return renderCrossTable(tempData, config);
                })()}
              </div>
            ) : (
              /* Tabela consolidada simples (apenas uma dimensão) */
              <div>
                <BasicTable
                  headers={getHeadersForCityData()}
                  data={consolidateDataByCategory()}
                  showSource={true}
                  ref={tableRefs.default}
                />

                {/* Gráfico para dados consolidados */}
                {consolidateDataByCategory().length > 0 && !isInstituicaoEnsinoSelected && !isMunicipioSelected && (
                  <div style={{ marginTop: '1rem' }}>
                    <EnhancedPieChart
                      data={consolidateDataByCategory().map(item => {
                        // Determinar qual campo usar baseado no filtro selecionado
                        let name = 'N/A';
                        if (isModalidadeSelected) name = item.upper_education_mod_name;
                        else if (isRegimeSelected) name = item.work_regime_name;
                        else if (isFormacaoDocenteSelected) name = item.initial_training_name;
                        else if (isCategoriaAdministrativaSelected) name = item.upper_adm_dependency_name;
                        else if (isFaixaEtariaSuperiorSelected) name = item.age_student_code_name;
                        else if (isOrganizacaoAcademicaSelected) name = item.academic_level_name;
                        else if (isInstituicaoEnsinoSelected) name = item.institution_name;
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
            )}
          </div>
        )}

        {/* Tabela simples (sem filtros) */}
        {!isHistorical && hasNoFilters && (
          <>
            {/* Tabela de dados gerais, apenas se não houver dados de municípios */}
            {municipioDataArray.length === 0 && tableDataArray.map((tableData, index) => (
              <div key={index}>
                <BasicTable
                  headers={HEADERS.default}
                  data={tableData}
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

                {/* Gráfico para municípios */}
                {municipioDataArray.length > 0 && municipioDataArray.some(item => item.total > 0) && (
                  <div style={{ marginTop: '1rem' }}>
                    <EnhancedBarChart
                      data={[
                        municipioDataArray.reduce((acc, item) => {
                          acc[item.cityName] = item.total;
                          return acc;
                        }, { name: 'Municípios' })
                      ]}
                      title="Distribuição por Município"
                      height={500}
                      xAxisKey="name"
                    />
                  </div>
                )}

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
                {isModalidadeSelected && renderSimpleTable('modalidade')}
                {isRegimeSelected && renderSimpleTable('regimeDeTrabalho')}
                {isFormacaoDocenteSelected && renderSimpleTable('formacaoDocente')}
                {isCategoriaAdministrativaSelected && renderSimpleTable('categoriaAdministrativa')}
                {isFaixaEtariaSuperiorSelected && renderSimpleTable('faixaEtariaSuperior')}
                {isOrganizacaoAcademicaSelected && renderSimpleTable('organizacaoAcademica')}
                {isInstituicaoEnsinoSelected && renderSimpleTable('instituicaoEnsino')}
                {isMunicipioSelected && renderSimpleTable('municipioApi')}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DataTable;
