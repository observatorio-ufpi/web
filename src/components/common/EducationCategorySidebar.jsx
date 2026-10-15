import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaBars,
  FaInfoCircle,
  FaTimes,
  FaDollarSign,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../layouts/EducationLayout";
import { Select } from "../ui";
import { Button } from "@mui/material";
import {
  municipios,
  Regioes,
  FaixaPopulacional,
} from "../../utils/citiesMapping";
import YearRangeFilter from "../helpers/YearRangeFilter";
import { useEducationFilters } from "../../contexts/EducationFilterContext";
import { MOTIVO_MUNICIPIO_SELECIONADO, formatarOpcaoComDescricao } from '../ui/Select';

const EducationCategorySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  const filters = useEducationFilters();

  // Estado local para o tipo selecionado por categoria
  const [selectedTypeByCategory, setSelectedTypeByCategory] = useState({
    basica: "enrollment",
    superior: "university/count",
    taxas: "pop_out_school",
    condicoes: "infraestrutura",
  });

  const handleVoltar = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Obter a categoria atual da URL
  const getCurrentCategory = () => {
    if (location.pathname.includes("/basica")) return "basica";
    if (location.pathname.includes("/condicoes-de-oferta")) return "condicoes";
    if (location.pathname.includes("/superior")) return "superior";
    if (location.pathname.includes("/taxas")) return "taxas";
    return "basica";
  };

  const currentCategory = getCurrentCategory();

  const categories = [
    {
      id: "basica",
      label: "Educação Básica",
      path: "/dados-educacionais/basica",
    },
    {
      id: "condicoes",
      label: "Condições de Oferta",
      path: "/dados-educacionais/condicoes-de-oferta",
    },
    {
      id: "superior",
      label: "Educação Superior",
      path: "/dados-educacionais/superior",
    },
    { id: "taxas", label: "Indicadores", path: "/dados-educacionais/taxas" },
  ];

  // Mapear filtros por categoria
  const filtersByCategory = {
    basica: [
      { value: "enrollment", label: "Matrículas", descricao: "Número de alunos matriculados na educação básica." },
      { value: "school/count", label: "Escolas", descricao: "Quantidade de escolas em funcionamento." },
      { value: "class", label: "Turmas", descricao: "Quantidade de turmas." },
      { value: "teacher", label: "Professores", descricao: "Número de professores da educação básica." },
      { value: "auxiliar", label: "Pessoal Auxiliar", descricao: "Profissionais auxiliares que atuam nas turmas, além dos professores." },
      { value: "employees", label: "Funcionários", descricao: "Demais profissionais das escolas (administração, limpeza, merenda etc.)." },
    ],
    superior: [
      { value: "university/count", label: "Número de instituições", descricao: "Quantidade de instituições de ensino superior." },
      { value: "university_enrollment", label: "Matrículas", descricao: "Número de alunos matriculados em cursos de graduação." },
      { value: "university_teacher", label: "Docentes", descricao: "Número de professores do ensino superior." },
      { value: "course_count", label: "Cursos", descricao: "Quantidade de cursos de graduação oferecidos." },
    ],
    taxas: [
      { value: "pop_out_school", label: "Alunos fora da escola", descricao: "Crianças e jovens em idade escolar que não frequentam a escola." },
      { value: "adjusted_liquid_frequency", label: "Frequência líquida", descricao: "Percentual da população que frequenta a etapa de ensino adequada à sua idade." },
      { value: "iliteracy_rate", label: "Taxa de analfabetismo", descricao: "Percentual de pessoas com 15 anos ou mais que não sabem ler e escrever." },
      {
        value: "superior_education_conclusion_tax",
        label: "Taxa de conclusão (superior)", descricao: "Percentual da população que concluiu o ensino superior."
      },
      {
        value: "basic_education_conclusion",
        label: "Taxa de conclusão (básico)", descricao: "Percentual da população que concluiu a educação básica."
      },
      { value: "instruction_level", label: "Nível de instrução", descricao: "Distribuição da população pelo maior nível de escolaridade alcançado." },
    ],
    condicoes: [],
  };

  // Filtros de localização comuns
  const baseFilteredMunicipios = useMemo(() => {
    return Object.values(municipios).filter((m) => {
      const territorioLabel = filters.territory
        ? Regioes[filters.territory]
        : null;
      const faixaLabel = filters.faixaPopulacional
        ? FaixaPopulacional[filters.faixaPopulacional]
        : null;

      if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel)
        return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (
        filters.aglomerado &&
        String(m.aglomerado) !== String(filters.aglomerado)
      )
        return false;
      if (filters.gerencia) {
        const gerencias = String(m.gerencia)
          .split(",")
          .map((g) => g.trim());
        if (!gerencias.includes(String(filters.gerencia))) return false;
      }
      return true;
    });
  }, [
    filters.territory,
    filters.faixaPopulacional,
    filters.aglomerado,
    filters.gerencia,
  ]);

  const otherLocalityDisabled = !!filters.city;

  const filteredMunicipioOptions = useMemo(() => {
    return Object.entries(municipios)
      .filter(([, m]) => baseFilteredMunicipios.includes(m))
      .map(([key, { nomeMunicipio }]) => ({
        value: key,
        label: nomeMunicipio,
      }));
  }, [baseFilteredMunicipios]);

  const filteredTerritorioOptions = useMemo(() => {
    const uniqueLabels = [
      ...new Set(
        baseFilteredMunicipios
          .map((m) => m.territorioDesenvolvimento)
          .filter(Boolean),
      ),
    ];
    return Object.entries(Regioes)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredFaixaPopulacionalOptions = useMemo(() => {
    const uniqueLabels = [
      ...new Set(
        baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean),
      ),
    ];
    return Object.entries(FaixaPopulacional)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredAglomeradoOptions = useMemo(() => {
    return [
      ...new Set(
        baseFilteredMunicipios
          .map((m) => m.aglomerado)
          .filter((a) => a && a !== "undefined"),
      ),
    ]
      .sort((a, b) => Number(a) - Number(b))
      .map((a) => ({ value: a, label: `AG ${a}` }));
  }, [baseFilteredMunicipios]);

  const filteredGerenciaOptions = useMemo(() => {
    return [
      ...new Set(
        baseFilteredMunicipios
          .map((m) => m.gerencia)
          .filter((g) => g && g !== "undefined")
          .flatMap((g) =>
            g.includes(",") ? g.split(",").map((x) => x.trim()) : [g],
          ),
      ),
    ]
      .sort((a, b) => Number(a) - Number(b))
      .map((g) => ({ value: g, label: `${g}ª GRE` }));
  }, [baseFilteredMunicipios]);
  const selectedFilterOptions = (filters.selectedFilters || []).filter(Boolean);

  const structureOptions = selectedFilterOptions.map((item) => ({
    value: item.value,
    label: item.label,
  }));
  const isHistoricalRange = filters.startYear !== filters.endYear;
  const YEAR_OPTION = { value: "ano", label: "Ano" };

  const applyTableStructure = (selectedSide, selectedValue) => {
    const value = selectedValue ? selectedValue.value : "";

    const selectedFilters = selectedFilterOptions.map((f) => f.value);
    // 2 filtros + ano único
    if (!isHistoricalRange && selectedFilters.length === 2) {
      // usuário limpou um lado
      if (!value) {
        const remainingFilter =
          selectedSide === "row"
            ? selectedFilters.find((f) => f !== filters.columnDimension) ||
              filters.columnDimension
            : selectedFilters.find((f) => f !== filters.rowDimension) ||
              filters.rowDimension;

        if (selectedSide === "row") {
          filters.setRowDimension("");
          filters.setColumnDimension(remainingFilter || "");
        } else {
          filters.setColumnDimension("");
          filters.setRowDimension(remainingFilter || "");
        }

        return;
      }

      const otherFilter = selectedFilters.find((f) => f !== value);

      if (selectedSide === "row") {
        filters.setRowDimension(value);
        filters.setColumnDimension(otherFilter || "");
      } else {
        filters.setColumnDimension(value);
        filters.setRowDimension(otherFilter || "");
      }

      return;
    }
    // 1 filtro + ano único
    if (!isHistoricalRange && selectedFilterOptions.length === 1) {
      if (selectedSide === "row") {
        filters.setRowDimension?.(value || "");
        filters.setColumnDimension?.("");
      } else {
        filters.setColumnDimension?.(value || "");
        filters.setRowDimension?.("");
      }

      return;
    }
    // série histórica + 1 filtro
    if (isHistoricalRange && selectedFilters.length === 1) {
      if (!value) {
        filters.setRowDimension("");
        filters.setColumnDimension("");
        return;
      }

      if (selectedSide === "row") {
        filters.setRowDimension(value);
        filters.setColumnDimension("ano");
      } else {
        filters.setColumnDimension(value);
        filters.setRowDimension("ano");
      }

      return;
    }

    // fallback
    if (selectedSide === "row") {
      filters.setRowDimension(value);
    } else {
      filters.setColumnDimension(value);
    }
  };

  const canUseTableStructure =
    currentCategory === "basica" &&
    selectedFilterOptions.length > 0 &&
    ((!isHistoricalRange && selectedFilterOptions.length <= 2) ||
      (isHistoricalRange && selectedFilterOptions.length === 1));
  return (
    <>
      {/* Botão para abrir/fechar a sidebar */}
      <button
        onClick={toggleSidebar}
        aria-label="Abrir menu de filtros"
        aria-expanded={isOpen}
        className={`fixed top-4 left-4 z-50 p-2 bg-ink text-white rounded-lg shadow-lg hover:bg-brand-dark transition-colors ${isOpen ? 'hidden' : ''}`}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        aria-label="Menu de filtros"
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 shadow-lg sidebar-scroll`}
        style={{
          width: isOpen ? "20rem" : "4rem",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E7DED6",
        }}
      >
        {/* Header da Sidebar */}
        <div className="relative p-3 pt-12 border-b border-line">
          <button
            onClick={toggleSidebar}
            className="absolute top-3 right-3 z-50 p-2 bg-ink text-white rounded-lg shadow-lg hover:bg-brand-dark transition-colors"
            aria-label="Fechar menu de filtros"
          >
            <FaTimes />
          </button>
          <div className="flex items-center mt-0 mb-2">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logos/logo-opepi-v2.png"
                alt="opepi"
                className="h-10 w-auto mr-2"
              />
              <div className={`${isOpen ? "block" : "hidden"} md:block`}>
                <p className="text-xs text-gray-600 leading-tight">
                  observatório da política educacional piauiense
                </p>
              </div>
            </Link>
          </div>
        </div>


        {/* Navegação */}
        <nav className="p-3 space-y-3">
          {/* Categorias como abas (antes: só o nome aqui e um select no topo da página) */}
          <nav aria-label="Categorias de dados educacionais">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F6F3F2] p-1">
              {categories.map((categoria) => {
                const ativa = categoria.id === currentCategory;
                return (
                  <Link
                    key={categoria.id}
                    to={categoria.path}
                    aria-current={ativa ? "page" : undefined}
                    className={`rounded-lg px-2 py-2 text-center text-xs leading-tight transition-colors duration-150 ${
                      ativa
                        ? "bg-white font-semibold text-ink shadow-sm"
                        : "font-medium text-muted hover:bg-white/60 hover:text-ink"
                    }`}
                  >
                    {categoria.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Tipo de Dado */}
          {currentCategory !== "condicoes" && (
            <div>
              <label
                className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block ${isOpen ? "block" : "hidden"} md:block`}
              >
                Tipo
              </label>
              <Select
                value={
                  filtersByCategory[currentCategory]?.find(
                    (opt) =>
                      opt.value === selectedTypeByCategory[currentCategory],
                  ) || null
                }
                onChange={(selectedOption) => {
                  setSelectedTypeByCategory({
                    ...selectedTypeByCategory,
                    [currentCategory]: selectedOption.value,
                  });
                  if (filters.setType) filters.setType(selectedOption.value);
                  filters.setSelectedFilters?.([]);
                  filters.setRowDimension?.("");
                  filters.setColumnDimension?.("");
                }}
                options={filtersByCategory[currentCategory] || []}
                formatOptionLabel={formatarOpcaoComDescricao}
                placeholder="Selecione o tipo"
                size="xs"
              />
            </div>
          )}

          {/* Filtros Múltiplos */}
          <div>
            <label
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block ${isOpen ? "block" : "hidden"} md:block`}
            >
              Filtros
            </label>
            {currentCategory === "basica" && (
              <Select
                value={filters.selectedFilters}
                onChange={(newValue) => {
                  const isHistoricalRange =
                    filters.startYear !== filters.endYear;
                  let finalValue = [];

                  if (isHistoricalRange) {
                    finalValue = newValue.slice(-1);
                  } else if (newValue.length <= 2) {
                    finalValue = newValue;
                  } else {
                    finalValue = newValue.slice(-2);
                  }

                  filters.setSelectedFilters?.(finalValue);

                  const values = finalValue.map((item) => item.value);

                  if (
                    filters.rowDimension &&
                    filters.rowDimension !== "ano" &&
                    !values.includes(filters.rowDimension)
                  ) {
                    filters.setRowDimension?.("");
                  }

                  if (
                    filters.columnDimension &&
                    filters.columnDimension !== "ano" &&
                    !values.includes(filters.columnDimension)
                  ) {
                    filters.setColumnDimension?.("");
                  }
                }}
                options={[
                  { value: "etapa", label: "Etapa de Ensino", descricao: "Separa os números por etapa: creche, pré-escola, fundamental, médio..." },
                  { value: "localidade", label: "Localidade", descricao: "Separa entre zona urbana e rural." },
                  { value: "dependencia", label: "Dependência Administrativa", descricao: "Separa por rede: federal, estadual, municipal ou privada." },
                  { value: "municipio", label: "Município", descricao: "Mostra um resultado para cada município." },
                ]}
                formatOptionLabel={formatarOpcaoComDescricao}
                isMulti
                placeholder="Selecione filtros"
                size="xs"
              />
            )}
            {currentCategory === "superior" && (
              <Select
                value={filters.selectedFilters}
                onChange={(newValue) => {
                  filters.setSelectedFilters?.(newValue);
                }}
                options={[
                  { value: "modalidade", label: "Modalidade", descricao: "Separa entre ensino presencial e a distância." },
                  {
                    value: "categoriaAdministrativa",
                    label: "Categoria Administrativa", descricao: "Separa entre instituições públicas e privadas."
                  },
                  { value: "faixaEtariaSuperior", label: "Faixa Etária", descricao: "Separa os alunos por faixa de idade." },
                  {
                    value: "organizacaoAcademica",
                    label: "Organização Acadêmica", descricao: "Separa por tipo de instituição: universidade, centro universitário, faculdade, instituto federal."
                  },
                  {
                    value: "instituicaoEnsino",
                    label: "Instituição de Ensino", descricao: "Mostra um resultado para cada instituição."
                  },
                  { value: "municipio", label: "Município", descricao: "Mostra um resultado para cada município." },
                ]}
                formatOptionLabel={formatarOpcaoComDescricao}
                isMulti
                placeholder="Selecione filtros"
                size="xs"
              />
            )}
            {currentCategory === "condicoes" && (
              <Select
                value={filters.selectedFilters}
                onChange={(newValue) => {
                  filters.setSelectedFilters?.(newValue);
                }}
                options={[
                  {
                    value: "local_funcionamento",
                    label: "Local de Funcionamento", descricao: "Onde a escola funciona: prédio próprio, cedido ou outro espaço."
                  },
                  {
                    value: "infraestrutura_basica",
                    label: "Infraestrutura Básica", descricao: "Água, energia, esgoto, coleta de lixo e banheiros."
                  },
                  {
                    value: "espacos_pedagogicos",
                    label: "Espaços Pedagógicos", descricao: "Biblioteca, laboratórios, quadra, sala de leitura etc."
                  },
                  { value: "equipamentos", label: "Equipamentos", descricao: "Computadores, internet, projetores e outros equipamentos." },
                  { value: "materiais", label: "Materiais", descricao: "Materiais pedagógicos disponíveis na escola." },
                ]}
                formatOptionLabel={formatarOpcaoComDescricao}
                isMulti
                placeholder="Selecione aspectos"
                size="xs"
              />
            )}
          </div>

          {/* Período */}
          <div>
            <label
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block ${isOpen ? "block" : "hidden"} md:block`}
            >
              Período
            </label>
            <YearRangeFilter
              startYear={filters.startYear || 2007}
              endYear={filters.endYear || 2024}
              onStartYearChange={(year) => filters.setStartYear?.(year)}
              onEndYearChange={(year) => filters.setEndYear?.(year)}
              minYear={2007}
              maxYear={2024}
            />
          </div>
          {/* Estrutura da Tabela */}
          {canUseTableStructure && (
            <div>
              <label
                className={`text-xs font-semibold text-gray-500 mb-1 block ${isOpen ? "block" : "hidden"} md:block`}
              >
                Estrutura da Tabela
              </label>

              <div className="space-y-1.5">
                {/* Linhas */}
                <Select
                  value={
                    [...structureOptions, YEAR_OPTION].find(
                      (option) => option.value === filters.rowDimension,
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    applyTableStructure("row", selectedOption);
                  }}
                  options={
                    !isHistoricalRange && selectedFilterOptions.length === 2
                      ? selectedFilterOptions
                      : !isHistoricalRange && selectedFilterOptions.length === 1
                        ? selectedFilterOptions
                        : isHistoricalRange &&
                            selectedFilterOptions.length === 1
                          ? [...selectedFilterOptions, YEAR_OPTION]
                          : []
                  }
                  placeholder="Linhas"
                  size="xs"
                  isClearable={true}
                />

                {/* Colunas */}
                <Select
                  value={
                    [...structureOptions, YEAR_OPTION].find(
                      (option) => option.value === filters.columnDimension,
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    applyTableStructure("column", selectedOption);
                  }}
                  options={
                    !isHistoricalRange && selectedFilterOptions.length === 2
                      ? selectedFilterOptions
                      : !isHistoricalRange && selectedFilterOptions.length === 1
                        ? selectedFilterOptions
                        : isHistoricalRange &&
                            selectedFilterOptions.length === 1
                          ? [...selectedFilterOptions, YEAR_OPTION]
                          : []
                  }
                  placeholder="Colunas"
                  size="xs"
                  isClearable={true}
                />
              </div>
            </div>
          )}
          {/* Localização */}
          {(currentCategory === "basica" ||
            currentCategory === "superior" ||
            currentCategory === "condicoes") && (
            <div>
              <h3
                className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? "block" : "hidden"} md:block`}
              >
                Localização
              </h3>
              <div className="space-y-1.5">
                {/* Município */}
                <Select
                  value={
                    filteredMunicipioOptions.find(
                      (option) => option.value === filters.city,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    filters.setCity?.(
                      selectedOption ? selectedOption.value : "",
                    )
                  }
                  options={filteredMunicipioOptions}
                  placeholder="Município"
                  size="xs"
                  isClearable={true}
                />

                {/* Território */}
                <Select
                  value={
                    filteredTerritorioOptions.find(
                      (option) => option.value === filters.territory,
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    filters.setTerritory?.(
                      selectedOption ? selectedOption.value : "",
                    );
                    filters.setCity?.("");
                  }}
                  options={filteredTerritorioOptions}
                  placeholder="Território"
                  size="xs"
                  isClearable={true}
                  disabled={otherLocalityDisabled}
                  disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                />

                {/* Faixa Populacional */}
                <Select
                  value={
                    filteredFaixaPopulacionalOptions.find(
                      (option) => option.value === filters.faixaPopulacional,
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    filters.setFaixaPopulacional?.(
                      selectedOption ? selectedOption.value : "",
                    );
                    filters.setCity?.("");
                  }}
                  options={filteredFaixaPopulacionalOptions}
                  placeholder="Faixa Populacional"
                  size="xs"
                  isClearable={true}
                  disabled={otherLocalityDisabled}
                  disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                />

                {/* Aglomerado e Gerência em linha */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">
                      Aglomerado
                    </label>
                    <Select
                      value={
                        filteredAglomeradoOptions.find(
                          (option) => option.value === filters.aglomerado,
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        filters.setAglomerado?.(
                          selectedOption ? selectedOption.value : "",
                        )
                      }
                      options={filteredAglomeradoOptions}
                      placeholder="AG"
                      fullWidth
                      size="xxs"
                      isClearable={true}
                      disabled={otherLocalityDisabled}
                      disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">
                      Gerência
                    </label>
                    <Select
                      value={
                        filteredGerenciaOptions.find(
                          (option) => option.value === filters.gerencia,
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        filters.setGerencia?.(
                          selectedOption ? selectedOption.value : "",
                        )
                      }
                      options={filteredGerenciaOptions}
                      placeholder="GRE"
                      fullWidth
                      size="xxs"
                      isClearable={true}
                      disabled={otherLocalityDisabled}
                      disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          {/* Botões fixos no rodapé da sidebar (mesmo padrão da área financeira) */}
          <div
            className="flex gap-2 pt-3 pb-3 border-t border-line sticky bottom-0 z-10"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={() => {
                // Disparar a busca com o tipo selecionado localmente
                const selectedType = selectedTypeByCategory[currentCategory];
                window.dispatchEvent(
                  new CustomEvent("applyFilters", {
                    detail: {
                      ...filters,
                      type: selectedType,
                    },
                  }),
                );
              }}
              sx={{ fontSize: "0.875rem" }}
            >
              Mostrar
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                // Limpar todos os filtros
                const defaultType =
                  filtersByCategory[currentCategory]?.[0]?.value ||
                  "enrollment";
                setSelectedTypeByCategory({
                  ...selectedTypeByCategory,
                  [currentCategory]: defaultType,
                });
                filters.setType?.(defaultType);
                filters.setSelectedFilters?.([]);
                filters.setCity?.("");
                filters.setTerritory?.("");
                filters.setFaixaPopulacional?.("");
                filters.setAglomerado?.("");
                filters.setGerencia?.("");
                filters.setStartYear?.(2007);
                filters.setEndYear?.(2024);
                filters.setRowDimension?.("");
                filters.setColumnDimension?.("");

                // Disparar evento de limpeza para componentes específicos
                window.dispatchEvent(new CustomEvent("clearFilters"));
              }}
              sx={{ fontSize: "0.8125rem", px: 2, flex: "0 0 auto" }}
            >
              Limpar
            </Button>
          </div>

          {/* Alternar para Dados Financeiros */}
          <div>
            <h3
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ${isOpen ? "block" : "hidden"} md:block`}
            >
              Alternar para
            </h3>
            <button
              onClick={() => navigate("/dados-financeiros")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-gray-700 hover:bg-areia hover:text-brand`}
            >
              <FaDollarSign className="mr-2 text-sm flex-shrink-0" />
              <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                Dados Financeiros
              </span>
            </button>
          </div>

          {/* Sobre o Projeto */}
          <div className="mb-3">
            <h3
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? "block" : "hidden"} md:block`}
            >
              sobre o projeto
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/quem-somos"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    location.pathname === "/quem-somos"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaInfoCircle className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                    Quem somos
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/repositorio"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    location.pathname === "/repositorio"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaInfoCircle className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                    Repositório
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-3 border-t border-gray-200 mt-auto">
          <button
            onClick={handleVoltar}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-xs font-medium"
          >
            <FaArrowLeft className="mr-2 flex-shrink-0" />
            <span className={`${isOpen ? "block" : "hidden"} md:block`}>
              voltar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default EducationCategorySidebar;
