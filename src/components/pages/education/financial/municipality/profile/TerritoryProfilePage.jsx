import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../../../../../common/EmptyState';
import DataSourceNote from '../../../../../common/DataSourceNote';
import BotaoCopiarLink from '../../../../../common/BotaoCopiarLink';
import { useTituloDinamico } from '../../../../../common/TituloDaPagina';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { municipios, Regioes } from '../../../../../../utils/municipios.mapping.jsx';
import { tableOptions, TABLE_MAPPINGS } from '../tables/tableConfig.js';
import SummaryCards from '../tables/SummaryCards';
import { ANO_FINAL, PERIODOS, PERIODO_PADRAO, SECOES, agruparPorAno, chaveTerritorio, slugTerritorio } from './perfilComum';

// Perfil do território de desenvolvimento: as mesmas seções do perfil do município,
// somando os municípios do território. Percentuais não se somam: para eles a página
// mostra quantos municípios cumpriram o mínimo, a mediana e quem ficou abaixo.
// Rota: /territorio/:slug (ex.: /territorio/vale-do-caninde)

const ehPct = (coluna) => String(coluna || '').includes('%');
const num = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null);
const minimoDoAno = (minimo, ano) => (typeof minimo === 'function' ? minimo(Number(ano)) : minimo);
const pct = (v) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const mediana = (vs) => {
  const o = [...vs].sort((a, b) => a - b);
  return o.length ? o[Math.floor(o.length / 2)] : null;
};

// Junta os municípios: { anos, somas[tipo][ano], porMunicipio[tipo][ano] = [{codigo, v}], comDado[ano] }
const agregar = (dadosApi, config) => {
  const tipos = Object.keys(config.map);
  const somas = {};
  const porMunicipio = {};
  const comDado = {};
  Object.entries(dadosApi || {}).forEach(([codigo, dadosMun]) => {
    const { rows, typeToRowToValue } = config.transformByMunicipio(agruparPorAno(dadosMun), config.standardize);
    rows.forEach((ano) => {
      let algum = false;
      tipos.forEach((t) => {
        const v = num(typeToRowToValue[t]?.[ano]);
        if (v === null) return;
        algum = true;
        (porMunicipio[t] = porMunicipio[t] || {})[ano] = [...(porMunicipio[t]?.[ano] || []), { codigo, v }];
        if (!ehPct(t)) (somas[t] = somas[t] || {})[ano] = (somas[t]?.[ano] || 0) + v;
      });
      if (algum) comDado[ano] = (comDado[ano] || 0) + 1;
    });
  });
  const anos = Object.keys(comDado).sort((a, b) => Number(a) - Number(b));
  return { tipos, anos, somas, porMunicipio, comDado };
};

// Card de cumprimento de um mínimo legal no território (no lugar de somar percentuais)
const CardCumprimento = ({ cfg, agregado, total }) => {
  const serie = agregado.porMunicipio[cfg.coluna] || {};
  const anos = agregado.anos.filter((a) => (serie[a] || []).length);
  if (!anos.length) return null;
  const valido = (x) => !(cfg.zeroSemAplicacao && x.v === 0);
  const ultimo = anos[anos.length - 1];
  const lista = (serie[ultimo] || []).filter(valido);
  const min = minimoDoAno(cfg.minimo, ultimo);
  const abaixo = lista.filter((x) => x.v < min).sort((a, b) => a.v - b.v);
  const med = mediana(lista.map((x) => x.v));
  return (
    <div className="rounded-[14px] border border-line bg-white p-4">
      <p className="mb-1 text-[13px] text-muted">
        {cfg.rotulo} em {ultimo}
      </p>
      {lista.length ? (
        <>
          <p className="text-2xl font-bold text-ink">
            {lista.length - abaixo.length} de {lista.length} municípios
          </p>
          <p className="mb-2 text-[13px] text-texto">
            atingiram o mínimo de {pct(min)}
            {cfg.zeroSemAplicacao && lista.length < total ? ` (só entram os ${lista.length} que receberam)` : ''}
          </p>
          {med !== null && <p className="text-[13px] text-muted">Mediana do território: {pct(med)}</p>}
          {abaixo.length > 0 && (
            <p className="mt-2 text-[13px] leading-relaxed text-texto">
              <span className="font-semibold">Abaixo do mínimo: </span>
              {abaixo.slice(0, 8).map((x, i) => (
                <React.Fragment key={x.codigo}>
                  {i > 0 && ', '}
                  <Link to={`/municipio/${x.codigo}`} className="text-brand hover:underline">
                    {municipios[x.codigo]?.nomeMunicipio || x.codigo}
                  </Link>{' '}
                  ({pct(x.v)})
                </React.Fragment>
              ))}
              {abaixo.length > 8 && ` e mais ${abaixo.length - 8}`}
            </p>
          )}
          {/* quantos cumpriram em cada ano */}
          <div className="mt-3 flex h-10 items-end gap-[3px]" aria-hidden="true">
            {anos.slice(-18).map((a) => {
              const l = (serie[a] || []).filter(valido);
              const fr = l.length ? l.filter((x) => x.v >= minimoDoAno(cfg.minimo, a)).length / l.length : 0;
              return <div key={a} title={`${a}: ${Math.round(fr * 100)}% cumpriram`} className="flex-1 rounded-sm" style={{ height: `${Math.max(fr * 100, 4)}%`, backgroundColor: fr === 1 ? '#2E7D4F' : '#C38A6C' }} />;
            })}
          </div>
          <p className="mt-1 flex justify-between text-[11px] text-muted">
            <span>{anos.slice(-18)[0]}</span>
            <span>% de municípios que cumpriram, por ano</span>
            <span>{ultimo}</span>
          </p>
        </>
      ) : (
        <p className="text-sm text-muted">{cfg.textoSemAplicacao || 'Sem dados no ano.'}</p>
      )}
    </div>
  );
};

const SecaoTerritorio = ({ chave, tabela, anoInicial, total }) => {
  const config = TABLE_MAPPINGS[tabela];
  const nome = tableOptions.find((t) => t.value === tabela)?.label;
  const [estado, setEstado] = useState({ carregando: true });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ carregando: true });
    fetchData(tabela, 'municipio', { territorioDeDesenvolvimentoMunicipio: chave, anoInicial, anoFinal: ANO_FINAL, page: 1, limit: 100 })
      .then((resp) => !cancelado && setEstado({ carregando: false, agregado: agregar(resp?.data, config) }))
      .catch(() => !cancelado && setEstado({ carregando: false, erro: true }));
    return () => {
      cancelado = true;
    };
  }, [chave, tabela, anoInicial, tentativa]); // eslint-disable-line react-hooks/exhaustive-deps

  const ag = estado.agregado;
  const cardsSoma = (config.resumo || []).filter((c) => ['total', 'maiorParte', 'evolucao'].includes(c.card) && !ehPct(c.coluna || c.total));
  const cardsMinimo = (config.resumo || []).filter((c) => c.card === 'limite');
  const tiposValor = ag ? ag.tipos.filter((t) => !ehPct(t)) : [];
  const ultimo = ag?.anos[ag.anos.length - 1];
  const link = `/municipios?tabela=${tabela}&territorio=${chave}&anoInicial=${ultimo || ANO_FINAL}&anoFinal=${ultimo || ANO_FINAL}`;

  return (
    <section className="sem-quebra mb-8" aria-label={nome}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-ink">{nome}</h3>
        <Link to={link} className="text-sm font-semibold text-brand hover:text-brand-dark print:hidden">
          Ver município a município →
        </Link>
      </div>
      {estado.carregando && (
        <div className="grid gap-3 md:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[14px] border border-line bg-white" />
          ))}
        </div>
      )}
      {!estado.carregando && (estado.erro || !ag?.anos.length) && (
        <p className="rounded-[14px] border border-dashed border-line-strong bg-white px-4 py-6 text-sm text-muted">
          {estado.erro ? (
            <>
              Não foi possível carregar esta tabela agora.{' '}
              <button type="button" onClick={() => setTentativa((t) => t + 1)} className="font-semibold text-brand hover:underline">
                Tentar de novo
              </button>
            </>
          ) : (
            'Sem dados do território no período.'
          )}
        </p>
      )}
      {!estado.carregando && ag?.anos.length > 0 && (
        <>
          {cardsMinimo.length > 0 ? (
            // seção de mínimos legais: cumprimento + total em reais na mesma linha
            <div className="mb-3 grid items-start gap-3 md:grid-cols-2">
              {cardsMinimo.map((cfg) => (
                <CardCumprimento key={cfg.coluna} cfg={cfg} agregado={ag} total={total} />
              ))}
              {cardsSoma.length > 0 && tiposValor.length > 0 && (
                <div className="[&>section]:!mb-0">
                  <SummaryCards resumo={cardsSoma} rows={ag.anos} types={tiposValor} dados={ag.somas} modo="anos" nomeLinha={(a) => a} correcaoAtiva={false} />
                </div>
              )}
            </div>
          ) : (
            cardsSoma.length > 0 &&
            tiposValor.length > 0 && (
              <SummaryCards resumo={cardsSoma} rows={ag.anos} types={tiposValor} dados={ag.somas} modo="anos" nomeLinha={(a) => a} correcaoAtiva={false} />
            )
          )}
          {cardsSoma.length > 0 && tiposValor.length > 0 && (
            <p className="text-[12px] text-muted">
              Valores em reais: soma dos {ag.comDado[ultimo]} municípios com dado em {ultimo}
              {ag.comDado[ultimo] < total ? ` (de ${total} no território)` : ''}. Valores nominais.
            </p>
          )}
        </>
      )}
    </section>
  );
};

// /territorio (sem nome): os 12 territórios em cartões
const IndiceTerritorios = () => {
  useTituloDinamico('Territórios de desenvolvimento');
  const territorios = Object.entries(Regioes)
    .map(([chave, nome]) => {
      const membros = Object.entries(municipios).filter(([, m]) => m.territorioDesenvolvimento === nome);
      const maiores = [...membros].sort((a, b) => (Number(b[1].populacao) || 0) - (Number(a[1].populacao) || 0)).slice(0, 3);
      return {
        chave,
        nome,
        total: membros.length,
        populacao: membros.reduce((s, [, m]) => s + (Number(m.populacao) || 0), 0),
        maiores: maiores.map(([, m]) => m.nomeMunicipio),
      };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  return (
    <main className="homepage-background px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Territórios de desenvolvimento</p>
        <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">Os 12 territórios do Piauí</h1>
        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-texto">
          Cada território reúne municípios vizinhos, conforme o planejamento do Estado. Abra um território para ver a soma dos números dos seus
          municípios e quantos cumprem os mínimos legais.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {territorios.map((t) => (
            <Link
              key={t.chave}
              to={`/territorio/${slugTerritorio(t.chave)}`}
              className="group rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            >
              <h2 className="mb-1 text-lg font-semibold text-ink group-hover:text-brand">{t.nome}</h2>
              <p className="mb-3 text-sm text-muted">
                {t.total} municípios · {t.populacao.toLocaleString('pt-BR')} habitantes
              </p>
              <p className="text-[13px] text-texto">
                <span className="font-semibold">Maiores:</span> {t.maiores.join(', ')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

const TerritoryProfilePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chave = chaveTerritorio(slug);
  const nome = Regioes[chave];
  const periodo =
    PERIODOS.find((p) => p.valor === new URLSearchParams(location.search).get('periodo')) || PERIODOS.find((p) => p.valor === PERIODO_PADRAO);
  useTituloDinamico(nome ? `Território ${nome}` : slug ? 'Território não encontrado' : 'Territórios de desenvolvimento');

  const membros = useMemo(
    () =>
      Object.entries(municipios)
        .filter(([, m]) => m.territorioDesenvolvimento === nome)
        .sort((a, b) => a[1].nomeMunicipio.localeCompare(b[1].nomeMunicipio, 'pt-BR')),
    [nome]
  );
  const populacao = membros.reduce((s, [, m]) => s + (Number(m.populacao) || 0), 0);

  const outros = Object.entries(Regioes)
    .filter(([k]) => k !== chave)
    .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));

  if (!slug) return <IndiceTerritorios />;
  if (!nome) {
    return (
      <main className="homepage-background px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <EmptyState titulo="Território não encontrado" texto="Escolha um dos territórios de desenvolvimento abaixo." />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {outros.map(([k, n]) => (
              <Link key={k} to={`/territorio/${slugTerritorio(k)}`} className="rounded-full border border-line bg-white px-3 py-1 text-sm text-ink hover:border-brand">
                {n}
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="homepage-background px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Perfil financeiro do território de desenvolvimento</p>
            <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">{nome}</h1>
            <div className="flex flex-wrap gap-2">
              {[`${membros.length} municípios`, populacao ? `${populacao.toLocaleString('pt-BR')} habitantes` : null].filter(Boolean).map((d) => (
                <span key={d} className="inline-flex h-7 items-center rounded-full bg-areia px-3 text-[13px] font-semibold text-[#5C3420]">
                  {d}
                </span>
              ))}
            </div>
            <p className="mt-3 max-w-3xl text-sm text-muted">
              Período {periodo.anoInicial}–{ANO_FINAL}. Valores em reais somam os municípios do território; nos percentuais, a página mostra quantos
              municípios cumpriram cada mínimo legal.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 print:hidden">
            <label className="text-[13px] font-semibold text-texto">
              Outro território
              <select
                className="mt-1 block h-10 w-64 rounded-lg border border-line-strong bg-white px-2 text-sm text-ink"
                value={chave}
                onChange={(e) => navigate(`/territorio/${slugTerritorio(e.target.value)}${location.search}`)}
              >
                {Object.entries(Regioes)
                  .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
                  .map(([k, n]) => (
                    <option key={k} value={k}>
                      {n}
                    </option>
                  ))}
              </select>
            </label>
            <BotaoCopiarLink sx={{ alignSelf: 'center' }} />
          </div>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
          <span className="text-sm font-semibold text-texto" id="rotulo-periodo-territorio">
            Período
          </span>
          <div className="inline-flex rounded-lg bg-areia p-1" role="group" aria-labelledby="rotulo-periodo-territorio">
            {PERIODOS.map((p) => (
              <button
                key={p.valor}
                type="button"
                aria-pressed={p.valor === periodo.valor}
                onClick={() => navigate({ search: p.valor === PERIODO_PADRAO ? '' : `?periodo=${p.valor}` }, { replace: true })}
                className={`rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  p.valor === periodo.valor ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                {p.rotulo}
              </button>
            ))}
          </div>
          <Link to={`/ranking?ver=mapa&territorio=${encodeURIComponent(nome)}`} className="text-sm font-semibold text-brand hover:text-brand-dark">
            Ver no mapa e no ranking →
          </Link>
        </div>

        <section className="mb-10 rounded-2xl border border-line bg-white p-5" aria-label="Municípios do território">
          <h2 className="mb-3 text-base font-semibold text-ink">Municípios do território</h2>
          <div className="flex flex-wrap gap-2">
            {membros.map(([codigo, m]) => (
              <Link
                key={codigo}
                to={`/municipio/${codigo}`}
                className="inline-flex h-7 items-center rounded-full border border-line px-3 text-[13px] text-ink transition-colors hover:border-brand hover:bg-areia"
              >
                {m.nomeMunicipio}
              </Link>
            ))}
          </div>
        </section>

        {SECOES.map((secao) => (
          <div key={secao.titulo} className="mb-6">
            <h2 className="mb-5 border-b border-line pb-2 text-xl font-semibold text-ink">{secao.titulo}</h2>
            {secao.tabelas.map((t) => (
              <SecaoTerritorio key={`${chave}-${t}-${periodo.anoInicial}`} chave={chave} tabela={t} anoInicial={periodo.anoInicial} total={membros.length} />
            ))}
          </div>
        ))}
        <DataSourceNote nivel="municipal" />
      </div>
    </main>
  );
};

export default TerritoryProfilePage;
