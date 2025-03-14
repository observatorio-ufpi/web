import { Pagination } from '@mui/material';
import React from 'react';
import '../../style/ChartPagination.css';

const CustomPagination = ({ page, totalPages, limit, onPageChange, onLimitChange }) => {
  return (
    <div className="chart-pagination">
      <span className="chart-pagination-label">Itens por página:</span>
      <select
        className="chart-pagination-select"
        value={limit}
        onChange={onLimitChange}
      >
        <option value={1}>1</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={1000}>Todos</option>
      </select>

      {limit !== 1000 && (
        <>
          <span className="chart-pagination-info">
            Página {page} de {totalPages}
          </span>

          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            variant="outlined"
            shape="rounded"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#666',
                borderColor: '#e0e0e0',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  borderColor: '#2196f3'
                },
                '&.Mui-selected': {
                  backgroundColor: '#2196f3',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default CustomPagination;