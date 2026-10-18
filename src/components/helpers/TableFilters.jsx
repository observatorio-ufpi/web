import { Button, Collapse, Box, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import React, { useEffect, useState, useMemo } from 'react';
import { Select } from '../ui';
import YearRangeFilter from './YearRangeFilter';
import { FaixaPopulacional, municipios, Regioes } from '../../utils/municipios.mapping';
import { MOTIVO_MUNICIPIO_SELECIONADO, formatarOpcaoComDescricao } from '../ui/Select';

const findMunicipioCodigo = (nomeMunicipio) => {
  return Object.keys(municipios).find(
    codigo => municipios[codigo].nomeMunicipio === nomeMunicipio
  );
};

// Opções de tipos de tabela para dados municipais
// `descricao` é um resumo em linguagem simples, mostrado embaixo de cada
// opção no menu — os rótulos técnicos ficam, mas quem não é da área
// não precisa adivinhar o que cada um significa.
const tableTypeOptions = [
  { value: 'ownRevenues', label: 'Receita de impostos próprios', descricao: 'Quanto o município arrecadou com seus próprios impostos (IPTU, ISS, ITBI, IRRF).' },
  { value: 'constitutionalTransfersRevenue', label: 'Receita de transferências constitucionais e legais', descricao: 'Repasses que o município recebe do estado e da União (FPM, ICMS, IPVA, ITR).' },
  { value: 'municipalTaxesRevenues', label: 'Receita Líquida de Impostos do Município', descricao: 'Soma dos impostos próprios com os repasses, já descontado o que vai para o Fundeb.' },
  { value: 'additionalEducationRevenue', label: 'Receitas adicionais da educação no Município', descricao: 'Outros recursos específicos para educação, como salário-educação e transferências do FNDE (PDDE, PNAE, PNATE).' },
  { value: 'municipalFundebFundefComposition', label: 'Composição do Fundeb no Município', descricao: 'Como o Fundeb é formado e quanto volta para o município.' },
  { value: 'complementationFundebFundef', label: 'Composição da complementação do Fundeb', descricao: 'Quanto a União complementa o Fundeb deste município (VAAF, VAAT, VAAR).' },
  { value: 'constitutionalLimitMde', label: 'Limite constitucional em MDE no Município', descricao: 'Se o município está aplicando o mínimo de 25% exigido em Manutenção e Desenvolvimento do Ensino.' },
  { value: 'expensesBasicEducationFundeb', label: 'Despesas com profissionais da Educação básica do Fundeb', descricao: 'Quanto do Fundeb foi gasto com professores e outros profissionais da educação básica.' },
  { value: 'areasActivityExpense', label: 'Despesas em MDE por área de atuação', descricao: 'Gasto em educação dividido por etapa de ensino (creche, pré-escola, fundamental etc.).' },
  { value: 'basicEducationMinimalPotential', label: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB)', descricao: 'Estimativa do mínimo de recursos disponíveis para a educação básica: impostos, Fundeb, salário-educação e programas do FNDE.' },
  { value: 'complementaryProtocol', label: 'Protocolo Complementar', descricao: 'Indicadores extras de aplicação mínima em MDE e do VAAT na educação infantil.' },
];


// Opções de tipos de tabela para dados estaduais
const stateTableTypeOptions = [
  { value: 'tabela1', label: 'Receita bruta de impostos próprios do Piauí', descricao: 'Quanto o Estado arrecadou com seus próprios impostos (ICMS, IPVA, ITCD, IRRF), antes de repassar a parte dos municípios.' },
  { value: 'tabela2', label: 'Receita líquida de impostos próprios do Piauí', descricao: 'Impostos próprios do Estado depois de descontar a parte repassada aos municípios (25% do ICMS e 50% do IPVA).' },
  { value: 'tabela3', label: 'Receita bruta de transferências constitucionais', descricao: 'Repasses que o Estado recebe da União (FPE, IPI-Exportação, IOF-Ouro e compensações), antes das deduções.' },
  { value: 'tabela4', label: 'Receita líquida de transferências constitucionais', descricao: 'Repasses da União ao Estado depois de descontar a parte que vai para os municípios.' },
  { value: 'tabela5', label: 'Receita líquida resultante de impostos e transferências', descricao: 'Soma das receitas líquidas de impostos e de transferências: a base usada para calcular o mínimo de 25% em MDE.' },
  { value: 'tabela6', label: 'Receitas adicionais para financiamento do ensino', descricao: 'Recursos para a educação além dos impostos: salário-educação, programas do FNDE (PDDE, PNAE, PNATE), convênios, royalties.' },
  { value: 'tabela7', label: 'Composição do Fundeb no Piauí', descricao: 'Quanto o Estado envia ao Fundeb, quanto recebe de volta e o saldo dessa redistribuição.' },
  { value: 'tabela8', label: 'Composição da complementação do Fundeb', descricao: 'Quanto a União complementa o Fundeb no Estado, por modalidade (VAAF, VAAT, VAAR).' },
  { value: 'tabela9', label: 'Limite constitucional em MDE no Piauí', descricao: 'Se o Estado aplica o mínimo de 25% da receita de impostos em Manutenção e Desenvolvimento do Ensino.' },
  { value: 'tabela10', label: 'Despesas com profissionais da educação básica (Fundeb)', descricao: 'Quanto do Fundeb foi gasto com professores e demais profissionais da educação básica.' },
  { value: 'tabela11', label: 'Despesas em MDE por área de atuação', descricao: 'Gasto em educação dividido por etapa e área (ensino fundamental, médio, transporte escolar etc.).' },
  { value: 'tabela12', label: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB)', descricao: 'Estimativa do mínimo de recursos disponíveis para a educação básica: impostos, Fundeb, salário-educação e programas do FNDE.' },
  { value: 'tabela13', label: 'Protocolo Complementar', descricao: 'Aplicação do VAAT, despesas com pessoal ativo e inativo, despesas de capital e recursos de MDE fora do Fundeb.' },
];

// Opções de tipos de indicadores estaduais
const stateIndicatorTypeOptions = [
  { value: 'revenueComposition', label: 'Composição das Receitas', descricao: 'Peso de cada imposto e transferência na receita do Estado, ano a ano.' },
  { value: 'fundeb', label: 'Fundeb', descricao: 'Evolução dos recursos do Fundeb no Estado e da complementação da União.' },
  { value: 'mde', label: 'Manutenção e Desenvolvimento do Ensino (MDE)', descricao: 'Evolução do percentual aplicado em MDE frente ao mínimo de 25%.' },
  { value: 'educationExpense', label: 'Despesas com Educação', descricao: 'Evolução das despesas do Estado com educação.' },
  { value: 'additionalRevenue', label: 'Receitas Adicionais', descricao: 'Evolução das receitas adicionais da educação (salário-educação, FNDE, convênios).' },
  { value: 'rpeb', label: 'Composição da Receita Potencial de Educação (RPEB)', descricao: 'Como se compõe a Receita Potencial Mínima vinculada à Educação Básica.' },
];

// Opções de tipos de indicadores municipais (5 categorias principais)
const municipalIndicatorTypeOptions = [
  { value: 'financasPublicas', label: '1 - Indicadores de Finanças Públicas', descricao: 'De onde vem o dinheiro do município: impostos próprios, transferências e Fundeb.' },
  { value: 'capacidadeFinanciamento', label: '2 - Capacidade de Financiamento', descricao: 'Quanto o município tem disponível para a educação básica, no total e por aluno.' },
  { value: 'recursosFundeb', label: '3 - Indicadores dos Recursos do Fundeb', descricao: 'Peso do Fundeb nas despesas de educação e se o município ganha ou perde na redistribuição.' },
  { value: 'controleAplicacao', label: '4 - Controle da Aplicação dos Recursos', descricao: 'Se o município cumpre os mínimos legais de aplicação (MDE, Fundeb, VAAT).' },
  { value: 'investimentoEducacao', label: '5 - Investimento em Educação', descricao: 'Quanto e como o município gasta com educação: total, por aluno, pessoal e investimentos.' },
];

// Subindicadores para cada indicador principal
const municipalSubIndicatorOptions = {
  financasPublicas: [
    { value: 'composicaoReceitas', label: '1.1 - Composição das Receitas Impostos e Transferências [%]', descricao: 'Peso de cada imposto e transferência no total de receitas.' },
    { value: 'participacaoImpostosProprios', label: '1.2 - Participação da receita de impostos próprios [%]', descricao: 'Quanto da receita vem dos impostos arrecadados pelo próprio município.' },
    { value: 'participacaoTransferencias', label: '1.3 - Participação das transferências [%]', descricao: 'Quanto da receita vem de repasses do estado e da União.' },
    { value: 'razaoImpostosTransferencias', label: '1.4 - Razão entre impostos próprios e transferências', descricao: 'Quantos reais de impostos próprios para cada real de transferências.' },
    { value: 'razaoTransferenciasImpostos', label: '1.5 - Razão entre transferências e impostos próprios', descricao: 'Quantos reais de transferências para cada real de impostos próprios.' },
    { value: 'participacaoFundeb', label: '1.6 - Participação do FUNDEB [%]', descricao: 'Peso do Fundeb nas receitas do município.' },
    { value: 'receitasPorMatricula', label: '1.7 - Receitas por Matrícula na Educação Básica [R$]', descricao: 'Receitas divididas pelo número de matrículas da educação básica.' },
  ],
  capacidadeFinanciamento: [
    { value: 'rpeb', label: '2.1 - Receita Potencial Mínima Vinculada à Educação Básica (RPEb) [R$]', descricao: 'Total estimado de recursos mínimos disponíveis para a educação básica.' },
    { value: 'composicaoRpeb', label: '2.2 - Composição da RPEB [%]', descricao: 'Peso de cada fonte (impostos, Fundeb, salário-educação...) na RPEb.' },
    { value: 'rpebAlunoAno', label: '2.3 - RPEb-aluno (ano) [R$]', descricao: 'RPEb dividida pelo número de alunos, por ano.' },
    { value: 'rpebAlunoMes', label: '2.4 - RPEb-aluno (mês) [R$]', descricao: 'RPEb por aluno, por mês.' },
    { value: 'participacaoFundebRpeb', label: '2.5 - Participação do Fundeb na RPEb [%]', descricao: 'Quanto da RPEb vem do Fundeb.' },
  ],
  recursosFundeb: [
    { value: 'participacaoFundebMde', label: '3.1 - Participação do Fundeb na despesa em MDE [%]', descricao: 'Quanto da despesa em MDE é paga com recursos do Fundeb.' },
    { value: 'resultadoLiquidoFundeb', label: '3.2 - Resultado Líquido do Fundeb [%]', descricao: 'Se o município recebe do Fundeb mais (ou menos) do que contribui.' },
    { value: 'participacaoComplementacaoUniao', label: '3.3 - Participação da complementação da União no FUNDEB [%]', descricao: 'Peso da complementação da União no Fundeb do município.' },
  ],
  controleAplicacao: [
    { value: 'aplicacaoMde', label: '4.1 - Aplicação em MDE (>=25%) [%]', descricao: 'Parte da receita de impostos aplicada em MDE; o mínimo é 25%.' },
    { value: 'aplicacaoFundebProfissionais', label: '4.2 - Aplicação do Fundeb nos profissionais (>=70%) [%]', descricao: 'Parte do Fundeb gasta com profissionais da educação; o mínimo é 70%.' },
    { value: 'aplicacaoVaatInfantil', label: '4.3 - Aplicação do VAAT na Educação Infantil (>=50%) [%]', descricao: 'Parte do VAAT aplicada na educação infantil; o mínimo é 50%.' },
    { value: 'aplicacaoVaatCapital', label: '4.4 - Aplicação do VAAT em Despesa de Capital (>=15%) [%]', descricao: 'Parte do VAAT aplicada em despesas de capital (obras, equipamentos); o mínimo é 15%.' },
    { value: 'despesaEducacaoPib', label: '4.5 - Despesa total com educação em relação ao PIB [%]', descricao: 'Despesa total com educação comparada ao tamanho da economia do município (PIB).' },
  ],
  investimentoEducacao: [
    { value: 'despesaTotalEducacao', label: '5.1 - Despesa total com Educação [R$]', descricao: 'Quanto o município gastou com educação no total.' },
    { value: 'gastoAlunoAno', label: '5.2.1 - Gasto-Aluno (ano) [R$]', descricao: 'Gasto com educação dividido pelo número de alunos, por ano.' },
    { value: 'gastoAlunoMes', label: '5.2.2 - Gasto-Aluno (mês) [R$]', descricao: 'Gasto com educação por aluno, por mês.' },
    { value: 'despesaPessoalAtivo', label: '5.3 - Despesa com pessoal ativo [%]', descricao: 'Peso da folha do pessoal ativo nas despesas com educação.' },
    { value: 'despesaPessoalInativo', label: '5.4 - Despesa com pessoal inativo [%]', descricao: 'Peso de aposentados e pensionistas nas despesas com educação.' },
    { value: 'despesaCapital', label: '5.5 - Despesa de Capital [%]', descricao: 'Peso dos investimentos (obras, equipamentos) nas despesas com educação.' },
    { value: 'transferenciasPrivadas', label: '5.6 - Transferências às instituições privadas [%]', descricao: 'Parte das despesas repassada a instituições privadas conveniadas (comunitárias, filantrópicas).' },
  ],
};


const FilterComponent = ({
  onFilterChange,
  selectedMunicipio,
  territorioDeDesenvolvimentoMunicipio,
  faixaPopulacionalMunicipio,
  aglomeradoMunicipio,
  gerenciaRegionalMunicipio,
  anoInicial,
  anoFinal,
  filtersExpanded = false,
  showTableTypeFilter = false,
  showStateTableTypeFilter = false,
  showStateIndicatorTypeFilter = false,
  showMunicipalIndicatorTypeFilter = false,
  selectedTableType = 'ownRevenues',
  selectedStateTableType = 'tabela1',
  selectedStateIndicatorType = 'revenueComposition',
  selectedMunicipalIndicatorType = 'financasPublicas',
  selectedMunicipalSubIndicatorType = 'composicaoReceitas',
  showMunicipioFilters = true,
}) => {
  // Referência para o portal dos menus dropdown
  const menuPortalTarget = typeof document !== 'undefined' ? document.body : null;

  const [filters, setFilters] = useState({
    nomeMunicipio: selectedMunicipio || '',
    territorioDeDesenvolvimentoMunicipio: territorioDeDesenvolvimentoMunicipio || '',
    faixaPopulacionalMunicipio: faixaPopulacionalMunicipio || '',
    aglomeradoMunicipio: aglomeradoMunicipio || '',
    gerenciaRegionalMunicipio: gerenciaRegionalMunicipio || '',
    // Vem das props quando a sidebar abre a partir de um link com filtros na URL
    anoInicial: anoInicial || 2007,
    anoFinal: anoFinal || 2024,
  });

  // Converter os valores recebidos para o formato do react-select
  const [selectedMunicipioState, setSelectedMunicipio] = useState(
    selectedMunicipio ?
      {
        value: selectedMunicipio, // selectedMunicipio já é o código agora
        label: municipios[selectedMunicipio]?.nomeMunicipio || selectedMunicipio
      } :
      null
  );
  const [territorioState, setTerritorioDeDesenvolvimentoMunicipio] = useState(
    territorioDeDesenvolvimentoMunicipio ? { value: territorioDeDesenvolvimentoMunicipio, label: Regioes[territorioDeDesenvolvimentoMunicipio] } : null
  );
  const [faixaState, setFaixaPopulacionalMunicipio] = useState(
    faixaPopulacionalMunicipio ? { value: faixaPopulacionalMunicipio, label: FaixaPopulacional[faixaPopulacionalMunicipio] } : null
  );
  const [aglomeradoState, setAglomeradoMunicipio] = useState(
    aglomeradoMunicipio && aglomeradoMunicipio !== 'undefined' ? { value: aglomeradoMunicipio, label: `AG ${aglomeradoMunicipio}` } : null
  );
  const [gerenciaState, setGerenciaRegionalMunicipio] = useState(
    gerenciaRegionalMunicipio && gerenciaRegionalMunicipio !== 'undefined' ? { value: gerenciaRegionalMunicipio, label: `${gerenciaRegionalMunicipio}ª GRE` } : null
  );

  // Estado para o tipo de tabela (municipal)
  const [tableTypeState, setTableTypeState] = useState(
    selectedTableType ? 
      tableTypeOptions.find(opt => opt.value === selectedTableType) || tableTypeOptions[0]
      : tableTypeOptions[0]
  );

  // Estado para o tipo de tabela (estadual)
  const [stateTableTypeState, setStateTableTypeState] = useState(
    selectedStateTableType ? 
      stateTableTypeOptions.find(opt => opt.value === selectedStateTableType) || stateTableTypeOptions[0]
      : stateTableTypeOptions[0]
  );

  // Estado para o tipo de indicador (estadual)
  const [stateIndicatorTypeState, setStateIndicatorTypeState] = useState(
    selectedStateIndicatorType ? 
      stateIndicatorTypeOptions.find(opt => opt.value === selectedStateIndicatorType) || stateIndicatorTypeOptions[0]
      : stateIndicatorTypeOptions[0]
  );

  // Estado para o tipo de indicador (municipal)
  const [municipalIndicatorTypeState, setMunicipalIndicatorTypeState] = useState(
    selectedMunicipalIndicatorType ? 
      municipalIndicatorTypeOptions.find(opt => opt.value === selectedMunicipalIndicatorType) || municipalIndicatorTypeOptions[0]
      : municipalIndicatorTypeOptions[0]
  );

  // Estado para o subindicador (municipal)
  const getInitialSubIndicator = () => {
    const indicatorType = selectedMunicipalIndicatorType || 'financasPublicas';
    const subOptions = municipalSubIndicatorOptions[indicatorType] || [];
    if (selectedMunicipalSubIndicatorType) {
      return subOptions.find(opt => opt.value === selectedMunicipalSubIndicatorType) || subOptions[0];
    }
    return subOptions[0] || null;
  };
  const [municipalSubIndicatorState, setMunicipalSubIndicatorState] = useState(getInitialSubIndicator());

  // Lógica de filtros dependentes - baseado nos filtros de localização
  const baseFilteredMunicipios = useMemo(() => {
    const territorioLabel = territorioState ? Regioes[territorioState.value] : null;
    const faixaLabel = faixaState ? FaixaPopulacional[faixaState.value] : null;

    return Object.values(municipios).filter((m) => {
      if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel) return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (aglomeradoState && String(m.aglomerado) !== String(aglomeradoState.value)) return false;
      if (gerenciaState) {
        const gerencias = String(m.gerencia).split(',').map((g) => g.trim());
        if (!gerencias.includes(String(gerenciaState.value))) return false;
      }
      return true;
    });
  }, [territorioState, faixaState, aglomeradoState, gerenciaState]);

  // Desabilitar outros filtros quando município específico é selecionado
  const otherLocalityDisabled = !!selectedMunicipioState;

  // Opções filtradas baseadas nos filtros de localização
  const filteredMunicipioOptions = useMemo(() => {
    return Object.entries(municipios)
      .filter(([, m]) => baseFilteredMunicipios.includes(m))
      .map(([key, { nomeMunicipio }]) => ({ value: key, label: nomeMunicipio }));
  }, [baseFilteredMunicipios]);

  const filteredTerritorioOptions = useMemo(() => {
    const uniqueLabels = [...new Set(baseFilteredMunicipios.map((m) => m.territorioDesenvolvimento).filter(Boolean))];
    return Object.entries(Regioes)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredFaixaPopulacionalOptions = useMemo(() => {
    const uniqueLabels = [...new Set(baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean))];
    return Object.entries(FaixaPopulacional)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredAglomeradoOptions = useMemo(() => {
    return [...new Set(baseFilteredMunicipios.map((m) => m.aglomerado).filter((a) => a && a !== 'undefined'))]
      .sort((a, b) => Number(a) - Number(b))
      .map((a) => ({ value: a, label: `AG ${a}` }));
  }, [baseFilteredMunicipios]);

  const filteredGerenciaOptions = useMemo(() => {
    return [...new Set(
      baseFilteredMunicipios
        .map((m) => m.gerencia)
        .filter((g) => g && g !== 'undefined')
        .flatMap((g) => (g.includes(',') ? g.split(',').map((x) => x.trim()) : [g]))
    )]
      .sort((a, b) => Number(a) - Number(b))
      .map((g) => ({ value: g, label: `${g}ª GRE` }));
  }, [baseFilteredMunicipios]);

  // Função para limpar filtros inválidos quando as opções mudam
  const useClearInvalidFilter = (value, setter, options) => {
    useEffect(() => {
      if (value && options.length > 0) {
        const exists = options.some((opt) => opt.value === value);
        if (!exists) {
          setter(null);
        }
      }
    }, [value, setter, options]);
  };

  // Aplicar limpeza de filtros inválidos
  useClearInvalidFilter(selectedMunicipioState?.value, setSelectedMunicipio, filteredMunicipioOptions);
  useClearInvalidFilter(territorioState?.value, setTerritorioDeDesenvolvimentoMunicipio, filteredTerritorioOptions);
  useClearInvalidFilter(faixaState?.value, setFaixaPopulacionalMunicipio, filteredFaixaPopulacionalOptions);
  useClearInvalidFilter(aglomeradoState?.value, setAglomeradoMunicipio, filteredAglomeradoOptions);
  useClearInvalidFilter(gerenciaState?.value, setGerenciaRegionalMunicipio, filteredGerenciaOptions);

  // Limpar filtros de localização quando um município específico é selecionado
  useEffect(() => {
    if (selectedMunicipioState) {
      setTerritorioDeDesenvolvimentoMunicipio(null);
      setFaixaPopulacionalMunicipio(null);
      setAglomeradoMunicipio(null);
      setGerenciaRegionalMunicipio(null);
    }
  }, [selectedMunicipioState]);

  useEffect(() => {
    setSelectedMunicipio(
      selectedMunicipio ?
        {
          value: selectedMunicipio, // selectedMunicipio já é o código agora
          label: municipios[selectedMunicipio]?.nomeMunicipio || selectedMunicipio
        } :
        null
    );
    setTerritorioDeDesenvolvimentoMunicipio(territorioDeDesenvolvimentoMunicipio ? { value: territorioDeDesenvolvimentoMunicipio, label: Regioes[territorioDeDesenvolvimentoMunicipio] } : null);
    setFaixaPopulacionalMunicipio(faixaPopulacionalMunicipio ? { value: faixaPopulacionalMunicipio, label: FaixaPopulacional[faixaPopulacionalMunicipio] } : null);
    setAglomeradoMunicipio(aglomeradoMunicipio && aglomeradoMunicipio !== 'undefined' ? { value: aglomeradoMunicipio, label: `AG ${aglomeradoMunicipio}` } : null);
    setGerenciaRegionalMunicipio(gerenciaRegionalMunicipio && gerenciaRegionalMunicipio !== 'undefined' ? { value: gerenciaRegionalMunicipio, label: `${gerenciaRegionalMunicipio}ª GRE` } : null);
  }, [selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaRegionalMunicipio, anoInicial, anoFinal]);

  const handleSearch = () => {
    onFilterChange({
      codigoMunicipio: selectedMunicipioState ? selectedMunicipioState.value : null,
      nomeMunicipio: selectedMunicipioState ? selectedMunicipioState.label : null,
      territorioDeDesenvolvimentoMunicipio: territorioState ? territorioState.value : null,
      faixaPopulacionalMunicipio: faixaState ? faixaState.value : null,
      aglomeradoMunicipio: aglomeradoState ? aglomeradoState.value : null,
      gerenciaRegionalMunicipio: gerenciaState ? gerenciaState.value : null,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      tableType: tableTypeState ? tableTypeState.value : 'ownRevenues',
      stateTableType: stateTableTypeState ? stateTableTypeState.value : 'tabela1',
      stateIndicatorType: stateIndicatorTypeState ? stateIndicatorTypeState.value : 'revenueComposition',
      municipalIndicatorType: municipalIndicatorTypeState ? municipalIndicatorTypeState.value : 'financasPublicas',
      municipalSubIndicatorType: municipalSubIndicatorState ? municipalSubIndicatorState.value : 'composicaoReceitas',
      loading: true,
    });
  };

  const handleClearFilters = () => {
    setSelectedMunicipio(null);
    setTerritorioDeDesenvolvimentoMunicipio(null);
    setFaixaPopulacionalMunicipio(null);
    setAglomeradoMunicipio(null);
    setGerenciaRegionalMunicipio(null);
    setFilters({...filters, anoInicial: 2007, anoFinal: 2024});
    setTableTypeState(tableTypeOptions[0]); // Reset para o primeiro tipo (ownRevenues)
    setStateTableTypeState(stateTableTypeOptions[0]); // Reset para o primeiro tipo estadual (tabela1)
    setStateIndicatorTypeState(stateIndicatorTypeOptions[0]); // Reset para o primeiro tipo de indicador estadual
    setMunicipalIndicatorTypeState(municipalIndicatorTypeOptions[0]); // Reset para o primeiro tipo de indicador municipal
    setMunicipalSubIndicatorState(municipalSubIndicatorOptions['financasPublicas'][0]); // Reset para o primeiro subindicador
    
    onFilterChange({
      codigoMunicipio: null,
      nomeMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: null,
      gerenciaRegionalMunicipio: null,
      anoInicial: 2007,
      anoFinal: 2024,
      tableType: 'ownRevenues',
      stateTableType: 'tabela1',
      stateIndicatorType: 'revenueComposition',
      municipalIndicatorType: 'financasPublicas',
      municipalSubIndicatorType: 'composicaoReceitas',
      loading: false,
    });
  };



  return (
    <div className="flex flex-col gap-2 p-0 m-0 w-full">
      {/* Header de Filtros */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Consulta</h3>
      </div>

      {/* Filtros recolhíveis */}
      <div className="flex flex-col gap-2 w-full">
        {/* Tipo de Dados Municipal - Exibido apenas quando showTableTypeFilter é true */}
        {showTableTypeFilter && (
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600 mb-0.5">Tipo de Dados</label>
            <Select
              value={tableTypeState}
              onChange={setTableTypeState}
              options={tableTypeOptions}
              formatOptionLabel={formatarOpcaoComDescricao}
              placeholder="Selecione o tipo..."
              size="xs"
            />
          </div>
        )}

        {/* Tipo de Dados Estadual - Exibido apenas quando showStateTableTypeFilter é true */}
        {showStateTableTypeFilter && (
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600 mb-0.5">Tipo de Dados</label>
            <Select
              value={stateTableTypeState}
              onChange={setStateTableTypeState}
              options={stateTableTypeOptions}
              formatOptionLabel={formatarOpcaoComDescricao}
              placeholder="Selecione o tipo..."
              size="xs"
            />
          </div>
        )}

        {/* Tipo de Indicador Estadual - Exibido apenas quando showStateIndicatorTypeFilter é true */}
        {showStateIndicatorTypeFilter && (
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600 mb-0.5">Tipo de Indicador</label>
            <Select
              value={stateIndicatorTypeState}
              onChange={setStateIndicatorTypeState}
              options={stateIndicatorTypeOptions}
              formatOptionLabel={formatarOpcaoComDescricao}
              placeholder="Selecione o indicador..."
              size="xs"
            />
          </div>
        )}

        {/* Tipo de Indicador Municipal - Exibido apenas quando showMunicipalIndicatorTypeFilter é true */}
        {showMunicipalIndicatorTypeFilter && (
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600 mb-0.5">Indicador</label>
            <Select
              value={municipalIndicatorTypeState}
              onChange={(newValue) => {
                setMunicipalIndicatorTypeState(newValue);
                // Resetar subindicador quando mudar o indicador
                const subOptions = municipalSubIndicatorOptions[newValue?.value] || [];
                setMunicipalSubIndicatorState(subOptions[0] || null);
              }}
              options={municipalIndicatorTypeOptions}
              formatOptionLabel={formatarOpcaoComDescricao}
              placeholder="Selecione o indicador..."
              size="xs"
            />
          </div>
        )}

        {/* Subindicador Municipal - Exibido apenas quando showMunicipalIndicatorTypeFilter é true */}
        {showMunicipalIndicatorTypeFilter && municipalIndicatorTypeState && (
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600 mb-0.5">Subindicador</label>
            <Select
              value={municipalSubIndicatorState}
              onChange={setMunicipalSubIndicatorState}
              options={municipalSubIndicatorOptions[municipalIndicatorTypeState.value] || []}
              formatOptionLabel={formatarOpcaoComDescricao}
              placeholder="Selecione o subindicador..."
              size="xs"
            />
          </div>
        )}

        {/* Filtros de Município - Exibidos apenas quando showMunicipioFilters é true */}
        {showMunicipioFilters && (
          <>
            {/* Município - Sempre visível */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Município</label>
              <Select
                value={selectedMunicipioState}
                onChange={setSelectedMunicipio}
                options={filteredMunicipioOptions}
                placeholder="Selecione..."
                size="xs"
                isClearable
              />
            </div>

            {/* Collapser para filtros de localização */}
            <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
              <div className="flex flex-col gap-2 w-full border-t border-line pt-3">
                {/* Território */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Território</label>
                  <Select
                        value={territorioState}
                        onChange={setTerritorioDeDesenvolvimentoMunicipio}
                        options={filteredTerritorioOptions}
                        placeholder="Selecione..."
                        size="xs"
                        isClearable
                        disabled={otherLocalityDisabled}
                        disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                      />
                </div>

                {/* Faixa Populacional */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">Faixa Populacional</label>
                  <Select
                        value={faixaState}
                        onChange={setFaixaPopulacionalMunicipio}
                        options={filteredFaixaPopulacionalOptions}
                        placeholder="Selecione..."
                        size="xs"
                        isClearable
                        disabled={otherLocalityDisabled}
                        disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                      />
                </div>

                {/* Aglomerado e Gerência em linha */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Aglomerado</label>
                    <Select
                          value={aglomeradoState}
                          onChange={setAglomeradoMunicipio}
                          options={filteredAglomeradoOptions}
                          placeholder="AG"
                          fullWidth
                          size="xxs"
                          isClearable
                          disabled={otherLocalityDisabled}
                          disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                        />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Gerência</label>
                    <Select
                          value={gerenciaState}
                          onChange={setGerenciaRegionalMunicipio}
                          options={filteredGerenciaOptions}
                          placeholder="GRE"
                          fullWidth
                          size="xxs"
                          isSearchable={false}
                          isClearable
                          disabled={otherLocalityDisabled}
                          disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                        />
                  </div>
                </div>
              </div>
            </Collapse>
          </>
        )}

        {/* Período */}
        <div className="w-full border-t border-line pt-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Período</label>
          <YearRangeFilter
            startYear={filters.anoInicial}
            endYear={filters.anoFinal}
            onStartYearChange={(year) => setFilters({...filters, anoInicial: year})}
            onEndYearChange={(year) => setFilters({...filters, anoFinal: year})}
            minYear={2007}
            maxYear={2024}
          />
        </div>

        {/* Botões — fixos no rodapé da sidebar enquanto os filtros estão na tela,
            pra não precisar rolar até o fim (principalmente no celular) */}
        <div
          className="flex gap-2 w-full pt-3 pb-3 border-t border-line sticky bottom-0 z-10"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <Button
            variant="contained"
            onClick={handleSearch}
            data-tour="mostrar"
            fullWidth
            size="small"
            sx={{ fontSize: '0.875rem' }}
          >
            Mostrar
          </Button>
          <Button
            variant="text"
            onClick={handleClearFilters}
            size="small"
            sx={{ fontSize: '0.8125rem', px: 2 }}
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
