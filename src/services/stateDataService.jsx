// Serviço para gerenciar dados dos CSVs do estado do Piauí

// Função para carregar dados de um CSV específico
export const loadStateCSVData = async (tableNumber) => {
  try {
    const response = await fetch(`/src/files/estado_tabela_${tableNumber}.csv`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar tabela ${tableNumber}: ${response.statusText}`);
    }
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    return parsedData;
  } catch (error) {
    console.error(`Erro ao carregar dados da tabela ${tableNumber}:`, error);
    throw error;
  }
};

// Função para fazer parse do CSV
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]).map(header => header.replace(/"/g, '').trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  return data;
};

// Função para fazer parse de uma linha CSV respeitando aspas
export const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Aspas duplas escapadas
        current += '"';
        i++; // Pular a próxima aspa
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current) {
    result.push(current.trim());
  }
  
  return result;
};

// Função para carregar todos os dados necessários para um indicador específico
export const loadIndicatorData = async (indicatorType) => {
  try {
    let data = {};

    switch (indicatorType) {
      case 'revenueComposition':
        // Carregar dados das tabelas 1 e 3
        const [revenueData, transfersData] = await Promise.all([
          loadStateCSVData(1),
          loadStateCSVData(3)
        ]);
        
        data = {
          revenueComposition: revenueData,
          constitutionalTransfers: transfersData
        };
        break;

      case 'fundeb':
        // Carregar dados da tabela 7
        const fundebData = await loadStateCSVData(7);
        data = {
          fundeb: fundebData
        };
        break;

      case 'mde':
        // Carregar dados da tabela 9
        const mdeData = await loadStateCSVData(9);
        data = {
          mde: mdeData
        };
        break;

      case 'educationExpense':
        // Carregar dados da tabela 10
        const educationData = await loadStateCSVData(10);
        data = {
          educationProfessionals: educationData
        };
        break;

      case 'additionalRevenue':
        // Carregar dados da tabela 6
        const additionalData = await loadStateCSVData(6);
        data = {
          additionalRevenue: additionalData
        };
        break;

      case 'rpeb':
        // Carregar dados da tabela 12
        const rpebData = await loadStateCSVData(12);
        data = {
          rpeb: rpebData
        };
        break;

      default:
        throw new Error('Tipo de indicador não reconhecido');
    }

    return data;
  } catch (error) {
    console.error('Erro ao carregar dados do indicador:', error);
    throw error;
  }
};

// Mapeamento dos nomes das tabelas
export const stateTableNames = {
  tabela1: 'Receita BRUTA de impostos próprios do Piauí',
  tabela2: 'Receita LÍQUIDA de impostos próprios do Piauí',
  tabela3: 'Receita BRUTA de transferências constitucionais recebidas pelo Piauí',
  tabela4: 'Receita LÍQUIDA de transferências constitucionais recebidas pelo Piauí',
  tabela5: 'Receita líquida resultante de impostos e de transferências constitucionais no Piauí',
  tabela6: 'Receitas adicionais para o financiamento do ensino no Piauí',
  tabela7: 'Composição do Fundeb no Estado do Piauí',
  tabela8: 'Composição da Complementação da União ao Fundeb',
  tabela9: 'Valores exigidos e aplicados em MDE no Estado do Piauí',
  tabela10: 'Despesas com profissionais da Educação básica no Estado do Piauí',
  tabela11: 'Despesas com educação por modalidade de ensino no Estado do Piauí',
  tabela12: 'Composição da Receita Potencial da Educação Básica (RPEB) no Estado do Piauí',
  tabela13: 'Controle da aplicação de recursos em educação no Estado do Piauí'
};

// Opções para os indicadores do estado
export const stateIndicatorOptions = [
  { value: 'revenueComposition', label: 'Composição das Receitas' },
  { value: 'fundeb', label: 'Fundeb' },
  { value: 'mde', label: 'Manutenção e Desenvolvimento do Ensino (MDE)' },
  { value: 'educationExpense', label: 'Despesas com Educação' },
  { value: 'additionalRevenue', label: 'Receitas Adicionais' },
  { value: 'rpeb', label: 'Composição da Receita Potencial de Educação (RPEB)' },
  { value: 'publicFinances', label: 'Indicadores de Finanças Públicas' },
  { value: 'financingCapacity', label: 'Capacidade de Financiamento' },
  { value: 'fundebResources', label: 'Indicadores dos Recursos do Fundeb' },
  { value: 'resourceApplicationControl', label: 'Controle da Aplicação dos Recursos' },
  { value: 'educationInvestment', label: 'Investimento em Educação' },
];
