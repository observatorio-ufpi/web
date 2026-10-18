import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Tour rápido na primeira visita às páginas de dados financeiros: destaca a área
// da tela (elementos com data-tour="...") e explica em um balão. Visto uma vez,
// não volta (localStorage); "?tour=1" no endereço abre de novo (link em "Como usar").
// No celular a barra lateral começa fechada: mostra um cartão único com as dicas.

const CHAVE = 'opepi:tourFinanceiroVisto';

const PASSOS = [
  { alvo: 'categorias', titulo: 'Escolha o que ver', texto: 'Dados dos municípios, do Estado, indicadores, comparação entre municípios ou ranking.' },
  { alvo: 'filtros', titulo: 'Monte a consulta', texto: 'Tipo de dado, município ou região e período. O ícone ⓘ ao lado de cada filtro explica o que ele faz.' },
  { alvo: 'mostrar', titulo: 'Clique em "Mostrar"', texto: 'Aparecem os cards de resumo e a tabela — que pode ser ordenada, exportada e compartilhada pelo link.' },
  { alvo: null, titulo: 'Pronto!', texto: 'Ficou alguma dúvida? A página "Como usar" e o Glossário explicam os termos e o passo a passo.' },
];

const jaViu = () => {
  try {
    return window.localStorage.getItem(CHAVE) === '1';
  } catch {
    return true; // sem localStorage, não insiste
  }
};
const marcarVisto = () => {
  try {
    window.localStorage.setItem(CHAVE, '1');
  } catch {
    // ignora
  }
};

const TourPrimeiraVisita = () => {
  const location = useLocation();
  const forcar = new URLSearchParams(location.search).get('tour') === '1';
  const [aberto, setAberto] = useState(false);
  const [passo, setPasso] = useState(0);
  const [rect, setRect] = useState(null);
  const cartaoRef = useRef(null);
  const celular = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (!forcar && jaViu()) return undefined;
    // espera a barra lateral montar antes de abrir
    const t = setTimeout(() => {
      setPasso(0);
      setAberto(true);
    }, 900);
    return () => clearTimeout(t);
  }, [forcar]);

  // passos cujo alvo não existe nesta página (ex.: ranking não tem filtros) são pulados
  const passosValidos = PASSOS.filter((p) => !p.alvo || document.querySelector(`[data-tour="${p.alvo}"]`));
  const atual = passosValidos[Math.min(passo, passosValidos.length - 1)];

  const medir = useCallback(() => {
    if (!aberto || !atual?.alvo) return setRect(null);
    const el = document.querySelector(`[data-tour="${atual.alvo}"]`);
    if (!el) return setRect(null);
    el.scrollIntoView({ block: 'nearest' });
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    return undefined;
  }, [aberto, atual]);

  useLayoutEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', medir, true);
    return () => {
      window.removeEventListener('resize', medir);
      window.removeEventListener('scroll', medir, true);
    };
  }, [medir]);

  useEffect(() => {
    if (aberto) cartaoRef.current?.focus();
  }, [aberto, passo]);

  const fechar = () => {
    marcarVisto();
    setAberto(false);
  };

  useEffect(() => {
    if (!aberto) return undefined;
    const tecla = (e) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [aberto]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!aberto || !atual) return null;

  const ultimo = celular || passo >= passosValidos.length - 1;
  const MARGEM = 8;
  const LARGURA = 300;

  // Posição do balão: à direita do destaque (barra lateral fica à esquerda); se não couber, embaixo
  let posCartao = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  if (!celular && rect) {
    const direita = rect.left + rect.width + 16;
    if (direita + LARGURA < window.innerWidth) {
      posCartao = { top: Math.max(16, Math.min(rect.top, window.innerHeight - 240)), left: direita };
    } else {
      posCartao = { top: Math.min(rect.top + rect.height + 12, window.innerHeight - 240), left: Math.max(16, rect.left) };
    }
  }

  return (
    <div className="fixed inset-0 z-[1400]" role="presentation">
      {/* fundo escurecido com "recorte" na área destacada */}
      {rect && !celular ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed rounded-xl transition-all duration-300"
          style={{
            top: rect.top - MARGEM,
            left: rect.left - MARGEM,
            width: rect.width + MARGEM * 2,
            height: rect.height + MARGEM * 2,
            boxShadow: '0 0 0 9999px rgba(42, 31, 26, 0.55)',
            outline: '2px solid #8E4A2E',
          }}
        />
      ) : (
        <div aria-hidden="true" className="fixed inset-0" style={{ backgroundColor: 'rgba(42, 31, 26, 0.55)' }} />
      )}

      <div
        ref={cartaoRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
        className="fixed rounded-2xl bg-white p-5 shadow-xl outline-none"
        style={{ width: celular ? 'calc(100vw - 32px)' : LARGURA, maxWidth: 380, outline: 'none', ...posCartao }}
      >
        {celular ? (
          <>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand">Bem-vindo(a) ao OPEPI</p>
            <h2 id="tour-titulo" className="mb-3 text-lg font-semibold text-ink">
              Como consultar os dados
            </h2>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-texto">
              <li>Toque em <strong>Filtros</strong>, no rodapé da tela.</li>
              <li>Escolha o tipo de dado, o município e o período.</li>
              <li>
                Toque em <strong>Mostrar</strong>: aparecem os cards de resumo e a tabela.
              </li>
            </ol>
          </>
        ) : (
          <>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand">
              {passo + 1} de {passosValidos.length}
            </p>
            <h2 id="tour-titulo" className="mb-2 text-lg font-semibold text-ink">
              {atual.titulo}
            </h2>
            <p className="mb-4 text-[15px] leading-relaxed text-texto">{atual.texto}</p>
          </>
        )}
        {ultimo && (
          <p className="mb-4 text-sm">
            <Link to="/como-usar" onClick={fechar} className="font-semibold text-brand hover:text-brand-dark">
              Como usar
            </Link>
            <span className="text-muted"> · </span>
            <Link to="/glossario" onClick={fechar} className="font-semibold text-brand hover:text-brand-dark">
              Glossário
            </Link>
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          {ultimo ? (
            <span />
          ) : (
            <button type="button" onClick={fechar} className="text-sm text-muted hover:text-ink">
              Pular
            </button>
          )}
          <div className="flex gap-2">
            {!celular && passo > 0 && (
              <button
                type="button"
                onClick={() => setPasso((p) => p - 1)}
                className="rounded-lg border border-line-strong px-3 py-2 text-sm font-semibold text-ink hover:bg-areia"
              >
                Voltar
              </button>
            )}
            <button
              type="button"
              onClick={() => (ultimo ? fechar() : setPasso((p) => p + 1))}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {ultimo ? 'Entendi' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPrimeiraVisita;
