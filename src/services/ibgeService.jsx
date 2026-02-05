// Serviço para buscar dados do IBGE
const IBGE_BASE_URL = '/ibge/api/v1';
const SIDRA_BASE_URL = 'https://apisidra.ibge.gov.br/values';

export const ibgeService = {
  // Buscar dados demográficos do Piauí
  async getPiauiDemographics() {
    try {
      // Código do Piauí: 22
      const response = await fetch(`${IBGE_BASE_URL}/localidades/estados/22`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados demográficos:', error);
      throw error;
    }
  },

  // Buscar dados demográficos por município
  async getMunicipalityDemographics(municipalityCode) {
    try {
      const response = await fetch(`${IBGE_BASE_URL}/localidades/municipios/${municipalityCode}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados demográficos do município:', error);
      throw error;
    }
  },

  // Buscar população estimada do Piauí (SIDRA - funciona!)
  async getPiauiPopulation() {
    try {
      // SIDRA Tabela 6579 - População estimada
      // Variável 9324 - População residente
      const response = await fetch(`${SIDRA_BASE_URL}/t/6579/n3/22/v/9324/p/2021`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar população:', error);
      throw error;
    }
  },

  // Buscar população estimada por município (SIDRA - funciona!)
  async getMunicipalityPopulation(municipalityCode) {
    try {
      // SIDRA Tabela 6579 - População estimada
      // Variável 9324 - População residente
      const response = await fetch(`${SIDRA_BASE_URL}/t/6579/n6/${municipalityCode}/v/9324/p/2021`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar população do município:', error);
      throw error;
    }
  },

  // Buscar dados de municípios do Piauí
  async getPiauiMunicipalities() {
    try {
      const response = await fetch(`${IBGE_BASE_URL}/localidades/estados/22/municipios`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      throw error;
    }
  },

  // Buscar dados de PIB por estado (SIDRA - funciona!)
  async getPiauiPIB() {
    try {
      // SIDRA Tabela 5938 - PIB dos municípios
      // Variável 37 - Valor corrente do PIB
      const response = await fetch(`${SIDRA_BASE_URL}/t/5938/n3/22/v/37/p/2021`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar PIB:', error);
      throw error;
    }
  },

  // Buscar dados de PIB por município (SIDRA - funciona!)
  async getMunicipalityPIB(municipalityCode) {
    try {
      // SIDRA Tabela 5938 - PIB dos municípios
      // Variável 37 - Valor corrente do PIB
      const response = await fetch(`${SIDRA_BASE_URL}/t/5938/n6/${municipalityCode}/v/37/p/2021`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar PIB do município:', error);
      throw error;
    }
  },

  // Buscar dados de IDH (dados mais recentes disponíveis)
  async getPiauiIDH() {
    try {
      // IDH é fornecido pelo PNUD, não pelo IBGE
      // Vamos usar dados do Atlas do Desenvolvimento Humano
      const response = await fetch(`${IBGE_BASE_URL}/agregados/7789/periodos/2010/variaveis/86?localidades=N6[22]`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar IDH:', error);
      throw error;
    }
  },

  // Buscar dados de IDH por município
  async getMunicipalityIDH(municipalityCode) {
    try {
      const response = await fetch(`${IBGE_BASE_URL}/agregados/7789/periodos/2010/variaveis/86?localidades=N6[${municipalityCode}]`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar IDH do município:', error);
      throw error;
    }
  },

  // Buscar dados educacionais básicos (por enquanto retorna null)
  async getPiauiEducation() {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados educacionais:', error);
      throw error;
    }
  },

  // Buscar dados educacionais básicos por município (por enquanto retorna null)
  async getMunicipalityEducation(municipalityCode) {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados educacionais do município:', error);
      throw error;
    }
  },

  // Buscar dados de educação superior (por enquanto retorna null)
  async getPiauiHigherEducation() {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados de educação superior:', error);
      throw error;
    }
  },

  // Buscar dados de educação superior por município (por enquanto retorna null)
  async getMunicipalityHigherEducation(municipalityCode) {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados de educação superior do município:', error);
      throw error;
    }
  },

  // Buscar dados de pós-graduação (por enquanto retorna null)
  async getPiauiPostGraduation() {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados de pós-graduação:', error);
      throw error;
    }
  },

  // Buscar dados de pós-graduação por município (por enquanto retorna null)
  async getMunicipalityPostGraduation(municipalityCode) {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados de pós-graduação do município:', error);
      throw error;
    }
  },

  // Buscar dados de rendimento
  async getPiauiIncome() {
    try {
      // Dados de rendimento via PNAD Contínua
      const response = await fetch(`${IBGE_BASE_URL}/agregados/8182/periodos/2023/variaveis/1095?localidades=N6[22]`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de rendimento:', error);
      throw error;
    }
  },

  // Buscar dados de rendimento por município
  async getMunicipalityIncome(municipalityCode) {
    try {
      const response = await fetch(`${IBGE_BASE_URL}/agregados/8182/periodos/2023/variaveis/1095?localidades=N6[${municipalityCode}]`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de rendimento do município:', error);
      throw error;
    }
  },

  // NOVOS MÉTODOS BASEADOS NA CONVERSA:

  // Buscar área territorial e população (SIDRA Tabela 4714 - funciona!)
  async getPiauiAreaAndPopulation() {
    try {
      // SIDRA Tabela 4714 - Área territorial, população e densidade
      const response = await fetch(`${SIDRA_BASE_URL}/t/4714/n3/22/p/2022`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar área e população:', error);
      throw error;
    }
  },

  // Buscar área territorial e população por município (SIDRA Tabela 4714 - funciona!)
  async getMunicipalityAreaAndPopulation(municipalityCode) {
    try {
      // SIDRA Tabela 4714 - Área territorial, população e densidade
      const response = await fetch(`${SIDRA_BASE_URL}/t/4714/n6/${municipalityCode}/p/2022`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar área e população do município:', error);
      throw error;
    }
  },

  // Buscar taxa de analfabetismo (por enquanto retorna null)
  async getPiauiIlliteracyRate() {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar taxa de analfabetismo:', error);
      throw error;
    }
  },

  // Buscar taxa de analfabetismo por município (por enquanto retorna null)
  async getMunicipalityIlliteracyRate(municipalityCode) {
    try {
      // Por enquanto, retornamos null
      // TODO: Implementar quando encontrar API que funcione
      return null;
    } catch (error) {
      console.error('Erro ao buscar taxa de analfabetismo do município:', error);
      throw error;
    }
  }
};

// Função para formatar números grandes
export const formatNumber = (number) => {
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  
  if (isNaN(number)) return 'N/A';
  
  // Sempre exibir o número completo com separadores de milhares
  return number.toLocaleString('pt-BR');
};

// Função para formatar valores monetários
export const formatCurrency = (value) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  if (isNaN(value)) return 'N/A';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Função para formatar percentuais
export const formatPercentage = (value) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  if (isNaN(value)) return 'N/A';
  
  return `${value.toFixed(1)}%`;
};
