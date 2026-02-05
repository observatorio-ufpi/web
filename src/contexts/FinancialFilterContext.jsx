import React, { createContext, useContext, useState } from 'react';

const FinancialFilterContext = createContext();

export const useFinancialFilters = () => {
  const context = useContext(FinancialFilterContext);
  if (!context) {
    throw new Error('useFinancialFilters deve ser usado dentro de um FinancialFilterProvider');
  }
  return context;
};

export const FinancialFilterProvider = ({ children }) => {
  const [municipality, setMunicipality] = useState('');
  const [year, setYear] = useState(2023);

  const value = {
    municipality,
    setMunicipality,
    year,
    setYear
  };

  return (
    <FinancialFilterContext.Provider value={value}>
      {children}
    </FinancialFilterContext.Provider>
  );
};
