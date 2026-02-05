import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaGraduationCap, FaDollarSign, FaMapMarkedAlt, FaFileAlt } from 'react-icons/fa';
import { Select } from '../ui';
import { Card } from '../ui';
import { formatNumber, formatCurrency, ibgeService } from '../../services/ibgeService.jsx';
import { rateService } from '../../services/rateService.jsx';
import { Loading } from '../ui';
import { useIBGEData } from '../../hooks/useIBGEData.jsx';
import { municipios } from '../../utils/citiesMapping.jsx';
import '../../style/HomePage.css';

const Home = () => {
  const navigate = useNavigate();
  const { data: piauiData, loading, error, updateRateData } = useIBGEData();

  console.log('CI DEPLOYMENT TEST')
  
  // Estado para município selecionado e seus dados
  const [selectedMunicipality, setSelectedMunicipality] = useState('22'); // 22 = Piauí
  const [municipalityData, setMunicipalityData] = useState(null);
  const [municipalityLoading, setMunicipalityLoading] = useState(false);
  const [municipalityError, setMunicipalityError] = useState(null);

  // Lista de municípios para o select (incluindo o estado)
  const municipalitiesList = [
    { code: '22', name: 'Piauí (Estado)' },
    ...Object.entries(municipios).map(([code, data]) => ({
      code,
      name: data.nomeMunicipio
    }))
  ];

  // Função para buscar dados do município selecionado
  const fetchMunicipalityData = async (municipalityCode) => {
    console.log('fetchMunicipalityData chamada para:', municipalityCode);
    
    if (municipalityCode === '22') {
      setMunicipalityData(null);
      setMunicipalityError(null);
      setMunicipalityLoading(false);
      return;
    }

    setMunicipalityLoading(true);
    setMunicipalityError(null);

    try {
      // Buscar dados específicos do município (área, população, PIB)
      const [areaAndPopulation, pib] = await Promise.allSettled([
        ibgeService.getMunicipalityAreaAndPopulation(municipalityCode),
        ibgeService.getMunicipalityPIB(municipalityCode)
      ]);

      // Buscar dados de educação e taxas do município
      const [illiteracyRate, schoolingRate, higherEducationCompletionRate, basicEducationEnrollment, basicEducationSchools, higherEducationEnrollment, higherEducationInstitutions] = await Promise.allSettled([
        rateService.getMunicipalityIlliteracyRate(municipalityCode, 2023),
        rateService.getMunicipalitySchoolingRate(municipalityCode, 2023),
        rateService.getMunicipalityHigherEducationCompletionRate(municipalityCode, 2023),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/enrollment?filter=min_year:"2023",max_year:"2023",city:"${municipalityCode}"`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/school/count?filter=min_year:"2023",max_year:"2023",city:"${municipalityCode}"`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/university_enrollment?filter=min_year:"2023",max_year:"2023",city:"${municipalityCode}"`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/university/count?filter=min_year:"2023",max_year:"2023",city:"${municipalityCode}"`).then(r => r.json())
      ]);

      // Buscar dados financeiros do município (Receita Líquida de Impostos)
      const financialData = await fetch(
        `${import.meta.env.VITE_API_PUBLIC_URL}/researches/mt-revenue/municipio?nomeMunicipio=${municipalityCode}&anoInicial=2023&anoFinal=2023`
      ).then(r => r.json()).catch(() => null);

      console.log('financialData', financialData);

      const processedData = {
        population: areaAndPopulation.status === 'fulfilled'
          ? parseInt(areaAndPopulation.value?.[1]?.V) || 0
          : 0,
        area: areaAndPopulation.status === 'fulfilled'
          ? parseFloat(areaAndPopulation.value?.[2]?.V) || 0
          : 0,
        pib: pib.status === 'fulfilled'
          ? parseInt(pib.value?.[1]?.V) || 0
          : 0,
        // Dados específicos do município
        illiteracyRate: illiteracyRate.status === 'fulfilled' ? illiteracyRate.value : null,
        schoolingRate: schoolingRate.status === 'fulfilled' ? schoolingRate.value : null,
        higherEducationCompletionRate: higherEducationCompletionRate.status === 'fulfilled' ? higherEducationCompletionRate.value : null,
        education: {
          enrollments: basicEducationEnrollment.status === 'fulfilled' 
            ? basicEducationEnrollment.value?.result?.[0]?.total || null
            : null,
          schools: basicEducationSchools.status === 'fulfilled' 
            ? basicEducationSchools.value?.result?.[0]?.total || null
            : null
        },
        higherEducation: {
          enrollments: higherEducationEnrollment.status === 'fulfilled' 
            ? higherEducationEnrollment.value?.result?.[0]?.total || null
            : null,
          institutions: higherEducationInstitutions.status === 'fulfilled' 
            ? higherEducationInstitutions.value?.result?.[0]?.total || null
            : null
        },
        // Dados financeiros
        financialData: financialData
      };

      setMunicipalityData(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados do município:', error);
      setMunicipalityError('Erro ao carregar dados do município');
    } finally {
      setMunicipalityLoading(false);
    }
  };

  // Efeito para buscar dados quando o município muda
  useEffect(() => {
    console.log('useEffect - selectedMunicipality mudou para:', selectedMunicipality);
    if (selectedMunicipality) {
      fetchMunicipalityData(selectedMunicipality);
    }
  }, [selectedMunicipality]);

  // Efeito para carregar o mapa interativo
  useEffect(() => {
    const loadInteractiveMap = async () => {
      try {
        const response = await fetch('/images/mapa-piaui.svg');
        const svgText = await response.text();
        
        // Extrair apenas os elementos polygon do SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const polygons = svgDoc.querySelectorAll('polygon');
        
        const municipiosContainer = document.getElementById('municipios');
        if (municipiosContainer) {
          municipiosContainer.innerHTML = '';
          
          polygons.forEach(polygon => {
            const municipioId = polygon.getAttribute('id');
            
            // Extrair o nome do município de diferentes fontes possíveis
            let municipioName = 'Município';
            
            // Tentar pegar do elemento title filho
            if (polygon.querySelector('title')) {
              municipioName = polygon.querySelector('title').textContent;
            }
            // Tentar pegar do atributo title direto
            else if (polygon.getAttribute('title')) {
              municipioName = polygon.getAttribute('title');
            }
            // Tentar pegar do atributo data-name se existir
            else if (polygon.getAttribute('data-name')) {
              municipioName = polygon.getAttribute('data-name');
            }
            
            // Limpar o nome (remover ", PI" se existir)
            municipioName = municipioName.replace(', PI', '').replace(',PI', '');
            
            // Buscar o território de desenvolvimento do município
            const municipioData = municipios[municipioId];
            const territorioDesenvolvimento = municipioData ? municipioData.territorioDesenvolvimento : null;
            
            // Criar novo elemento polygon com eventos
            const newPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            newPolygon.setAttribute('points', polygon.getAttribute('points'));
            newPolygon.setAttribute('class', polygon.getAttribute('class'));
            newPolygon.setAttribute('id', municipioId);
            newPolygon.setAttribute('style', polygon.getAttribute('style'));
            newPolygon.setAttribute('data-name', municipioName); // Guardar o nome para referência
            newPolygon.setAttribute('data-territorio', territorioDesenvolvimento); // Guardar o território para referência
            
            // Adicionar eventos de mouse
            newPolygon.addEventListener('click', () => {
              // Remover seleção anterior
              document.querySelectorAll('polygon.selected').forEach(p => p.classList.remove('selected'));
              
              // Selecionar município atual
              newPolygon.classList.add('selected');
              
              // Atualizar município selecionado
              setSelectedMunicipality(municipioId);
            });
            
            // Variável para controlar o timeout do tooltip
            let tooltipTimeout;
            
            newPolygon.addEventListener('mouseenter', (e) => {
              // Limpar timeout anterior se existir
              if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
              }
              
              // Pequeno delay para melhorar UX
              tooltipTimeout = setTimeout(() => {
                const tooltip = document.getElementById('map-tooltip');
                if (tooltip) {
                  // Criar conteúdo do tooltip com nome e território
                  let tooltipContent = municipioName;
                  if (territorioDesenvolvimento) {
                    tooltipContent += `<br><span style="font-size: 12px; color: #666;">${territorioDesenvolvimento}</span>`;
                  }
                  
                  tooltip.innerHTML = tooltipContent;
                  
                  // Usar coordenadas do mouse para posicionar o tooltip
                  const mouseX = e.clientX;
                  const mouseY = e.clientY;
                  
                  // Posicionar tooltip acima do cursor
                  let left = mouseX;
                  let top = mouseY - 40; // 40px acima do cursor
                  
                  // Ajustar se tooltip sair da tela
                  if (left < 60) { // Metade da largura mínima do tooltip
                    left = 60;
                  } else if (left > window.innerWidth - 60) {
                    left = window.innerWidth - 60;
                  }
                  
                  // Se não couber acima, colocar abaixo
                  if (top < 50) {
                    top = mouseY + 20;
                  }
                  
                  tooltip.style.left = left + 'px';
                  tooltip.style.top = top + 'px';
                  tooltip.classList.remove('hidden');
                }
              }, 300); // 300ms de delay
            });
            
            newPolygon.addEventListener('mouseleave', () => {
              // Limpar timeout se existir
              if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = null;
              }
              
              const tooltip = document.getElementById('map-tooltip');
              if (tooltip) {
                tooltip.classList.add('hidden');
              }
            });
            
            municipiosContainer.appendChild(newPolygon);
          });
        }
      } catch (error) {
        console.error('Erro ao carregar mapa interativo:', error);
      }
    };

    loadInteractiveMap();
  }, []);

  // Efeito para destacar município selecionado no mapa
  useEffect(() => {
    if (selectedMunicipality) {
      // Remover seleção anterior
      document.querySelectorAll('polygon.selected').forEach(p => p.classList.remove('selected'));
      
      // Destacar município selecionado
      const selectedPolygon = document.getElementById(selectedMunicipality);
      if (selectedPolygon) {
        selectedPolygon.classList.add('selected');
      }
    }
  }, [selectedMunicipality]);

  const handleCategorySelect = (category) => {
    if (category === 'educacional') {
      navigate('/dados-educacionais');
    } else if (category === 'financeiro') {
      navigate('/dados-financeiros');
    }
  };

  // Função para lidar com mudança no select
  const handleMunicipalityChange = (selectedOption) => {
    setSelectedMunicipality(selectedOption.value);
  };

  // Dados a serem exibidos (município selecionado ou estado)
  const displayData = selectedMunicipality === '22' ? piauiData : municipalityData;
  const displayLoading = selectedMunicipality === '22' ? loading : municipalityLoading;
  const displayError = selectedMunicipality === '22' ? error : municipalityError;
  const selectedMunicipalityName = municipalitiesList.find(m => m.code === selectedMunicipality)?.name || 'Piauí';
  
  // Log de debug para verificar os dados
  console.log('Home - displayData:', displayData);
  console.log('Home - Taxa de analfabetismo:', displayData?.illiteracyRate);
  console.log('Home - Taxa de conclusão do ensino médio:', displayData?.schoolingRate);
  console.log('Home - Taxa de conclusão do ensino superior:', displayData?.higherEducationCompletionRate);
  console.log('Home - Dados financeiros:', displayData?.financialData);

  const legendData = [
    { name: 'Planície Litorânea', color: '#D4E8F4' },
    { name: 'Cocais', color: '#F9EDD0' },
    { name: 'Carnaubais', color: '#D4E8E0' },
    { name: 'Entre Rios', color: '#F4D898' },
    { name: 'Vale do Sambito', color: '#F9F0D0' },
    { name: 'Vale do Canindé', color: '#E8D4F4' },
    { name: 'Serra da Capivara', color: '#F0E8D0' },
    { name: 'Vale do Rio Guaribas', color: '#F0D8F4' },
    { name: 'Chapada Vale do Itaim', color: '#D4E8DC' },
    { name: 'Chapada das Mangabeiras', color: '#F0E0D0' },
    { name: 'Tabuleiros do Alto Parnaíba', color: '#E0D4F4' },
  ].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="homepage-background">
      {/* Logo Section */}
      <section className="pt-14 pb-7">
        <div className="py-0 max-w-7xl mx-auto text-center px-4">
          <div className="mb-9">
            <img 
              src="/images/logos/logo-opepi.png" 
              alt="Opepi Logo" 
              className="mx-auto h-20 md:h-24"
            />
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Observatório da Política Educacional Piauiense
          </p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="headline-large text-3xl md:text-4xl text-black mb-8 text-center">
            Monitoramento da ação estatal e direito à educação
          </h1>
          <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed text-center">
            Ao escolher um eixo temático, você pode consultar painéis com dados e indicadores sobre o Piauí e seus 224 municípios em um período abrangente.
          </p>
          
          <div className="feature-cards-container">
            {/* Dados Financeiros */}
            <div 
              className="feature-card p-8 rounded-xl shadow-lg border-2 border-yellow-300 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 text-center" 
              style={{ backgroundColor: 'var(--background-color)' }}
              onClick={() => navigate('/dados-financeiros')}
            >
              <div className="bg-yellow-100 w-16 h-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDollarSign className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Dados financeiros</h3>
              <p className="text-gray-600 leading-relaxed">
                Dados sobre o financiamento da educação, com visualizações gráficas e análises.
              </p>
            </div>

            {/* Dados Educacionais */}
            <Card 
              variant="elevated" 
              className="feature-card border-2 border-orange-300 cursor-pointer hover:shadow-lg transition-all duration-300" 
              backgroundColor="var(--background-color)"
              onClick={() => navigate('/dados-educacionais')}
            >
              <Card.Content padding="default" className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaGraduationCap className="text-orange-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Dados educacionais</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dados e indicadores sobre educação básica e superior, com visualizações gráficas e análises.
                </p>
                
              </Card.Content>
            </Card>

            {/* Repositório */}
            <div 
              className="feature-card p-8 rounded-xl shadow-lg border-2 border-yellow-200 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 text-center" 
              style={{ backgroundColor: 'var(--background-color)' }}
              onClick={() => window.location.href = 'https://repositorio.opepi.pi.gov.br'}
            >
              <div className="bg-gray-100 w-16 h-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaFileAlt className="text-gray-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Repositório/Acervo</h3>
              <p className="text-gray-600 leading-relaxed">
                Conjunto de documentos contendo a base legal, normativa e da produção científica que orienta a política educacional no Piauí e em seus 224 municípios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="headline-large text-4xl md:text-5xl text-black text-center mb-16">
            O que os dados nos dizem sobre
          </h2>
          
          <div className="flex justify-center mb-12">
            <Card variant="elevated" className="max-w-md w-full">
              <Card.Content padding="default">
                <div className="flex items-center">
                  <FaSearch className="text-gray-400 mr-3" />
                  <Select
                    options={municipalitiesList.map(municipality => ({
                      value: municipality.code,
                      label: municipality.name
                    }))}
                    value={{ value: selectedMunicipality, label: selectedMunicipalityName }}
                    onChange={handleMunicipalityChange}
                    placeholder="Selecione um município"
                    fullWidth
                  />
                </div>
              </Card.Content>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start justify-items-center">
            {/* Dados Gerais */}
            <div className="w-full max-w-sm">
              <Card variant="elevated" backgroundColor="var(--background-color)">
                <Card.Content padding="small">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold">{selectedMunicipalityName} - Dados Gerais</h3>
                    {(displayError || municipalityError) && (
                      <button 
                        onClick={() => selectedMunicipality === '22' ? window.location.reload() : fetchMunicipalityData(selectedMunicipality)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                        title="Tentar novamente"
                      >
                        Atualizar
                      </button>
                    )}
                  </div>
                  {displayLoading ? (
                    <div className="flex justify-center py-4">
                      <Loading variant="spinner" size="small" />
                    </div>
                  ) : displayError ? (
                    <div className="text-red-500 text-sm text-center py-2">{displayError}</div>
                  ) : (
                    <div className="space-y-1 text-left text-sm">
                      <div className="flex justify-between">
                        <span>População:</span>
                        <span className="font-semibold">
                          {selectedMunicipality === '22' 
                            ? displayData?.population?.toLocaleString('pt-BR') || 'N/A'
                            : displayData?.population?.toLocaleString('pt-BR') || 'N/A'
                          }
                        </span>
                      </div>
                      {selectedMunicipality === '22' && (
                        <>
                          <div className="flex justify-between">
                            <span>Municípios:</span>
                            <span className="font-semibold">{displayData?.municipalities}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Área:</span>
                            <span className="font-semibold">
                              {displayData?.area 
                                ? displayData.area.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' km²'
                                : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>PIB (2021):</span>
                            <span className="font-semibold">
                              {displayData?.pib 
                                ? formatCurrency(displayData.pib)
                                : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>IDH:</span>
                            <span className="font-semibold">0,710</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de analfabetismo:</span>
                            <span className="font-semibold">
                              {displayData?.illiteracyRate 
                                ? `${displayData.illiteracyRate.toFixed(1)}%`
                                : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de conclusão do ensino médio:</span>
                            <span className="font-semibold">
                              {displayData?.schoolingRate 
                                ? `${displayData.schoolingRate.toFixed(1)}%`
                                : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de conclusão do ensino superior:</span>
                            <span className="font-semibold">
                              {displayData?.higherEducationCompletionRate 
                                ? `${displayData.higherEducationCompletionRate.toFixed(1)}%`
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </>
                      )}
                      {selectedMunicipality !== '22' && displayData?.area && (
                        <>
                          <div className="flex justify-between">
                            <span>Área:</span>
                            <span className="font-semibold">
                              {displayData.area.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km²
                            </span>
                          </div>
                          {displayData?.pib && (
                            <div className="flex justify-between">
                              <span>PIB:</span>
                              <span className="font-semibold">{formatCurrency(displayData.pib)}</span>
                            </div>
                          )}
                          {displayData?.illiteracyRate && (
                            <div className="flex justify-between">
                              <span>Taxa de analfabetismo:</span>
                              <span className="font-semibold">
                                {displayData.illiteracyRate.toFixed(1)}%
                              </span>
                            </div>
                          )}
                          {displayData?.schoolingRate && (
                            <div className="flex justify-between">
                              <span>Taxa de conclusão do ensino médio:</span>
                              <span className="font-semibold">
                                {displayData.schoolingRate.toFixed(1)}%
                              </span>
                            </div>
                          )}
                          {displayData?.higherEducationCompletionRate && (
                            <div className="flex justify-between">
                              <span>Taxa de conclusão do ensino superior:</span>
                              <span className="font-semibold">
                                {displayData.higherEducationCompletionRate.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Fonte: IBGE e INEP
                    </p>
                  </div>
                </Card.Content>
              </Card>

              <Card variant="elevated" backgroundColor="var(--background-color)" className="mt-6">
                <Card.Content padding="small">
                  <h3 className="text-base font-bold mb-3">Territórios de Desenvolvimento</h3>
                  <div className="space-y-2">
                    {legendData.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-sm mr-2 border border-gray-400"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Mapa do Piauí Interativo */}
            <div className="flex items-center justify-center w-full max-w-sm">
              <div className="relative w-full h-auto" style={{ position: 'relative' }}>
                <svg 
                  width="802" 
                  height="1160" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto cursor-pointer"
                  viewBox="0 0 802 1160"
                >
                  <style>
                    {`
                      polygon {
                        stroke: white;
                        stroke-width: 0.1;
                        transition: all 0.2s ease;
                        cursor: pointer;
                      }
                      
                      polygon:hover {
                        fill: #FF5733 !important;
                        stroke: #FF5733;
                        stroke-width: 0.3;
                        filter: brightness(1.1);
                      }
                      
                      polygon.selected {
                        fill: #22c55e !important;
                        stroke: #22c55e;
                        stroke-width: 0.5;
                      }
                    `}
                  </style>
                  
                  {/* Municípios serão inseridos aqui dinamicamente */}
                  <g id="municipios">
                    {/* O SVG será carregado dinamicamente */}
                  </g>
                </svg>
                
                {/* Tooltip */}
                <div 
                  id="map-tooltip"
                  className="fixed hidden bg-white text-gray-800 text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none z-20 border-2 border-green-500"
                  style={{
                    minWidth: '120px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                </div>
              </div>
            </div>

            {/* Cards de Dados Específicos */}
            <div className="w-full max-w-sm space-y-4">
              {/* Educação Básica */}
              <Card variant="elevated" backgroundColor="var(--background-color)" className="text-center">
                <Card.Content padding="small">
                  {displayLoading ? (
                    <div className="flex justify-center py-4">
                      <Loading variant="spinner" size="small" />
                    </div>
                  ) : displayError ? (
                    <div className="text-red-500 text-sm text-center py-2">{displayError}</div>
                  ) : (
                    <>
                      <div className="mb-4 space-y-2">
                        {/* Título do card */}
                        <h3 className="text-base font-bold text-orange-600 uppercase tracking-wide">
                          Educação Básica
                        </h3>

                        <p className="text-sm font-semibold text-gray-700 uppercase">
                          {selectedMunicipalityName}
                        </p>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-600">Matrículas:</span>
                            <span className="text-lg font-bold text-orange-500">
                              {displayData?.education?.enrollments
                                ? formatNumber(displayData.education.enrollments)
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-600">Escolas:</span>
                            <span className="text-lg font-bold text-orange-500">
                              {displayData?.education?.schools
                                ? formatNumber(displayData.education.schools)
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-600">Ano:</span>
                            <span className="text-lg font-bold text-orange-500">2023</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <button 
                    onClick={() => handleCategorySelect('educacional')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full justify-center text-sm"
                  >
                    <FaGraduationCap />
                    dados educacionais
                  </button>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Fonte: INEP
                    </p>
                  </div>
                </Card.Content>
              </Card>

              {/* Educação Superior */}
              <Card variant="elevated" backgroundColor="var(--background-color)" className="text-center">
                <Card.Content padding="small">
                  {displayLoading ? (
                    <div className="flex justify-center py-4">
                      <Loading variant="spinner" size="small" />
                    </div>
                  ) : displayError ? (
                    <div className="text-red-500 text-sm text-center py-2">{displayError}</div>
                  ) : (
                    <>
                      <div className="mb-4 space-y-2">
                        {/* Título do card */}
                        <h3 className="text-base font-bold text-orange-600 uppercase tracking-wide">
                          Educação Superior
                        </h3>

                        <p className="text-sm font-semibold text-gray-700 uppercase">
                          {selectedMunicipalityName}
                        </p>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-600">Matrículas:</span>
                            <span className="text-lg font-bold text-orange-500">
                              {displayData?.higherEducation?.enrollments
                                ? formatNumber(displayData.higherEducation.enrollments)
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-600">Instituições:</span>
                            <span className="text-lg font-bold text-orange-500">
                              {displayData?.higherEducation?.institutions
                                ? formatNumber(displayData.higherEducation.institutions)
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                            <span className="text-sm text-gray-600">Ano:</span>
                            <span className="text-lg font-bold text-orange-500">2023</span>
                          </div>
                        </div>

                        
                      </div>
                      
                    </>
                  )}
                  <button 
                    onClick={() => handleCategorySelect('educacional')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full justify-center text-sm"
                  >
                    <FaGraduationCap />
                    dados educacionais
                  </button>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Fonte: INEP
                    </p>
                  </div>
                </Card.Content>
              </Card>

            </div>
          </div>
        </div>
      </section>


      {/* Nova Seção - Observatório e Nuppege */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Logo do Observatório */}
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <img
                  src="/images/observatorio-nuppege.png"
                  alt="observatório da política educacional piauiense e nuppege"
                  className="mx-auto lg:mx-0 h-32 md:h-40 lg:h-48"
                />
              </div>
            </div>

            {/* Lado Direito - Descrição */}
            <div className="text-left">
              <p className="text-lg text-gray-700 leading-relaxed">
                O Observatório da Política Educacional Piauiense (Opepi) se constitui em ação interdisciplinar (Educação, Ciências da Computação, Biblioteconomia e Comunicação Social), interinstitucional (UFPI, UESPI e IFPI) e intercampi (Teresina, Parnaíba, Floriano, São Raimundo Nonato, Picos), materializada pela formação grupos de trabalho e células de pesquisa temáticas dedicadas aos diferentes objetos da política educacional.
                O Observatório pretende responder à seguinte questão: Quais as tendências, potencialidades e desafios da ação estatal para a garantia do direito à educação no Piauí?

              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 