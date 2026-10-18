import React, { createContext, useContext, useState } from "react";
import { municipios } from "../utils/citiesMapping";

const EducationFilterContext = createContext();

export const useEducationFilters = () => {
  const context = useContext(EducationFilterContext);
  if (!context) {
    throw new Error(
      "useEducationFilters deve ser usado dentro de um EducationFilterProvider",
    );
  }
  return context;
};

const municipioDaUrl = () => {
  const codigo = new URLSearchParams(window.location.search).get("municipio") || "";
  if (municipios[codigo]) return codigo;
  if (/^\d{6}$/.test(codigo)) return Object.keys(municipios).find((c) => c.startsWith(codigo)) || "";
  return "";
};

export const EducationFilterProvider = ({ children }) => {
  const [type, setType] = useState("enrollment");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [territory, setTerritory] = useState("");
  const [faixaPopulacional, setFaixaPopulacional] = useState("");
  const [aglomerado, setAglomerado] = useState("");
  const [gerencia, setGerencia] = useState("");
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2024);
  // Município pode vir do endereço (?municipio=, 7 ou 6 dígitos) — ex.: busca da home
  const [city, setCity] = useState(municipioDaUrl);

  const [rowDimension, setRowDimension] = useState("");
  const [columnDimension, setColumnDimension] = useState("");

  const value = {
    type,
    setType,
    selectedFilters,
    setSelectedFilters,
    territory,
    setTerritory,
    faixaPopulacional,
    setFaixaPopulacional,
    aglomerado,
    setAglomerado,
    gerencia,
    setGerencia,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    city,
    setCity,

    rowDimension,
    setRowDimension,
    columnDimension,
    setColumnDimension,
  };

  return (
    <EducationFilterContext.Provider value={value}>
      {children}
    </EducationFilterContext.Provider>
  );
};
