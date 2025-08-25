import React, { Component } from "react";
import "../../../../../../App.css";
import { fetchData } from "../../../../../../services/apiService.jsx";
import "../../../../../../style/ChartPagination.css";
import {
  processBasicEducationData,
  processMDEData,
} from "../../../../../../utils/processDataCharts";
import ChartComponent from "./ChartComponent";
import CustomPagination from "../../../../../helpers/CustomPagination";
import EducationExpenseCompositionCharts from "./EducationExpenseCompositionCharts";
import FinancingCapacityCharts from "./FinancingCapacityCharts";
import ResourcesApplicationControlCharts from "./ResourcesApplicationControlCharts";
import RevenueCompositionCharts from "./RevenueCompositionCharts";
import RpebCompositionCharts from "./RpebCompositionCharts";
import FilterComponent from "../../../../../helpers/TableFilters";

const endpoints = {
  // Existing endpoints
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

  // New revenue composition endpoints
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

  fundeb_participation_mde:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/rpeb-composition/fundeb_participation_mde",
  resultado_liquido_fundeb:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/rpeb-composition/resultado_liquido_fundeb",
  participacao_complementacao_uniao:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/rpeb-composition/participacao_complementacao_uniao",
  mde_total_expense:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_total_expense",
  mde_pessoal_ativo:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_pessoal_ativo",
  mde_pessoal_inativo:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_pessoal_inativo",
  mde_capital:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_capital",
  mde_transferencias_instituicoes_privadas:
    import.meta.env.VITE_API_PUBLIC_URL +
    "/education-expense-composition/mde_transferencias_instituicoes_privadas",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      loading: false, // Mudado para false inicialmente
      error: null,
      selectedTable: "constitutionalLimitMde",
      selectedMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: "",
      gerenciaRegionalMunicipio: "",
      groupType: "municipio",
      page: 1,
      limit: 10,
      totalPages: 1,
      hasInitialLoad: false, // Nova flag para controlar se já fez o primeiro carregamento
    };
  }

  componentDidMount() {
    // Não carrega dados automaticamente, apenas mostra os filtros
    // this.fetchTableData();
  }

  fetchTableData = () => {
    const {
      selectedTable,
      groupType,
      selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
    } = this.state;
    this.setState({ loading: true });

    if (selectedTable === "revenueComposition") {
      // Fetch all revenue composition indicators
      Promise.all([
        fetchData("iptu-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("iss-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("itbi-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("irrf-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("ipva-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("icms-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("fpm-composition", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("cota-parte-iof-ouro", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("outras-transferencias", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("icms-desoneracao", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("cota-parte-ipi", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("cota-parte-itr", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("participacao-receita-impostos-proprios", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("participacao-transferencias", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("razao-impostos-transferencias", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("razao-transferencias-impostos", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("participacao-fundeb", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
      ])
        .then(
          ([
            iptu,
            iss,
            itbi,
            irrf,
            ipva,
            icms,
            fpm,
            iofOuro,
            outrasTransferencias,
            icmsDesoneracao,
            cotaParteIpi,
            cotaParteItr,
            participacaoReceitaImpostosProprios,
            participacaoTransferencias,
            razaoImpostosTransferencias,
            razaoTransferenciasImpostos,
            participacaoFundeb,
          ]) => {
            this.setState({
              apiData: {
                iptu,
                iss,
                itbi,
                irrf,
                ipva,
                icms,
                fpm,
                iofOuro,
                outrasTransferencias,
                icmsDesoneracao,
                cotaParteIpi,
                cotaParteItr,
                participacaoReceitaImpostosProprios,
                participacaoTransferencias,
                razaoImpostosTransferencias,
                razaoTransferenciasImpostos,
                participacaoFundeb,
              },
              loading: false,
              totalPages: Math.max(
                ...Object.values({
                  iptu,
                  iss,
                  itbi,
                  irrf,
                  ipva,
                  icms,
                  fpm,
                  iofOuro,
                  outrasTransferencias,
                  icmsDesoneracao,
                  cotaParteIpi,
                  cotaParteItr,
                  participacaoReceitaImpostosProprios,
                  participacaoTransferencias,
                  razaoImpostosTransferencias,
                  razaoTransferenciasImpostos,
                  participacaoFundeb,
                }).map((data) => data.pagination?.totalPages || 1)
              ),
            });
          }
        )
        .catch((error) => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    } else if (selectedTable === "rpebComposition") {
      Promise.all([
        fetchData("fundeb_participation_mde", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("resultado_liquido_fundeb", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("participacao_complementacao_uniao", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("participacao_receitas_adicionais", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
      ])
        .then(
          ([
            fundebParticipationMde,
            resultadoLiquidoFundeb,
            participacaoComplementacaoUniao,
            participacaoReceitasAdicionais,
          ]) => {
            this.setState({
              apiData: {
                fundebParticipationMde,
                resultadoLiquidoFundeb,
                participacaoComplementacaoUniao,
                participacaoReceitasAdicionais,
              },
              loading: false,
              totalPages: Math.max(
                ...Object.values({
                  fundebParticipationMde,
                  resultadoLiquidoFundeb,
                  participacaoComplementacaoUniao,
                  participacaoReceitasAdicionais,
                }).map((data) => data.pagination?.totalPages || 1)
              ),
            });
          }
        )
        .catch((error) => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    } else if (selectedTable === "educationExpenseComposition") {
      Promise.all([
        fetchData("mde_total_expense", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("mde_pessoal_ativo", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("mde_pessoal_inativo", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("mde_capital", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("mde_transferencias_instituicoes_privadas", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
      ])
        .then(
          ([
            mdeTotalExpense,
            mdePessoalAtivo,
            mdePessoalInativo,
            mdeCapital,
            mdeTransferenciasInstituicoesPrivadas,
          ]) => {
            this.setState({
              apiData: {
                mdeTotalExpense,
                mdePessoalAtivo,
                mdePessoalInativo,
                mdeCapital,
                mdeTransferenciasInstituicoesPrivadas,
              },
              loading: false,
              totalPages: Math.max(
                ...Object.values({
                  mdeTotalExpense,
                  mdePessoalAtivo,
                  mdePessoalInativo,
                  mdeCapital,
                  mdeTransferenciasInstituicoesPrivadas,
                }).map((data) => data.pagination?.totalPages || 1)
              ),
            });
          }
        )
        .catch((error) => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    } else if (selectedTable === "resourcesApplicationControl") {
      Promise.all([
        fetchData("aplicacao_mde", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("aplicacao_fundeb_pag_profissionais_educacao", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("aplicacao_vaat_educacao_infantil", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("aplicacao_vaat_despesa_capital", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
      ])
        .then(
          ([
            aplicacaoMde,
            aplicacaoFundeb,
            aplicacaoVaatEducacaoInfantil,
            aplicacaoVaatDespesaCapital,
          ]) => {
            this.setState({
              apiData: {
                aplicacaoMde,
                aplicacaoFundeb,
                aplicacaoVaatEducacaoInfantil,
                aplicacaoVaatDespesaCapital,
              },
              loading: false,
              totalPages: Math.max(
                ...Object.values({
                  aplicacaoMde,
                  aplicacaoFundeb,
                  aplicacaoVaatEducacaoInfantil,
                  aplicacaoVaatDespesaCapital,
                }).map((data) => data.pagination?.totalPages || 1)
              ),
            });
          }
        )
        .catch((error) => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    } else if (selectedTable === "financingCapacity") {
      Promise.all([
        fetchData("composicao_fundeb_financiamento", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
        fetchData("composicao_rpeb_financiamento", groupType, {
          selectedMunicipio,
          territorioDeDesenvolvimentoMunicipio,
          faixaPopulacionalMunicipio,
          aglomeradoMunicipio,
          gerenciaRegionalMunicipio,
          page: this.state.page,
          limit: this.state.limit,
        }),
      ])
        .then(
          ([composicaoFundebFinanciamento, composicaoRpebFinanciamento]) => {
            this.setState({
              apiData: {
                composicaoFundebFinanciamento,
                composicaoRpebFinanciamento,
              },
              loading: false,
              totalPages: Math.max(
                ...Object.values({
                  composicaoFundebFinanciamento,
                  composicaoRpebFinanciamento,
                }).map((data) => data.pagination?.totalPages || 1)
              ),
            });
          }
        )
        .catch((error) => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    } else {
      // Existing fetch logic for other tables
      fetchData(selectedTable, groupType, {
        selectedMunicipio,
        territorioDeDesenvolvimentoMunicipio,
        faixaPopulacionalMunicipio,
        aglomeradoMunicipio,
        gerenciaRegionalMunicipio,
        page: this.state.page,
        limit: this.state.limit,
      })
        .then((data) => {
          this.setState({
            apiData: data,
            loading: false,
            totalPages: data.pagination?.totalPages || 1,
          });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        });
    }
  };

  handleTableChange = (event) => {
    this.setState(
      { selectedTable: event.target.value, loading: true, apiData: null },
      this.fetchTableData
    );
  };

  handleGroupTypeChange = (event) => {
    this.setState(
      { groupType: event.target.value, loading: true, apiData: null },
      this.fetchTableData
    );
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        selectedMunicipio: filters.selectedMunicipio,
        territorioDeDesenvolvimentoMunicipio:
          filters.territorioDeDesenvolvimentoMunicipio,
        faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
        aglomeradoMunicipio: filters.aglomeradoMunicipio,
        gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
        loading: true,
        hasInitialLoad: true, // Marca que já fez o primeiro carregamento
      },
      this.fetchTableData
    );
  };

  handlePageChange = (event, newPage) => {
    this.setState(
      {
        page: newPage,
        loading: true,
      },
      this.fetchTableData
    );
  };

  handleLimitChange = (event) => {
    this.setState(
      {
        limit: parseInt(event.target.value),
        page: 1,
        loading: true,
      },
      this.fetchTableData
    );
  };

  render() {
    const { apiData, loading, error, selectedTable, groupType } = this.state;

    // Remover o loading que esconde toda a tela
    // if (loading && this.state.hasInitialLoad) {
    //   return (
    //     <div className="loading-container">
    //       <div className="loading-spinner"></div>
    //     </div>
    //   );
    // }

    // Remover o tratamento de erro que esconde toda a tela
    // if (error) {
    //   return <div>Error: {error}</div>;
    // }

    return (
      <div>
        <div className="app-container">
          <div className="filters-section">
            <div className="selects-wrapper">
              <div className="select-container">
                <label htmlFor="tableSelect" className="select-label">
                  Selecione o indicador:
                </label>
                <select
                  id="tableSelect"
                  value={selectedTable}
                  onChange={this.handleTableChange}
                  className="select-box"
                >
                  <option value="constitutionalLimitMde">
                    Percentual aplicado em MDE
                  </option>
                  <option value="expensesBasicEducationFundeb">
                    Percentual do fundeb nos profissionais de educação básica
                  </option>
                  <option value="revenueComposition">
                    Composição das Receitas Impostos e Transferências
                    Constitucionais e Legais [%]
                  </option>
                  <option value="financingCapacity">
                    Capacidade de Financiamento
                  </option>
                  <option value="rpebComposition">
                    Composição da Receita Potencial da Educação Básica [%]
                  </option>
                  <option value="resourcesApplicationControl">
                    Controle da Aplicação de Recursos
                  </option>
                  <option value="educationExpenseComposition">
                    Composição das Despesas em Educação [%]
                  </option>
                </select>
              </div>

              <div className="select-container">
                <label htmlFor="groupTypeSelect" className="select-label">
                  Tipo de Agrupamento:
                </label>
                <select
                  id="groupTypeSelect"
                  value={groupType}
                  onChange={this.handleGroupTypeChange}
                  className="select-box"
                >
                  <option value="municipio">Município</option>
                  <option value="ano">Ano</option>
                </select>
              </div>
            </div>

            <FilterComponent
              onFilterChange={this.handleFilterChange}
              selectedMunicipio={this.state.selectedMunicipio}
              territorioDeDesenvolvimentoMunicipio={
                this.state.territorioDeDesenvolvimentoMunicipio
              }
              faixaPopulacionalMunicipio={this.state.faixaPopulacionalMunicipio}
              aglomeradoMunicipio={this.state.aglomeradoMunicipio}
              gerenciaRegionalMunicipio={this.state.gerenciaRegionalMunicipio}
            />
          </div>

          <hr className="divider" />

          {/* Área de dados - sempre visível */}
          <div className="data-section">
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            )}

            {!loading && error && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#d9534f',
                fontSize: '18px'
              }}>
                <p>Falha ao carregar os dados. Por favor, tente novamente mais tarde.</p>
              </div>
            )}

            {!loading && !error && !apiData && !this.state.hasInitialLoad && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#666',
                fontSize: '18px'
              }}>
                <p>Selecione os filtros desejados e clique em "Filtrar" para carregar os dados.</p>
              </div>
            )}

            {!loading && !error && !apiData && this.state.hasInitialLoad && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#d9534f',
                fontSize: '18px'
              }}>
                <p>Nenhum dado encontrado com os filtros selecionados.</p>
              </div>
            )}

            {!loading && !error && apiData && (
              <>
                {selectedTable === "expensesBasicEducationFundeb" && (
                  <ChartComponent
                    key={selectedTable + JSON.stringify(apiData)}
                    indicatorType={selectedTable}
                    processDataFunction={processBasicEducationData}
                    title="% do Fundeb nos profissionais de educação básica"
                    data={apiData}
                  />
                )}

                {selectedTable === "constitutionalLimitMde" && (
                  <ChartComponent
                    key={selectedTable + JSON.stringify(apiData)}
                    indicatorType={selectedTable}
                    processDataFunction={processMDEData}
                    title="% Aplicado em MDE por Município"
                    data={apiData}
                  />
                )}

                {selectedTable === "revenueComposition" && (
                  <RevenueCompositionCharts data={apiData} />
                )}

                {selectedTable === "financingCapacity" && (
                  <FinancingCapacityCharts data={apiData} />
                )}

                {selectedTable === "resourcesApplicationControl" && (
                  <ResourcesApplicationControlCharts data={apiData} />
                )}

                {selectedTable === "rpebComposition" && (
                  <RpebCompositionCharts data={apiData} />
                )}

                {selectedTable === "educationExpenseComposition" && (
                  <EducationExpenseCompositionCharts data={apiData} />
                )}

                <CustomPagination
                  page={this.state.page}
                  totalPages={this.state.totalPages}
                  limit={this.state.limit}
                  onPageChange={this.handlePageChange}
                  onLimitChange={this.handleLimitChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
