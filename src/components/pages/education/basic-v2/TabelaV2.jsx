import React from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { carregarXLSX } from '../../../../utils/bibliotecasExportacao';

const formatar = (n) => Number(n).toLocaleString('pt-BR');

/**
 * Pivota os dados longos da API para exibição:
 * - 1D: linhas = valores da dimensão, colunas = anos;
 * - 2D: uma tabela por ano, linhas = dim1, colunas = dim2 (+ coluna Total).
 */
function pivotar1D(dados) {
  const anos = [...new Set(dados.map((d) => d.ano))].sort((a, b) => a - b);
  const linhas = new Map();

  for (const d of dados) {
    if (!linhas.has(d.dim1.valor)) linhas.set(d.dim1.valor, {});
    const linha = linhas.get(d.dim1.valor);
    linha[d.ano] = (linha[d.ano] || 0) + d.total;
  }

  return {
    colunas: anos,
    linhas: [...linhas.entries()]
      .map(([valor, porAno]) => ({ valor, porAno }))
      .sort((a, b) => a.valor.localeCompare(b.valor, 'pt-BR')),
  };
}

function pivotar2DPorAno(dados) {
  const porAno = new Map();

  for (const d of dados) {
    if (!porAno.has(d.ano)) porAno.set(d.ano, []);
    porAno.get(d.ano).push(d);
  }

  return [...porAno.entries()]
    .sort(([a], [b]) => a - b)
    .map(([ano, itens]) => {
      const colunas = [...new Set(itens.map((d) => d.dim2.valor))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      );
      const linhas = new Map();

      for (const d of itens) {
        if (!linhas.has(d.dim1.valor)) linhas.set(d.dim1.valor, {});
        const linha = linhas.get(d.dim1.valor);
        linha[d.dim2.valor] = (linha[d.dim2.valor] || 0) + d.total;
      }

      return {
        ano,
        colunas,
        linhas: [...linhas.entries()]
          .map(([valor, porColuna]) => ({
            valor,
            porColuna,
            total: colunas.reduce((soma, c) => soma + (porColuna[c] || 0), 0),
          }))
          .sort((a, b) => a.valor.localeCompare(b.valor, 'pt-BR')),
      };
    });
}

const CabecalhoCelula = ({ children, align = 'left' }) => (
  <TableCell
    align={align}
    sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', whiteSpace: 'nowrap' }}
  >
    {children}
  </TableCell>
);

// Algarismos tabulares: todos os dígitos com a mesma largura, para as colunas
// numéricas ficarem alinhadas verticalmente entre as linhas.
const CelulaNumero = ({ children, destaque = false }) => (
  <TableCell
    align="right"
    sx={{ fontVariantNumeric: 'tabular-nums', ...(destaque && { fontWeight: 'bold' }) }}
  >
    {children}
  </TableCell>
);

const Tabela1D = ({ dados, labelDimensao }) => {
  const { colunas, linhas } = pivotar1D(dados);
  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <CabecalhoCelula>{labelDimensao}</CabecalhoCelula>
            {colunas.map((ano) => (
              <CabecalhoCelula key={ano} align="right">
                {ano}
              </CabecalhoCelula>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {linhas.map((linha) => (
            <TableRow key={linha.valor} hover>
              <TableCell>{linha.valor}</TableCell>
              {colunas.map((ano) => (
                <CelulaNumero key={ano}>
                  {linha.porAno[ano] !== undefined
                    ? formatar(linha.porAno[ano])
                    : '—'}
                </CelulaNumero>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Tabela2D = ({ dados, labelDim1, labelDim2 }) => {
  const tabelas = pivotar2DPorAno(dados);
  return (
    <>
      {tabelas.map(({ ano, colunas, linhas }) => (
        <Box key={ano} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            {ano} — {labelDim1} × {labelDim2}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <CabecalhoCelula>{labelDim1}</CabecalhoCelula>
                  {colunas.map((c) => (
                    <CabecalhoCelula key={c} align="right">
                      {c}
                    </CabecalhoCelula>
                  ))}
                  <CabecalhoCelula align="right">Total</CabecalhoCelula>
                </TableRow>
              </TableHead>
              <TableBody>
                {linhas.map((linha) => (
                  <TableRow key={linha.valor} hover>
                    <TableCell>{linha.valor}</TableCell>
                    {colunas.map((c) => (
                      <CelulaNumero key={c}>
                        {linha.porColuna[c] !== undefined
                          ? formatar(linha.porColuna[c])
                          : '—'}
                      </CelulaNumero>
                    ))}
                    <CelulaNumero destaque>{formatar(linha.total)}</CelulaNumero>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );
};

/**
 * Renderiza a resposta do endpoint /v2/educacao/fatos.
 * Séries continua/composta chegam em `dados`; séries quebradas chegam em
 * `segmentos` por era e são exibidas SEPARADAMENTE, nunca emendadas.
 */
const TabelaV2 = ({ resposta, titulo }) => {
  if (!resposta) return null;

  const { meta } = resposta;
  const segmentos = resposta.segmentos || [{ era: null, dados: resposta.dados }];

  const exportarXlsx = async () => {
    // Export em formato longo: uma linha por fato, com era quando houver
    const linhas = [];
    for (const seg of segmentos) {
      for (const d of seg.dados) {
        const linha = { Ano: d.ano };
        if (seg.era) linha['Período Metodológico'] = seg.era.label;
        if (d.localidade) linha['Localidade'] = d.localidade.nome;
        linha[d.dim1.label] = d.dim1.valor;
        if (d.dim2) linha[d.dim2.label] = d.dim2.valor;
        linha['Total'] = d.total;
        linhas.push(linha);
      }
    }

    const XLSX = await carregarXLSX();
    const worksheet = XLSX.utils.json_to_sheet(linhas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const nome = `v2_${meta.indicador}_${meta.recorte}`.replace(/\W+/g, '_');
    saveAs(new Blob([buffer]), `${nome}.xlsx`);
  };

  const temDados = segmentos.some((s) => s.dados.length > 0);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {titulo}
        </Typography>
        {temDados && (
          <Button variant="contained" color="success" onClick={exportarXlsx}>
            Baixar XLSX
          </Button>
        )}
      </Box>

      {meta.nota && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {meta.nota}
        </Alert>
      )}

      {!temDados && (
        <Typography sx={{ color: 'text.secondary', my: 4 }}>
          Nenhum dado encontrado para os filtros selecionados.
        </Typography>
      )}

      {segmentos.map((seg, i) => {
        if (!seg.dados.length) return null;

        const exemplo = seg.dados[0];
        const is2D = !!exemplo.dim2;

        return (
          <Box key={seg.era?.id ?? i} sx={{ mb: 4 }}>
            {seg.era && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <strong>{seg.era.label}</strong>
                {seg.era.nota ? ` — ${seg.era.nota}` : ''}
              </Alert>
            )}
            {is2D ? (
              <Tabela2D
                dados={seg.dados}
                labelDim1={exemplo.dim1.label}
                labelDim2={exemplo.dim2.label}
              />
            ) : (
              <Tabela1D dados={seg.dados} labelDimensao={exemplo.dim1.label} />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default TabelaV2;
