import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import "../../../../../../App.css";
import { fetchData } from "../../../../../../services/apiService.jsx";
import "../../../../../../style/RevenueTableContainer.css";
import {
  transformDataForTableByYear,
  transformDataForTableRevenues,
} from "../../../../../../utils/dataTransformingUtils.jsx";
import { municipios, Regioes, FaixaPopulacional } from "../../../../../../utils/municipios.mapping.jsx";
import {
  mapAdditionalMunicipalEducationRevenue,
  mapAllTables,
  mapAreasActivityExpense,
  mapBasicEducationMinimalPotential,
  mapComplementaryProtocol,
  mapComplementationFundebFundef,
  mapConstitutionalLimitMde,
  mapConstitutionalTransfersRevenue,
  mapExpensesBasicEducationFundeb,
  mapMunicipalFundebFundefComposition,
  mapMunicipalTaxesRevenues,
  mapOwnRevenues,
  standardizeTypeAdditionalEducationRevenues,
  standardizeTypeMunicipalTaxesRevenues,
  standardizedTypeAllTables,
  standardizedTypeAreasActivityExpense,
  standardizedTypeBasicEducationMinimalPotential,
  standardizedTypeComplementaryProtocol,
  standardizedTypeComplementationFundebFundef,
  standardizedTypeConstitutionalLimitMde,
  standardizedTypeConstitutionalTransfersRevenue,
  standardizedTypeExpensesBasicEducationFundeb,
  standardizedTypeMunicipalFundebFundefComposition,
  standardizedTypeOwnRevenues,
} from "../../../../../../utils/tablesMapping.jsx";
import CustomPagination from "../../../../../helpers/CustomPagination.jsx";
import FilterComponent from "../../../../../helpers/TableFilters.jsx";
import RevenueTable from "./RevenueTable.jsx";
import Select from "../../../../../ui/Select";
import { Loading } from "../../../../../ui";
import { Typography, Box, Menu, MenuItem } from "@mui/material";
import { ExpandMore, ExpandLess, ArrowDropDown } from '@mui/icons-material';
import { buildStyledWorkbook } from "../../../../../../utils/excelExportUtils.js";
import TechnicalSheetButton from "../../../../../common/TechnicalSheetButton.jsx";

// Opções para os selects
const tableOptions = [
  { value: 'ownRevenues', label: 'Receita de impostos próprios' },
  { value: 'constitutionalTransfersRevenue', label: 'Receita de transferências constitucionais e legais' },
  { value: 'municipalTaxesRevenues', label: 'Receita Líquida de Impostos do Município' },
  { value: 'additionalEducationRevenue', label: 'Receitas adicionais da educação no Município' },
  { value: 'municipalFundebFundefComposition', label: 'Composição do Fundeb no Município' },
  { value: 'complementationFundebFundef', label: 'Composição da complementação do Fundeb' },
  { value: 'constitutionalLimitMde', label: 'Limite constitucional em MDE no Município' },
  { value: 'expensesBasicEducationFundeb', label: 'Despesas com profissionais da Educação básica do Fundeb' },
  // { value: 'areasActivityExpense', label: 'Despesas em MDE por área de atuação' },
  { value: 'basicEducationMinimalPotential', label: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB)'},
  // { value: 'complementaryProtocol', label: 'Protocolo Complementar' },
];

const groupTypeOptions = [
  { value: 'desagregado', label: 'Desagregado (sem agrupamento)' },
  { value: 'municipio', label: 'Município' },
  { value: 'ano', label: 'Ano' },
];

function RevenueTableContainer() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState("ownRevenues");
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [groupType, setGroupType] = useState("municipio");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [tableTitle, setTableTitle] = useState("");
  const [filters, setFilters] = useState({
    nomeMunicipio: '',
    codigoMunicipio: '',
    territorioDeDesenvolvimentoMunicipio: '',
    faixaPopulacionalMunicipio: '',
    aglomeradoMunicipio: '',
    gerenciaRegionalMunicipio: '',
    anoInicial: 2007,
    anoFinal: 2024,
  });
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const shouldShowAllCitiesSingleYear =
    filters.anoInicial === filters.anoFinal && !filters.codigoMunicipio;
  const allCitiesLimit = 10000;
  const uiGroupType = shouldShowAllCitiesSingleYear ? 'ano' : groupType;

  // Backend pode retornar chaves (anos/municÃ­pios) sem dados; filtramos para nÃ£o renderizar tabelas vazias.
  const hasAnyRecordDeep = (node) => {
    if (!node) return false;
    if (Array.isArray(node)) return node.length > 0;
    if (typeof node !== 'object') return false;
    return Object.values(node).some(hasAnyRecordDeep);
  };

  const displayApiData = useMemo(() => {
    if (!apiData || typeof apiData !== 'object') return apiData;

    if (uiGroupType === 'ano') {
      // allTables: { revenueType: { year: yearData } }
      if (selectedTable === 'allTables') {
        const out = {};
        Object.entries(apiData).forEach(([revenueType, yearsObj]) => {
          if (!yearsObj || typeof yearsObj !== 'object') return;
          const filteredYears = {};
          Object.entries(yearsObj).forEach(([year, yearData]) => {
            if (hasAnyRecordDeep(yearData)) filteredYears[year] = yearData;
          });
          if (Object.keys(filteredYears).length > 0) out[revenueType] = filteredYears;
        });
        return out;
      }

      // Normal: { year: yearData }
      const out = {};
      Object.entries(apiData).forEach(([year, yearData]) => {
        if (hasAnyRecordDeep(yearData)) out[year] = yearData;
      });
      return out;
    }

    if (uiGroupType === 'municipio') {
      const out = {};
      Object.entries(apiData).forEach(([codigoMunicipio, municipioData]) => {
        if (hasAnyRecordDeep(municipioData)) out[codigoMunicipio] = municipioData;
      });
      return out;
    }

    return apiData;
  }, [apiData, uiGroupType, selectedTable]);

  const handlePageChange = (event, newPage) => {
    if (shouldShowAllCitiesSingleYear) return;
    setPage(newPage);
    setLoading(true);
    fetchTableData(newPage, limit);
  };

  const handleLimitChange = (event) => {
    if (shouldShowAllCitiesSingleYear) return;
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    setPage(1);
    setLoading(true);
    fetchTableData(1, newLimit);
  };

  const fetchTableData = (currentPage = page, currentLimit = limit) => {
    const effectiveGroupType = shouldShowAllCitiesSingleYear ? 'ano' : groupType;
    const effectivePage = shouldShowAllCitiesSingleYear ? 1 : currentPage;
    const effectiveLimit = shouldShowAllCitiesSingleYear ? allCitiesLimit : currentLimit;

    // Para 'desagregado', enviar 'municipio' para API mas consolidar visualmente
    const apiGroupType = effectiveGroupType === 'desagregado' ? 'municipio' : effectiveGroupType;

    fetchData(selectedTable, apiGroupType, {
      codigoMunicipio: selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: effectivePage,
      limit: effectiveLimit,
    })
      .then((response) => {
        // Construir o título com os filtros aplicados
        let locationName = 'Piauí';
        let ibgeCode = '';
        if (filters.nomeMunicipio && filters.codigoMunicipio) {
          locationName = filters.nomeMunicipio;
          ibgeCode = ` (IBGE: ${filters.codigoMunicipio})`;
        } else if (filters.nomeMunicipio) {
          locationName = filters.nomeMunicipio;
        }
        const yearDisplay = filters.anoInicial === filters.anoFinal ? filters.anoInicial : `${filters.anoInicial}-${filters.anoFinal}`;
        
        let titleParts = [`Dados Municipais - ${locationName}${ibgeCode} (${yearDisplay})`];
        
        // Adicionar filtros aplicados ao título
        let filterInfo = [];
        if (filters.territorioDeDesenvolvimentoMunicipio) {
          const territorioLabel = Regioes[filters.territorioDeDesenvolvimentoMunicipio] || filters.territorioDeDesenvolvimentoMunicipio;
          filterInfo.push(territorioLabel);
        }
        if (filters.faixaPopulacionalMunicipio) {
          const faixaLabel = FaixaPopulacional[filters.faixaPopulacionalMunicipio] || filters.faixaPopulacionalMunicipio;
          filterInfo.push(faixaLabel);
        }
        if (filters.aglomeradoMunicipio) {
          filterInfo.push(`Aglomerado ${filters.aglomeradoMunicipio}`);
        }
        if (filters.gerenciaRegionalMunicipio) {
          filterInfo.push(`${filters.gerenciaRegionalMunicipio}ª GRE`);
        }
        
        if (filterInfo.length > 0) {
          titleParts.push(`Filtros: ${filterInfo.join(', ')}`);
        }
        
        setTableTitle(titleParts.join(' | '));
        
        console.log('Dados recebidos para groupType:', groupType, 'API groupType:', apiGroupType);
        console.log('Estrutura apiData:', JSON.stringify(response.data, null, 2).substring(0, 500));
        console.log('Chaves do apiData:', Object.keys(response.data));
        if (response.data && Object.keys(response.data).length > 0) {
          const firstKey = Object.keys(response.data)[0];
          console.log('Primeiro valor:', response.data[firstKey]);
        }
        setApiData(response.data);
        setLoading(false);
        setHasInitialLoad(true);
        // Lidar com paginação quando disponível
        if (shouldShowAllCitiesSingleYear) {
          setPage(1);
          setTotalPages(1);
        } else if (response.pagination) {
          setPage(response.pagination.page);
          setLimit(response.pagination.limit);
          setTotalPages(response.pagination.totalPages || 1);
        } else {
          // Se não houver paginação, definir valores padrão
          setPage(1);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
        setError(error.message || 'Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
        setLoading(false);
        setTotalPages(1);
        setHasInitialLoad(true);
      });
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setApiData(null);
    setError(null);
    setHasInitialLoad(false); // Reset para mostrar a mensagem de filtro
    // Não carrega dados automaticamente - aguarda o usuário filtrar
  };

  const handleFilterChange = (filterData) => {
    // Limpar dados antigos para evitar oscilação/dados incorretos
    setApiData(null);
    setError(null);
    
    // Capturar o tableType do filterData para usar na requisição e no título
    const tableTypeToUse = filterData.tableType || selectedTable;
    
    // Atualizar o selectedTable se veio um tableType diferente
    if (filterData.tableType && filterData.tableType !== selectedTable) {
      setSelectedTable(filterData.tableType);
    }
    
    setSelectedMunicipio(filterData.codigoMunicipio);
    
    // Atualizar todos os filtros no estado
    const newFilters = {
      nomeMunicipio: filterData.nomeMunicipio || (filterData.codigoMunicipio ? municipios[filterData.codigoMunicipio]?.nomeMunicipio : null),
      codigoMunicipio: filterData.codigoMunicipio,
      territorioDeDesenvolvimentoMunicipio: filterData.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filterData.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filterData.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filterData.gerenciaRegionalMunicipio,
      anoInicial: filterData.anoInicial,
      anoFinal: filterData.anoFinal,
    };
    
    const shouldAllCitiesSingleYear =
      newFilters.anoInicial === newFilters.anoFinal && !newFilters.codigoMunicipio;
    const effectiveGroupType = shouldAllCitiesSingleYear ? 'ano' : groupType;
    const effectiveLimit = shouldAllCitiesSingleYear ? allCitiesLimit : limit;

    setFilters(newFilters);
    setLoading(true);
    setPage(1);
    setHasInitialLoad(true);

    if (shouldAllCitiesSingleYear && groupType !== 'ano') {
      // Ajusta o UI para refletir o modo de 1 ano (todas as cidades).
      setGroupType('ano');
    }
    
    // Usar os valores dos filtros diretamente em vez de aguardar o estado ser atualizado
    const apiGroupType = effectiveGroupType === 'desagregado' ? 'municipio' : effectiveGroupType;
    console.log('Chamando fetchData com:', { tableTypeToUse, apiGroupType, filters: newFilters });
    fetchData(tableTypeToUse, apiGroupType, {
      codigoMunicipio: filterData.codigoMunicipio,
      territorioDeDesenvolvimentoMunicipio: filterData.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filterData.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filterData.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filterData.gerenciaRegionalMunicipio,
      anoInicial: filterData.anoInicial,
      anoFinal: filterData.anoFinal,
      page: 1,
      limit: effectiveLimit,
    })
      .then((response) => {
        console.log('Resposta completa do servidor:', JSON.stringify(response, null, 2).substring(0, 2000));
        
        // Construir o título com os filtros aplicados
        const nomeMunicipio = newFilters.nomeMunicipio;
        let locationName = nomeMunicipio || 'Piauí';
        let ibgeCode = newFilters.codigoMunicipio ? ` (IBGE: ${newFilters.codigoMunicipio})` : '';
        const yearDisplay = newFilters.anoInicial === newFilters.anoFinal ? newFilters.anoInicial : `${newFilters.anoInicial}-${newFilters.anoFinal}`;
        
        // Obter o nome da tabela selecionada (usar tableTypeToUse capturado)
        const tableLabel = tableOptions.find(t => t.value === tableTypeToUse)?.label || tableTypeToUse;
        
        // Construir partes do título
        let titleParts = [`${tableLabel} - ${locationName}${ibgeCode} (${yearDisplay})`];
        
        // Adicionar filtros aplicados ao título
        let filterInfo = [];
        if (newFilters.territorioDeDesenvolvimentoMunicipio) {
          const territorioLabel = Regioes[newFilters.territorioDeDesenvolvimentoMunicipio] || newFilters.territorioDeDesenvolvimentoMunicipio;
          filterInfo.push(`Território: ${territorioLabel}`);
        }
        if (newFilters.faixaPopulacionalMunicipio) {
          const faixaLabel = FaixaPopulacional[newFilters.faixaPopulacionalMunicipio] || newFilters.faixaPopulacionalMunicipio;
          filterInfo.push(`Faixa: ${faixaLabel}`);
        }
        if (newFilters.aglomeradoMunicipio) {
          filterInfo.push(`Aglomerado: ${newFilters.aglomeradoMunicipio}`);
        }
        if (newFilters.gerenciaRegionalMunicipio) {
          filterInfo.push(`GRE: ${newFilters.gerenciaRegionalMunicipio}ª`);
        }
        
        if (filterInfo.length > 0) {
          titleParts.push(filterInfo.join(' | '));
        }
        
        setTableTitle(titleParts.join(' - '));
        
        setApiData(response.data);
        setLoading(false);
        setPage(1);
        if (shouldAllCitiesSingleYear) {
          setTotalPages(1);
        } else {
          setLimit(response.pagination?.limit || limit);
          setTotalPages(response.pagination?.totalPages || 1);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
        setTotalPages(1);
      });
  };

  const handleGroupTypeChange = (event) => {
    setGroupType(event.target.value);
    setApiData(null);
    setError(null);
    setHasInitialLoad(false); // Reset para mostrar a mensagem de filtro
    setPage(1);
    // Não carrega dados automaticamente - aguarda o usuário filtrar
  };

  // Ouvir eventos do sidebar
  useEffect(() => {
    const handleApplyFilters = (event) => {
      handleFilterChange(event.detail);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, []);

  // Função para consolidar dados de múltiplos municípios agrupados por ano
  const consolidateDataByMunicipio = (data) => {
    if (!data) return {};
    
    // Se for um objeto vazio, retornar objeto vazio
    if (Object.keys(data).length === 0) return {};
    
    // Consolidar por ano: { "2023": [...todos os registros de 2023...], "2024": [...] }
    const consolidatedData = {};
    
    // Iterar sobre cada chave (que pode ser municipio ou ano)
    Object.entries(data).forEach(([key, value]) => {
      // Se for um array direto (array de registros por municipio), consolidar por ano
      if (Array.isArray(value)) {
        value.forEach((record) => {
          const year = record.ano ? String(record.ano) : key; // Usar ano do record, ou key se não existir
          if (!consolidatedData[year]) {
            consolidatedData[year] = [];
          }
          consolidatedData[year].push(record);
        });
      } 
      // Se for um objeto que contém arrays aninhados (estrutura complexa)
      else if (value && typeof value === 'object') {
        // Iterar sobre as chaves do objeto aninhado
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (Array.isArray(subValue)) {
            subValue.forEach((record) => {
              const year = record.ano ? String(record.ano) : subKey; // Usar record.ano, ou subKey se não existir
              if (!consolidatedData[year]) {
                consolidatedData[year] = [];
              }
              consolidatedData[year].push(record);
            });
          }
        });
      }
    });
    
    return consolidatedData;
  };

  // Função para preparar dados de um município específico para a tabela
  const prepareDataForMunicipio = (data, codigoMunicipio) => {
    if (!data || !data[codigoMunicipio]) return {};
    
    const municipioData = data[codigoMunicipio];
    const preparedData = {};
    
    // Agrupar por período (revenues0708, revenues09, etc.)
    Object.entries(municipioData).forEach(([period, records]) => {
      if (Array.isArray(records)) {
        records.forEach((record) => {
          const year = record.ano ? String(record.ano) : period;
          if (!preparedData[year]) {
            preparedData[year] = [];
          }
          preparedData[year].push(record);
        });
      }
    });
    
    return preparedData;
  };

  // Função para obter lista de municípios do apiData
  const getMunicipiosFromData = (data) => {
    if (!data) return [];
    return Object.keys(data).filter(key => {
      // Verificar se a chave parece ser código de município (6 ou 7 dígitos numéricos)
      return /^\d{6,7}$/.test(key);
    });
  };

  // Função para obter o nome do município
  const getNomeMunicipio = (codigoMunicipio) => {
    return municipios[codigoMunicipio]?.nomeMunicipio || `Município ${codigoMunicipio}`;
  };

  // Função para gerar nome do arquivo com filtros aplicados
  const gerarNomeArquivo = (nomeTabela, sufixo = '') => {
    const partes = [nomeTabela];
    
    // Período
    if (filters.anoInicial && filters.anoFinal) {
      if (filters.anoInicial === filters.anoFinal) {
        partes.push(filters.anoInicial);
      } else {
        partes.push(`${filters.anoInicial}-${filters.anoFinal}`);
      }
    }
    
    // Município específico
    if (filters.nomeMunicipio) {
      partes.push(filters.nomeMunicipio.replace(/\s+/g, '_'));
    }
    
    // Território de desenvolvimento
    if (filters.territorioDeDesenvolvimentoMunicipio) {
      const territorioLabel = Regioes[filters.territorioDeDesenvolvimentoMunicipio] || filters.territorioDeDesenvolvimentoMunicipio;
      partes.push(`TD_${territorioLabel.replace(/\s+/g, '_')}`);
    }
    
    // Faixa populacional
    if (filters.faixaPopulacionalMunicipio) {
      const faixaLabel = FaixaPopulacional[filters.faixaPopulacionalMunicipio] || filters.faixaPopulacionalMunicipio;
      partes.push(`FP_${faixaLabel.replace(/\s+/g, '_').replace(/[^\w]/g, '')}`);
    }
    
    // Aglomerado
    if (filters.aglomeradoMunicipio) {
      partes.push(`Agl_${filters.aglomeradoMunicipio}`);
    }
    
    // GRE
    if (filters.gerenciaRegionalMunicipio) {
      partes.push(`GRE_${filters.gerenciaRegionalMunicipio}`);
    }
    
    // Sufixo adicional (nome do município no arquivo individual, etc)
    if (sufixo) {
      partes.push(sufixo.replace(/\s+/g, '_'));
    }
    
    return partes.join('_').replace(/[<>:"/\\|?*]/g, '');
  };

  const downloadAllTables = async () => {
    const tableMappings = {
      ownRevenues: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeOwnRevenues,
        map: mapOwnRevenues,
        name: "Impostos_Proprios",
      },
      constitutionalTransfersRevenue: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeConstitutionalTransfersRevenue,
        map: mapConstitutionalTransfersRevenue,
        name: "Receita_Transferencias_Constitucionais_Legais",
      },
      municipalTaxesRevenues: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizeTypeMunicipalTaxesRevenues,
        map: mapMunicipalTaxesRevenues,
        name: "Receita_Liquida_Impostos_Municipio",
      },
      additionalEducationRevenue: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizeTypeAdditionalEducationRevenues,
        map: mapAdditionalMunicipalEducationRevenue,
        name: "Receitas_Adicionais_Educacao_Municipio",
      },
      municipalFundebFundefComposition: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeMunicipalFundebFundefComposition,
        map: mapMunicipalFundebFundefComposition,
        name: "Composicao_Fundef_Fundeb_Municipio",
      },
      complementationFundebFundef: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeComplementationFundebFundef,
        map: mapComplementationFundebFundef,
        name: "Composicao_Complementacao_Fundef_Fundeb",
      },
      areasActivityExpense: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeAreasActivityExpense,
        map: mapAreasActivityExpense,
        name: "Despesas_MDE_Area_Atuacao",
      },
      basicEducationMinimalPotential: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeBasicEducationMinimalPotential,
        map: mapBasicEducationMinimalPotential,
        name: "Receita_Potencial_Minima_Educacao_Basica",
      },
      constitutionalLimitMde: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeConstitutionalLimitMde,
        map: mapConstitutionalLimitMde,
        name: "Limite_Constitucional_MDE_Municipio",
      },
      expensesBasicEducationFundeb: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeExpensesBasicEducationFundeb,
        map: mapExpensesBasicEducationFundeb,
        name: "Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb",
      },
      complementaryProtocol: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeComplementaryProtocol,
        map: mapComplementaryProtocol,
        name: "Protocolo_Complementar",
      },
      allTables: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeAllTables,
        map: mapAllTables,
        name: "Tabelao_RREO",
      },
    };

    const { transformByMunicipio, transformByAno, standardize, map, name } = tableMappings[selectedTable];
    const zip = new JSZip();
    const fonte = "Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI";
    
    // Buscar TODOS os dados da API (sem limitação de paginação)
    const effectiveGroupType = shouldShowAllCitiesSingleYear ? 'ano' : groupType;
    const apiGroupType = effectiveGroupType === 'desagregado' ? 'municipio' : effectiveGroupType;
    let allApiData;
    
    try {
      setLoading(true);
      const response = await fetchData(selectedTable, apiGroupType, {
        codigoMunicipio: filters.codigoMunicipio,
        territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
        faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
        aglomeradoMunicipio: filters.aglomeradoMunicipio,
        gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
        anoInicial: filters.anoInicial,
        anoFinal: filters.anoFinal,
        page: 1,
        limit: 10000, // Buscar todos os registros
      });
      allApiData = response.data;
      // Mantem loading ativo durante a geração do arquivo (ZIP/Excel).
    } catch (error) {
      console.error('Erro ao buscar dados para exportação:', error);
      setLoading(false);
      return;
    }

    if (effectiveGroupType === "municipio") {
      for (const municipio of Object.keys(allApiData)) {
        if (!hasAnyRecordDeep(allApiData[municipio])) continue;
        // Usar transformByMunicipio que espera a estrutura { revenues0708: [...], revenues09: [...] }
        const { rows, typeToRowToValue } = transformByMunicipio(
          allApiData[municipio],
          standardize
        );
        const types = Object.keys(map);
        const nomeMunicipioLabel = municipios[municipio]?.nomeMunicipio || municipio;
        const titulo = `${name} - ${nomeMunicipioLabel}`;

        const workbook = await buildStyledWorkbook({
          creator: "OPEPI/UFPI",
          sheetName: "Receitas",
          title: titulo,
          headers: ["Ano", ...types],
          rows: rows.map((row) => [
            row,
            ...types.map((type) =>
              typeToRowToValue[type] &&
              typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]),
          source: fonte,
        });

        const excelBuffer = await workbook.xlsx.writeBuffer();
        const nomeArquivoIndividual = gerarNomeArquivo(name, nomeMunicipioLabel);
        zip.file(
          `${nomeArquivoIndividual}.xlsx`,
          excelBuffer
        );
      }

      const content = await zip.generateAsync({ type: "blob" });
      const nomeArquivoZip = gerarNomeArquivo(name, 'Todos_Municipios');
      saveAs(content, `${nomeArquivoZip}.zip`);
      setLoading(false);
    } else if (effectiveGroupType === "ano") {
      for (const year of Object.keys(allApiData)) {
        if (!hasAnyRecordDeep(allApiData[year])) continue;
        // Usar transformByAno que retorna municípios como rows
        const { rows, typeToRowToValue } = transformByAno(
          allApiData[year],
          standardize
        );
        const types = Object.keys(map);
        const titulo = `${name} - ${year}`;

        const workbook = await buildStyledWorkbook({
          creator: "OPEPI/UFPI",
          sheetName: "Receitas",
          title: titulo,
          headers: ["Município", ...types],
          rows: rows.map((row) => [
            `${municipios[row]?.nomeMunicipio || row}`,
            ...types.map((type) =>
              typeToRowToValue[type] &&
              typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]),
          source: fonte,
        });

        const excelBuffer = await workbook.xlsx.writeBuffer();
        const nomeArquivoIndividual = gerarNomeArquivo(name, year);
        zip.file(`${nomeArquivoIndividual}.xlsx`, excelBuffer);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const nomeArquivoZip = gerarNomeArquivo(name, 'Todos_Anos');
      saveAs(content, `${nomeArquivoZip}.zip`);
      setLoading(false);
    } else if (effectiveGroupType === "desagregado") {
      // Para dados desagregados, criar um único arquivo com todos os dados
      const { rows, typeToRowToValue } = transformByAno(
        allApiData,
        standardize
      );
      const types = Object.keys(map);
      const titulo = `${name} - Desagregado`;

      const workbook = await buildStyledWorkbook({
        creator: "OPEPI/UFPI",
        sheetName: "Receitas",
        title: titulo,
        headers: ["Município", ...types],
        rows: rows.map((row) => [
          `${municipios[row]?.nomeMunicipio || row}`,
          ...types.map((type) =>
            typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
              ? typeToRowToValue[type][row]
              : "-"
          ),
        ]),
        source: fonte,
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const nomeArquivoDesagregado = gerarNomeArquivo(name, 'Desagregado');
      saveAs(blob, `${nomeArquivoDesagregado}.xlsx`);
      setLoading(false);
    }
  };

  // Estado para o menu de download
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);

  const handleDownloadMenuOpen = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  // Função para baixar todas as tabelas em um único arquivo consolidado
  const downloadAllTablesConsolidated = async () => {
    handleDownloadMenuClose();
    
    const tableMappings = {
      ownRevenues: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeOwnRevenues,
        map: mapOwnRevenues,
        name: "Impostos_Proprios",
      },
      constitutionalTransfersRevenue: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeConstitutionalTransfersRevenue,
        map: mapConstitutionalTransfersRevenue,
        name: "Receita_Transferencias_Constitucionais_Legais",
      },
      municipalTaxesRevenues: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizeTypeMunicipalTaxesRevenues,
        map: mapMunicipalTaxesRevenues,
        name: "Receita_Liquida_Impostos_Municipio",
      },
      additionalEducationRevenue: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizeTypeAdditionalEducationRevenues,
        map: mapAdditionalMunicipalEducationRevenue,
        name: "Receitas_Adicionais_Educacao_Municipio",
      },
      municipalFundebFundefComposition: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeMunicipalFundebFundefComposition,
        map: mapMunicipalFundebFundefComposition,
        name: "Composicao_Fundef_Fundeb_Municipio",
      },
      complementationFundebFundef: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeComplementationFundebFundef,
        map: mapComplementationFundebFundef,
        name: "Composicao_Complementacao_Fundef_Fundeb",
      },
      areasActivityExpense: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeAreasActivityExpense,
        map: mapAreasActivityExpense,
        name: "Despesas_MDE_Area_Atuacao",
      },
      basicEducationMinimalPotential: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeBasicEducationMinimalPotential,
        map: mapBasicEducationMinimalPotential,
        name: "Receita_Potencial_Minima_Educacao_Basica",
      },
      constitutionalLimitMde: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeConstitutionalLimitMde,
        map: mapConstitutionalLimitMde,
        name: "Limite_Constitucional_MDE_Municipio",
      },
      expensesBasicEducationFundeb: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeExpensesBasicEducationFundeb,
        map: mapExpensesBasicEducationFundeb,
        name: "Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb",
      },
      complementaryProtocol: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeComplementaryProtocol,
        map: mapComplementaryProtocol,
        name: "Protocolo_Complementar",
      },
      allTables: {
        transformByMunicipio: transformDataForTableRevenues,
        transformByAno: transformDataForTableByYear,
        standardize: standardizedTypeAllTables,
        map: mapAllTables,
        name: "Tabelao_RREO",
      },
    };

    const { transformByMunicipio, transformByAno, standardize, map, name } = tableMappings[selectedTable];
    const fonte = "Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI";
    let allData = [];
    
    // Cabeçalho com todas as colunas de tipos
    const types = Object.keys(map);
    
    // Buscar TODOS os dados da API (sem limitação de paginação)
    const effectiveGroupType = shouldShowAllCitiesSingleYear ? 'ano' : groupType;
    const apiGroupType = effectiveGroupType === 'desagregado' ? 'municipio' : effectiveGroupType;
    let allApiData;
    
    try {
      setLoading(true);
      const response = await fetchData(selectedTable, apiGroupType, {
        codigoMunicipio: filters.codigoMunicipio,
        territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
        faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
        aglomeradoMunicipio: filters.aglomeradoMunicipio,
        gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
        anoInicial: filters.anoInicial,
        anoFinal: filters.anoFinal,
        page: 1,
        limit: 10000, // Buscar todos os registros
      });
      allApiData = response.data;
      // Mantem loading ativo durante a geração do arquivo.
    } catch (error) {
      console.error('Erro ao buscar dados para exportação:', error);
      setLoading(false);
      return;
    }
    
    if (effectiveGroupType === "municipio") {
      // Consolidar todos os municípios em uma única tabela
      allData.push(["Município", "Ano", ...types]);
      
      Object.keys(allApiData).forEach((municipio) => {
        if (!hasAnyRecordDeep(allApiData[municipio])) return;
        // Usar transformByMunicipio que espera a estrutura { revenues0708: [...], revenues09: [...] }
        const { rows, typeToRowToValue } = transformByMunicipio(
          allApiData[municipio],
          standardize
        );
        const nomeMunicipioLabel = municipios[municipio]?.nomeMunicipio || municipio;
        
        rows.forEach((row) => {
          allData.push([
            nomeMunicipioLabel,
            row,
            ...types.map((type) =>
              typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]);
        });
      });
    } else if (effectiveGroupType === "ano") {
      // Consolidar todos os anos em uma única tabela
      allData.push(["Ano", "Município", ...types]);
      
      Object.keys(allApiData).forEach((year) => {
        if (!hasAnyRecordDeep(allApiData[year])) return;
        // Usar transformByAno que retorna municípios como rows
        const { rows, typeToRowToValue } = transformByAno(
          allApiData[year],
          standardize
        );
        
        rows.forEach((row) => {
          allData.push([
            year,
            `${municipios[row]?.nomeMunicipio || row}`,
            ...types.map((type) =>
              typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]);
        });
      });
    } else if (effectiveGroupType === "desagregado") {
      // Para dados desagregados, mesma estrutura
      const { rows, typeToRowToValue } = transformByAno(allApiData, standardize);
      
      allData.push(["Município", ...types]);
      rows.forEach((row) => {
        allData.push([
          `${municipios[row]?.nomeMunicipio || row}`,
          ...types.map((type) =>
            typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
              ? typeToRowToValue[type][row]
              : "-"
          ),
        ]);
      });
    }

    const titulo = `${name} - Consolidado`;
    const consolidatedHeaders = allData[0] || [""];
    const consolidatedRows = allData.slice(1);

    const numericColumns = consolidatedHeaders
      .map((_, idx) => idx)
      .filter((idx) => idx >= (effectiveGroupType === "desagregado" ? 1 : 2));

    const workbook = await buildStyledWorkbook({
      creator: "OPEPI/UFPI",
      sheetName: "Dados_Consolidados",
      title: titulo,
      headers: consolidatedHeaders,
      rows: consolidatedRows,
      source: fonte,
      numericColumns,
      columnWidths: consolidatedHeaders.map((h) => {
        const lower = (h ?? "").toString().toLowerCase();
        if (lower === "ano") return 12;
        if (lower.includes("munic")) return 35;
        return 20;
      }),
    });

    const nomeArquivoConsolidado = gerarNomeArquivo(name, "Consolidado");
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${nomeArquivoConsolidado}.xlsx`);
    setLoading(false);
  };

  // Handler para download separado (já existente, mas com fechamento do menu)
  const handleDownloadSeparate = async () => {
    handleDownloadMenuClose();
    await downloadAllTables();
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

          {!loading && !error && (!displayApiData || Object.keys(displayApiData).length === 0) && hasInitialLoad && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#d9534f',
              fontSize: '18px'
            }}>
              <p>Nenhum dado encontrado com os filtros selecionados.</p>
            </div>
          )}

          {!loading && !error && displayApiData && Object.keys(displayApiData).length > 0 && (
            <>
              {tableTitle && (
                <Box sx={{ padding: 2 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}
                  >
                    {tableTitle}
                  </Typography>
                </Box>
              )}
              <div className="table-container">
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleDownloadMenuOpen}
                    endIcon={<ArrowDropDown />}
                    sx={{ marginTop: 2 }}
                  >
                    Baixar Todas as Tabelas
                  </Button>
                  <TechnicalSheetButton buttonSx={{ marginTop: 2 }} />
                  <Menu
                    anchorEl={downloadMenuAnchor}
                    open={Boolean(downloadMenuAnchor)}
                    onClose={handleDownloadMenuClose}
                  >
                    <MenuItem onClick={handleDownloadSeparate}>
                      Tabelas Separadas (ZIP)
                    </MenuItem>
                    <MenuItem onClick={downloadAllTablesConsolidated}>
                      Tabela Única Consolidada (Excel)
                    </MenuItem>
                  </Menu>
                </div>
              {uiGroupType === "desagregado" ? (
                // Renderização para dados desagregados
                <>
                  {selectedTable === "allTables"
                    ? Object.keys(displayApiData).map((revenueType) =>
                        Object.keys(displayApiData[revenueType]).map((key) => (
                          <div key={key}>
                            {selectedTable === "allTables" && (
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[revenueType][key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            )}
                          </div>
                        ))
                      )
                    : selectedTable === "ownRevenues" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={displayApiData}
                          transformDataFunction={transformDataForTableByYear}
                          standardizeTypeFunction={standardizedTypeOwnRevenues}
                          tableMapping={mapOwnRevenues}
                          tableName="Impostos Próprios"
                          keyTable="desagregado"
                          groupType={uiGroupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={filters.nomeMunicipio}
                        />
                      )}
                  {selectedTable === "constitutionalTransfersRevenue" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                      tableMapping={mapConstitutionalTransfersRevenue}
                      tableName="Receita de transferências constitucionais e legais"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                      enableMonetaryCorrection={true}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "municipalTaxesRevenues" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                      tableMapping={mapMunicipalTaxesRevenues}
                      tableName="Receita Líquida de Impostos do Município"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                      enableMonetaryCorrection={true}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "additionalEducationRevenue" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                      tableMapping={mapAdditionalMunicipalEducationRevenue}
                      tableName="Receitas adicionais da educação no Município"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                      enableMonetaryCorrection={true}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "municipalFundebFundefComposition" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                      tableMapping={mapMunicipalFundebFundefComposition}
                      tableName="Composição do Fundef/Fundeb no município"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "complementationFundebFundef" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                      tableMapping={mapComplementationFundebFundef}
                      tableName="Composição da complementação do Fundef/Fundeb"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "constitutionalLimitMde" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                      tableMapping={mapConstitutionalLimitMde}
                      tableName="Limite constitucional em MDE no município"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "expensesBasicEducationFundeb" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                      tableMapping={mapExpensesBasicEducationFundeb}
                      tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "areasActivityExpense" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                      tableMapping={mapAreasActivityExpense}
                      tableName="Despesas em MDE por área de atuação"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "basicEducationMinimalPotential" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                      tableMapping={mapBasicEducationMinimalPotential}
                      tableName="Receita Potencial Mínima vinculada à Educação Básica"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "complementaryProtocol" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={displayApiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                      tableMapping={mapComplementaryProtocol}
                      tableName="Protocolo Complementar"
                      keyTable="desagregado"
                      groupType={uiGroupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                </>
              ) : uiGroupType === "municipio" ? (
                // Renderização para dados agrupados por MUNICÍPIO (UMA TABELA POR MUNICÍPIO)
                <>
                  {getMunicipiosFromData(displayApiData).map((codigoMunicipio) => (
                    <div key={codigoMunicipio} style={{ marginBottom: '2rem' }}>
                      <Box sx={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', borderRadius: 0.5, marginBottom: 0.5, borderLeft: '3px solid #666' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#424242' }}>
                          {getNomeMunicipio(codigoMunicipio)} <span style={{ color: '#757575', fontWeight: 400 }}>|</span> <span style={{ color: '#616161', fontWeight: 400, fontSize: '0.9em' }}>IBGE {codigoMunicipio}</span>
                        </Typography>
                      </Box>
                      {selectedTable === "ownRevenues" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeOwnRevenues}
                          tableMapping={mapOwnRevenues}
                          tableName="Impostos Próprios"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "constitutionalTransfersRevenue" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                          tableMapping={mapConstitutionalTransfersRevenue}
                          tableName="Receita de transferências constitucionais e legais"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "municipalTaxesRevenues" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                          tableMapping={mapMunicipalTaxesRevenues}
                          tableName="Receita Líquida de Impostos do Município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "additionalEducationRevenue" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                          tableMapping={mapAdditionalMunicipalEducationRevenue}
                          tableName="Receitas adicionais da educação no Município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "municipalFundebFundefComposition" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                          tableMapping={mapMunicipalFundebFundefComposition}
                          tableName="Composição do Fundef/Fundeb no município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "complementationFundebFundef" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                          tableMapping={mapComplementationFundebFundef}
                          tableName="Composição da complementação do Fundef/Fundeb"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "constitutionalLimitMde" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                          tableMapping={mapConstitutionalLimitMde}
                          tableName="Limite constitucional em MDE no município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "expensesBasicEducationFundeb" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                          tableMapping={mapExpensesBasicEducationFundeb}
                          tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "areasActivityExpense" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                          tableMapping={mapAreasActivityExpense}
                          tableName="Despesas em MDE por área de atuação"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "basicEducationMinimalPotential" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                          tableMapping={mapBasicEducationMinimalPotential}
                          tableName="Receita Potencial Mínima vinculada à Educação Básica"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "complementaryProtocol" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                          tableMapping={mapComplementaryProtocol}
                          tableName="Protocolo Complementar"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "allTables" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(displayApiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeAllTables}
                          tableName="Tabelão"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={uiGroupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                // Renderização para dados agrupados por ANO (múltiplas tabelas, uma por ano)
                <>
                  {selectedTable === "allTables"
                    ? Object.keys(displayApiData).map((revenueType) =>
                        Object.keys(displayApiData[revenueType]).map((key) => (
                          <div key={key}>
                            {selectedTable === "allTables" && (
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[revenueType][key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            )}
                          </div>
                        ))
                      )
                    : Object.keys(displayApiData).map((key) => (
                        <div key={key}>
                          <div className="table-header">
                            <h2>
                              <span className="table-header-label">Ano: </span>
                              {key}
                            </h2>
                          </div>
                          {selectedTable === "ownRevenues" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeOwnRevenues}
                                tableMapping={mapOwnRevenues}
                                tableName="Impostos Próprios"
                                keyTable={key}
                                groupType={uiGroupType}
                                enableMonetaryCorrection={true}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "constitutionalTransfersRevenue" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                                tableMapping={mapConstitutionalTransfersRevenue}
                                tableName="Receita de transferências constitucionais e legais"
                                keyTable={key}
                                groupType={uiGroupType}
                                enableMonetaryCorrection={true}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "municipalTaxesRevenues" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                                tableMapping={mapMunicipalTaxesRevenues}
                                tableName="Receita Líquida de Impostos do Município"
                                keyTable={key}
                                groupType={uiGroupType}
                                enableMonetaryCorrection={true}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "additionalEducationRevenue" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                                tableMapping={mapAdditionalMunicipalEducationRevenue}
                                tableName="Receitas adicionais da educação no Município"
                                keyTable={key}
                                groupType={uiGroupType}
                                enableMonetaryCorrection={true}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "municipalFundebFundefComposition" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                                tableMapping={mapMunicipalFundebFundefComposition}
                                tableName="Composição do Fundef/Fundeb no município"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "complementationFundebFundef" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                                tableMapping={mapComplementationFundebFundef}
                                tableName="Composição da complementação do Fundef/Fundeb"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "constitutionalLimitMde" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                                tableMapping={mapConstitutionalLimitMde}
                                tableName="Limite constitucional em MDE no município"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "expensesBasicEducationFundeb" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                                tableMapping={mapExpensesBasicEducationFundeb}
                                tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "areasActivityExpense" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                                tableMapping={mapAreasActivityExpense}
                                tableName="Despesas em MDE por área de atuação"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "basicEducationMinimalPotential" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                                tableMapping={mapBasicEducationMinimalPotential}
                                tableName="Receita Potencial Mínima vinculada à Educação Básica"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                          {selectedTable === "complementaryProtocol" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={displayApiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                                tableMapping={mapComplementaryProtocol}
                                tableName="Protocolo Complementar"
                                keyTable={key}
                                groupType={uiGroupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                </>
              )}

              {!shouldShowAllCitiesSingleYear && (
                <CustomPagination
                  page={page}
                  totalPages={totalPages}
                  limit={limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              )}

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevenueTableContainer;

