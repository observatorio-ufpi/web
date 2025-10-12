import React, { useState } from 'react';
import {
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';


const EnhancedPieChart = ({
  data,
  title,
  dataKey = 'value',
  nameKey = 'name',
  height = 500,
  formatValue = (value) => value?.toLocaleString('pt-BR') || value,
  colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#f1c40f', '#e91e63',
    '#00bcd4', '#4caf50', '#ff9800', '#795548', '#607d8b'
  ]
}) => {
  // Estados para interatividade
  const [hiddenSlices, setHiddenSlices] = useState(new Set());
  const [highlightedSlice, setHighlightedSlice] = useState(null);
  const [isolatedSlice, setIsolatedSlice] = useState(null);
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

  // Filtrar dados baseado na visibilidade
  const visibleData = data.filter(item => !hiddenSlices.has(item[nameKey]));
  const total = visibleData.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  // Calcular porcentagens apenas dos dados visíveis
  const dataWithPercentage = visibleData.map(item => ({
    ...item,
    percentage: total > 0 ? ((item[dataKey] || 0) / total * 100) : 0
  }));

  // Funções de interatividade
  const toggleSliceVisibility = (slice) => {
    const newHiddenSlices = new Set(hiddenSlices);
    if (newHiddenSlices.has(slice)) {
      newHiddenSlices.delete(slice);
    } else {
      newHiddenSlices.add(slice);
    }
    setHiddenSlices(newHiddenSlices);

    // Se estava isolado e foi escondido, limpar isolamento
    if (isolatedSlice === slice && newHiddenSlices.has(slice)) {
      setIsolatedSlice(null);
    }
  };

  const isolateSlice = (slice) => {
    if (isolatedSlice === slice) {
      // Se já está isolado, desfazer isolamento
      setIsolatedSlice(null);
      setHiddenSlices(new Set());
    } else {
      // Isolar esta fatia (esconder todas as outras)
      const allSlices = data.map(item => item[nameKey]);
      const newHiddenSlices = new Set(allSlices.filter(s => s !== slice));
      setHiddenSlices(newHiddenSlices);
      setIsolatedSlice(slice);
    }
  };

  const isSliceVisible = (slice) => {
    return !hiddenSlices.has(slice);
  };

  const getSliceOpacity = (slice) => {
    if (isolatedSlice && isolatedSlice !== slice) return 0;
    if (hiddenSlices.has(slice)) return 0;
    if (highlightedSlice && highlightedSlice !== slice) return 0.3;
    return 1;
  };

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
            Distribuição por categorias - {data.length} itens analisados
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
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5c0-1.66-4-3-9-3S3 3.34 3 5z"/>
            </svg>
            Total: {formatValue(data.reduce((sum, item) => sum + (item[dataKey] || 0), 0))}
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
                • Clique duas vezes na legenda para isolar categoria
              </div>
              <div>
                • Passe o mouse sobre as fatias
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Mostrar Todas (apenas quando necessário) */}
      {(hiddenSlices.size > 0 || isolatedSlice) && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => {
              setHiddenSlices(new Set());
              setIsolatedSlice(null);
              setHighlightedSlice(null);
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
        <RechartsPieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => percentage >= 2 ? `${percentage.toFixed(1).replace('.', ',')}%` : ''}
            outerRadius={140}
            innerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            onMouseEnter={(_, index) => {
              const slice = dataWithPercentage[index][nameKey];
              setHighlightedSlice(slice);
            }}
            onMouseLeave={() => setHighlightedSlice(null)}
          >
            {dataWithPercentage.map((entry, index) => {
              const slice = entry[nameKey];
              const originalIndex = data.findIndex(item => item[nameKey] === slice);
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[originalIndex % colors.length]}
                  fillOpacity={getSliceOpacity(slice)}
                  stroke={highlightedSlice === slice ? '#333' : 'none'}
                  strokeWidth={highlightedSlice === slice ? 3 : 0}
                />
              );
            })}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const percentage = props.payload?.percentage || 0;
              return [
                `${formatValue(value)} (${percentage.toFixed(1).replace('.', ',')}%)`,
                name
              ];
            }}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          {/* Elemento SVG customizado para o total no centro */}
          <g>
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#333"
            >
              Total Visível
            </text>
            <text
              x="50%"
              y="53%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#2c3e50"
            >
              {formatValue(total)}
            </text>
          </g>
        </RechartsPieChart>
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
        {data.map((item, index) => {
          const slice = item[nameKey];
          const isVisible = isSliceVisible(slice);
          const isIsolated = isolatedSlice === slice;
          const isHighlighted = highlightedSlice === slice;

          return (
            <div
              key={slice}
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
              onClick={() => toggleSliceVisibility(slice)}
              onDoubleClick={() => isolateSlice(slice)}
              onMouseEnter={() => setHighlightedSlice(slice)}
              onMouseLeave={() => setHighlightedSlice(null)}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
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
                {slice}
              </span>
              <span style={{
                fontSize: '12px',
                color: isVisible ? '#6c757d' : '#999',
                fontWeight: '400'
              }}>
                ({formatValue(item[dataKey])})
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

export default EnhancedPieChart;
