import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { FaTable, FaThList } from 'react-icons/fa';

// No celular, tabelas largas viram um cartão por linha (ano ou município), com
// as colunas empilhadas — sem rolagem lateral. O botão ao lado deixa voltar à tabela.
// Uso:
//   const visao = useVisaoCelular();
//   <AlternarVisao {...visao} />
//   {visao.cartoes ? <CartoesTabela ... /> : <Table ... />}

export const useVisaoCelular = () => {
  const celular = useMediaQuery('(max-width: 640px)');
  const [preferencia, setPreferencia] = useState('cartoes');
  return { celular, cartoes: celular && preferencia === 'cartoes', preferencia, setPreferencia };
};

export const AlternarVisao = ({ celular, preferencia, setPreferencia }) => {
  if (!celular) return null;
  const botao = (valor, Icone, rotulo) => (
    <button
      type="button"
      onClick={() => setPreferencia(valor)}
      aria-pressed={preferencia === valor}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
        preferencia === valor ? 'bg-white text-ink shadow-sm' : 'text-muted'
      }`}
    >
      <Icone aria-hidden="true" className={preferencia === valor ? 'text-brand' : ''} />
      {rotulo}
    </button>
  );
  return (
    <div className="mb-3 inline-flex rounded-lg bg-areia p-1" role="group" aria-label="Forma de exibição">
      {botao('cartoes', FaThList, 'Cartões')}
      {botao('tabela', FaTable, 'Tabela')}
    </div>
  );
};

// rows: linhas; types: colunas; rotuloLinha(row); valor(type, row) → nó já formatado
// (ou null para "–"); destaque(type) → coluna de total, vai para o topo do cartão.
const CartoesTabela = ({ rows, types, rotuloLinha, valor, destaque = () => false, vazio = 'Nenhum dado encontrado.' }) => {
  if (!rows.length) {
    return <p className="rounded-[14px] border border-dashed border-line-strong bg-white px-4 py-6 text-center text-sm italic text-muted">{vazio}</p>;
  }
  const totais = types.filter(destaque);
  const demais = types.filter((t) => !destaque(t));
  return (
    <ul className="grid gap-3">
      {rows.map((row) => (
        <li key={row} className="rounded-[14px] border border-line bg-white">
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
            <span className="text-base font-semibold text-ink">{rotuloLinha(row)}</span>
          </div>
          {totais.map((t) => (
            <div key={t} className="flex items-baseline justify-between gap-3 bg-areia/50 px-4 py-2.5">
              <span className="text-[13px] font-semibold text-ink">{t}</span>
              <span className="text-right text-[15px] font-bold tabular-nums text-ink">{valor(t, row) ?? '–'}</span>
            </div>
          ))}
          <dl className="divide-y divide-line px-4">
            {demais.map((t) => (
              <div key={t} className="flex items-baseline justify-between gap-3 py-2">
                <dt className="text-[13px] leading-snug text-muted">{t}</dt>
                <dd className="shrink-0 text-right text-sm tabular-nums text-texto">{valor(t, row) ?? '–'}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
};

export default CartoesTabela;
