import React, { Component } from 'react';
import RevenueTable from './components/RevenueTable';
import { transformDataForTableRevenues } from './dataTransformingUtils';
import { mapAdditionalMunicipalEducationRevenue, mapMunicipalTaxesRevenues, mapOwnRevenues, standardizeTypeAdditionalEducationRevenues, standardizeTypeMunicipalTaxesRevenues, standardizeTypeOwnRevenues } from './tablesMapping';

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
      municipalTaxesRevenues: 'http://localhost:3003/researches/mt-revenue',
      additionalEducationRevenue: 'http://localhost:3003/researches/addtional-education-revenue'
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
          <h2>Selecione a tabela:</h2>
          <select value={selectedTable} onChange={this.handleTableChange}>
            <option value="ownRevenues">Impostos Próprios</option>
            <option value="municipalTaxesRevenues">Receita Líquida de Impostos do Município</option>
            <option value="additionalEducationRevenue">Receitas adicionais da educação no Município</option>
            {/* Adicione outras opções de tabela conforme necessário */}
          </select>
        </div>
        {apiData && (
          <div>
            {Object.keys(apiData).map((municipio) => (
              <div key={municipio}>
                <h2>Município: {municipio}</h2>
                {selectedTable === 'ownRevenues' && (
                  <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizeTypeOwnRevenues} tableMapping={mapOwnRevenues} />
                )}
                {selectedTable === 'municipalTaxesRevenues' && (
                  <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues} tableMapping={mapMunicipalTaxesRevenues}/>
                )}
                {selectedTable === 'additionalEducationRevenue' && (
                  <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues} tableMapping={mapAdditionalMunicipalEducationRevenue}/>
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
