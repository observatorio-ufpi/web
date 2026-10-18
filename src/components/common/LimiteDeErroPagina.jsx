import React from 'react';
import { useLocation } from 'react-router-dom';

// Rede de segurança do site: se uma página der um erro inesperado ao desenhar,
// mostra uma mensagem com "Recarregar" em vez de deixar a tela em branco.
// Ao trocar de página (outro endereço), o erro é esquecido e tudo volta ao normal.
class Limite extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error('Erro ao exibir a página:', erro, info?.componentStack);
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <main className="homepage-background flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div role="alert" className="max-w-md rounded-2xl border border-line bg-white p-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Algo deu errado</p>
          <h1 className="mb-3 text-2xl font-bold text-ink">Não foi possível mostrar esta página</h1>
          <p className="mb-6 leading-relaxed text-texto">
            Pode ser uma instabilidade momentânea em alguma fonte de dados. Tente recarregar; se continuar, volte ao início.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Recarregar a página
            </button>
            <a href="/" className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink hover:bg-areia">
              Ir para o início
            </a>
          </div>
        </div>
      </main>
    );
  }
}

// key = endereço: navegar para outra página "zera" o erro
const LimiteDeErroPagina = ({ children }) => {
  const { pathname } = useLocation();
  return <Limite key={pathname}>{children}</Limite>;
};

export default LimiteDeErroPagina;
