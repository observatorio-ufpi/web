import React, { Component } from 'react';
import RevenueTable from './components/RevenueTable';
import { transformDataForTableRevenues } from './dataTransformingUtils';
import { mapAdditionalMunicipalEducationRevenue, mapAreasActivityExpense, mapBasicEducationMinimalPotential, mapComplementationFundebFundef, mapConstitutionalLimitMde, mapConstitutionalTransfersRevenue, mapExpensesBasicEducationFundeb, mapMunicipalFundebFundefComposition, mapMunicipalTaxesRevenues, mapOwnRevenues, standardizeTypeAdditionalEducationRevenues, standardizeTypeMunicipalTaxesRevenues, standardizeTypeOwnRevenues, standardizedTypeAreasActivityExpense, standardizedTypeBasicEducationMinimalPotential, standardizedTypeComplementationFundebFundef, standardizedTypeConstitutionalLimitMde, standardizedTypeConstitutionalTransfersRevenue, standardizedTypeExpensesBasicEducationFundeb, standardizedTypeMunicipalFundebFundefComposition } from './tablesMapping';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      loading: true,
      error: null,
      selectedTable: 'ownRevenues' // Valor inicial para Impostos Próprios
    };
  }

  componentDidMount() {
    this.fetchData(this.state.selectedTable);
  }

  fetchData = (table) => {
    const endpoints = {
      ownRevenues: 'http://localhost:3003/researches/mot-revenue',
      constitutionalTransfersRevenue: 'http://localhost:3003/researches/ct-revenue',
      municipalTaxesRevenues: 'http://localhost:3003/researches/mt-revenue',
      additionalEducationRevenue: 'http://localhost:3003/researches/addtional-education-revenue',
      municipalFundebFundefComposition: 'http://localhost:3003/researches/mfc-revenue',
      complementationFundebFundef: 'http://localhost:3003/researches/cf-revenue',
      areasActivityExpense: 'http://localhost:3003/researches/areas-activity-expense',
      basicEducationMinimalPotential: 'http://localhost:3003/researches/basic-education-minimal-potential-revenue',
      constitutionalLimitMde: 'http://localhost:3003/researches/mc-limit-revenue',
      expensesBasicEducationFundeb: 'http://localhost:3003/researches/basic-education-expense',
      // Adicione outros endpoints conforme necessário
    };

    const endpoint = endpoints[table];

    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          apiData: data,
          loading: false,
          selectedTable: table
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false
        });
      });
  }

  handleTableChange = (event) => {
    const selectedTable = event.target.value;
    this.setState({ loading: true, apiData: null }); // Reinicia o estado de carregamento
    this.fetchData(selectedTable);
  }

  render() {
    const { apiData, loading, error, selectedTable } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <div>
          <select value={selectedTable} onChange={this.handleTableChange}>
            <option value="ownRevenues">Impostos Próprios</option>
            <option value="constitutionalTransfersRevenue">Receita de transferências constitucionais e legais</option>
            <option value="municipalTaxesRevenues">Receita Líquida de Impostos do Município</option>
            <option value="additionalEducationRevenue">Receitas adicionais da educação no Município</option>
            <option value="municipalFundebFundefComposition">Composição do Fundef/Fundeb no município</option>
            <option value="complementationFundebFundef">Composição da complementação do Fundef/Fundeb</option>
            <option value="constitutionalLimitMde">Limite constitucional em MDE no município </option>
            <option value="expensesBasicEducationFundeb">Despesas com profissionais da educação básica com o Fundef/Fundeb</option>
            <option value="areasActivityExpense">Despesas em MDE por área de atuação</option>
            <option value="basicEducationMinimalPotential">Receita Potencial Mínima vinculada à Educação Básica</option>
            {/* Adicione outras opções de tabela conforme necessário */}
          </select>
        </div>
        {apiData && (
          <div>
            {Object.keys(apiData).map((municipio) => (
              <div key={municipio}>
                <h2>Município: {municipio}</h2>
                {selectedTable === 'ownRevenues' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizeTypeOwnRevenues}
                    tableMapping={mapOwnRevenues}
                    tableName="Impostos_Proprios"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'constitutionalTransfersRevenue' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue}
                    tableMapping={mapConstitutionalTransfersRevenue}
                    tableName="Receita_de_Transferencias_Constitucionais_e_Legais"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'municipalTaxesRevenues' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues}
                    tableMapping={mapMunicipalTaxesRevenues}
                    tableName="Receita_Liquida_de_Impostos_do_Municipio"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'municipalFundebFundefComposition' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition}
                    tableMapping={mapMunicipalFundebFundefComposition}
                    tableName="Composicao_do_Fundef-Fundeb_no_Município"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'additionalEducationRevenue' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues}
                    tableMapping={mapAdditionalMunicipalEducationRevenue}
                    tableName="Receitas_Adicionais_da_Educacao_no_Municipio"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'complementationFundebFundef' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeComplementationFundebFundef}
                    tableMapping={mapComplementationFundebFundef}
                    tableName="Composicao_da_Complementacao_do_Fundef-Fundeb"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'constitutionalLimitMde' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeConstitutionalLimitMde}
                    tableMapping={mapConstitutionalLimitMde}
                    tableName="Limite_Constitucional_em_MDE_no_Municipio"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'expensesBasicEducationFundeb' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb}
                    tableMapping={mapExpensesBasicEducationFundeb}
                    tableName="Despesas_com_Profissionais_da_Educacao_Basica_com_o_Fundef-Fundeb"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'areasActivityExpense' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeAreasActivityExpense}
                    tableMapping={mapAreasActivityExpense}
                    tableName="Despesas_em_MDE_por_Area_de_Atuacao"
                    municipio={municipio}
                  />
                )}
                {selectedTable === 'basicEducationMinimalPotential' && (
                  <RevenueTable
                    data={apiData[municipio]}
                    transformDataFunction={transformDataForTableRevenues}
                    standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential}
                    tableMapping={mapBasicEducationMinimalPotential}
                    tableName="Receita_Potencial_Minima_Vinculada_a_Educacao_Basica"
                    municipio={municipio}
                  />
                )}
                {/* Adicione outras condições para diferentes tabelas conforme necessário */}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;
