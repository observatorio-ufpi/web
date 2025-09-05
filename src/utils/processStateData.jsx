// Utilitário para processar dados dos indicadores do estado do Piauí

// Função para converter string de valor monetário para número
export const parseMonetaryValue = (value) => {
  if (!value || value === '-' || value === '') return 0;
  
  // Remove aspas e converte vírgula para ponto
  const cleanValue = value.toString().replace(/"/g, '').replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(cleanValue) || 0;
};

// Função para processar dados de composição de receitas
export const processRevenueCompositionData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'ICMS',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.ICMS) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    },
    {
      label: 'ITCD',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.ITCD) : 0;
      }),
      backgroundColor: colorPalette[1],
      borderColor: colorPalette[1],
      borderWidth: 1
    },
    {
      label: 'IPVA',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.IPVA) : 0;
      }),
      backgroundColor: colorPalette[2],
      borderColor: colorPalette[2],
      borderWidth: 1
    },
    {
      label: 'IRRF/Estaduais',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['IRRF/Estaduais']) : 0;
      }),
      backgroundColor: colorPalette[3],
      borderColor: colorPalette[3],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar dados de transferências constitucionais
export const processConstitutionalTransfersData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'Cota-parte FPE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Cota-parte FPE']) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    },
    {
      label: 'Cota-parte IPI-Exp',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Cota-parte IPI-Exp']) : 0;
      }),
      backgroundColor: colorPalette[1],
      borderColor: colorPalette[1],
      borderWidth: 1
    },
    {
      label: 'Cota-parte IOF-Ouro',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Cota-parte IOF-Ouro']) : 0;
      }),
      backgroundColor: colorPalette[2],
      borderColor: colorPalette[2],
      borderWidth: 1
    },
    {
      label: 'ICMS Desoneração',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Compensação financeiras proveniente e impostos e transferências constitucionais (ICMS desoneração Lei 87/96, outros)']) : 0;
      }),
      backgroundColor: colorPalette[3],
      borderColor: colorPalette[3],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar dados do Fundeb
export const processFundebData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'Receita Destinada ao Fundeb',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Receita destinada/contribuição ao Fundef/Fundeb']) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    },
    {
      label: 'Receita Recebida do Fundeb',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Receita recebida na redistribuição interna do Fundeb']) : 0;
      }),
      backgroundColor: colorPalette[1],
      borderColor: colorPalette[1],
      borderWidth: 1
    },
    {
      label: 'Complementação da União',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Complementação da União']) : 0;
      }),
      backgroundColor: colorPalette[2],
      borderColor: colorPalette[2],
      borderWidth: 1
    },
    {
      label: 'Total do Fundeb',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Total do Fundeb no Estado (com aplicação)']) : 0;
      }),
      backgroundColor: colorPalette[3],
      borderColor: colorPalette[3],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar dados de MDE (Manutenção e Desenvolvimento do Ensino)
export const processMDEData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'Valor Exigido em MDE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Valor exigido em MDE']) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    },
    {
      label: 'Valor Aplicado em MDE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Valor aplicado em MDE']) : 0;
      }),
      backgroundColor: colorPalette[1],
      borderColor: colorPalette[1],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar percentual aplicado em MDE
export const processMDEPercentageData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: '% Aplicado em MDE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseFloat(item['% aplicado em MDE'].replace(',', '.')) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar dados de despesas com profissionais da educação
export const processEducationProfessionalsData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'Despesas com Profissionais da Educação Básica',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Despesas com profissionais da Educação básica']) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar dados de receitas adicionais
export const processAdditionalRevenueData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'Salário-Educação',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Salário-Educação']) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    },
    {
      label: 'PDDE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.PDDE) : 0;
      }),
      backgroundColor: colorPalette[1],
      borderColor: colorPalette[1],
      borderWidth: 1
    },
    {
      label: 'PNAE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.PNAE) : 0;
      }),
      backgroundColor: colorPalette[2],
      borderColor: colorPalette[2],
      borderWidth: 1
    },
    {
      label: 'PNATE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.PNATE) : 0;
      }),
      backgroundColor: colorPalette[3],
      borderColor: colorPalette[3],
      borderWidth: 1
    },
    {
      label: 'Outras Transferências do FNDE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Outras transferências do FNDE']) : 0;
      }),
      backgroundColor: colorPalette[4],
      borderColor: colorPalette[4],
      borderWidth: 1
    },
    {
      label: 'Convênios',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Convênios (incluindo aplicação)']) : 0;
      }),
      backgroundColor: colorPalette[5],
      borderColor: colorPalette[5],
      borderWidth: 1
    },
    {
      label: 'Operação de Créditos',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['Operação de créditos']) : 0;
      }),
      backgroundColor: colorPalette[6],
      borderColor: colorPalette[6],
      borderWidth: 1
    },
    {
      label: 'Royalties',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item.Royalties) : 0;
      }),
      backgroundColor: colorPalette[7],
      borderColor: colorPalette[7],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};

// Função para processar dados de composição da RPEB
export const processRPEBCompositionData = (data, colorPalette) => {
  if (!data || !Array.isArray(data)) {
    return {
      chartData: { labels: [], datasets: [] },
      municipalityColors: {}
    };
  }

  const years = data.map(item => item.Ano).sort();
  const labels = years.map(year => year.toString());

  const datasets = [
    {
      label: 'Receita Líquida de Impostos e Transferências',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['+ Receita Líquida de impostos e transferência constitucionais e legais MDE (I)']) : 0;
      }),
      backgroundColor: colorPalette[0],
      borderColor: colorPalette[0],
      borderWidth: 1
    },
    {
      label: 'Receitas Recebidas do Fundeb',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['+ receitas recebidas do Fundeb (fundo estadual) (III)']) : 0;
      }),
      backgroundColor: colorPalette[1],
      borderColor: colorPalette[1],
      borderWidth: 1
    },
    {
      label: 'Complementação da União ao Fundeb',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['+ Complementação da União ao Fundeb (IV)']) : 0;
      }),
      backgroundColor: colorPalette[2],
      borderColor: colorPalette[2],
      borderWidth: 1
    },
    {
      label: 'Quota do Salário-Educação',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['+ Quota do salário-educação (V)']) : 0;
      }),
      backgroundColor: colorPalette[3],
      borderColor: colorPalette[3],
      borderWidth: 1
    },
    {
      label: 'Transferências do FNDE',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['+ Transferência de Programas do FNDE (PDDE, PNAE, PNATE, PNLD) (VI)']) : 0;
      }),
      backgroundColor: colorPalette[4],
      borderColor: colorPalette[4],
      borderWidth: 1
    },
    {
      label: 'Royalties do Petróleo e Gás',
      data: years.map(year => {
        const item = data.find(d => d.Ano === year);
        return item ? parseMonetaryValue(item['+Royalties do Petróleo e gás (VII)']) : 0;
      }),
      backgroundColor: colorPalette[5],
      borderColor: colorPalette[5],
      borderWidth: 1
    }
  ];

  return {
    chartData: {
      labels,
      datasets
    },
    municipalityColors: {}
  };
};
