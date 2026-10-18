import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaMapMarkedAlt, FaTable, FaFileAlt, FaBook } from 'react-icons/fa';
import { municipios, Regioes } from '../../utils/municipios.mapping.jsx';
import { tableOptions } from '../pages/education/financial/municipality/tables/tableConfig.js';
import { GLOSSARIO } from '../../utils/glossario';

// Busca do site: municípios, territórios, tabelas, páginas e termos do glossário.
// Duas formas de usar as mesmas peças (buscarResultados + ListaResultados):
//  - janela (BuscaGlobal, padrão deste arquivo): Ctrl+K, "/" ou o evento
//    "opepi:abrirBusca" (lupa da navbar e das barras laterais);
//  - campo na própria página (BuscaInicio.jsx), usado no topo da home.
// Setas escolhem, Enter abre, Esc fecha.

export const abrirBuscaGlobal = () => window.dispatchEvent(new CustomEvent('opepi:abrirBusca'));

// sem acento e minúsculo ("São João" -> "sao joao")
const semAcento = (t) =>
  String(t)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const PAGINAS = [
  { titulo: 'Dados financeiros dos municípios', destino: '/municipios', extra: 'receitas despesas rreo tabelas' },
  { titulo: 'Dados financeiros do Estado', destino: '/estado', extra: 'piaui estadual' },
  { titulo: 'Indicadores financeiros dos municípios', destino: '/indicadores', extra: 'graficos' },
  { titulo: 'Indicadores financeiros do Estado', destino: '/indicadores-estaduais', extra: 'graficos estadual' },
  { titulo: 'Ranking dos municípios', destino: '/ranking', extra: 'maiores menores posicao' },
  { titulo: 'Mapa do Piauí por indicador', destino: '/ranking?ver=mapa', extra: 'mapa territorio' },
  { titulo: 'Comparar municípios', destino: '/comparar', extra: 'comparacao lado a lado' },
  { titulo: 'Territórios de desenvolvimento', destino: '/territorio', extra: 'regioes territorio' },
  { titulo: 'Educação básica', destino: '/dados-educacionais/basica', extra: 'matriculas escolas turmas professores censo escolar' },
  { titulo: 'Condições de oferta', destino: '/dados-educacionais/condicoes-de-oferta', extra: 'infraestrutura escolas equipamentos' },
  { titulo: 'Educação superior', destino: '/dados-educacionais/superior', extra: 'universidades graduacao docentes cursos' },
  { titulo: 'Indicadores educacionais', destino: '/dados-educacionais/taxas', extra: 'taxas analfabetismo fora da escola frequencia' },
  { titulo: 'Glossário', destino: '/glossario', extra: 'termos siglas significado' },
  { titulo: 'Como usar', destino: '/como-usar', extra: 'ajuda tutorial passo a passo' },
  { titulo: 'Quem somos', destino: '/quem-somos', extra: 'equipe sobre projeto' },
];

const ITENS = [
  ...Object.entries(municipios).map(([codigo, m]) => ({
    tipo: 'municipio',
    titulo: m.nomeMunicipio,
    detalhe: `Território ${m.territorioDesenvolvimento}`,
    destino: `/municipio/${codigo}`,
    // ?municipio= pré-seleciona o município na barra lateral educacional (aceita 6 dígitos)
    destinoEducacao: `/dados-educacionais/basica?municipio=${codigo}`,
    chave: semAcento(m.nomeMunicipio),
  })),
  ...Object.entries(Regioes).map(([chave, nome]) => ({
    tipo: 'territorio',
    titulo: `Território ${nome}`,
    detalhe: 'Perfil do território de desenvolvimento (soma dos municípios)',
    destino: `/territorio/${chave.toLowerCase().replace(/_/g, '-')}`,
    chave: semAcento(`${nome} territorio`),
  })),
  ...tableOptions.map((t) => ({
    tipo: 'tabela',
    titulo: t.label,
    detalhe: 'Tabela financeira · todos os municípios em 2024',
    destino: `/municipios?tabela=${t.value}&anoInicial=2024&anoFinal=2024`,
    chave: semAcento(t.label),
  })),
  ...PAGINAS.map((p) => ({ tipo: 'pagina', titulo: p.titulo, detalhe: 'Página', destino: p.destino, chave: semAcento(`${p.titulo} ${p.extra}`) })),
  ...GLOSSARIO.map((g) => ({
    tipo: 'termo',
    titulo: g.termo,
    detalhe: g.texto,
    destino: `/glossario?termo=${encodeURIComponent(g.termo)}`,
    chave: semAcento(`${g.termo} ${g.grupo}`),
  })),
];

const ICONES = { municipio: FaMapMarkerAlt, territorio: FaMapMarkedAlt, tabela: FaTable, pagina: FaFileAlt, termo: FaBook };
const GRUPOS = { municipio: 'Municípios', territorio: 'Territórios', tabela: 'Tabelas', pagina: 'Páginas', termo: 'Glossário' };

// Começa com o texto > começa uma palavra com ele > contém
const pontuar = (chave, q) => (chave.startsWith(q) ? 0 : chave.includes(` ${q}`) ? 1 : chave.includes(q) ? 2 : -1);

// Resultados para um texto: até 6 por grupo, na ordem municípios → territórios → tabelas → páginas → glossário
export const buscarResultados = (texto) => {
  const q = semAcento(String(texto || '').trim());
  if (!q) return [];
  const porTipo = {};
  ITENS.map((it) => ({ it, p: pontuar(it.chave, q) }))
    .filter((x) => x.p >= 0)
    .sort((a, b) => a.p - b.p || a.it.titulo.localeCompare(b.it.titulo, 'pt-BR'))
    .forEach(({ it }) => {
      (porTipo[it.tipo] = porTipo[it.tipo] || []).push(it);
    });
  return Object.keys(GRUPOS).flatMap((t) => (porTipo[t] || []).slice(0, 6));
};

// Destino de um resultado. Município: perfil financeiro (padrão); educacao=true
// abre a educação básica já filtrada pelo município.
export const destinoDoResultado = (it, educacao = false) => (educacao && it.destinoEducacao ? it.destinoEducacao : it.destino);

// Setas / Enter / Esc sobre a lista
export const teclasDaLista = ({ e, resultados, ativo, setAtivo, ir, fechar }) => {
  if (e.key === 'Escape') fechar();
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    setAtivo((a) => Math.min(a + 1, resultados.length - 1));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setAtivo((a) => Math.max(a - 1, 0));
  } else if (e.key === 'Enter' && resultados[ativo]) {
    e.preventDefault();
    ir(resultados[ativo]);
  }
};

// Lista de resultados. Município mostra dois botões: Financiamento (padrão — também
// é o que Enter e o clique na linha abrem) e Matrículas e escolas.
export const ListaResultados = ({ id, texto, resultados, ativo, setAtivo, ir, vazio = null }) => {
  let grupoAnterior = null;
  return (
    <ul id={id} role="listbox" className="max-h-[60vh] overflow-y-auto py-2">
      {!texto.trim() && vazio}
      {texto.trim() && resultados.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">Nada encontrado para “{texto}”.</li>}
      {resultados.map((it, i) => {
        const Icone = ICONES[it.tipo];
        const cabecalho = it.tipo !== grupoAnterior ? GRUPOS[it.tipo] : null;
        grupoAnterior = it.tipo;
        return (
          <React.Fragment key={`${it.tipo}-${it.destino}-${it.titulo}`}>
            {cabecalho && (
              <li className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted" role="presentation">
                {cabecalho}
              </li>
            )}
            <li
              id={`${id}-item-${i}`}
              role="option"
              aria-selected={i === ativo}
              onMouseEnter={() => setAtivo(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => ir(it)}
              className={`mx-2 flex cursor-pointer flex-wrap items-start gap-x-3 gap-y-2 rounded-lg px-3 py-2.5 text-left sm:flex-nowrap ${i === ativo ? 'bg-areia' : ''}`}
            >
              <Icone className="mt-1 shrink-0 text-brand" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-ink">{it.titulo}</span>
                <span className={`block text-[13px] text-muted ${it.tipo === 'termo' ? '' : 'truncate'}`}>{it.detalhe}</span>
              </span>
              {it.tipo === 'municipio' && (
                <span className="flex w-full shrink-0 flex-wrap gap-1.5 pl-7 sm:w-auto sm:justify-end sm:self-center sm:pl-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      ir(it, false);
                    }}
                    className="rounded-full bg-brand px-2.5 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Financiamento
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      ir(it, true);
                    }}
                    className="rounded-full border border-line bg-white px-2.5 py-1 text-[12px] font-semibold text-ink transition-colors hover:border-brand hover:bg-areia"
                  >
                    Matrículas e escolas
                  </button>
                </span>
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};

// Janela de busca (Ctrl+K)
const BuscaGlobal = () => {
  const navigate = useNavigate();
  const [aberta, setAberta] = useState(false);
  const [texto, setTexto] = useState('');
  const [ativo, setAtivo] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const abrir = () => {
      setTexto('');
      setAtivo(0);
      setAberta(true);
    };
    const tecla = (e) => {
      const digitando = /input|textarea|select/i.test(e.target?.tagName) || e.target?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        abrir();
      } else if (e.key === '/' && !digitando) {
        e.preventDefault();
        abrir();
      }
    };
    window.addEventListener('keydown', tecla);
    window.addEventListener('opepi:abrirBusca', abrir);
    return () => {
      window.removeEventListener('keydown', tecla);
      window.removeEventListener('opepi:abrirBusca', abrir);
    };
  }, []);

  useEffect(() => {
    if (aberta) setTimeout(() => inputRef.current?.focus(), 0);
  }, [aberta]);

  const resultados = useMemo(() => buscarResultados(texto), [texto]);
  useEffect(() => setAtivo(0), [texto]);

  if (!aberta) return null;

  const ir = (it, educacao = false) => {
    setAberta(false);
    navigate(destinoDoResultado(it, educacao));
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-start justify-center bg-[rgba(42,31,26,0.45)] px-4 pt-[10vh]" onMouseDown={() => setAberta(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar no OPEPI"
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => teclasDaLista({ e, resultados, ativo, setAtivo, ir, fechar: () => setAberta(false) })}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <FaSearch className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Município, tabela, página ou termo (ex.: Oeiras, Fundeb, ranking)"
            aria-label="Buscar"
            aria-controls="busca-resultados"
            aria-activedescendant={resultados[ativo] ? `busca-resultados-item-${ativo}` : undefined}
            className="h-14 w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-[11px] text-muted sm:inline">Esc</kbd>
        </div>
        <ListaResultados
          id="busca-resultados"
          texto={texto}
          resultados={resultados}
          ativo={ativo}
          setAtivo={setAtivo}
          ir={ir}
          vazio={
            <li className="px-4 py-6 text-center text-sm text-muted">
              Digite para buscar. Atalho: <kbd className="rounded border border-line px-1">Ctrl</kbd> + <kbd className="rounded border border-line px-1">K</kbd>
            </li>
          }
        />
      </div>
    </div>
  );
};

export default BuscaGlobal;
