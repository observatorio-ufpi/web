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
import { municipios } from "../../../../../../utils/municipios.mapping.jsx";
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
import { Typography, Box } from "@mui/material";
import { ExpandMore, ExpandLess } from '@mui/icons-material';

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
  const [limit, setLimit] = useState(10);
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
          filterInfo.push(filters.territorioDeDesenvolvimentoMunicipio);
        }
        if (filters.faixaPopulacionalMunicipio) {
          filterInfo.push(filters.faixaPopulacionalMunicipio);
        }
        if (filters.aglomeradoMunicipio) {
          filterInfo.push(filters.aglomeradoMunicipio);
        }
        if (filters.gerenciaRegionalMunicipio) {
          filterInfo.push(filters.gerenciaRegionalMunicipio);
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
          filterInfo.push(`Território: ${newFilters.territorioDeDesenvolvimentoMunicipio}`);
        }
        if (newFilters.faixaPopulacionalMunicipio) {
          filterInfo.push(`Faixa: ${newFilters.faixaPopulacionalMunicipio}`);
        }
        if (newFilters.aglomeradoMunicipio) {
          filterInfo.push(`Aglomerado: ${newFilters.aglomeradoMunicipio}`);
        }
        if (newFilters.gerenciaRegionalMunicipio) {
          filterInfo.push(`GRE: ${newFilters.gerenciaRegionalMunicipio}`);
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

  const downloadAllTables = () => {
    const tableMappings = {
      ownRevenues: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeOwnRevenues,
        map: mapOwnRevenues,
        name: "Impostos_Proprios",
      },
      constitutionalTransfersRevenue: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeConstitutionalTransfersRevenue,
        map: mapConstitutionalTransfersRevenue,
        name: "Receita_Transferencias_Constitucionais_Legais",
      },
      municipalTaxesRevenues: {
        transform: transformDataForTableByYear,
        standardize: standardizeTypeMunicipalTaxesRevenues,
        map: mapMunicipalTaxesRevenues,
        name: "Receita_Liquida_Impostos_Municipio",
      },
      additionalEducationRevenue: {
        transform: transformDataForTableByYear,
        standardize: standardizeTypeAdditionalEducationRevenues,
        map: mapAdditionalMunicipalEducationRevenue,
        name: "Receitas_Adicionais_Educacao_Municipio",
      },
      municipalFundebFundefComposition: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeMunicipalFundebFundefComposition,
        map: mapMunicipalFundebFundefComposition,
        name: "Composicao_Fundef_Fundeb_Municipio",
      },
      complementationFundebFundef: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeComplementationFundebFundef,
        map: mapComplementationFundebFundef,
        name: "Composicao_Complementacao_Fundef_Fundeb",
      },
      areasActivityExpense: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeAreasActivityExpense,
        map: mapAreasActivityExpense,
        name: "Despesas_MDE_Area_Atuacao",
      },
      basicEducationMinimalPotential: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeBasicEducationMinimalPotential,
        map: mapBasicEducationMinimalPotential,
        name: "Receita_Potencial_Minima_Educacao_Basica",
      },
      constitutionalLimitMde: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeConstitutionalLimitMde,
        map: mapConstitutionalLimitMde,
        name: "Limite_Constitucional_MDE_Municipio",
      },
      expensesBasicEducationFundeb: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeExpensesBasicEducationFundeb,
        map: mapExpensesBasicEducationFundeb,
        name: "Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb",
      },
      complementaryProtocol: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeComplementaryProtocol,
        map: mapComplementaryProtocol,
        name: "Protocolo_Complementar",
      },
      allTables: {
        transform: transformDataForTableByYear,
        standardize: standardizedTypeAllTables,
        map: mapAllTables,
        name: "Tabelao_RREO",
      },
    };

    const { transform, standardize, map, name } = tableMappings[selectedTable];
    const zip = new JSZip();

    if (groupType === "municipio") {
      const selectedMunicipioName = "Todos_Municipios";
      const selectedMunicipioData = apiData;

      Object.keys(selectedMunicipioData).forEach((municipio) => {
        const { rows, typeToRowToValue } = transform(
          selectedMunicipioData[municipio],
          standardize
        );
        const types = Object.keys(map);

        console.log(rows);

        const wsData = [
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
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receitas");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        zip.file(
          `${name}_${municipios[municipio]?.nomeMunicipio}.xlsx`,
          excelBuffer
        );
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(
          content,
          `${name}_${selectedMunicipioName}_tabelas_municipios.zip`
        );
      });
    } else if (groupType === "ano") {
      const selectedYearName = "Todos_Anos";
      const selectedYearData = apiData;

      Object.keys(selectedYearData).forEach((year) => {
        const { rows, typeToRowToValue } = transform(
          selectedYearData[year],
          standardize
        );
        const types = Object.keys(map);

        console.log(rows);

        const wsData = [
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
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receitas");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        zip.file(`${name}_${year}.xlsx`, excelBuffer);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${name}_${selectedYearName}_tabelas_municipios.zip`);
      });
    } else if (groupType === "desagregado") {
      // Para dados desagregados, criar um único arquivo com todos os dados
      const { rows, typeToRowToValue } = transform(
        apiData,
        standardize
      );
      const types = Object.keys(map);

      const wsData = [
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
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Receitas");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(excelBuffer, `${name}_desagregado.xlsx`);
    }
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
                    onClick={downloadAllTables}
                    sx={{ marginTop: 2 }}
                  >
                    Baixar Todas as Tabelas
                  </Button>
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
                                data={apiData[revenueType][key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable={key}
                                groupType={groupType}
                              />
                            )}
                          </div>
                        ))
                      )
                    : selectedTable === "ownRevenues" && (
                        <RevenueTable
                          data={apiData}
                          transformDataFunction={transformDataForTableByYear}
                          standardizeTypeFunction={standardizedTypeOwnRevenues}
                          tableMapping={mapOwnRevenues}
                          tableName="Impostos Próprios"
                          keyTable="desagregado"
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        />
                      )}
                  {selectedTable === "constitutionalTransfersRevenue" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                      tableMapping={mapConstitutionalTransfersRevenue}
                      tableName="Receita de transferências constitucionais e legais"
                      keyTable="desagregado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    />
                  )}
                  {selectedTable === "municipalTaxesRevenues" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                      tableMapping={mapMunicipalTaxesRevenues}
                      tableName="Receita Líquida de Impostos do Município"
                      keyTable="desagregado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    />
                  )}
                  {selectedTable === "additionalEducationRevenue" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                      tableMapping={mapAdditionalMunicipalEducationRevenue}
                      tableName="Receitas adicionais da educação no Município"
                      keyTable="desagregado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    />
                  )}
                  {selectedTable === "municipalFundebFundefComposition" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                      tableMapping={mapMunicipalFundebFundefComposition}
                      tableName="Composição do Fundef/Fundeb no município"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "complementationFundebFundef" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                      tableMapping={mapComplementationFundebFundef}
                      tableName="Composição da complementação do Fundef/Fundeb"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "constitutionalLimitMde" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                      tableMapping={mapConstitutionalLimitMde}
                      tableName="Limite constitucional em MDE no município"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "expensesBasicEducationFundeb" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                      tableMapping={mapExpensesBasicEducationFundeb}
                      tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "areasActivityExpense" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                      tableMapping={mapAreasActivityExpense}
                      tableName="Despesas em MDE por área de atuação"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "basicEducationMinimalPotential" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                      tableMapping={mapBasicEducationMinimalPotential}
                      tableName="Receita Potencial Mínima vinculada à Educação Básica"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "complementaryProtocol" && (
                    <RevenueTable
                      data={apiData}
                      transformDataFunction={transformDataForTableByYear}
                      standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                      tableMapping={mapComplementaryProtocol}
                      tableName="Protocolo Complementar"
                      keyTable="desagregado"
                      groupType={groupType}
                    />
                  )}
                </>
              ) : groupType === "municipio" ? (
                // Renderização para dados agrupados por MUNICÍPIO (UMA ÚNICA TABELA com todos os municípios, consolidado por ano)
                <>
                  {selectedTable === "allTables"
                    ? Object.keys(consolidateDataByMunicipio(apiData)).map((year) =>
                        Object.keys(consolidateDataByMunicipio(apiData)[year] || {}).map((revenueType) => (
                          <div key={`${year}-${revenueType}`}>
                            {selectedTable === "allTables" && (
                              <RevenueTable
                                data={consolidateDataByMunicipio(apiData)}
                                transformDataFunction={transformDataForTableRevenues}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable="municipios_consolidado"
                                groupType={groupType}
                              />
                            )}
                          </div>
                        ))
                      )
                    : selectedTable === "ownRevenues" && (
                        <RevenueTable
                          data={consolidateDataByMunicipio(apiData)}
                          transformDataFunction={transformDataForTableRevenues}
                          standardizeTypeFunction={standardizedTypeOwnRevenues}
                          tableMapping={mapOwnRevenues}
                          tableName="Impostos Próprios"
                          keyTable="municipios_consolidado"
                          groupType={groupType}
                          enableMonetaryCorrection={true}
                        />
                      )}
                  {selectedTable === "constitutionalTransfersRevenue" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                      tableMapping={mapConstitutionalTransfersRevenue}
                      tableName="Receita de transferências constitucionais e legais"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    />
                  )}
                  {selectedTable === "municipalTaxesRevenues" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                      tableMapping={mapMunicipalTaxesRevenues}
                      tableName="Receita Líquida de Impostos do Município"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    />
                  )}
                  {selectedTable === "additionalEducationRevenue" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                      tableMapping={mapAdditionalMunicipalEducationRevenue}
                      tableName="Receitas adicionais da educação no Município"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                      enableMonetaryCorrection={true}
                    />
                  )}
                  {selectedTable === "municipalFundebFundefComposition" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                      tableMapping={mapMunicipalFundebFundefComposition}
                      tableName="Composição do Fundef/Fundeb no município"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "complementationFundebFundef" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                      tableMapping={mapComplementationFundebFundef}
                      tableName="Composição da complementação do Fundef/Fundeb"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "constitutionalLimitMde" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                      tableMapping={mapConstitutionalLimitMde}
                      tableName="Limite constitucional em MDE no município"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "expensesBasicEducationFundeb" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                      tableMapping={mapExpensesBasicEducationFundeb}
                      tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "areasActivityExpense" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                      tableMapping={mapAreasActivityExpense}
                      tableName="Despesas em MDE por área de atuação"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "basicEducationMinimalPotential" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                      tableMapping={mapBasicEducationMinimalPotential}
                      tableName="Receita Potencial Mínima vinculada à Educação Básica"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
                  {selectedTable === "complementaryProtocol" && (
                    <RevenueTable
                      data={consolidateDataByMunicipio(apiData)}
                      transformDataFunction={transformDataForTableRevenues}
                      standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                      tableMapping={mapComplementaryProtocol}
                      tableName="Protocolo Complementar"
                      keyTable="municipios_consolidado"
                      groupType={groupType}
                    />
                  )}
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
                                data={apiData[revenueType][key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAllTables}
                                tableName="Tabelão"
                                keyTable={key}
                                groupType={groupType}
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
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeOwnRevenues}
                                tableMapping={mapOwnRevenues}
                                tableName="Impostos Próprios"
                                keyTable={key}
                                groupType={groupType}
                                enableMonetaryCorrection={true}
                              />
                            </div>
                          )}
                          {selectedTable === "constitutionalTransfersRevenue" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                                tableMapping={mapConstitutionalTransfersRevenue}
                                tableName="Receita de transferências constitucionais e legais"
                                keyTable={key}
                                groupType={groupType}
                                enableMonetaryCorrection={true}
                              />
                            </div>
                          )}
                          {selectedTable === "municipalTaxesRevenues" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                                tableMapping={mapMunicipalTaxesRevenues}
                                tableName="Receita Líquida de Impostos do Município"
                                keyTable={key}
                                groupType={groupType}
                                enableMonetaryCorrection={true}
                              />
                            </div>
                          )}
                          {selectedTable === "additionalEducationRevenue" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                                tableMapping={mapAdditionalMunicipalEducationRevenue}
                                tableName="Receitas adicionais da educação no Município"
                                keyTable={key}
                                groupType={groupType}
                                enableMonetaryCorrection={true}
                              />
                            </div>
                          )}
                          {selectedTable === "municipalFundebFundefComposition" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                                tableMapping={mapMunicipalFundebFundefComposition}
                                tableName="Composição do Fundef/Fundeb no município"
                                keyTable={key}
                                groupType={groupType}
                              />
                            </div>
                          )}
                          {selectedTable === "complementationFundebFundef" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                                tableMapping={mapComplementationFundebFundef}
                                tableName="Composição da complementação do Fundef/Fundeb"
                                keyTable={key}
                                groupType={groupType}
                              />
                            </div>
                          )}
                          {selectedTable === "constitutionalLimitMde" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                                tableMapping={mapConstitutionalLimitMde}
                                tableName="Limite constitucional em MDE no município"
                                keyTable={key}
                                groupType={groupType}
                              />
                            </div>
                          )}
                          {selectedTable === "expensesBasicEducationFundeb" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                                tableMapping={mapExpensesBasicEducationFundeb}
                                tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb"
                                keyTable={key}
                                groupType={groupType}
                              />
                            </div>
                          )}
                          {selectedTable === "areasActivityExpense" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                                tableMapping={mapAreasActivityExpense}
                                tableName="Despesas em MDE por área de atuação"
                                keyTable={key}
                                groupType={groupType}
                              />
                            </div>
                          )}
                          {selectedTable === "basicEducationMinimalPotential" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                                tableMapping={mapBasicEducationMinimalPotential}
                                tableName="Receita Potencial Mínima vinculada à Educação Básica"
                                keyTable={key}
                                groupType={groupType}
                              />
                            </div>
                          )}
                          {selectedTable === "complementaryProtocol" && (
                            <div style={{ marginTop: "1rem" }}>
                              <RevenueTable
                                data={apiData[key]}
                                transformDataFunction={transformDataForTableByYear}
                                standardizeTypeFunction={standardizedTypeComplementaryProtocol}
                                tableMapping={mapComplementaryProtocol}
                                tableName="Protocolo Complementar"
                                keyTable={key}
                                groupType={groupType}
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
