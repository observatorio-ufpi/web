import { Pagination, Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import React from 'react';
import { cores } from '../../theme/tokens';

const CustomPagination = ({ page, totalPages, limit, onPageChange, onLimitChange }) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '30px',
      padding: '12px',
      flexWrap: 'nowrap',
      '@media (max-width: 768px)': {
        padding: '8px',
        gap: '0.3rem',
      },
      '@media (max-width: 480px)': {
        padding: '6px',
        gap: '0.2rem',
      },
    }}>
      <Typography sx={{
        fontSize: '12px',
        color: cores.textoSuave,
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
          fontSize: '12px',
        },
        '@media (max-width: 480px)': {
          fontSize: '12px',
        },
      }}>
        Itens por página:
      </Typography>
      
      <FormControl size="small">
        <Select
          value={limit}
          onChange={onLimitChange}
          sx={{
            padding: '4px 8px',
            border: `1px solid ${cores.linhaForte}`,
            borderRadius: '8px',
            background: 'white',
            fontSize: '12px',
            color: cores.textoSuave,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '50px',
            '&:hover': {
              borderColor: cores.marca,
            },
            '@media (max-width: 768px)': {
              padding: '4px 6px',
              fontSize: '12px',
            },
            '@media (max-width: 480px)': {
              padding: '3px 4px',
              fontSize: '12px',
              minWidth: '40px',
            },
          }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={1000}>Todos</MenuItem>
        </Select>
      </FormControl>

      {limit !== 1000 && (
        <>
          <Typography sx={{
            fontSize: '12px',
            color: cores.textoSuave,
            whiteSpace: 'nowrap',
            margin: '0 0.5rem',
            '@media (max-width: 768px)': {
              fontSize: '12px',
            },
            '@media (max-width: 480px)': {
              fontSize: '12px',
            },
          }}>
            Página {page} de {totalPages}
          </Typography>

          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            variant="outlined"
            shape="rounded"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: cores.textoSuave,
                borderColor: cores.linhaForte,
                '&:hover': {
                  backgroundColor: cores.areia,
                  borderColor: cores.marca
                },
                '&.Mui-selected': {
                  backgroundColor: cores.marca,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: cores.marcaEscura
                  }
                }
              },
              '@media (max-width: 768px)': {
                '& .MuiPagination-ul': {
                  gap: '1px',
                },
                '& .MuiPagination-ul button': {
                  padding: 0,
                  minWidth: '24px',
                  height: '24px',
                  fontSize: '12px',
                },
              },
              '@media (max-width: 480px)': {
                '& .MuiPagination-ul button': {
                  minWidth: '22px',
                  height: '22px',
                  fontSize: '12px',
                },
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default CustomPagination;