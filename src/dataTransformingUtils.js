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

export const transformDataForTableRevenues = (data, standardizeTypeFunction) => {
  const years = new Set();
  const typeToYearToValue = {};

  Object.keys(data).forEach((key) => {
    data[key].forEach((yearData) => {
      const year = yearData.ano;
      years.add(year);

      yearData.receita.forEach((revenue) => {
        const standardizedType = standardizeTypeFunction(revenue.tipo);
        if (!typeToYearToValue[standardizedType]) {
          typeToYearToValue[standardizedType] = {};
        }

        typeToYearToValue[standardizedType][year] = getValidRevenue(revenue);
      });
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

      yearData.despesa.forEach((expense) => {
        const standardizedType = standardizeTypeFunction(expense.tipo);
        if (!typeToYearToValue[standardizedType]) {
          typeToYearToValue[standardizedType] = {};
        }

        typeToYearToValue[standardizedType][year] = getValidExpense(expense);
      });
    });
  });

  return {
    years: Array.from(years).sort(),
    typeToYearToValue,
  };
};