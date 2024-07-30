function getValidRevenue(revenue) {
  if (revenue.receitasRealizadasNoAno !== undefined) {
    return revenue.receitasRealizadasNoAno;
  }
  if (revenue.receitasRealizadaBimestre !== undefined) {
    return revenue.receitasRealizadaBimestre;
  }
  if (revenue.receitasRealizadaAteBimestre !== undefined) {
    return revenue.receitasRealizadaAteBimestre;
  }
  if (revenue.receitasRealizadasAteBimestre !== undefined) {
    return revenue.receitasRealizadasAteBimestre;
  }
}

function getValidExpense(expense) {
  if (expense.despesasLiquidadasNoAno !== undefined) {
    return expense.despesasLiquidadasNoAno;
  }
  if (expense.despesasEmpenhadasNoAno !== undefined) {
    return expense.despesasEmpenhadasNoAno;
  }
  if (expense.despesasLiquidadasAteBimestre !== undefined) {
    return expense.despesasLiquidadasAteBimestre;
  }
};

function getValidConstitutionalLimit(item) {
  if (item.valorExigido !== undefined) {
    return item.valorExigido;
  }
}

function getValidPercentage(item) {
 if (item.porcentagem !== undefined) {
    return item.porcentagem;
 }
 if (item.despesasRealizadasPercentual !== undefined) {
    return item.despesasRealizadasPercentual
 }
}

function getValidValue(item) {
  if (item.valor !== undefined) {
    return item.valor
  }
  if (item.valorExigido !== undefined) {
    return item.valorExigido
  }
}

export const transformDataForTableRevenues = (data, standardizeTypeFunction) => {
  const years = new Set();
  const typeToYearToValue = {};

  Object.keys(data).forEach((key) => {
    data[key].forEach((yearData) => {
      const year = yearData.ano;
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

  return {
    years: Array.from(years).sort(),
    typeToYearToValue,
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