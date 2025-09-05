import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const HistoricalChart = ({ data, type, isEtapaSelected, isLocalidadeSelected, isDependenciaSelected,
  isVinculoSelected, isFormacaoDocenteSelected, isFaixaEtariaSelected, isInstructionLevelSelected }) => {
  if (!data || !data.result) {
    return null;
  }

  // Determinar qual coluna extra usar (mesma lógica do renderHistoricalTable)
  const getExtraColumn = () => {
    if (isEtapaSelected) {
      if (type === 'school/count') {
        return {
          name: 'arrangement_name',
          label: 'Etapa'
        };
      } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
        return {
          name: 'education_level_short_name',
          label: 'Etapa'
        };
      } else {
        return {
          name: 'education_level_mod_name',
          label: 'Etapa'
        };
      }
    }
    if (isLocalidadeSelected) return { name: 'location_name', label: 'Localidade' };
    if (isDependenciaSelected) return { name: 'adm_dependency_detailed_name', label: 'Dependência' };
    if (isVinculoSelected) return { name: 'contract_type_name', label: 'Vínculo' };
    if (isFormacaoDocenteSelected) return { name: 'initial_training_name', label: 'Formação Docente' };
    if (isFaixaEtariaSelected) return { name: 'age_range_name', label: 'Faixa Etária' };
    if (isInstructionLevelSelected) return { name: 'instruction_level_name', label: 'Nível de Instrução' };
    return null;
  };

  const extraColumn = getExtraColumn();

  // Processar dados para o gráfico
  let chartData;
  if (!extraColumn) {
    // Dados simples sem filtros
    const yearMap = new Map();
    data.result.forEach(item => {
      yearMap.set(item.year, (yearMap.get(item.year) || 0) + Number(item.total || 0));
    });

    chartData = Array.from(yearMap.entries())
      .map(([year, total]) => ({ year, total }))
      .sort((a, b) => a.year - b.year);
  } else {
    // Dados com categorias
    const categoryYearMap = new Map();
    data.result.forEach(item => {
      const year = item.year;
      const category = item[extraColumn.name];

      if (!categoryYearMap.has(year)) {
        categoryYearMap.set(year, {});
      }
      categoryYearMap.get(year)[category] = Number(item.total) || 0;
    });

    chartData = Array.from(categoryYearMap.entries())
      .map(([year, categories]) => ({
        year,
        ...categories
      }))
      .sort((a, b) => a.year - b.year);
  }

  // Obter todas as linhas (exceto 'year')
  const lines = chartData.length > 0
    ? Object.keys(chartData[0]).filter(key => key !== 'year')
    : [];

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
    '#d0ed57', '#83a6ed', '#8dd1e1', '#ff6b6b', '#4ecdc4',
    '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'
  ];

  // Função para formatar valores no tooltip
  const formatTooltipValue = (value, name) => {
    const formattedValue = typeof value === 'number' ? value.toLocaleString('pt-BR') : value;
    return [formattedValue, name];
  };

  // Função para formatar valores no eixo Y
  const formatYAxisValue = (value) => {
    return typeof value === 'number' ? value.toLocaleString('pt-BR') : value;
  };

  return (
    <div style={{
      height: 500,
      marginTop: '2rem',
      border: '2px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: '#666' }}
            label={{
              value: 'Ano',
              position: 'insideBottom',
              offset: -5,
              style: { textAnchor: 'middle', fontSize: 14, fontWeight: 'bold' }
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#666' }}
            tickFormatter={formatYAxisValue}
            label={{
              value: type === 'school/count' ? 'Número de Escolas' : 'Total',
              angle: -90,
              position: 'insideLeft',
              offset: -20,
              style: { textAnchor: 'middle', fontSize: 14, fontWeight: 'bold' }
            }}
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '10px',
              bottom: 0
            }}
            iconType="line"
          />
          {lines.map((line, index) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
              name={line}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;