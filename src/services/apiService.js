// apiService.js
const endpoints = {
    ownRevenues: process.env.REACT_APP_API_PUBLIC_URL + '/researches/mot-revenue',
    constitutionalTransfersRevenue: process.env.REACT_APP_API_PUBLIC_URL + '/researches/ct-revenue',
    municipalTaxesRevenues: process.env.REACT_APP_API_PUBLIC_URL + '/researches/mt-revenue',
    additionalEducationRevenue: process.env.REACT_APP_API_PUBLIC_URL + '/researches/addtional-education-revenue',
    municipalFundebFundefComposition: process.env.REACT_APP_API_PUBLIC_URL + '/researches/mfc-revenue',
    complementationFundebFundef: process.env.REACT_APP_API_PUBLIC_URL + '/researches/cf-revenue',
    areasActivityExpense: process.env.REACT_APP_API_PUBLIC_URL + '/researches/areas-activity-expense',
    basicEducationMinimalPotential: process.env.REACT_APP_API_PUBLIC_URL + '/researches/basic-education-minimal-potential-revenue',
    constitutionalLimitMde: process.env.REACT_APP_API_PUBLIC_URL + '/researches/mc-limit-revenue',
    expensesBasicEducationFundeb: process.env.REACT_APP_API_PUBLIC_URL + '/researches/basic-education-expense',
    complementaryProtocol: process.env.REACT_APP_API_PUBLIC_URL + '/researches/complementary-protocol',
    allTables: process.env.REACT_APP_API_PUBLIC_URL + '/researches/all-revenues-expenses'
  };

  export const fetchData = async (table, groupType, filters) => {
    const endpoint = `${endpoints[table]}/${groupType}`;
    const params = new URLSearchParams();

    if (filters.selectedMunicipio) params.append('nomeMunicipio', filters.selectedMunicipio);
    if (filters.territorioDeDesenvolvimentoMunicipio) params.append('territorioDeDesenvolvimentoMunicipio', filters.territorioDeDesenvolvimentoMunicipio);
    if (filters.faixaPopulacionalMunicipio) params.append('faixaPopulacionalMunicipio', filters.faixaPopulacionalMunicipio);
    if (filters.aglomeradoMunicipio) params.append('aglomeradoMunicipio', filters.aglomeradoMunicipio);
    if (filters.gerenciaRegionalMunicipio) params.append('gerenciaRegionalMunicipio', filters.gerenciaRegionalMunicipio);

    const url = `${endpoint}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
