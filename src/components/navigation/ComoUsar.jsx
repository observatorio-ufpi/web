import React from 'react';
import { Link } from 'react-router-dom';
import { FaSlidersH, FaTable, FaShareAlt, FaMapMarkerAlt, FaBalanceScale, FaBookOpen, FaMapMarkedAlt } from 'react-icons/fa';

// Página /como-usar: guia curto para quem chega pela primeira vez.
const PASSOS = [
  {
    icone: FaSlidersH,
    titulo: 'Escolha o que quer ver',
    texto:
      'Entre em Dados financeiros ou Dados educacionais. No menu lateral (no celular, botão "Filtros" no rodapé), escolha o tipo de dado, o município ou região e o período, e toque em "Mostrar".',
  },
  {
    icone: FaTable,
    titulo: 'Leia o resumo e a tabela',
    texto:
      'Os cartões no topo resumem o resultado: total do último ano, variação, maior componente e se o mínimo legal foi cumprido. A tabela traz todos os valores. Passe o mouse no nome de uma coluna para ver o que ela significa.',
  },
  {
    icone: FaBookOpen,
    titulo: 'Entenda de onde vêm os números',
    texto:
      'A "Ficha Técnica" de cada tabela explica o que ela mostra, como é calculada e qual a fonte. O botão "Correção monetária" atualiza os valores pela inflação para comparar anos diferentes.',
  },
  {
    icone: FaShareAlt,
    titulo: 'Exporte e compartilhe',
    texto:
      '"Exportar" baixa a tabela em Excel, PDF ou CSV. "Copiar link" guarda a consulta exatamente como está, para enviar a alguém. "Como citar" gera a referência no padrão ABNT.',
  },
];

const ATALHOS = [
  { icone: FaMapMarkerAlt, titulo: 'Perfil do município', texto: 'Todos os principais números de um município numa página só.', link: '/municipio/221100', rotulo: 'Ver um exemplo (Teresina)' },
  { icone: FaBalanceScale, titulo: 'Comparar municípios', texto: 'Coloque até 4 municípios lado a lado, com a mediana do Piauí como referência.', link: '/comparar', rotulo: 'Abrir comparação' },
  { icone: FaMapMarkedAlt, titulo: 'Ranking e mapa', texto: 'Os municípios com os maiores e menores valores de um indicador, em lista ou no mapa do Piauí.', link: '/ranking', rotulo: 'Abrir ranking' },
  { icone: FaBookOpen, titulo: 'Glossário', texto: 'O significado de siglas como FPM, MDE, Fundeb e VAAT, em linguagem simples.', link: '/glossario', rotulo: 'Abrir glossário' },
];

const ComoUsar = () => (
  <main className="homepage-background px-4 py-14">
    <div className="mx-auto max-w-4xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Como usar</p>
      <h1 className="mb-3 text-3xl font-bold text-ink md:text-4xl">Encontre os dados em 4 passos</h1>
      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-texto">
        O OPEPI reúne dados do financiamento da educação e da educação básica e superior do Piauí e dos seus 224 municípios.
      </p>

      <ol className="mb-12 grid gap-4">
        {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
          <li key={titulo} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-areia text-brand" aria-hidden="true">
              <Icone />
            </div>
            <div>
              <h2 className="mb-1 text-lg font-semibold text-ink">
                <span className="mr-2 text-brand">{i + 1}.</span>
                {titulo}
              </h2>
              <p className="leading-relaxed text-texto">{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mb-4 text-xl font-semibold text-ink">Atalhos úteis</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {ATALHOS.map(({ icone: Icone, titulo, texto, link, rotulo }) => (
          <div key={titulo} className="flex flex-col rounded-2xl border border-line bg-white p-5">
            <Icone className="mb-3 text-xl text-brand" aria-hidden="true" />
            <h3 className="mb-1 font-semibold text-ink">{titulo}</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-texto">{texto}</p>
            <Link to={link} className="text-sm font-semibold text-brand hover:text-brand-dark">
              {rotulo} →
            </Link>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/dados-financeiros" className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Começar pelos dados financeiros
        </Link>
        <Link to="/dados-educacionais" className="rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:bg-areia">
          Ver dados educacionais
        </Link>
      </div>
    </div>
  </main>
);

export default ComoUsar;
