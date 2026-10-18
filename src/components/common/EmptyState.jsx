import React from 'react';
import { cores } from '../../theme/tokens';

// Caixa de estado vazio/erro das páginas financeiras ("Monte sua consulta",
// "Nenhum dado encontrado"...). Antes cada página tinha um texto solto
// em negrito ou em vermelho, cada uma de um jeito.
// onTentarDeNovo: mostra o botão "Tentar de novo" (usado nos erros de carregamento).
const EmptyState = ({ titulo, texto, erro = false, onTentarDeNovo = null }) => (
  <div
    role={erro ? 'alert' : 'status'}
    style={{
      textAlign: 'center',
      padding: '56px 24px',
      margin: '24px auto',
      maxWidth: '520px',
      fontSize: '16px',
      lineHeight: 1.5,
      color: erro ? cores.naoAtende : cores.texto,
      border: `1px dashed ${erro ? cores.naoAtende : cores.linhaForte}`,
      borderRadius: '14px',
      backgroundColor: cores.superficie,
    }}
  >
    {titulo && (
      <strong style={{ display: 'block', fontSize: '18px', color: erro ? cores.naoAtende : cores.tinta, marginBottom: '6px' }}>
        {titulo}
      </strong>
    )}
    {texto}
    {onTentarDeNovo && (
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={onTentarDeNovo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: cores.marca,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          <span aria-hidden="true">↻</span> Tentar de novo
        </button>
      </div>
    )}
  </div>
);

export default EmptyState;
