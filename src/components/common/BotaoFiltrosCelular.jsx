import React from 'react';
import { FaSlidersH } from 'react-icons/fa';

// Botão "Filtros" fixo no rodapé da tela no celular (o ☰ no canto superior era
// pouco intuitivo para achar os filtros). Mostra quantos filtros estão ativos.
// No computador não aparece — lá continua o ☰.
const BotaoFiltrosCelular = ({ aberto, onClick, ativos = 0 }) => {
  if (aberto) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ativos ? `Abrir filtros (${ativos} ativos)` : 'Abrir filtros'}
      className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors active:bg-brand-dark"
    >
      <FaSlidersH aria-hidden="true" />
      Filtros
      {ativos > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs">
          {ativos}
        </span>
      )}
    </button>
  );
};

export default BotaoFiltrosCelular;
