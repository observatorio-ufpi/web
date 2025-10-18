import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import * as JSZip from "jszip";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useTheme } from '@mui/material/styles';
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
  { value: 'ownRevenues', label: 'Impostos Próprios' },
  { value: 'constitutionalTransfersRevenue', label: 'Receita de transferências constitucionais e legais' },
  { value: 'municipalTaxesRevenues', label: 'Receita Líquida de Impostos do Município' },
  { value: 'additionalEducationRevenue', label: 'Receitas adicionais da educação no Município' },
  { value: 'municipalFundebFundefComposition', label: 'Composição do Fundef/Fundeb no município' },
  { value: 'complementationFundebFundef', label: 'Composição da complementação do Fundef/Fundeb' },
  { value: 'constitutionalLimitMde', label: 'Limite constitucional em MDE no município' },
  { value: 'expensesBasicEducationFundeb', label: 'Despesas de profissionais da educação básica do Fundef/Fundeb' },
  { value: 'areasActivityExpense', label: 'Despesas em MDE por área de atuação' },
  { value: 'basicEducationMinimalPotential', label: 'Receita potencial mínima da educação básica' },
  { value: 'complementaryProtocol', label: 'Protocolo Complementar' },
];

const groupTypeOptions = [
  { value: 'municipio', label: 'Município' },
  { value: 'ano', label: 'Ano' },
];

function RevenueTableContainer() {
  const theme = useTheme();
  
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState("ownRevenues");
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [territorioDeDesenvolvimentoMunicipio, setTerritorioDeDesenvolvimentoMunicipio] = useState(null);
  const [faixaPopulacionalMunicipio, setFaixaPopulacionalMunicipio] = useState(null);
  const [aglomeradoMunicipio, setAglomeradoMunicipio] = useState("");
  const [gerenciaRegionalMunicipio, setGerenciaRegionalMunicipio] = useState("");
  const [groupType, setGroupType] = useState("municipio");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    nomeMunicipio: '',
    territorioDeDesenvolvimentoMunicipio: '',
    faixaPopulacionalMunicipio: '',
    aglomeradoMunicipio: '',
    gerenciaRegionalMunicipio: '',
    anoInicial: 2007,
    anoFinal: 2024,
  });
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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
    fetchData(selectedTable, groupType, {
      codigoMunicipio: selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: currentPage,
      limit: currentLimit,
    })
      .then((response) => {
        setApiData(response.data);
        setLoading(false);
        setPage(response.pagination.page);
        setLimit(response.pagination.limit);
        setTotalPages(response.pagination.totalPages || 1);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
        setTotalPages(1);
      });
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
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
    setPage(1);
    setHasInitialLoad(true);
    
    // Usar os valores dos filtros diretamente em vez de aguardar o estado ser atualizado
    fetchData(selectedTable, groupType, {
      codigoMunicipio: filters.codigoMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      page: 1,
      limit: limit,
    })
      .then((response) => {
        setApiData(response.data);
        setLoading(false);
        setPage(response.pagination.page);
        setLimit(response.pagination.limit);
        setTotalPages(response.pagination.totalPages || 1);
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
    setHasInitialLoad(false); // Reset para mostrar a mensagem de filtro
    // Não carrega dados automaticamente - aguarda o usuário filtrar
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
          ["Municipio", ...types],
          ...rows.map((row) => [
            municipios[row]?.nomeMunicipio,
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
    }
  };

  return (
    <div>
      <div className="app-container">
        <div className="filters-section">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              width: '100%',
              marginBottom: '20px'
            }}
          >
            <Select
              label="Tipo de Tabela:"
              value={tableOptions.find(option => option.value === selectedTable)}
              onChange={(option) => handleTableChange({ target: { value: option.value } })}
              options={tableOptions}
              placeholder="Selecione o tipo de tabela"
              size="xs"
              isClearable
              fullWidth
            />

            <Box sx={{ display: 'flex', alignItems: 'end', gap: 2 }}>
              <Select
                label="Tipo de Agrupamento:"
                value={groupTypeOptions.find(option => option.value === groupType)}
                onChange={(option) => handleGroupTypeChange({ target: { value: option.value } })}
                options={groupTypeOptions}
                placeholder="Selecione o tipo de agrupamento"
                size="xs"
                isClearable
                fullWidth
              />
              
              <Button
                variant="outlined"
                size="small"
                startIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                sx={{
                  minWidth: 'auto',
                  padding: '8px 16px',
                  whiteSpace: 'nowrap',
                  height: 'fit-content',
                  mb: 0.5
                }}
              >
                {filtersExpanded ? 'Menos Filtros' : 'Mais Filtros'}
              </Button>
            </Box>
          </div>

          <FilterComponent
            onFilterChange={handleFilterChange}
            selectedMunicipio={selectedMunicipio}
            territorioDeDesenvolvimentoMunicipio={territorioDeDesenvolvimentoMunicipio}
            faixaPopulacionalMunicipio={faixaPopulacionalMunicipio}
            aglomeradoMunicipio={aglomeradoMunicipio}
            gerenciaRegionalMunicipio={gerenciaRegionalMunicipio}
            anoInicial={filters.anoInicial}
            anoFinal={filters.anoFinal}
            filtersExpanded={filtersExpanded}
          />
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
            Selecione os filtros desejados e clique em "Filtrar" para montar uma consulta.
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
              {selectedTable === "allTables"
                ? Object.keys(apiData).map((revenueType) =>
                    Object.keys(apiData[revenueType]).map((key) => (
                      <div key={key}>
                        {selectedTable === "allTables" && (
                          <RevenueTable
                            data={apiData[revenueType][key]}
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
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
                          <span className="table-header-label">
                            {groupType === "municipio"
                              ? "Município: "
                              : "Ano: "}
                          </span>
                          {groupType === "municipio"
                            ? municipios[key]?.nomeMunicipio
                            : key}
                        </h2>
                      </div>
                      {selectedTable === "ownRevenues" && (
                        <div style={{ marginTop: "1rem" }}>
                          <RevenueTable
                            data={apiData[key]}
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeOwnRevenues
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeConstitutionalTransfersRevenue
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizeTypeMunicipalTaxesRevenues
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizeTypeAdditionalEducationRevenues
                            }
                            tableMapping={
                              mapAdditionalMunicipalEducationRevenue
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeMunicipalFundebFundefComposition
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeComplementationFundebFundef
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeConstitutionalLimitMde
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeExpensesBasicEducationFundeb
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeAreasActivityExpense
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeBasicEducationMinimalPotential
                            }
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
                            transformDataFunction={
                              groupType === "municipio"
                                ? transformDataForTableRevenues
                                : transformDataForTableByYear
                            }
                            standardizeTypeFunction={
                              standardizedTypeComplementaryProtocol
                            }
                            tableMapping={mapComplementaryProtocol}
                            tableName="Protocolo Complementar"
                            keyTable={key}
                            groupType={groupType}
                          />
                        </div>
                      )}
                      {/* Adicione outros mapeamentos de tabelas conforme necessário */}
                    </div>
                  ))}

              <CustomPagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevenueTableContainer;
