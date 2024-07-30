import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import RevenueTable from './components/RevenueTable';
import FilterComponent from './components/TableFilters';
import { transformDataForTableRevenues } from './dataTransformingUtils';
import {
  mapAdditionalMunicipalEducationRevenue, mapAreasActivityExpense, mapBasicEducationMinimalPotential,
  mapComplementationFundebFundef, mapConstitutionalLimitMde, mapConstitutionalTransfersRevenue,
  mapExpensesBasicEducationFundeb, mapMunicipalFundebFundefComposition, mapMunicipalTaxesRevenues,
  mapOwnRevenues, standardizeTypeAdditionalEducationRevenues, standardizeTypeMunicipalTaxesRevenues,
  standardizeTypeOwnRevenues, standardizedTypeAreasActivityExpense, standardizedTypeBasicEducationMinimalPotential,
  standardizedTypeComplementationFundebFundef, standardizedTypeConstitutionalLimitMde,
  standardizedTypeConstitutionalTransfersRevenue, standardizedTypeExpensesBasicEducationFundeb,
  standardizedTypeMunicipalFundebFundefComposition
} from './tablesMapping';
import Header from './components/Header';
import { municipios } from './municipios.mapping'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      loading: true,
      error: null,
      selectedTable: 'ownRevenues', // Valor inicial para Impostos Próprios
      selectedMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: '',
      gerenciaMunicipio: ''
    };
  }

  componentDidMount() {
    this.fetchData(this.state.selectedTable, this.state.selectedMunicipio);
  }

  fetchData = (table) => {
    const { selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaMunicipio } = this.state;
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
    };

    let endpoint = endpoints[table];

    const params = new URLSearchParams();
    if (selectedMunicipio) params.append('nomeMunicipio', selectedMunicipio);
    if (territorioDeDesenvolvimentoMunicipio) params.append('territorioDeDesenvolvimentoMunicipio', territorioDeDesenvolvimentoMunicipio);
    if (faixaPopulacionalMunicipio) params.append('faixaPopulacionalMunicipio', faixaPopulacionalMunicipio);
    if (aglomeradoMunicipio) params.append('aglomeradoMunicipio', aglomeradoMunicipio);
    if (gerenciaMunicipio) params.append('gerenciaMunicipio', gerenciaMunicipio);

    const queryParams = params.toString();
    if (queryParams) {
      endpoint += `?${queryParams}`;
    }

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
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false
        });
      });
  };

  handleTableChange = (event) => {
    const selectedTable = event.target.value;
    this.setState({ selectedTable, loading: true, apiData: null });
    this.fetchData(selectedTable);
  }

  handleFilterChange = (filters) => {
    this.setState({
      selectedMunicipio: filters.selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaMunicipio: filters.gerenciaMunicipio,
      loading: filters.loading,
    }, () => {
      this.fetchData(this.state.selectedTable);
    });
  };

  downloadAllTables = () => {
    const { apiData, selectedTable, selectedMunicipio } = this.state;

    const tableMappings = {
      ownRevenues: { transform: transformDataForTableRevenues, standardize: standardizeTypeOwnRevenues, map: mapOwnRevenues, name: 'Impostos_Proprios' },
      constitutionalTransfersRevenue: { transform: transformDataForTableRevenues, standardize: standardizedTypeConstitutionalTransfersRevenue, map: mapConstitutionalTransfersRevenue, name: 'Receita_Transferencias_Constitucionais_Legais' },
      municipalTaxesRevenues: { transform: transformDataForTableRevenues, standardize: standardizeTypeMunicipalTaxesRevenues, map: mapMunicipalTaxesRevenues, name: 'Receita_Liquida_Impostos_Municipio' },
      additionalEducationRevenue: { transform: transformDataForTableRevenues, standardize: standardizeTypeAdditionalEducationRevenues, map: mapAdditionalMunicipalEducationRevenue, name: 'Receitas_Adicionais_Educacao_Municipio' },
      municipalFundebFundefComposition: { transform: transformDataForTableRevenues, standardize: standardizedTypeMunicipalFundebFundefComposition, map: mapMunicipalFundebFundefComposition, name: 'Composicao_Fundef_Fundeb_Municipio' },
      complementationFundebFundef: { transform: transformDataForTableRevenues, standardize: standardizedTypeComplementationFundebFundef, map: mapComplementationFundebFundef, name: 'Composicao_Complementacao_Fundef_Fundeb' },
      areasActivityExpense: { transform: transformDataForTableRevenues, standardize: standardizedTypeAreasActivityExpense, map: mapAreasActivityExpense, name: 'Despesas_MDE_Area_Atuacao' },
      basicEducationMinimalPotential: { transform: transformDataForTableRevenues, standardize: standardizedTypeBasicEducationMinimalPotential, map: mapBasicEducationMinimalPotential, name: 'Receita_Potencial_Minima_Educacao_Basica' },
      constitutionalLimitMde: { transform: transformDataForTableRevenues, standardize: standardizedTypeConstitutionalLimitMde, map: mapConstitutionalLimitMde, name: 'Limite_Constitucional_MDE_Municipio' },
      expensesBasicEducationFundeb: { transform: transformDataForTableRevenues, standardize: standardizedTypeExpensesBasicEducationFundeb, map: mapExpensesBasicEducationFundeb, name: 'Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb' },
    };

    const { transform, standardize, map, name } = tableMappings[selectedTable];
    const zip = new JSZip();

    const selectedMunicipioName = selectedMunicipio?.label || 'Todos_Municipios';
    const selectedMunicipioData = selectedMunicipio ? { [selectedMunicipio.value]: apiData[selectedMunicipio.value] } : apiData;

    Object.keys(selectedMunicipioData).forEach(municipio => {
      const { years, typeToYearToValue } = transform(selectedMunicipioData[municipio], standardize);
      const types = Object.keys(map);

      const wsData = [
        ['Ano', ...types],
        ...years.map((year) => [
          year,
          ...types.map((type) => typeToYearToValue[type] && typeToYearToValue[type][year] !== undefined ? typeToYearToValue[type][year] : '-')
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Receitas');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      zip.file(`${name}_${municipio}.xlsx`, excelBuffer);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${name}_${selectedMunicipioName}_tabelas_municipios.zip`);
    });
  }

  render() {
    const { apiData, loading, error, selectedTable } = this.state;

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
         <Header />
        <div className='app-container'>
          <div className="select-container">
          <label htmlFor="tableSelect" className="select-label">Tipo de Imposto:</label>
            <select value={selectedTable} onChange={this.handleTableChange} className="select-box">
              <option value="ownRevenues">Impostos Próprios</option>
              <option value="constitutionalTransfersRevenue">Receita de transferências constitucionais e legais</option>
              <option value="municipalTaxesRevenues">Receita Líquida de Impostos do Município</option>
              <option value="additionalEducationRevenue">Receitas adicionais da educação no Município</option>
              <option value="municipalFundebFundefComposition">Composição do Fundef/Fundeb no município</option>
              <option value="complementationFundebFundef">Composição da complementação do Fundef/Fundeb</option>
              <option value="constitutionalLimitMde">Limite constitucional em MDE no município</option>
              <option value="expensesBasicEducationFundeb">Despesas de profissionais da educação básica do Fundef/Fundeb</option>
              <option value="areasActivityExpense">Despesas em MDE por área de atuação</option>
              <option value="basicEducationMinimalPotential">Receita potencial mínima da educação básica</option>
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
            <div className='table-container'>
              <Button variant="contained" color="primary" onClick={this.downloadAllTables} sx={{ marginTop: 2 }}>
                Baixar Todas as Tabelas
              </Button>
              {Object.keys(apiData).map((municipio) => (
                <div key={municipio}>
                  <h2>Município: {municipios[municipio]?.nomeMunicipio}</h2>
                  {selectedTable === 'ownRevenues' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizeTypeOwnRevenues} tableMapping={mapOwnRevenues} tableName="Impostos Próprios" municipio={municipio} />
                  )}
                  {selectedTable === 'constitutionalTransfersRevenue' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue} tableMapping={mapConstitutionalTransfersRevenue} tableName="Receita de transferências constitucionais e legais" municipio={municipio} />
                  )}
                  {selectedTable === 'municipalTaxesRevenues' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues} tableMapping={mapMunicipalTaxesRevenues} tableName="Receita Líquida de Impostos do Município" municipio={municipio} />
                  )}
                  {selectedTable === 'additionalEducationRevenue' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues} tableMapping={mapAdditionalMunicipalEducationRevenue} tableName="Receitas adicionais da educação no Município" municipio={municipio} />
                  )}
                  {selectedTable === 'municipalFundebFundefComposition' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition} tableMapping={mapMunicipalFundebFundefComposition} tableName="Composição do Fundef/Fundeb no município" municipio={municipio} />
                  )}
                  {selectedTable === 'complementationFundebFundef' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeComplementationFundebFundef} tableMapping={mapComplementationFundebFundef} tableName="Composição da complementação do Fundef/Fundeb" municipio={municipio} />
                  )}
                  {selectedTable === 'constitutionalLimitMde' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeConstitutionalLimitMde} tableMapping={mapConstitutionalLimitMde} tableName="Limite constitucional em MDE no município" municipio={municipio} />
                  )}
                  {selectedTable === 'expensesBasicEducationFundeb' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb} tableMapping={mapExpensesBasicEducationFundeb} tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb" municipio={municipio} />
                  )}
                  {selectedTable === 'areasActivityExpense' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeAreasActivityExpense} tableMapping={mapAreasActivityExpense} tableName="Despesas em MDE por área de atuação" municipio={municipio} />
                  )}
                  {selectedTable === 'basicEducationMinimalPotential' && (
                    <RevenueTable data={apiData[municipio]} transformDataFunction={transformDataForTableRevenues} standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential} tableMapping={mapBasicEducationMinimalPotential} tableName="Receita Potencial Mínima vinculada à Educação Básica" municipio={municipio} />
                  )}
                  {/* Adicione outros mapeamentos de tabelas conforme necessário */}
                </div>
              ))}
            </div>
          )}
          </div>
      </div>
    );
  }
}

export default App;
