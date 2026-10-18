import React, { useState } from 'react';
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';

// "Copiar link": copia o endereço atual (que já guarda os filtros da página).
// Mesmo visual do botão das tabelas municipais. Se a API de área de transferência
// não estiver disponível (ex.: http sem cadeado), usa o método antigo.
const copiar = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(campo);
    return ok;
  }
};

const BotaoCopiarLink = ({ sx }) => {
  const [copiado, setCopiado] = useState(false);
  const aoClicar = async () => {
    if (await copiar(window.location.href)) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };
  return (
    <Button variant="text" onClick={aoClicar} startIcon={copiado ? <CheckIcon /> : <LinkIcon />} aria-live="polite" sx={sx}>
      {copiado ? 'Link copiado' : 'Copiar link'}
    </Button>
  );
};

export default BotaoCopiarLink;
