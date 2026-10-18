import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { municipios } from '../../../../../../utils/municipios.mapping.jsx';

// Mapa do Piauí colorido pelo indicador do ranking (5 faixas por quantil).
// Os polígonos vêm de public/images/mapa-piaui.svg (o mesmo da home), com ids
// IBGE de 7 dígitos; aqui viram 6 para casar com o banco.
// Passar o mouse (ou tocar) mostra o valor; o link leva ao perfil do município.

const CORES = ['#ECD5C7', '#DBB49D', '#C38A6C', '#A8603F', '#733A23'];
const COR_FORA = '#EEEBEA'; // fora do território/faixa escolhidos
const COR_SEM_DADO = '#D6D0CD';

let promessaPoligonos = null;
const carregarPoligonos = () => {
  if (!promessaPoligonos) {
    promessaPoligonos = fetch('/images/mapa-piaui.svg')
      .then((r) => r.text())
      .then((texto) => {
        const doc = new DOMParser().parseFromString(texto, 'image/svg+xml');
        return [...doc.querySelectorAll('polygon')].map((p) => ({ codigo: String(p.getAttribute('id')).slice(0, 6), pontos: p.getAttribute('points') }));
      })
      .catch((e) => {
        promessaPoligonos = null;
        throw e;
      });
  }
  return promessaPoligonos;
};

// ranking: [{ codigo, nome, valor, posicao }] já filtrado e ordenado; noRecorte(codigo) → bool
const MapaIndicador = ({ ranking, noRecorte, formatar }) => {
  const [poligonos, setPoligonos] = useState(null);
  const [erro, setErro] = useState(false);
  // fixado: último município clicado (fica no painel); sobre: o que está sob o mouse agora
  const [fixado, setFixado] = useState(null);
  const [sobre, setSobre] = useState(null);
  const foco = sobre || fixado;
  const navigate = useNavigate();

  // Teclado: o mapa é uma parada só no Tab; as setas percorrem os municípios na
  // ordem do ranking (↓/→ próximo, ↑/← anterior, Home/End extremos) e Enter abre o perfil
  const aoTeclar = (e) => {
    if (!ranking.length) return;
    const atual = ranking.findIndex((it) => it.codigo === fixado);
    const ir = (i) => {
      e.preventDefault();
      setSobre(null);
      setFixado(ranking[Math.max(0, Math.min(ranking.length - 1, i))].codigo);
    };
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') ir(atual + 1);
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ir(atual < 0 ? 0 : atual - 1);
    else if (e.key === 'Home') ir(0);
    else if (e.key === 'End') ir(ranking.length - 1);
    else if (e.key === 'Enter' && fixado) {
      e.preventDefault();
      navigate(`/municipio/${fixado}`);
    }
  };

  useEffect(() => {
    let cancelado = false;
    carregarPoligonos()
      .then((p) => !cancelado && setPoligonos(p))
      .catch(() => !cancelado && setErro(true));
    return () => {
      cancelado = true;
    };
  }, []);

  const { porCodigo, limites } = useMemo(() => {
    const mapa = Object.fromEntries(ranking.map((it) => [it.codigo, it]));
    const crescente = ranking.map((it) => it.valor).sort((a, b) => a - b);
    const corte = (q) => crescente[Math.min(crescente.length - 1, Math.floor(q * crescente.length))];
    return { porCodigo: mapa, limites: crescente.length ? [0.2, 0.4, 0.6, 0.8].map(corte) : [] };
  }, [ranking]);

  const corDe = (codigo) => {
    if (!noRecorte(codigo)) return COR_FORA;
    const it = porCodigo[codigo];
    if (!it) return COR_SEM_DADO;
    const faixa = limites.filter((l) => it.valor >= l).length;
    return CORES[Math.min(faixa, CORES.length - 1)];
  };

  if (erro) return <p className="text-sm text-muted">Não foi possível carregar o mapa.</p>;
  if (!poligonos) return <div className="h-[520px] animate-pulse rounded-[14px] bg-white" aria-hidden="true" />;

  const itemFoco = foco && (porCodigo[foco] || { codigo: foco, nome: municipios[foco]?.nomeMunicipio || foco });
  const faixasLegenda = limites.length
    ? CORES.map((cor, i) => ({ cor, de: i === 0 ? null : limites[i - 1], ate: i < limites.length ? limites[i] : null }))
    : [];

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
      <svg
        viewBox="0 0 803 1161"
        className="mx-auto h-auto max-h-[640px] w-full rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-brand"
        role="img"
        aria-label="Mapa dos municípios do Piauí colorido pelo indicador. Use as setas para percorrer os municípios na ordem do ranking e Enter para abrir o perfil."
        tabIndex={0}
        onKeyDown={aoTeclar}
        onFocus={() => !fixado && ranking.length && setFixado(ranking[0].codigo)}
        onMouseLeave={() => setSobre(null)}
      >
        {poligonos.map((p) => (
          <polygon
            key={p.codigo}
            points={p.pontos}
            fill={corDe(p.codigo)}
            stroke="#FFFFFF"
            strokeWidth={0.6}
            className="cursor-pointer transition-[fill] duration-200"
            onMouseEnter={() => setSobre(p.codigo)}
            onClick={() => setFixado(p.codigo)}
          >
            <title>{municipios[p.codigo]?.nomeMunicipio || p.codigo}</title>
          </polygon>
        ))}
        {/* contornos por cima dos vizinhos: clicado (escuro) e sob o mouse (mais leve) */}
        {[
          [fixado, '#2A1F1A', 2.5],
          [sobre !== fixado ? sobre : null, '#5C3420', 1.5],
        ].map(([codigo, cor, largura]) => {
          const pol = codigo && poligonos.find((p) => p.codigo === codigo);
          return pol ? <polygon key={`contorno-${codigo}`} points={pol.pontos} fill="none" stroke={cor} strokeWidth={largura} pointerEvents="none" /> : null;
        })}
      </svg>

      <aside className="space-y-4">
        <div className="min-h-[112px] rounded-[14px] border border-line bg-white p-4" aria-live="polite">
          {itemFoco ? (
            <>
              <p className="text-base font-semibold text-ink">{itemFoco.nome}</p>
              {itemFoco.valor !== undefined ? (
                <p className="mt-1 text-sm text-texto">
                  <strong className="text-lg text-ink">{formatar(itemFoco.valor)}</strong>
                  <span className="ml-2 text-muted">
                    {itemFoco.posicao}º de {ranking.length}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">{noRecorte(itemFoco.codigo) ? 'Sem dado neste ano.' : 'Fora do recorte escolhido.'}</p>
              )}
              {foco === fixado ? (
                <Link to={`/municipio/${itemFoco.codigo}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:text-brand-dark">
                  Ver perfil →
                </Link>
              ) : (
                <p className="mt-2 text-xs text-muted">Clique no município para fixar e abrir o perfil.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">Passe o mouse para ver o valor. Clique (ou toque) num município para fixá-lo aqui e abrir o perfil. Pelo teclado: Tab até o mapa e setas.</p>
          )}
        </div>

        <div className="rounded-[14px] border border-line bg-white p-4">
          <p className="mb-2 text-[13px] font-semibold text-ink">Legenda</p>
          <ul className="space-y-1.5 text-[13px] text-texto">
            {faixasLegenda.map((f) => (
              <li key={f.cor} className="flex items-center gap-2">
                <span className="h-3.5 w-6 shrink-0 rounded-sm border border-black/5" style={{ backgroundColor: f.cor }} />
                {f.de === null ? `abaixo de ${formatar(f.ate)}` : f.ate === null ? `${formatar(f.de)} ou mais` : `${formatar(f.de)} a ${formatar(f.ate)}`}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="h-3.5 w-6 shrink-0 rounded-sm" style={{ backgroundColor: COR_SEM_DADO }} />
              sem dado no ano
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3.5 w-6 shrink-0 rounded-sm border border-line" style={{ backgroundColor: COR_FORA }} />
              fora do recorte
            </li>
          </ul>
          <p className="mt-2 text-xs text-muted">Cada cor reúne cerca de 1/5 dos municípios do recorte.</p>
        </div>
      </aside>
    </div>
  );
};

export default MapaIndicador;
