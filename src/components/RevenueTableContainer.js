import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import '../App.css';
import { fetchData } from '../services/apiService';
import '../style/RevenueTableContainer.css';
import { transformDataForTableByYear, transformDataForTableRevenues } from '../utils/dataTransformingUtils';
import { municipios } from '../utils/municipios.mapping';
import {
  mapAdditionalMunicipalEducationRevenue, mapAllTables, mapAreasActivityExpense, mapBasicEducationMinimalPotential,
  mapComplementaryProtocol,
  mapComplementationFundebFundef, mapConstitutionalLimitMde, mapConstitutionalTransfersRevenue,
  mapExpensesBasicEducationFundeb, mapMunicipalFundebFundefComposition, mapMunicipalTaxesRevenues,
  mapOwnRevenues, standardizeTypeAdditionalEducationRevenues, standardizeTypeMunicipalTaxesRevenues,
  standardizedTypeAllTables, standardizedTypeAreasActivityExpense, standardizedTypeBasicEducationMinimalPotential,
  standardizedTypeComplementaryProtocol,
  standardizedTypeComplementationFundebFundef, standardizedTypeConstitutionalLimitMde,
  standardizedTypeConstitutionalTransfersRevenue, standardizedTypeExpensesBasicEducationFundeb,
  standardizedTypeMunicipalFundebFundefComposition,
  standardizedTypeOwnRevenues
} from '../utils/tablesMapping';
import RevenueTable from './RevenueTable';
import FilterComponent from './TableFilters';
import CustomPagination from './CustomPagination';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      loading: true,
      error: null,
      selectedTable: 'ownRevenues',
      selectedMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: '',
      gerenciaRegionalMunicipio: '',
      groupType: 'municipio',
      page: 1,
      limit: 1,
      totalPages: 1
    };
  }

  componentDidMount() {
    this.fetchTableData();
  }

  handlePageChange = (event, newPage) => {
    this.setState({
      page: newPage,
      loading: true
    }, () => {
      this.fetchTableData();
    });
  };

  handleLimitChange = (event) => {
    this.setState({
      limit: parseInt(event.target.value),
      page: 1,
      loading: true
    }, () => {
      this.fetchTableData();
    });
  };

  fetchTableData = () => {
    const {
      selectedTable,
      groupType,
      selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      page,
      limit
    } = this.state;

    fetchData(selectedTable, groupType, {
      selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      page,
      limit
    })
    .then(response => {
      this.setState({
        apiData: response.data,
        loading: false,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages || 1
      });
    })
    .catch(error => {
      console.error(error);
      this.setState({
        error: error.message,
        loading: false,
        totalPages: 1
      });
    });
  };

  handleTableChange = (event) => {
    this.setState({ selectedTable: event.target.value, loading: true, apiData: null }, this.fetchTableData);
  };

  handleFilterChange = (filters) => {
    this.setState({
      selectedMunicipio: filters.selectedMunicipio,
      territorioDeDesenvolvimentoMunicipio: filters.territorioDeDesenvolvimentoMunicipio,
      faixaPopulacionalMunicipio: filters.faixaPopulacionalMunicipio,
      aglomeradoMunicipio: filters.aglomeradoMunicipio,
      gerenciaRegionalMunicipio: filters.gerenciaRegionalMunicipio,
      loading: true,
      page: 1
    }, () => {
      this.fetchTableData();
    });
  };

  handleGroupTypeChange = (event) => {
    this.setState({ groupType: event.target.value, loading: true, apiData: null }, this.fetchTableData);
  };

  downloadAllTables = () => {
    const { apiData, selectedTable, selectedKey } = this.state;

    const tableMappings = {
      ownRevenues: { transform: transformDataForTableByYear, standardize: standardizedTypeOwnRevenues, map: mapOwnRevenues, name: 'Impostos_Proprios' },
      constitutionalTransfersRevenue: { transform: transformDataForTableByYear, standardize: standardizedTypeConstitutionalTransfersRevenue, map: mapConstitutionalTransfersRevenue, name: 'Receita_Transferencias_Constitucionais_Legais' },
      municipalTaxesRevenues: { transform: transformDataForTableByYear, standardize: standardizeTypeMunicipalTaxesRevenues, map: mapMunicipalTaxesRevenues, name: 'Receita_Liquida_Impostos_Municipio' },
      additionalEducationRevenue: { transform: transformDataForTableByYear, standardize: standardizeTypeAdditionalEducationRevenues, map: mapAdditionalMunicipalEducationRevenue, name: 'Receitas_Adicionais_Educacao_Municipio' },
      municipalFundebFundefComposition: { transform: transformDataForTableByYear, standardize: standardizedTypeMunicipalFundebFundefComposition, map: mapMunicipalFundebFundefComposition, name: 'Composicao_Fundef_Fundeb_Municipio' },
      complementationFundebFundef: { transform: transformDataForTableByYear, standardize: standardizedTypeComplementationFundebFundef, map: mapComplementationFundebFundef, name: 'Composicao_Complementacao_Fundef_Fundeb' },
      areasActivityExpense: { transform: transformDataForTableByYear, standardize: standardizedTypeAreasActivityExpense, map: mapAreasActivityExpense, name: 'Despesas_MDE_Area_Atuacao' },
      basicEducationMinimalPotential: { transform: transformDataForTableByYear, standardize: standardizedTypeBasicEducationMinimalPotential, map: mapBasicEducationMinimalPotential, name: 'Receita_Potencial_Minima_Educacao_Basica' },
      constitutionalLimitMde: { transform: transformDataForTableByYear, standardize: standardizedTypeConstitutionalLimitMde, map: mapConstitutionalLimitMde, name: 'Limite_Constitucional_MDE_Municipio' },
      expensesBasicEducationFundeb: { transform: transformDataForTableByYear, standardize: standardizedTypeExpensesBasicEducationFundeb, map: mapExpensesBasicEducationFundeb, name: 'Despesas_Profissionais_Educacao_Basica_Fundef_Fundeb' },
      complementaryProtocol: { transform: transformDataForTableByYear, standardize: standardizedTypeComplementaryProtocol, map: mapComplementaryProtocol, name: 'Protocolo_Complementar' },
      allTables: { transform: transformDataForTableByYear, standardize: standardizedTypeAllTables, map: mapAllTables, name: 'Tabelao_RREO' }
    };

    const { transform, standardize, map, name } = tableMappings[selectedTable];
    const zip = new JSZip();

    if (this.state.groupType === 'municipio') {
      const selectedMunicipioName = selectedKey?.label || 'Todos_Municipios';
      const selectedMunicipioData = selectedKey ? { [selectedKey.value]: apiData[selectedKey.value] } : apiData;


      Object.keys(selectedMunicipioData).forEach(municipio => {
        const { rows, typeToRowToValue } = transform(selectedMunicipioData[municipio], standardize);
        const types = Object.keys(map);

        console.log(rows)

        const wsData = [
          ['Ano', ...types],
          ...rows.map((row) => [
            row,
            ...types.map((type) => typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined ? typeToRowToValue[type][row] : '-')
          ]),
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Receitas');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        zip.file(`${name}_${ municipios[municipio]?.nomeMunicipio}.xlsx`, excelBuffer);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${name}_${selectedMunicipioName}_tabelas_municipios.zip`);
      });
    } else if (this.state.groupType === 'ano') {
      const selectedYearName = selectedKey?.label || 'Todos_Anos';
      const selectedYearData = selectedKey ? { [selectedKey.value]: apiData[selectedKey.value] } : apiData;


      Object.keys(selectedYearData).forEach(year => {
        const { rows, typeToRowToValue } = transform(selectedYearData[year], standardize);
        const types = Object.keys(map);

        console.log(rows)

        const wsData = [
          ['Municipio', ...types],
          ...rows.map((row) => [
            municipios[row]?.nomeMunicipio,
            ...types.map((type) => typeToRowToValue[type] && typeToRowToValue[type][row] !== undefined ? typeToRowToValue[type][row] : '-')
          ]),
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Receitas');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        zip.file(`${name}_${year}.xlsx`, excelBuffer);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${name}_${selectedYearName}_tabelas_municipios.zip`);
      });
    }
  }

  render() {
    const { apiData, loading, error, selectedTable, groupType, page, limit, totalPages } = this.state;

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
        <div className='app-container'>
          <div className="filters-section">
            <div className="selects-wrapper">
              <div className="select-container">
                <label htmlFor="tableSelect" className="select-label">Tipo de Imposto:</label>
                <select id="tableSelect" value={selectedTable} onChange={this.handleTableChange} className="select-box">
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
                  <option value="complementaryProtocol">Protocolo Complementar</option>
                </select>
              </div>

              <div className="select-container">
                <label htmlFor="groupTypeSelect" className="select-label">Tipo de Agrupamento:</label>
                <select id="groupTypeSelect" value={groupType} onChange={this.handleGroupTypeChange} className="select-box">
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
            <div className='table-container'>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="info" onClick={this.downloadAllTables} sx={{ marginTop: 2 }}>
                  Baixar Todas as Tabelas
                </Button>
              </div>
              {selectedTable === 'allTables' ?   Object.keys(apiData).map(revenueType => (
                 Object.keys(apiData[revenueType]).map(key => (
                  <div key={key}>
                     {selectedTable === 'allTables' && (
                      <RevenueTable data={apiData[revenueType][key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear} standardizeTypeFunction={standardizedTypeAllTables} tableMapping={mapAllTables} tableName="Tabelão" keyTable={key} groupType={groupType}/>
                    )}
                  </div>
                ))
            )) : Object.keys(apiData).map((key) => (
              <div key={key}>
                <div className="table-header">
                  <h2>
                    <span className="table-header-label">
                      {groupType === 'municipio' ? 'Município: ' : 'Ano: '}
                    </span>
                    {groupType === 'municipio' ? municipios[key]?.nomeMunicipio : key}
                  </h2>
                </div>
                {selectedTable === 'ownRevenues' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear} standardizeTypeFunction={standardizedTypeOwnRevenues} tableMapping={mapOwnRevenues} tableName="Impostos Próprios" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'constitutionalTransfersRevenue' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeConstitutionalTransfersRevenue} tableMapping={mapConstitutionalTransfersRevenue} tableName="Receita de transferências constitucionais e legais" keyTable={key} groupType={groupType} />
                  </div>
                )}
                {selectedTable === 'municipalTaxesRevenues' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizeTypeMunicipalTaxesRevenues} tableMapping={mapMunicipalTaxesRevenues} tableName="Receita Líquida de Impostos do Município" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'additionalEducationRevenue' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizeTypeAdditionalEducationRevenues} tableMapping={mapAdditionalMunicipalEducationRevenue} tableName="Receitas adicionais da educação no Município" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'municipalFundebFundefComposition' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeMunicipalFundebFundefComposition} tableMapping={mapMunicipalFundebFundefComposition} tableName="Composição do Fundef/Fundeb no município" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'complementationFundebFundef' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeComplementationFundebFundef} tableMapping={mapComplementationFundebFundef} tableName="Composição da complementação do Fundef/Fundeb" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'constitutionalLimitMde' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeConstitutionalLimitMde} tableMapping={mapConstitutionalLimitMde} tableName="Limite constitucional em MDE no município" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'expensesBasicEducationFundeb' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeExpensesBasicEducationFundeb} tableMapping={mapExpensesBasicEducationFundeb} tableName="Despesas com profissionais da educação básica com o Fundef/Fundeb" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'areasActivityExpense' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]}transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeAreasActivityExpense} tableMapping={mapAreasActivityExpense} tableName="Despesas em MDE por área de atuação" keyTable={key}  groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'basicEducationMinimalPotential' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeBasicEducationMinimalPotential} tableMapping={mapBasicEducationMinimalPotential} tableName="Receita Potencial Mínima vinculada à Educação Básica" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {selectedTable === 'complementaryProtocol' && (
                  <div style={{ marginTop: '1rem' }}>
                    <RevenueTable data={apiData[key]} transformDataFunction={groupType === "municipio" ?  transformDataForTableRevenues : transformDataForTableByYear}  standardizeTypeFunction={standardizedTypeComplementaryProtocol} tableMapping={mapComplementaryProtocol} tableName="Protocolo Complementar" keyTable={key} groupType={groupType}/>
                  </div>
                )}
                {/* Adicione outros mapeamentos de tabelas conforme necessário */}
              </div>
            ))}

            <CustomPagination
              page={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={this.handlePageChange}
              onLimitChange={this.handleLimitChange}
            />

            </div>
          )}
          </div>
      </div>
    );
  }
}

export default App;
