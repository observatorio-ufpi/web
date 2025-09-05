import React from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const PieChart = ({
  data,
  title,
  dataKey = 'value',
  nameKey = 'name',
  height = 400,
  showLegend = true,
  showTotal = true,
  formatValue = (value) => value?.toLocaleString('pt-BR') || value,
  colors = ['#4CAF50', '#FFC107', '#F44336', '#E91E63', '#FF9800', '#9C27B0', '#2196F3', '#00BCD4']
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

  // Calcular porcentagens
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: total > 0 ? ((item[dataKey] || 0) / total * 100) : 0
  }));

  return (
    <div style={{
      height,
      marginTop: '1rem',
      border: '2px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#ffffff',
      position: 'relative'
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
        <RechartsPieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => percentage >= 2 ? `${percentage.toFixed(1)}%` : ''}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const percentage = props.payload?.percentage || 0;
              return [
                `${formatValue(value)} (${percentage.toFixed(1)}%)`,
                name
              ];
            }}
            labelStyle={{ color: '#333' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="middle"
              align="right"
              height={200}
              width={200}
              margin={{ left: 20, right: 0 }}
              formatter={(value) => value}
              wrapperStyle={{
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Total no centro do donut */}
      {showTotal && (
        <div style={{
          position: 'absolute',
          top: 'calc(50% + 40px)', // Ainda mais para baixo
          left: 'calc(50% - 100px)', // Ainda mais para a esquerda
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '2px'
          }}>
            Total
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {formatValue(total)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
