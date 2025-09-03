// Mapeamento de tabelas do estado para arquivos CSV
export const stateTableFiles = {
  tabela1: "/src/files/estado_tabela_1.csv",
  tabela2: "/src/files/estado_tabela_2.csv",
  tabela3: "/src/files/estado_tabela_3.csv",
  tabela4: "/src/files/estado_tabela_4.csv",
  tabela5: "/src/files/estado_tabela_5.csv",
  tabela6: "/src/files/estado_tabela_6.csv",
  tabela7: "/src/files/estado_tabela_7.csv",
  tabela8: "/src/files/estado_tabela_8.csv",
  tabela9: "/src/files/estado_tabela_9.csv",
  tabela10: "/src/files/estado_tabela_10.csv",
  tabela11: "/src/files/estado_tabela_11.csv",
  tabela12: "/src/files/estado_tabela_12.csv",
  tabela13: "/src/files/estado_tabela_13.csv"
};

// Mapeamento de nomes de tabelas
export const stateTableNames = {
  tabela1: "Receita bruta de impostos próprios do Piauí",
  tabela2: "Receita líquida de impostos próprios do Piauí",
  tabela3: "Receita bruta de transferências constitucionais recebidas pelo Piauí",
  tabela4: "Receita líquida de transferências constitucionais recebidas pelo Piauí",
  tabela5: "Receita líquida resultante de impostos e transferências constitucionais no Piauí",
  tabela6: "Receitas adicionais para o financiamento do ensino no Piauí",
  tabela7: "Composição do Fundeb no Piauí",
  tabela8: "Composição da complementação do Fundeb no Piauí",
  tabela9: "Limite constitucional em MDE no Piauí ",
  tabela10: "Despesas com profissionais da educação básica com o Fundeb no Piauí",
  tabela11: "Despesas em MDE por área de atuação no Piauí",
  tabela12: "Receita Potencial Mínima vinculada à Educação Básica (RPEB)",
  tabela13: "Protocolo Complementar"
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
