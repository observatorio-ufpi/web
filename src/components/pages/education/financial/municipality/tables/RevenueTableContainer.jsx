import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    setLoading(true);
    fetchTableData(newPage, limit);
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    setLimit(newLimit);
    setPage(1);
    setLoading(true);
    fetchTableData(1, newLimit);
  };

  const fetchTableData = (currentPage = page, currentLimit = limit) => {
    // Para 'desagregado', enviar 'municipio' para API mas consolidar visualmente
    const apiGroupType = groupType === 'desagregado' ? 'municipio' : groupType;

    fetchData(selectedTable, apiGroupType, {
      codigoMunicipio: selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: currentPage,
      limit: currentLimit,
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
        if (response.pagination) {
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
    
    setFilters(newFilters);
    setLoading(true);
    setPage(1);
    setHasInitialLoad(true);
    
    // Usar os valores dos filtros diretamente em vez de aguardar o estado ser atualizado
    const apiGroupType = groupType === 'desagregado' ? 'municipio' : groupType;
    console.log('Chamando fetchData com:', { selectedTable, apiGroupType, filters: newFilters });
    fetchData(selectedTable, apiGroupType, {
      codigoMunicipio: filterData.codigoMunicipio,
      territorioDeDesenvolvimentoMunicipio: filterData.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filterData.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filterData.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filterData.gerenciaRegionalMunicipio,
      anoInicial: filterData.anoInicial,
      anoFinal: filterData.anoFinal,
      page: 1,
      limit: limit,
    })
      .then((response) => {
        console.log('Resposta completa do servidor:', JSON.stringify(response, null, 2).substring(0, 2000));
        
        // Construir o título com os filtros aplicados
        const nomeMunicipio = newFilters.nomeMunicipio;
        let locationName = nomeMunicipio || 'Piauí';
        let ibgeCode = newFilters.codigoMunicipio ? ` (IBGE: ${newFilters.codigoMunicipio})` : '';
        const yearDisplay = newFilters.anoInicial === newFilters.anoFinal ? newFilters.anoInicial : `${newFilters.anoInicial}-${newFilters.anoFinal}`;
        
        // Obter o nome da tabela selecionada
        const tableLabel = tableOptions.find(t => t.value === selectedTable)?.label || selectedTable;
        
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
        setPage(response.pagination?.page || 1);
        setLimit(response.pagination?.limit || limit);
        setTotalPages(response.pagination?.totalPages || 1);
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
      // Atualizar o tipo de tabela se foi passado no evento
      if (event.detail.tableType) {
        setSelectedTable(event.detail.tableType);
      }
      handleFilterChange(event.detail);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, [handleFilterChange]);

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
    const apiGroupType = groupType === 'desagregado' ? 'municipio' : groupType;
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
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados para exportação:', error);
      setLoading(false);
      return;
    }

    if (groupType === "municipio") {
      const selectedMunicipioName = "Todos_Municipios";

      Object.keys(allApiData).forEach((municipio) => {
        // Usar transformByMunicipio que espera a estrutura { revenues0708: [...], revenues09: [...] }
        const { rows, typeToRowToValue } = transformByMunicipio(
          allApiData[municipio],
          standardize
        );
        const types = Object.keys(map);
        const nomeMunicipioLabel = municipios[municipio]?.nomeMunicipio || municipio;
        const titulo = `${name} - ${nomeMunicipioLabel}`;

        const wsData = [
          [titulo], // Título
          [], // Linha vazia
          ["Ano", ...types],
          ...rows.map((row) => [
            row,
            ...types.map((type) =>
              typeToRowToValue[type] &&
              typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]),
          [], // Linha vazia
          [fonte], // Fonte
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Mesclar célula do título
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: types.length } }
        ];
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receitas");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const nomeArquivoIndividual = gerarNomeArquivo(name, nomeMunicipioLabel);
        zip.file(
          `${nomeArquivoIndividual}.xlsx`,
          excelBuffer
        );
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        const nomeArquivoZip = gerarNomeArquivo(name, 'Todos_Municipios');
        saveAs(
          content,
          `${nomeArquivoZip}.zip`
        );
      });
    } else if (groupType === "ano") {
      const selectedYearName = "Todos_Anos";

      Object.keys(allApiData).forEach((year) => {
        // Usar transformByAno que retorna municípios como rows
        const { rows, typeToRowToValue } = transformByAno(
          allApiData[year],
          standardize
        );
        const types = Object.keys(map);
        const titulo = `${name} - ${year}`;

        const wsData = [
          [titulo], // Título
          [], // Linha vazia
          ["Município (IBGE)", ...types],
          ...rows.map((row) => [
            `${municipios[row]?.nomeMunicipio || row} (${row})`,
            ...types.map((type) =>
              typeToRowToValue[type] &&
              typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]),
          [], // Linha vazia
          [fonte], // Fonte
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Mesclar célula do título
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: types.length } }
        ];
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receitas");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const nomeArquivoIndividual = gerarNomeArquivo(name, year);
        zip.file(`${nomeArquivoIndividual}.xlsx`, excelBuffer);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        const nomeArquivoZip = gerarNomeArquivo(name, 'Todos_Anos');
        saveAs(content, `${nomeArquivoZip}.zip`);
      });
    } else if (groupType === "desagregado") {
      // Para dados desagregados, criar um único arquivo com todos os dados
      const { rows, typeToRowToValue } = transformByAno(
        allApiData,
        standardize
      );
      const types = Object.keys(map);
      const titulo = `${name} - Desagregado`;

      const wsData = [
        [titulo], // Título
        [], // Linha vazia
        ["Município (IBGE)", ...types],
        ...rows.map((row) => [
          `${municipios[row]?.nomeMunicipio || row} (${row})`,
          ...types.map((type) =>
            typeToRowToValue[type] &&
            typeToRowToValue[type][row] !== undefined
              ? typeToRowToValue[type][row]
              : "-"
          ),
        ]),
        [], // Linha vazia
        [fonte], // Fonte
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Mesclar célula do título
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: types.length } }
      ];
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Receitas");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const nomeArquivoDesagregado = gerarNomeArquivo(name, 'Desagregado');
      saveAs(excelBuffer, `${nomeArquivoDesagregado}.xlsx`);
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
    const wb = XLSX.utils.book_new();
    let allData = [];
    
    // Cabeçalho com todas as colunas de tipos
    const types = Object.keys(map);
    
    // Buscar TODOS os dados da API (sem limitação de paginação)
    const apiGroupType = groupType === 'desagregado' ? 'municipio' : groupType;
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
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados para exportação:', error);
      setLoading(false);
      return;
    }
    
    if (groupType === "municipio") {
      // Consolidar todos os municípios em uma única tabela
      allData.push(["Município", "Ano", ...types]);
      
      Object.keys(allApiData).forEach((municipio) => {
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
    } else if (groupType === "ano") {
      // Consolidar todos os anos em uma única tabela
      allData.push(["Ano", "Município (IBGE)", ...types]);
      
      Object.keys(allApiData).forEach((year) => {
        // Usar transformByAno que retorna municípios como rows
        const { rows, typeToRowToValue } = transformByAno(
          allApiData[year],
          standardize
        );
        
        rows.forEach((row) => {
          allData.push([
            year,
            `${municipios[row]?.nomeMunicipio || row} (${row})`,
            ...types.map((type) =>
              typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
                ? typeToRowToValue[type][row]
                : "-"
            ),
          ]);
        });
      });
    } else if (groupType === "desagregado") {
      // Para dados desagregados, mesma estrutura
      const { rows, typeToRowToValue } = transformByAno(allApiData, standardize);
      
      allData.push(["Município (IBGE)", ...types]);
      rows.forEach((row) => {
        allData.push([
          `${municipios[row]?.nomeMunicipio || row} (${row})`,
          ...types.map((type) =>
            typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined
              ? typeToRowToValue[type][row]
              : "-"
          ),
        ]);
      });
    }

    // Criar o Excel com título e fonte
    const titulo = `${name} - Consolidado`;
    const wsData = [
      [titulo],
      [],
      ...allData,
      [],
      [fonte],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Mesclar célula do título
    const numCols = allData[0]?.length || 1;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Dados_Consolidados");
    const nomeArquivoConsolidado = gerarNomeArquivo(name, 'Consolidado');
    XLSX.writeFile(wb, `${nomeArquivoConsolidado}.xlsx`);
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
              {tableTitle && (
                <Box sx={{ padding: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ marginBottom: 2, textAlign: 'center' }}
                  >
                    {tableTitle}
                  </Typography>
                </Box>
              )}
              <div className="table-container">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleDownloadMenuOpen}
                    endIcon={<ArrowDropDown />}
                    sx={{ marginTop: 2 }}
                  >
                    Baixar Todas as Tabelas
                  </Button>
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
              {groupType === "desagregado" ? (
                // Renderização para dados desagregados
                <>
                  {selectedTable === "allTables"
                    ? Object.keys(apiData).map((revenueType) =>
                        Object.keys(apiData[revenueType]).map((key) => (
                          <div key={key}>
                            {selectedTable === "allTables" && (
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={apiData[revenueType][key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable={key}
                                groupType={groupType}
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
                          data={apiData}
                          transformDataFunction={transformDataForTableByYear}
                          standardizeTypeFunction={standardizedTypeOwnRevenues}
                          tableMapping={mapOwnRevenues}
                          tableName="Impostos Próprios"
                          keyTable="desagregado"
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={filters.nomeMunicipio}
                        />
                      )}
                  {selectedTable === "constitutionalTransfersRevenue" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                      tableMapping={mapConstitutionalTransfersRevenue}
                      tableName="Receita de transferências constitucionais e legais"
                      keyTable="desagregado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "municipalTaxesRevenues" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                      tableMapping={mapMunicipalTaxesRevenues}
                      tableName="Receita Líquida de Impostos do Município"
                      keyTable="desagregado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "additionalEducationRevenue" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                      tableMapping={mapAdditionalMunicipalEducationRevenue}
                      tableName="Receitas adicionais da educação no Município"
                      keyTable="desagregado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "municipalFundebFundefComposition" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                      tableMapping={mapMunicipalFundebFundefComposition}
                      tableName="Composição do Fundef/Fundeb no município"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "complementationFundebFundef" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                      tableMapping={mapComplementationFundebFundef}
                      tableName="Composição da complementação do Fundef/Fundeb"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "constitutionalLimitMde" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                      tableMapping={mapConstitutionalLimitMde}
                      tableName="Limite constitucional em MDE no município"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "expensesBasicEducationFundeb" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                      tableMapping={mapExpensesBasicEducationFundeb}
                      tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "areasActivityExpense" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                      tableMapping={mapAreasActivityExpense}
                      tableName="Despesas em MDE por área de atuação"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "basicEducationMinimalPotential" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                      tableMapping={mapBasicEducationMinimalPotential}
                      tableName="Receita Potencial Mínima vinculada à Educação Básica"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                  {selectedTable === "complementaryProtocol" && (
                    <RevenueTable
                      filtrosAplicados={filters}
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                      tableMapping={mapComplementaryProtocol}
                      tableName="Protocolo Complementar"
                      keyTable="desagregado"
                      groupType={groupType}
                    anoInicial={filters.anoInicial}
                    anoFinal={filters.anoFinal}
                    nomeMunicipio={filters.nomeMunicipio}
                    />
                  )}
                </>
              ) : groupType === "municipio" ? (
                // Renderização para dados agrupados por MUNICÍPIO (UMA TABELA POR MUNICÍPIO)
                <>
                  {getMunicipiosFromData(apiData).map((codigoMunicipio) => (
                    <div key={codigoMunicipio} style={{ marginBottom: '2rem' }}>
                      <Box sx={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', borderRadius: 0.5, marginBottom: 0.5, borderLeft: '3px solid #666' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#424242' }}>
                          {getNomeMunicipio(codigoMunicipio)} <span style={{ color: '#757575', fontWeight: 400 }}>|</span> <span style={{ color: '#616161', fontWeight: 400, fontSize: '0.9em' }}>IBGE {codigoMunicipio}</span>
                        </Typography>
                      </Box>
                      {selectedTable === "ownRevenues" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeOwnRevenues}
                          tableMapping={mapOwnRevenues}
                          tableName="Impostos Próprios"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "constitutionalTransfersRevenue" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                          tableMapping={mapConstitutionalTransfersRevenue}
                          tableName="Receita de transferências constitucionais e legais"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "municipalTaxesRevenues" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                          tableMapping={mapMunicipalTaxesRevenues}
                          tableName="Receita Líquida de Impostos do Município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "additionalEducationRevenue" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                          tableMapping={mapAdditionalMunicipalEducationRevenue}
                          tableName="Receitas adicionais da educação no Município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "municipalFundebFundefComposition" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                          tableMapping={mapMunicipalFundebFundefComposition}
                          tableName="Composição do Fundef/Fundeb no município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "complementationFundebFundef" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                          tableMapping={mapComplementationFundebFundef}
                          tableName="Composição da complementação do Fundef/Fundeb"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "constitutionalLimitMde" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                          tableMapping={mapConstitutionalLimitMde}
                          tableName="Limite constitucional em MDE no município"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "expensesBasicEducationFundeb" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                          tableMapping={mapExpensesBasicEducationFundeb}
                          tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "areasActivityExpense" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                          tableMapping={mapAreasActivityExpense}
                          tableName="Despesas em MDE por área de atuação"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "basicEducationMinimalPotential" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                          tableMapping={mapBasicEducationMinimalPotential}
                          tableName="Receita Potencial Mínima vinculada à Educação Básica"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "complementaryProtocol" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                          tableMapping={mapComplementaryProtocol}
                          tableName="Protocolo Complementar"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
                        anoInicial={filters.anoInicial}
                        anoFinal={filters.anoFinal}
                        nomeMunicipio={getNomeMunicipio(codigoMunicipio)}
                        />
                      )}
                      {selectedTable === "allTables" && (
                        <RevenueTable
                          filtrosAplicados={filters}
                          data={prepareDataForMunicipio(apiData, codigoMunicipio)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeAllTables}
                          tableName="Tabelão"
                          keyTable={`municipio_${codigoMunicipio}`}
                          groupType={groupType}
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
                    ? Object.keys(apiData).map((revenueType) =>
                        Object.keys(apiData[revenueType]).map((key) => (
                          <div key={key}>
                            {selectedTable === "allTables" && (
                              <RevenueTable
                                filtrosAplicados={filters}
                                data={apiData[revenueType][key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable={key}
                                groupType={groupType}
                              anoInicial={filters.anoInicial}
                              anoFinal={filters.anoFinal}
                              nomeMunicipio={filters.nomeMunicipio}
                              />
                            )}
                          </div>
                        ))
                      )
                    : Object.keys(apiData).map((key) => (
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeOwnRevenues}
                                tableMapping={mapOwnRevenues}
                                tableName="Impostos Próprios"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                                tableMapping={mapConstitutionalTransfersRevenue}
                                tableName="Receita de transferências constitucionais e legais"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                                tableMapping={mapMunicipalTaxesRevenues}
                                tableName="Receita Líquida de Impostos do Município"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                                tableMapping={mapAdditionalMunicipalEducationRevenue}
                                tableName="Receitas adicionais da educação no Município"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                                tableMapping={mapMunicipalFundebFundefComposition}
                                tableName="Composição do Fundef/Fundeb no município"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                                tableMapping={mapComplementationFundebFundef}
                                tableName="Composição da complementação do Fundef/Fundeb"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                                tableMapping={mapConstitutionalLimitMde}
                                tableName="Limite constitucional em MDE no município"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                                tableMapping={mapExpensesBasicEducationFundeb}
                                tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                                tableMapping={mapAreasActivityExpense}
                                tableName="Despesas em MDE por área de atuação"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                                tableMapping={mapBasicEducationMinimalPotential}
                                tableName="Receita Potencial Mínima vinculada à Educação Básica"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                                tableMapping={mapComplementaryProtocol}
                                tableName="Protocolo Complementar"
                                keyTable={key}
                                groupType={groupType}
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevenueTableContainer;

