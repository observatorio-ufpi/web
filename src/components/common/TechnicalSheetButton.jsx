import React, { useMemo, useState } from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from '@mui/material';

const defaultBody = (
  <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.7 }}>
    Informações sobre a metodologia, fonte de dados, periodicidade e outras informações técnicas estarão disponíveis aqui.
  </Typography>
);

export default function TechnicalSheetButton({
  buttonLabel = 'Ficha Técnica',
  dialogTitle = 'Ficha Técnica',
  tooltip = 'Ficha Técnica',
  children,
  disabled = false,
  size = 'small',
  className = 'action-button',
  buttonSx = {},
}) {
  const [open, setOpen] = useState(false);
  const body = useMemo(() => children ?? defaultBody, [children]);

  return (
    <>
      <Tooltip title={tooltip}>
        <span>
          <Button
            variant="outlined"
            color="info"
            onClick={() => setOpen(true)}
            startIcon={<InfoOutlined />}
            disabled={disabled}
            size={size}
            className={className}
            sx={{
              minWidth: '120px',
              '@media (max-width: 600px)': {
                minWidth: '40px',
                padding: '6px !important',
                '& .MuiButton-startIcon': { margin: 0 },
                '& .button-text': { display: 'none' },
                '& svg': { fontSize: '20px' },
              },
              ...buttonSx,
            }}
          >
            <span className="button-text">{buttonLabel}</span>
          </Button>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{dialogTitle}</DialogTitle>
        <DialogContent dividers>{body}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
