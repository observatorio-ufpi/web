// apiService.js
const endpoints = {
  ownRevenues: import.meta.env.VITE_API_PUBLIC_URL + "/researches/mot-revenue",
  constitutionalTransfersRevenue:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/ct-revenue",
  municipalTaxesRevenues:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/mt-revenue",
  additionalEducationRevenue:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/researches/addtional-education-revenue",
  municipalFundebFundefComposition:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/mfc-revenue",
  complementationFundebFundef:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/cf-revenue",
  areasActivityExpense:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/areas-activity-expense",
  basicEducationMinimalPotential:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/researches/basic-education-minimal-potential-revenue",
  constitutionalLimitMde:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/mc-limit-revenue",
  expensesBasicEducationFundeb:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/researches/basic-education-expense",
  complementaryProtocol:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/complementary-protocol",
  allTables:
    import.meta.env.VITE_API_PUBLIC_URL + "/researches/all-revenues-expenses",

  "iptu-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/iptu",
  "iss-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/iss",
  "itbi-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/itbi",
  "irrf-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/irrf",
  "ipva-composition":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-ipva",
  "icms-composition":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-icms",
  "fpm-composition":
    import.meta.env.VITE_API_PUBLIC_URL + "/revenue-composition/fpm",
  "cota-parte-iof-ouro":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-iof-ouro",
  "outras-transferencias":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/outras-transferencias",
  "icms-desoneracao":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/icms-desoneracao",
  "cota-parte-ipi":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-ipi",
  "cota-parte-itr":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-itr",
  "participacao-receita-impostos-proprios":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/participacao-receita-impostos-proprios",
  "participacao-transferencias":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/participacao-transferencias",
  "razao-impostos-transferencias":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/razao-impostos-transferencias",
  "razao-transferencias-impostos":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/razao-transferencias-impostos",
  "participacao-fundeb":
    import.meta.env.VITE_API_PUBLIC_URL +
    "/revenue-composition/participacao-fundeb",

  "fundeb_participation_mde":
    import.meta.env.VITE_API_PUBLIC_URL + "/rpeb-composition/fundeb_participation_mde",
  "resultado_liquido_fundeb":
    import.meta.env.VITE_API_PUBLIC_URL + "/rpeb-composition/resultado_liquido_fundeb",
  "participacao_complementacao_uniao":
    import.meta.env.VITE_API_PUBLIC_URL + "/rpeb-composition/participacao_complementacao_uniao",
  "participacao_receitas_adicionais":
    import.meta.env.VITE_API_PUBLIC_URL + "/rpeb-composition/participacao_receitas_adicionais",
  "mde_total_expense":
    import.meta.env.VITE_API_PUBLIC_URL + "/education-expense-composition/mde_total_expense",
  "mde_pessoal_ativo":
    import.meta.env.VITE_API_PUBLIC_URL + "/education-expense-composition/mde_pessoal_ativo",
  "mde_pessoal_inativo":
    import.meta.env.VITE_API_PUBLIC_URL + "/education-expense-composition/mde_pessoal_inativo",
  "mde_capital":
    import.meta.env.VITE_API_PUBLIC_URL + "/education-expense-composition/mde_capital",
  "mde_transferencias_instituicoes_privadas":
    import.meta.env.VITE_API_PUBLIC_URL + "/education-expense-composition/mde_transferencias_instituicoes_privadas",

  "aplicacao_mde":
    import.meta.env.VITE_API_PUBLIC_URL + "/resources-application-control/mde",
  "aplicacao_fundeb_pag_profissionais_educacao":
    import.meta.env.VITE_API_PUBLIC_URL + "/resources-application-control/fundeb",
  "aplicacao_vaat_educacao_infantil":
    import.meta.env.VITE_API_PUBLIC_URL + "/resources-application-control/ed-infantil-vaat",
  "aplicacao_vaat_despesa_capital":
    import.meta.env.VITE_API_PUBLIC_URL + "/resources-application-control/despesa-capital-vaat",

  "composicao_fundeb_financiamento":
    import.meta.env.VITE_API_PUBLIC_URL + "/financing-capacity/fundeb",
  "composicao_rpeb_financiamento":
    import.meta.env.VITE_API_PUBLIC_URL + "/financing-capacity/rpeb",
};

export const fetchData = async (table, groupType, filters) => {
  try {
    const queryParams = new URLSearchParams({
      ...(filters.nomeMunicipio && { nomeMunicipio: filters.nomeMunicipio }),
      ...(filters.territorioDeDesenvolvimentoMunicipio && {
        territorioDeDesenvolvimentoMunicipio:
          filters.territorioDeDesenvolvimentoMunicipio,
      }),
      ...(filters.faixaPopulacionalMunicipio && {
        faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      }),
      ...(filters.aglomeradoMunicipio && {
        aglomeradoMunicipio: filters.aglomeradoMunicipio,
      }),
      ...(filters.gerenciaRegionalMunicipio && {
        gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
      }),
      ...(filters.anoInicial && { anoInicial: filters.anoInicial }),
      ...(filters.anoFinal && { anoFinal: filters.anoFinal }),
      ...(filters.page && { page: filters.page }),
      ...(filters.limit && { limit: filters.limit }),
    });

    const response = await fetch(
      `${endpoints[table]}/${groupType}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
