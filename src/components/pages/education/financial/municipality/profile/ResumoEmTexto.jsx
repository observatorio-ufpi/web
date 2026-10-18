import React, { useEffect, useState } from 'react';
import { fetchData } from '../../../../../../services/apiService.jsx';
import { TABLE_MAPPINGS } from '../tables/tableConfig.js';
import { formatarMoedaCompacta } from '../tables/SummaryCards';

// Resumo em linguagem simples no topo do perfil do município, montado com os
// mesmos dados que as seções abaixo já carregaram (MDE, Fundeb e receita de impostos).
// Ex.: "Nazaré do Piauí cumpriu o mínimo de 25% em MDE em todos os 10 anos com dados
// (2015–2024) e aplicou 31,7% em 2024, acima da mediana do Piauí (27,7%)."

const COL_MDE = '% aplicado em MDE';
const COL_FUNDEB = '% aplicado com profissionais da Educação Básica';
const COL_RECEITA = 'Total de Receita Líquida de Impostos';
const minimoFundeb = (ano) => (Number(ano) <= 2020 ? 60 : 70);

const num = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null);
const pct = (v) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const listaAnos = (anos) => (anos.length <= 1 ? anos.join('') : `${anos.slice(0, -1).join(', ')} e ${anos[anos.length - 1]}`);

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

const fraseCumprimento = (pontos, minimoDe) => {
  const falhas = pontos.filter((p) => p.v < minimoDe(p.ano)).map((p) => p.ano);
  const periodo = `${pontos[0].ano}–${pontos[pontos.length - 1].ano}`;
  if (!falhas.length) return pontos.length === 1 ? `em ${pontos[0].ano}` : `em todos os ${pontos.length} anos com dados (${periodo})`;
  if (falhas.length === pontos.length) return null;
  return `em ${pontos.length - falhas.length} dos ${pontos.length} anos com dados (${periodo}); ficou abaixo em ${listaAnos(falhas)}`;
};

const ResumoEmTexto = ({ nome, secoes }) => {
  const mde = serie(secoes.constitutionalLimitMde, COL_MDE);
  const fundeb = serie(secoes.expensesBasicEducationFundeb, COL_FUNDEB);
  const receita = serie(secoes.municipalTaxesRevenues, COL_RECEITA);
  const ultimoMde = mde[mde.length - 1];
  const mediana = useMedianaEstadual('constitutionalLimitMde', COL_MDE, ultimoMde?.ano);

  const frases = [];
  if (ultimoMde) {
    const cumpriu = fraseCumprimento(mde, () => 25);
    let comparacao = '';
    if (mediana !== null) {
      const dif = ultimoMde.v - mediana;
      comparacao = Math.abs(dif) < 0.05 ? `, igual à mediana do Piauí` : `, ${dif > 0 ? 'acima' : 'abaixo'} da mediana do Piauí (${pct(mediana)})`;
    }
    frases.push(
      cumpriu
        ? `${nome} cumpriu o mínimo de 25% em MDE ${cumpriu} e aplicou ${pct(ultimoMde.v)} em ${ultimoMde.ano}${comparacao}.`
        : `${nome} não atingiu o mínimo de 25% em MDE em nenhum dos anos com dados; em ${ultimoMde.ano} aplicou ${pct(ultimoMde.v)}${comparacao}.`
    );
  }
  const ultimoFundeb = fundeb[fundeb.length - 1];
  if (ultimoFundeb) {
    const cumpriu = fraseCumprimento(fundeb, minimoFundeb);
    const inicio = `Com profissionais da educação, aplicou ${pct(ultimoFundeb.v)} do Fundeb em ${ultimoFundeb.ano} (mínimo de ${minimoFundeb(ultimoFundeb.ano)}%)`;
    frases.push(cumpriu ? `${inicio} e cumpriu o mínimo ${cumpriu}.` : `${inicio}, sem atingir o mínimo em nenhum ano com dados.`);
  }
  if (receita.length >= 2) {
    const primeiro = receita[0];
    const ultimo = receita[receita.length - 1];
    const variacao = ((ultimo.v - primeiro.v) / Math.abs(primeiro.v)) * 100;
    if (primeiro.v > 0 && Number.isFinite(variacao)) {
      frases.push(
        `A receita líquida de impostos, base do cálculo do mínimo em MDE, foi de ${formatarMoedaCompacta(ultimo.v)} em ${ultimo.ano}, ${variacao >= 0 ? 'alta' : 'queda'} de ${pct(Math.abs(variacao))} em relação a ${primeiro.ano} (valores nominais, sem descontar a inflação).`
      );
    }
  }

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
