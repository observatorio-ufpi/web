// Serviço para buscar dados de taxas do backend
const API_BASE_URL = import.meta.env.VITE_API_PUBLIC_URL || 'http://localhost:3000';

export const rateService = {
  // Buscar taxa de analfabetismo do Piauí
  async getPiauiIlliteracyRate(year = 2023) {
    try {
      const filter = `min_year:"${year}",max_year:"${year}",state:"22"`;
      const response = await fetch(`${API_BASE_URL}/rate/iliteracy_rate?filter=${encodeURIComponent(filter)}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data[0].total;
    } catch (error) {
      console.error('Erro ao buscar taxa de analfabetismo:', error);
      return null;
    }
  },

  // Buscar taxa de analfabetismo por município
  async getMunicipalityIlliteracyRate(municipalityCode, year = 2023) {
    try {
      const filter = `min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`;
      const response = await fetch(`${API_BASE_URL}/rate/iliteracy_rate?filter=${encodeURIComponent(filter)}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Taxa de analfabetismo do município ${municipalityCode}:`, data);
      
      // Retornar o valor consolidado para o município
      if (data.result && data.result.length > 0) {
        // Procurar por dados consolidados do município (sem faixa etária específica)
        const consolidatedData = data.result.find(item => 
          !item.age_range_name
        );
        
        if (consolidatedData) {
          return parseFloat(consolidatedData.total) || null;
        }
        
        // Se não encontrar dados consolidados, calcular a média
        const total = data.result.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        return data.result.length > 0 ? total / data.result.length : null;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar taxa de analfabetismo do município:', error);
      return null;
    }
  },

  // Buscar taxa de escolarização (usando taxa de conclusão do ensino médio)
  async getPiauiSchoolingRate(year = 2023) {
    try {
      const filter = `min_year:"${year}",max_year:"${year}",state:"22"`;
      const response = await fetch(`${API_BASE_URL}/rate/basic_education_conclusion?filter=${encodeURIComponent(filter)}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data[0].total;
    } catch (error) {
      console.error('Erro ao buscar taxa de conclusão do ensino médio:', error);
      return null;
    }
  },

  // Buscar taxa de escolarização por município (usando taxa de conclusão do ensino médio)
  async getMunicipalitySchoolingRate(municipalityCode, year = 2023) {
    try {
      const filter = `min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`;
      const response = await fetch(`${API_BASE_URL}/rate/basic_education_conclusion?filter=${encodeURIComponent(filter)}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Taxa de conclusão do ensino médio do município ${municipalityCode}:`, data);
      
      // Retornar o valor consolidado para o município
      if (data.result && data.result.length > 0) {
        // Procurar por dados consolidados do município (sem faixa etária específica)
        const consolidatedData = data.result.find(item => 
          !item.age_range_name
        );
        
        if (consolidatedData) {
          return parseFloat(consolidatedData.total) || null;
        }
        
        // Se não encontrar dados consolidados, calcular a média
        const total = data.result.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        return data.result.length > 0 ? total / data.result.length : null;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar taxa de conclusão do ensino médio do município:', error);
      return null;
    }
  },

  // Buscar taxa de conclusão do ensino superior do Piauí
  async getPiauiHigherEducationCompletionRate(year = 2023) {
    try {
      const filter = `min_year:"${year}",max_year:"${year}",state:"22"`;
      const response = await fetch(`${API_BASE_URL}/rate/superior_education_conclusion_tax?filter=${encodeURIComponent(filter)}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data[0].total;
    } catch (error) {
      console.error('Erro ao buscar taxa de conclusão do ensino superior:', error);
      return null;
    }
  },

  // Buscar taxa de conclusão do ensino superior por município
  async getMunicipalityHigherEducationCompletionRate(municipalityCode, year = 2023) {
    try {
      const filter = `min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`;
      const response = await fetch(`${API_BASE_URL}/rate/superior_education_conclusion_tax?filter=${encodeURIComponent(filter)}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Taxa de conclusão do ensino superior do município ${municipalityCode}:`, data);
      
      // Retornar o valor consolidado para o município
      if (data.result && data.result.length > 0) {
        // Procurar por dados consolidados do município (sem faixa etária específica)
        const consolidatedData = data.result.find(item => 
          !item.age_range_name
        );
        
        if (consolidatedData) {
          return parseFloat(consolidatedData.total) || null;
        }
        
        // Se não encontrar dados consolidados, calcular a média
        const total = data.result.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        return data.result.length > 0 ? total / data.result.length : null;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar taxa de conclusão do ensino superior do município:', error);
      return null;
    }
  }
};
