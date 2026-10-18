// Bibliotecas de exportação carregadas só quando a pessoa clica em "Exportar".
// Juntas passam de 1 MB de JavaScript; importadas no topo dos arquivos, eram
// baixadas na abertura de toda página com tabela, mesmo sem ninguém exportar.
// Cada import() vira um arquivo separado no build e fica em cache depois do 1º uso.

export const carregarExcelJS = () => import('exceljs').then((m) => m.default || m);

// jspdf-autotable se registra no jsPDF (doc.autoTable) ao ser importado
export const carregarJsPDF = async () => {
  const { default: jsPDF } = await import('jspdf');
  await import('jspdf-autotable');
  return jsPDF;
};

export const carregarXLSX = () => import('xlsx');

export const carregarJSZip = () => import('jszip').then((m) => m.default || m);

export const carregarHtml2canvas = () => import('html2canvas').then((m) => m.default || m);
