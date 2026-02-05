import React, { createContext, useContext, useState } from 'react';

const EducationFilterContext = createContext();

export const useEducationFilters = () => {
  const context = useContext(EducationFilterContext);
  if (!context) {
    throw new Error('useEducationFilters deve ser usado dentro de um EducationFilterProvider');
  }
  return context;
};

export const EducationFilterProvider = ({ children }) => {
  const [type, setType] = useState('pop_out_school');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [territory, setTerritory] = useState('');
  const [faixaPopulacional, setFaixaPopulacional] = useState('');
  const [aglomerado, setAglomerado] = useState('');
  const [gerencia, setGerencia] = useState('');
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2024);
  const [city, setCity] = useState('');

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
    setCity
  };

  return (
    <EducationFilterContext.Provider value={value}>
      {children}
    </EducationFilterContext.Provider>
  );
};
