// Mapeamento de tabelas do estado para arquivos CSV
export const stateTableFiles = {
  tabela1: "/src/files/tabela1_estado - Página1.csv",
  tabela2: "/src/files/tabela2_estado - Página1.csv",
  tabela3: "/src/files/tabela3_estado - Página1.csv",
  tabela4: "/src/files/tabela4_estado - Página1.csv",
  tabela5: "/src/files/tabela5_estado - Página1.csv",
  tabela6: "/src/files/tabela6_estado - Página1.csv",
  tabela7: "/src/files/tabela7_estado - Página1.csv",
  tabela8: "/src/files/tabela8_estado - Página1.csv",
  tabela9: "/src/files/tabela9_estado - Página1.csv",
  tabela10: "/src/files/tabela10_estado - Página1.csv",
  tabela11: "/src/files/tabela11_estado - Página1.csv",
  tabela12: "/src/files/tabela_complementar_estado - Página1.csv"
};

// Mapeamento de nomes de tabelas
export const stateTableNames = {
  tabela1: "Impostos Próprios do Piauí",
  tabela2: "Receita líquida de impostos próprios do Piauí",
  tabela3: "Receita de transferências constitucionais recebidas pelo Piauí",
  tabela4: "Receita líquida resultante de impostos do Piauí",
  tabela5: "Receitas adicionais para o financiamento do ensino no Piauí",
  tabela6: "Composição do Fundeb no Piauí",
  tabela7: "Composição da complementação do Fundeb no Piauí",
  tabela8:
    "Limite constitucional em MDE no Piauí ",
  tabela9: "Despesas com profissionais da educação básica com o Fundeb no Piauí",
  tabela10: "Despesas em MDE por área de atuação no Piauí",
  tabela11: " Receita Potencial Mínima vinculada à Educação Básica (RPEB)",
  tabela12: "Protocolo Complementar"
};

// Função para carregar o conteúdo do CSV
export const loadCSVFile = async (tableKey) => {
  try {
    // Obter o caminho do arquivo CSV correspondente
    const csvPath = stateTableFiles[tableKey];
    
    // Verificar se o arquivo existe
    if (!csvPath) {
      throw new Error(`Arquivo CSV não encontrado para a tabela: ${tableKey}`);
    }
    
    // Fazer uma requisição para obter o conteúdo do arquivo
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo CSV: ${response.statusText}`);
    }
    
    // Obter o texto do arquivo
    const text = await response.text();
    console.log(`CSV carregado para ${tableKey}, tamanho: ${text.length} caracteres`);
    
    return text;
  } catch (error) {
    console.error(`Erro ao carregar o arquivo CSV: ${error.message}`);
    throw error;
  }
};
