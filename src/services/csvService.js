// Importações diretas dos arquivos CSV
import tabela1CSV from "../files/tabela1_estado - Página1.csv";
import tabela2CSV from "../files/tabela2_estado - Página1.csv";
import tabela3CSV from "../files/tabela3_estado - Página1.csv";
import tabela4CSV from "../files/tabela4_estado - Página1.csv";
import tabela5CSV from "../files/tabela5_estado - Página1.csv";
import tabela6CSV from "../files/tabela6_estado - Página1.csv";
import tabela7CSV from "../files/tabela7_estado - Página1.csv";
import tabela8CSV from "../files/tabela8_estado - Página1.csv";
import tabela9CSV from "../files/tabela9_estado - Página1.csv";
import tabela10CSV from "../files/tabela10_estado - Página1.csv";
import tabela11CSV from "../files/tabela11_estado - Página1.csv";

// Mapeamento de tabelas do estado para arquivos CSV
export const stateTableFiles = {
  tabela1: tabela1CSV,
  tabela2: tabela2CSV,
  tabela3: tabela3CSV,
  tabela4: tabela4CSV,
  tabela5: tabela5CSV,
  tabela6: tabela6CSV,
  tabela7: tabela7CSV,
  tabela8: tabela8CSV,
  tabela9: tabela9CSV,
  tabela10: tabela10CSV,
  tabela11: tabela11CSV,
};

// Mapeamento de nomes de tabelas
export const stateTableNames = {
  tabela1: "Impostos Próprios do Estado",
  tabela2: "Receita de transferências constitucionais e legais do Estado",
  tabela3: "Receita Líquida de Impostos do Estado",
  tabela4: "Receitas adicionais da educação no Estado",
  tabela5: "Composição do Fundef/Fundeb no Estado",
  tabela6: "Composição da complementação do Fundef/Fundeb do Estado",
  tabela7: "Limite constitucional em MDE no Estado",
  tabela8:
    "Despesas com profissionais da educação básica com o Fundef/Fundeb do Estado",
  tabela9: "Despesas em MDE por área de atuação do Estado",
  tabela10: "Receita Potencial Mínima vinculada à Educação Básica do Estado",
  tabela11: "Protocolo Complementar do Estado",
};

// Função para carregar o conteúdo do CSV
export const loadCSVFile = async (tableKey) => {
  try {
    // Obter o arquivo CSV correspondente
    const csvFile = stateTableFiles[tableKey];
    
    // Verificar se o arquivo existe
    if (!csvFile) {
      throw new Error(`Arquivo CSV não encontrado para a tabela: ${tableKey}`);
    }
    
    // Fazer uma requisição para obter o conteúdo do arquivo
    const response = await fetch(csvFile);
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
