import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import "../../../../../../App.css";
import "../../../../../../style/ChartPagination.css";
import StateRevenueCompositionCharts from "./StateRevenueCompositionCharts";
import StateFundebCharts from "./StateFundebCharts";
import StateMDECharts from "./StateMDECharts";
import StateEducationExpenseCharts from "./StateEducationExpenseCharts";
import StateAdditionalRevenueCharts from "./StateAdditionalRevenueCharts";
import StateRPEBCharts from "./StateRPEBCharts";
import Select from "../../../../../ui/Select";
import { Loading } from "../../../../../ui";
import { Typography, Button, Box } from "@mui/material";
import { loadIndicatorData, stateIndicatorOptions } from "../../../../../../services/stateDataService";
import YearRangeFilter from "../../../../../helpers/YearRangeFilter.jsx";



function StateIndicatorsContainer() {
  const theme = useTheme();
  
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState("revenueComposition");
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2023);
  const [chartTitle, setChartTitle] = useState('');

  // Atualizar título quando dados forem carregados
  useEffect(() => {
    if (apiData && hasInitialLoad) {
      const yearDisplay = startYear === endYear ? startYear : `${startYear}-${endYear}`;
      const title = `Indicadores Estaduais - Piauí (${yearDisplay})`;
      setChartTitle(title);
    }
  }, [apiData, hasInitialLoad, startYear, endYear]);

  // Função para carregar dados dos CSVs
  const loadCSVData = async (indicatorType) => {
    setLoading(true);
    try {
      const data = await loadIndicatorData(indicatorType);
      
      // Filtrar dados por ano
      const filteredData = {};
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          filteredData[key] = data[key].filter(item => {
            const year = parseInt(item.Ano);
            return year >= startYear && year <= endYear;
          });
        } else {
          filteredData[key] = data[key];
        }
      });
      
      setApiData(filteredData);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIndicatorChange = (option) => {
    setSelectedIndicator(option.value);
    setApiData(null);
    setHasInitialLoad(false);
  };

  const handleStartYearChange = (year) => {
    setStartYear(year);
  };

  const handleEndYearChange = (year) => {
    setEndYear(year);
  };

  const handleLoadData = () => {
    setHasInitialLoad(true);
    loadCSVData(selectedIndicator);
  };

  // Escutar eventos de filtro aplicados
  useEffect(() => {
    const handleApplyFilters = (event) => {
      const { anoInicial, anoFinal, stateIndicatorType } = event.detail;
      setStartYear(anoInicial);
      setEndYear(anoFinal);
      
      // Atualizar o indicador selecionado se vier do evento
      const indicatorToLoad = stateIndicatorType || selectedIndicator;
      if (stateIndicatorType && stateIndicatorType !== selectedIndicator) {
        setSelectedIndicator(stateIndicatorType);
      }
      
      setHasInitialLoad(true);
      loadCSVData(indicatorToLoad);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, [selectedIndicator]);

  return (
    <div>
      <div className="app-container">
        <hr className="divider" />

        {/* Área de dados - sempre visível */}
        <div className="data-section">
          {loading && <Loading />}

          {!loading && error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#d9534f',
              fontSize: '18px'
            }}>
              <p>Falha ao carregar os dados. Por favor, tente novamente mais tarde.</p>
              <p>Erro: {error}</p>
            </div>
          )}

          {!loading && !error && !apiData && !hasInitialLoad && (
            <>
              {/* Mostrar mensagem de desenvolvimento imediatamente */}
              {(selectedIndicator === "publicFinances" || 
                selectedIndicator === "financingCapacity" || 
                selectedIndicator === "fundebResources" || 
                selectedIndicator === "resourceApplicationControl" || 
                selectedIndicator === "educationInvestment") ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6',
                  margin: '20px 0'
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#6c757d',
                      fontWeight: 'bold',
                      marginBottom: '16px'
                    }}
                  >
                    🚧 Em Desenvolvimento
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#6c757d',
                      fontSize: '16px'
                    }}
                  >
                    Este indicador está sendo desenvolvido e estará disponível em breve.
                  </Typography>
                </div>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '20px auto',
                    maxWidth: '400px',
                    color: theme.palette.primary.main
                  }}
                >
                  Selecione o indicador desejado na lateral e clique em "Filtrar" para visualizar os dados.
                </Typography>
              )}
            </>
          )}

          {!loading && !error && !apiData && hasInitialLoad && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#d9534f',
              fontSize: '18px'
            }}>
              <p>Nenhum dado encontrado para o indicador selecionado.</p>
            </div>
          )}

          {!loading && !error && apiData && (
            <>
              {chartTitle && (
                <Box sx={{ padding: 2 }}>
                  <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    {chartTitle}
                  </Typography>
                </Box>
              )}
              {selectedIndicator === "revenueComposition" && (
                <StateRevenueCompositionCharts data={apiData} />
              )}

              {selectedIndicator === "fundeb" && (
                <StateFundebCharts data={apiData} />
              )}

              {selectedIndicator === "mde" && (
                <StateMDECharts data={apiData} />
              )}

              {selectedIndicator === "educationExpense" && (
                <StateEducationExpenseCharts data={apiData} />
              )}

              {selectedIndicator === "additionalRevenue" && (
                <StateAdditionalRevenueCharts data={apiData} />
              )}

              {selectedIndicator === "rpeb" && (
                <StateRPEBCharts data={apiData} />
              )}

              {/* Ficha Técnica */}
              <Box sx={{ marginTop: 6, padding: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
                  Ficha Técnica
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Informações sobre a metodologia, fonte de dados, periodicidade e outras informações técnicas estarão disponíveis aqui.
                </Typography>
              </Box>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StateIndicatorsContainer;
