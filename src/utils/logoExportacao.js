// Logo do OPEPI nos PDFs exportados (no Excel fica sem logo, por decisão do usuário).
// A imagem é baixada uma vez (public/images/logos/logo-opepi.png, 404×128) e guardada.
// Se não carregar, o PDF sai como antes, só sem a logo.

const URL_LOGO = '/images/logos/logo-opepi.png';
const PROPORCAO = 404 / 128; // largura ÷ altura da logo
export const ASSINATURA_EXPORTACAO = 'Observatório da Política Educacional Piauiense — opepi.pi.gov.br';

let promessaLogo = null;
export const carregarLogo = () => {
  if (!promessaLogo) {
    promessaLogo = fetch(URL_LOGO)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('logo indisponível'))))
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const leitor = new FileReader();
            leitor.onload = () => resolve(leitor.result); // data:image/png;base64,...
            leitor.onerror = reject;
            leitor.readAsDataURL(blob);
          })
      )
      .catch(() => {
        promessaLogo = null;
        return null;
      });
  }
  return promessaLogo;
};

// ---------- PDF (jsPDF) ----------

// Espaço reservado no topo de cada página para o cabeçalho com a logo, em mm.
// Use como `margin.top` do autoTable (páginas seguintes) e some ao Y do conteúdo da 1ª página.
const ALTURA_CABECALHO_MM = 18;

// Converte mm para a unidade do documento (alguns PDFs do site usam 'pt', outros 'mm')
const emUnidade = (doc, mm) => (mm * (72 / 25.4)) / doc.internal.scaleFactor;

export const topoConteudoPdf = (doc) => emUnidade(doc, ALTURA_CABECALHO_MM);

// Desenha, em todas as páginas: logo à esquerda, assinatura à direita, uma linha
// separadora e "Página X de Y" no rodapé. Chamar depois de montar todo o conteúdo.
export const finalizarPdfComLogo = (doc, logo) => {
  const u = (mm) => emUnidade(doc, mm);
  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();
  const margem = u(14);
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i);
    if (logo) doc.addImage(logo, 'PNG', margem, u(6), u(7) * PROPORCAO, u(7));
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 98, 92);
    doc.text(ASSINATURA_EXPORTACAO, largura - margem, u(11.5), { align: 'right' });
    doc.text(`Página ${i} de ${total}`, largura - margem, altura - u(7), { align: 'right' });
    doc.setDrawColor(235, 216, 204);
    doc.setLineWidth(u(0.3));
    doc.line(margem, u(15), largura - margem, u(15));
  }
  doc.setTextColor(0, 0, 0);
};
