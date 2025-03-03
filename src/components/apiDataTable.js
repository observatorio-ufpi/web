import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
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

const ApiDataTable = ({ data, municipioData, isEtapaSelected, isLocalidadeSelected, isDependenciaSelected, isVinculoSelected, isHistorical, type, isFormacaoDocenteSelected }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    (!data?.result?.byEtapaAndVinculo || data.result.byEtapaAndVinculo.length === 0) &&
    (!data?.result?.byLocalidadeAndVinculo || data.result.byLocalidadeAndVinculo.length === 0) &&
    (!data?.result?.byDependenciaAndVinculo || data.result.byDependenciaAndVinculo.length === 0) &&
    (!data?.result?.byLocalidadeAndFormacaoDocente || data.result.byLocalidadeAndFormacaoDocente.length === 0) &&
    (!data?.result?.byDependenciaAndFormacaoDocente || data.result.byDependenciaAndFormacaoDocente.length === 0) &&
    (!data?.result?.byVinculoAndFormacaoDocente || data.result.byVinculoAndFormacaoDocente.length === 0) &&
    (!data?.result?.byEtapaAndFormacaoDocente || data.result.byEtapaAndFormacaoDocente.length === 0) &&
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

  // Headers para a etapa de escola
  const etapaEscolaHeaders = ['arrangement_name', 'total'];
  const etapaEscolaHeaderDisplayNames = {
    arrangement_name: 'Etapa',
    total: 'Total',
  };

  const etapaShortHeaders = ['education_level_short_name', 'total'];
  const etapaShortHeaderDisplayNames = {
    education_level_short_name: 'Etapa',
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

  // Headers para a tabela de vínculo funcional
  const vinculoHeaders = ['contract_type_name', 'total'];
  const vinculoHeaderDisplayNames = {
    contract_type_name: 'Vínculo Funcional',
    total: 'Total',
  };

  // Headers para a tabela de formação docente
  const formacaoDocenteHeaders = ['initial_training_name', 'total'];
  const formacaoDocenteHeaderDisplayNames = {
    initial_training_name: 'Formação Docente',
    total: 'Total',
  };


  const renderHistoricalTable = () => {
    // Determinar quais colunas extras precisamos baseado nos filtros
    const getExtraColumns = () => {
      if (isEtapaSelected) {
        if (type === 'school/count') {
          return {
            id: 'arrangement_id',
            name: 'arrangement_name',
            label: 'Etapa'
          };
        } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
          return {
            id: 'education_level_short_id',
            name: 'education_level_short_name',
            label: 'Etapa'
          };
        } else {
          return {
            id: 'education_level_mod_id',
            name: 'education_level_mod_name',
            label: 'Etapa'
          };
        }
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
                    <CenteredTableCell key={year}>{yearMap.get(year)}</CenteredTableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      );
    }

    // Organizar dados por categoria e ano
    const categoryYearMap = new Map();
    const years = new Set();
    const categories = new Set();

    // Primeiro passo: organizar os dados
    data.result.forEach(item => {
      const year = item.year;
      const categoryName = item[extraColumn.name];
      years.add(year);
      categories.add(categoryName);

      if (!categoryYearMap.has(categoryName)) {
        categoryYearMap.set(categoryName, new Map());
      }
      categoryYearMap.get(categoryName).set(year, Number(item.total) || 0);
    });

    // Converter Set para Array e ordenar
    const sortedCategories = [...categories].sort();
    const sortedYears = [...years].sort((a, b) => a - b);

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
              {sortedCategories
                .slice(type === 'school/count' && isEtapaSelected ? page * rowsPerPage : 0,
                      type === 'school/count' && isEtapaSelected ? page * rowsPerPage + rowsPerPage : undefined)
                .map(category => {
                  const yearMap = categoryYearMap.get(category);

                  return (
                    <TableRow key={category}>
                      <CenteredTableCell>{category}</CenteredTableCell>
                      {sortedYears.map(year => (
                        <CenteredTableCell key={year}>
                          {type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio'
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
        {type === 'school/count' && isEtapaSelected && (
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
          <p>Nota: Ao selecionar etapa e modalidade de oferta ao montar sua consulta, temos os seguintes significados das abreviações: CRE – creche; PRE - pré-escola; EF-AI - Ensino Fundamental - Anos Iniciais; EF-AF - Ensino Fundamental - Anos Finais; MULTIETAPA - Ed. Infantil Unificada/Multietapa/Multissérie/Correção fluxo; EM - Ensino Médio; EJA - Educação de Jovens e Adultos; PROF - Educação Profissional; EE - Educação Especial Exclusivo.</p>
        )}
      </Paper>
    );
  };

  // Nova lógica para renderizar a tabela combinada
  if ((isEtapaSelected && isLocalidadeSelected) ||
      (isEtapaSelected && isDependenciaSelected) ||
      (isLocalidadeSelected && isDependenciaSelected) ||
      (isEtapaSelected && isVinculoSelected) ||
      (isLocalidadeSelected && isVinculoSelected) ||
      (isDependenciaSelected && isVinculoSelected) ||
      (isEtapaSelected && isFormacaoDocenteSelected) ||
      (isLocalidadeSelected && isFormacaoDocenteSelected) ||
      (isDependenciaSelected && isFormacaoDocenteSelected) ||
      (isVinculoSelected && isFormacaoDocenteSelected)) {

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
      if (type === 'school/count') {
        crossedData = data?.result?.byEtapaAndDependencia || [];
        rowHeader = "Etapa";
        columnHeader = "Dependência Administrativa";
        rowField = "arrangement_name";
        columnField = "adm_dependency_detailed_name";
        rowIdField = "arrangement_id";
        columnIdField = "adm_dependency_detailed_id";
      } else {
        crossedData = data?.result?.byEtapaAndDependencia || [];
        rowHeader = "Etapa";
        columnHeader = "Dependência Administrativa";
        rowField = "education_level_mod_name";
        columnField = "adm_dependency_detailed_name";
        rowIdField = "education_level_mod_id";
        columnIdField = "adm_dependency_detailed_id";
      }
    }
    else if (isEtapaSelected && isVinculoSelected) {
      if (type === 'school/count') {
        crossedData = data?.result?.byEtapaAndVinculo || [];
        rowHeader = "Etapa";
        columnHeader = "Vínculo Funcional";
        rowField = "arrangement_name";
        columnField = "contract_type_name";
        rowIdField = "arrangement_id";
        columnIdField = "contract_type_id";
      } else {
        crossedData = data?.result?.byEtapaAndVinculo || [];
        rowHeader = "Etapa";
        columnHeader = "Vínculo Funcional";
        rowField = "education_level_mod_name";
        columnField = "contract_type_name";
        rowIdField = "education_level_mod_id";
        columnIdField = "contract_type_id";
      }
    }
    else if (isLocalidadeSelected && isVinculoSelected) {
      crossedData = data?.result?.byLocalidadeAndVinculo || [];
      rowHeader = "Localidade";
      columnHeader = "Vínculo Funcional";
      rowField = "location_name";
      columnField = "contract_type_name";
      rowIdField = "location_id";
      columnIdField = "contract_type_id";
      }
    else if (isDependenciaSelected && isVinculoSelected) {
      crossedData = data?.result?.byDependenciaAndVinculo || [];
      rowHeader = "Dependência Administrativa";
      columnHeader = "Vínculo Funcional";
      rowField = "adm_dependency_detailed_name";
      columnField = "contract_type_name";
      rowIdField = "adm_dependency_detailed_id";
      columnIdField = "contract_type_id";
    }
    else if (isEtapaSelected && isLocalidadeSelected) {
      if (type === 'school/count') {
        crossedData = data?.result?.byEtapaAndLocalidade || [];
        rowHeader = "Etapa";
        columnHeader = "Localidade";
        rowField = "arrangement_name";
        columnField = "location_name";
        rowIdField = "arrangement_id";
        columnIdField = "location_id";
      } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
        crossedData = data?.result?.byEtapaAndLocalidade || [];
        rowHeader = "Etapa";
        columnHeader = "Localidade";
        rowField = "education_level_short_name";
        columnField = "location_name";
        rowIdField = "education_level_short_id";
        columnIdField = "location_id";
      } else {
        crossedData = data?.result?.byEtapaAndLocalidade || [];
        rowHeader = "Etapa";
        columnHeader = "Localidade";
        rowField = "education_level_mod_name";
        columnField = "location_name";
        rowIdField = "education_level_mod_id";
        columnIdField = "location_id";
      }
    }
    else if (isLocalidadeSelected && isFormacaoDocenteSelected) {
      crossedData = data?.result?.byLocalidadeAndFormacaoDocente || [];
      rowHeader = "Localidade";
      columnHeader = "Formação Docente";
      rowField = "location_name";
      columnField = "initial_training_name";
      rowIdField = "location_id";
      columnIdField = "initial_training_id";
    }
    else if (isDependenciaSelected && isFormacaoDocenteSelected) {
      crossedData = data?.result?.byDependenciaAndFormacaoDocente || [];
      rowHeader = "Dependência Administrativa";
      columnHeader = "Formação Docente";
      rowField = "adm_dependency_detailed_name";
      columnField = "initial_training_name";
      rowIdField = "adm_dependency_detailed_id";
      columnIdField = "initial_training_id";
    }
    else if (isVinculoSelected && isFormacaoDocenteSelected) {
      crossedData = data?.result?.byVinculoAndFormacaoDocente || [];
      rowHeader = "Vínculo Funcional";
      columnHeader = "Formação Docente";
      rowField = "contract_type_name";
      columnField = "initial_training_name";
      rowIdField = "contract_type_id";
      columnIdField = "initial_training_id";
    }
    else if (isEtapaSelected && isFormacaoDocenteSelected) {
      if (type === 'school/count') {
        crossedData = data?.result?.byEtapaAndFormacaoDocente || [];
        rowHeader = "Etapa";
        columnHeader = "Formação Docente";
        rowField = "arrangement_name";
        columnField = "initial_training_name";
        rowIdField = "arrangement_id";
        columnIdField = "initial_training_id";
      } else {
        crossedData = data?.result?.byEtapaAndFormacaoDocente || [];
        rowHeader = "Etapa";
        columnHeader = "Formação Docente";
        rowField = "education_level_mod_name";
        columnField = "initial_training_name";
        rowIdField = "education_level_mod_id";
        columnIdField = "initial_training_id";
      }
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
                  {type !== 'liquid_enrollment_ratio' && type !== 'gloss_enrollment_ratio' && <BoldTableCell>Total</BoldTableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(sortedUniqueRows.entries())
                  .slice(type === 'school/count' && isEtapaSelected ? page * rowsPerPage : 0,
                        type === 'school/count' && isEtapaSelected ? page * rowsPerPage + rowsPerPage : undefined)
                  .map(([rowId, rowName]) => (
                    <TableRow key={rowId}>
                      <CenteredTableCell>{rowName}</CenteredTableCell>
                      {Array.from(sortedUniqueColumns.keys()).map(columnId => (
                        <CenteredTableCell key={columnId}>
                          {type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio'
                            ? `${Number(cellValues.get(`${rowId}-${columnId}`) || 0).toFixed(2)}%`
                            : cellValues.get(`${rowId}-${columnId}`) || 0}
                        </CenteredTableCell>
                      ))}
                      {type !== 'liquid_enrollment_ratio' && type !== 'gloss_enrollment_ratio' &&
                        <CenteredTableCell>{rowTotals.get(rowId)}</CenteredTableCell>
                      }
                    </TableRow>
                  ))}
                {type !== 'liquid_enrollment_ratio' && type !== 'gloss_enrollment_ratio' && (
                  <TableRow>
                    <BoldTableCell>Total</BoldTableCell>
                    {Array.from(sortedUniqueColumns.keys()).map(columnId => (
                      <BoldTableCell key={columnId}>
                        {columnTotals.get(columnId)}
                      </BoldTableCell>
                    ))}
                    <BoldTableCell>
                      {Array.from(rowTotals.values()).reduce((sum, total) => Number(sum) + Number(total || 0), 0)}
                    </BoldTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {type === 'school/count' && isEtapaSelected && (
            <TablePagination
              component="div"
              count={sortedUniqueRows.size}
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
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isHistorical && (
          renderHistoricalTable()
        )}
        {/* Primeira tabela */}
        {!isEtapaSelected && !isLocalidadeSelected && !isDependenciaSelected && !isHistorical && !isVinculoSelected && !isFormacaoDocenteSelected && tableDataArray.map((tableData, tableIndex) => (
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
        {!isEtapaSelected && !isLocalidadeSelected && !isDependenciaSelected && !isVinculoSelected && !isFormacaoDocenteSelected && municipioDataArray.length > 0 && // Verifica se há dados
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
        {isEtapaSelected && !isHistorical && type !== 'school/count' && type !== 'liquid_enrollment_ratio' && type !== 'gloss_enrollment_ratio' && (
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

        {isEtapaSelected && !isHistorical && (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') && (
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
                    {etapaShortHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {etapaShortHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result.map((item, index) => (
                    <TableRow key={index}>
                      {etapaShortHeaders.map(header => (
                        <CenteredTableCell key={header}>
                          {header === 'total'
                            ? `${Number(item[header]).toFixed(2)}%`
                            : item[header]?.toString() || ''}
                        </CenteredTableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}



        {isEtapaSelected && !isHistorical && type === 'school/count' && (
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
                    {etapaEscolaHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {etapaEscolaHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <TableRow key={index}>
                        {etapaEscolaHeaders.map(header => (
                          <CenteredTableCell key={header}>
                            {item[header]?.toString() || ''}
                          </CenteredTableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data.result.length}
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
            <p>Nota: Ao selecionar etapa e modalidade de oferta ao montar sua consulta, temos os seguintes significados das abreviações: CRE – creche; PRE - pré-escola; EF-AI - Ensino Fundamental - Anos Iniciais; EF-AF - Ensino Fundamental - Anos Finais; MULTIETAPA - Ed. Infantil Unificada/Multietapa/Multissérie/Correção fluxo; EM - Ensino Médio; EJA - Educação de Jovens e Adultos; PROF - Educação Profissional; EE - Educação Especial Exclusivo.</p>
          </Paper>
        )}

        {isLocalidadeSelected && !isHistorical && (
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

        {isDependenciaSelected && !isHistorical && (
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
        {isVinculoSelected && !isHistorical && (
          <Paper
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="vinculo table">
                <StyledTableHead>
                  <TableRow>
                    {vinculoHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {vinculoHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result.map((item, index) => (
                    <TableRow key={index}>
                      {vinculoHeaders.map(header => (
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

        {isFormacaoDocenteSelected && !isHistorical && (
          <Paper
            sx={{
              backgroundColor: theme.palette.background.default,
              marginBottom: 2
            }}
          >
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="formacaoDocente table">
                <StyledTableHead>
                  <TableRow>
                    {formacaoDocenteHeaders.map(header => (
                      <BoldTableCell key={header}>
                        {formacaoDocenteHeaderDisplayNames[header] || header}
                      </BoldTableCell>
                    ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {data.result.map((item, index) => (
                    <TableRow key={index}>
                      {formacaoDocenteHeaders.map(header => (
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