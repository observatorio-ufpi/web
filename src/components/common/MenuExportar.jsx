import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { cores } from '../../theme/tokens';

// Botão único "Exportar" com menu de formatos (Excel, PDF, CSV...) — o mesmo das
// tabelas municipais. Substitui os pares de botões verde/vermelho que cada tabela tinha.
// opcoes: [{ rotulo, detalhe, icone, acao }]
const MenuExportar = ({ opcoes, rotulo = 'Exportar' }) => {
  const [ancora, setAncora] = useState(null);
  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => setAncora(e.currentTarget)}
        startIcon={<FileDownloadOutlinedIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        aria-haspopup="menu"
        aria-expanded={Boolean(ancora)}
        sx={{
          color: cores.tinta,
          borderColor: cores.linhaForte,
          backgroundColor: cores.superficie,
          '&:hover': { borderColor: cores.marca, backgroundColor: cores.areia },
        }}
      >
        {rotulo}
      </Button>
      <Menu
        anchorEl={ancora}
        open={Boolean(ancora)}
        onClose={() => setAncora(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {opcoes.map((o) => (
          <MenuItem
            key={o.rotulo}
            onClick={() => {
              setAncora(null);
              o.acao();
            }}
          >
            {o.icone && <ListItemIcon sx={{ color: cores.textoSuave }}>{o.icone}</ListItemIcon>}
            <ListItemText primary={o.rotulo} secondary={o.detalhe} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MenuExportar;
