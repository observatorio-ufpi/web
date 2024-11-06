import React, { Component } from 'react';
import '../App.css';
import { fetchData } from '../services/apiService';
import { processBasicEducationData, processMDEData } from '../utils/processDataCharts';
import ChartComponent from './ChartComponent';
import FilterComponent from './TableFilters';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      loading: true,
      error: null,
      selectedTable: 'constitutionalLimitMde',
      selectedMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: '',
      gerenciaRegionalMunicipio: '',
      groupType: 'municipio'
    };
  }

  componentDidMount() {
    this.fetchTableData();
  }

  fetchTableData = () => {
    const { selectedTable, groupType, selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaRegionalMunicipio } = this.state;

    fetchData(selectedTable, groupType, {
      selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio
    })
    .then(data => {
      this.setState({ apiData: data, loading: false });
    })
    .catch(error => {
      console.log(error)
      this.setState({ error: error.message, loading: false });
    });
  };

  handleTableChange = (event) => {
    this.setState({ selectedTable: event.target.value, loading: true, apiData: null }, this.fetchTableData);
  };

  handleGroupTypeChange = (event) => {
    this.setState({ groupType: event.target.value, loading: true, apiData: null }, this.fetchTableData);
  };

  handleFilterChange = (filters) => {
    this.setState({
      selectedMunicipio: filters.selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
    }, this.fetchTableData);
  };


  render() {
    const { apiData, loading, error, selectedTable, groupType } = this.state;

    if (loading) {
      return(
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )
    }

    if (error) {
      return <div>Error: {error}</div>;
    }


    return (
        <div>
          <div className="app-container">

            <div className="select-container">
              <label htmlFor="tableSelect" className="select-label">Selecione o indicador:</label>
              <select
                value={selectedTable}
                onChange={this.handleTableChange}
                className="select-box"
              >
                <option value="constitutionalLimitMde">Percentual aplicado em MDE</option>
                <option value="expensesBasicEducationFundeb">Percentual do fundeb nos profissionais de educação básica</option>
              </select>
            </div>

            <div className="select-container">
                <label htmlFor="groupTypeSelect" className="select-label">Tipo de Agrupamento:</label>
                <select value={groupType} onChange={this.handleGroupTypeChange} className="select-box">
                <option value="municipio">Município</option>
                <option value="ano">Ano</option>
                </select>
            </div>

            <div className="filter-container">
              <FilterComponent onFilterChange={this.handleFilterChange} />
            </div>

            <hr className="divider" />

            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            )}

            {apiData && (
              <>
                {selectedTable === 'expensesBasicEducationFundeb' && (
                  <ChartComponent
                    key={selectedTable + JSON.stringify(apiData)}
                    indicatorType={selectedTable}
                    processDataFunction={processBasicEducationData}
                    title="% do Fundeb nos profissionais de educação básica"
                    data={apiData}
                  />
                )}

                {selectedTable === 'constitutionalLimitMde' && (
                  <ChartComponent
                    key={selectedTable + JSON.stringify(apiData)}
                    indicatorType={selectedTable}
                    processDataFunction={processMDEData}
                    title="% Aplicado em MDE por Município"
                    data={apiData}
                  />
                )}
              </>
            )}
          </div>
        </div>
      );
  }
}

export default App;
