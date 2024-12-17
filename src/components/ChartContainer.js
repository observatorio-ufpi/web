import React, { Component } from 'react';
import '../App.css';
import { fetchData } from '../services/apiService';
import '../style/ChartPagination.css';
import { processBasicEducationData, processMDEData } from '../utils/processDataCharts';
import ChartComponent from './ChartComponent';
import FilterComponent from './TableFilters';
import CustomPagination from './CustomPagination';

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
      groupType: 'municipio',
      page: 1,
      limit: 5,
      totalPages: 1
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
      gerenciaRegionalMunicipio,
      page: this.state.page,
      limit: this.state.limit
    })
    .then(data => {
      this.setState({ apiData: data, loading: false,  totalPages: data.pagination?.totalPages || 1 });
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

  handlePageChange = (event, newPage) => {
    this.setState({
      page: newPage,
      loading: true
    }, this.fetchTableData);
  };

  handleLimitChange = (event) => {
    this.setState({
      limit: parseInt(event.target.value),
      page: 1,
      loading: true
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
            <div className="filters-section">
              <div className="selects-wrapper">
                <div className="select-container">
                  <label htmlFor="tableSelect" className="select-label">Selecione o indicador:</label>
                  <select
                    id="tableSelect"
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
                territorioDeDesenvolvimentoMunicipio={this.state.territorioDeDesenvolvimentoMunicipio}
                faixaPopulacionalMunicipio={this.state.faixaPopulacionalMunicipio}
                aglomeradoMunicipio={this.state.aglomeradoMunicipio}
                gerenciaRegionalMunicipio={this.state.gerenciaRegionalMunicipio}
              />
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
      );
  }
}

export default App;
