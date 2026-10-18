import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { cores } from '../../../../../../theme/tokens';
import { formatarMoedaCompacta } from './SummaryCards';
import { MUDANCAS_RREO } from '../../../../../../utils/mudancasRREO';

// Gráfico de linhas da tabela de um município (anos nas linhas da tabela).
// Carregado só quando a pessoa escolhe "Gráfico" (React.lazy no RevenueTable),
// para o Recharts não pesar a abertura da página.
// Até 4 colunas ao mesmo tempo, todas da mesma unidade (R$ ou %).

const MAX_SERIES = 4;
const ehPct = (coluna) => coluna.includes('%');
const fmtEixo = (v, pct) => (v === 0 ? '0' : pct ? `${v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%` : formatarMoedaCompacta(v).replace('R$ ', ''));
const fmtValor = (v, pct) =>
  pct ? `${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const GraficoSerie = ({ rows, types, dados, colunaInicial, notaValores }) => {
  // só colunas com algum número
  const colunas = types.filter((t) => rows.some((r) => typeof dados[t]?.[r] === 'number'));
  const [selecionadas, setSelecionadas] = useState(() => [colunaInicial && colunas.includes(colunaInicial) ? colunaInicial : colunas[0]].filter(Boolean));
  const pct = selecionadas.length ? ehPct(selecionadas[0]) : false;

  const alternar = (coluna) =>
    setSelecionadas((sel) => {
      if (sel.includes(coluna)) return sel.length > 1 ? sel.filter((c) => c !== coluna) : sel;
      // unidade diferente (R$ x %): começa uma seleção nova
      if (sel.length && ehPct(sel[0]) !== ehPct(coluna)) return [coluna];
      return [...sel, coluna].slice(-MAX_SERIES);
    });

  const pontos = useMemo(
    () =>
      [...rows]
        .sort((a, b) => Number(a) - Number(b))
        .map((ano) => ({ ano: String(ano), ...Object.fromEntries(selecionadas.map((c) => [c, typeof dados[c]?.[ano] === 'number' ? dados[c][ano] : null])) })),
    [rows, dados, selecionadas]
  );
  const anos = pontos.map((p) => Number(p.ano));
  const marcas = Object.keys(MUDANCAS_RREO)
    .map(Number)
    .filter((a) => a > Math.min(...anos) && a <= Math.max(...anos));

  return (
    <div className="rounded-[14px] border border-line bg-white p-4">
      <p className="mb-2 text-[13px] font-semibold text-texto">Colunas no gráfico (até {MAX_SERIES}, mesma unidade)</p>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Colunas no gráfico">
        {colunas.map((c) => {
          const i = selecionadas.indexOf(c);
          return (
            <button
              key={c}
              type="button"
              aria-pressed={i >= 0}
              onClick={() => alternar(c)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition-colors ${
                i >= 0 ? 'border-transparent bg-areia font-semibold text-ink' : 'border-line text-muted hover:border-brand hover:text-ink'
              }`}
            >
              {i >= 0 && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cores.series[i % cores.series.length] }} aria-hidden="true" />}
              {c}
            </button>
          );
        })}
      </div>
      {notaValores && <p className="mb-2 text-[13px] font-semibold" style={{ color: cores.atencao }}>{notaValores}</p>}
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={pontos} margin={{ top: 16, right: 16, bottom: 4, left: 8 }}>
            <CartesianGrid stroke={cores.linha} vertical={false} />
            <XAxis dataKey="ano" tick={{ fontSize: 12, fill: cores.textoSuave }} tickLine={false} axisLine={{ stroke: cores.linhaForte }} />
            <YAxis tickFormatter={(v) => fmtEixo(v, pct)} tick={{ fontSize: 12, fill: cores.textoSuave }} tickLine={false} axisLine={false} width={72} />
            <Tooltip
              formatter={(v, nome) => [v === null ? '–' : fmtValor(v, pct), nome]}
              labelFormatter={(ano) => `Ano ${ano}`}
              contentStyle={{ borderRadius: 10, borderColor: cores.linha, fontSize: 13 }}
            />
            {selecionadas.length > 1 && <Legend wrapperStyle={{ fontSize: 13 }} />}
            {marcas.map((a) => (
              <ReferenceLine
                key={a}
                x={String(a)}
                stroke="#C9A36B"
                strokeDasharray="4 4"
              />
            ))}
            {selecionadas.map((c, i) => (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                name={c}
                stroke={cores.series[i % cores.series.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {marcas.length > 0 && (
        <p className="mt-2 text-[13px] text-muted">
          <span className="mr-1 inline-block w-5 border-t-2 border-dashed align-middle" style={{ borderColor: '#C9A36B' }} aria-hidden="true" />
          Ano em que mudou o modelo do relatório de onde vêm os dados ({marcas.join(' e ')}) — compare com cuidado com os anos anteriores.
        </p>
      )}
    </div>
  );
};

export default GraficoSerie;
