// Estatística de uso (Plausible): sem cookies e sem dados pessoais — conta visitas
// por página. DESLIGADA por padrão: só carrega se o build tiver VITE_PLAUSIBLE_DOMAIN
// (ex.: "opepi.pi.gov.br"). Para ligar em produção: criar o site no Plausible (ou numa
// instalação própria) e o secret VITE_PLAUSIBLE_DOMAIN no GitHub (o deploy já repassa).
// VITE_PLAUSIBLE_SRC permite usar um Plausible hospedado no próprio servidor.
// O script do Plausible registra sozinho as trocas de página do React Router.

export const iniciarEstatisticaUso = () => {
  const dominio = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!dominio || typeof document === 'undefined') return;
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = dominio;
  script.src = import.meta.env.VITE_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
};
