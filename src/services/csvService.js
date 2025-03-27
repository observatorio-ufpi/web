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
import tabela12CSV from "../files/tabela_complementar_estado - Página1.csv"

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
  tabela12: tabela12CSV
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
