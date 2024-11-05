function getValidRevenue(revenue) {
  if (revenue.receitasRealizadasNoAno !== undefined) {
    return Number(revenue.receitasRealizadasNoAno.toFixed(3));
  }
  if (revenue.receitasRealizadaBimestre !== undefined) {
    return Number(revenue.receitasRealizadaBimestre.toFixed(3));
  }
  if (revenue.receitasRealizadaAteBimestre !== undefined) {
    return Number(revenue.receitasRealizadaAteBimestre.toFixed(3));
  }
  if (revenue.receitasRealizadasAteBimestre !== undefined) {
    return Number(revenue.receitasRealizadasAteBimestre.toFixed(3));
  }
}

function getValidExpense(expense) {
  if (expense.despesasLiquidadasNoAno !== undefined) {
    return Number(expense.despesasLiquidadasNoAno.toFixed(3));
  }
  if (expense.despesasEmpenhadasNoAno !== undefined) {
    return Number(expense.despesasEmpenhadasNoAno.toFixed(3));
  }
  if (expense.despesasLiquidadasAteBimestre !== undefined) {
    return Number(expense.despesasLiquidadasAteBimestre.toFixed(3));
  }
};

function getValidConstitutionalLimit(item) {
  if (item.valorExigido !== undefined) {
    return Number(item.valorExigido.toFixed(3));
  }
}

function getValidPercentage(item) {
 if (item.porcentagem !== undefined) {
    return item.porcentagem.toFixed(2);
 }
 if (item.despesasRealizadasPercentual !== undefined) {
    return item.despesasRealizadasPercentual.toFixed(2);
 }
}

function getValidValue(item) {
  if (item.valor !== undefined) {
    return Number(item.valor.toFixed(3));
  }
  if (item.valorExigido !== undefined) {
    return Number(item.valorExigido.toFixed(3));
  }
  if (item.valorAplicado !== undefined) {
    return Number(item.valorAplicado.toFixed(3));
  }
  if (item.valorConsideradoAposDeducoes !== undefined) {
    return Number(item.valorConsideradoAposDeducoes.toFixed(3));
  }
  if (item.percentualAplicado !== undefined) {
    return Number(item.percentualAplicado.toFixed(3));
  }
}

export const transformDataForTableRevenues = (data, standardizeTypeFunction) => {
  const years = new Set();
  const typeToYearToValue = {};

  Object.keys(data).forEach((key) => {
    data[key].forEach((yearData) => {
      const year = yearData.ano;
      console.log(yearData)
      years.add(year);

      if (yearData.receita) {
        yearData.receita.forEach((revenue) => {
          const standardizedType = standardizeTypeFunction(revenue.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidRevenue(revenue);
        });
      }

      if (yearData.despesa) {
        yearData.despesa.forEach((expense) => {
          const standardizedType = standardizeTypeFunction(expense.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidExpense(expense);
        });
      }

      if (yearData.tabelaCumprimentoLimitesConstitucionais) {
        yearData.tabelaCumprimentoLimitesConstitucionais.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidPercentage(item);
        });
      }

      if (yearData.apuracaoLimiteMinimoConstitucional) {
        yearData.apuracaoLimiteMinimoConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesParaFinsDeLimitesConstitucional) {
        yearData.deducoesParaFinsDeLimitesConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.minimo60PorCentoFundeb) {
        yearData.minimo60PorCentoFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidPercentage(item);
        });
      }

      if (yearData.deducoesFundebMagisterio) {
        yearData.deducoesFundebMagisterio.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesParaFinsLimiteFundeb) {
        yearData.deducoesParaFinsLimiteFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.indicadoresFundeb) {
        yearData.indicadoresFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.indicadoresArt212) {
        yearData.indicadoresArt212.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesAdicoesParaFinsLimiteConstitucional) {
        yearData.deducoesAdicoesParaFinsLimiteConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesParaFinsDeLimitesConstitucionais) {
        yearData.deducoesParaFinsDeLimitesConstitucionais.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }
    });
  });

  console.log(Array.from(years).sort())

  return {
    rows: Array.from(years).sort(),
    typeToRowToValue: typeToYearToValue,
  };
};

export const transformDataForTableByYear = (data, standardizeTypeFunction) => {
  const municipios = new Set();
  const typeToMunicipioToValue = {};

  console.log('data' + data)

  Object.keys(data).forEach((key) => {
    data[key].forEach((municipioData) => {
      const municipio = municipioData.codigoMunicipio;
      municipios.add(municipio);

      if (municipioData.receita) {
        municipioData.receita.forEach((revenue) => {
          const standardizedType = standardizeTypeFunction(revenue.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidRevenue(revenue);
        });
      }

      if (municipioData.despesa) {
        municipioData.despesa.forEach((expense) => {
          const standardizedType = standardizeTypeFunction(expense.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidExpense(expense);
        });
      }

      if (municipioData.tabelaCumprimentoLimitesConstitucionais) {
        municipioData.tabelaCumprimentoLimitesConstitucionais.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidPercentage(item);
        });
      }

      if (municipioData.apuracaoLimiteMinimoConstitucional) {
        municipioData.apuracaoLimiteMinimoConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.deducoesParaFinsDeLimitesConstitucional) {
        municipioData.deducoesParaFinsDeLimitesConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.minimo60PorCentoFundeb) {
        municipioData.minimo60PorCentoFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidPercentage(item);
        });
      }

      if (municipioData.deducoesFundebMagisterio) {
        municipioData.deducoesFundebMagisterio.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.deducoesParaFinsLimiteFundeb) {
        municipioData.deducoesParaFinsLimiteFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.indicadoresFundeb) {
        municipioData.indicadoresFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.indicadoresArt212) {
        municipioData.indicadoresArt212.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.deducoesAdicoesParaFinsLimiteConstitucional) {
        municipioData.deducoesAdicoesParaFinsLimiteConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }

      if (municipioData.deducoesParaFinsDeLimitesConstitucionais) {
        municipioData.deducoesParaFinsDeLimitesConstitucionais.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToMunicipioToValue[standardizedType]) {
            typeToMunicipioToValue[standardizedType] = {};
          }

          typeToMunicipioToValue[standardizedType][municipio] = getValidValue(item);
        });
      }
    });
  });

  return {
    rows: Array.from(municipios).sort(),
    typeToRowToValue: typeToMunicipioToValue,
  };
};

export const transformDataForTableExpenses = (data, standardizeTypeFunction) => {
  const years = new Set();
  const typeToYearToValue = {};

  Object.keys(data).forEach((key) => {
    data[key].forEach((yearData) => {
      const year = yearData.ano;
      years.add(year);

      if (yearData.despesa && yearData.despesa.lenght > 0) {
        yearData.despesa.forEach((expense) => {
          const standardizedType = standardizeTypeFunction(expense.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidExpense(expense);
        });
      }

      if (yearData.tabelaCumprimentoLimitesConstitucionais && yearData.tabelaCumprimentoLimitesConstitucionais.lenght > 0) {
        yearData.tabelaCumprimentoLimitesConstitucionais.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidPercentage(item);
        });
      }

      if (yearData.apuracaoLimiteMinimoConstitucional && yearData.apuracaoLimiteMinimoConstitucional.lenght > 0) {
        yearData.apuracaoLimiteMinimoConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidConstitutionalLimit(item);
        });
      }

      if (yearData.minimo60PorCentoFundeb && yearData.minimo60PorCentoFundeb.length > 0) {
        yearData.minimo60PorCentoFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidPercentage(item);
        });
      }

      if (yearData.deducoesFundebMagisterio && yearData.deducoesFundebMagisterio.length > 0) {
        yearData.deducoesFundebMagisterio.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesParaFinsLimiteFundeb && yearData.deducoesParaFinsLimiteFundeb.length > 0) {
        yearData.deducoesParaFinsLimiteFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.indicadoresFundeb && yearData.indicadoresFundeb.lenght > 0) {
        yearData.indicadoresFundeb.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.indicadoresArt212 && yearData.indicadoresArt212.lenght > 0) {
        yearData.indicadoresArt212.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesAdicoesParaFinsLimiteConstitucional && yearData.deducoesAdicoesParaFinsLimiteConstitucional.lenght > 0) {
        yearData.deducoesAdicoesParaFinsLimiteConstitucional.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }

      if (yearData.deducoesParaFinsDeLimitesConstitucionais && yearData.deducoesParaFinsDeLimitesConstitucionais.lenght > 0) {
        yearData.deducoesParaFinsDeLimitesConstitucionais.forEach((item) => {
          const standardizedType = standardizeTypeFunction(item.tipo);
          if (!typeToYearToValue[standardizedType]) {
            typeToYearToValue[standardizedType] = {};
          }

          typeToYearToValue[standardizedType][year] = getValidValue(item);
        });
      }
    });
  });

  return {
    years: Array.from(years).sort(),
    typeToYearToValue,
  };
};