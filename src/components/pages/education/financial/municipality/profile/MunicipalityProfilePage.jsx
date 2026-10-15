import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Select } from '../../../../../ui';
import EmptyState from '../../../../../common/EmptyState';
import DataSourceNote from '../../../../../common/DataSourceNote';
import { useTituloDinamico } from '../../../../../common/TituloDaPagina';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { municipios } from '../../../../../../utils/municipios.mapping.jsx';
import { tableOptions, TABLE_MAPPINGS } from '../tables/tableConfig.js';
import SummaryCards from '../tables/SummaryCards';

// Perfil do município: os principais números de todas as tabelas financeiras numa
// página só, reaproveitando os cards de resumo de cada tabela. Para quem não é da
// área, é a porta de entrada; cada seção leva à tabela completa.
// Rota: /municipio/:codigo (código IBGE de 6 dígitos)

const ANO_INICIAL = 2015;
const ANO_FINAL = 2024;

const SECOES = [
  { titulo: 'Arrecadação', tabelas: ['ownRevenues', 'constitutionalTransfersRevenue', 'municipalTaxesRevenues'] },
  { titulo: 'Fundeb', tabelas: ['municipalFundebFundefComposition', 'complementationFundebFundef'] },
  { titulo: 'Cumprimento dos mínimos legais', tabelas: ['constitutionalLimitMde', 'expensesBasicEducationFundeb', 'complementaryProtocol'] },
  { titulo: 'Gastos e recursos da educação', tabelas: ['areasActivityExpense', 'additionalEducationRevenue', 'basicEducationMinimalPotential'] },
];

// Mesmo formato que a página de Municípios usa: { ano: [registros] }
const agruparPorAno = (dadosMunicipio) => {
  const porAno = {};
  Object.values(dadosMunicipio || {}).forEach((registros) => {
    if (!Array.isArray(registros)) return;
    registros.forEach((r) => {
      const ano = String(r.ano);
      (porAno[ano] = porAno[ano] || []).push(r);
    });
  });
  return porAno;
};

const opcoesMunicipios = Object.entries(municipios)
  .map(([codigo, m]) => ({ value: codigo, label: m.nomeMunicipio }))
  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

const SecaoTabela = ({ codigo, tabela }) => {
  const [estado, setEstado] = useState({ carregando: true, linhas: [], tipos: [], dados: {} });
  const config = TABLE_MAPPINGS[tabela];
  const nome = tableOptions.find((t) => t.value === tabela)?.label;

  useEffect(() => {
    let cancelado = false;
    setEstado({ carregando: true, linhas: [], tipos: [], dados: {} });
    fetchData(tabela, 'municipio', { codigoMunicipio: codigo, anoInicial: ANO_INICIAL, anoFinal: ANO_FINAL, page: 1, limit: 10 })
      .then((resp) => {
        if (cancelado) return;
        const { rows, typeToRowToValue } = config.transformByMunicipio(agruparPorAno(resp?.data?.[codigo]), config.standardize);
        setEstado({ carregando: false, linhas: rows, tipos: Object.keys(config.map), dados: typeToRowToValue });
      })
      .catch(() => !cancelado && setEstado({ carregando: false, erro: true, linhas: [], tipos: [], dados: {} }));
    return () => {
      cancelado = true;
    };
  }, [codigo, tabela]); // eslint-disable-line react-hooks/exhaustive-deps

  const link = `/municipios?tabela=${tabela}&municipio=${codigo}&anoInicial=${ANO_INICIAL}&anoFinal=${ANO_FINAL}`;

  return (
    <section className="mb-8" aria-label={nome}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-ink">{nome}</h3>
        <Link to={link} className="text-sm font-semibold text-brand hover:text-brand-dark">
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
          {estado.erro ? 'Não foi possível carregar esta tabela agora.' : 'Sem dados deste município no período.'}
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
  // O banco usa o código IBGE de 6 dígitos; links com 7 (com dígito verificador,
  // como os da home) são aceitos e o endereço é corrigido
  const codigo = /^\d{7}$/.test(codigoUrl || '') ? codigoUrl.slice(0, 6) : codigoUrl;
  useEffect(() => {
    if (codigo !== codigoUrl && municipios[codigo]) navigate(`/municipio/${codigo}`, { replace: true });
  }, [codigo, codigoUrl, navigate]);
  const municipio = municipios[codigo];
  useTituloDinamico(municipio ? `Perfil financeiro · ${municipio.nomeMunicipio}` : 'Município não encontrado');

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
    <div className="max-w-sm">
      <Select
        value={municipio ? { value: codigo, label: municipio.nomeMunicipio } : null}
        onChange={(o) => o && navigate(`/municipio/${o.value}`)}
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
              {detalhes.map((d) => (
                <span key={d} className="inline-flex h-7 items-center rounded-full bg-areia px-3 text-[13px] font-semibold text-[#5C3420]">
                  {d}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">
              Período {ANO_INICIAL}–{ANO_FINAL}. Valores nominais, em reais, como declarados no RREO. Cada número abre a tabela completa.
            </p>
          </div>
          {trocarMunicipio}
        </header>

        {SECOES.map((secao) => (
          <div key={secao.titulo} className="mb-6">
            <h2 className="mb-5 border-b border-line pb-2 text-xl font-semibold text-ink">{secao.titulo}</h2>
            {secao.tabelas.map((t) => (
              <SecaoTabela key={`${codigo}-${t}`} codigo={codigo} tabela={t} />
            ))}
          </div>
        ))}

        <div className="mt-4 flex flex-wrap gap-3">
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
