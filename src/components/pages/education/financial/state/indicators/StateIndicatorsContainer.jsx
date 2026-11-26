import React, { useState, useEffect } from "react";
import "../../../../../../App.css";
import "../../../../../../style/ChartPagination.css";
import StateChartComponent from "./StateChartComponent";
import { Loading } from "../../../../../ui";
import { loadStateCSVData } from "../../../../../../services/stateDataService";
import TechnicalSheetButton from "../../../../../common/TechnicalSheetButton.jsx";
import EmptyState from '../../../../../common/EmptyState';
import PageHeader, { periodoEtiqueta } from '../../../../../common/PageHeader';
import { ConteudoFicha } from '../../../../../common/fichasTecnicas';
import { repetirUltimaConsulta } from '../../../../../../utils/repetirConsulta';
import {
  processRevenueCompositionData,
  processConstitutionalTransfersData,
  processFundebData,
  processMDEData,
  processMDEPercentageData,
  processEducationProfessionalsData,
  processAdditionalRevenueData,
  processRPEBCompositionData,
} from "../../../../../../utils/processStateData";

// Um gráfico por subindicador, no mesmo esquema dos indicadores municipais.
const SUBINDICADORES = {
  receitasImpostosProprios: {
    titulo: '1.1 - Composição das receitas de impostos próprios',
    tabela: 1,
    campo: 'revenueComposition',
    indicatorType: 'revenue-composition',
    processDataFunction: processRevenueCompositionData,
    title: 'Composição das Receitas de Impostos Próprios do Estado do Piauí',
    enableMonetaryCorrection: true,
  },
  transferenciasConstitucionais: {
    titulo: '1.2 - Composição das transferências constitucionais',
    tabela: 3,
    campo: 'constitutionalTransfers',
    indicatorType: 'constitutional-transfers',
    processDataFunction: processConstitutionalTransfersData,
    title: 'Composição das Transferências Constitucionais Recebidas pelo Estado do Piauí',
    enableMonetaryCorrection: true,
  },
  rpeb: {
    titulo: '2.1 - Composição da Receita Potencial de Educação (RPEB)',
    tabela: 12,
    campo: 'rpeb',
    indicatorType: 'rpeb-composition',
    processDataFunction: processRPEBCompositionData,
    title: 'Composição da Receita Potencial da Educação Básica (RPEB) no Estado do Piauí',
    enableMonetaryCorrection: true,
  },
  receitasAdicionais: {
    titulo: '2.2 - Receitas adicionais para o financiamento do ensino',
    tabela: 6,
    campo: 'additionalRevenue',
    indicatorType: 'additional-revenue',
    processDataFunction: processAdditionalRevenueData,
    title: 'Receitas Adicionais para o Financiamento do Ensino no Estado do Piauí',
    enableMonetaryCorrection: true,
  },
  fundeb: {
    titulo: '3.1 - Composição do Fundeb',
    tabela: 7,
    campo: 'fundeb',
    indicatorType: 'fundeb-composition',
    processDataFunction: processFundebData,
    title: 'Composição do Fundeb no Estado do Piauí',
    enableMonetaryCorrection: true,
  },
  mdeValores: {
    titulo: '4.1 - Valores exigidos e aplicados em MDE',
    tabela: 9,
    campo: 'mde',
    indicatorType: 'mde-values',
    processDataFunction: processMDEData,
    title: 'Valores Exigidos e Aplicados em MDE no Estado do Piauí',
    enableMonetaryCorrection: true,
  },
  mdePercentual: {
    titulo: '4.2 - Percentual aplicado em MDE',
    tabela: 9,
    campo: 'mde',
    indicatorType: 'mde-percentage',
    processDataFunction: processMDEPercentageData,
    title: 'Percentual Aplicado em MDE no Estado do Piauí',
    chartType: 'line',
    yAxisLabel: 'Percentual (%)',
  },
  profissionais: {
    titulo: '4.3 - Despesas com profissionais da educação básica',
    tabela: 10,
    campo: 'educationProfessionals',
    indicatorType: 'education-professionals',
    processDataFunction: processEducationProfessionalsData,
    title: 'Despesas com Profissionais da Educação Básica no Estado do Piauí',
    enableMonetaryCorrection: true,
  },
};

function StateIndicatorsContainer() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubIndicator, setSelectedSubIndicator] = useState('receitasImpostosProprios');
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2023);

  const loadCSVData = async (subIndicator, inicio, fim) => {
    const spec = SUBINDICADORES[subIndicator];
    if (!spec) {
      setApiData(null);
      setError('Indicador não reconhecido');
      return;
    }
    const de = inicio ?? startYear;
    const ate = fim ?? endYear;
    setLoading(true);
    try {
      const rows = await loadStateCSVData(spec.tabela);
      const filtrados = (Array.isArray(rows) ? rows : []).filter((item) => {
        const year = parseInt(item.Ano, 10);
        return year >= de && year <= ate;
      });
      setApiData({ [spec.campo]: filtrados });
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message);
      setApiData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleApplyFilters = (event) => {
      const { anoInicial, anoFinal, stateSubIndicatorType } = event.detail;
      const sub = stateSubIndicatorType || selectedSubIndicator;
      setStartYear(anoInicial);
      setEndYear(anoFinal);
      setSelectedSubIndicator(sub);
      setHasInitialLoad(true);
      loadCSVData(sub, anoInicial, anoFinal);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, [selectedSubIndicator, startYear, endYear]);

  const spec = SUBINDICADORES[selectedSubIndicator];
  const serie = spec && apiData ? apiData[spec.campo] : null;
  const temDados = Array.isArray(serie) && serie.length > 0;

  return (
    <div>
      <div className="app-container">
        <div className="data-section">
          {loading && <Loading />}

          {!loading && error && (
            <EmptyState erro titulo="Não foi possível carregar os dados" texto="Pode ser uma instabilidade na conexão ou no servidor." onTentarDeNovo={repetirUltimaConsulta} />
          )}

          {!loading && !error && !hasInitialLoad && (
            <EmptyState titulo="Monte sua consulta" texto={'Escolha o indicador e o subindicador na lateral e clique em "Mostrar".'} />
          )}

          {!loading && !error && hasInitialLoad && !temDados && (
            <EmptyState titulo="Nenhum dado encontrado" texto="Tente outro período ou outro filtro." />
          )}

          {!loading && !error && temDados && (
            <>
              <PageHeader
                caminho="Dados financeiros  ›  Indicadores do Estado"
                titulo={spec.titulo}
                etiquetas={['Piauí', periodoEtiqueta(startYear, endYear)]}
                acoes={
                  <TechnicalSheetButton className="" dialogTitle={"Ficha técnica — Indicadores do Estado"}>
                    <ConteudoFicha chave="indicadoresEstaduais" />
                  </TechnicalSheetButton>
                }
              />
              <StateChartComponent
                key={selectedSubIndicator}
                indicatorType={spec.indicatorType}
                processDataFunction={spec.processDataFunction}
                title={spec.title}
                enableMonetaryCorrection={!!spec.enableMonetaryCorrection}
                chartType={spec.chartType || 'bar'}
                yAxisLabel={spec.yAxisLabel || 'Valor'}
                data={serie}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StateIndicatorsContainer;
