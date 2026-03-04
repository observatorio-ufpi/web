import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import "../../../../../../App.css";
import { fetchData } from "../../../../../../services/apiService.jsx";
import "../../../../../../style/ChartPagination.css";
import {
  processBasicEducationData,
  processMDEData,
  processParticipacaoImpostosPropriosData,
  processParticipacaoTransferenciasData,
  processRazaoImpostosTransferenciasData,
  processRazaoTransferenciasImpostosData,
  processParticipacaoFundebData,
  processParticipacaoFundebMdeData,
  processResultadoLiquidoFundebData,
  processParticipacaoComplementacaoUniaoData,
  processDespesaPessoalAtivoData,
  processDespesaPessoalInativoData,
  processDespesaCapitalData,
  processTransferenciasPrivadasData,
  processVaatEducacaoInfantilData,
  processVaatDespesaCapitalData,
  processRpebData,
  processDespesaTotalMdeData,
} from "../../../../../../utils/processDataCharts";
import ChartComponent from "./ChartComponent";
import CustomPagination from "../../../../../helpers/CustomPagination";
import EducationExpenseCompositionCharts from "./EducationExpenseCompositionCharts";
import FinancingCapacityCharts from "./FinancingCapacityCharts";
import ResourcesApplicationControlCharts from "./ResourcesApplicationControlCharts";
import RevenueCompositionCharts from "./RevenueCompositionCharts";
import RpebCompositionCharts from "./RpebCompositionCharts";
import FilterComponent from "../../../../../helpers/TableFilters";
import Select from "../../../../../ui/Select";
import { Loading } from "../../../../../ui";
import { Typography, Button, Box } from "@mui/material";
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { municipios } from "../../../../../../utils/municipios.mapping";

// Componente de "Em Construção"
const UnderConstruction = ({ indicatorName }) => (
  <Box sx={{ 
    textAlign: 'center', 
    padding: '80px 40px', 
    backgroundColor: '#fff8e1', 
    borderRadius: '16px', 
    border: '3px dashed #ffb300', 
    margin: '30px auto',
    maxWidth: '600px',
    boxShadow: '0 4px 20px rgba(255, 179, 0, 0.15)'
  }}>
    <Box sx={{ fontSize: '64px', marginBottom: '20px' }}>
      🚧
    </Box>
    <Typography variant="h4" sx={{ 
      color: '#ff8f00', 
      fontWeight: 'bold', 
      marginBottom: '16px',
      fontSize: '28px'
    }}>
      Em Construção
    </Typography>
    <Typography variant="body1" sx={{ 
      color: '#6d4c00', 
      fontSize: '16px',
      lineHeight: 1.6,
      marginBottom: '8px'
    }}>
      {indicatorName ? `O indicador "${indicatorName}"` : 'Este indicador'} está sendo desenvolvido
    </Typography>
    <Typography variant="body2" sx={{ 
      color: '#8d6e00', 
      fontSize: '14px'
    }}>
      Estará disponível em breve!
    </Typography>
  </Box>
);

// 5 Indicadores principais
const indicatorOptions = [
  { value: 'financasPublicas', label: '1 - Indicadores de Finanças Públicas' },
  { value: 'capacidadeFinanciamento', label: '2 - Capacidade de Financiamento' },
  { value: 'recursosFundeb', label: '3 - Indicadores dos Recursos do Fundeb' },
  { value: 'controleAplicacao', label: '4 - Controle da Aplicação dos Recursos' },
  { value: 'investimentoEducacao', label: '5 - Investimento em Educação' },
];

// Subindicadores para cada indicador principal
const subIndicatorOptions = {
  financasPublicas: [
    { value: 'composicaoReceitas', label: '1.1 - Composição das Receitas Impostos e Transferências [%]' },
    { value: 'participacaoImpostosProprios', label: '1.2 - Participação da receita de impostos próprios [%]' },
    { value: 'participacaoTransferencias', label: '1.3 - Participação das transferências [%]' },
    { value: 'razaoImpostosTransferencias', label: '1.4 - Razão entre impostos próprios e transferências' },
    { value: 'razaoTransferenciasImpostos', label: '1.5 - Razão entre transferências e impostos próprios' },
    { value: 'participacaoFundeb', label: '1.6 - Participação do FUNDEB [%]' },
    { value: 'receitasPorMatricula', label: '1.7 - Receitas por Matrícula na Educação Básica [R$]' },
  ],
  capacidadeFinanciamento: [
    { value: 'rpeb', label: '2.1 - Receita Potencial Mínima Vinculada à Educação Básica (RPEb) [R$]' },
    { value: 'composicaoRpeb', label: '2.2 - Composição da RPEB [%]' },
    { value: 'rpebAlunoAno', label: '2.3 - RPEb-aluno (ano) [R$]' },
    { value: 'rpebAlunoMes', label: '2.4 - RPEb-aluno (mês) [R$]' },
    { value: 'participacaoFundebRpeb', label: '2.5 - Participação do Fundeb na RPEb [%]' },
  ],
  recursosFundeb: [
    { value: 'participacaoFundebMde', label: '3.1 - Participação do Fundeb na despesa em MDE [%]' },
    { value: 'resultadoLiquidoFundeb', label: '3.2 - Resultado Líquido do Fundeb [%]' },
    { value: 'participacaoComplementacaoUniao', label: '3.3 - Participação da complementação da União no FUNDEB [%]' },
  ],
  controleAplicacao: [
    { value: 'aplicacaoMde', label: '4.1 - Aplicação em MDE (>=25%) [%]' },
    { value: 'aplicacaoFundebProfissionais', label: '4.2 - Aplicação do Fundeb nos profissionais (>=70%) [%]' },
    { value: 'aplicacaoVaatInfantil', label: '4.3 - Aplicação do VAAT na Educação Infantil (>=50%) [%]' },
    { value: 'aplicacaoVaatCapital', label: '4.4 - Aplicação do VAAT em Despesa de Capital (>=15%) [%]' },
    { value: 'despesaEducacaoPib', label: '4.5 - Despesa total com educação em relação ao PIB [%]' },
  ],
  investimentoEducacao: [
    { value: 'despesaTotalEducacao', label: '5.1 - Despesa total com Educação [R$]' },
    { value: 'gastoAlunoAno', label: '5.2.1 - Gasto-Aluno (ano) [R$]' },
    { value: 'gastoAlunoMes', label: '5.2.2 - Gasto-Aluno (mês) [R$]' },
    { value: 'despesaPessoalAtivo', label: '5.3 - Despesa com pessoal ativo [%]' },
    { value: 'despesaPessoalInativo', label: '5.4 - Despesa com pessoal inativo [%]' },
    { value: 'despesaCapital', label: '5.5 - Despesa de Capital [%]' },
    { value: 'transferenciasPrivadas', label: '5.6 - Transferências às instituições privadas [%]' },
  ],
};

// Mapeamento de subindicadores para endpoints (subindicadores implementados)
const implementedSubIndicators = [
  'composicaoReceitas',
  'participacaoImpostosProprios', 
  'participacaoTransferencias',
  'razaoImpostosTransferencias',
  'razaoTransferenciasImpostos',
  'participacaoFundeb',
  'rpeb',
  'aplicacaoMde',
  'aplicacaoFundebProfissionais',
  'aplicacaoVaatInfantil',
  'aplicacaoVaatCapital',
  'participacaoFundebMde',
  'resultadoLiquidoFundeb',
  'participacaoComplementacaoUniao',
  'despesaTotalEducacao',
  'despesaPessoalAtivo',
  'despesaPessoalInativo',
  'despesaCapital',
  'transferenciasPrivadas',
];

const groupTypeOptions = [
  { value: 'municipio', label: 'Município' },
  { value: 'ano', label: 'Ano' },
];

const endpoints = {
  // Existing endpoints
  ownRevenues: import.meta.env.VITE_API_PUBLIC_URL + "/researches/mot-revenue",
  constitutionalTransfersRevenue:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/ct-revenue",
  municipalTaxesRevenues:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/mt-revenue",
  additionalEducationRevenue:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/researches/addtional-education-revenue",
  municipalFundebFundefComposition:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/mfc-revenue",
  complementationFundebFundef:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/cf-revenue",
  areasActivityExpense:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/areas-activity-expense",
  basicEducationMinimalPotential:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/researches/basic-education-minimal-potential-revenue",
  constitutionalLimitMde:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/mc-limit-revenue",
  expensesBasicEducationFundeb:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/researches/basic-education-expense",
  complementaryProtocol:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/complementary-protocol",
  allTables:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/all-revenues-expenses",

  // New revenue composition endpoints
  "iptu-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/iptu",
  "iss-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/iss",
  "itbi-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/itbi",
  "irrf-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/irrf",
  "ipva-composition":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-ipva",
  "icms-composition":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-icms",
  "fpm-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/fpm",
  "cota-parte-iof-ouro":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-iof-ouro",
  "outras-transferencias":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/outras-transferencias",
  "icms-desoneracao":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/icms-desoneracao",
  "cota-parte-ipi":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-ipi",
  "cota-parte-itr":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-itr",
  "participacao-receita-impostos-proprios":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/participacao-receita-impostos-proprios",
  "participacao-transferencias":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/participacao-transferencias",
  "razao-impostos-transferencias":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/razao-impostos-transferencias",
  "razao-transferencias-impostos":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/razao-transferencias-impostos",
  "participacao-fundeb":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/participacao-fundeb",

  fundeb_participation_mde:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/rpeb-composition/fundeb_participation_mde",
  resultado_liquido_fundeb:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/rpeb-composition/resultado_liquido_fundeb",
  participacao_complementacao_uniao:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/rpeb-composition/participacao_complementacao_uniao",
  mde_total_expense:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_total_expense",
  mde_pessoal_ativo:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_pessoal_ativo",
  mde_pessoal_inativo:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_pessoal_inativo",
  mde_capital:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_capital",
  mde_transferencias_instituicoes_privadas:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_transferencias_instituicoes_privadas",
};

function ChartContainer() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState("financasPublicas");
  const [selectedSubIndicator, setSelectedSubIndicator] = useState("composicaoReceitas");
  const [selectedTable, setSelectedTable] = useState("composicaoReceitas"); // Mantido para compatibilidade
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [territorioDeDesenvolvimentoMunicipio, setTerritorioDeDesenvolvimentoMunicipio] = useState(null);
  const [faixaPopulacionalMunicipio, setFaixaPopulacionalMunicipio] = useState(null);
  const [aglomeradoMunicipio, setAglomeradoMunicipio] = useState("");
  const [gerenciaRegionalMunicipio, setGerenciaRegionalMunicipio] = useState("");
  const [groupType, setGroupType] = useState("municipio");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [chartTitle, setChartTitle] = useState('');
  const [filters, setFilters] = useState({
    anoInicial: 2007,
    anoFinal: 2024,
  });

  // Verificar se o subindicador está implementado
  const isSubIndicatorImplemented = (subIndicator) => {
    return implementedSubIndicators.includes(subIndicator);
  };

  // Atualizar título quando dados forem carregados
  useEffect(() => {
    if (apiData && hasInitialLoad) {
      const yearDisplay = filters.anoInicial === filters.anoFinal ? filters.anoInicial : `${filters.anoInicial}-${filters.anoFinal}`;
      let locationName = 'Piauí';
      if (selectedMunicipio && Object.keys(municipios).length > 0) {
        const municipio = municipios[selectedMunicipio];
        if (municipio) {
          locationName = municipio.nomeMunicipio;
        }
      }
      const title = `Indicadores Financeiros - ${locationName} (${yearDisplay})`;
      setChartTitle(title);
    }
  }, [apiData, hasInitialLoad, filters.anoInicial, filters.anoFinal, selectedMunicipio]);

  const fetchTableData = (customFilters = null, indicatorType = null) => {
    if (loading) return; // Evita múltiplas chamadas simultâneas
    setLoading(true);
    
    // Mapeamento de novos subindicadores para lógica de fetch existente
    const subIndicatorMapping = {
      // Finanças Públicas
      'composicaoReceitas': 'revenueComposition',
      'participacaoImpostosProprios': 'participacao-receita-impostos-proprios',
      'participacaoTransferencias': 'participacao-transferencias',
      'razaoImpostosTransferencias': 'razao-impostos-transferencias',
      'razaoTransferenciasImpostos': 'razao-transferencias-impostos',
      'participacaoFundeb': 'participacao-fundeb',
      'receitasPorMatricula': null, // Em desenvolvimento
      // Capacidade de Financiamento
      'rpeb': 'composicao_rpeb_financiamento',
      'composicaoRpeb': null,
      'rpebAlunoAno': null,
      'rpebAlunoMes': null,
      'participacaoFundebRpeb': null,
      // Recursos do Fundeb
      'participacaoFundebMde': 'rpebComposition',
      'resultadoLiquidoFundeb': 'rpebComposition',
      'participacaoComplementacaoUniao': 'rpebComposition',
      // Controle da Aplicação
      'aplicacaoMde': 'constitutionalLimitMde',
      'aplicacaoFundebProfissionais': 'expensesBasicEducationFundeb',
      'aplicacaoVaatInfantil': 'aplicacao_vaat_educacao_infantil',
      'aplicacaoVaatCapital': 'aplicacao_vaat_despesa_capital',
      'despesaEducacaoPib': null,
      // Investimento em Educação
      'despesaTotalEducacao': 'mde_total_expense',
      'gastoAlunoAno': null,
      'gastoAlunoMes': null,
      'despesaPessoalAtivo': 'educationExpenseComposition',
      'despesaPessoalInativo': 'educationExpenseComposition',
      'despesaCapital': 'educationExpenseComposition',
      'transferenciasPrivadas': 'educationExpenseComposition',
    };
    
    // Usar o indicatorType passado ou o estado atual
    const rawIndicator = indicatorType || selectedTable;
    
    // Mapear para o nome antigo ou usar como está
    const tableToUse = subIndicatorMapping[rawIndicator] || rawIndicator;
    
    // Se não tem mapeamento (null), significa que está em desenvolvimento
    if (tableToUse === null) {
      setLoading(false);
      setApiData(null);
      return;
    }

    // Usar filtros customizados se fornecidos, senão usar os estados
    const currentFilters = customFilters || {
      codigoMunicipio: selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page,
      limit,
    };

    if (tableToUse === "revenueComposition") {
      // Fetch all revenue composition indicators
      Promise.all([
        fetchData("iptu-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("iss-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("itbi-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("irrf-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("ipva-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("icms-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("fpm-composition", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("cota-parte-iof-ouro", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("outras-transferencias", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("icms-desoneracao", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("cota-parte-ipi", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("cota-parte-itr", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
      ])
        .then(
          ([
            iptu,
            iss,
            itbi,
            irrf,
            ipva,
            icms,
            fpm,
            iofOuro,
            outrasTransferencias,
            icmsDesoneracao,
            cotaParteIpi,
            cotaParteItr,
          ]) => {
            setApiData({
              iptu,
              iss,
              itbi,
              irrf,
              ipva,
              icms,
              fpm,
              iofOuro,
              outrasTransferencias,
              icmsDesoneracao,
              cotaParteIpi,
              cotaParteItr,
            });
            setLoading(false);
            setTotalPages(Math.max(
              ...Object.values({
                iptu,
                iss,
                itbi,
                irrf,
                ipva,
                icms,
                fpm,
                iofOuro,
                outrasTransferencias,
                icmsDesoneracao,
                cotaParteIpi,
                cotaParteItr,
              }).map((data) => data.pagination?.totalPages || 1)
            ));
          }
        )
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    } else if (tableToUse === "rpebComposition") {
      Promise.all([
        fetchData("fundeb_participation_mde", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("resultado_liquido_fundeb", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("participacao_complementacao_uniao", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("participacao_receitas_adicionais", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
      ])
        .then(
          ([
            fundebParticipationMde,
            resultadoLiquidoFundeb,
            participacaoComplementacaoUniao,
            participacaoReceitasAdicionais,
          ]) => {
            setApiData({
              fundebParticipationMde,
              resultadoLiquidoFundeb,
              participacaoComplementacaoUniao,
              participacaoReceitasAdicionais,
            });
            setLoading(false);
            setTotalPages(Math.max(
              ...Object.values({
                fundebParticipationMde,
                resultadoLiquidoFundeb,
                participacaoComplementacaoUniao,
                participacaoReceitasAdicionais,
              }).map((data) => data.pagination?.totalPages || 1)
            ));
          }
        )
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    } else if (tableToUse === "educationExpenseComposition") {
      Promise.all([
        fetchData("mde_total_expense", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("mde_pessoal_ativo", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("mde_pessoal_inativo", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("mde_capital", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("mde_transferencias_instituicoes_privadas", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
      ])
        .then(
          ([
            mdeTotalExpense,
            mdePessoalAtivo,
            mdePessoalInativo,
            mdeCapital,
            mdeTransferenciasInstituicoesPrivadas,
          ]) => {
            setApiData({
              mdeTotalExpense,
              mdePessoalAtivo,
              mdePessoalInativo,
              mdeCapital,
              mdeTransferenciasInstituicoesPrivadas,
            });
            setLoading(false);
            setTotalPages(Math.max(
              ...Object.values({
                mdeTotalExpense,
                mdePessoalAtivo,
                mdePessoalInativo,
                mdeCapital,
                mdeTransferenciasInstituicoesPrivadas,
              }).map((data) => data.pagination?.totalPages || 1)
            ));
          }
        )
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    } else if (tableToUse === "resourcesApplicationControl") {
      Promise.all([
        fetchData("aplicacao_mde", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("aplicacao_fundeb_pag_profissionais_educacao", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("aplicacao_vaat_educacao_infantil", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("aplicacao_vaat_despesa_capital", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
      ])
        .then(
          ([
            aplicacaoMde,
            aplicacaoFundeb,
            aplicacaoVaatEducacaoInfantil,
            aplicacaoVaatDespesaCapital,
          ]) => {
            setApiData({
              aplicacaoMde,
              aplicacaoFundeb,
              aplicacaoVaatEducacaoInfantil,
              aplicacaoVaatDespesaCapital,
            });
            setLoading(false);
            setTotalPages(Math.max(
              ...Object.values({
                aplicacaoMde,
                aplicacaoFundeb,
                aplicacaoVaatEducacaoInfantil,
                aplicacaoVaatDespesaCapital,
              }).map((data) => data.pagination?.totalPages || 1)
            ));
          }
        )
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    } else if (tableToUse === "financingCapacity") {
      Promise.all([
        fetchData("composicao_fundeb_financiamento", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
        fetchData("composicao_rpeb_financiamento", groupType, {
          codigoMunicipio: currentFilters.codigoMunicipio,
          territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
          aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
          gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
          anoInicial: currentFilters.anoInicial,
          anoFinal: currentFilters.anoFinal,
          page: currentFilters.page,
          limit: currentFilters.limit,
        }),
      ])
        .then(
          ([composicaoFundebFinanciamento, composicaoRpebFinanciamento]) => {
            setApiData({
              composicaoFundebFinanciamento,
              composicaoRpebFinanciamento,
            });
            setLoading(false);
            setTotalPages(Math.max(
              ...Object.values({
                composicaoFundebFinanciamento,
                composicaoRpebFinanciamento,
              }).map((data) => data.pagination?.totalPages || 1)
            ));
          }
        )
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      // Existing fetch logic for other tables
      fetchData(tableToUse, groupType, {
        codigoMunicipio: currentFilters.codigoMunicipio,
        territorioDeDesenvolvimentoMunicipio: currentFilters.territorioDeDesenvolvimentoMunicipio,
        faixaPopulacionalMunicipio: currentFilters.faixaPopulacionalMunicipio,
        aglomeradoMunicipio: currentFilters.aglomeradoMunicipio,
        gerenciaRegionalMunicipio: currentFilters.gerenciaRegionalMunicipio,
        anoInicial: currentFilters.anoInicial,
        anoFinal: currentFilters.anoFinal,
        page: currentFilters.page,
        limit: currentFilters.limit,
      })
        .then((data) => {
          setApiData(data);
          setLoading(false);
          setTotalPages(data.pagination?.totalPages || 1);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    }
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setApiData(null);
    setHasInitialLoad(false); // Reset para mostrar a mensagem de filtro
    // Não carrega dados automaticamente - aguarda o usuário filtrar
  };

  const handleGroupTypeChange = (event) => {
    setGroupType(event.target.value);
    setApiData(null);
    setHasInitialLoad(false); // Reset para mostrar a mensagem de filtro
    // Não carrega dados automaticamente - aguarda o usuário filtrar
  };

  const handleFilterChange = (filters, indicatorType = null) => {
    // Limpar dados antigos para evitar oscilação/dados incorretos
    setApiData(null);
    setError(null);
    
    // Capturar o indicatorType para usar na requisição
    const indicatorToUse = indicatorType || selectedTable;
    
    // Atualizar o selectedTable se veio um indicatorType diferente
    if (indicatorType && indicatorType !== selectedTable) {
      setSelectedTable(indicatorType);
    }
    
    setSelectedMunicipio(filters.codigoMunicipio);
    setTerritorioDeDesenvolvimentoMunicipio(filters.territorioDeDesenvolvimentoMunicipio);
    setFaixaPopulacionalMunicipio(filters.faixaPopulacionalMunicipio);
    setAglomeradoMunicipio(filters.aglomeradoMunicipio);
    setGerenciaRegionalMunicipio(filters.gerenciaRegionalMunicipio);
    setFilters(prev => ({
      ...prev,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
    }));
    setLoading(true);
    setHasInitialLoad(true);
    
    // Usar os valores dos filtros diretamente em vez de aguardar o estado ser atualizado
    fetchTableData({
      codigoMunicipio: filters.codigoMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: 1,
      limit: limit,
    }, indicatorToUse);
  };

  // Escutar eventos de filtro aplicados
  useEffect(() => {
    const handleApplyFilters = (event) => {
      const { municipalIndicatorType, municipalSubIndicatorType, ...restFilters } = event.detail;
      
      // Atualizar indicador e subindicador selecionados
      if (municipalIndicatorType) {
        setSelectedIndicator(municipalIndicatorType);
      }
      if (municipalSubIndicatorType) {
        setSelectedSubIndicator(municipalSubIndicatorType);
        setSelectedTable(municipalSubIndicatorType);
      }
      
      handleFilterChange(restFilters, municipalSubIndicatorType || municipalIndicatorType);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setLoading(true);
    fetchTableData({
      codigoMunicipio: selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: newPage,
      limit,
    });
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    setPage(1);
    setLoading(true);
    fetchTableData({
      codigoMunicipio: selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: 1,
      limit: newLimit,
    });
  };

  return (
    <div>
      <div className="app-container">
        <hr className="divider" />

        {/* Área de dados - sempre visível */}
        <div className="data-section">
          {loading && <Loading />}

          {/* Se não está implementado, mostrar "Em Construção" mesmo que tenha erro */}
          {!loading && !isSubIndicatorImplemented(selectedSubIndicator) && (
            <UnderConstruction indicatorName={subIndicatorOptions[selectedIndicator]?.find(opt => opt.value === selectedSubIndicator)?.label} />
          )}

          {/* Mostrar erro apenas se o indicador está implementado */}
          {!loading && error && isSubIndicatorImplemented(selectedSubIndicator) && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#d9534f',
              fontSize: '18px'
            }}>
              <p>Falha ao carregar os dados. Por favor, tente novamente mais tarde.</p>
            </div>
          )}

          {!loading && !error && !apiData && !hasInitialLoad && isSubIndicatorImplemented(selectedSubIndicator) && (
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
              Selecione os filtros desejados na lateral e clique em "Filtrar" para montar uma consulta.
            </Typography>
          )}

          {!loading && !error && (!apiData || Object.keys(apiData).length === 0) && hasInitialLoad && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#d9534f',
              fontSize: '18px'
            }}>
              <p>Nenhum dado encontrado com os filtros selecionados.</p>
            </div>
          )}

          {!loading && !error && apiData && Object.keys(apiData).length > 0 && (
            <>
              {/* Indicador 1: Finanças Públicas */}
              {selectedIndicator === "financasPublicas" && (
                <>
                  {selectedSubIndicator === "composicaoReceitas" && (
                    <RevenueCompositionCharts data={apiData} title={chartTitle + " - Composição das Receitas"} />
                  )}
                  {selectedSubIndicator === "participacaoImpostosProprios" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="participacao-receita-impostos-proprios"
                      processDataFunction={processParticipacaoImpostosPropriosData}
                      title={chartTitle + " - Participação da receita de impostos próprios [%]"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "participacaoTransferencias" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="participacao-transferencias"
                      processDataFunction={processParticipacaoTransferenciasData}
                      title={chartTitle + " - Participação das transferências [%]"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "razaoImpostosTransferencias" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="razao-impostos-transferencias"
                      processDataFunction={processRazaoImpostosTransferenciasData}
                      title={chartTitle + " - Razão entre impostos próprios e transferências"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "razaoTransferenciasImpostos" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="razao-transferencias-impostos"
                      processDataFunction={processRazaoTransferenciasImpostosData}
                      title={chartTitle + " - Razão entre transferências e impostos próprios"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "participacaoFundeb" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="participacao-fundeb"
                      processDataFunction={processParticipacaoFundebData}
                      title={chartTitle + " - Participação do FUNDEB [%]"}
                      data={apiData}
                    />
                  )}
                </>
              )}

              {/* Indicador 2: Capacidade de Financiamento */}
              {selectedIndicator === "capacidadeFinanciamento" && (
                <>
                  {selectedSubIndicator === "rpeb" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="composicao_rpeb_financiamento"
                      processDataFunction={processRpebData}
                      title={chartTitle + " - Receita Potencial Mínima Vinculada à Educação Básica (RPEb) [R$]"}
                      data={apiData}
                    />
                  )}
                </>
              )}

              {/* Indicador 3: Recursos do Fundeb */}
              {selectedIndicator === "recursosFundeb" && (
                <>
                  {selectedSubIndicator === "participacaoFundebMde" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="fundeb_participation_mde"
                      processDataFunction={processParticipacaoFundebMdeData}
                      title={chartTitle + " - Participação do Fundeb na despesa em MDE [%]"}
                      data={apiData?.fundebParticipationMde}
                    />
                  )}
                  {selectedSubIndicator === "resultadoLiquidoFundeb" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="resultado_liquido_fundeb"
                      processDataFunction={processResultadoLiquidoFundebData}
                      title={chartTitle + " - Resultado Líquido do Fundeb [%]"}
                      data={apiData?.resultadoLiquidoFundeb}
                    />
                  )}
                  {selectedSubIndicator === "participacaoComplementacaoUniao" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="participacao_complementacao_uniao"
                      processDataFunction={processParticipacaoComplementacaoUniaoData}
                      title={chartTitle + " - Participação da complementação da União no FUNDEB [%]"}
                      data={apiData?.participacaoComplementacaoUniao}
                    />
                  )}
                </>
              )}

              {/* Indicador 4: Controle da Aplicação dos Recursos */}
              {selectedIndicator === "controleAplicacao" && (
                <>
                  {selectedSubIndicator === "aplicacaoMde" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType={selectedSubIndicator}
                      processDataFunction={processMDEData}
                      title={chartTitle + " - Aplicação em MDE (>=25%) [%]"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "aplicacaoFundebProfissionais" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType={selectedSubIndicator}
                      processDataFunction={processBasicEducationData}
                      title={chartTitle + " - Aplicação do Fundeb nos profissionais (>=70%) [%]"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "aplicacaoVaatInfantil" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="aplicacao_vaat_educacao_infantil"
                      processDataFunction={processVaatEducacaoInfantilData}
                      title={chartTitle + " - Aplicação VAAT Educação Infantil (>=50%) [%]"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "aplicacaoVaatCapital" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="aplicacao_vaat_despesa_capital"
                      processDataFunction={processVaatDespesaCapitalData}
                      title={chartTitle + " - Aplicação VAAT Despesa de Capital (>=15%) [%]"}
                      data={apiData}
                    />
                  )}
                </>
              )}

              {/* Indicador 5: Investimento em Educação */}
              {selectedIndicator === "investimentoEducacao" && (
                <>
                  {selectedSubIndicator === "despesaTotalEducacao" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="mde_total_expense"
                      processDataFunction={processDespesaTotalMdeData}
                      title={chartTitle + " - Despesa Total com Educação (MDE) [R$]"}
                      data={apiData}
                    />
                  )}
                  {selectedSubIndicator === "despesaPessoalAtivo" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="mde_pessoal_ativo"
                      processDataFunction={processDespesaPessoalAtivoData}
                      title={chartTitle + " - Despesa com pessoal ativo [%]"}
                      data={apiData?.mdePessoalAtivo}
                    />
                  )}
                  {selectedSubIndicator === "despesaPessoalInativo" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="mde_pessoal_inativo"
                      processDataFunction={processDespesaPessoalInativoData}
                      title={chartTitle + " - Despesa com pessoal inativo [%]"}
                      data={apiData?.mdePessoalInativo}
                    />
                  )}
                  {selectedSubIndicator === "despesaCapital" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="mde_capital"
                      processDataFunction={processDespesaCapitalData}
                      title={chartTitle + " - Despesa de Capital [%]"}
                      data={apiData?.mdeCapital}
                    />
                  )}
                  {selectedSubIndicator === "transferenciasPrivadas" && (
                    <ChartComponent
                      key={selectedSubIndicator + JSON.stringify(apiData)}
                      indicatorType="mde_transferencias_instituicoes_privadas"
                      processDataFunction={processTransferenciasPrivadasData}
                      title={chartTitle + " - Transferências às instituições privadas [%]"}
                      data={apiData?.mdeTransferenciasInstituicoesPrivadas}
                    />
                  )}
                </>
              )}

              <CustomPagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />

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

export default ChartContainer;
