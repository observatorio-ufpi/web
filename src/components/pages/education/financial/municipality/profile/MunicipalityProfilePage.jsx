import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaPrint } from 'react-icons/fa';
import { Select } from '../../../../../ui';
import EmptyState from '../../../../../common/EmptyState';
import DataSourceNote from '../../../../../common/DataSourceNote';
import { useTituloDinamico } from '../../../../../common/TituloDaPagina';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { municipios } from '../../../../../../utils/municipios.mapping.jsx';
import { tableOptions, TABLE_MAPPINGS } from '../tables/tableConfig.js';
import SummaryCards from '../tables/SummaryCards';
import BotaoCopiarLink from '../../../../../common/BotaoCopiarLink';
import ResumoEmTexto from './ResumoEmTexto';
import { registrarRecente } from '../../../../../../utils/municipiosRecentes';
import { ANO_FINAL, PERIODOS, PERIODO_PADRAO, SECOES, agruparPorAno, slugTerritorio } from './perfilComum';
import { Regioes } from '../../../../../../utils/municipios.mapping.jsx';

// Perfil do município: os principais números de todas as tabelas financeiras numa
// página só, reaproveitando os cards de resumo de cada tabela. Para quem não é da
// área, é a porta de entrada; cada seção leva à tabela completa.
// Rota: /municipio/:codigo (código IBGE de 6 dígitos)


const opcoesMunicipios = Object.entries(municipios)
  .map(([codigo, m]) => ({ value: codigo, label: m.nomeMunicipio }))
  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

const SecaoTabela = ({ codigo, tabela, anoInicial, onCarregado }) => {
  const [estado, setEstado] = useState({ carregando: true, linhas: [], tipos: [], dados: {} });
  const [tentativa, setTentativa] = useState(0); // "Tentar de novo" refaz a busca
  const config = TABLE_MAPPINGS[tabela];
  const nome = tableOptions.find((t) => t.value === tabela)?.label;

  useEffect(() => {
    let cancelado = false;
    setEstado({ carregando: true, linhas: [], tipos: [], dados: {} });
    fetchData(tabela, 'municipio', { codigoMunicipio: codigo, anoInicial, anoFinal: ANO_FINAL, page: 1, limit: 10 })
      .then((resp) => {
        if (cancelado) return;
        const { rows, typeToRowToValue } = config.transformByMunicipio(agruparPorAno(resp?.data?.[codigo]), config.standardize);
        setEstado({ carregando: false, linhas: rows, tipos: Object.keys(config.map), dados: typeToRowToValue });
        onCarregado?.(tabela, { linhas: rows, dados: typeToRowToValue });
      })
      .catch(() => {
        if (cancelado) return;
        setEstado({ carregando: false, erro: true, linhas: [], tipos: [], dados: {} });
        onCarregado?.(tabela, { linhas: [], dados: {} });
      });
    return () => {
      cancelado = true;
    };
  }, [codigo, tabela, anoInicial, tentativa]); // eslint-disable-line react-hooks/exhaustive-deps

  const link = `/municipios?tabela=${tabela}&municipio=${codigo}&anoInicial=${anoInicial}&anoFinal=${ANO_FINAL}`;

  return (
    <section className="sem-quebra mb-8" aria-label={nome}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-ink">{nome}</h3>
        <Link to={link} className="text-sm font-semibold text-brand hover:text-brand-dark print:hidden">
          Ver tabela completa →
        </Link>
      </div>
      {estado.carregando && (
        <div className="grid gap-3 md:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-[14px] border border-line bg-white animate-pulse" />
          ))}
        </div>
      )}
      {!estado.carregando && (estado.erro || !estado.linhas.length) && (
        <p className="rounded-[14px] border border-dashed border-line-strong bg-white px-4 py-6 text-sm text-muted">
          {estado.erro ? (
            <>
              Não foi possível carregar esta tabela agora.{' '}
              <button type="button" onClick={() => setTentativa((t) => t + 1)} className="font-semibold text-brand underline-offset-2 hover:underline">
                Tentar de novo
              </button>
            </>
          ) : (
            'Sem dados deste município no período.'
          )}
        </p>
      )}
      {!estado.carregando && !estado.erro && estado.linhas.length > 0 && (
        <SummaryCards
          resumo={config.resumo}
          rows={estado.linhas}
          types={estado.tipos}
          dados={estado.dados}
          modo="anos"
          nomeLinha={(ano) => ano}
          correcaoAtiva={false}
        />
      )}
    </section>
  );
};

const MunicipalityProfilePage = () => {
  const { codigo: codigoUrl } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const periodo = PERIODOS.find((p) => p.valor === new URLSearchParams(location.search).get('periodo')) || PERIODOS.find((p) => p.valor === PERIODO_PADRAO);
  const anoInicial = periodo.anoInicial;
  // Trocar de município mantém o período escolhido
  const sufixoPeriodo = periodo.valor === PERIODO_PADRAO ? '' : `?periodo=${periodo.valor}`;
  // O banco usa o código IBGE de 6 dígitos; links com 7 (com dígito verificador,
  // como os da home) são aceitos e o endereço é corrigido
  const codigo = /^\d{7}$/.test(codigoUrl || '') ? codigoUrl.slice(0, 6) : codigoUrl;
  useEffect(() => {
    if (codigo !== codigoUrl && municipios[codigo]) navigate(`/municipio/${codigo}${location.search}`, { replace: true });
  }, [codigo, codigoUrl, navigate]); // eslint-disable-line react-hooks/exhaustive-deps
  const municipio = municipios[codigo];
  const chaveDoTerritorio = municipio && Object.keys(Regioes).find((k) => Regioes[k] === municipio.territorioDesenvolvimento);
  // Entra na lista "Vistos recentemente" da home
  useEffect(() => {
    if (municipio) registrarRecente(codigo);
  }, [codigo, municipio]);
  useTituloDinamico(municipio ? `Perfil financeiro · ${municipio.nomeMunicipio}` : 'Município não encontrado');
  // Dados já carregados por cada seção, para o resumo em texto do topo
  const [secoesCarregadas, setSecoesCarregadas] = useState({});
  useEffect(() => setSecoesCarregadas({}), [codigo, anoInicial]);
  const aoCarregarSecao = useCallback((tabela, dados) => setSecoesCarregadas((s) => ({ ...s, [tabela]: dados })), []);

  const detalhes = useMemo(() => {
    if (!municipio) return [];
    return [
      `IBGE ${codigo}`,
      municipio.territorioDesenvolvimento && `Território ${municipio.territorioDesenvolvimento}`,
      municipio.populacao && `${Number(municipio.populacao).toLocaleString('pt-BR')} habitantes`,
      municipio.faixaPopulacional,
    ].filter(Boolean);
  }, [codigo, municipio]);

  const trocarMunicipio = (
    <div className="max-w-sm print:hidden">
      <Select
        value={municipio ? { value: codigo, label: municipio.nomeMunicipio } : null}
        onChange={(o) => o && navigate(`/municipio/${o.value}${sufixoPeriodo}`)}
        options={opcoesMunicipios}
        placeholder="Buscar outro município..."
        fullWidth
      />
    </div>
  );

  if (!municipio) {
    return (
      <main className="homepage-background px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <EmptyState titulo="Município não encontrado" texto="Escolha um município na lista abaixo." />
          <div className="mx-auto mt-4 max-w-sm">{trocarMunicipio}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="homepage-background px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Perfil financeiro da educação</p>
            <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">{municipio.nomeMunicipio}</h1>
            <div className="flex flex-wrap gap-2">
              {detalhes.map((d) =>
                chaveDoTerritorio && d === `Território ${municipio.territorioDesenvolvimento}` ? (
                  <Link
                    key={d}
                    to={`/territorio/${slugTerritorio(chaveDoTerritorio)}`}
                    title={`Ver o perfil do território ${municipio.territorioDesenvolvimento}`}
                    className="inline-flex h-7 items-center gap-1 rounded-full bg-areia px-3 text-[13px] font-semibold text-[#5C3420] underline-offset-2 hover:bg-[#EBD8CC] hover:underline"
                  >
                    {d} <span aria-hidden="true">↗</span>
                  </Link>
                ) : (
                  <span key={d} className="inline-flex h-7 items-center rounded-full bg-areia px-3 text-[13px] font-semibold text-[#5C3420]">
                    {d}
                  </span>
                )
              )}
            </div>
            <p className="mt-3 text-sm text-muted">
              Período {anoInicial}–{ANO_FINAL}. Valores nominais, em reais, como declarados no RREO.
              <span className="print:hidden"> Cada número abre a tabela completa.</span>
            </p>
            {/* Só aparece no papel/PDF: de onde veio e quando foi gerado */}
            <p className="mt-1 hidden text-sm text-muted print:block">
              OPEPI — Observatório da Política Educacional Piauiense (UFPI) · {window.location.host}/municipio/{codigo} · gerado em {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 print:hidden">
            {trocarMunicipio}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-areia"
            >
              <FaPrint aria-hidden="true" className="text-brand" />
              Imprimir ou salvar em PDF
            </button>
            <BotaoCopiarLink sx={{ alignSelf: 'center' }} />
          </div>
        </header>

        {/* Período: muda todas as seções e o resumo de uma vez */}
        <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
          <span className="text-sm font-semibold text-texto" id="rotulo-periodo">Período</span>
          <div className="inline-flex rounded-lg bg-areia p-1" role="group" aria-labelledby="rotulo-periodo">
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
        </div>

        <ResumoEmTexto nome={municipio.nomeMunicipio} secoes={secoesCarregadas} />

        {SECOES.map((secao) => (
          <div key={secao.titulo} className="mb-6">
            <h2 className="mb-5 border-b border-line pb-2 text-xl font-semibold text-ink print:break-after-avoid">{secao.titulo}</h2>
            {secao.tabelas.map((t) => (
              <SecaoTabela key={`${codigo}-${t}-${anoInicial}`} codigo={codigo} tabela={t} anoInicial={anoInicial} onCarregado={aoCarregarSecao} />
            ))}
          </div>
        ))}

        <div className="mt-4 flex flex-wrap gap-3 print:hidden">
          <Link
            to={`/comparar?tabela=constitutionalLimitMde&ano=2023&municipios=${codigo}`}
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Comparar com outros municípios
          </Link>
          <Link
            to="/glossario"
            className="rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-areia"
          >
            Glossário dos termos
          </Link>
        </div>
        <DataSourceNote nivel="municipal" />
      </div>
    </main>
  );
};

export default MunicipalityProfilePage;
