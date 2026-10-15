import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Título da aba do navegador por página. Antes era sempre
// "Observatório de Dados - Piauí", em qualquer página.
const SUFIXO = 'OPEPI';

const TITULOS_POR_ROTA = {
  '/': 'Observatório da Política Educacional Piauiense',
  '/quem-somos': 'Quem somos',
  '/glossario': 'Glossário',
  '/dados-financeiros': 'Dados financeiros',
  '/dados-educacionais': 'Dados educacionais',
  '/municipios': 'Dados financeiros dos municípios',
  '/estado': 'Dados financeiros do Estado',
  '/indicadores': 'Indicadores financeiros dos municípios',
  '/indicadores-estaduais': 'Indicadores financeiros do Estado',
  '/comparar': 'Comparar municípios',
  '/dados-educacionais/basica': 'Educação básica',
  '/dados-educacionais/condicoes-de-oferta': 'Condições de oferta',
  '/dados-educacionais/superior': 'Educação superior',
  '/dados-educacionais/taxas': 'Indicadores educacionais',
};

export const definirTitulo = (titulo) => {
  document.title = titulo ? `${titulo} | ${SUFIXO}` : SUFIXO;
};

// Hook para páginas que sabem mais detalhes (ex.: tabela e município consultados).
// Roda depois do título por rota, então sobrescreve; volta ao da rota ao sair.
export const useTituloDinamico = (titulo) => {
  useEffect(() => {
    if (titulo) definirTitulo(titulo);
  }, [titulo]);
};

// Colocado uma vez dentro do <Router>: define o título pela rota atual
const TituloDaPagina = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    definirTitulo(TITULOS_POR_ROTA[pathname] || 'Página não encontrada');
  }, [pathname]);
  return null;
};

export default TituloDaPagina;
