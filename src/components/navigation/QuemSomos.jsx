import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaSearch, FaBook, FaDollarSign, FaUsers, FaUniversity, FaTimes, FaCode, FaFreeCodeCamp, FaCodeBranch, FaCodepen } from 'react-icons/fa';
import { MdSchool, MdPeople, MdScience } from 'react-icons/md';


const QuemSomos = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCelula, setSelectedCelula] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGT, setSelectedGT] = useState(null);
  const [isGTModalOpen, setIsGTModalOpen] = useState(false);

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
  educacaoCampo: {
    id: 'educacaoCampo',
    nome: 'Célula de Educação do Campo',
    foto: '/images/celulas/educacao_do_campo.jpg',
    objetivo: 'Analisar o processo de materialização da política de Educação do Campo no Piauí no tocante à oferta, permanência, formação de educadores, gestão escolar e dos sistemas estadual e municipais, tendo em vista a qualidade social inscrita nos marcos fundacionais da política de Educação do Campo e na produção acadêmica e dos movimentos sociais do campo.',
    membros: [
      'Lucineide Barros Medeiros - Doutora em educação (UESPI) - coordenação',
      'Maria Clara de Sousa Costa - Doutoranda em educação (UFPI) - coordenação',
      'Adilson de Apiaim - Mestre em Sociedade e Cultura (SEDUC)',
      'Jullyane Frazão Santana - Doutora em educação (UFPI)',
      'Kátia Cristina Newton Bomfim Maciel - Especialista em Educação (UESPI)',
      'Marli Clementino Gonçalves - Doutora em Educação (UFPI)',
      'Messias Muniz – Mestre em Educação (UFPI)',
      'Miriã Medeiros – Especialista em Educação (SEDUC)',
      'Rosimery Vieira da Costa - Doutoranda em Educação (UFPI)'
    ],
  },
  educacaoInfantil: {
    id: 'educacaoInfantil',
    nome: 'Célula de Educação Infantil',
    foto: '/images/celulas/educacao_infatil.jpg.png',
    objetivo: 'Desenvolver pesquisas que investiguem como as políticas educacionais desenvolvidas no âmbito da educação infantil revelam o movimento/trajetória de luta da sociedade pelo direito à educação de crianças piauienses de zero a seis anos.',
    membros: [
      'Carmen Lucia de Sousa Lima - Doutora em educação (UFPI) – coordenação',
      'Valéria Madeira Martins Ribeiro - Mestra em educação (UESPI) – coordenação',
      'Alana Ravena Gomes da Silva – Graduanda em Pedagogia (UESPI)',
      'Aline Nobre da Silva Nunes - Pedagoga (SEMEC)',
      'Cleuma Magalhães e Sousa - Mestre em educação (UESPI)',
      'Gerlândia Amorim da Silva – Especialista em educação (UESPI)',
      'Fabrícia Pereira Teles – Doutora em educação (UESPI Parnaíba)',
      'Isabel Cristina da Silva Fontineles - Doutora em educação (UESPI)',
      'Karinne Williams Silva Lemos - Graduanda em Pedagogia (UESPI)',
      'Marcela Oliveira Castelo Branco - Especialista em educação (Neurogreen)',
      'Maria Alcioneia Brito Fontenele – Especialista em educação (SEMEC)',
      'Maria Carmem Bezerra Lima - Doutora em educação (UESPI/Picos)',
      'Maria de Jesus Rodrigues - Doutoranda em Educação (UESPI)',
      'Maria Valdinelha da Silva Alves - Pedagoga (Neuroaprender)',
      'Mary Gracy e Silva Lima – Doutora em educação (UESPI)',
      'Mateus Dantas de Farias Fonseca - Graduando em Pedagogia (UFPI)',
      'Michelle Morgana Gomes Fonseca Alcântara - Mestra em Educação (SEMEC)',
      'Rejania Rebelo Lustosa - Mestra (UNINASSAU)',
      'Rusenilde Gomes da Cunha – Mestranda em educação (PUC-SP)',
      'Vinícius Silva de Sousa - Mestrando em educação (UFPI)',
      'Vitória Sousa Rodrigues - Especialista em educação (UESPI)',
      'Zélia Maria Carvalho e Silva - Doutoranda em educação (UFPI/CAFS)'
    ]
  },
  producaoConhecimento: {
    id: 'producaoConhecimento',
    nome: 'Célula de Produção do Conhecimento em Política Educacional',
    foto: '/images/celulas/producao_do_conhecimento_em_politica_educacional.png',
    objetivo: 'Investigar a constituição do campo política educacional no que se refere aos processos de produção e divulgação do conhecimento, indicando as tendências, potencialidades e desafios sobre a temática no Piauí.',
    membros: [
      'Enayde Fernandes Silva - Doutora em educação (UFPI Picos) – coordenação',
      'Maria de Jesus Rodrigues Duarte - Doutoranda em educação (UFPI/SEMEC) - coordenação',
      'Alan Fonseca dos Santos - Mestre em educação (UESPI/Bom Jesus)',
      'Ana Paula Monteiro de Moura – Mestra em educação (IFPI Floriano)',
      'Ana Sophia Meireles de Oliveira – Graduanda em Pedagogia (UFPI)',
      'Ana Sthefany Andrade Araújo – Graduanda em Pedagogia (UFPI)',
      'Cristina Maria dos Santos Costa - Graduanda em Biblioteconomia (UESPI)',
      'Felipe Santiago Gomes da Silva - Graduando em Pedagogia (UFPI)',
      'Francisco Williams de Assis Soares Gonçalves - Doutorando em Educação (UFPI)',
      'Juliana Macedo de Carvalho Castelo Branco - Mestranda em educação (UFPI/SEMEC)',
      'Letícia Rodrigues De França – Graduanda em Biblioteconomia (UESPI)',
      'Luisa Xavier de Oliveira - Doutora em educação (UFPI)',
      'Magna Jovita Gomes de Sales e Silva - Doutora em educação (SEMEC/SEDUC)',
      'Maria Clara de Sousa Costa - Doutoranda em educação (UFPI)',
      'Maria Rosília da Silva Araújo - Mestranda em Educação (UFPI/Semed - Altos)',
      'Marli Clementino Gonçalves - Doutora em educação (UFPI)',
      'Marlon Araújo Carreiro - Mestrando em Educação (UFPI)',
      'Marlucia Lima de Sousa Meneses – Doutoranda em educação (PUC-BSB/SEDUC)',
      'Rigoberto Veloso de Carvalho – Doutorando em Políticas Públicas (Biblioteca Central UFPI)',
      'Rosana Evangelista da Cruz - Doutora em educação (UFPI)',
      'Vinícius Silva de Sousa - Mestrando em educação (UFPI)',
      'Ylanna Marcelly de Sousa Morais - Graduanda em Pedagogia (UFPI)'
    ]
  },
  ensinoSuperior: {
    id: 'ensinoSuperior',
    nome: 'Célula de Ensino Superior',
    foto: '/images/celulas/ensino_superior.jpg',
    objetivo: 'Analisar as políticas públicas para a educação superior e suas implicações nas Instituições de Ensino Superior – IES no Piauí.',
    membros: [
      'Maria da Penha Feitosa - Doutora em educação (UFPI Floriano) - coordenação',
      'Ana Paula Monteiro de Moura – Mestra em educação (IFPI Floriano)',
      'Geraldo do Nascimento Carvalho - Doutor em educação (UFPI)',
      'Jullyane Frazão Santana - Doutora em educação (UFPI)',
      'Mônica Núbia Albuquerque Dias - Doutoranda em educação (UFPI Floriano)',
      'Rute Glésia Lima Nolêto - Mestra em Educação Profissional e Tecnológica (IFPI – Floriano)'
    ]
  },
  gestao: {
    id: 'gestao',
    nome: 'Célula de Gestão de Sistemas e Unidades Escolares',
    foto: '/images/celulas/gestao_de_sistemas_e_unidades_escolares.jpg',
    objetivo: 'Analisar o processo de formulação, implementação e avaliação das políticas educacionais para a gestão dos sistemas e unidades escolares nas redes de ensino público do Piauí, com foco nos modelos de gestão, programas e projetos desenvolvidos pelas secretarias estadual e municipais de educação.',
    membros: [
      'Maria do Socorro Soares - Doutora em educação (UFPI Picos) – coordenação',
      'Ana Adriana de Sá - Graduanda em Pedagogia (UFPI Picos)',
      'Cristiana Barra Teixeira - Doutora em educação (UFPI Picos)',
      'Johnny de Sousa Silva – Graduando em Pedagogia (UFPI Picos)',
      'José Italo Freitas Alves – Graduando em Pedagogia (UFPI Picos)',
      'Maria Mônica Batista de Sousa - Graduanda em Pedagogia (UFPI Picos)',
      'Romildo de Castro Araújo - Doutor em Educação (UFPI Picos)'
    ]
  },
  avaliacao: {
    id: 'avaliacao',
    nome: 'Célula de Políticas de Avaliação Educacional',
    foto: '/images/celulas/avaliacao_educacional.jpg',
    objetivo: 'Analisar os efeitos e implicações das políticas de avaliação educacional, em especial das avaliações externas, nos sistemas educacionais brasileiros diante do processo de ensino e aprendizagem desenvolvido nas unidades escolares.',
    membros: [
      'Luisa Xavier de Oliveira - Doutora em educação (UFPI) - coordenação',
      'Wirla Risany Lima Carvalho – Doutora em educação (UFPI) – coordenação',
      'Alan Fonseca dos Santos - Mestre em educação (UESPI Bom Jesus)',
      'Ana Gabriele de Moura Rodrigues – Mestranda em educação (UFPI)',
      'Ateumice Maria do Nascimento - Especialista em educação (SEMEC)',
      'Cleudiana Maria de Oliveira Silva - Mestre em educação (SEDUC)',
      'Cleuma Magalhães e Sousa – Mestre em educação (SEMEC)',
      'Cleverson Moreira Lino - Doutorando em educação (UFPI)',
      'Dayane Martinelle da Silva Santos - Doutoranda em educação (UFPI/SEMEC)',
      'Diego Rael Ferreira Barbosa - Graduando em Pedagogia (UFPI)',
      'Estefania Lima da Frota - Especialista em educação (SMET)',
      'Eusilene da Rocha Ferreira - Doutoranda em educação (UFPI/SEMEC)',
      'Francisca Eudeilane da Silva Pereira - Mestra em educação (SEDUC/SEMEC)',
      'Raimunda Nonata Paiva Andrade - Mestre em educação (SEMECT)',
      'Sandra Regina Silva Garrido - Especialista em educação (SEMEC)',
      'Vanusa Gomes Soares - Mestra em educação (SEMEC)',
      'Vinícius Silva de Sousa - Mestrando em educação (UFPI)'
    ]
  },
  financiamento: {
    id: 'financiamento',
    nome: 'Célula de Financiamento da Educação',
    foto: '/images/celulas/finaciamento_da_educacao.jpg',
    objetivo: 'Investigar as políticas de financiamento e gestão da educação desenvolvidas no Piauí na perspectiva de analisar os processos de ampliação ou restrição dos direitos educacionais no Estado.',
    membros: [
      'Magna Jovita Gomes de Sales e Silva - Doutora em educação (SEMEC/SEDUC) - coordenação',
      'Silvania Uchôa de Castro - Doutora em educação (SEDUC/UESPI) - coordenação',
      'Cleide Ferreira Leão - Especialista em educação (SEMEC)',
      'Efigênia Alves Neres - Doutoranda em educação (UFPI)',
      'Francisco Ivan Assis de Araújo - Mestre em educação (IFPI Piripiri)',
      'Francislene Santos Castro - Doutora em educação (SEMEC)',
      'Gabrielle Alves Alencar - Graduanda em educação (UFPI)',
      'José Victor Almeida de Sousa - Graduando em Pedagogia (UFPI)',
      'Lucas Figueredo Soares – Graduando em Pedagogia (UFPI)',
      'Lucine Rodrigues Vasconcelos Borges de Almeida - Mestre em Educação (SEDUC)',
      'Luís Carlos Sales - Doutor em Educação (UFPI)',
      'Rosana Evangelista da Cruz - Doutora em Educação (UFPI)',
      'Rosivaldo dos Santos Souza - Doutorando em Educação (UFPI)',
      'Teodoro de Sousa Sampaio - Graduando em Pedagogia (UFPI)',
      'Valquira Macêdo Cantuaria – Doutora em educação (SEMEC)',
      'Vinícius Silva de Sousa - Mestrando em educação (UFPI)'
    ]
  },
  eja: {
    id: 'eja',
    nome: 'Célula de Educação de Jovens e Adultos',
    foto: '/images/celulas/educacao_de_jovens_e_adultos.jpg',
    objetivo: 'Analisar as políticas públicas para a Educação de Jovens e Adultos – EJA no sistema público de educação no âmbito federal, estadual e municipal no Piauí, visando à produção de um diagnóstico dessa modalidade.',
    membros: [
      'Francislene Santos Castro - Doutora em educação (SEMEC) – coordenação',
      'Marlucia Lima de Sousa Meneses - Doutoranda em educação (UCB/SEDUC) - coordenação',
      'Ana Paula Monteiro de Moura – Mestra em educação (IFPI Floriano)',
      'Andrea Martins – Doutora em educação (UFPI)',
      'Francisco das Chagas das Alves Rodrigues - Mestre em educação (SEMEC)',
      'Jefferson de Sales Oliveira – Mestre em educação',
      'Leia Soares da Silva - Mestra em educação (IFPI)',
      'Marli Clementino Gonçalves - Doutora em educação (UFPI)',
      'Marlon Araújo Carreiro – Mestrado em Educação (UFPI)',
      'Thathyany Freitas Miranda – Mestranda em Educação (UFPI)'
    ]
  }
};

const gtsData = {
  dados: {
    id: 'dados',
    nome: 'GT Dados',
    foto: '/images/grupos/gt_dados.jpg',
    objetivo: 'Definir os indicadores, fontes e protocolos de análise dos dados educacionais e financeiros da Plataforma do Observatório da Política Educacional Piauiense e apoiar o GT Plataforma no desenvolvimento dos seus trabalhos',
    membros: [
      'Rosana Evangelista da Cruz - Doutora em Educação (UFPI) – Coordenação',
      'Ana Sophia Meireles de Oliveira – Graduanda em Pedagogia (UFPI)',
      'Efigênia Alves Neres - Doutoranda em Educação (UFPI)',
      'Francislene Santos Castro - Doutora em Educação (SEMEC)',
      'Gabrielle Alves Alencar - Graduanda em Letras (UFPI)',
      'João Pedro de Assis Rodrigues - Graduando em Comunicação Social (UFPI)',
      'José Victor Almeida de Sousa - Graduando em Pedagogia (UFPI)',
      'Larisse Felipe Santiago - Graduanda em Pedagogia (UFPI)',
      'Lucas Figueredo Soares - Graduando em Pedagogia (UFPI)',
      'Lucine Rodrigues Vasconcelos Borges de Almeida - Mestre em Educação (SEDUC)',
      'Luís Carlos Sales – Doutor em Educação (UFPI)',
      'Magna Jovita Gomes de Sales e Silva - Doutora em Educação (SEMEC/SEDUC)',
      'Maria Alcioneia Brito Fontenele – Especialista em Educação (SEMEC)',
      'Marlon Araújo Carreiro – Mestrando em Educação (UFPI)',
      'Rosivaldo dos Santos Souza – Doutorando em Educação (UFPI, SEDUC/BA-PE)',
      'Silvania Uchôa de Castro – Doutora em Educação (SEMEC)',
      'Teodoro de Sousa Sampaio - Graduando em Pedagogia (UFPI)',
      'Vinícius Silva de Sousa – Mestrando em Educação (UFPI)'
    ]
  },
  plataforma: {
    id: 'plataforma',
    nome: 'GT Plataforma',
    foto: '/images/grupos/gt_plataforma.jpg',
    objetivo: 'Constituir a Plataforma do Observatório da Política Educacional Piauiense',
    membros: [
      'Otílio Paulo da Silva Neto – Doutor em Ciência da Computação (IFPI) – Coordenação',
      'Vinícius Pontes Machado – Doutor em Ciência da Computação (UFPI) – Coordenação',
      'Thiago Alves – Doutor em Administração (LDE/UFG) - consultor',
      'Ana Paula Monteiro de Moura - Mestre em Educação (IFPI- Floriano)',
      'Antônio Anderson Lira da Silva – Graduando em Ciência da Computação (UFPI)',
      'Hilton Ribeiro de Castro – Graduando em Matemática (UFPI)',
      'Jaime Gabriel Alves Pereira – Graduando em Ciência da Computação (UFPI)',
      'Luís Felipe Cabral Brito – Graduando em Ciência da Computação (UFPI)',
      'Ramon Matheus da Silva Fernandes – Graduando em Ciência da Computação (UFPI)',
      'Samara Feitosa de Sousa – Graduanda em Ciência da Computação (UFPI)'
    ]
  },
  documentos: {
    id: 'documentos',
    nome: 'GT Documentos',
    foto: '/images/grupos/gt_documentos.jpg',
    objetivo: 'Pesquisar, extrair, sistematizar e alimentar a Plataforma do Observatório com os documentos sobre a política educacional piauiense – legislação, documentos orientadores e produção científica',
    membros: [
      { subtitulo: 'Equipe Parnaíba I', membros: [
        'Samara de Oliveira Silva – doutora em Educação (UESPI) - coordenação',
        'Ana Beatriz Lima da Silva - Graduanda em Pedagogia (UESPI)',
        'Ana Carolina de Araujo Caldas - Graduanda em Pedagogia (UESPI)',
        'Ana Kesya Soares Araújo - Graduanda em Pedagogia (UESPI)',
        'Bianca Cordeiro Lessa - Graduanda em Pedagogia (UESPI)',
        'Jheniffer Gomes Lima - Graduanda em Pedagogia (UESPI)',
        'Maria Isabela Val de Oliveira - Graduanda em Pedagogia (UESPI)',
        'Melissa Maria Gomes Carvalho - Graduanda em Pedagogia (UESPI)',
        'Susy Silva dos Santos - Graduanda em Pedagogia (UESPI)',
        'Vinicius José Veras do Nascimento - Graduando em Pedagogia (UESPI)',
        'Vivianne Maria Araújo dos Santos - Graduanda em Pedagogia (UESPI)'
      ]},
      { subtitulo: 'Equipe Parnaíba II', membros: [
        'Maria de Jesus Rodrigues Duarte - doutoranda em Educação (UFPI) - coordenação',
        'Francisca Lima Maciel - Graduanda em Pedagogia (UESPI)',
        'Gabriele Xavier Pereira – Graduanda em Pedagogia (UESPI)',
        'Lucilene de Almeida Muniz - Graduanda em Pedagogia (UESPI)'
      ]},
      { subtitulo: 'Equipe de Teresina', membros: [
        'Maria Clara de Sousa Costa – Doutoranda em Educação (UFPI) - coordenação',
        'Maria de Jesus Rodrigues Duarte – Doutoranda em Educação (UFPI/SEMEC) – coordenação',
        'Ana Sophia Meireles de Oliveira – Graduanda em Pedagogia (UFPI)',
        'Ana Sthefany Andrade Araújo - Graduanda em Pedagogia (UFPI)',
        'Andreia Martins - Doutora em Educação (UFPI)',
        'Carmen Lucia de Sousa Lima – Doutora em Educação (UFPI)',
        'Cristina Maria dos Santos Costa – Graduanda em Biblioteconomia (UESPI)',
        'Felipe Santiago Gomes da Silva - Graduando em Pedagogia (UFPI)',
        'Letícia Rodrigues De França – Graduanda em Biblioteconomia (UESPI)',
        'Rigoberto Veloso de Carvalho – Doutorando em Políticas Públicas (Biblioteca Central UFPI)',
        'Rosana Evangelista da Cruz - Doutora em Educação (UFPI)',
        'Vinícius Silva de Sousa - Mestrando em Educação (UFPI)',
        'Ylanna Marcelly de Sousa Morais - Graduanda em Pedagogia (UFPI)'
      ]},
      { subtitulo: 'Equipe Floriano', membros: [
        'Romildo de Castro Araújo - Doutor em Educação (UFPI) - coordenação',
        'Cristiana Barra Teixeira – Doutora em Educação (UFPI)',
        'Johnny de Sousa Silva - Graduando em Pedagogia (UFPI)',
        'José Ítalo Freitas Alves - Graduando em Pedagogia (UFPI)',
        'Lygia Maria dos Santos Ferreira - Graduanda em Pedagogia (UFPI)',
        'Maria do Socorro Soares – Doutora em Educação (UFPI)',
        'Maria Mônica Batista de Sousa - Graduanda em Pedagogia (UFPI)',
        'Maria Vitória Rodrigues Coutinho - Graduanda em Pedagogia (UFPI)',
        'Yasmin Gabriela dos Santos - Graduanda em Pedagogia (UFPI)'
      ]}
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

  const openGTModal = (gtId) => {
  setSelectedGT(gtsData[gtId]);
  setIsGTModalOpen(true);
};

const closeGTModal = () => {
  setIsGTModalOpen(false);
  setSelectedGT(null);
};

const goToNextGT = () => {
  const gtIds = Object.keys(gtsData);
  const currentIndex = gtIds.indexOf(selectedGT.id);
  const nextIndex = (currentIndex + 1) % gtIds.length;
  setSelectedGT(gtsData[gtIds[nextIndex]]);
};

const goToPrevGT = () => {
  const gtIds = Object.keys(gtsData);
  const currentIndex = gtIds.indexOf(selectedGT.id);
  const prevIndex = currentIndex === 0 ? gtIds.length - 1 : currentIndex - 1;
  setSelectedGT(gtsData[gtIds[prevIndex]]);
};

useEffect(() => {
  const handleKeyDown = (event) => {
    if (!isGTModalOpen) return;
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevGT();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNextGT();
        break;
      case 'Escape':
        event.preventDefault();
        closeGTModal();
        break;
      default:
        break;
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isGTModalOpen, selectedGT]);
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
        onClick={() => openGTModal('dados')}
      >
        <div className="text-blue-600 text-3xl mb-4 flex justify-center">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          GT Dados
        </h3>
      </div>

      {/* GT Plataforma */}
      <div 
        className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
        style={{ backgroundColor: 'var(--background-color)' }}
        onClick={() => openGTModal('plataforma')}
      >
        <div className="text-green-600 text-3xl mb-4 flex justify-center">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.4 16.6L4.8 12l-1.4 1.4L9.4 19 21 7.4 19.6 6z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          GT Plataforma
        </h3>
      </div>

      {/* GT Documentos */}
      <div 
        className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" 
        style={{ backgroundColor: 'var(--background-color)' }}
        onClick={() => openGTModal('documentos')}
      >
        <div className="text-orange-600 text-3xl mb-4 flex justify-center">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          GT Documentos
        </h3>
      </div>
    </div>
  </div>
</section>

{/* Modal dos GTs */}
{isGTModalOpen && selectedGT && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
      {/* Header do Modal com Foto */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
        {/* A IMAGEM DE FUNDO */}
        <img
          src={selectedGT.foto}
          alt={selectedGT.nome}
          className="w-full h-full object-contain"
        />
        {/* O OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* O TÍTULO */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {selectedGT.nome}
          </h2>
        </div>
        
        {/* Botão de fechar (copiado de antes) */}
        <button
          onClick={closeGTModal}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Botões de navegação (copiado de antes) */}
        <button
          onClick={goToPrevGT}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNextGT}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
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
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Objetivo
          </h3>
          <p className="text-gray-700 leading-relaxed text-justify">
            {selectedGT.objetivo}
          </p>
        </div>

        {/* Membros */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Membros
          </h3>
          <div className="space-y-3">
            {selectedGT.id === 'documentos' ? (
              selectedGT.membros.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h4 className="text-lg font-semibold text-purple-600 mb-3 mt-4">
                    {section.subtitulo}
                  </h4>
                  {section.membros.map((membro, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {membro}
                      </p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              selectedGT.membros.map((membro, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {membro}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer do Modal */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          {/* Indicadores de posição */}
          <div className="flex space-x-2">
            {Object.keys(gtsData).map((gtId) => (
              <button
                key={gtId}
                onClick={() => setSelectedGT(gtsData[gtId])}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  selectedGT.id === gtId 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Botão de fechar */}
          <button
            onClick={closeGTModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

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
                className="w-full h-full object-contain"
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
