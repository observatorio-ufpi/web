import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
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

  const HEADERS = {
    // Cabeçalhos padrão
    default: ['total'],

    municipio: ['cityName', 'total'],
    modalidade: ['upper_education_mod_name', 'total'],
    regimeDeTrabalho: ['work_regime_name', 'total'],
    formacaoDocente: ['initial_training_name', 'total'],
    categoriaAdministrativa: ['upper_adm_dependency_name', 'total'],
    faixaEtariaSuperior: ['age_student_code_name', 'total'],
    organizacaoAcademica: ['academic_level_name', 'total']
  };

  const HEADER_DISPLAY_NAMES = {
    total: 'Total',
    cityName: 'Município',
    upper_education_mod_name: 'Modalidade',
    work_regime_name: 'Regime de Trabalho',
    initial_training_name: 'Formação Docente',
    upper_adm_dependency_name: 'Categoria Administrativa',
    age_student_code_name: 'Faixa Etária',
    academic_level_name: 'Organização Acadêmica'
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
    }
  };

  const getCrossTableConfig = (filters) => {
    const { isModalidadeSelected, isRegimeSelected, isFormacaoDocenteSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected } = filters;

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
    const noCrossData = !data?.result?.byModalidadeAndFaixaEtariaSuperior?.length &&
                        !data?.result?.byModalidadeAndOrganizacaoAcademica?.length &&
                        !data?.result?.byModalidadeAndCategoriaAdministrativa?.length &&
                        !data?.result?.byCategoriaAdministrativaAndFaixaEtariaSuperior?.length &&
                        !data?.result?.byCategoriaAdministrativaAndOrganizacaoAcademica?.length &&
                        !data?.result?.byOrganizacaoAcademicaAndFaixaEtariaSuperior?.length &&
                        !data?.result?.byCategoriaAdministrativaAndRegime?.length &&
                        !data?.result?.byCategoriaAdministrativaAndFormacaoDocente?.length &&
                        !data?.result?.byOrganizacaoAcademicaAndRegime?.length &&
                        !data?.result?.byOrganizacaoAcademicaAndFormacaoDocente?.length;

    return noFilterData && noCrossData &&
           tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0) &&
           municipioDataArray.every(arr => !Array.isArray(arr) || arr.length === 0);
  };

  const BasicTable = React.forwardRef(({ headers, data, formatTotal = false, sortField = null, showTotal = false, totalValue = 0 }, ref) => {
    const sortedData = sortField
      ? [...data].sort((a, b) => Number(a[sortField]) - Number(b[sortField]))
      : data;

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
                        : header === 'total'
                          ? formatNumber(item[header])
                          : item[header]?.toString() || ''}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {/* Linha de total */}
            {showTotal && (
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
  title = '',
  showConsolidated = false
}) => {

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

  const tableDataArray = [data?.result || []];
  const municipioDataArray = municipioData?.map(m => ({
    cityName: m.cityName,
    total: m.result?.[0]?.total || 0,
  }));

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
                        {formatNumber(yearMap.get(year) || 0)}
                      </CenteredTableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: '1rem' }}>
          <HistoricalChart
            data={data}
            type={type}
            isModalidadeSelected={isModalidadeSelected}
            isRegimeSelected={isRegimeSelected}
            isCategoriaAdministrativaSelected={isCategoriaAdministrativaSelected}
            isFaixaEtariaSuperiorSelected={isFaixaEtariaSuperiorSelected}
            isOrganizacaoAcademicaSelected={isOrganizacaoAcademicaSelected}
            isFormacaoDocenteSelected={isFormacaoDocenteSelected}
          />
        </div>
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


  // Renderização de tabela cruzada
const renderCrossTable = () => {
  const filters = { isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected };
  const config = getCrossTableConfig(filters);

  if (!config) return null;

  const crossedData = data?.result?.[config.dataKey] || [];

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

      {/* Adicionar gráficos para tabelas cruzadas */}
      {renderCrossTableCharts(uniqueRows, uniqueColumns, cellValues, config.rowHeader)}

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

          return (
            <div key={index} style={{ marginBottom: '2rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
                {cityName}
              </h3>

              {/* Renderizar tabela para esta cidade */}
              <BasicTable
                headers={headers}
                data={cityResult}
                ref={React.createRef()}
              />

              {/* Gráfico para esta cidade */}
              {cityResult.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <EnhancedPieChart
                    data={cityResult.map(item => ({
                      name: item.upper_education_mod_name || item.work_regime_name || item.initial_training_name || item.upper_adm_dependency_name || item.age_student_code_name || item.academic_level_name || 'N/A',
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
                tableRef={React.createRef()}
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
        tableData = data.result;
        sortField = 'upper_education_mod_id';
        break;
      case 'regimeDeTrabalho':
        headers = HEADERS.regimeDeTrabalho;
        tableData = data.result;
        sortField = 'work_regime_id';
        break;
      case 'formacaoDocente':
        headers = HEADERS.formacaoDocente;
        tableData = data.result;
        sortField = 'initial_training_id';
        break;
      case 'categoriaAdministrativa':
        headers = HEADERS.categoriaAdministrativa;
        tableData = data.result;
        sortField = 'upper_adm_dependency_id';
        break;
      case 'faixaEtariaSuperior':
        headers = HEADERS.faixaEtariaSuperior;
        tableData = data.result;
        sortField = 'age_student_code';
        break;
      case 'organizacaoAcademica':
        headers = HEADERS.organizacaoAcademica;
        tableData = data.result;
        sortField = 'academic_level';
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

    return (
      <div>
        <BasicTable
          headers={headers}
          data={tableData}
          sortField={sortField}
          formatTotal={formatTotal}
          showTotal={true}
          totalValue={totalValue}
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

  const hasNoFilters = !isModalidadeSelected && !isRegimeSelected && !isFormacaoDocenteSelected && !isCategoriaAdministrativaSelected && !isFaixaEtariaSuperiorSelected && !isOrganizacaoAcademicaSelected;
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
    (isOrganizacaoAcademicaSelected && isFormacaoDocenteSelected)
  );

  // Verificar se há dados de múltiplas cidades (filtros territoriais)
  const hasMultipleCities = municipioData && municipioData.length > 0;

  // Verificar se há filtros territoriais combinados com outros filtros
  const hasTerritorialWithOtherFilters = hasMultipleCities && (isModalidadeSelected || isRegimeSelected || isFormacaoDocenteSelected || isCategoriaAdministrativaSelected || isFaixaEtariaSuperiorSelected || isOrganizacaoAcademicaSelected);

  return (
    <ThemeProvider theme={theme}>
      <div>
            {/* Tabela histórica */}
            {isHistorical && renderHistoricalTable()}

            {/* Tabela cruzada */}
            {!isHistorical && hasCrossFilters && renderCrossTable()}

        {/* Dados individuais por cidade (quando há filtros territoriais combinados com outros filtros e não está em modo consolidado) */}
        {!isHistorical && hasTerritorialWithOtherFilters && !showConsolidated && municipioDataArray.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {renderIndividualCityData()}
          </div>
        )}

        {/* Dados consolidados (quando há filtros territoriais combinados com outros filtros e está em modo consolidado) */}
        {!isHistorical && hasTerritorialWithOtherFilters && showConsolidated && municipioDataArray.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {/* Tabela consolidada por categoria */}
            <div>
              <BasicTable
                headers={getHeadersForCityData()}
                data={consolidateDataByCategory()}
                ref={tableRefs.default}
              />

              {/* Gráfico para dados consolidados */}
              {consolidateDataByCategory().length > 0 && (
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
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DataTable;
