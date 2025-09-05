import React from 'react';
import {
    Bar,
    CartesianGrid,
    Legend,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const BarChart = ({
  data,
  title,
  xAxisKey = 'name',
  yAxisKey = 'value',
  height = 400,
  showLegend = true,
  formatValue = (value) => value?.toLocaleString('pt-BR') || value,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c']
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
      }}>
        <p>Nenhum dado disponível para o gráfico</p>
      </div>
    );
  }

  // Se os dados têm múltiplas séries (múltiplas colunas de valores)
  const dataKeys = Object.keys(data[0] || {}).filter(key => key !== xAxisKey);
  const isMultiSeries = dataKeys.length > 1;

  return (
    <div style={{
      height,
      marginTop: '1rem',
      border: '2px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#ffffff'
    }}>
      {title && (
        <h3 style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            angle={data.length > 10 ? -45 : 0}
            textAnchor={data.length > 10 ? 'end' : 'middle'}
            height={data.length > 10 ? 80 : 60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={formatValue}
          />
          <Tooltip
            formatter={(value, name) => [formatValue(value), name]}
            labelStyle={{ color: '#333' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {showLegend && <Legend />}

          {isMultiSeries ? (
            dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                name={key}
                radius={[4, 4, 0, 0]}
              />
            ))
          ) : (
            <Bar
              dataKey={yAxisKey}
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          )}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
