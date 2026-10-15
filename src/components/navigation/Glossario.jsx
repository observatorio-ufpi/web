import React from 'react';
import { Link } from 'react-router-dom';
import { GLOSSARIO } from '../../utils/glossario';

// Página /glossario: todos os termos usados nas tabelas, agrupados por tema.
const Glossario = () => {
  const grupos = [...new Set(GLOSSARIO.map((g) => g.grupo))];
  return (
    <main className="homepage-background px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand mb-2">Glossário</p>
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">Termos usados nos dados</h1>
        <p className="text-lg text-texto leading-relaxed mb-10 max-w-2xl">
          Explicações em linguagem simples para as siglas e nomes que aparecem nas tabelas e gráficos.
          Nas tabelas, os nomes de coluna com sublinhado pontilhado mostram essa explicação ao passar o mouse.
        </p>

        {grupos.map((grupo) => (
          <section key={grupo} className="mb-10" aria-labelledby={`grupo-${grupo}`}>
            <h2 id={`grupo-${grupo}`} className="text-xl font-semibold text-ink mb-4">{grupo}</h2>
            <dl className="grid gap-3 md:grid-cols-2">
              {GLOSSARIO.filter((g) => g.grupo === grupo).map((g) => (
                <div key={g.termo} className="rounded-xl border border-line bg-white px-5 py-4">
                  <dt className="font-semibold text-ink mb-1">{g.termo}</dt>
                  <dd className="text-texto leading-relaxed">{g.texto}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/dados-financeiros" className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
            Ver dados financeiros
          </Link>
          <Link to="/dados-educacionais" className="rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-areia">
            Ver dados educacionais
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Glossario;
