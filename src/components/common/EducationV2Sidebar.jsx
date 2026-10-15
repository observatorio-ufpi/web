import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Select } from '../ui';
import YearRangeFilter from '../helpers/YearRangeFilter';
import {
  municipios,
  Regioes,
  FaixaPopulacional,
} from '../../utils/citiesMapping';
import { useEducationV2Filters } from '../../contexts/EducationV2FilterContext';
import { getCatalogo, getIndicadores } from '../../services/educacaoV2Service';
import { MOTIVO_MUNICIPIO_SELECIONADO } from '../ui/Select';

/**
 * Sidebar de filtros da página basica-v2.
 *
 * O filtro de ano é dirigido pelos metadados do catálogo: os anos
 * selecionáveis são os do recorte escolhido e, em séries quebradas, os da
 * era escolhida (a consulta é feita uma era por vez).
 */
const EducationV2Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const filters = useEducationV2Filters();

  const [indicadores, setIndicadores] = useState([]);
  const [recortes, setRecortes] = useState([]);
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(false);
  const [erroCatalogo, setErroCatalogo] = useState(null);

  useEffect(() => {
    getIndicadores()
      .then(setIndicadores)
      .catch(() => setErroCatalogo('Não foi possível carregar os indicadores'));
  }, []);

  // Catálogo de recortes do indicador escolhido
  useEffect(() => {
    if (!filters.indicador) return;
    setCarregandoCatalogo(true);
    setErroCatalogo(null);

    getCatalogo(filters.indicador)
      .then((resposta) => setRecortes(resposta.recortes || []))
      .catch(() => setErroCatalogo('Não foi possível carregar o catálogo'))
      .finally(() => setCarregandoCatalogo(false));
  }, [filters.indicador]);

  // --------------------------------------------------- seleção de recorte

  // ------------------------------------------- dimensões (1D + 2D opcional)
  //
  // O usuário escolhe uma dimensão (dado 1D) e, opcionalmente, cruza com uma
  // segunda (2D) — as combinações válidas vêm do catálogo. O MAPEAMENTO de
  // disponibilidade fica explícito para o usuário:
  // - séries completas: cobrem toda a linha do tempo do indicador;
  // - séries parciais: só existem em parte do período (o alcance vai no
  //   label e o filtro de ano se restringe);
  // - séries com quebra metodológica (2021): podem ser consultadas no
  //   período inteiro, mas os resultados voltam separados por metodologia.

  const [dim1, setDim1] = useState(null);
  const [dim2, setDim2] = useState(null);

  // Linha do tempo do próprio indicador (ex.: auxiliares só existe até 2020)
  const rangeIndicador = useMemo(() => {
    if (!recortes.length) return { min: 2007, max: 2024 };
    return {
      min: Math.min(...recortes.map((r) => r.anoMin)),
      max: Math.max(...recortes.map((r) => r.anoMax)),
    };
  }, [recortes]);

  const serieCompleta = (r) =>
    r.anoMin <= rangeIndicador.min && r.anoMax >= rangeIndicador.max;

  // Sufixo de alcance para séries parciais, ex.: "(até 2020)" / "(a partir de 2021)"
  const sufixoAlcance = (r) => {
    if (serieCompleta(r)) return '';
    if (r.anoMin > rangeIndicador.min && r.anoMax >= rangeIndicador.max)
      return ` (a partir de ${r.anoMin})`;
    if (r.anoMin <= rangeIndicador.min && r.anoMax < rangeIndicador.max)
      return ` (até ${r.anoMax})`;
    return ` (${r.anoMin}–${r.anoMax})`;
  };

  // Recorte virtual "total" (sem dimensão) — usado quando nada é selecionado
  const recorteTotal = useMemo(
    () => recortes.find((r) => r.recorte === 'total') || null,
    [recortes],
  );

  const recortes2D = useMemo(
    () =>
      recortes.filter(
        (r) => r.tipoSerie !== 'quebrada' && r.dimensoes.length === 2,
      ),
    [recortes],
  );

  const opcoesDim1 = useMemo(() => {
    const toOption = (r) => ({
      value: r.dimensoes[0].nome,
      label: r.dimensoes[0].label + sufixoAlcance(r),
      recorte: r,
    });
    const ordenar = (a, b) => a.label.localeCompare(b.label, 'pt-BR');

    const base = recortes.filter(
      (r) =>
        r.tipoSerie !== 'quebrada' &&
        r.dimensoes.length === 1 &&
        r.recorte !== 'total',
    );

    const completas = base.filter(serieCompleta).map(toOption).sort(ordenar);
    const parciais = base
      .filter((r) => !serieCompleta(r))
      .map(toOption)
      .sort(ordenar);
    const quebradas = recortes
      .filter((r) => r.tipoSerie === 'quebrada')
      .map(toOption)
      .sort(ordenar);

    return [
      { label: 'Séries completas', options: completas },
      { label: 'Disponível em parte do período', options: parciais },
      { label: 'Metodologia mudou em 2021', options: quebradas },
    ].filter((g) => g.options.length > 0);
  }, [recortes, rangeIndicador]);

  // Segunda dimensão: combinações que existem no catálogo para a dimensão
  // escolhida, com o alcance explícito quando for parcial
  const opcoesDim2 = useMemo(() => {
    if (!dim1) return [];

    return recortes2D
      .filter((r) => r.dimensoes.some((d) => d.nome === dim1.value))
      .map((r) => {
        const outra = r.dimensoes.find((d) => d.nome !== dim1.value);
        return {
          value: outra.nome,
          label: outra.label + sufixoAlcance(r),
          recorte: r,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
  }, [dim1, recortes2D, rangeIndicador]);

  const aplicarRecorte = (recorte) => {
    const recorteAnterior = filters.recorte;
    filters.setRecorte(recorte);
    filters.setEra('');
    if (!recorte) return;

    // Primeiro recorte da sessão: usa o alcance completo.
    // Trocas seguintes (dimensão / cruzamento) preservam o intervalo do
    // usuário, só recortando para caber no novo alcance.
    if (!recorteAnterior) {
      filters.setStartYear(recorte.anoMin);
      filters.setEndYear(recorte.anoMax);
      return;
    }

    const start = Math.max(filters.startYear, recorte.anoMin);
    const end = Math.min(filters.endYear, recorte.anoMax);
    if (start > end) {
      filters.setStartYear(recorte.anoMin);
      filters.setEndYear(recorte.anoMax);
    } else {
      filters.setStartYear(start);
      filters.setEndYear(end);
    }
  };

  const selecionarDim1 = (opcao) => {
    setDim1(opcao);
    setDim2(null);
    // sem dimensão escolhida, cai no total do indicador
    aplicarRecorte(opcao ? opcao.recorte : recorteTotal);
  };

  // Ao carregar o catálogo (ou trocar de indicador) sem dimensão escolhida,
  // mostra o total do indicador por padrão
  useEffect(() => {
    if (!carregandoCatalogo && !dim1 && recorteTotal) {
      aplicarRecorte(recorteTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorteTotal, carregandoCatalogo]);

  const selecionarDim2 = (opcao) => {
    setDim2(opcao);
    // com a 2ª dimensão limpa, volta para o recorte 1D da dimensão principal
    aplicarRecorte(opcao ? opcao.recorte : (dim1?.recorte ?? null));
  };

  // Limites do filtro de ano, dirigidos pelo catálogo
  const limitesAno = useMemo(() => {
    const recorte = filters.recorte;
    if (!recorte) return { min: 2007, max: 2024 };
    return { min: recorte.anoMin, max: recorte.anoMax };
  }, [filters.recorte]);

  // Aviso de disponibilidade/quebra exibido junto ao filtro de ano
  const avisoRecorte = useMemo(() => {
    const r = filters.recorte;
    if (!r) return '';
    if (r.tipoSerie === 'quebrada') {
      return (
        'A metodologia da fonte mudou em 2021: os resultados são exibidos ' +
        'separados por período e podem não ser comparáveis entre si.'
      );
    }
    if (r.anoMin > rangeIndicador.min || r.anoMax < rangeIndicador.max) {
      return `Esta seleção só tem dados de ${r.anoMin} a ${r.anoMax}.`;
    }
    return '';
  }, [filters.recorte, rangeIndicador]);

  // ------------------------------------------------------------ localização

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
          .split(',')
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

  const municipioOptions = useMemo(
    () =>
      Object.entries(municipios)
        .filter(([, m]) => baseFilteredMunicipios.includes(m))
        .map(([key, { nomeMunicipio }]) => ({ value: key, label: nomeMunicipio })),
    [baseFilteredMunicipios],
  );

  const territorioOptions = useMemo(() => {
    const labels = new Set(
      baseFilteredMunicipios
        .map((m) => m.territorioDesenvolvimento)
        .filter(Boolean),
    );
    return Object.entries(Regioes)
      .filter(([, label]) => labels.has(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const faixaOptions = useMemo(() => {
    const labels = new Set(
      baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean),
    );
    return Object.entries(FaixaPopulacional)
      .filter(([, label]) => labels.has(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const aglomeradoOptions = useMemo(
    () =>
      [
        ...new Set(
          baseFilteredMunicipios
            .map((m) => m.aglomerado)
            .filter((a) => a && a !== 'undefined'),
        ),
      ]
        .sort((a, b) => Number(a) - Number(b))
        .map((a) => ({ value: a, label: `AG ${a}` })),
    [baseFilteredMunicipios],
  );

  const gerenciaOptions = useMemo(
    () =>
      [
        ...new Set(
          baseFilteredMunicipios
            .map((m) => m.gerencia)
            .filter((g) => g && g !== 'undefined')
            .flatMap((g) =>
              g.includes(',') ? g.split(',').map((x) => x.trim()) : [g],
            ),
        ),
      ]
        .sort((a, b) => Number(a) - Number(b))
        .map((g) => ({ value: g, label: `${g}ª GRE` })),
    [baseFilteredMunicipios],
  );

  const limparFiltros = () => {
    filters.setIndicador('matriculas');
    setDim1(null);
    setDim2(null);
    filters.setRecorte(null);
    filters.setEra('');
    filters.setStartYear(2007);
    filters.setEndYear(2024);
    filters.setCity('');
    filters.setTerritory('');
    filters.setFaixaPopulacional('');
    filters.setAglomerado('');
    filters.setGerencia('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors ${isOpen ? 'hidden' : ''}`}
      >
        <FaBars />
      </button>

      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 shadow-lg sidebar-scroll`}
        style={{ width: isOpen ? '20rem' : '4rem', backgroundColor: '#E8E4E3' }}
      >
        <div className="relative p-3 pt-12 border-b border-gray-200">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-3 right-3 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
            aria-label="Fechar sidebar"
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
              <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
                <p className="text-xs text-gray-600 leading-tight">
                  observatório da política educacional piauiense
                </p>
              </div>
            </Link>
          </div>
        </div>

        <nav className="p-3 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Educação Básica (v2)
            </h3>
          </div>

          {erroCatalogo && (
            <p className="text-xs text-red-600">{erroCatalogo}</p>
          )}

          {/* Indicador */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Indicador
            </label>
            <Select
              value={
                indicadores
                  .map((i) => ({ value: i.id, label: i.label }))
                  .find((o) => o.value === filters.indicador) || null
              }
              onChange={(opcao) => {
                filters.setIndicador(opcao.value);
                setDim1(null);
                setDim2(null);
                aplicarRecorte(null);
              }}
              options={indicadores.map((i) => ({ value: i.id, label: i.label }))}
              placeholder="Selecione o indicador"
              size="xs"
            />
          </div>

          {/* Dimensão principal (dado 1D) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Dimensão (opcional)
            </label>
            <Select
              value={dim1}
              onChange={selecionarDim1}
              options={opcoesDim1}
              placeholder={
                carregandoCatalogo ? 'Carregando...' : 'Nenhuma (total)'
              }
              size="xs"
              isClearable
              disabled={carregandoCatalogo}
            />
          </div>

          {/* Segunda dimensão (cruzamento 2D, opcional) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Cruzar com (opcional)
            </label>
            <Select
              value={dim2}
              onChange={selecionarDim2}
              options={opcoesDim2}
              placeholder={
                !dim1
                  ? 'Escolha a dimensão primeiro'
                  : opcoesDim2.length
                    ? 'Selecione para cruzar'
                    : 'Sem cruzamentos disponíveis'
              }
              size="xs"
              isClearable
              disabled={!dim1 || !opcoesDim2.length}
            />
          </div>

          {/* Período, dirigido pelo catálogo */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
              Período {filters.recorte ? `(${limitesAno.min}–${limitesAno.max})` : ''}
            </label>
            <YearRangeFilter
              startYear={filters.startYear}
              endYear={filters.endYear}
              onStartYearChange={(year) => filters.setStartYear(year)}
              onEndYearChange={(year) => filters.setEndYear(year)}
              minYear={limitesAno.min}
              maxYear={limitesAno.max}
            />
            {avisoRecorte && (
              <p className="text-[10px] text-amber-700 mt-1 leading-snug">
                {avisoRecorte}
              </p>
            )}
          </div>

          {/* Localização */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Localização
            </h3>
            <div className="space-y-1.5">
              <Select
                value={
                  municipioOptions.find((o) => o.value === filters.city) || null
                }
                onChange={(opcao) => filters.setCity(opcao ? opcao.value : '')}
                options={municipioOptions}
                placeholder="Município (vazio = Piauí)"
                size="xs"
                isClearable
              />
              <Select
                value={
                  territorioOptions.find((o) => o.value === filters.territory) ||
                  null
                }
                onChange={(opcao) => {
                  filters.setTerritory(opcao ? opcao.value : '');
                  filters.setCity('');
                }}
                options={territorioOptions}
                placeholder="Território"
                size="xs"
                isClearable
                disabled={otherLocalityDisabled}
                disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
              />
              <Select
                value={
                  faixaOptions.find(
                    (o) => o.value === filters.faixaPopulacional,
                  ) || null
                }
                onChange={(opcao) => {
                  filters.setFaixaPopulacional(opcao ? opcao.value : '');
                  filters.setCity('');
                }}
                options={faixaOptions}
                placeholder="Faixa Populacional"
                size="xs"
                isClearable
                disabled={otherLocalityDisabled}
                disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={
                    aglomeradoOptions.find(
                      (o) => o.value === filters.aglomerado,
                    ) || null
                  }
                  onChange={(opcao) =>
                    filters.setAglomerado(opcao ? opcao.value : '')
                  }
                  options={aglomeradoOptions}
                  placeholder="AG"
                  size="xxs"
                  isClearable
                  disabled={otherLocalityDisabled}
                  disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                />
                <Select
                  value={
                    gerenciaOptions.find((o) => o.value === filters.gerencia) ||
                    null
                  }
                  onChange={(opcao) =>
                    filters.setGerencia(opcao ? opcao.value : '')
                  }
                  options={gerenciaOptions}
                  placeholder="GRE"
                  size="xxs"
                  isClearable
                  disabled={otherLocalityDisabled}
                  disabledReason={MOTIVO_MUNICIPIO_SELECIONADO}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={limparFiltros}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                py: 0.5,
                backgroundColor: '#f0f0f0',
                color: '#000',
                '&:hover': { backgroundColor: '#e0e0e0' },
              }}
            >
              Limpar
            </Button>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Alternar para
            </h3>
            <button
              onClick={() => navigate('/dados-educacionais/basica')}
              className="w-full flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-gray-700 hover:bg-green-100 hover:text-green-700"
            >
              <FaArrowLeft className="mr-2 text-sm flex-shrink-0" />
              <span>Educação Básica (atual)</span>
            </button>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-200 mt-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-xs font-medium"
          >
            <FaArrowLeft className="mr-2 flex-shrink-0" />
            <span>voltar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default EducationV2Sidebar;
