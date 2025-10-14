import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaSearch, FaBook, FaDollarSign, FaUsers, FaUniversity, FaTimes, FaCode, FaFreeCodeCamp, FaCodeBranch, FaCodepen } from 'react-icons/fa';
import { MdSchool, MdPeople, MdScience } from 'react-icons/md';

const QuemSomos = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCelula, setSelectedCelula] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const photos = [
    {
      src: "/images/fotos-reunioes/REUNIAO_NUPPEGE.jpg",
      alt: "Reunião NUPPEGE",
      title: "Reunião NUPPEGE"
    },
    {
      src: "/images/fotos-reunioes/GT_PLATAFORMA.jpg",
      alt: "GT Plataforma",
      title: "GT Plataforma"
    },
    {
      src: "/images/fotos-reunioes/GT_DADOS_1.jpg",
      alt: "GT Dados",
      title: "GT Dados"
    },
    {
      src: "/images/fotos-reunioes/ATIVIDADE_EXTENSIONISTA.jpg",
      alt: "Atividade Extensionista",
      title: "Atividade Extensionista"
    },
    {
      src: "/images/fotos-reunioes/LEGISLACAO_TERESINA.jpg",
      alt: "Legislação Teresina",
      title: "Legislação Teresina"
    },
    {
      src: "/images/fotos-reunioes/REUNIAO_NUPPEGE_2.jpg",
      alt: "Reunião NUPPEGE",
      title: "Reunião NUPPEGE"
    },
    {
      src: "/images/fotos-reunioes/REUNIAO_NUPPEGE_3.jpg",
      alt: "Reunião NUPPEGE",
      title: "Reunião NUPPEGE"
    },
    {
      src: "/images/fotos-reunioes/GT_PLATAFORMA_2.jpg",
      alt: "GT Plataforma",
      title: "GT Plataforma"
    },
    {
      src: "/images/fotos-reunioes/REUNIAO_NUPPEGE_4.jpg",
      alt: "Reunião NUPPEGE",
      title: "Reunião NUPPEGE"
    },
    {
      src: "/images/fotos-reunioes/ATIVIDADE_EXTENSIONISTA_2.jpg",
      alt: "Atividade Extensionista",
      title: "Atividade Extensionista"
    },
    {
      src: "/images/fotos-reunioes/GT_DADOS_2.jpg",
      alt: "GT Dados",
      title: "GT Dados"
    },
    {
      src: "/images/fotos-reunioes/LEGISLACAO_TERESINA_2.jpg",
      alt: "Legislação Teresina",
      title: "Legislação Teresina"
    },
  ];

  // Dados das células de pesquisa
  const celulasData = {
    gestao: {
      id: 'gestao',
      nome: 'Célula de Gestão de Sistemas e Unidades Escolares',
      foto: '/images/celulas/celula_gestao_de_sistemas_e_unidades_escolares.png',
      objetivo: 'Analisar o processo de formulação, implementação e avaliação das políticas educacionais para a gestão dos sistemas e unidades escolares nas redes de ensino público do Piauí, com foco nos modelos de gestão, programas e projetos desenvolvidos pelas secretarias estadual e municipais de educação.',
      membros: [
        'Maria do Socorro Soares - Doutora (UFPI Picos) - coordenação',
        'Ana Adriana de Sá - Graduanda (UFPI Picos)',
        'Cristiana Barra Teixeira - Doutora (UFPI Picos)',
        'Johnny de Sousa Silva - Graduanda (UFPI Picos)',
        'Maria Mônica Batista de Sousa - Graduanda (UFPI Picos)',
        'Romildo de Castro Araújo - Doutor (UFPI Picos)'
      ]
    },
    financiamento: {
      id: 'financiamento',
      nome: 'Célula de Financiamento da Educação',
      foto: '/images/celulas/celula_financiamento_da_educacao.png',
      objetivo: 'Investigar as políticas de financiamento e gestão da educação desenvolvidas no Piauí na perspectiva de analisar os processos de ampliação ou restrição dos direitos educacionais no Estado.',
      membros: [
        'Magna Jovita Gomes de Sales e Silva - Doutora em Educação (SEMEC/SEDUC) - coordenação',
        'Silvania Uchôa de Castro - Doutora (SEDUC/UESPI) - coordenação',
        'Cleide Ferreira Leão - Especialista (SEMEC)',
        'Efigênia Alves Neres - Doutoranda (UFPI)',
        'Francisco Ivan Assis de Araújo - Mestre (IFPI Piripiri)',
        'Francislene Santos Castro - Doutora (SEMEC)',
        'Gabrielle Alves Alencar - Graduanda (UFPI)',
        'José Victor Almeida de Sousa - Graduando (UFPI)',
        'Lucas Figueredo Soares - Graduando (UFPI)',
        'Lucine Rodrigues Vasconcelos Borges de Almeida - Mestre (SEDUC)',
        'Luís Carlos Sales - Doutor (UFPI)',
        'Rosana Evangelista da Cruz - Doutora (UFPI)',
        'Rosivaldo dos Santos Souza - Doutorando (UFPI)',
        'Teodoro de Sousa Sampaio - Graduando (UFPI)',
        'Valquira Macêdo Cantuaria - Doutora (SEMEC)',
        'Vinícius Silva de Sousa - Mestrando (UFPI)'
      ]
    },
    ensinoSuperior: {
      id: 'ensinoSuperior',
      nome: 'Célula de Ensino Superior',
      foto: '/images/celulas/celula_ensino_superior.png',
      objetivo: 'Analisar as políticas públicas para a educação superior e suas implicações nas Instituições de Ensino Superior – IES no Piauí.',
      membros: [
        'Maria da Penha Feitosa - Doutora (UFPI Floriano) - coordenação',
        'Mônica Núbia Albuquerque Dias - Doutoranda (UFPI Floriano)',
        'Geraldo do Nascimento Carvalho - Doutor (UFPI)'
      ]
    },
    educacaoInfantil: {
      id: 'educacaoInfantil',
      nome: 'Célula de Educação Infantil',
      foto: '/images/celulas/celula_educacao_infantil.png',
      objetivo: 'Desenvolver pesquisas que investiguem como as políticas educacionais desenvolvidas no âmbito da educação infantil revelam o movimento/trajetória de luta da sociedade pelo direito à educação de crianças piauienses de zero a seis anos.',
      membros: [
        'Carmen Lucia de Sousa Lima - Doutora (UFPI) – coordenação',
        'Valéria Madeira Martins Ribeiro - Mestra (UESPI) - coordenação',
        'Alana Ravena Gomes da Silva - Graduanda (UESPI)',
        'Cleuma Magalhães e Sousa - Mestre (UESPI)',
        'Gerlândia Amorim da Silva - Especialista (UESPI)',
        'Isabel Cristina da Silva Fontineles - Doutora (UESPI)',
        'Karinne Williams Silva Lemos - Graduanda (UESPI)',
        'Marcela Oliveira Castelo Branco - Especialista (NEUROGREEN)',
        'Maria Alcioneia Brito Fontenele - Especialista (SEMEC)',
        'Maria Carmem Bezerra Lima - Doutora (UESPI)',
        'Maria de Jesus Rodrigues - Doutoranda (UFPI)',
        'Marlon Araújo Carreiro - Mestrando (UFPI)',
        'Mary Gracy e Silva Lima - Doutora (UESPI/CCM)',
        'Michelle Morgana Gomes Fonseca Alcântara - Mestra (SEMEC)',
        'Vinícius Silva de Sousa - Mestrando (UFPI)',
        'Vitória Sousa Rodrigues - Especialista (UESPI)',
        'Zélia Maria Carvalho e Silva - Doutoranda (UFPI/CAFS)'
      ]
    },
    eja: {
      id: 'eja',
      nome: 'Célula de Educação de Jovens e Adultos',
      foto: '/images/celulas/celula_educacao_jovens_e_adultos.png',
      objetivo: 'Analisar as políticas públicas para a Educação de Jovens e Adultos – EJA no sistema público de educação no âmbito federal, estadual e municipal no Piauí, visando à produção de um diagnóstico dessa modalidade.',
      membros: [
        'Francislene Santos Castro - Doutora (SEMEC) – coordenação',
        'Marlucia Lima de Sousa Meneses - Doutoranda (PUC-Brasília/SEDUC) - coordenação',
        'Ana Paula Monteiro de Moura - Mestra (IFPI Floriano)',
        'Andrea Martins - Doutora (UFPI)',
        'Francisco das Chagas das Alves Rodrigues - Mestre (SEMEC)',
        'Jefferson de Sales Oliveira - Mestre',
        'Leia Soares da Silva - Mestra (IFPI)',
        'Marli Clementino Gonçalves - Doutora (UFPI)'
      ]
    },
    producaoConhecimento: {
      id: 'producaoConhecimento',
      nome: 'Célula de Produção do Conhecimento em Política Educacional',
      foto: '/images/celulas/celula_producao_de_conhecimento.png',
      objetivo: 'Investigar a constituição do campo política educacional no que se refere aos processos de produção e divulgação do conhecimento, indicando as tendências, potencialidades e desafios sobre a temática no Piauí.',
      membros: [
        'Enayde Fernandes Silva - Doutora (UFPI Picos) – coordenação',
        'Maria de Jesus Rodrigues Duarte - Doutoranda (UFPI/SEMEC) - coordenação',
        'Alan Fonseca dos Santos - Mestre (UESPI)',
        'Ana Paula Monteiro de Moura - Mestra (IFPI Floriano)',
        'Ana Sthefany Andrade Araújo - Graduanda (UESPI/Parnaíba)',
        'Juliana Macedo de Carvalho Castelo Branco - Mestranda (UFPI/SEMEC)',
        'Lucilene de Almeida Muniz - Graduanda (UESPI/Parnaíba)',
        'Magna Jovita Gomes de Sales e Silva - Doutora (SEMEC/SEDUC)',
        'Maria Clara de Sousa Costa - Doutoranda (UFPI)',
        'Marli Clementino Gonçalves - Doutora (UFPI)',
        'Marlucia Lima de Sousa Meneses - Doutoranda (PUC-BSB/SEDUC)',
        'Rigoberto Veloso de Carvalho – Doutorando (Biblioteca Central UFPI)',
        'Rosana Evangelista da Cruz - Doutora (UFPI)',
        'Vinícius Silva de Sousa - Mestrando (UFPI)'
      ]
    },
    educacaoCampo: {
      id: 'educacaoCampo',
      nome: 'Célula de Educação do Campo',
      foto: '/images/celulas/celula_educacao_do_campo.png',
      objetivo: 'Analisar o processo de materialização da política de Educação do Campo no Piauí no tocante à oferta, permanência, formação de educadores, gestão escolar e dos sistemas estadual e municipais, tendo em vista a qualidade social inscrita nos marcos fundacionais da política de Educação do Campo e na produção acadêmica e dos movimentos sociais do campo.',
      membros: [
        'Maria Clara de Sousa Costa - Doutoranda (UFPI) - coordenação',
        'Lucineide Barros Medeiros - Doutora (UESPI) - coordenação',
        'Jullyane Frazão Santana - Doutoranda (USP)',
        'Adilson de Apiaim - Mestre (SEDUC)',
        'Marli Clementino Gonçalves - Doutora (UFPI)',
        'Kátia Cristina - Especialista (UESPI)',
        'Messias Muniz - Especialista (UFPI)',
        'Miriã Medeiros - Especialista (SEDUC)'
      ]
    },
    avaliacao: {
      id: 'avaliacao',
      nome: 'Célula de Políticas de Avaliação Educacional',
      foto: '/images/celulas/celula_politicas_avaliacao_educacional.png',
      objetivo: 'Analisar os efeitos e implicações das políticas de avaliação educacional, em especial das avaliações externas, nos sistemas educacionais brasileiros diante do processo de ensino e aprendizagem desenvolvido nas unidades escolares.',
      membros: [
        'Luisa Xavier de Oliveira - Doutora (UFPI) - coordenação',
        'Wirla Risany Lima Carvalho - Doutora (UFPI) - coordenação',
        'Alan Fonseca dos Santos - Mestre (UESPI)',
        'Ana Gabriele de Moura Rodrigues - Mestranda (UFPI)',
        'Ateumice Maria do Nascimento - Especialista (SEMEC)',
        'Cleudiana Maria de Oliveira Silva - Mestre (SEDUC)',
        'Cleuma Magalhães e Sousa - Mestre (SEMEC)',
        'Cleverson Moreira Lino - Doutorando (UFPI)',
        'Dayane Martinelle da Silva Santos - Doutoranda (UFPI/SEMEC)',
        'Diego Rael Ferreira Barbosa - Graduando (UFPI)',
        'Eusilene da Rocha Ferreira - Doutoranda (UFPI/SEMEC)',
        'Francisca Eudeilane da Silva Pereira - Mestra (SEDUC/SEMEC)',
        'Sandra Regina Silva Garrido - Especialista (SEMEC)',
        'Vanusa Gomes Soares - Mestra (SEMEC)',
        'Vinícius Silva de Sousa - Mestrando (UFPI)'
      ]
    }
  };

  // Calcular número total de slides (3 fotos por slide)
  const totalSlides = Math.ceil(photos.length / 3);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return; // Pausa o auto-play se isPaused for true

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === totalSlides - 1) { // Se estiver no último slide
          return 0; // Volta para o primeiro slide
        }
        return prev + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides, isPaused]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPaused(true); // Pausa quando usuário navega manualmente
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === totalSlides - 1) { // Se estiver no último slide
        return 0; // Volta para o primeiro
      }
      return prev + 1;
    });
    setIsPaused(true); // Pausa quando usuário navega manualmente
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) { // Se estiver no primeiro slide
        return totalSlides - 1; // Vai para o último
      }
      return prev - 1;
    });
    setIsPaused(true); // Pausa quando usuário navega manualmente
  };

  // Funções para controlar pause/resume
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleFocus = () => {
    setIsPaused(true);
  };

  const handleBlur = () => {
    setIsPaused(false);
  };

  // Funções para o modal
  const openModal = (celulaId) => {
    setSelectedCelula(celulasData[celulaId]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCelula(null);
  };

  // Navegação entre células no modal
  const goToNextCelula = () => {
    const celulaIds = Object.keys(celulasData);
    const currentIndex = celulaIds.indexOf(selectedCelula.id);
    const nextIndex = (currentIndex + 1) % celulaIds.length;
    setSelectedCelula(celulasData[celulaIds[nextIndex]]);
  };

  const goToPrevCelula = () => {
    const celulaIds = Object.keys(celulasData);
    const currentIndex = celulaIds.indexOf(selectedCelula.id);
    const prevIndex = currentIndex === 0 ? celulaIds.length - 1 : currentIndex - 1;
    setSelectedCelula(celulasData[celulaIds[prevIndex]]);
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevCelula();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextCelula();
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedCelula]);

  // Função para gerar os slides dinamicamente
  const generateSlides = () => {
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
      const startIndex = i * 3;
      const endIndex = Math.min(startIndex + 3, photos.length);
      const slidePhotos = photos.slice(startIndex, endIndex);
      
      slides.push(
        <div key={i} className="w-full flex-shrink-0">
          <div className="flex space-x-6 justify-center">
            {slidePhotos.map((photo, index) => (
              <div 
                key={startIndex + index}
                className="flex-shrink-0 w-80 h-80 rounded-xl shadow-lg overflow-hidden carousel-card relative" 
                style={{ backgroundColor: 'var(--background-color)' }}
              >
                <img 
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return slides;
  };

  return (
    <div className="homepage-background">
             {/* Header Section */}
       <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Lado Esquerdo - Logo do Observatório */}
            <div className="text-center lg:text-left flex-shrink-0">
              <img
                src="/images/logos/texto-observatorio.png"
                alt="observatório da política educacional piauiense"
                className="mx-auto lg:mx-0 h-32 md:h-40 lg:h-48"
              />
            </div>

            {/* Lado Direito - Descrição */}
            <div className="text-left flex-1">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                 O Observatório da Política Educacional Piauiense (Opepi): monitoramento da ação estatal e direito à educação se constitui de uma ação interdisciplinar (Educação, Ciência da Computação, Biblioteconomia e Comunicação Social), interinstitucional (UFPI, UESPI e IFPI) e intercampi (Teresina, Parnaíba, Picos, Floriano, São Raimundo Nonato, Piripiri), materializada pela formação de células de pesquisa temáticas dedicadas aos diferentes objetos da política educacional.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                O Observatório pretende responder à seguinte questão: <strong>Quais as tendências, potencialidades e desafios da ação estatal para a garantia do direito à educação no Piauí?</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Linhas de Pesquisa Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-16 italic">
            Faça sua pesquisa sobre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {/* Card 1 - Análise de dados */}
             <div className="p-8 rounded-xl shadow-lg border-2 border-purple-500 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-500 text-4xl mb-4 flex justify-center">
                <FaGraduationCap />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Análise de dados e indicadores educacionais
              </h3>
            </div>

                         {/* Card 2 - Condições de trabalho */}
             <div className="p-8 rounded-xl shadow-lg border-2 border-purple-500 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-500 text-4xl mb-4 flex justify-center">
                <FaSearch />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Condições de trabalho docente
              </h3>
            </div>

                         {/* Card 3 - Condições de oferta */}
             <div className="p-8 rounded-xl shadow-lg border-2 border-purple-500 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-500 text-4xl mb-4 flex justify-center">
                <FaBook />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Condições de oferta de ensino
              </h3>
            </div>

                         {/* Card 4 - Financiamento */}
             <div className="p-8 rounded-xl shadow-lg border-2 border-green-500 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-green-500 text-4xl mb-4 flex justify-center">
                <FaDollarSign />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Financiamento da educação
              </h3>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 text-center py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-16 italic">
          Equipe do Opepi
        </h2>
      </div>

      {/* Células de Pesquisa Section */}
       <section>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-16 italic">
            Células de pesquisa
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {/* Célula 1 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('gestao')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <MdSchool />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Gestão de Sistemas e Unidades Escolares
              </h3>
            </div>

                         {/* Célula 2 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('financiamento')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaDollarSign />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Financiamento da Educação
              </h3>
            </div>

                         {/* Célula 3 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('ensinoSuperior')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaGraduationCap />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Ensino Superior
              </h3>
            </div>

                         {/* Célula 4 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('educacaoInfantil')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <MdPeople />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Educação Infantil
              </h3>
            </div>

                         {/* Célula 5 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('eja')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaUsers />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Educação de Jovens e Adultos
              </h3>
            </div>

                         {/* Célula 6 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('producaoConhecimento')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <MdScience />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Produção do Conhecimento
              </h3>
            </div>

                         {/* Célula 7 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 md:col-span-2 lg:col-span-1" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('educacaoCampo')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaUniversity />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Educação do Campo
              </h3>
            </div>

                         {/* Célula 8 */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
               onClick={() => openModal('avaliacao')}
             >
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaSearch />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Políticas de Avaliação Educacional
              </h3>
            </div>
          </div>
        </div>
      </section>

             {/* Grupos de Trabalho Section */}
       <section className="py-20">
         <div className="max-w-7xl mx-auto px-4 text-center">
           <h3 className="text-3xl md:text-4xl font-bold text-black mb-16 italic">
             Grupos de Trabalho
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* GT Dados */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
             >
               <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                 <FaSearch />
               </div>
               <h3 className="text-lg font-semibold text-gray-800">
                 GT Dados
               </h3>
             </div>

             {/* GT Plataforma */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
             >
               <div className="text-green-600 text-3xl mb-4 flex justify-center">
                 <FaCode />
               </div>
               <h3 className="text-lg font-semibold text-gray-800">
                 GT Plataforma
               </h3>
             </div>

             {/* GT Legislação */}
             <div 
               className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
               style={{ backgroundColor: 'var(--background-color)' }}
             >
               <div className="text-orange-600 text-3xl mb-4 flex justify-center">
                 <FaGraduationCap />
               </div>
               <h3 className="text-lg font-semibold text-gray-800">
                 GT Documentos
               </h3>
             </div>
           </div>
         </div>
       </section>

             {/* Nuppege Section */}
       <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8">
            {/* Lado Esquerdo - Logo do Nuppege */}
            <div className="text-center lg:text-left flex-shrink-0">
              <img
                src="/images/logos/nuppege.png"
                alt="nuppege"
                className="mx-auto lg:mx-0 h-5 md:6 lg:h-10"
              />
            </div>

            {/* Lado Direito - Descrição */}
            <div className="text-left flex-1">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O Núcleo de Estudos, Pesquisas e Extensão em Políticas e Gestão da Educação (Nuppege) 
                se constitui em um espaço de caráter interdisciplinar, interinstitucional e intercampi 
                voltado às políticas educacionais. É um coletivo acadêmico vinculado à Universidade 
                Federal do Piauí (UFPI), fundado em 1999 e institucionalizado em 2003 na UFPI e no 
                Diretório dos Grupos de Pesquisa do Conselho Nacional de Desenvolvimento Científico 
                e Tecnológico (CNPq).               
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O NUPPEGE é composto por docentes, estudantes da UFPI, da UESPI e do IFPI, além 
                de profissionais da educação básica e de pessoas vinculadas a movimentos populares e 
                sindicais que se identificam com os objetivos do Núcleo. O Núcleo tem se debruçado 
                sobre a temática política educacionais e gestão da educação, em âmbito da graduação e 
                da pós-graduação, gerando vasta produção, expressa em teses, dissertações, relatórios de 
                iniciação científica, trabalhos de conclusão de curso, artigos, livros e capítulos de livros 
                e comunicações orais em eventos de âmbito internacional, nacional, regional, estadual e 
                local.               
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Atua na articulação entre ensino, pesquisa e extensão, com foco na análise crítica das 
                políticas educacionais e na defesa do direito à educação pública, gratuita e de qualidade 
                social. Assim, o NUPPEGE, além de se dedicar ao ensino e à pesquisa, desenvolve 
                atividades extensionistas sistemáticas relacionadas à defesa do direito à educação, como 
                a participação na Campanha Nacional pelo Direito à Educação, a realização das Semanas 
                de Ação Mundial, a representação no Fórum Municipal de Educação de Teresina e no 
                Fórum Estadual do Piauí, assim como apoia a organização do Movimento Interfóruns da 
                Educação Infantil no Piauí e outras ações em defesa do direito à educação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Imagens Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Galeria de Fotos
          </h2>
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
          >
            {/* Carrossel Container */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {generateSlides()}
              </div>

              {/* Botões de navegação */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                aria-label="Slide anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                aria-label="Próximo slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

            </div>
            
            {/* Indicadores de slides */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-purple-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Contador de slides */}
            <div className="text-center mt-4 text-gray-600">
              {currentSlide + 1} de {totalSlides}
            </div>
          </div>
        </div>
      </section>

      {/* Modal das Células */}
      {isModalOpen && selectedCelula && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header do Modal com Foto */}
            <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
              <img
                src={selectedCelula.foto}
                alt={selectedCelula.nome}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedCelula.nome}
                </h2>
              </div>
              
              {/* Botão de fechar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              {/* Botões de navegação */}
              <button
                onClick={goToPrevCelula}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                aria-label="Célula anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNextCelula}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                aria-label="Próxima célula"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Objetivo */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaSearch className="text-purple-600 mr-2" />
                  Objetivo
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {selectedCelula.objetivo}
                </p>
              </div>

              {/* Membros */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaUsers className="text-purple-600 mr-2" />
                  Membros
                </h3>
                <div className="space-y-3">
                  {selectedCelula.membros.map((membro, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {membro}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center">
                {/* Indicadores de posição */}
                <div className="flex space-x-2">
                  {Object.keys(celulasData).map((celulaId, index) => (
                    <button
                      key={celulaId}
                      onClick={() => setSelectedCelula(celulasData[celulaId])}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        selectedCelula.id === celulaId 
                          ? 'bg-purple-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir para ${celulasData[celulaId].nome}`}
                    />
                  ))}
                </div>

                {/* Botão de fechar */}
                <button
                  onClick={closeModal}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuemSomos;
