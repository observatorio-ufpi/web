import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaGraduationCap, FaDollarSign, FaMapMarkedAlt, FaFileAlt } from 'react-icons/fa';
import { Select } from '../ui';
import { Card } from '../ui';
import { formatNumber, formatCurrency, ibgeService } from '../../services/ibgeService';
import { Loading } from '../ui';
import { useIBGEData } from '../../hooks/useIBGEData';
import { municipios } from '../../utils/citiesMapping';
import '../../style/HomePage.css';

const Home = () => {
  const navigate = useNavigate();
  const { data: piauiData, loading, error, refreshData } = useIBGEData();
  
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
    if (municipalityCode === '22') {
      setMunicipalityData(null);
      setMunicipalityError(null);
      return;
    }

    setMunicipalityLoading(true);
    setMunicipalityError(null);

    try {
      const [
        areaAndPopulation,
        pib,
        education,
        higherEducation,
        postGraduation
      ] = await Promise.allSettled([
        ibgeService.getMunicipalityAreaAndPopulation(municipalityCode),
        ibgeService.getMunicipalityPIB(municipalityCode),
        ibgeService.getMunicipalityEducation(municipalityCode),
        ibgeService.getMunicipalityHigherEducation(municipalityCode),
        ibgeService.getMunicipalityPostGraduation(municipalityCode)
      ]);

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
        education: {
          enrollments: education.status === 'fulfilled'
            ? education.value?.data?.enrollments || 0
            : 0,
          schools: education.status === 'fulfilled'
            ? education.value?.data?.schools || 0
            : 0
        },
        higherEducation: {
          enrollments: higherEducation.status === 'fulfilled'
            ? higherEducation.value?.data?.enrollments || 0
            : 0,
          institutions: higherEducation.status === 'fulfilled'
            ? higherEducation.value?.data?.institutions || 0
            : 0,
          enrollmentRate: higherEducation.status === 'fulfilled'
            ? higherEducation.value?.data?.enrollmentRate || 0
            : 0
        },
        postGraduation: {
          masters: postGraduation.status === 'fulfilled'
            ? postGraduation.value?.data?.masters || 0
            : 0,
          doctors: postGraduation.status === 'fulfilled'
            ? postGraduation.value?.data?.doctors || 0
            : 0
        }
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
    fetchMunicipalityData(selectedMunicipality);
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
            
            // Criar novo elemento polygon com eventos
            const newPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            newPolygon.setAttribute('points', polygon.getAttribute('points'));
            newPolygon.setAttribute('class', polygon.getAttribute('class'));
            newPolygon.setAttribute('id', municipioId);
            newPolygon.setAttribute('style', polygon.getAttribute('style'));
            newPolygon.setAttribute('data-name', municipioName); // Guardar o nome para referência
            
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
                  tooltip.textContent = municipioName;
                  
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
      navigate('/dados-educacionais/basica');
    } else if (category === 'financeiro') {
      navigate('/dados-financeiros/municipios');
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
  
  return (
    <div className="homepage-background">
      {/* Logo Section */}
      <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto text-center px-4">
          <div className="mb-8">
            <img 
              src="/images/logos/logo-opepi.png" 
              alt="Opepi Logo" 
              className="mx-auto h-20 md:h-24"
            />
          </div>
          <p className="text-lg text-gray-600 mb-4">
            observatório da política educacional piauiense
          </p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="headline-large text-4xl md:text-5xl text-black mb-8">
            Monitoramento da ação estatal e direito à educação
          </h1>
          <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed text-center">
            Ao escolher um eixo temático, você pode consultar painéis com dados e indicadores sobre o Piauí e seus 224 municípios em um período abrangente.
          </p>
          
          <div className="feature-cards-container">
            {/* Dados Financeiros */}
            <Card 
              variant="elevated" 
              className="feature-card border-2 border-green-500 cursor-pointer hover:shadow-lg transition-all duration-300" 
              backgroundColor="var(--background-color)"
              onClick={() => navigate('/municipios')}
            >
              <Card.Content padding="default" className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaDollarSign className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Dados financeiros</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dados sobre o financiamento da educação, com visualizações gráficas e análises.
                </p>
              </Card.Content>
            </Card>

            {/* Dados Educacionais */}
            <Card 
              variant="elevated" 
              className="feature-card border-2 border-purple-500 cursor-pointer hover:shadow-lg transition-all duration-300" 
              backgroundColor="var(--background-color)"
              onClick={() => navigate('/dados-educacionais/basica')}
            >
              <Card.Content padding="default" className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaGraduationCap className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Dados educacionais</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dados e indicadores sobre educação básica e superior, com visualizações gráficas e análises.
                </p>
              </Card.Content>
            </Card>

            {/* Repositório */}
            <Card 
              variant="elevated" 
              className="feature-card border-2 border-gray-500 cursor-pointer hover:shadow-lg transition-all duration-300" 
              backgroundColor="var(--background-color)"
              onClick={() => navigate('/repositorio')}
            >
              <Card.Content padding="default" className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFileAlt className="text-gray-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Repositório/Acervo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Conjunto de documentos contendo a base legal, normativa e da produção científica que orienta a política educacional no Piauí e em seus 224 municípios.
                </p>
              </Card.Content>
            </Card>
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
                        onClick={() => selectedMunicipality === '22' ? refreshData() : fetchMunicipalityData(selectedMunicipality)}
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
                            <span>IDH (2010):</span>
                            <span className="font-semibold">N/A</span>
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
                            <span>Taxa de escolarização:</span>
                            <span className="font-semibold">N/A</span>
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
                              <span>PIB (2021):</span>
                              <span className="font-semibold">{formatCurrency(displayData.pib)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
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
                        fill: #8b5cf6 !important;
                        stroke: #8b5cf6;
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
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {displayData?.education?.enrollments 
                          ? `${formatNumber(displayData.education.enrollments)} e ${displayData.education.schools}`
                          : 'Dados não disponíveis'
                        }
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">
                        {displayData?.education?.enrollments 
                          ? `eram os números de matrículas e escolas na educação básica, respectivamente, em ${selectedMunicipalityName.toLowerCase()} em 2023.`
                          : 'Informações sobre educação básica não estão disponíveis no momento.'
                        }
                      </p>
                    </>
                  )}
                  <button 
                    onClick={() => handleCategorySelect('educacional')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full justify-center text-sm"
                  >
                    <FaGraduationCap />
                    dados educacionais
                  </button>
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
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {displayData?.higherEducation?.enrollments 
                          ? `${formatNumber(displayData.higherEducation.enrollments)} e ${displayData.higherEducation.institutions}`
                          : 'Dados não disponíveis'
                        }
                      </div>
                      <p className="text-gray-600 mb-2 text-sm">
                        {displayData?.higherEducation?.enrollments 
                          ? `eram os números de matrículas e instituições na <strong>educação superior</strong>, respectivamente, em ${selectedMunicipalityName.toLowerCase()} em 2023.`
                          : 'Informações sobre educação superior não estão disponíveis no momento.'
                        }
                      </p>
                    </>
                  )}
                  <button 
                    onClick={() => handleCategorySelect('educacional')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full justify-center text-sm"
                  >
                    <FaGraduationCap />
                    dados educacionais
                  </button>
                </Card.Content>
          </Card>

              {/* Financiamento */}
              <Card variant="elevated" backgroundColor="var(--background-color)" className="text-center">
                <Card.Content padding="small">
                  <div className="text-2xl font-bold text-green-600 mb-2">R$ 5.022</div>
                  <p className="text-gray-600 mb-3 text-sm">
                    era a remuneração média mensal docente no Piauí em 2023.
                  </p>
                  <button 
                    onClick={() => handleCategorySelect('financeiro')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full justify-center text-sm"
                  >
                    <FaDollarSign />
                    dados financeiros
                  </button>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Repository Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="headline-large text-4xl md:text-5xl text-black mb-8">
            O repositório do Opepi
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Armazena, preserva e dissemina documentos digitais com base legal, normativa e da produção científica sobre a política educacional piauiense.
          </p>
          
          <Card variant="elevated" className="max-w-2xl mx-auto mb-8">
            <Card.Content padding="default">
              <div className="flex items-center">
                <FaSearch className="text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Pesquisar no repositório" 
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none transition-colors"
                />
              </div>
            </Card.Content>
          </Card>
          
          <div className="flex flex-wrap justify-center gap-2">
            {['base legal', 'base normativa', 'teses', 'artigos', 'dissertações', 'mídia', 'co'].map((tag) => (
              <button key={tag} className="bg-gray-200 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-full transition-all duration-300">
                {tag}
              </button>
            ))}
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
                O Observatório da política educacional piauiense (Opepi): monitoramento da ação estatal e direito à educação, 
                é um projeto que consiste nas investigações do Núcleo de Estudos e Pesquisas em Políticas e Gestão da Educação (Nuppege). 
                Temos como objetivo analisar como as políticas educacionais desenvolvidas no Piauí têm contribuído para a ampliação ou para a restrição do direito à educação no Estado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 