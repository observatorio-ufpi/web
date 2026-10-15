import React from 'react';
import { Link } from 'react-router-dom';

// Página 404. Antes não havia rota para endereço desconhecido e a tela
// ficava em branco.
const PaginaNaoEncontrada = () => (
  <main className="homepage-background min-h-[70vh] flex items-center justify-center px-4 py-20">
    <div className="max-w-lg w-full text-center rounded-2xl border border-line bg-white px-8 py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-3">Erro 404</p>
      <h1 className="text-3xl font-bold text-ink mb-3">Página não encontrada</h1>
      <p className="text-texto leading-relaxed mb-8">
        O endereço pode ter mudado ou estar digitado errado. Você pode voltar ao início ou ir direto aos painéis.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Ir para o início
        </Link>
        <Link
          to="/dados-financeiros"
          className="rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-areia"
        >
          Dados financeiros
        </Link>
        <Link
          to="/dados-educacionais"
          className="rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-areia"
        >
          Dados educacionais
        </Link>
      </div>
    </div>
  </main>
);

export default PaginaNaoEncontrada;
