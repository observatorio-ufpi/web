// CSVs do estado empacotados pelo Vite no build (viram arquivos com hash em /assets).
// Antes eram buscados por fetch("/src/files/..."), caminho que só existe no
// servidor de desenvolvimento: em produção o servidor devolvia o index.html
// (status 200) no lugar do CSV e a tabela do Estado aparecia vazia, sem erro.
const arquivosCsvEstado = import.meta.glob('../files/estado_tabela_*.csv', {
  query: '?url',
  import: 'default',
  eager: true,
});

export const urlCsvEstado = (numeroTabela) =>
  arquivosCsvEstado[`../files/estado_tabela_${numeroTabela}.csv`];

// Busca o texto de um CSV do estado; falha de forma explícita se vier outra coisa
export const buscarCsvEstado = async (numeroTabela) => {
  const url = urlCsvEstado(numeroTabela);
  if (!url) {
    throw new Error(`Arquivo CSV não encontrado para a tabela ${numeroTabela}`);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao carregar o arquivo CSV: ${response.status} ${response.statusText}`);
  }
  const texto = await response.text();
  if (/^\s*<!doctype html|^\s*<html/i.test(texto)) {
    throw new Error(`O servidor devolveu uma página HTML no lugar do CSV da tabela ${numeroTabela}`);
  }
  return texto;
};

// Mapeamento de tabelas do estado (chave usada na tela -> número do arquivo)
export const stateTableFiles = Object.fromEntries(
  Array.from({ length: 13 }, (_, i) => [`tabela${i + 1}`, urlCsvEstado(i + 1)])
);

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
  const numero = String(tableKey).replace('tabela', '');
  try {
    return await buscarCsvEstado(numero);
  } catch (error) {
    console.error(`Erro ao carregar o arquivo CSV: ${error.message}`);
    throw error;
  }
};
