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
import { Typography, Button } from "@mui/material";
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

  return (
    <div>
      <div className="app-container">
        <div className="filters-section">
          <div className="flex flex-col gap-4 p-0 m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Filtro de Indicador - Primeira coluna */}
              <div className="md:col-span-1">
                <Select
                  label="Selecione o indicador:"
                  value={stateIndicatorOptions.find(option => option.value === selectedIndicator)}
                  onChange={handleIndicatorChange}
                  options={stateIndicatorOptions}
                  placeholder="Selecione um indicador"
                  size="xs"
                  isClearable
                  fullWidth
                />
              </div>

              {/* Filtro de Ano - Segunda coluna */}
              <div className="md:col-span-1">
                <YearRangeFilter
                  startYear={startYear}
                  endYear={endYear}
                  onStartYearChange={handleStartYearChange}
                  onEndYearChange={handleEndYearChange}
                  minYear={2007}
                  maxYear={2023}
                />
              </div>

              {/* Botão Filtrar - Terceira coluna */}
              <div className="md:col-span-1 flex justify-end items-end">
                <Button
                  variant="contained"
                  onClick={handleLoadData}
                  className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
                >
                  Mostrar Resultados
                </Button>
              </div>
            </div>
          </div>
        </div>

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
              Selecione o indicador desejado e clique em "Filtrar" para visualizar os dados.
            </Typography>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StateIndicatorsContainer;
