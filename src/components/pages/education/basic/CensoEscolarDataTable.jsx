import React, { useState, useMemo, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { FaEye } from 'react-icons/fa';
import CustomPagination from "../../../helpers/CustomPagination";
import TableExport from '../../../common/TableExport';
import { Select } from '../../../ui';

import { columnNameMap } from '../../../../utils/columnNameMap';
import { Regioes } from '../../../../utils/citiesMapping';

const BoldTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
}));

const CenteredTableCell = styled(TableCell)(() => ({
  textAlign: 'center',
  whiteSpace: 'nowrap',
}));

const formatBinary = (value) => {
  if (value === 1) return 'Sim';
  if (value === 0) return 'Não';
  return '-';
};

const renderCellValue = (row, key) => {
  // Binary / coded fields
  if (isBinary(key)) return formatBinary(row[key]);

  const value = row[key];

  if (value === null || value === undefined) return '-';

  // If it's an object, try common display properties
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.join(', ');
    if (value.nome) return value.nome;
    if (value.name) return value.name;
    // fall back to JSON string to avoid React child error
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '-';
    }
  }

  return String(value);
};

// helper to detect binary-coded fields
const isBinary = (key) => key && (key.startsWith('IN_') || key.startsWith('TP_'));

function CensoEscolarDataTable({ data, title }) {
  const theme = useTheme();
  const tableRef = useRef(null);

  const IDENTIFICATION_HEADERS = [
    'NO_ENTIDADE', 'ANO', 'CO_MUNICIPIO', 'NO_MUNICIPIO',
    'SG_UF', 'TP_DEPENDENCIA', 'TP_LOCALIZACAO',
  ];

  const allHeaders = useMemo(() => {
    if (!data || !data.result || data.result.length === 0) {
      return [];
    }
    const keys = Object.keys(data.result[0]);
    const idCols = IDENTIFICATION_HEADERS.filter((col) => keys.includes(col));
    const otherCols = keys.filter((col) => !IDENTIFICATION_HEADERS.includes(col) && col !== 'id');
    return [...idCols, ...otherCols];
  }, [data]);

  const [visibleColumns, setVisibleColumns] = useState(allHeaders);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleToggleColumn = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const displayedHeaders = allHeaders.filter((col) => visibleColumns.includes(col));

  const totalPages = Math.ceil(data.result.length / limit);
  const paginatedRows =
    limit === 1000
      ? data.result
      : data.result.slice((page - 1) * limit, page * limit);

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleLimitChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setLimit(value);
    setPage(1);
  };
  
  const exportData = useMemo(() => {
    return data.result.map(row => {
      const newRow = {};
      allHeaders.forEach(header => {
        newRow[header] = isBinary(header) ? formatBinary(row[header]) : row[header] ?? '';
      });
      return newRow;
    });
  }, [data, allHeaders]);

  const exportHeaders = useMemo(() => allHeaders, [allHeaders]);

  const exportHeaderDisplayNames = useMemo(() => {
    const displayNames = {};
    allHeaders.forEach(header => {
      displayNames[header] = columnNameMap[header] || header;
    });
    return displayNames;
  }, [allHeaders]);

  if (!data || !data.result || data.result.length === 0) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6">Nenhum dado disponível para exibição.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2, gap: '12px' }}>
        <Button
          id="column-visibility-button"
          aria-controls={open ? 'column-visibility-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          startIcon={<FaEye />}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              color: theme.palette.primary.dark,
            },
          }}
        >
          Visualizar Colunas
        </Button>
        <Menu
          id="column-visibility-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { maxHeight: 300, width: '30ch' } }}
        >
          {allHeaders.map((column) => (
            <MenuItem key={column} dense>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => handleToggleColumn(column)}
                    name={column}
                    color="primary"
                  />
                }
                label={columnNameMap[column] || column}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <TableContainer
        component={Box}
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: theme.shadows[1],
        }}
        ref={tableRef}
      >
        <Table stickyHeader size="small">
          <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableRow>
              {displayedHeaders.map((col) => (
                <BoldTableCell key={col}>
                  {columnNameMap[col] || col}
                </BoldTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows && paginatedRows.length > 0 ? paginatedRows.map((row, idx) => (
              <TableRow key={idx} hover>
                {displayedHeaders.map((key, i) => (
                  <CenteredTableCell key={i}>
                    {renderCellValue(row, key)}
                  </CenteredTableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow>
                <CenteredTableCell colSpan={displayedHeaders.length}>
                  Nenhum dado encontrado para os filtros selecionados.
                </CenteredTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
        <TableExport
          data={exportData}
          headers={exportHeaders}
          headerDisplayNames={exportHeaderDisplayNames}
          fileName={title ? title.replace(/\s+/g, '_').toLowerCase() : 'censo_escolar_data'}
          tableTitle={title}
          showPdfExport={false}
          tableRef={tableRef}
        />
      </Box>

      <CustomPagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Box>
  );
}

export default CensoEscolarDataTable;
