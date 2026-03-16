import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../../../style/RevenueTableContainer.css";
import "../../../../style/TableFilters.css";
import {
  FaixaPopulacional,
  municipios,
  Regioes,
} from "../../../../utils/citiesMapping";
import { Loading } from "../../../ui";
import ApiContainer from "./ApiComponent.jsx";
import ApiDataTable from "./apiDataTable.jsx";
import { useEducationFilters } from "../../../../contexts/EducationFilterContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ArrowDropDown } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import JSZip from "jszip";

function ParentComponent() {
  const apiRef = useRef();
  const filters = useEducationFilters();

  const validBasicEducationTypes = [
    "enrollment",
    "school/count",
    "class",
    "teacher",
    "auxiliar",
    "employees",
  ];

  const yearLimits = useMemo(
    () => ({
      enrollment: { min: 2007, max: 2024 },
      "school/count": { min: 2007, max: 2024 },
      class: { min: 2007, max: 2024 },
      teacher: { min: 2021, max: 2024 },
      auxiliar: { min: 2007, max: 2024 },
      employees: { min: 2007, max: 2024 },
    }),
    [],
  );

  // Garantir que o tipo é válido para educação básica
  const validType = validBasicEducationTypes.includes(filters.type)
    ? filters.type
    : "enrollment";
  const uniqueSelectedFilters = useMemo(
    () =>
      Array.from(
        new Map(
          (filters.selectedFilters || []).map((item) => [item.value, item]),
        ).values(),
      ),
    [filters.selectedFilters],
  );
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isEtapaSelected, setIsEtapaSelected] = useState(false);
  const [isLocalidadeSelected, setIsLocalidadeSelected] = useState(false);
  const [isDependenciaSelected, setIsDependenciaSelected] = useState(false);
  const [isMunicipioSelected, setIsMunicipioSelected] = useState(false);
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [municipalityPage, setMunicipalityPage] = useState(1);
  const [municipalityLimit, setMunicipalityLimit] = useState(20);
  const [municipalityPagination, setMunicipalityPagination] = useState(null);
  const municipalityPageRef = useRef(1);
  const municipalityLimitRef = useRef(20);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);

  const buildRowsFromResult = (result, cityName, includeCity = true) => {
    const rows = [];

    const resultArray = Array.isArray(result?.result) ? result.result : [];

    resultArray.forEach((item) => {
      const row = includeCity
        ? {
            Municipio: cityName,
            Ano: item.year ?? "",
            Etapa: item.education_level_mod_name ?? "",
            Total: item.total ?? 0,
          }
        : {
            Ano: item.year ?? "",
            Etapa: item.education_level_mod_name ?? "",
            Total: item.total ?? 0,
          };

      rows.push(row);
    });

    return rows;
  };
  const getOrderedHeaders = (rows, includeCity = true) => {
    if (!rows || !rows.length) return [];

    const firstRow = rows[0];
    const allKeys = Object.keys(firstRow);

    const fixedHeaders = [];

    if (includeCity && allKeys.includes("Municipio")) {
      fixedHeaders.push("Municipio");
    }

    if (allKeys.includes("Ano")) {
      fixedHeaders.push("Ano");
    }

    if (allKeys.includes("Etapa")) {
      fixedHeaders.push("Etapa");
    }

    if (allKeys.includes("Localidade")) {
      fixedHeaders.push("Localidade");
    }

    if (allKeys.includes("Dependência Administrativa")) {
      fixedHeaders.push("Dependência Administrativa");
    }

    if (allKeys.includes("Vínculo Funcional")) {
      fixedHeaders.push("Vínculo Funcional");
    }

    if (allKeys.includes("Formação Docente")) {
      fixedHeaders.push("Formação Docente");
    }

    if (allKeys.includes("Faixa Etária")) {
      fixedHeaders.push("Faixa Etária");
    }

    // Colunas dinâmicas (anos, etapas, etc.)
    const dynamicHeaders = allKeys.filter(
      (key) => !fixedHeaders.includes(key) && key !== "Total",
    );

    dynamicHeaders.sort((a, b) =>
      String(a).localeCompare(String(b), "pt-BR", { numeric: true }),
    );

    const hasOnlyOneDynamicColumn = dynamicHeaders.length === 1;

    return [
      ...fixedHeaders,
      ...dynamicHeaders,
      ...(hasOnlyOneDynamicColumn
        ? []
        : allKeys.includes("Total")
          ? ["Total"]
          : []),
    ];
  };
  const applyAutoColumnWidths = (worksheet, rows, headers) => {
    const minWidth = 12;
    const maxWidth = 40;

    worksheet["!cols"] = headers.map((header) => {
      const headerLength = String(header).length;

      const maxCellLength = rows.reduce((max, row) => {
        const value = row?.[header];

        const cellLength =
          value === null || value === undefined ? 0 : String(value).length;

        return Math.max(max, cellLength);
      }, 0);

      const width = Math.min(
        maxWidth,
        Math.max(minWidth, headerLength + 2, maxCellLength + 2),
      );

      return { wch: width };
    });
  };
  const buildPivotRowsFromResult = (
    result,
    cityName,
    includeCity = true,
    rowDimension = "",
    columnDimension = "",
  ) => {
    const resultArray = Array.isArray(result?.result) ? result.result : [];
    if (!resultArray.length) return [];
    // Se só um dos lados foi definido, assumir "ano" no outro eixo
    let effectiveRowDimension = rowDimension;
    let effectiveColumnDimension = columnDimension;
    if (!effectiveRowDimension && effectiveColumnDimension) {
      effectiveRowDimension = "ano";
    }
    if (effectiveRowDimension && !effectiveColumnDimension) {
      effectiveColumnDimension = "ano";
    }
    if (!effectiveRowDimension || !effectiveColumnDimension) return [];
    const dimensionMap = {
      ano: { field: "year", label: "Ano" },
      etapa: { field: "education_level_mod_name", label: "Etapa" },
      localidade: { field: "location_name", label: "Localidade" },
      dependencia: {
        field: "adm_dependency_detailed_name",
        label: "Dependência Administrativa",
      },
      vinculo: { field: "contract_type_name", label: "Vínculo Funcional" },
      formacaoDocente: {
        field: "initial_training_name",
        label: "Formação Docente",
      },
      faixaEtaria: { field: "age_range_name", label: "Faixa Etária" },
      municipio: { field: "municipality_name", label: "Município" },
    };

    const rowConfig = dimensionMap[effectiveRowDimension];
    const colConfig = dimensionMap[effectiveColumnDimension];

    if (!rowConfig || !colConfig) return [];

    const rowMap = new Map();
    const columnKeys = new Set();

    resultArray.forEach((item) => {
      const rowKey = item[rowConfig.field] ?? "N/A";
      const colKey = item[colConfig.field] ?? "N/A";
      const total = Number(item.total) || 0;

      columnKeys.add(colKey);

      if (!rowMap.has(rowKey)) {
        rowMap.set(rowKey, {});
      }

      const current = rowMap.get(rowKey)[colKey] || 0;
      rowMap.get(rowKey)[colKey] = current + total;
    });

    const sortedColumns = Array.from(columnKeys).sort((a, b) =>
      String(a).localeCompare(String(b), "pt-BR", { numeric: true }),
    );

    return Array.from(rowMap.entries()).map(([rowKey, values]) => {
      const row = {
        ...(includeCity && { Municipio: cityName }),
        [rowConfig.label]: rowKey,
      };

      let totalLinha = 0;

      sortedColumns.forEach((col) => {
        const value = values[col] || 0;
        row[col] = value;
        totalLinha += value;
      });

      row.Total = totalLinha;
      return row;
    });
  };
  const handleDownloadConsolidated = async () => {
    handleDownloadMenuClose();
    try {
      setIsLoading(true);
      const cities = getFilteredCities();
      console.log("EXPORT DEBUG", {
        rowDimension: filters.rowDimension,
        columnDimension: filters.columnDimension,
        selectedFilters: uniqueSelectedFilters.map((f) => f.value),
      });
      let allRows = [];

      for (const [cityId, cityInfo] of cities) {
        const result = await fetchExportDataForCity(cityId);
        console.log("RESULT SAMPLE", result?.result?.slice?.(0, 5));
        const shouldUsePivot = Boolean(
          filters.rowDimension || filters.columnDimension,
        );

        const rows = shouldUsePivot
          ? buildPivotRowsFromResult(
              result,
              cityInfo.nomeMunicipio,
              true,
              filters.rowDimension,
              filters.columnDimension,
            )
          : buildRowsFromResult(result, cityInfo.nomeMunicipio, true);
        allRows = allRows.concat(rows);
        console.log("ROWS EXPORTADAS", rows.slice(0, 5));
      }

      if (!allRows.length) {
        console.warn("Nenhum dado para exportar no consolidado");
        return;
      }

      const orderedHeaders = getOrderedHeaders(allRows, true);

      const worksheet = XLSX.utils.json_to_sheet(allRows, {
        header: orderedHeaders,
      });

      applyAutoColumnWidths(worksheet, allRows, orderedHeaders);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dados_Consolidados");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${buildExportFileName("CONSOLIDADO")}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar consolidado:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const sanitizeFileNamePart = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toUpperCase();

  const buildExportFileName = (suffix = "") => {
    const typeMap = {
      enrollment: "MAT",
      "school/count": "ESC",
      class: "TUR",
      teacher: "DOC",
      auxiliar: "AUX",
      employees: "FUN",
    };

    const filterMap = {
      etapa: "ETP",
      localidade: "LOC",
      dependencia: "DEP",
      vinculo: "VIN",
      formacaoDocente: "FOR",
      faixaEtaria: "FXE",
      municipio: "MUN",
    };

    const parts = [];

    // Tipo
    parts.push(typeMap[validType] || validType);

    // Período
    parts.push(
      filters.startYear === filters.endYear
        ? `${filters.startYear}`
        : `${filters.startYear}-${filters.endYear}`,
    );

    // Local principal
    if (filters.city && municipios[filters.city]) {
      parts.push(municipios[filters.city].nomeMunicipio);
    } else {
      if (filters.territory) {
        parts.push(`TD_${Regioes[filters.territory] || filters.territory}`);
      }
      if (filters.faixaPopulacional) {
        parts.push(
          `FP_${FaixaPopulacional[filters.faixaPopulacional] || filters.faixaPopulacional}`,
        );
      }
      if (filters.aglomerado) {
        parts.push(`AGL_${filters.aglomerado}`);
      }
      if (filters.gerencia) {
        parts.push(`GRE_${filters.gerencia}`);
      }
    }

    // Filtros analíticos
    if (uniqueSelectedFilters?.length) {
      const filterCodes = uniqueSelectedFilters
        .map((f) => filterMap[f.value] || f.value)
        .join("_");

      if (filterCodes) {
        parts.push(filterCodes);
      }
    }

    // Sufixo final
    if (suffix) {
      parts.push(suffix);
    }

    return parts.map(sanitizeFileNamePart).filter(Boolean).join("_");
  };
  const handleDownloadMenuOpen = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };
  const handleDownloadSeparated = async () => {
    handleDownloadMenuClose();

    try {
      setIsLoading(true);
      const cities = getFilteredCities();
      const zip = new JSZip();
      for (const [cityId, cityInfo] of cities) {
        const result = await fetchExportDataForCity(cityId);
        const shouldUsePivot = Boolean(
          filters.rowDimension || filters.columnDimension,
        );

        const rows = buildRowsFromResult(result, cityInfo.nomeMunicipio, false);
        if (!rows.length) continue;
        const orderedHeaders = getOrderedHeaders(rows, false);

        const worksheet = XLSX.utils.json_to_sheet(rows, {
          header: orderedHeaders,
        });

        applyAutoColumnWidths(worksheet, rows, orderedHeaders);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          cityInfo.nomeMunicipio.slice(0, 31),
        );

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        zip.file(
          `${sanitizeFileNamePart(cityInfo.nomeMunicipio)}.xlsx`,
          excelBuffer,
        );
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(zipBlob, `${buildExportFileName("ZIP_MUN")}.zip`);
    } catch (error) {
      console.error("Erro ao gerar ZIP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getYearLimits = useMemo(() => {
    return yearLimits[validType] || { min: 2007, max: 2022 };
  }, [validType, yearLimits]);
  const getFilteredCities = () => {
    // Se o usuário escolheu um município específico, retorna só ele
    if (filters.city && municipios[filters.city]) {
      return [[filters.city, municipios[filters.city]]];
    }

    return Object.entries(municipios).filter(
      ([
        ,
        {
          territorioDesenvolvimento,
          faixaPopulacional: cityFaixaPopulacional,
          aglomerado: cityAglomerado,
          gerencia: cityGerencia,
        },
      ]) => {
        const matchesTerritory =
          !filters.territory ||
          territorioDesenvolvimento === Regioes[filters.territory];

        const matchesFaixaPopulacional =
          !filters.faixaPopulacional ||
          cityFaixaPopulacional ===
            FaixaPopulacional[filters.faixaPopulacional];

        const matchesAglomerado =
          !filters.aglomerado || cityAglomerado === filters.aglomerado;

        const matchesGerencia =
          !filters.gerencia ||
          cityGerencia
            .split(",")
            .map((g) => g.trim())
            .includes(filters.gerencia);

        return (
          matchesTerritory &&
          matchesFaixaPopulacional &&
          matchesAglomerado &&
          matchesGerencia
        );
      },
    );
  };
  const fetchExportDataForCity = async (cityId) => {
    const selectedDims = uniqueSelectedFilters
      .map((f) => {
        const map = {
          etapa: "education_level_mod",
          localidade: "location",
          dependencia: "adm_dependency_detailed",
          vinculo: "contract_type",
          formacaoDocente: "initial_training",
          faixaEtaria: "age_range",
          municipio: "municipality",
        };
        return map[f.value];
      })
      .filter(Boolean);

    const dims = selectedDims.length ? `dims=${selectedDims.join(",")}` : "";

    const isHistorical = filters.startYear !== filters.endYear;

    let endpoint = validType;

    if (isHistorical) {
      endpoint =
        validType === "school/count"
          ? "school/count/timeseries"
          : `${validType}/timeseries`;
    }

    const filter =
      `min_year:"${filters.startYear}",max_year:"${filters.endYear}",` +
      `state:"22",city:"${cityId}"`;

    const url =
      `${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/${endpoint}` +
      `?${dims}&filter=${encodeURIComponent(filter)}&_t=${Date.now()}`;

    console.log("Export URL:", url);

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    return response.json();
  };
  const handleFilterClick = () => {
    setError(null);
    setData(null);
    setIsLoading(true);

    const isHistoricalRange = filters.startYear !== filters.endYear;
    const yearDisplay = isHistoricalRange
      ? `${filters.startYear}-${filters.endYear}`
      : filters.startYear;
    let locationName = "Piauí";
    const territorialLabels = [];

    if (filters.city) {
      const selectedCity = municipios[filters.city];
      if (selectedCity) {
        locationName = selectedCity.nomeMunicipio;
      }

      // Se houver cidade específica, os filtros territoriais podem aparecer em "Filtros"
      if (filters.territory) {
        territorialLabels.push(
          `Território: ${Regioes[filters.territory] || filters.territory}`,
        );
      }

      if (filters.faixaPopulacional) {
        territorialLabels.push(
          `Faixa populacional: ${FaixaPopulacional[filters.faixaPopulacional] || filters.faixaPopulacional}`,
        );
      }

      if (filters.aglomerado) {
        territorialLabels.push(`Aglomerado: ${filters.aglomerado}`);
      }

      if (filters.gerencia) {
        territorialLabels.push(`Gerência: ${filters.gerencia}`);
      }
    } else {
      const locationParts = [];

      if (filters.territory) {
        locationParts.push(Regioes[filters.territory] || filters.territory);
      }

      if (filters.faixaPopulacional) {
        locationParts.push(
          FaixaPopulacional[filters.faixaPopulacional] ||
            filters.faixaPopulacional,
        );
      }

      if (filters.aglomerado) {
        locationParts.push(`Aglomerado ${filters.aglomerado}`);
      }

      if (filters.gerencia) {
        locationParts.push(`Gerência ${filters.gerencia}`);
      }

      if (locationParts.length > 0) {
        locationName = `Piauí - ${locationParts.join(" | ")}`;
      }
    }
    const titleMapping = {
      enrollment: "Número de matrículas",
      "school/count": "Número de escolas",
      class: "Número de turmas",
      teacher: "Número de docentes",
      auxiliar: "Número de auxiliares",
      employees: "Número de funcionários",
    };

    const baseTitle = titleMapping[validType] || validType;

    // filtros analíticos selecionados no multiselect
    const selectedFilterLabels = uniqueSelectedFilters.map((f) => f.label);

    // junta tudo sem duplicar
    const allFilterLabels = [...selectedFilterLabels, ...territorialLabels];
    const uniqueFilterLabels = [...new Set(allFilterLabels)];

    const filterPart =
      uniqueFilterLabels.length > 0
        ? ` | Filtros: ${uniqueFilterLabels.join(", ")}`
        : "";

    const newTitle = `${baseTitle} em ${locationName} (${yearDisplay})${filterPart}`;

    setTitle(newTitle);
    const hasMunicipioSelected = uniqueSelectedFilters.some(
      (f) => f.value === "municipio",
    );
    setIsEtapaSelected(uniqueSelectedFilters.some((f) => f.value === "etapa"));
    setIsLocalidadeSelected(
      uniqueSelectedFilters.some((f) => f.value === "localidade"),
    );
    setIsDependenciaSelected(
      uniqueSelectedFilters.some((f) => f.value === "dependencia"),
    );
    setIsMunicipioSelected(hasMunicipioSelected);

    const filteredCities = Object.entries(municipios).filter(
      ([
        ,
        {
          territorioDesenvolvimento,
          faixaPopulacional: cityFaixaPopulacional,
          aglomerado: cityAglomerado,
          gerencia: cityGerencia,
        },
      ]) => {
        const matchesTerritory =
          !filters.territory ||
          territorioDesenvolvimento === Regioes[filters.territory];
        const matchesFaixaPopulacional =
          !filters.faixaPopulacional ||
          cityFaixaPopulacional ===
            FaixaPopulacional[filters.faixaPopulacional];
        const matchesAglomerado =
          !filters.aglomerado || cityAglomerado === filters.aglomerado;
        const matchesGerencia =
          !filters.gerencia ||
          cityGerencia
            .split(",")
            .map((g) => g.trim())
            .includes(filters.gerencia);

        return (
          matchesTerritory &&
          matchesFaixaPopulacional &&
          matchesAglomerado &&
          matchesGerencia
        );
      },
    );

    const paginationParams =
      hasMunicipioSelected && !filters.city
        ? {
            page: municipalityPageRef.current,
            limit: municipalityLimitRef.current,
          }
        : {};

    if (apiRef.current) {
      apiRef.current.fetchData({
        type: validType,
        year: filters.startYear,
        startYear: filters.startYear,
        endYear: filters.endYear,
        isHistorical: filters.startYear !== filters.endYear,
        city: filters.city,
        territory: filters.territory,
        faixaPopulacional: filters.faixaPopulacional,
        aglomerado: filters.aglomerado,
        gerencia: filters.gerencia,
        citiesList:
          filters.territory ||
          filters.faixaPopulacional ||
          filters.aglomerado ||
          filters.gerencia
            ? filteredCities
            : [],
        ...paginationParams,
        selectedFilters: uniqueSelectedFilters,
      });
    }
  };

  // Auto-trigger filter when context values change
  useEffect(() => {
    handleFilterClick();
  }, [
    validType,
    filters.selectedFilters,
    filters.rowDimension,
    filters.columnDimension,
    filters.city,
    filters.territory,
    filters.faixaPopulacional,
    filters.aglomerado,
    filters.gerencia,
    filters.startYear,
    filters.endYear,
  ]);

  const theme = useTheme();

  return (
    <div className="app-container">
      {isLoading && <Loading />}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <hr className="divider" />
      {!isLoading && !error && !data && (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            margin: "20px auto",
            maxWidth: "400px",
            color: theme.palette.primary.main,
          }}
        >
          Selecione os filtros desejados na barra lateral para montar uma
          consulta.
        </Typography>
      )}
      {/* Título já é renderizado dentro do ApiDataTable */}
      <ApiContainer
        ref={apiRef}
        type={validType}
        onDataFetched={(result) => {
          if (result && result.pagination) {
            setMunicipalityPagination(result.pagination);
          } else {
            setMunicipalityPagination(null);
          }
          setData(result);
        }}
        onError={setError}
        onLoading={setIsLoading}
        selectedFilters={uniqueSelectedFilters}
      />
      {!isLoading && !error && data && title ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadMenuOpen}
              endIcon={<ArrowDropDown />}
            >
              Baixar Todas as Tabelas
            </Button>

            <Menu
              anchorEl={downloadMenuAnchor}
              open={Boolean(downloadMenuAnchor)}
              onClose={handleDownloadMenuClose}
            >
              <MenuItem onClick={handleDownloadSeparated}>
                Tabelas Separadas (ZIP)
              </MenuItem>
              <MenuItem onClick={handleDownloadConsolidated}>
                Tabela Única Consolidada (Excel)
              </MenuItem>
            </Menu>
          </Box>
          <ApiDataTable
            data={data.finalResult ? data.finalResult : data}
            municipioData={
              data.allResults && data.allResults.length > 0
                ? data.allResults
                : []
            }
            isEtapaSelected={isEtapaSelected}
            isLocalidadeSelected={isLocalidadeSelected}
            isDependenciaSelected={isDependenciaSelected}
            isMunicipioSelected={isMunicipioSelected}
            isHistorical={filters.startYear !== filters.endYear}
            type={validType}
            year={filters.startYear}
            title={title}
            showConsolidated={showConsolidated}
            municipalityPagination={municipalityPagination}
            rowDimension={filters.rowDimension}
            columnDimension={filters.columnDimension}
            onMunicipalityPageChange={(newPage) => {
              municipalityPageRef.current = newPage;
              setMunicipalityPage(newPage);
              handleFilterClick();
            }}
            onMunicipalityLimitChange={(newLimit) => {
              municipalityLimitRef.current = newLimit;
              municipalityPageRef.current = 1;
              setMunicipalityLimit(newLimit);
              setMunicipalityPage(1);
              handleFilterClick();
            }}
            fetchAllDataConfig={
              isMunicipioSelected
                ? {
                    type: validType,
                    year: filters.startYear,
                    isHistorical: filters.startYear !== filters.endYear,
                    startYear: filters.startYear,
                    endYear: filters.endYear,
                    city: filters.city,
                    selectedFilters: uniqueSelectedFilters,
                  }
                : null
            }
          />

          {/* Ficha Técnica */}
          <Box
            sx={{
              marginTop: 6,
              padding: 3,
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
            >
              Ficha Técnica
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
              Informações sobre a metodologia, fonte de dados, periodicidade e
              outras informações técnicas estarão disponíveis aqui.
            </Typography>
          </Box>
        </>
      ) : null}
    </div>
  );
}

export default ParentComponent;
