/**
 * Client da API v2 de educação básica (schema educacao_v2).
 *
 * Conceitos (ver endpoint /v2/educacao/catalogo):
 * - indicador: matriculas | docentes | turmas | escolas | funcionarios | auxiliares
 * - recorte: dims_canonico (1 ou 2 dimensões) do catálogo
 * - tipoSerie: "continua" (série única), "composta" (unificada pela API),
 *   "quebrada" (metodologias incompatíveis; retorno segmentado por era)
 */

const BASE_URL = import.meta.env.VITE_API_PUBLIC_URL || 'http://localhost:3003';

const get = async (path) => {
  const response = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} em ${path}`);
  }
  return response.json();
};

export const getIndicadores = () => get('/v2/educacao/indicadores');

export const getCatalogo = (indicador) =>
  get(`/v2/educacao/catalogo?indicador=${encodeURIComponent(indicador)}`);

export const getValoresDimensao = (nome) =>
  get(`/v2/educacao/dimensoes/${encodeURIComponent(nome)}/valores`);

/**
 * Consulta fatos.
 * @param {object} params
 * @param {string} params.indicador
 * @param {string} params.recorte  dims_canonico do catálogo
 * @param {number} [params.anoInicio]
 * @param {number} [params.anoFim]
 * @param {Array<string|number>} [params.localidades] IDs IBGE
 * @param {boolean} [params.agregar]  soma os totais das localidades
 * @param {string} [params.era]  "classico" | "moderno" (séries quebradas)
 * @param {number} [params.limite]
 */
export const getFatos = ({
  indicador,
  recorte,
  anoInicio,
  anoFim,
  localidades,
  agregar,
  era,
  limite,
}) => {
  const query = new URLSearchParams({ indicador, recorte });
  if (anoInicio) query.set('anoInicio', String(anoInicio));
  if (anoFim) query.set('anoFim', String(anoFim));
  if (localidades?.length) query.set('localidades', localidades.join(','));
  if (agregar) query.set('agregar', 'true');
  if (era) query.set('era', era);
  if (limite) query.set('limite', String(limite));

  return get(`/v2/educacao/fatos?${query.toString()}`);
};
