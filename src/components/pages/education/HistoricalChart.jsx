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
  isVinculoSelected, isFormacaoDocenteSelected, isFaixaEtariaSelected }) => {
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
    '#d0ed57', '#83a6ed', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  return (
    <div style={{
      height: 500,
      marginTop: '2rem',
      border: '2px solid #ccc',
      borderRadius: '4px',
      padding: '20px'
    }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            label={{
              value: 'Ano',
              position: 'insideBottom',
              offset: -5
            }}
          />
          <YAxis
            label={{
              value: type === 'school/count' ? 'Número de Escolas' : 'Total',
              angle: -90,
              position: 'insideLeft',
              offset: -20
            }}
          />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '10px',
              bottom: 0
            }}
          />
          {lines.map((line, index) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              stroke={colors[index % colors.length]}
              name={line}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;