import React, { useState } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const HistoricalChart = ({
  data,
  type,
  isEtapaSelected,
  isLocalidadeSelected,
  isDependenciaSelected,
  isVinculoSelected,
  isFormacaoDocenteSelected,
  isFaixaEtariaSelected,
  isMunicipioSelected,
  isInstructionLevelSelected,
  // Filtros para educação superior (seguindo padrão do rate e basic)
  isModalidadeSelected,
  isRegimeSelected,
  isCategoriaAdministrativaSelected,
  isFaixaEtariaSuperiorSelected,
  isOrganizacaoAcademicaSelected
}) => {
  // Estados para interatividade
  const [hiddenLines, setHiddenLines] = useState(new Set());
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [isolatedLine, setIsolatedLine] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!data || !data.result) {
    return null;
  }

  // Determinar qual coluna extra usar (mesma lógica do renderHistoricalTable)
  const getExtraColumn = () => {
    if (isEtapaSelected) {
      if (type === 'school/count') {
        return {
          id: 'arrangement_id',
          name: 'arrangement_name',
          label: 'Etapa'
        };
      } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
        return {
          id: 'education_level_id',
          name: 'education_level_short_name',
          label: 'Etapa'
        };
      } else {
        return {
          id: 'education_level_mod_id',
          name: 'education_level_mod_name',
          label: 'Etapa'
        };
      }
    }
    if (isLocalidadeSelected) return { id: 'location_id', name: 'location_name', label: 'Localidade' };
    if (isDependenciaSelected) return { id: 'adm_dependency_detailed_id', name: 'adm_dependency_detailed_name', label: 'Dependência' };
    if (isVinculoSelected) return { id: 'contract_type_id', name: 'contract_type_name', label: 'Vínculo' };
    if (isFormacaoDocenteSelected) return { id: 'initial_training_id', name: 'initial_training_name', label: 'Formação Docente' };
    if (isFaixaEtariaSelected) return { id: 'age_range_id', name: 'age_range_name', label: 'Faixa Etária' };
    if (isMunicipioSelected) return { id: 'municipality_id', name: 'municipality_name', label: 'Município' };
    if (isInstructionLevelSelected) return { id: 'instruction_level_id', name: 'instruction_level_name', label: 'Nível de Instrução' };

    // Educação Superior (seguindo padrão do DataTable.jsx)
    if (isModalidadeSelected) {
      return {
        id: 'upper_education_mod_id',
        name: 'upper_education_mod_name',
        label: 'Modalidade'
      };
    }
    if (isRegimeSelected) {
      return {
        id: 'work_regime_id',
        name: 'work_regime_name',
        label: 'Regime de Trabalho'
      };
    }
    if (isCategoriaAdministrativaSelected) {
      return {
        id: 'upper_adm_dependency_id',
        name: 'upper_adm_dependency_name',
        label: 'Categoria Administrativa'
      };
    }
    if (isFaixaEtariaSuperiorSelected) {
      return {
        id: 'age_student_code_id',
        name: 'age_student_code_name',
        label: 'Faixa Etária'
      };
    }
    if (isOrganizacaoAcademicaSelected) {
      return {
        id: 'academic_level_id',
        name: 'academic_level_name',
        label: 'Organização Acadêmica'
      };
    }
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
    // Dados com categorias - usar ID como chave para evitar duplicatas
    const categoryYearMap = new Map();
    const allCategoryIds = new Set();
    const allYears = new Set();
    const categoryIdToName = new Map(); // Mapear ID para nome de exibição

    // Primeiro, coletar todos os anos e IDs de categorias
    data.result.forEach(item => {
      allYears.add(item.year);
      const categoryId = item[extraColumn.id];
      const categoryName = item[extraColumn.name];

      if (categoryId) {
        allCategoryIds.add(categoryId);
        // Manter o nome mais recente para cada ID
        if (!categoryIdToName.has(categoryId) ||
            (categoryIdToName.get(categoryId) && categoryName.length > categoryIdToName.get(categoryId).length)) {
          categoryIdToName.set(categoryId, categoryName);
        }
      }
    });

    // Inicializar todos os anos com todas as categorias em 0
    allYears.forEach(year => {
      categoryYearMap.set(year, {});
      allCategoryIds.forEach(categoryId => {
        const displayName = categoryIdToName.get(categoryId) || `ID ${categoryId}`;
        categoryYearMap.get(year)[displayName] = 0;
      });
    });

    // Agora preencher com os valores reais
    data.result.forEach(item => {
      const year = item.year;
      const categoryId = item[extraColumn.id];
      const categoryName = item[extraColumn.name];

      if (categoryId) {
        const displayName = categoryIdToName.get(categoryId) || `ID ${categoryId}`;
        const currentValue = categoryYearMap.get(year)[displayName] || 0;
        categoryYearMap.get(year)[displayName] = currentValue + (Number(item.total) || 0);
      }
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
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#f1c40f', '#e91e63',
    '#00bcd4', '#4caf50', '#ff9800', '#795548', '#607d8b'
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

  // Funções de interatividade
  const toggleLineVisibility = (line) => {
    const newHiddenLines = new Set(hiddenLines);
    if (newHiddenLines.has(line)) {
      newHiddenLines.delete(line);
    } else {
      newHiddenLines.add(line);
    }
    setHiddenLines(newHiddenLines);

    // Se estava isolado e foi escondido, limpar isolamento
    if (isolatedLine === line && newHiddenLines.has(line)) {
      setIsolatedLine(null);
    }
  };

  const isolateLine = (line) => {
    if (isolatedLine === line) {
      // Se já está isolado, desfazer isolamento
      setIsolatedLine(null);
      setHiddenLines(new Set());
    } else {
      // Isolar esta linha (esconder todas as outras)
      const newHiddenLines = new Set(lines.filter(l => l !== line));
      setHiddenLines(newHiddenLines);
      setIsolatedLine(line);
    }
  };

  const isLineVisible = (line) => {
    return !hiddenLines.has(line);
  };

  const getLineOpacity = (line) => {
    if (isolatedLine && isolatedLine !== line) return 0;
    if (hiddenLines.has(line)) return 0;
    if (highlightedLine && highlightedLine !== line) return 0.3;
    return 1;
  };

  const getLineStrokeWidth = (line) => {
    if (highlightedLine === line) return 5;
    if (isolatedLine === line) return 4;
    return 3;
  };

  // Funções para gerar título e informações do cabeçalho
  const getChartTitle = () => {
    if (isEtapaSelected) {
      return 'Evolução de Matrículas por Nível de Ensino';
    }
    if (isLocalidadeSelected) {
      return 'Evolução de Matrículas por Localidade';
    }
    if (isDependenciaSelected) {
      return 'Evolução de Matrículas por Dependência Administrativa';
    }
    if (isVinculoSelected) {
      return 'Evolução de Matrículas por Vínculo Funcional';
    }
    if (isFormacaoDocenteSelected) {
      return 'Evolução de Matrículas por Formação Docente';
    }
    if (isFaixaEtariaSelected) {
      return 'Evolução de Matrículas por Faixa Etária';
    }

    // Educação Superior
    if (isModalidadeSelected) {
      return 'Evolução de Matrículas por Modalidade de Ensino';
    }
    if (isRegimeSelected) {
      return 'Evolução de Docentes por Regime de Trabalho';
    }
    if (isCategoriaAdministrativaSelected) {
      return 'Evolução por Categoria Administrativa';
    }
    if (isFaixaEtariaSuperiorSelected) {
      return 'Evolução de Matrículas por Faixa Etária';
    }
    if (isOrganizacaoAcademicaSelected) {
      return 'Evolução por Organização Acadêmica';
    }

    return 'Evolução de Matrículas - Série Histórica';
  };

  const getChartSubtitle = () => {
    const parts = [];

    if (isEtapaSelected) {
      parts.push('Análise por etapas educacionais');
    }
    if (isLocalidadeSelected) {
      parts.push('Análise por localidade');
    }
    if (isDependenciaSelected) {
      parts.push('Análise por dependência administrativa');
    }
    if (isVinculoSelected) {
      parts.push('Análise por vínculo funcional');
    }
    if (isFormacaoDocenteSelected) {
      parts.push('Análise por formação docente');
    }
    if (isFaixaEtariaSelected) {
      parts.push('Análise por faixa etária');
    }

    // Educação Superior
    if (isModalidadeSelected) {
      parts.push('Análise por modalidade de ensino');
    }
    if (isRegimeSelected) {
      parts.push('Análise por regime de trabalho');
    }
    if (isCategoriaAdministrativaSelected) {
      parts.push('Análise por categoria administrativa');
    }
    if (isFaixaEtariaSuperiorSelected) {
      parts.push('Análise por faixa etária');
    }
    if (isOrganizacaoAcademicaSelected) {
      parts.push('Análise por organização acadêmica');
    }

    if (parts.length === 0) {
      parts.push('Visão geral das matrículas');
    }

    parts.push(`- ${lines.length} categorias analisadas`);

    return parts.join(' ');
  };

  const getYearRange = () => {
    if (chartData.length === 0) return 'Período não disponível';

    const years = chartData.map(item => item.year).sort((a, b) => a - b);
    const firstYear = years[0];
    const lastYear = years[years.length - 1];

    if (firstYear === lastYear) {
      return `${firstYear}`;
    }

    return `${firstYear} - ${lastYear}`;
  };

  return (
    <div style={{
      minHeight: 700,
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
            {getChartTitle()}
          </h2>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            {getChartSubtitle()}
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {getYearRange()}
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
            }}
            >
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
                • Passe o mouse sobre as linhas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Mostrar Todas (apenas quando necessário) */}
      {(hiddenLines.size > 0 || isolatedLine) && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => {
              setHiddenLines(new Set());
              setIsolatedLine(null);
              setHighlightedLine(null);
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

      <ResponsiveContainer width="100%" height={500}>
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
          {lines.map((line, index) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              stroke={colors[index % colors.length]}
              strokeWidth={getLineStrokeWidth(line)}
              strokeOpacity={getLineOpacity(line)}
              dot={{
                fill: colors[index % colors.length],
                strokeWidth: 2,
                r: highlightedLine === line ? 6 : 4,
                fillOpacity: getLineOpacity(line)
              }}
              activeDot={{
                r: 8,
                stroke: colors[index % colors.length],
                strokeWidth: 3,
                fill: colors[index % colors.length]
              }}
              name={line}
              onMouseEnter={() => setHighlightedLine(line)}
              onMouseLeave={() => setHighlightedLine(null)}
            />
          ))}
        </LineChart>
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
        {lines.map((line, index) => {
          const isVisible = isLineVisible(line);
          const isIsolated = isolatedLine === line;
          const isHighlighted = highlightedLine === line;

          return (
            <div
              key={line}
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
              onClick={() => toggleLineVisibility(line)}
              onDoubleClick={() => isolateLine(line)}
              onMouseEnter={() => setHighlightedLine(line)}
              onMouseLeave={() => setHighlightedLine(null)}
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
                {line}
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

export default HistoricalChart;