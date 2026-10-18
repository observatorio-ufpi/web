import React, { useEffect, useState } from "react";
import { fetchIPCAData, calculateMonetaryCorrection } from "../../../../../../utils/bacenApi";
import { Box, Typography, Tooltip } from "@mui/material";
import { cores } from "../../../../../../theme/tokens";
import { municipios as municipiosMapa } from "../../../../../../utils/municipios.mapping.jsx";

// Cards de resumo acima da tabela. Calculados a partir dos MESMOS números
// exibidos na tabela (inclusive corrigidos pelo IPCA, quando ligado) — não há
// nenhum dado extra aqui. Cada tabela declara seus cards em TABLE_MAPPINGS.resumo:
//   { card: "total",       coluna, rotulo }        valor do último ano (ou soma dos municípios)
//   { card: "maiorParte",  total, partes?, rotulo } maior componente e sua fatia do total
//   { card: "evolucao",    coluna, rotulo }        mini-gráfico por ano (ou maior/menor município)
//   { card: "limite",      coluna, minimo, rotulo, zeroSemAplicacao? } % do último ano vs mínimo legal
//        zeroSemAplicacao: 0% significa que a regra não se aplica (ex.: VAAT — só vale
//        para quem recebe a complementação), então zero não conta como "abaixo do mínimo"
//   { card: "cumprimento", coluna, minimo, rotulo } em quantos anos/municípios cumpriu
//   { card: "saldo",       coluna, rotulo }        ganho/perda (ex.: redistribuição do Fundeb)
// `minimo` pode ser número ou função (ano) => número.
//
// modo "anos": linhas da tabela são anos (um município)
// modo "municipios": linhas são municípios (um ano)

// IPCA mensal (Banco Central), buscado uma vez e compartilhado por todos os cards
let promessaIpca = null;
const carregarIpca = () => {
  if (!promessaIpca) {
    const hoje = new Date().toLocaleDateString("pt-BR");
    promessaIpca = fetchIPCAData("01/01/2006", hoje).catch(() => {
      promessaIpca = null; // permite tentar de novo numa próxima vez
      return null;
    });
  }
  return promessaIpca;
};
const useIpca = (ativo) => {
  const [ipca, setIpca] = useState(null);
  useEffect(() => {
    if (!ativo) return undefined;
    let cancelado = false;
    carregarIpca().then((d) => !cancelado && setIpca(d));
    return () => {
      cancelado = true;
    };
  }, [ativo]);
  return ipca;
};

const numero = (v) => (typeof v === "number" && !Number.isNaN(v) ? v : null);

export const formatarMoedaCompacta = (v) => {
  const a = Math.abs(v);
  const fmt = (x) => x.toLocaleString("pt-BR", { maximumFractionDigits: a >= 1e3 ? 1 : 2, minimumFractionDigits: a >= 1e3 ? 1 : 2 });
  if (a >= 1e9) return `R$ ${fmt(v / 1e9)} bi`;
  if (a >= 1e6) return `R$ ${fmt(v / 1e6)} mi`;
  if (a >= 1e3) return `R$ ${fmt(v / 1e3)} mil`;
  return `R$ ${fmt(v)}`;
};

const formatarPct = (v) =>
  `${v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

// Comparação com os outros municípios no mesmo ano (`referencia`, só no modo "anos").
// Usa os valores nominais de todos os municípios naquele ano: a posição não depende
// da correção monetária (todos estão no mesmo ano), e a mediana é mostrada como nominal.
const compararComEstado = (referencia, coluna, ano) => {
  if (!referencia || String(referencia.ano) !== String(ano)) return null;
  const porMunicipio = referencia.valores?.[coluna];
  if (!porMunicipio) return null;
  const valores = Object.values(porMunicipio).filter((v) => numero(v) !== null);
  const proprio = numero(porMunicipio[referencia.codigo]);
  if (valores.length < 10 || proprio === null) return null;
  const ordenados = [...valores].sort((a, b) => b - a);
  const crescente = [...valores].sort((a, b) => a - b);
  // Mesma comparação dentro do território de desenvolvimento do município
  // (só com 3 ou mais municípios com dado, para a mediana fazer sentido)
  const territorio = municipiosMapa[referencia.codigo]?.territorioDesenvolvimento;
  const doTerritorio = territorio
    ? Object.entries(porMunicipio)
        .filter(([c, v]) => numero(v) !== null && municipiosMapa[c]?.territorioDesenvolvimento === territorio)
        .map(([, v]) => v)
    : [];
  const terrCrescente = [...doTerritorio].sort((a, b) => a - b);
  return {
    posicao: ordenados.indexOf(proprio) + 1,
    total: valores.length,
    mediana: crescente[Math.floor(crescente.length / 2)],
    territorio:
      doTerritorio.length >= 3
        ? {
            nome: territorio,
            posicao: [...doTerritorio].sort((a, b) => b - a).indexOf(proprio) + 1,
            total: doTerritorio.length,
            mediana: terrCrescente[Math.floor(terrCrescente.length / 2)],
          }
        : null,
  };
};

const minimoDoAno = (minimo, ano) => (typeof minimo === "function" ? minimo(Number(ano)) : minimo);

// ---------- peças visuais ----------

const Card = ({ rotulo, children }) => (
  <Box
    sx={{
      backgroundColor: cores.superficie,
      border: `1px solid ${cores.linha}`,
      borderRadius: "14px",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: 0,
      animation: "cardEntrada 280ms ease both",
      "@keyframes cardEntrada": {
        from: { opacity: 0, transform: "translateY(4px)" },
        to: { opacity: 1, transform: "none" },
      },
      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    }}
  >
    <Typography sx={{ fontSize: "13px", color: cores.textoSuave, lineHeight: 1.35 }}>{rotulo}</Typography>
    {children}
  </Box>
);

const Valor = ({ children }) => (
  <Typography
    sx={{ fontSize: "24px", lineHeight: 1.25, fontWeight: 700, color: cores.tinta, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}
  >
    {children}
  </Typography>
);

const Nota = ({ children, cor = cores.texto, forte = false }) => (
  <Typography sx={{ fontSize: "13px", lineHeight: 1.4, color: cor, fontWeight: forte ? 600 : 400 }}>{children}</Typography>
);

const Selo = ({ atende }) => (
  <Box
    component="span"
    sx={{
      alignSelf: "flex-start",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      backgroundColor: atende ? "#E3F0E9" : "#F6E1DD",
      color: atende ? cores.atende : cores.naoAtende,
    }}
  >
    {atende ? "Atende o mínimo" : "Abaixo do mínimo"}
  </Box>
);

// Barras simples; `itens` = [{ rotulo, valor, cor }]
const MiniBarras = ({ itens, linhaEm = null }) => {
  const max = Math.max(...itens.map((i) => Math.abs(i.valor)), linhaEm || 0) || 1;
  return (
    <Box sx={{ position: "relative", marginTop: "4px" }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "56px" }}>
        {itens.map((i) => (
          <Tooltip key={i.rotulo} title={`${i.rotulo}: ${i.texto}`} arrow enterTouchDelay={0}>
            <Box
              sx={{
                flex: 1,
                minWidth: "4px",
                height: `${Math.max(4, (Math.abs(i.valor) / max) * 56)}px`,
                borderRadius: "4px 4px 0 0",
                backgroundColor: i.cor,
                transition: "opacity 120ms ease",
                "&:hover": { opacity: 0.8 },
              }}
            />
          </Tooltip>
        ))}
      </Box>
      {linhaEm !== null && (
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `${(linhaEm / max) * 56}px`,
            borderTop: `1px dashed ${cores.texto}`,
          }}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <Typography sx={{ fontSize: "11px", color: cores.textoSuave }}>{itens[0]?.rotulo}</Typography>
        <Typography sx={{ fontSize: "11px", color: cores.textoSuave }}>{itens[itens.length - 1]?.rotulo}</Typography>
      </Box>
    </Box>
  );
};

// ---------- cálculo de cada card ----------

const montarCard = (cfg, ctx) => {
  const { linhas, valor, nomeLinha, modo, correcaoAtiva } = ctx;
  const comValor = (coluna) => linhas.filter((l) => numero(valor(coluna, l)) !== null);

  if (cfg.card === "total") {
    const ls = comValor(cfg.coluna);
    if (!ls.length) return null;
    if (modo === "anos") {
      const ultimo = ls[ls.length - 1];
      const anterior = ls.length > 1 ? ls[ls.length - 2] : null;
      const v = valor(cfg.coluna, ultimo);
      const va = anterior ? valor(cfg.coluna, anterior) : null;
      const variacao = va ? ((v - va) / Math.abs(va)) * 100 : null;
      return (
        <Card rotulo={`${cfg.rotulo} em ${ultimo}`}>
          <Valor>{formatarMoedaCompacta(v)}</Valor>
          {variacao !== null && Number.isFinite(variacao) && (
            <Nota cor={variacao >= 0 ? cores.atende : cores.naoAtende} forte>
              {variacao >= 0 ? "▲" : "▼"} {formatarPct(Math.abs(variacao))} em relação a {anterior}
              {!correcaoAtiva && <span style={{ fontWeight: 400, color: cores.textoSuave }}> (nominal)</span>}
            </Nota>
          )}
          {(() => {
            // Variação real: o valor do ano anterior atualizado pelo IPCA até o fim do último ano
            if (correcaoAtiva || !ctx.ipca || !va || variacao === null) return null;
            const fator = calculateMonetaryCorrection(1, `31/12/${anterior}`, `31/12/${ultimo}`, ctx.ipca);
            const real = ((v - va * fator) / Math.abs(va * fator)) * 100;
            if (!Number.isFinite(real)) return null;
            return (
              <Nota cor={cores.textoSuave}>
                {real >= 0 ? "▲" : "▼"} {formatarPct(Math.abs(real))} descontada a inflação (IPCA)
              </Nota>
            );
          })()}
          {(() => {
            const comp = compararComEstado(ctx.referencia, cfg.coluna, ultimo);
            return comp ? (
              <>
                <Nota cor={cores.textoSuave}>
                  {comp.posicao}º maior de {comp.total} municípios · mediana do Piauí: {formatarMoedaCompacta(comp.mediana)}
                </Nota>
                {comp.territorio && (
                  <Nota cor={cores.textoSuave}>
                    {comp.territorio.posicao}º de {comp.territorio.total} no território {comp.territorio.nome} · mediana: {formatarMoedaCompacta(comp.territorio.mediana)}
                  </Nota>
                )}
              </>
            ) : null;
          })()}
        </Card>
      );
    }
    const soma = ls.reduce((acc, l) => acc + valor(cfg.coluna, l), 0);
    return (
      <Card rotulo={`${cfg.rotulo} — soma dos municípios`}>
        <Valor>{formatarMoedaCompacta(soma)}</Valor>
        <Nota>
          {ls.length} municípios · média de {formatarMoedaCompacta(soma / ls.length)}
        </Nota>
      </Card>
    );
  }

  if (cfg.card === "maiorParte") {
    const partes = (cfg.partes || ctx.types.filter((t) => t !== cfg.total)).filter((t) => t !== cfg.total);
    const linhasConsideradas = modo === "anos" ? comValor(cfg.total).slice(-1) : comValor(cfg.total);
    if (!linhasConsideradas.length) return null;
    const somaTotal = linhasConsideradas.reduce((acc, l) => acc + valor(cfg.total, l), 0);
    const somasPartes = partes
      .map((p) => ({ p, v: linhasConsideradas.reduce((acc, l) => acc + (numero(valor(p, l)) || 0), 0) }))
      .filter((x) => x.v > 0)
      .sort((a, b) => b.v - a.v);
    if (!somasPartes.length || !somaTotal) return null;
    const maior = somasPartes[0];
    const fatia = (maior.v / somaTotal) * 100;
    return (
      <Card rotulo={modo === "anos" ? `${cfg.rotulo} em ${linhasConsideradas[0]}` : `${cfg.rotulo} — soma dos municípios`}>
        {/* Nome da coluna sem o detalhamento entre parênteses; nomes longos em letra menor */}
        {(() => {
          const nomeCurto = maior.p.replace(/\s*\(.*\)\s*$/, '');
          return nomeCurto.length > 28 ? (
            <Typography sx={{ fontSize: '17px', lineHeight: 1.3, fontWeight: 700, color: cores.tinta }}>{nomeCurto}</Typography>
          ) : (
            <Valor>{nomeCurto}</Valor>
          );
        })()}
        <Nota>
          {formatarPct(fatia)} do total ({formatarMoedaCompacta(maior.v)})
        </Nota>
      </Card>
    );
  }

  if (cfg.card === "evolucao") {
    const ls = comValor(cfg.coluna);
    if (modo === "anos") {
      if (ls.length < 2) return null;
      const ultimos = ls.slice(-18); // série inteira (2007–2024)
      return (
        <Card rotulo={cfg.rotulo}>
          <MiniBarras
            itens={ultimos.map((l, i) => ({
              rotulo: String(l),
              valor: valor(cfg.coluna, l),
              texto: formatarMoedaCompacta(valor(cfg.coluna, l)),
              cor: i === ultimos.length - 1 ? cores.marca : cores.linhaForte,
            }))}
          />
        </Card>
      );
    }
    if (ls.length < 2) return null;
    const ordenadas = [...ls].sort((a, b) => valor(cfg.coluna, b) - valor(cfg.coluna, a));
    const maior = ordenadas[0];
    const menor = ordenadas[ordenadas.length - 1];
    return (
      <Card rotulo={`${cfg.rotulo} — maior e menor`}>
        <Nota forte>
          ▲ {nomeLinha(maior)}: {formatarMoedaCompacta(valor(cfg.coluna, maior))}
        </Nota>
        <Nota forte>
          ▼ {nomeLinha(menor)}: {formatarMoedaCompacta(valor(cfg.coluna, menor))}
        </Nota>
      </Card>
    );
  }

  if (cfg.card === "limite") {
    const todas = comValor(cfg.coluna);
    if (!todas.length) return null;
    const ls = cfg.zeroSemAplicacao ? todas.filter((l) => valor(cfg.coluna, l) > 0) : todas;
    if (!ls.length) {
      return (
        <Card rotulo={cfg.rotulo}>
          <Valor>Não se aplica</Valor>
          <Nota cor={cores.textoSuave}>{cfg.textoSemAplicacao}</Nota>
        </Card>
      );
    }
    if (modo === "anos") {
      const ultimo = ls[ls.length - 1];
      const v = valor(cfg.coluna, ultimo);
      const min = minimoDoAno(cfg.minimo, ultimo);
      return (
        <Card rotulo={`${cfg.rotulo} em ${ultimo}`}>
          <Valor>{formatarPct(v)}</Valor>
          <Selo atende={v >= min} />
          <Nota cor={cores.textoSuave}>Mínimo legal: {formatarPct(min)}</Nota>
          {(() => {
            const comp = compararComEstado(ctx.referencia, cfg.coluna, ultimo);
            return comp ? (
              <>
                <Nota cor={cores.textoSuave}>Mediana do Piauí: {formatarPct(comp.mediana)}</Nota>
                {comp.territorio && (
                  <Nota cor={cores.textoSuave}>
                    Mediana do território {comp.territorio.nome}: {formatarPct(comp.territorio.mediana)}
                  </Nota>
                )}
              </>
            ) : null;
          })()}
        </Card>
      );
    }
    const ano = ctx.anoReferencia;
    const min = minimoDoAno(cfg.minimo, ano);
    const valores = ls.map((l) => valor(cfg.coluna, l)).sort((a, b) => a - b);
    const mediana = valores[Math.floor(valores.length / 2)];
    const abaixo = valores.filter((v) => v < min).length;
    return (
      <Card rotulo={`${cfg.rotulo} — mediana dos municípios`}>
        <Valor>{formatarPct(mediana)}</Valor>
        <Nota cor={cores.textoSuave}>
          Mínimo legal: {formatarPct(min)}
          {cfg.zeroSemAplicacao && ` · ${ls.length} município(s) com complementação`}
          {cfg.zeroSemAplicacao && abaixo > 0 && `, ${abaixo} abaixo do mínimo`}
        </Nota>
      </Card>
    );
  }

  if (cfg.card === "cumprimento") {
    const ls = comValor(cfg.coluna);
    if (!ls.length) return null;
    if (modo === "anos") {
      const cumpriu = ls.filter((l) => valor(cfg.coluna, l) >= minimoDoAno(cfg.minimo, l));
      const ultimos = ls.slice(-18); // série inteira (2007–2024)
      const minUltimo = minimoDoAno(cfg.minimo, ls[ls.length - 1]);
      return (
        <Card rotulo={cfg.rotulo}>
          <Valor>
            {cumpriu.length} de {ls.length} anos
          </Valor>
          <MiniBarras
            linhaEm={minUltimo}
            itens={ultimos.map((l) => {
              const v = valor(cfg.coluna, l);
              const ok = v >= minimoDoAno(cfg.minimo, l);
              return { rotulo: String(l), valor: v, texto: `${formatarPct(v)}${ok ? "" : " (abaixo do mínimo)"}`, cor: ok ? cores.atende : cores.naoAtende };
            })}
          />
        </Card>
      );
    }
    const min = minimoDoAno(cfg.minimo, ctx.anoReferencia);
    const abaixo = ls.filter((l) => valor(cfg.coluna, l) < min);
    const pior = [...ls].sort((a, b) => valor(cfg.coluna, a) - valor(cfg.coluna, b))[0];
    return (
      <Card rotulo={cfg.rotulo}>
        <Valor>
          {ls.length - abaixo.length} de {ls.length} municípios
        </Valor>
        <Nota cor={abaixo.length ? cores.naoAtende : cores.atende} forte>
          {abaixo.length
            ? `${abaixo.length} abaixo do mínimo · menor: ${nomeLinha(pior)} (${formatarPct(valor(cfg.coluna, pior))})`
            : "Todos atingiram o mínimo"}
        </Nota>
      </Card>
    );
  }

  if (cfg.card === "saldo") {
    const ls = comValor(cfg.coluna);
    if (!ls.length) return null;
    if (modo === "anos") {
      const ultimo = ls[ls.length - 1];
      const v = valor(cfg.coluna, ultimo);
      return (
        <Card rotulo={`${cfg.rotulo} em ${ultimo}`}>
          <Valor>{formatarMoedaCompacta(v)}</Valor>
          <Nota cor={v >= 0 ? cores.atende : cores.naoAtende} forte>
            {v >= 0 ? "Recebeu mais do que contribuiu" : "Contribuiu mais do que recebeu"}
          </Nota>
        </Card>
      );
    }
    const ganharam = ls.filter((l) => valor(cfg.coluna, l) >= 0).length;
    return (
      <Card rotulo={cfg.rotulo}>
        <Valor>
          {ganharam} de {ls.length} municípios
        </Valor>
        <Nota>receberam mais do que contribuíram</Nota>
      </Card>
    );
  }

  return null;
};

const SummaryCards = ({ resumo, rows, types, dados, modo, nomeLinha, correcaoAtiva, anoReferencia, referencia = null }) => {
  // IPCA só é necessário quando há card de total por ano e a correção da tabela está desligada
  const precisaIpca = modo === "anos" && !correcaoAtiva && (resumo || []).some((c) => c.card === "total");
  const ipca = useIpca(precisaIpca);
  if (!resumo || !resumo.length || !rows.length) return null;

  // modo "anos": garante ordem cronológica
  const linhas = modo === "anos" ? [...rows].sort((a, b) => Number(a) - Number(b)) : rows;
  const valor = (coluna, linha) => (dados[coluna] ? dados[coluna][linha] : undefined);
  const ctx = { linhas, valor, nomeLinha, modo, correcaoAtiva, types, anoReferencia, referencia, ipca };

  const cards = resumo
    .map((cfg, i) => ({ chave: `${cfg.card}-${cfg.coluna || cfg.total}-${i}`, el: montarCard(cfg, ctx) }))
    .filter((c) => c.el);
  if (!cards.length) return null;

  return (
    <Box
      component="section"
      aria-label="Resumo"
      className="cards-resumo"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: `repeat(${Math.min(cards.length, 3)}, minmax(0, 1fr))` },
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {cards.map((c) => (
        <React.Fragment key={c.chave}>{c.el}</React.Fragment>
      ))}
    </Box>
  );
};

export default SummaryCards;
