import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaSearch, FaBook, FaDollarSign, FaUsers, FaUniversity } from 'react-icons/fa';
import { MdSchool, MdPeople, MdScience } from 'react-icons/md';

const QuemSomos = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
            Linhas de pesquisa
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

             {/* Células de Pesquisa Section */}
       <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-16 italic">
            Células de pesquisa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {/* Célula 1 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <MdSchool />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Gestão de Sistemas e Unidades Escolares
              </h3>
            </div>

                         {/* Célula 2 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaDollarSign />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Financiamento da Educação
              </h3>
            </div>

                         {/* Célula 3 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaGraduationCap />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Ensino Superior
              </h3>
            </div>

                         {/* Célula 4 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <MdPeople />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Educação Infantil
              </h3>
            </div>

                         {/* Célula 5 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaUsers />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Educação de Jovens e Adultos
              </h3>
            </div>

                         {/* Célula 6 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <MdScience />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Produção do Conhecimento
              </h3>
            </div>

                         {/* Célula 7 */}
             <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-600 text-3xl mb-4 flex justify-center">
                <FaUniversity />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Célula de Educação do Campo
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe do Opepi Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-16 italic">
            Equipe do Opepi
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Coluna Esquerda */}
            <div className="text-left">
              {/* Pesquisadores */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Pesquisadores</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>Magna Jovita Gomes de Sales e Silva</li>
                  <li>Maria do Socorro Soares</li>
                  <li>Otilio Paulo da Silva Neto</li>
                  <li>Romildo de Castro Araújo</li>
                  <li>Geraldo do Nascimento Carvalho</li>
                  <li>Lucineide Maria dos Santos Soares</li>
                  <li>Luís Carlos Sales</li>
                </ul>
              </div>

              {/* Coordenação */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Coordenação</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>Profª Drª Rosana Evangelista da Cruz (DEFE/UFPI)</li>
                  <li>Prof. Dr. Thiago Alves (FACE/UFG)</li>
                </ul>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="text-left">
              {/* Discentes */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Discentes</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>Francislene Santos Castro</li>
                  <li>Jéssica Maiure Chaves Matos</li>
                  <li>Lucine Rodrigues Vasconcelos</li>
                  <li>Silvania Uchôa de Castro</li>
                  <li>Valquira Macedo Cantuario</li>
                </ul>
              </div>

              {/* Colaboradores */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Colaboradores</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>Francisco Ivan Assis de Araújo</li>
                  <li>Juliana Da Silva Melo</li>
                  <li>Maria de Jesus Rodrigues Duarte</li>
                </ul>
              </div>
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
                O Núcleo de Estudos, Pesquisa e Extensão em Políticas e Gestão da Educação - NUPPEGE se constitui em um espaço de investigação sobre políticas educacionais de caráter interdisciplinar, interinstitucional e intercampi.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O NUPPEGE é composto por docentes, ativas (os) e aposentadas (os), estudantes da UFPI, da UESPI e do IFPI, além de profissionais e pessoas vinculadas a movimentos populares, sindicais e outros da sociedade civil que se identificam com os objetivos do Núcleo.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Criado em 1999 e institucionalizado em 2003, o NUPPEGE tem se debruçado sobre a temática política educacionais e gestão da educação, em âmbito da graduação e da pós-graduação, gerando vasta produção, expressa em teses, dissertações, relatórios de iniciação científica, trabalhos de conclusão de curso, artigos, livros e capítulos de livros e comunicações orais em eventos de âmbito internacional, nacional, regional, estadual e local.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                O NUPPEGE, além de se dedicar ao ensino e à pesquisa, desenvolve atividades extensionistas sistemáticas relacionadas à defesa do direito à educação, como a participação na Campanha Nacional pelo Direito à Educação, a realização das Semanas de Ação Mundial, a representação no Fórum Municipal de Educação de Teresina e no Fórum Estadual do Piauí, assim como apoia a organização do Movimento Interfóruns da Educação Infantil no Piauí e outras ações em defesa do direito à educação.
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
    </div>
  );
};

export default QuemSomos;
