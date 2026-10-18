// "Tentar de novo" das páginas financeiras: repete a última consulta feita pela
// barra lateral (evento `applyFinancialFilters`, que todas as páginas escutam).
// Se a consulta não veio da barra (ex.: página aberta por um link com filtros na
// URL) ou foi feita em outra página, recarrega — os filtros estão no endereço.

let ultima = null; // { detalhe, caminho }

if (typeof window !== 'undefined') {
  window.addEventListener('applyFinancialFilters', (e) => {
    ultima = { detalhe: e.detail, caminho: window.location.pathname };
  });
}

export const repetirUltimaConsulta = () => {
  if (ultima && ultima.caminho === window.location.pathname) {
    window.dispatchEvent(new CustomEvent('applyFinancialFilters', { detail: ultima.detalhe }));
  } else {
    window.location.reload();
  }
};
