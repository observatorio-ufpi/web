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
    allTables: process.env.REACT_APP_API_PUBLIC_URL + '/researches/all-revenues-expenses',

    'iptu-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/iptu',
    'iss-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/iss',
    'itbi-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/itbi',
    'irrf-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/irrf',
    'ipva-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/cota-parte-ipva',
    'icms-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/cota-parte-icms',
    'fpm-composition': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/fpm',
    'cota-parte-iof-ouro': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/cota-parte-iof-ouro',
    'outras-transferencias': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/outras-transferencias',
    'icms-desoneracao': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/icms-desoneracao',
    'cota-parte-ipi': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/cota-parte-ipi',
    'cota-parte-itr': process.env.REACT_APP_API_PUBLIC_URL + '/revenue-composition/cota-parte-itr',
  };

  export const fetchData = async (table, groupType, filters) => {
    const endpoint = `${endpoints[table]}/${groupType}`;
    const params = new URLSearchParams();

    if (filters.selectedMunicipio) params.append('nomeMunicipio', filters.selectedMunicipio);
    if (filters.territorioDeDesenvolvimentoMunicipio) params.append('territorioDeDesenvolvimentoMunicipio', filters.territorioDeDesenvolvimentoMunicipio);
    if (filters.faixaPopulacionalMunicipio) params.append('faixaPopulacionalMunicipio', filters.faixaPopulacionalMunicipio);
    if (filters.aglomeradoMunicipio) params.append('aglomeradoMunicipio', filters.aglomeradoMunicipio);
    if (filters.gerenciaRegionalMunicipio) params.append('gerenciaRegionalMunicipio', filters.gerenciaRegionalMunicipio);

    // Add pagination parameters
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const url = `${endpoint}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      // Return both data and pagination info if available, otherwise wrap data
      return data.pagination ? data : { data, pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } };
    } catch (error) {
      throw error;
    }
  };
