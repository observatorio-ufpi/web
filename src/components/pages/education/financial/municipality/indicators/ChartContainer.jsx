import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import "../../../../../../App.css";
import { fetchData } from "../../../../../../services/apiService.jsx";
import "../../../../../../style/ChartPagination.css";
import {
  processBasicEducationData,
  processMDEData,
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

// Opções para os selects
const indicatorOptions = [
  { value: 'constitutionalLimitMde', label: 'Percentual aplicado em MDE' },
  { value: 'expensesBasicEducationFundeb', label: 'Percentual do fundeb nos profissionais de educação básica' },
  { value: 'revenueComposition', label: 'Composição das Receitas Impostos e Transferências Constitucionais e Legais [%]' },
  { value: 'financingCapacity', label: 'Capacidade de Financiamento' },
  { value: 'rpebComposition', label: 'Composição da Receita Potencial da Educação Básica [%]' },
  { value: 'resourcesApplicationControl', label: 'Controle da Aplicação de Recursos' },
  { value: 'educationExpenseComposition', label: 'Composição das Despesas em Educação [%]' },
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
  const [selectedTable, setSelectedTable] = useState("constitutionalLimitMde");
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

  const fetchTableData = (customFilters = null) => {
    if (loading) return; // Evita múltiplas chamadas simultâneas
    setLoading(true);

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

    if (selectedTable === "revenueComposition") {
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
        fetchData("participacao-receita-impostos-proprios", groupType, {
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
        fetchData("participacao-transferencias", groupType, {
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
        fetchData("razao-impostos-transferencias", groupType, {
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
        fetchData("razao-transferencias-impostos", groupType, {
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
        fetchData("participacao-fundeb", groupType, {
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
            participacaoReceitaImpostosProprios,
            participacaoTransferencias,
            razaoImpostosTransferencias,
            razaoTransferenciasImpostos,
            participacaoFundeb,
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
              participacaoReceitaImpostosProprios,
              participacaoTransferencias,
              razaoImpostosTransferencias,
              razaoTransferenciasImpostos,
              participacaoFundeb,
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
                participacaoReceitaImpostosProprios,
                participacaoTransferencias,
                razaoImpostosTransferencias,
                razaoTransferenciasImpostos,
                participacaoFundeb,
              }).map((data) => data.pagination?.totalPages || 1)
            ));
          }
        )
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
        });
    } else if (selectedTable === "rpebComposition") {
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
    } else if (selectedTable === "educationExpenseComposition") {
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
    } else if (selectedTable === "resourcesApplicationControl") {
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
    } else if (selectedTable === "financingCapacity") {
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
      fetchData(selectedTable, groupType, {
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

  const handleFilterChange = (filters) => {
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
    });
  };

  // Escutar eventos de filtro aplicados
  useEffect(() => {
    const handleApplyFilters = (event) => {
      const { municipalIndicatorType, ...restFilters } = event.detail;
      
      // Atualizar o indicador selecionado se vier do evento
      if (municipalIndicatorType && municipalIndicatorType !== selectedTable) {
        setSelectedTable(municipalIndicatorType);
      }
      
      handleFilterChange(restFilters);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, [handleFilterChange, selectedTable]);

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

          {!loading && error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#d9534f',
              fontSize: '18px'
            }}>
              <p>Falha ao carregar os dados. Por favor, tente novamente mais tarde.</p>
            </div>
          )}

          {!loading && !error && !apiData && !hasInitialLoad && (
            <>
              {/* Mostrar mensagem de desenvolvimento imediatamente */}
              {(selectedTable === "rpebComposition" || 
                selectedTable === "resourcesApplicationControl" || 
                selectedTable === "educationExpenseComposition") ? (
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
                  Selecione os filtros desejados na lateral e clique em "Filtrar" para montar uma consulta.
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
              <p>Nenhum dado encontrado com os filtros selecionados.</p>
            </div>
          )}

          {!loading && !error && apiData && (
            <>
              {selectedTable === "expensesBasicEducationFundeb" && (
                <ChartComponent
                  key={selectedTable + JSON.stringify(apiData)}
                  indicatorType={selectedTable}
                  processDataFunction={processBasicEducationData}
                  title={chartTitle + " - % do Fundeb nos profissionais de educação básica"}
                  data={apiData}
                />
              )}

              {selectedTable === "constitutionalLimitMde" && (
                <ChartComponent
                  key={selectedTable + JSON.stringify(apiData)}
                  indicatorType={selectedTable}
                  processDataFunction={processMDEData}
                  title={chartTitle + " - % Aplicado em MDE por Município"}
                  data={apiData}
                />
              )}

              {selectedTable === "revenueComposition" && (
                <RevenueCompositionCharts data={apiData} title={chartTitle + " - Composição das Receitas"} />
              )}

              {selectedTable === "financingCapacity" && (
                <FinancingCapacityCharts data={apiData} title={chartTitle + " - Capacidade de Financiamento"} />
              )}

              {selectedTable === "rpebComposition" && (
                <RpebCompositionCharts data={apiData} title={chartTitle + " - Composição da RPEB"} />
              )}

              {selectedTable === "resourcesApplicationControl" && (
                <ResourcesApplicationControlCharts data={apiData} title={chartTitle + " - Controle da Aplicação de Recursos"} />
              )}

              {selectedTable === "educationExpenseComposition" && (
                <EducationExpenseCompositionCharts data={apiData} title={chartTitle + " - Composição das Despesas em Educação"} />
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
