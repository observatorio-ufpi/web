import React, { createContext, useContext, useState } from 'react';

/**
 * Filtros da página /dados-educacionais/basica-v2 (schema educacao_v2).
 *
 * Diferente do contexto v1, aqui o recorte é um objeto vindo do catálogo da
 * API (com anoMin/anoMax, tipoSerie e eras) — é ele que dirige o filtro de
 * ano e o comportamento de consulta das séries quebradas.
 */

const EducationV2FilterContext = createContext();

export const useEducationV2Filters = () => {
  const context = useContext(EducationV2FilterContext);
  if (!context) {
    throw new Error(
      'useEducationV2Filters deve ser usado dentro de um EducationV2FilterProvider',
    );
  }
  return context;
};

export const EducationV2FilterProvider = ({ children }) => {
  const [indicador, setIndicador] = useState('matriculas');
  // Recorte selecionado: objeto completo do catálogo
  // { recorte, label, dimensoes, anoMin, anoMax, tipoSerie, eras?, nota? }
  const [recorte, setRecorte] = useState(null);
  // Era selecionada quando o recorte é "quebrada" ("classico" | "moderno")
  const [era, setEra] = useState('');

  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2024);

  const [city, setCity] = useState('');
  const [territory, setTerritory] = useState('');
  const [faixaPopulacional, setFaixaPopulacional] = useState('');
  const [aglomerado, setAglomerado] = useState('');
  const [gerencia, setGerencia] = useState('');

  const value = {
    indicador,
    setIndicador,
    recorte,
    setRecorte,
    era,
    setEra,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    city,
    setCity,
    territory,
    setTerritory,
    faixaPopulacional,
    setFaixaPopulacional,
    aglomerado,
    setAglomerado,
    gerencia,
    setGerencia,
  };

  return (
    <EducationV2FilterContext.Provider value={value}>
      {children}
    </EducationV2FilterContext.Provider>
  );
};
