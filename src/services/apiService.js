// apiService.js
const endpoints = {
  ownRevenues: process.env.REACT_APP_API_PUBLIC_URL + "/researches/mot-revenue",
  constitutionalTransfersRevenue:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/ct-revenue",
  municipalTaxesRevenues:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/mt-revenue",
  additionalEducationRevenue:
    process.env.REACT_APP_API_PUBLIC_URL +
    "/researches/addtional-education-revenue",
  municipalFundebFundefComposition:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/mfc-revenue",
  complementationFundebFundef:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/cf-revenue",
  areasActivityExpense:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/areas-activity-expense",
  basicEducationMinimalPotential:
    process.env.REACT_APP_API_PUBLIC_URL +
    "/researches/basic-education-minimal-potential-revenue",
  constitutionalLimitMde:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/mc-limit-revenue",
  expensesBasicEducationFundeb:
    process.env.REACT_APP_API_PUBLIC_URL +
    "/researches/basic-education-expense",
  complementaryProtocol:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/complementary-protocol",
  allTables:
    process.env.REACT_APP_API_PUBLIC_URL + "/researches/all-revenues-expenses",

  "iptu-composition":
    process.env.REACT_APP_API_PUBLIC_URL + "/revenue-composition/iptu",
  "iss-composition":
    process.env.REACT_APP_API_PUBLIC_URL + "/revenue-composition/iss",
  "itbi-composition":
    process.env.REACT_APP_API_PUBLIC_URL + "/revenue-composition/itbi",
  "irrf-composition":
    process.env.REACT_APP_API_PUBLIC_URL + "/revenue-composition/irrf",
  "ipva-composition":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-ipva",
  "icms-composition":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-icms",
  "fpm-composition":
    process.env.REACT_APP_API_PUBLIC_URL + "/revenue-composition/fpm",
  "cota-parte-iof-ouro":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-iof-ouro",
  "outras-transferencias":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/outras-transferencias",
  "icms-desoneracao":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/icms-desoneracao",
  "cota-parte-ipi":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-ipi",
  "cota-parte-itr":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/cota-parte-itr",
  "participacao-receita-impostos-proprios":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/participacao-receita-impostos-proprios",
  "participacao-transferencias":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/participacao-transferencias",
  "razao-impostos-transferencias":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/razao-impostos-transferencias",
  "razao-transferencias-impostos":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/razao-transferencias-impostos",
  "participacao-fundeb":
    process.env.REACT_APP_API_PUBLIC_URL +
    "/revenue-composition/participacao-fundeb",

  "fundeb_participation_mde":
    process.env.REACT_APP_API_PUBLIC_URL + "/rpeb-composition/fundeb_participation_mde",
  "resultado_liquido_fundeb":
    process.env.REACT_APP_API_PUBLIC_URL + "/rpeb-composition/resultado_liquido_fundeb",
  "participacao_complementacao_uniao":
    process.env.REACT_APP_API_PUBLIC_URL + "/rpeb-composition/participacao_complementacao_uniao",
  "participacao_receitas_adicionais":
    process.env.REACT_APP_API_PUBLIC_URL + "/rpeb-composition/participacao_receitas_adicionais",
  "mde_total_expense":
    process.env.REACT_APP_API_PUBLIC_URL + "/education-expense-composition/mde_total_expense",
  "mde_pessoal_ativo":
    process.env.REACT_APP_API_PUBLIC_URL + "/education-expense-composition/mde_pessoal_ativo",
  "mde_pessoal_inativo":
    process.env.REACT_APP_API_PUBLIC_URL + "/education-expense-composition/mde_pessoal_inativo",
  "mde_capital":
    process.env.REACT_APP_API_PUBLIC_URL + "/education-expense-composition/mde_capital",
  "mde_transferencias_instituicoes_privadas":
    process.env.REACT_APP_API_PUBLIC_URL + "/education-expense-composition/mde_transferencias_instituicoes_privadas",

  "aplicacao_mde":
    process.env.REACT_APP_API_PUBLIC_URL + "/resources-application-control/mde",
  "aplicacao_fundeb_pag_profissionais_educacao":
    process.env.REACT_APP_API_PUBLIC_URL + "/resources-application-control/fundeb",
  "aplicacao_vaat_educacao_infantil":
    process.env.REACT_APP_API_PUBLIC_URL + "/resources-application-control/ed-infantil-vaat",
  "aplicacao_vaat_despesa_capital":
    process.env.REACT_APP_API_PUBLIC_URL + "/resources-application-control/despesa-capital-vaat",

  "composicao_fundeb_financiamento":
    process.env.REACT_APP_API_PUBLIC_URL + "/financing-capacity/fundeb",
  "composicao_rpeb_financiamento":
    process.env.REACT_APP_API_PUBLIC_URL + "/financing-capacity/rpeb",
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
