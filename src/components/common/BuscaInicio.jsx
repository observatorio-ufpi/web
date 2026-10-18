import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { buscarResultados, destinoDoResultado, ListaResultados, teclasDaLista } from './BuscaGlobal';

// Busca do topo da home: o mesmo índice da busca geral (municípios, territórios,
// tabelas, páginas e glossário), num campo da própria página com a lista abaixo.
// Município: Financiamento (padrão) ou Matrículas e escolas, direto no resultado.

const SUGESTOES = ['Teresina', 'Fundeb', 'Ranking', 'Território'];

const BuscaInicio = () => {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [aberta, setAberta] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const caixaRef = useRef(null);
  const inputRef = useRef(null);

  const resultados = useMemo(() => buscarResultados(texto), [texto]);
  useEffect(() => setAtivo(0), [texto]);

  // fecha ao clicar fora
  useEffect(() => {
    const fora = (e) => {
      if (caixaRef.current && !caixaRef.current.contains(e.target)) setAberta(false);
    };
    document.addEventListener('mousedown', fora);
    return () => document.removeEventListener('mousedown', fora);
  }, []);

  const ir = (it, educacao = false) => {
    setAberta(false);
    navigate(destinoDoResultado(it, educacao));
  };

  const mostrarLista = aberta && texto.trim();

  return (
    <div ref={caixaRef} className="relative">
      <div className={`flex items-center gap-3 rounded-2xl border bg-white px-4 shadow-sm transition-colors ${mostrarLista ? 'border-brand' : 'border-line'}`}>
        <FaSearch className="shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          id="busca-municipio"
          type="text"
          role="combobox"
          aria-expanded={Boolean(mostrarLista)}
          aria-controls="busca-inicio-resultados"
          aria-autocomplete="list"
          aria-activedescendant={mostrarLista && resultados[ativo] ? `busca-inicio-resultados-item-${ativo}` : undefined}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAberta(true);
          }}
          onFocus={() => setAberta(true)}
          onKeyDown={(e) =>
            teclasDaLista({
              e,
              resultados,
              ativo,
              setAtivo,
              ir,
              fechar: () => (texto ? setTexto('') : inputRef.current?.blur()),
            })
          }
          placeholder="Digite um município, tabela ou termo…"
          autoComplete="off"
          className="h-14 w-full bg-transparent text-[17px] text-ink placeholder:text-muted"
          style={{ outline: 'none', boxShadow: 'none' }}
        />
        {texto && (
          <button
            type="button"
            onClick={() => {
              setTexto('');
              inputRef.current?.focus();
            }}
            className="shrink-0 rounded-full p-1.5 text-muted hover:bg-areia hover:text-ink"
            aria-label="Limpar busca"
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>

      {mostrarLista && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-white text-left shadow-2xl">
          <ListaResultados id="busca-inicio-resultados" texto={texto} resultados={resultados} ativo={ativo} setAtivo={setAtivo} ir={ir} />
        </div>
      )}

      {!texto && (
        <p className="mt-3 text-center text-[13px] text-muted">
          Experimente:{' '}
          {SUGESTOES.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && ' · '}
              <button
                type="button"
                onClick={() => {
                  setTexto(s);
                  setAberta(true);
                  inputRef.current?.focus();
                }}
                className="font-semibold text-brand hover:underline"
              >
                {s}
              </button>
            </React.Fragment>
          ))}
        </p>
      )}
    </div>
  );
};

export default BuscaInicio;
