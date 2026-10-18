import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Select } from '../../../../../ui';
import PageHeader from '../../../../../common/PageHeader';
import EmptyState from '../../../../../common/EmptyState';
import DataSourceNote from '../../../../../common/DataSourceNote';
import SkeletonTabela from '../../../../../common/SkeletonTabela';
import { useTituloDinamico } from '../../../../../common/TituloDaPagina';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { municipios, Regioes, FaixaPopulacional } from '../../../../../../utils/municipios.mapping.jsx';
import { tableOptions, TABLE_MAPPINGS } from '../tables/tableConfig.js';
import { formatarMoedaCompacta } from '../tables/SummaryCards';
import MapaIndicador from './MapaIndicador';
import { FaListOl, FaMapMarkedAlt } from 'react-icons/fa';
import BotaoCopiarLink from '../../../../../common/BotaoCopiarLink';

// Ranking (lista ou mapa): os municípios com os maiores e os menores valores de um dado num ano,
// com filtro por território e faixa populacional. Valores em reais podem ser vistos
// por habitante (população do mapeamento de municípios), para comparar municípios
// de tamanhos diferentes. Filtros na URL:
// /ranking?tabela=constitutionalLimitMde&coluna=...&ano=2024&territorio=...&faixa=...&porHab=1

const ANO_MIN = 2007;
const ANO_MAX = 2024;
const TAMANHO = 10;
const TABELAS = tableOptions.filter((t) => TABLE_MAPPINGS[t.value]?.resumo);

const ehPercentual = (coluna) => coluna.includes('%');
const colunaPrincipal = (tabela) => {
  const primeiro = TABLE_MAPPINGS[tabela]?.resumo?.[0];
  return primeiro?.coluna || primeiro?.total || Object.keys(TABLE_MAPPINGS[tabela].map)[0];
};
const fmtNum = (v, casas = 2) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

const opcoesAnos = Array.from({ length: ANO_MAX - ANO_MIN + 1 }, (_, i) => ANO_MAX - i).map((a) => ({ value: a, label: String(a) }));
const TODOS_TERRITORIOS = { value: '', label: 'Todos os territórios' };
const opcoesTerritorios = [TODOS_TERRITORIOS, ...Object.values(Regioes).sort((a, b) => a.localeCompare(b, 'pt-BR')).map((r) => ({ value: r, label: r }))];
const TODAS_FAIXAS = { value: '', label: 'Todas as faixas' };
const opcoesFaixas = [TODAS_FAIXAS, ...Object.values(FaixaPopulacional).map((f) => ({ value: f, label: f }))];

const lerUrl = (search) => {
  const p = new URLSearchParams(search);
  const tabela = TABLE_MAPPINGS[p.get('tabela')] && TABELAS.some((t) => t.value === p.get('tabela')) ? p.get('tabela') : 'constitutionalLimitMde';
  const coluna = TABLE_MAPPINGS[tabela].map[p.get('coluna')] !== undefined ? p.get('coluna') : colunaPrincipal(tabela);
  const anoNum = Number(p.get('ano'));
  const ano = anoNum >= ANO_MIN && anoNum <= ANO_MAX ? anoNum : ANO_MAX;
  const territorio = Object.values(Regioes).includes(p.get('territorio')) ? p.get('territorio') : '';
  const faixa = Object.values(FaixaPopulacional).includes(p.get('faixa')) ? p.get('faixa') : '';
  return { tabela, coluna, ano, territorio, faixa, porHab: p.get('porHab') === '1', mapa: p.get('ver') === 'mapa' };
};

const Rotulo = ({ texto, children }) => (
  <label className="block text-[13px] font-semibold text-texto">
    {texto}
    <div className="mt-1">{children}</div>
  </label>
);

const ListaRanking = ({ titulo, itens, maximo, formatar, mediana }) => (
  <section className="min-w-0 rounded-[14px] border border-line bg-white p-4 sm:p-5" aria-label={titulo}>
    <h2 className="mb-4 text-base font-semibold text-ink">{titulo}</h2>
    <ol className="space-y-3">
      {itens.map((it) => (
        <li key={it.codigo}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <Link to={`/municipio/${it.codigo}`} className="min-w-0 truncate font-medium text-ink hover:text-brand" title={`Ver perfil de ${it.nome}`}>
              <span className="mr-2 inline-block w-8 text-right tabular-nums text-muted">{it.posicao}º</span>
              {it.nome}
            </Link>
            <span className="shrink-0 font-semibold tabular-nums text-ink">{formatar(it.valor)}</span>
          </div>
          <div className="relative ml-10 h-2 rounded-full bg-areia">
            <div className="h-2 rounded-full bg-brand" style={{ width: `${maximo > 0 ? Math.max((Math.max(it.valor, 0) / maximo) * 100, 1) : 0}%` }} />
            {mediana !== null && maximo > 0 && mediana > 0 && (
              <div className="absolute -top-1 h-4 w-0.5 bg-ink/60" style={{ left: `${Math.min((mediana / maximo) * 100, 100)}%` }} aria-hidden="true" />
            )}
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const RankingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const inicial = useMemo(() => lerUrl(location.search), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [tabela, setTabela] = useState(inicial.tabela);
  const [coluna, setColuna] = useState(inicial.coluna);
  const [ano, setAno] = useState(inicial.ano);
  const [territorio, setTerritorio] = useState(inicial.territorio);
  const [faixa, setFaixa] = useState(inicial.faixa);
  const [porHab, setPorHab] = useState(inicial.porHab);
  const [mapa, setMapa] = useState(inicial.mapa);
  const [valores, setValores] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0); // "Tentar de novo" refaz a busca

  const config = TABLE_MAPPINGS[tabela];
  const percentual = ehPercentual(coluna);
  const usarPorHab = porHab && !percentual;
  useTituloDinamico(`Ranking · ${coluna}`);

  useEffect(() => {
    const p = new URLSearchParams({ tabela, coluna, ano: String(ano) });
    if (territorio) p.set('territorio', territorio);
    if (faixa) p.set('faixa', faixa);
    if (usarPorHab) p.set('porHab', '1');
    if (mapa) p.set('ver', 'mapa');
    navigate({ search: p.toString() }, { replace: true });
  }, [tabela, coluna, ano, territorio, faixa, usarPorHab, mapa, navigate]);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro(false);
    setValores(null);
    fetchData(tabela, 'ano', { anoInicial: ano, anoFinal: ano, page: 1, limit: 10000 })
      .then((resp) => {
        if (cancelado) return;
        const dadosAno = resp?.data?.[ano] || resp?.data?.[String(ano)];
        setValores(dadosAno ? config.transformByAno(dadosAno, config.standardize).typeToRowToValue : {});
      })
      .catch(() => !cancelado && setErro(true))
      .finally(() => !cancelado && setCarregando(false));
    return () => {
      cancelado = true;
    };
  }, [tabela, ano, tentativa]); // eslint-disable-line react-hooks/exhaustive-deps

  const noRecorte = (codigo) =>
    (!territorio || municipios[codigo]?.territorioDesenvolvimento === territorio) && (!faixa || municipios[codigo]?.faixaPopulacional === faixa);

  const ranking = useMemo(() => {
    if (!valores?.[coluna]) return [];
    return Object.entries(valores[coluna])
      .filter(([codigo, v]) => typeof v === 'number' && !Number.isNaN(v) && municipios[codigo])
      .filter(([codigo]) => noRecorte(codigo))
      .map(([codigo, v]) => {
        const pop = municipios[codigo].populacao;
        return { codigo, nome: municipios[codigo].nomeMunicipio, valor: usarPorHab ? (pop ? v / pop : null) : v };
      })
      .filter((it) => it.valor !== null)
      .sort((a, b) => b.valor - a.valor)
      .map((it, i) => ({ ...it, posicao: i + 1 }));
  }, [valores, coluna, territorio, faixa, usarPorHab]); // eslint-disable-line react-hooks/exhaustive-deps

  const mediana = ranking.length ? [...ranking].sort((a, b) => a.valor - b.valor)[Math.floor(ranking.length / 2)].valor : null;
  const maximo = ranking.length ? Math.max(ranking[0].valor, 0) : 0;
  const maiores = ranking.slice(0, TAMANHO);
  // Os menores aparecem do último para cima (o menor valor primeiro), sem repetir quem já está nos maiores
  const menores = ranking.slice(Math.max(TAMANHO, ranking.length - TAMANHO)).reverse();
  const formatar = (v) => (percentual ? `${fmtNum(v, 1)}%` : usarPorHab ? `R$ ${fmtNum(v)}` : formatarMoedaCompacta(v));

  const colunasOpcoes = Object.keys(config.map).map((c) => ({ value: c, label: c }));
  const recorte = [territorio && `Território ${territorio}`, faixa].filter(Boolean);

  return (
    <div className="app-container">
      <PageHeader
        caminho="Dados financeiros  ›  Ranking"
        titulo="Ranking dos municípios"
        etiquetas={[coluna + (usarPorHab ? ' por habitante' : ''), String(ano), ...(recorte.length ? recorte : ['Todo o Piauí'])]}
        acoes={<BotaoCopiarLink />}
      />

      <div className="mb-6 grid gap-3 rounded-[14px] border border-line bg-white p-4 md:grid-cols-3">
        <Rotulo texto="Tipo de dado">
          <Select
            value={TABELAS.find((t) => t.value === tabela)}
            onChange={(o) => {
              setTabela(o.value);
              setColuna(colunaPrincipal(o.value));
            }}
            options={TABELAS}
            fullWidth
          />
        </Rotulo>
        <Rotulo texto="Indicador">
          <Select value={{ value: coluna, label: coluna }} onChange={(o) => setColuna(o.value)} options={colunasOpcoes} fullWidth />
        </Rotulo>
        <Rotulo texto="Ano">
          <Select value={{ value: ano, label: String(ano) }} onChange={(o) => setAno(o.value)} options={opcoesAnos} fullWidth />
        </Rotulo>
        <Rotulo texto="Território de desenvolvimento">
          <Select value={opcoesTerritorios.find((o) => o.value === territorio)} onChange={(o) => setTerritorio(o.value)} options={opcoesTerritorios} fullWidth />
        </Rotulo>
        <Rotulo texto="Faixa populacional">
          <Select value={opcoesFaixas.find((o) => o.value === faixa)} onChange={(o) => setFaixa(o.value)} options={opcoesFaixas} fullWidth />
        </Rotulo>
        <div className="flex items-end">
          <label className={`flex min-h-[44px] items-center gap-2 text-sm ${percentual ? 'text-muted' : 'text-texto'}`} title={percentual ? 'Só vale para valores em reais' : undefined}>
            <input type="checkbox" className="h-4 w-4 accent-[#8E4A2E]" checked={usarPorHab} disabled={percentual} onChange={(e) => setPorHab(e.target.checked)} />
            Valor por habitante
          </label>
        </div>
      </div>

      {carregando && <SkeletonTabela cards={0} linhas={8} colunas={2} />}
      {erro && (
        <EmptyState
          erro
          titulo="Não foi possível carregar o ranking"
          texto="Pode ser uma instabilidade na conexão ou no servidor."
          onTentarDeNovo={() => setTentativa((t) => t + 1)}
        />
      )}
      {!carregando && !erro && valores && ranking.length === 0 && (
        <EmptyState titulo="Sem dados para este recorte" texto="Tente outro ano, indicador ou território." />
      )}

      {!carregando && !erro && ranking.length > 0 && (
        <>
          <div className="mb-4 inline-flex rounded-lg bg-areia p-1" role="group" aria-label="Forma de exibição">
            {[
              [false, FaListOl, 'Lista'],
              [true, FaMapMarkedAlt, 'Mapa'],
            ].map(([valor, Icone, rotulo]) => (
              <button
                key={rotulo}
                type="button"
                onClick={() => setMapa(valor)}
                aria-pressed={mapa === valor}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${mapa === valor ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                <Icone aria-hidden="true" className={mapa === valor ? 'text-brand' : ''} />
                {rotulo}
              </button>
            ))}
          </div>
          <p className="mb-4 text-sm text-muted">
            {ranking.length} municípios com dado em {ano}
            {mediana !== null && (
              <>
                {' '}· mediana: <strong className="text-ink">{formatar(mediana)}</strong>{!mapa && ' (traço escuro nas barras)'}
              </>
            )}
            .{!mapa && ' Clique num município para ver o perfil.'}
          </p>
          {mapa ? (
            <div className="mb-6">
              <MapaIndicador ranking={ranking} noRecorte={noRecorte} formatar={formatar} />
            </div>
          ) : (
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <ListaRanking titulo={`${Math.min(TAMANHO, ranking.length)} maiores`} itens={maiores} maximo={maximo} formatar={formatar} mediana={mediana} />
            {menores.length > 0 && <ListaRanking titulo={`${menores.length} menores`} itens={menores} maximo={maximo} formatar={formatar} mediana={mediana} />}
          </div>
          )}
          {usarPorHab && (
            <p className="mb-2 text-xs text-muted">Por habitante: valor do ano dividido pela população mais recente do município (não a do ano escolhido).</p>
          )}
          <p className="mb-2 text-xs text-muted">Valores nominais, como declarados no RREO. Municípios sem dado no ano não entram no ranking.</p>
        </>
      )}
      <DataSourceNote nivel="municipal" />
    </div>
  );
};

export default RankingPage;
