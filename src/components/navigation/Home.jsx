import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaDollarSign, FaSearch, FaChevronDown, FaFileAlt } from 'react-icons/fa';
import { Card } from '../ui';
import '../../style/HomePage.css';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'educacional') {
      navigate('/education-selection');
    } else if (category === 'financeiro') {
      navigate('/financial-selection');
    }
  };

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
                  <input 
                    type="text" 
                    placeholder="Piauí" 
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none transition-colors"
                  />
                  <FaChevronDown className="text-gray-400 ml-3" />
                </div>
              </Card.Content>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start justify-items-center">
            {/* Dados Gerais do Piauí */}
            <div className="w-full max-w-sm">
              <Card variant="elevated" backgroundColor="var(--background-color)">
                <Card.Content padding="small">
                  <h3 className="text-base font-bold mb-3">Piauí - Dados Gerais</h3>
                  <div className="space-y-1 text-left text-sm">
                    <div className="flex justify-between">
                      <span>População:</span>
                      <span className="font-semibold">3.375.646</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Municípios:</span>
                      <span className="font-semibold">224</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Área:</span>
                      <span className="font-semibold">251.529</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PIB (2021):</span>
                      <span className="font-semibold">64.028.302.900</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IDH (2010):</span>
                      <span className="font-semibold">0,646</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de analfabetismo:</span>
                      <span className="font-semibold">13,8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de escolarização:</span>
                      <span className="font-semibold">31,2%</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Mapa do Piauí */}
            <div className="flex items-center justify-center w-full max-w-sm">
              <img 
                src="/images/piaui-md.svg" 
                alt="Mapa do Piauí" 
                className="w-full h-auto"
              />
            </div>

            {/* Cards de Dados Específicos */}
            <div className="w-full max-w-sm space-y-4">
              {/* Educação Básica */}
              <Card variant="elevated" backgroundColor="var(--background-color)" className="text-center">
                <Card.Content padding="small">
                  <div className="text-2xl font-bold text-green-600 mb-2">198.306 e 634</div>
                  <p className="text-gray-600 mb-3 text-sm">
                    eram os números de matrículas e escolas, respectivamente, no Piauí em 2023.
                  </p>
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
                  <div className="text-2xl font-bold text-green-600 mb-2">135.807 e 47</div>
                  <p className="text-gray-600 mb-3 text-sm">
                    eram os números de matrículas e instituições, respectivamente, no Piauí em 2023.
                  </p>
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