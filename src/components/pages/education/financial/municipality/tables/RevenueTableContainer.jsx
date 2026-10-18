import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import "../../../../../../App.css";
import { fetchData } from "../../../../../../services/apiService.jsx";
import "../../../../../../style/RevenueTableContainer.css";
import {
  transformDataForTableByYear,
  transformDataForTableRevenues,
} from "../../../../../../utils/dataTransformingUtils.jsx";
import { tableOptions, groupTypeOptions, TABLE_MAPPINGS } from "./tableConfig.js";
import { municipios, Regioes, FaixaPopulacional } from "../../../../../../utils/municipios.mapping.jsx";
import CustomPagination from "../../../../../helpers/CustomPagination.jsx";
import FilterComponent from "../../../../../helpers/TableFilters.jsx";
import RevenueTable, { SEM_DADO_TOOLTIP } from "./RevenueTable.jsx";
import DataSourceNote from "../../../../../common/DataSourceNote.jsx";
import EmptyState from "../../../../../common/EmptyState.jsx";
import PageHeader from "../../../../../common/PageHeader.jsx";
import { useTituloDinamico } from "../../../../../common/TituloDaPagina.jsx";
import Select from "../../../../../ui/Select";
import { Loading } from "../../../../../ui";
import { Typography, Box, Menu, MenuItem, ListItemText } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { cores } from "../../../../../../theme/tokens";
import { ExpandMore, ExpandLess, ArrowDropDown } from '@mui/icons-material';
import { buildStyledWorkbook } from "../../../../../../utils/excelExportUtils.js";
import TechnicalSheetButton from "../../../../../common/TechnicalSheetButton.jsx";
import { lerFiltrosMunicipaisDaUrl, filtrosMunicipaisParaUrl } from "../../../../../../utils/financialUrlFilters.js";
import { FONTE_EXPORTACAO } from '../../../../../../utils/exportStyle';
import { ConteudoFicha } from '../../../../../common/fichasTecnicas';
import ComoCitarButton from "../../../../../common/ComoCitarButton.jsx";
import SkeletonTabela from '../../../../../common/SkeletonTabela';
import { repetirUltimaConsulta } from '../../../../../../utils/repetirConsulta';
import { carregarJSZip } from '../../../../../../utils/bibliotecasExportacao';

// Opções para os selects
function RevenueTableContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState("ownRevenues");
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [groupType, setGroupType] = useState("municipio");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
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
  const [linkCopiado, setLinkCopiado] = useState(false);
  // Todos os municípios no último ano da consulta de 1 município — alimenta a
  // comparação dos cards ("12º maior de 224 · mediana do Piauí")
  const [referenciaEstadual, setReferenciaEstadual] = useState(null);

  useEffect(() => {
    setReferenciaEstadual(null);
    const config = TABLE_MAPPINGS[selectedTable];
    const municipiosNaTela = apiData && typeof apiData === 'object' ? Object.keys(apiData).filter((k) => /^\d{6,7}$/.test(k)) : [];
    if (!config?.resumo || groupType !== 'municipio' || municipiosNaTela.length !== 1) return;
    const codigo = municipiosNaTela[0];
    const anos = Object.values(apiData[codigo] || {})
      .flatMap((registros) => (Array.isArray(registros) ? registros.map((r) => Number(r.ano)) : []))
      .filter(Boolean);
    if (!anos.length) return;
    const ano = Math.max(...anos);
    let cancelado = false;
    fetchData(selectedTable, 'ano', { anoInicial: ano, anoFinal: ano, page: 1, limit: 10000 })
      .then((resp) => {
        const dadosAno = resp?.data?.[ano] || resp?.data?.[String(ano)];
        if (cancelado || !dadosAno) return;
        const { typeToRowToValue } = config.transformByAno(dadosAno, config.standardize);
        setReferenciaEstadual({ ano, codigo, valores: typeToRowToValue });
      })
      .catch(() => {}); // comparação é opcional: sem ela os cards continuam funcionando
    return () => {
      cancelado = true;
    };
  }, [apiData, selectedTable, groupType]);

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

    // Grava a consulta na URL (sem criar entrada no histórico) — F5 mantém e dá pra compartilhar o link
    navigate(
      { search: filtrosMunicipaisParaUrl({ ...newFilters, tableType: tableTypeToUse }).toString() },
      { replace: true }
    );
    setPage(1);
    setHasInitialLoad(true);

    if (shouldAllCitiesSingleYear && groupType !== 'ano') {
      // Ajusta o UI para refletir o modo de 1 ano (todas as cidades).
      setGroupType('ano');
    }
    
    // Usar os valores dos filtros diretamente em vez de aguardar o estado ser atualizado
    const apiGroupType = effectiveGroupType === 'desagregado' ? 'municipio' : effectiveGroupType;
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

    // Abriu por um link com filtros na URL: já mostra a consulta direto
    const filtrosDaUrl = lerFiltrosMunicipaisDaUrl(location.search);
    if (filtrosDaUrl) handleFilterChange(filtrosDaUrl);

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
    const { transformByMunicipio, transformByAno, standardize, map, name } = TABLE_MAPPINGS[selectedTable];
    const JSZip = await carregarJSZip();
    const zip = new JSZip();
    const fonte = FONTE_EXPORTACAO;
    
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

    const { transformByMunicipio, transformByAno, standardize, map, name } = TABLE_MAPPINGS[selectedTable];
    const fonte = FONTE_EXPORTACAO;
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

  // Uma única definição de <RevenueTable> para todos os modos de agrupamento.
  // O que muda por tabela (nome, mapeamento, correção monetária) vem do TABLE_MAPPINGS —
  // antes eram ~33 cópias quase iguais do mesmo JSX, fácil de uma divergir das outras.
  const renderTabela = ({ data, transformDataFunction, keyTable, nomeMunicipio }) => {
    const config = TABLE_MAPPINGS[selectedTable];
    if (!config) return null;
    return (
      <RevenueTable
        key={selectedTable}
        filtrosAplicados={filters}
        data={data}
        transformDataFunction={transformDataFunction}
        standardizeTypeFunction={config.standardize}
        tableMapping={config.map}
        tableName={config.displayName}
        keyTable={keyTable}
        groupType={uiGroupType}
        enableMonetaryCorrection={!!config.monetaryCorrection}
        anoInicial={filters.anoInicial}
        anoFinal={filters.anoFinal}
        nomeMunicipio={nomeMunicipio}
        mostrarRodape={!rodapeUnico}
        referenciaEstadual={uiGroupType === 'municipio' ? referenciaEstadual : null}
        resumo={mostrarResumo ? config.resumo : null}
      />
    );
  };

  // Tabelão: a API devolve { tipoDeReceita: { chave: dados } }, uma tabela por chave
  const renderTabelao = () =>
    Object.keys(displayApiData).map((revenueType) =>
      Object.keys(displayApiData[revenueType]).map((key) => (
        <div key={key}>
          {renderTabela({
            data: displayApiData[revenueType][key],
            transformDataFunction: transformDataForTableByYear,
            keyTable: key,
            nomeMunicipio: filters.nomeMunicipio,
          })}
        </div>
      ))
    );

  // Etiquetas do cabeçalho: o que está sendo mostrado, em pedaços curtos
  const etiquetas = [];
  if (filters.nomeMunicipio) {
    etiquetas.push(
      filters.codigoMunicipio
        ? { texto: filters.nomeMunicipio, link: `/municipio/${filters.codigoMunicipio}`, titulo: `Ver o perfil completo de ${filters.nomeMunicipio}` }
        : filters.nomeMunicipio
    );
  }
  if (filters.codigoMunicipio) etiquetas.push(`IBGE ${filters.codigoMunicipio}`);
  if (filters.territorioDeDesenvolvimentoMunicipio) {
    etiquetas.push(Regioes[filters.territorioDeDesenvolvimentoMunicipio] || filters.territorioDeDesenvolvimentoMunicipio);
  }
  if (filters.faixaPopulacionalMunicipio) {
    etiquetas.push(FaixaPopulacional[filters.faixaPopulacionalMunicipio] || filters.faixaPopulacionalMunicipio);
  }
  if (filters.aglomeradoMunicipio) etiquetas.push(`Aglomerado ${filters.aglomeradoMunicipio}`);
  if (filters.gerenciaRegionalMunicipio) etiquetas.push(`${filters.gerenciaRegionalMunicipio}ª GRE`);
  if (etiquetas.length === 0) etiquetas.push('Todos os municípios');
  etiquetas.push(
    filters.anoInicial === filters.anoFinal ? `${filters.anoInicial}` : `${filters.anoInicial}–${filters.anoFinal}`
  );

  const tituloTabela = tableOptions.find((t) => t.value === selectedTable)?.label || '';
  // Título da aba com a consulta atual (ex.: "Receita de impostos próprios · Nazaré do Piauí | OPEPI")
  useTituloDinamico(
    displayApiData && Object.keys(displayApiData).length > 0
      ? [tituloTabela, filters.nomeMunicipio].filter(Boolean).join(' · ')
      : null
  );
  const variosMunicipios = getMunicipiosFromData(displayApiData).length > 1;
  // "Exportar todas" só faz sentido com mais de uma tabela na tela ou mais de uma página;
  // com uma tabela só, o "Exportar" dela já resolve (evita dois botões iguais lado a lado)
  const quantidadeTabelas =
    uiGroupType === 'municipio'
      ? getMunicipiosFromData(displayApiData).length
      : uiGroupType === 'ano'
        ? Object.keys(displayApiData || {}).length
        : 1;
  const mostrarExportarTodas = quantidadeTabelas > 1 || totalPages > 1;
  const rodapeUnico = quantidadeTabelas > 1;
  // Cards de resumo: com um município (tabela por ano) ou na visão por ano (todos os
  // municípios). Com vários municípios em sequência ficaria repetitivo demais.
  const mostrarResumo = uiGroupType === 'ano' || (uiGroupType === 'municipio' && quantidadeTabelas === 1);

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2500);
    } catch (e) {
      console.error('Não foi possível copiar o link:', e);
    }
  };


  return (
    <div>
      <div className="app-container">
        {/* Área de dados - sempre visível */}
        <div className="data-section">
          {loading && <SkeletonTabela />}

          {!loading && error && (
            <EmptyState erro titulo="Não foi possível carregar os dados" texto="Pode ser uma instabilidade na conexão ou no servidor." onTentarDeNovo={repetirUltimaConsulta} />
          )}

          {!loading && !error && !apiData && !hasInitialLoad && (
            <EmptyState titulo="Monte sua consulta" texto={'Escolha o tipo de dado, o município e o período na lateral e clique em "Mostrar".'} />
          )}

          {!loading && !error && (!displayApiData || Object.keys(displayApiData).length === 0) && hasInitialLoad && (
            <EmptyState titulo="Nenhum dado encontrado" texto="Tente outro período ou outro município." />
          )}

          {!loading && !error && displayApiData && Object.keys(displayApiData).length > 0 && (
            <>
              {/* Cabeçalho: título curto + etiquetas, ações à direita (components/common/PageHeader) */}
              <PageHeader
                caminho="Dados financeiros  ›  Municípios"
                titulo={tituloTabela}
                etiquetas={etiquetas}
                acoes={
                  <>
                  <Button
                    variant="text"
                    onClick={copiarLink}
                    startIcon={linkCopiado ? <CheckIcon /> : <LinkIcon />}
                    aria-live="polite"
                  >
                    {linkCopiado ? 'Link copiado' : 'Copiar link'}
                  </Button>
                  {filters.codigoMunicipio && (
                    <Button
                      variant="text"
                      startIcon={<LocationCityIcon />}
                      onClick={() => navigate(`/municipio/${filters.codigoMunicipio}`)}
                      title={`Todos os números de ${filters.nomeMunicipio} numa página só`}
                    >
                      Perfil do município
                    </Button>
                  )}
                  {filters.codigoMunicipio && TABLE_MAPPINGS[selectedTable]?.resumo && (
                    <Button
                      variant="text"
                      startIcon={<CompareArrowsIcon />}
                      onClick={() =>
                        navigate(`/comparar?tabela=${selectedTable}&ano=${filters.anoFinal}&municipios=${filters.codigoMunicipio}`)
                      }
                    >
                      Comparar
                    </Button>
                  )}
                  <ComoCitarButton
                    titulo={`${tituloTabela} — ${filters.nomeMunicipio || 'municípios do Piauí'}, ${filters.anoInicial === filters.anoFinal ? filters.anoInicial : `${filters.anoInicial}–${filters.anoFinal}`}`}
                  />
                  <TechnicalSheetButton className="" dialogTitle={`Ficha técnica — ${tituloTabela}`}>
              <ConteudoFicha chave={selectedTable} />
            </TechnicalSheetButton>
                  {mostrarExportarTodas && (
                  <Button
                    variant="outlined"
                    onClick={handleDownloadMenuOpen}
                    startIcon={<FileDownloadOutlinedIcon />}
                    endIcon={<ArrowDropDown />}
                    aria-haspopup="menu"
                    sx={{
                      color: cores.tinta,
                      borderColor: cores.linhaForte,
                      backgroundColor: cores.superficie,
                      '&:hover': { borderColor: cores.marca, backgroundColor: cores.areia },
                    }}
                  >
                    Exportar todas
                  </Button>
                  )}
                  <Menu
                    anchorEl={downloadMenuAnchor}
                    open={Boolean(downloadMenuAnchor)}
                    onClose={handleDownloadMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleDownloadSeparate}>
                      <ListItemText
                        primary="Uma planilha por tabela (ZIP)"
                        secondary="todas as páginas, um arquivo para cada município ou ano"
                      />
                    </MenuItem>
                    <MenuItem onClick={downloadAllTablesConsolidated}>
                      <ListItemText
                        primary="Tudo em uma planilha (Excel)"
                        secondary="todas as páginas juntas, uma linha por registro"
                      />
                    </MenuItem>
                  </Menu>
                  </>
                }
              />

              <div className="table-container">
              {uiGroupType === "desagregado" ? (
                // Renderização para dados desagregados
                selectedTable === "allTables"
                  ? renderTabelao()
                  : renderTabela({
                      data: displayApiData,
                      transformDataFunction: transformDataForTableByYear,
                      keyTable: "desagregado",
                      nomeMunicipio: filters.nomeMunicipio,
                    })
              ) : uiGroupType === "municipio" ? (
                // Renderização para dados agrupados por MUNICÍPIO (UMA TABELA POR MUNICÍPIO)
                getMunicipiosFromData(displayApiData).map((codigoMunicipio) => (
                  <div key={codigoMunicipio} style={{ marginBottom: '2rem' }}>
                    {variosMunicipios && (
                      <Typography component="h2" sx={{ fontSize: '20px', fontWeight: 600, color: cores.tinta, marginBottom: '12px' }}>
                        {getNomeMunicipio(codigoMunicipio)}{' '}
                        <span style={{ fontSize: '14px', fontWeight: 400, color: cores.textoSuave }}>IBGE {codigoMunicipio}</span>{' '}
                        <Link
                          to={`/municipio/${codigoMunicipio}`}
                          style={{ fontSize: '14px', fontWeight: 600, color: cores.marca, textDecoration: 'none', marginLeft: '8px' }}
                        >
                          Ver perfil →
                        </Link>
                      </Typography>
                    )}
                    {renderTabela({
                      data: prepareDataForMunicipio(displayApiData, codigoMunicipio),
                      transformDataFunction: transformDataForTableRevenues,
                      keyTable: `municipio_${codigoMunicipio}`,
                      nomeMunicipio: getNomeMunicipio(codigoMunicipio),
                    })}
                  </div>
                ))
              ) : selectedTable === "allTables" ? (
                // Renderização para dados agrupados por ANO (múltiplas tabelas, uma por ano)
                renderTabelao()
              ) : (
                Object.keys(displayApiData).map((key) => (
                  <div key={key} style={{ marginBottom: '2rem' }}>
                    <Typography component="h2" sx={{ fontSize: '20px', fontWeight: 600, color: cores.tinta, marginBottom: '12px' }}>
                      {key}
                    </Typography>
                    <div>
                      {renderTabela({
                        data: displayApiData[key],
                        transformDataFunction: transformDataForTableByYear,
                        keyTable: key,
                        nomeMunicipio: filters.nomeMunicipio,
                      })}
                    </div>
                  </div>
                ))
              )}

              {rodapeUnico && (
                <Box sx={{ marginTop: '8px' }}>
                  <Typography sx={{ fontSize: '13px', lineHeight: 1.45, color: cores.textoSuave }}>
                    <strong>“–”</strong> nas tabelas significa: {SEM_DADO_TOOLTIP}
                  </Typography>
                  <DataSourceNote nivel="municipal" />
                </Box>
              )}

              {!shouldShowAllCitiesSingleYear && (totalPages > 1 || limit < 50) && (
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

