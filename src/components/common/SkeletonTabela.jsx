import React from 'react';
import { cores } from '../../theme/tokens';

// Esqueleto de carregamento com o formato do resultado (cards + tabela), no lugar
// do ícone girando: a página não "pula" quando os dados chegam e a pessoa já vê
// onde cada coisa vai aparecer.
const Bloco = ({ w = '100%', h = 16, raio = 6, style }) => (
  <div
    className="animate-pulse"
    style={{ width: w, height: h, borderRadius: raio, backgroundColor: cores.linha, ...style }}
  />
);

const SkeletonTabela = ({ cards = 3, linhas = 6, colunas = 5 }) => (
  <div role="status" aria-label="Carregando dados" style={{ padding: '8px 0' }}>
    <Bloco w="40%" h={14} style={{ marginBottom: 12 }} />
    <Bloco w="65%" h={28} style={{ marginBottom: 14 }} />
    <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
      <Bloco w={110} h={28} raio={999} />
      <Bloco w={90} h={28} raio={999} />
    </div>
    {cards > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: 12, marginBottom: 24 }}>
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} style={{ border: `1px solid ${cores.linha}`, borderRadius: 14, padding: 18, backgroundColor: cores.superficie }}>
            <Bloco w="55%" h={12} style={{ marginBottom: 12 }} />
            <Bloco w="70%" h={24} style={{ marginBottom: 10 }} />
            <Bloco w="45%" h={12} />
          </div>
        ))}
      </div>
    )}
    <div style={{ border: `1px solid ${cores.linha}`, borderRadius: 14, overflow: 'hidden', backgroundColor: cores.superficie }}>
      <div style={{ display: 'flex', gap: 16, padding: '14px 16px', backgroundColor: cores.areia }}>
        {Array.from({ length: colunas }).map((_, i) => (
          <Bloco key={i} h={12} style={{ flex: 1, backgroundColor: cores.areiaEscura }} />
        ))}
      </div>
      {Array.from({ length: linhas }).map((_, l) => (
        <div key={l} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderTop: `1px solid ${cores.linha}` }}>
          {Array.from({ length: colunas }).map((_, c) => (
            <Bloco key={c} h={14} style={{ flex: 1, opacity: c === 0 ? 1 : 0.7 }} />
          ))}
        </div>
      ))}
    </div>
    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Carregando dados…</span>
  </div>
);

export default SkeletonTabela;
