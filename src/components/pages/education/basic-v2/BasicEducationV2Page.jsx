import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Loading } from '../../../ui';
import { useEducationV2Filters } from '../../../../contexts/EducationV2FilterContext';
import { getFatos } from '../../../../services/educacaoV2Service';
import { descreverLocal, filtrarMunicipios } from './filtrarMunicipios';
import TabelaV2 from './TabelaV2';

const INDICADOR_LABELS = {
  matriculas: 'Número de matrículas',
  docentes: 'Número de docentes',
  turmas: 'Número de turmas',
  escolas: 'Número de escolas',
  funcionarios: 'Número de funcionários',
  auxiliares: 'Número de auxiliares',
};

/**
 * Página /dados-educacionais/basica-v2 — consome a API v2 (schema educacao_v2).
 *
 * A consulta é dirigida pelos filtros do EducationV2Sidebar: indicador +
 * recorte do catálogo + anos (restritos pelo catálogo/era) + localização.
 * A agregação territorial é feita pela API (agregar=true), não por loop de
 * requisições por município como na página v1.
 */
const BasicEducationV2Page = () => {
  const theme = useTheme();
  const filters = useEducationV2Filters();

  const [resposta, setResposta] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    if (!filters.recorte) {
      setResposta(null);
      setErro(null);
      return;
    }

    const consultar = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const municipiosFiltrados = filtrarMunicipios(filters);

        const params = {
          indicador: filters.indicador,
          recorte: filters.recorte.recorte,
          anoInicio: filters.startYear,
          anoFim: filters.endYear,
          limite: 200000,
        };

        if (filters.city) {
          // município específico: sem agregação
          params.localidades = [filters.city];
        } else {
          // Piauí inteiro ou grupo territorial: API soma as localidades
          params.localidades = municipiosFiltrados;
          params.agregar = true;
        }

        if (filters.recorte.tipoSerie === 'quebrada' && filters.era) {
          params.era = filters.era;
        }

        const dados = await getFatos(params);
        setResposta(dados);

        const local = descreverLocal(filters);
        const anos =
          filters.startYear === filters.endYear
            ? `${filters.startYear}`
            : `${filters.startYear}-${filters.endYear}`;
        setTitulo(
          `${INDICADOR_LABELS[filters.indicador] || filters.indicador} — ` +
            `${filters.recorte.label} — ${local} (${anos})`,
        );
      } catch (e) {
        console.error('Erro na consulta v2:', e);
        setErro('Erro ao consultar a API. Verifique se o servidor está no ar.');
        setResposta(null);
      } finally {
        setCarregando(false);
      }
    };

    consultar();
  }, [
    filters.indicador,
    filters.recorte,
    filters.era,
    filters.startYear,
    filters.endYear,
    filters.city,
    filters.territory,
    filters.faixaPopulacional,
    filters.aglomerado,
    filters.gerencia,
  ]);

  return (
    <div className="app-container">
      {carregando && <Loading />}

      {erro && (
        <Typography sx={{ color: 'error.main', my: 3, textAlign: 'center' }}>
          {erro}
        </Typography>
      )}

      {!carregando && !erro && !filters.recorte && (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '40px auto',
            maxWidth: '460px',
            color: theme.palette.primary.main,
          }}
        >
          Selecione um indicador e um recorte na barra lateral. Os anos
          disponíveis se ajustam automaticamente ao recorte escolhido.
        </Typography>
      )}

      {!carregando && !erro && resposta && (
        <TabelaV2 resposta={resposta} titulo={titulo} />
      )}

      {/* Debug de proveniência: diretórios do dataset (1D/2D) desta consulta */}
      {!carregando && !erro && resposta?.meta?.fontes?.length > 0 && (
        <Box
          sx={{
            marginTop: 2,
            padding: '8px 12px',
            backgroundColor: '#fafafa',
            border: '1px dashed #cfcfcf',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#888',
            overflowX: 'auto',
          }}
        >
          <Typography
            component="div"
            sx={{ fontSize: '10px', fontWeight: 'bold', color: '#aaa', mb: 0.5, letterSpacing: '0.5px' }}
          >
            DEBUG · CONJUNTOS DE DADOS DESTA CONSULTA
          </Typography>
          {resposta.meta.fontes.map((f) => (
            <Box
              key={`${f.referencia}|${f.dims}`}
              component="div"
              sx={{ whiteSpace: 'nowrap', lineHeight: 1.7 }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '26px',
                  fontWeight: 'bold',
                  color: f.tipo === '2D' ? '#b07a00' : '#4a7a4a',
                }}
              >
                {f.tipo}
              </Box>
              {f.diretorio.replace(
                '{ano}',
                f.anoMin === f.anoMax ? String(f.anoMin) : `{${f.anoMin}..${f.anoMax}}`,
              )}
              {' · '}
              {f.fatos.toLocaleString('pt-BR')} fatos
            </Box>
          ))}
        </Box>
      )}

      {/* Ficha técnica */}
      {!carregando && resposta && (
        <Box
          sx={{
            marginTop: 6,
            padding: 3,
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            Ficha Técnica
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
            Fonte: Censo Escolar/INEP via API SIMCAQ (simcaq.c3sl.ufpr.br),
            dados de 2007 a 2024 para os 224 municípios do Piauí. Em 2021 a
            fonte mudou a metodologia de alguns recortes; séries marcadas como
            não comparáveis são exibidas separadamente por período
            metodológico.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default BasicEducationV2Page;
