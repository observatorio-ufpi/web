import React, { useState } from 'react';
import {
    Bar,
    CartesianGrid,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// Componente customizado para labels do eixo X com quebra de linha
const CustomXAxisTick = ({ x, y, payload }) => {
  const value = payload.value;
  const maxLength = 12;

  if (value.length <= maxLength) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="11">
          {value}
        </text>
      </g>
    );
  }

  // Quebrar texto em linhas
  const words = value.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={0}
          dy={16 + (index * 14)}
          textAnchor="middle"
          fill="#666"
          fontSize="11"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const EnhancedBarChart = ({
  data,
  title,
  xAxisKey = 'name',
  height = 500,
  formatValue = (value) => value?.toLocaleString('pt-BR') || value,
  colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#f1c40f', '#e91e63',
    '#00bcd4', '#4caf50', '#ff9800', '#795548', '#607d8b'
  ]
}) => {
  // Estados para interatividade
  const [hiddenBars, setHiddenBars] = useState(new Set());
  const [highlightedBar, setHighlightedBar] = useState(null);
  const [isolatedBar, setIsolatedBar] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

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

  // Obter todas as séries (exceto a chave do eixo X)
  const allSeries = Object.keys(data[0] || {}).filter(key => key !== xAxisKey);

  // Filtrar dados baseado na visibilidade das barras
  const processedData = data.map(item => {
    const newItem = { [xAxisKey]: item[xAxisKey] };
    allSeries.forEach(series => {
      if (!hiddenBars.has(series)) {
        newItem[series] = item[series];
      }
    });
    return newItem;
  });

  // Funções de interatividade
  const toggleBarVisibility = (bar) => {
    const newHiddenBars = new Set(hiddenBars);
    if (newHiddenBars.has(bar)) {
      newHiddenBars.delete(bar);
    } else {
      newHiddenBars.add(bar);
    }
    setHiddenBars(newHiddenBars);

    // Se estava isolado e foi escondido, limpar isolamento
    if (isolatedBar === bar && newHiddenBars.has(bar)) {
      setIsolatedBar(null);
    }
  };

  const isolateBar = (bar) => {
    if (isolatedBar === bar) {
      // Se já está isolado, desfazer isolamento
      setIsolatedBar(null);
      setHiddenBars(new Set());
    } else {
      // Isolar esta barra (esconder todas as outras)
      const newHiddenBars = new Set(allSeries.filter(s => s !== bar));
      setHiddenBars(newHiddenBars);
      setIsolatedBar(bar);
    }
  };

  const isBarVisible = (bar) => {
    return !hiddenBars.has(bar);
  };

  const getBarOpacity = (bar) => {
    if (isolatedBar && isolatedBar !== bar) return 0;
    if (hiddenBars.has(bar)) return 0;
    if (highlightedBar && highlightedBar !== bar) return 0.3;
    return 1;
  };

  // Calcular total geral para exibição
  const totalGeneral = data.reduce((sum, item) => {
    return sum + allSeries.reduce((itemSum, series) => {
      return itemSum + (Number(item[series]) || 0);
    }, 0);
  }, 0);

  return (
    <div style={{
      minHeight: height + 100,
      marginTop: '2rem',
      border: '2px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Cabeçalho Profissional */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{
            margin: '0 0 4px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            {title}
          </h2>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            Comparação por categorias - {allSeries.length} séries, {data.length} categorias
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
            fontSize: '13px',
            color: '#495057',
            fontWeight: '500'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Total: {formatValue(totalGeneral)}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </button>

            {/* Tooltip de Interatividade */}
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              backgroundColor: '#2c3e50',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              opacity: showTooltip ? '1' : '0',
              visibility: showTooltip ? 'visible' : 'hidden',
              transform: showTooltip ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'all 0.3s ease',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              pointerEvents: 'none'
            }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                Controles Interativos:
              </div>
              <div style={{ marginBottom: '4px' }}>
                • Clique na legenda para ocultar/mostrar
              </div>
              <div style={{ marginBottom: '4px' }}>
                • Clique duas vezes na legenda para isolar série
              </div>
              <div>
                • Passe o mouse sobre as barras
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Mostrar Todas (apenas quando necessário) */}
      {(hiddenBars.size > 0 || isolatedBar) && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => {
              setHiddenBars(new Set());
              setIsolatedBar(null);
              setHighlightedBar(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#5a6268';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6c757d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M21 12a9 9 0 1 1-9 9 9.75 9.75 0 0 1 6.74-2.74L21 16"/>
              <path d="M21 21v-5h-5"/>
            </svg>
            Mostrar Todas
          </button>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={xAxisKey}
            tick={<CustomXAxisTick />}
            height={120}
            interval={0}
            label={{
              value: 'Categoria',
              position: 'insideBottom',
              offset: -5,
              style: { textAnchor: 'middle', fontSize: 14, fontWeight: 'bold' }
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#666' }}
            tickFormatter={formatValue}
            label={{
              value: 'Total',
              angle: -90,
              position: 'insideLeft',
              offset: -20,
              style: { textAnchor: 'middle', fontSize: 14, fontWeight: 'bold' }
            }}
          />
          <Tooltip
            formatter={(value, name) => [formatValue(value), name]}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />

          {allSeries.map((series, index) => (
            <Bar
              key={series}
              dataKey={series}
              fill={colors[index % colors.length]}
              fillOpacity={getBarOpacity(series)}
              stroke={highlightedBar === series ? '#333' : 'none'}
              strokeWidth={highlightedBar === series ? 2 : 0}
              name={series}
              radius={[4, 4, 0, 0]}
              onMouseEnter={() => setHighlightedBar(series)}
              onMouseLeave={() => setHighlightedBar(null)}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>

      {/* Legenda personalizada com bolinhas coloridas */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        maxWidth: '100%'
      }}>
        {allSeries.map((series, index) => {
          const isVisible = isBarVisible(series);
          const isIsolated = isolatedBar === series;
          const isHighlighted = highlightedBar === series;

          // Calcular total da série
          const seriesTotal = data.reduce((sum, item) => sum + (Number(item[series]) || 0), 0);

          return (
            <div
              key={series}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: isIsolated ? '#e3f2fd' : (isVisible ? 'white' : '#f8f9fa'),
                borderRadius: '20px',
                boxShadow: isHighlighted ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                border: isIsolated ? '2px solid #2196f3' : (isVisible ? '1px solid #dee2e6' : '1px solid #ccc'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: isVisible ? 1 : 0.5,
                transform: isHighlighted ? 'scale(1.05)' : 'scale(1)'
              }}
              onClick={() => toggleBarVisibility(series)}
              onDoubleClick={() => isolateBar(series)}
              onMouseEnter={() => setHighlightedBar(series)}
              onMouseLeave={() => setHighlightedBar(null)}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '2px',
                backgroundColor: isVisible ? colors[index % colors.length] : '#ccc',
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease'
              }} />
              <span style={{
                fontSize: '13px',
                fontWeight: isIsolated ? 'bold' : '500',
                color: isVisible ? '#333' : '#999',
                whiteSpace: 'nowrap',
                textDecoration: isVisible ? 'none' : 'line-through'
              }}>
                {series}
              </span>
              <span style={{
                fontSize: '12px',
                color: isVisible ? '#6c757d' : '#999',
                fontWeight: '400'
              }}>
                ({formatValue(seriesTotal)})
              </span>
              {isIsolated && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '10px',
                  color: '#2196f3',
                  fontWeight: 'bold'
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  ISOLADO
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedBarChart;
