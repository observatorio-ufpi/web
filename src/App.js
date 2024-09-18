import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import Header from './components/Header';
import RevenueTable from './components/RevenueTable';
import FilterComponent from './components/TableFilters';
import { transformDataForTableByYear, transformDataForTableRevenues } from './dataTransformingUtils';
import { municipios } from './municipios.mapping';
import {
  mapAdditionalMunicipalEducationRevenue, mapAllTables, mapAreasActivityExpense, mapBasicEducationMinimalPotential,
  mapComplementationFundebFundef, mapConstitutionalLimitMde, mapConstitutionalTransfersRevenue,
  mapExpensesBasicEducationFundeb, mapMunicipalFundebFundefComposition, mapMunicipalTaxesRevenues,
  mapOwnRevenues, standardizeTypeAdditionalEducationRevenues, standardizeTypeMunicipalTaxesRevenues,
  standardizedTypeAllTables, standardizedTypeAreasActivityExpense, standardizedTypeBasicEducationMinimalPotential,
  standardizedTypeComplementationFundebFundef, standardizedTypeConstitutionalLimitMde,
  standardizedTypeConstitutionalTransfersRevenue, standardizedTypeExpensesBasicEducationFundeb,
  standardizedTypeMunicipalFundebFundefComposition,
  standardizedTypeOwnRevenues
} from './tablesMapping';

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
      gerenciRegionalMunicipio: '',
      groupType: 'municipio'
    };
  }

  componentDidMount() {
    this.fetchData(this.state.selectedTable, this.state.selectedMunicipio);
  }

  fetchData = (table, groupType = 'municipio') => {
    const { selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaRegionalMunicipio } = this.state;
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
      allTables: 'http://localhost:3003/researches/all-revenues-expenses'
    };

    let endpoint = endpoints[table] + '/' + groupType;

    const params = new URLSearchParams();
    if (selectedMunicipio) params.append('nomeMunicipio', selectedMunicipio);
    if (territorioDeDesenvolvimentoMunicipio) params.append('territorioDeDesenvolvimentoMunicipio', territorioDeDesenvolvimentoMunicipio);
    if (faixaPopulacionalMunicipio) params.append('faixaPopulacionalMunicipio', faixaPopulacionalMunicipio);
    if (aglomeradoMunicipio) params.append('aglomeradoMunicipio', aglomeradoMunicipio);
    if (gerenciaRegionalMunicipio) params.append('gerenciaMunicipio', gerenciaRegionalMunicipio);

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

  handleGroupTypeChange = (event) => {
    const groupType = event.target.value;
    this.setState({ groupType, loading: true, apiData: null });
    this.fetchData(this.state.selectedTable, groupType);
  }

  downloadAllTables = () => {
    const { apiData, selectedTable, selectedMunicipio } = this.state;

    const tableMappings = {
      ownRevenues: { transform: transformDataForTableByYear, standardize: standardizedTypeOwnRevenues, map: mapOwnRevenues, name: 'Impostos_Proprios' },
      constitutionalTransfersRevenue: { transform: transformDataForTableRevenues, standardize: standardizedTypeConstitutionalTransfersRevenue, map: mapConstitutionalTransfersRevenue, name: 'Receita_Transferencias_Constitucionais_Legais' },
      municipalTaxesRevenues: { transform: transformDataForTableRevenues, standardize: standardizeTypeMunicipalTaxesRevenues, map: mapMunicipalTaxesRevenues, name: 'Receita_Liquida_Impostos_Municipio' },
      additionalEducationRevenue: { transform: transformDataForTableRevenues, standardize: standardizeTypeAdditionalEducationRevenues, map: mapAdditionalMunicipalEducationRevenue, name: 'Receitas_Adicionais_Educacao_Municipio' },
      municipalFundebFundefComposition: { transform: transformDataForTableRevenues, standardize: standardizedTypeMunicipalFundebFundefComposition, map: mapMunicipalFundebFundefComposition, name: 'Composicao_Fundef_Fundeb_Municipio' },
      complementationFundebFundef: { transform: transformDataForTableRevenues, standardize: standardizedTypeComplementationFundebFundef, map: mapComplementationFundebFundef, name: 'Composicao_Complementacao_Fundef_Fundeb' },
      areasActivityExpense: { transform: transformDataForTableRevenues, standardize: standardizedTypeAreasActivityExpense, map: mapAreasActivityExpense, name: 'Despesas_MDE_Area_Atuacao' },
      basicEducationMinimalPotential: { transform: transformDataForTableRevenues, standardize: standardizedTypeBasicEducationMinimalPotential, map: mapBasicEducationMinimalPotential, name: 'Receita_Potencial_Minima_Educacao_Basica' },
      constitutionalLimitMde: { transform: transformDataForTableRevenues, standardize: standardizedTypeConstitutionalLimitMde, map: mapConstitutionalLimitMde, name: 'Limite_Constitucional_MDE_Municipio' },
      expensesBasicEducationFundeb: { transform: transformDataForTableRevenues, standardize: standardizedTypeExpensesBasicEducationFundeb, map: mapExpensesBasicEducationFundeb, name: 'Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb' },
      allTables: { transform: transformDataForTableByYear, standardize: standardizedTypeAllTables, map: mapAllTables, name: 'Tabelao_RREO' }
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
              <option value="allTables">Tabelão</option>
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
            <div className='table-container'>
              <Button variant="contained" color="primary" onClick={this.downloadAllTables} sx={{ marginTop: 2 }}>
                Baixar Todas as Tabelas
              </Button>
              {selectedTable === 'allTables' ?   Object.keys(apiData).map(revenueType => (
                 Object.keys(apiData[revenueType]).map(key => (
                  <div key={key}>
                    {console.log(apiData[revenueType][key])}
                     {selectedTable === 'allTables' && (
                      <RevenueTable data={apiData[revenueType][key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear} standardizeTypeFunction={standardizedTypeAllTables} tableMapping={mapAllTables} tableName="Tabelão" keyTable={key} groupType={groupType}/>
                    )}
                  </div>
                ))
            )) : Object.keys(apiData).map((key) => (
              <div key={key}>
                <h2>{groupType==='municipio'? `Município: ${municipios[key]?.nomeMunicipio}` : `Ano: ${key}`}</h2>
                {console.log(key)}
                {selectedTable === 'ownRevenues' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear} standardizeTypeFunction={standardizedTypeOwnRevenues} tableMapping={mapOwnRevenues} tableName="Impostos Próprios" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'constitutionalTransfersRevenue' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue} tableMapping={mapConstitutionalTransfersRevenue} tableName="Receita de transferências constitucionais e legais" keTable={key} groupType={groupType} />
                )}
                {selectedTable === 'municipalTaxesRevenues' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues} tableMapping={mapMunicipalTaxesRevenues} tableName="Receita Líquida de Impostos do Município" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'additionalEducationRevenue' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues} tableMapping={mapAdditionalMunicipalEducationRevenue} tableName="Receitas adicionais da educação no Município" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'municipalFundebFundefComposition' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition} tableMapping={mapMunicipalFundebFundefComposition} tableName="Composição do Fundef/Fundeb no município" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'complementationFundebFundef' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeComplementationFundebFundef} tableMapping={mapComplementationFundebFundef} tableName="Composição da complementação do Fundef/Fundeb" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'constitutionalLimitMde' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeConstitutionalLimitMde} tableMapping={mapConstitutionalLimitMde} tableName="Limite constitucional em MDE no município" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'expensesBasicEducationFundeb' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb} tableMapping={mapExpensesBasicEducationFundeb} tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb" keyTable={key} groupType={groupType}/>
                )}
                {selectedTable === 'areasActivityExpense' && (
                  <RevenueTable data={apiData[key]}transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeAreasActivityExpense} tableMapping={mapAreasActivityExpense} tableName="Despesas em MDE por área de atuação" keyTable={key}  groupType={groupType}/>
                )}
                {selectedTable === 'basicEducationMinimalPotential' && (
                  <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential} tableMapping={mapBasicEducationMinimalPotential} tableName="Receita Potencial Mínima vinculada à Educação Básica" keyTable={key} groupType={groupType}/>
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
