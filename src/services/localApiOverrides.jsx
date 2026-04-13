export const localApiOverrides = {
  // Sistema de correções locais para dados da API
  // As correções para os municípios foram aplicadas diretamente no arquivo municipios.mapping.jsx
  // Este arquivo pode ser usado futuramente para correções em dados da API
};

export const applyLocalDataOverrides = (table, groupType, filters, data) => {
  if (!data) {
    return data;
  }

  const overrides = localApiOverrides[table];
  if (!overrides || overrides.length === 0) {
    return data;
  }

  const resultArray = Array.isArray(data) ? data : data.result;
  if (!Array.isArray(resultArray)) {
    return data;
  }

  const patchedResults = resultArray.map((item) => {
    const matchingOverride = overrides.find(({ match }) => {
      if (!match) return false;
      return Object.keys(match).every((key) => {
        return item[key] === match[key] || filters[key] === match[key];
      });
    });

    if (!matchingOverride) {
      return item;
    }

    return {
      ...item,
      ...matchingOverride.patch,
    };
  });

  const patchedData = Array.isArray(data)
    ? patchedResults
    : {
        ...data,
        result: patchedResults,
      };

  return patchedData;
};
