import React, { useEffect, useState } from 'react';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { TABLE_MAPPINGS } from '../tables/tableConfig.js';

// Resumo no topo do perfil do município, montado com os mesmos dados que as
// seções abaixo já carregaram (MDE, Fundeb e receita de impostos).
// Ex.: "Teresina cumpriu o mínimo constitucional de 25% em Manutenção e
// Desenvolvimento do Ensino (MDE) em 8 dos 10 anos analisados (2015–2024)."

const COL_MDE = '% aplicado em MDE';
const COL_FUNDEB = '% aplicado com profissionais da Educação Básica';
const COL_RECEITA = 'Total de Receita Líquida de Impostos';
const minimoFundeb = (ano) => (Number(ano) <= 2020 ? 60 : 70);

const num = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null);
const pct = (v) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const listaAnos = (anos) => (anos.length <= 1 ? anos.join('') : `${anos.slice(0, -1).join(', ')} e ${anos[anos.length - 1]}`);
const periodoDe = (pontos) => `${pontos[0].ano}–${pontos[pontos.length - 1].ano}`;

// "R$ 2,8 bi" vira "R$ 2,8 bilhões" neste texto corrido
const moedaPorExtenso = (v) => {
  const a = Math.abs(v);
  const fmt = (x) => x.toLocaleString('pt-BR', { minimumFractionDigits: a >= 1e3 ? 1 : 2, maximumFractionDigits: a >= 1e3 ? 1 : 2 });
  const rotulo = (n, um, varios) => (Math.round(Math.abs(n) * 10) / 10 === 1 ? um : varios);
  if (a >= 1e9) return `R$ ${fmt(v / 1e9)} ${rotulo(v / 1e9, 'bilhão', 'bilhões')}`;
  if (a >= 1e6) return `R$ ${fmt(v / 1e6)} ${rotulo(v / 1e6, 'milhão', 'milhões')}`;
  if (a >= 1e3) return `R$ ${fmt(v / 1e3)} mil`;
  return `R$ ${fmt(v)}`;
};

const cumprimento = (pontos, minimoDe) => ({
  falhas: pontos.filter((p) => p.v < minimoDe(p.ano)).map((p) => p.ano),
  total: pontos.length,
  periodo: periodoDe(pontos),
});

const comparacaoMediana = (valor, mediana) => {
  if (mediana === null) return '';
  const dif = valor - mediana;
  const referencia = `mediana dos municípios do Piauí (${pct(mediana)})`;
  if (Math.abs(dif) < 0.05) return `, percentual igual à ${referencia}`;
  return `, percentual ${dif > 0 ? 'superior' : 'inferior'} à ${referencia}`;
};

// Série { ano: valor } de uma coluna, em ordem cronológica, só com valores numéricos
const serie = (secao, coluna) => {
  if (!secao?.dados?.[coluna]) return [];
  return [...secao.linhas]
    .sort((a, b) => Number(a) - Number(b))
    .map((ano) => ({ ano: String(ano), v: num(secao.dados[coluna][ano]) }))
    .filter((p) => p.v !== null);
};

// Mediana do Piauí de uma coluna num ano (todos os municípios)
const useMedianaEstadual = (tabela, coluna, ano) => {
  const [mediana, setMediana] = useState(null);
  useEffect(() => {
    setMediana(null);
    if (!ano) return undefined;
    const config = TABLE_MAPPINGS[tabela];
    let cancelado = false;
    fetchData(tabela, 'ano', { anoInicial: ano, anoFinal: ano, page: 1, limit: 10000 })
      .then((resp) => {
        const dadosAno = resp?.data?.[ano];
        if (cancelado || !dadosAno) return;
        const { typeToRowToValue } = config.transformByAno(dadosAno, config.standardize);
        const valores = Object.values(typeToRowToValue[coluna] || {}).map(num).filter((v) => v !== null).sort((a, b) => a - b);
        if (valores.length >= 10) setMediana(valores[Math.floor(valores.length / 2)]);
      })
      .catch(() => {}); // sem a mediana, a frase sai sem a comparação
    return () => {
      cancelado = true;
    };
  }, [tabela, coluna, ano]);
  return mediana;
};

const fraseMde = (nome, pontos, mediana) => {
  const ultimo = pontos[pontos.length - 1];
  const { falhas, total, periodo } = cumprimento(pontos, () => 25);
  const aplicacao = `Em ${ultimo.ano}, o município aplicou ${pct(ultimo.v)}${comparacaoMediana(ultimo.v, mediana)}.`;
  const assunto = 'o mínimo constitucional de 25% em Manutenção e Desenvolvimento do Ensino (MDE)';

  if (total === 1) {
    const verbo = falhas.length ? 'não atingiu' : 'cumpriu';
    return `Em ${ultimo.ano}, ${nome} ${verbo} ${assunto}, ao aplicar ${pct(ultimo.v)}${comparacaoMediana(ultimo.v, mediana)}.`;
  }
  if (!falhas.length) {
    return `${nome} cumpriu ${assunto} em todos os ${total} anos analisados (${periodo}). ${aplicacao}`;
  }
  if (falhas.length === total) {
    return `${nome} não atingiu ${assunto} em nenhum dos ${total} anos analisados (${periodo}). ${aplicacao}`;
  }
  return `${nome} cumpriu ${assunto} em ${total - falhas.length} dos ${total} anos analisados (${periodo}). O percentual ficou abaixo do mínimo em ${listaAnos(falhas)}. ${aplicacao}`;
};

const fraseFundeb = (nome, pontos) => {
  const ultimo = pontos[pontos.length - 1];
  const minimo = minimoFundeb(ultimo.ano);
  const relacao = ultimo.v + 0.05 < minimo
    ? `abaixo do mínimo legal de ${minimo}%`
    : ultimo.v - 0.05 > minimo
      ? `superando o mínimo legal de ${minimo}%`
      : `atingindo o mínimo legal de ${minimo}%`;
  const abertura = `Em ${ultimo.ano}, ${nome} destinou ${pct(ultimo.v)} dos recursos do Fundeb ao pagamento dos profissionais da educação básica, ${relacao}.`;
  if (pontos.length === 1) return abertura;

  const { falhas, total, periodo } = cumprimento(pontos, minimoFundeb);
  if (!falhas.length) return `${abertura} O município cumpriu esse mínimo em todos os ${total} anos analisados (${periodo}).`;
  if (falhas.length === total) return `${abertura} O município não atingiu esse mínimo em nenhum dos ${total} anos analisados (${periodo}).`;
  return `${abertura} O município cumpriu esse mínimo em ${total - falhas.length} dos ${total} anos analisados (${periodo}). O percentual ficou abaixo do mínimo em ${listaAnos(falhas)}.`;
};

const fraseReceita = (pontos) => {
  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];
  const variacao = ((ultimo.v - primeiro.v) / Math.abs(primeiro.v)) * 100;
  if (!(primeiro.v > 0) || !Number.isFinite(variacao)) return null;
  const sentido = Math.abs(variacao) < 0.05
    ? `sem variação nominal em relação a ${primeiro.ano}`
    : variacao > 0
      ? `representando um crescimento nominal de ${pct(variacao)} em relação a ${primeiro.ano}`
      : `representando uma redução nominal de ${pct(Math.abs(variacao))} em relação a ${primeiro.ano}`;
  return `A receita líquida de impostos, que constitui a base de cálculo do mínimo constitucional destinado à MDE, totalizou ${moedaPorExtenso(ultimo.v)} em ${ultimo.ano}, ${sentido}, sem correção pela inflação.`;
};

const ResumoEmTexto = ({ nome, secoes }) => {
  const mde = serie(secoes.constitutionalLimitMde, COL_MDE);
  const fundeb = serie(secoes.expensesBasicEducationFundeb, COL_FUNDEB);
  const receita = serie(secoes.municipalTaxesRevenues, COL_RECEITA);
  const ultimoMde = mde[mde.length - 1];
  const mediana = useMedianaEstadual('constitutionalLimitMde', COL_MDE, ultimoMde?.ano);

  const frases = [
    ultimoMde && fraseMde(nome, mde, mediana),
    fundeb.length && fraseFundeb(nome, fundeb),
    receita.length >= 2 && fraseReceita(receita),
  ].filter(Boolean);

  const carregando = ['constitutionalLimitMde', 'expensesBasicEducationFundeb', 'municipalTaxesRevenues'].some((t) => !secoes[t]);
  if (!frases.length) {
    if (!carregando) return null;
    return (
      <div className="mb-10 rounded-2xl border border-line bg-white p-6" aria-hidden="true">
        <div className="mb-3 h-4 w-40 animate-pulse rounded bg-areia" />
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-areia" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-areia" />
      </div>
    );
  }

  return (
    <section className="sem-quebra mb-10 rounded-2xl border border-line bg-white p-6" aria-label="Resumo">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand">Em resumo</p>
      <div className="space-y-2 text-[17px] leading-relaxed text-texto">
        {frases.map((f) => (
          <p key={f}>{f}</p>
        ))}
      </div>
    </section>
  );
};

export default ResumoEmTexto;
