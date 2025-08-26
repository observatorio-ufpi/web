import React from 'react';
import { FaGraduationCap, FaSearch, FaBook, FaDollarSign, FaUsers, FaUniversity } from 'react-icons/fa';
import { MdSchool, MdPeople, MdScience } from 'react-icons/md';

const QuemSomos = () => {
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
                O Observatório da Política Educacional Piauiense: monitoramento da ação estatal e direito à educação se constitui de um projeto interdisciplinar, interinstitucional e intercampi, materializado pela formação de células de pesquisa temáticas dedicadas aos diferentes objetos da política educacional.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                A política educacional desenvolvida no Piauí é o tema deste projeto que pretende responder à seguinte questão: <strong>Quais as tendências, potencialidades e desafios da ação estatal para a garantia do direito à educação no Piauí?</strong>
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
             <div className="p-8 rounded-xl shadow-lg border-2 border-green-500 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-green-500 text-4xl mb-4 flex justify-center">
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
             <div className="p-8 rounded-xl shadow-lg border-2 border-purple-500 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="text-purple-500 text-4xl mb-4 flex justify-center">
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
                O Núcleo de Estudos e Pesquisa em Políticas e Gestão da Educação - NUPPEGE se constitui em um espaço de investigação sobre políticas educacionais.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Desde 1999, seus pesquisadores têm se debruçado sobre a temática, em âmbito da graduação e da pós-graduação, gerando vasta produção, expressa em teses; dissertações; relatórios de iniciação científica; trabalhos de conclusão de curso; artigos; livros e capítulo de livros e comunicações orais em eventos de âmbito internacional, nacional, regional, estadual e local.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                O NUPPEGE é composto por docentes, ativas (os) e aposentadas (os), estudantes da UFPI e de outras IES, além de profissionais e pessoas vinculadas a movimentos populares, sindicais e outros da sociedade civil que se identificam com os objetivos do Núcleo.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                O NUPPEGE é um núcleo permanente estabelecido em espaço específico para núcleos de pesquisas localizado no CCE/PPGED/UFPI, podendo suas reuniões ocorrerem no formato remoto em casos de excepcionalidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Imagens Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-6 pb-4">
                         {/* Card 1 */}
             <div className="flex-shrink-0 w-80 rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem da Primeira Reunião</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Primeira reunião ordinária de 2025
                </h3>
              </div>
            </div>

                         {/* Card 2 */}
             <div className="flex-shrink-0 w-80 rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem dos GT's</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Reunião dos GT's Dados e Plataforma
                </h3>
              </div>
            </div>

                         {/* Card 3 */}
             <div className="flex-shrink-0 w-80 rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem UESPI</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  UESPI/Oe...
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuemSomos;
