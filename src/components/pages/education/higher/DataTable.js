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
    regimeDeTrabalho: ['work_regime_name', 'total'],
    categoriaAdministrativa: ['upper_adm_dependency_name', 'total'],
    faixaEtariaSuperior: ['age_student_code_name', 'total'],
    grauAcademico: ['academic_level_name', 'total']
  };

  const HEADER_DISPLAY_NAMES = {
    total: 'Total',
    cityName: 'Município',
    upper_education_mod_name: 'Modalidade',
    work_regime_name: 'Regime de Trabalho',
    upper_adm_dependency_name: 'Categoria Administrativa',
    age_student_code_name: 'Faixa Etária',
    academic_level_name: 'Grau Acadêmico'
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
    modalidadeGrauAcademico: {
      dataKey: 'byModalidadeAndGrauAcademico',
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
    categoriaAdministrativaGrauAcademico: {
      dataKey: 'byCategoriaAdministrativaAndGrauAcademico',
      configs: {
        rowField: 'upper_adm_dependency_name',
        rowIdField: 'upper_adm_dependency_id',
        columnField: 'academic_level_name',
        columnIdField: 'academic_level_id',
        rowHeader: 'Categoria Administrativa'
      }
    },
    grauAcademicoFaixaEtariaSuperior: {
      dataKey: 'byGrauAcademicoAndFaixaEtariaSuperior',
      configs: {
        rowField: 'academic_level_name',
        rowIdField: 'academic_level_id',
        columnField: 'age_student_code_name',
        columnIdField: 'age_student_code_id',
        rowHeader: 'Grau Acadêmico'
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
    }
  };

  const getCrossTableConfig = (filters) => {
    const { isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isGrauAcademicoSelected } = filters;

    if (isModalidadeSelected && isFaixaEtariaSuperiorSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.modalidadeFaixaEtariaSuperior.dataKey, 
        ...CROSS_TABLE_CONFIGS.modalidadeFaixaEtariaSuperior.configs}
    }
    if (isModalidadeSelected && isGrauAcademicoSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.modalidadeGrauAcademico.dataKey, 
        ...CROSS_TABLE_CONFIGS.modalidadeGrauAcademico.configs}
    }
    if (isModalidadeSelected && isCategoriaAdministrativaSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.modalidadeCategoriaAdministrativa.dataKey, 
        ...CROSS_TABLE_CONFIGS.modalidadeCategoriaAdministrativa.configs}
    }
    if (isCategoriaAdministrativaSelected && isFaixaEtariaSuperiorSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaFaixaEtariaSuperior.dataKey, 
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaFaixaEtariaSuperior.configs}
    }
    if (isCategoriaAdministrativaSelected && isGrauAcademicoSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaGrauAcademico.dataKey, 
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaGrauAcademico.configs}
    }
    if (isGrauAcademicoSelected && isFaixaEtariaSuperiorSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.grauAcademicoFaixaEtariaSuperior.dataKey, 
        ...CROSS_TABLE_CONFIGS.grauAcademicoFaixaEtariaSuperior.configs}
    }
    if (isCategoriaAdministrativaSelected && isRegimeSelected) {
      return {dataKey: CROSS_TABLE_CONFIGS.categoriaAdministrativaRegime.dataKey, 
        ...CROSS_TABLE_CONFIGS.categoriaAdministrativaRegime.configs}
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

  const hasNoData = (data, tableDataArray, municipioDataArray) => {
    const noFilterData = !Array.isArray(data?.result) || data.result.length === 0;
    const noCrossData = !data?.result?.byModalidadeAndFaixaEtariaSuperior?.length &&
                        !data?.result?.byModalidadeAndGrauAcademico?.length &&
                        !data?.result?.byModalidadeAndCategoriaAdministrativa?.length &&
                        !data?.result?.byCategoriaAdministrativaAndFaixaEtariaSuperior?.length &&
                        !data?.result?.byCategoriaAdministrativaAndGrauAcademico?.length &&
                        !data?.result?.byGrauAcademicoAndFaixaEtariaSuperior?.length &&
                        !data?.result?.byCategoriaAdministrativaAndRegime?.length;

    return noFilterData && noCrossData &&
           tableDataArray.every(arr => !Array.isArray(arr) || arr.length === 0) &&
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
  isCategoriaAdministrativaSelected,
  isFaixaEtariaSuperiorSelected,
  isGrauAcademicoSelected,
  title = ''
}) => {

  // Referências para as tabelas
  const tableRefs = {
    historical: React.useRef(null),
    default: React.useRef(null),
    municipio: React.useRef(null),
    modalidade: React.useRef(null),
    regimeDeTrabalho: React.useRef(null),
    categoriaAdministrativa: React.useRef(null),
    faixaEtariaSuperior: React.useRef(null),
    grauAcademico: React.useRef(null),
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
      if (isGrauAcademicoSelected) {
        return {
          id: 'academic_level',
          name: 'academic_level_name',
          label: 'Grau Acadêmico'
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


  // Renderização de tabela cruzada
const renderCrossTable = () => {
  const filters = { isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isGrauAcademicoSelected };
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
        <Table sx={{ minWidth: 650 }} aria-label="combined table">
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
                      {cellValues.get(`${rowId}-${columnId}`) || 0}
                    </CenteredTableCell>
                  ))}
                  <CenteredTableCell>{rowTotals.get(rowId)}</CenteredTableCell>
                </TableRow>
              ))}
            <TableRow>
              <BoldTableCell>Total</BoldTableCell>
              {Array.from(uniqueColumns.keys()).map(columnId => (
                <BoldTableCell key={columnId}>
                  {columnTotals.get(columnId)}
                </BoldTableCell>
              ))}
              <BoldTableCell>
                {Array.from(columnTotals.values()).reduce((sum, val) => sum + val, 0)}
              </BoldTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
      case 'grauAcademico':
        headers = HEADERS.grauAcademico;
        tableData = data.result;
        sortField = 'academic_level';
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
          tableTitle={title || `Dados por ${filterType === 'modalidade' ? 'Modalidade' : filterType === 'regimeDeTrabalho' ? 'Regime de Trabalho' : 'Categoria Administrativa'}`}
          tableRef={tableRefs[filterType]}
        />
      </div>
    );
  };

  const hasNoFilters = !isModalidadeSelected && !isRegimeSelected && !isCategoriaAdministrativaSelected && !isFaixaEtariaSuperiorSelected && !isGrauAcademicoSelected;
  const hasCrossFilters = (
    (isModalidadeSelected && isFaixaEtariaSuperiorSelected) ||
    (isModalidadeSelected && isGrauAcademicoSelected) ||
    (isModalidadeSelected && isCategoriaAdministrativaSelected) ||
    (isCategoriaAdministrativaSelected && isFaixaEtariaSuperiorSelected) ||
    (isCategoriaAdministrativaSelected && isGrauAcademicoSelected) ||
    (isGrauAcademicoSelected && isFaixaEtariaSuperiorSelected) ||
    (isCategoriaAdministrativaSelected && isRegimeSelected)
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Tabela histórica */}
        {isHistorical && renderHistoricalTable()}

        {/* Tabela cruzada */}
        {!isHistorical && hasCrossFilters && renderCrossTable()}

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
            {isCategoriaAdministrativaSelected && renderSimpleTable('categoriaAdministrativa')}
            {isFaixaEtariaSuperiorSelected && renderSimpleTable('faixaEtariaSuperior')}
            {isGrauAcademicoSelected && renderSimpleTable('grauAcademico')}
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DataTable;
