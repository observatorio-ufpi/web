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

import { columnNameMap } from '../../../../utils/columnNameMap';

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

function CensoEscolarDataTable({ data, title }) {
  const theme = useTheme();
  const tableRef = useRef(null);

  // 1️⃣ ADIÇÃO: Ordena os dados pelo ano para a série histórica
  const sortedData = useMemo(() => {
    if (!data || !data.result) return [];
    // Usamos [...data.result] para criar uma cópia antes de ordenar
    return [...data.result].sort((a, b) => a.ANO - b.ANO);
  }, [data]);

  if (!sortedData || sortedData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', padding: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1">Nenhum dado disponível</Typography>
      </Box>
    );
  }

  const IDENTIFICATION_HEADERS = [
    'NO_ENTIDADE', 'ANO', 'CO_MUNICIPIO', 'NO_MUNICIPIO',
    'SG_UF', 'TP_DEPENDENCIA', 'TP_LOCALIZACAO',
  ];

  const allHeaders = useMemo(() => {
    const keys = Object.keys(sortedData[0]);
    const idCols = IDENTIFICATION_HEADERS.filter((col) => keys.includes(col));
    const otherCols = keys.filter((col) => !IDENTIFICATION_HEADERS.includes(col) && col !== 'id');
    return [...idCols, ...otherCols];
  }, [sortedData]);

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

  const isBinary = (key) => key.startsWith('IN_') || key.startsWith('TP_');
  const displayedHeaders = allHeaders.filter((col) => visibleColumns.includes(col));

  // 2️⃣ ALTERAÇÃO: Paginação agora usa os dados ordenados (sortedData)
  const totalPages = Math.ceil(sortedData.length / limit);
  const paginatedRows =
    limit === 1000
      ? sortedData
      : sortedData.slice((page - 1) * limit, page * limit);

  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleLimitChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setLimit(value);
    setPage(1);
  };
  
  // 3️⃣ ALTERAÇÃO: Exportação agora usa os dados ordenados (sortedData)
  const exportData = useMemo(() => {
    return sortedData.map(row => {
      const newRow = {};
      allHeaders.forEach(header => {
        newRow[header] = isBinary(header) ? formatBinary(row[header]) : row[header] ?? '';
      });
      return newRow;
    });
  }, [sortedData, allHeaders]);

  const exportHeaders = useMemo(() => allHeaders, [allHeaders]);

  const exportHeaderDisplayNames = useMemo(() => {
    const displayNames = {};
    allHeaders.forEach(header => {
      displayNames[header] = columnNameMap[header] || header;
    });
    return displayNames;
  }, [allHeaders]);

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
            {paginatedRows.map((row, idx) => (
              <TableRow key={idx} hover>
                {displayedHeaders.map((key, i) => (
                  <CenteredTableCell key={i}>
                    {isBinary(key) ? formatBinary(row[key]) : row[key] ?? '-'}
                  </CenteredTableCell>
                ))}
              </TableRow>
            ))}
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