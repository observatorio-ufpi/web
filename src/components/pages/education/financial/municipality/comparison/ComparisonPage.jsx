import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select } from '../../../../../ui';
import { formatarOpcaoComDescricao } from '../../../../../ui/Select';
import { Loading } from '../../../../../ui';
import PageHeader from '../../../../../common/PageHeader';
import EmptyState from '../../../../../common/EmptyState';
import DataSourceNote from '../../../../../common/DataSourceNote';
import ColunaComExplicacao from '../../../../../common/ColunaComExplicacao';
import { useTituloDinamico } from '../../../../../common/TituloDaPagina';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { municipios } from '../../../../../../utils/municipios.mapping.jsx';
import { cores } from '../../../../../../theme/tokens';
import { tableOptions, TABLE_MAPPINGS } from '../tables/tableConfig.js';
import { formatarMoedaCompacta } from '../tables/SummaryCards';
import BotaoCopiarLink from '../../../../../common/BotaoCopiarLink';

// Comparação de 2 a 4 municípios num mesmo ano, para um tipo de dado.
// Uma única consulta traz todos os municípios do ano (a mesma usada nos cards);
// a mediana do Piauí entra como referência. Filtros ficam na URL:
// /comparar?tabela=constitutionalLimitMde&ano=2023&municipios=220670,221100

const ANO_MIN = 2007;
const ANO_MAX = 2024;
const MAX_MUNICIPIOS = 4;
const TABELAS = tableOptions.filter((t) => TABLE_MAPPINGS[t.value]?.resumo);

const ehPercentual = (coluna) => coluna.includes('%');
const formatar = (v, coluna) => {
  if (typeof v !== 'number') return '–';
  const n = v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return ehPercentual(coluna) ? `${n}%` : n;
};
const mediana = (valores) => {
  const ord = valores.filter((v) => typeof v === 'number').sort((a, b) => a - b);
  return ord.length ? ord[Math.floor(ord.length / 2)] : null;
};

// Coluna principal de cada tabela: a do primeiro card de resumo
const colunaPrincipal = (tabela) => {
  const primeiro = TABLE_MAPPINGS[tabela]?.resumo?.[0];
  return primeiro?.coluna || primeiro?.total || null;
};

const opcoesMunicipios = Object.entries(municipios)
  .map(([codigo, m]) => ({ value: codigo, label: m.nomeMunicipio }))
  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
const opcoesAnos = Array.from({ length: ANO_MAX - ANO_MIN + 1 }, (_, i) => ANO_MAX - i).map((a) => ({ value: a, label: String(a) }));

const lerUrl = (search) => {
  const p = new URLSearchParams(search);
  const tabela = TABLE_MAPPINGS[p.get('tabela')] ? p.get('tabela') : 'constitutionalLimitMde';
  const anoNum = Number(p.get('ano'));
  const ano = anoNum >= ANO_MIN && anoNum <= ANO_MAX ? anoNum : 2023;
  const lista = (p.get('municipios') || '').split(',').filter((c) => municipios[c]).slice(0, MAX_MUNICIPIOS);
  return { tabela, ano, lista };
};

const ComparisonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const inicial = useMemo(() => lerUrl(location.search), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [tabela, setTabela] = useState(inicial.tabela);
  const [ano, setAno] = useState(inicial.ano);
  const [selecionados, setSelecionados] = useState(inicial.lista);
  const [valores, setValores] = useState(null); // typeToRowToValue de todos os municípios no ano
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0); // "Tentar de novo" refaz a busca

  const config = TABLE_MAPPINGS[tabela];
  const tituloTabela = tableOptions.find((t) => t.value === tabela)?.label || '';
  const colunas = Object.keys(config.map);
  const principal = colunaPrincipal(tabela);

  // URL sempre reflete a comparação (dá para compartilhar o link)
  useEffect(() => {
    const p = new URLSearchParams({ tabela, ano: String(ano) });
    if (selecionados.length) p.set('municipios', selecionados.join(','));
    navigate({ search: p.toString() }, { replace: true });
  }, [tabela, ano, selecionados, navigate]);

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

  const nomes = selecionados.map((c) => municipios[c]?.nomeMunicipio || c);
  useTituloDinamico(selecionados.length >= 2 ? `Comparar: ${nomes.join(', ')}` : 'Comparar municípios');

  const medianas = useMemo(() => {
    if (!valores) return {};
    return Object.fromEntries(colunas.map((c) => [c, mediana(Object.values(valores[c] || {}))]));
  }, [valores, colunas]);

  const barras = useMemo(() => {
    if (!valores || !principal) return [];
    const lista = selecionados.map((c, i) => ({
      codigo: c,
      nome: nomes[i],
      valor: valores[principal]?.[c],
    }));
    const max = Math.max(...lista.map((b) => (typeof b.valor === 'number' ? b.valor : 0)), medianas[principal] || 0) || 1;
    return lista.map((b) => ({ ...b, largura: typeof b.valor === 'number' ? (b.valor / max) * 100 : 0, maxRef: max }));
  }, [valores, principal, selecionados, nomes, medianas]);

  const posicaoMediana = barras.length && medianas[principal] != null ? (medianas[principal] / barras[0].maxRef) * 100 : null;
  const pronto = selecionados.length >= 2 && valores && !carregando;

  return (
    <div className="app-container">
      <PageHeader
        caminho="Dados financeiros  ›  Comparar municípios"
        titulo="Comparar municípios"
        etiquetas={selecionados.length ? [...nomes, String(ano)] : [String(ano)]}
        acoes={<BotaoCopiarLink />}
      />

      {/* Controles da comparação */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 3fr' },
          gap: '12px',
          backgroundColor: cores.superficie,
          border: `1px solid ${cores.linha}`,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <label style={{ fontSize: 13, fontWeight: 600, color: cores.texto }}>
          Tipo de dado
          <Select
            value={TABELAS.find((t) => t.value === tabela)}
            onChange={(o) => setTabela(o.value)}
            options={TABELAS.map((t) => ({ ...t, descricao: undefined }))}
            size="small"
            fullWidth
          />
        </label>
        <label style={{ fontSize: 13, fontWeight: 600, color: cores.texto }}>
          Ano
          <Select value={opcoesAnos.find((a) => a.value === ano)} onChange={(o) => setAno(o.value)} options={opcoesAnos} size="small" fullWidth />
        </label>
        <label style={{ fontSize: 13, fontWeight: 600, color: cores.texto }}>
          Municípios (de 2 a {MAX_MUNICIPIOS})
          <Select
            isMulti
            value={opcoesMunicipios.filter((o) => selecionados.includes(o.value))}
            onChange={(lista) => setSelecionados((lista || []).slice(0, MAX_MUNICIPIOS).map((o) => o.value))}
            options={selecionados.length >= MAX_MUNICIPIOS ? [] : opcoesMunicipios}
            noOptionsMessage={() => (selecionados.length >= MAX_MUNICIPIOS ? `Máximo de ${MAX_MUNICIPIOS} municípios` : 'Nenhum município')}
            placeholder="Digite o nome do município..."
            formatOptionLabel={formatarOpcaoComDescricao}
            size="small"
            fullWidth
          />
        </label>
      </Box>

      {carregando && <Loading />}
      {erro && (
        <EmptyState
          erro
          titulo="Não foi possível carregar os dados"
          texto="Pode ser uma instabilidade na conexão ou no servidor."
          onTentarDeNovo={() => setTentativa((t) => t + 1)}
        />
      )}
      {!carregando && !erro && selecionados.length < 2 && (
        <EmptyState titulo="Escolha os municípios" texto={`Selecione de 2 a ${MAX_MUNICIPIOS} municípios para comparar lado a lado.`} />
      )}

      {pronto && (
        <>
          <Typography component="h2" sx={{ fontSize: '20px', fontWeight: 600, color: cores.tinta, marginBottom: '4px' }}>
            {tituloTabela}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: cores.textoSuave, marginBottom: '16px' }}>
            <ColunaComExplicacao nome={principal} /> em {ano} · a linha tracejada marca a mediana dos municípios do Piauí
          </Typography>

          {/* Barras horizontais da coluna principal */}
          <Box
            sx={{
              backgroundColor: cores.superficie,
              border: `1px solid ${cores.linha}`,
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {barras.map((b, i) => (
              <Box key={b.codigo} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '180px 1fr 140px' }, gap: '6px 12px', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: cores.tinta }}>{b.nome}</Typography>
                <Box sx={{ position: 'relative', height: '22px', backgroundColor: cores.zebra, borderRadius: '6px' }}>
                  <Box
                    sx={{
                      width: `${b.largura}%`,
                      height: '100%',
                      borderRadius: '6px',
                      backgroundColor: cores.series[i % cores.series.length],
                      transition: 'width 300ms ease',
                    }}
                  />
                  {posicaoMediana !== null && (
                    <Box aria-hidden="true" sx={{ position: 'absolute', top: -4, bottom: -4, left: `${posicaoMediana}%`, borderLeft: `2px dashed ${cores.texto}` }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: cores.tinta, textAlign: { sm: 'right' }, fontVariantNumeric: 'tabular-nums' }}>
                  {typeof b.valor === 'number' ? (ehPercentual(principal) ? formatar(b.valor, principal) : formatarMoedaCompacta(b.valor)) : 'sem dado'}
                </Typography>
              </Box>
            ))}
            {medianas[principal] != null && (
              <Typography sx={{ fontSize: '13px', color: cores.textoSuave }}>
                Mediana do Piauí em {ano}:{' '}
                {ehPercentual(principal) ? formatar(medianas[principal], principal) : formatarMoedaCompacta(medianas[principal])}
              </Typography>
            )}
          </Box>

          {/* Tabela completa: municípios nas linhas, todas as colunas da tabela */}
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${cores.linha}`, borderRadius: '14px' }}>
            <Table aria-label={`Comparação: ${tituloTabela}`}>
              <TableHead>
                <TableRow>
                  {['Município', ...colunas].map((c, i) => (
                    <TableCell
                      key={c}
                      sx={{
                        backgroundColor: cores.areia,
                        color: cores.textoSobreAreia,
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        textAlign: i === 0 ? 'left' : 'right',
                        minWidth: i === 0 ? '10rem' : `${Math.min(15, Math.max(7.5, c.length * 0.42))}rem`,
                        verticalAlign: 'bottom',
                      }}
                    >
                      {i === 0 ? c : <ColunaComExplicacao nome={c} />}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selecionados.map((codigo, idx) => (
                  <TableRow key={codigo} sx={{ backgroundColor: idx % 2 ? cores.zebra : cores.superficie }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: cores.tinta }}>
                      <Link
                        to={`/municipio/${codigo}`}
                        title={`Ver o perfil completo de ${municipios[codigo]?.nomeMunicipio}`}
                        style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: cores.linhaForte, textUnderlineOffset: '3px' }}
                      >
                        {municipios[codigo]?.nomeMunicipio}
                      </Link>
                    </TableCell>
                    {colunas.map((c) => (
                      <TableCell key={c} sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: cores.tinta }}>
                        {formatar(valores[c]?.[codigo], c)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: cores.areia }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 700, color: cores.textoSobreAreia }}>
                    Mediana do Piauí
                  </TableCell>
                  {colunas.map((c) => (
                    <TableCell key={c} sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: cores.textoSobreAreia }}>
                      {formatar(medianas[c], c)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography sx={{ fontSize: '13px', color: cores.textoSuave, marginTop: '10px' }}>
            Valores nominais de {ano}. A mediana considera todos os municípios com dado neste ano e nesta coluna.
          </Typography>
          <DataSourceNote nivel="municipal" />
        </>
      )}
    </div>
  );
};

export default ComparisonPage;
