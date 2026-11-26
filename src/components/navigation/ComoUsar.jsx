import React from 'react';
import { Link } from 'react-router-dom';
import { FaSlidersH, FaTable, FaShareAlt, FaMapMarkerAlt, FaBalanceScale, FaBookOpen, FaMapMarkedAlt } from 'react-icons/fa';

// Página /como-usar: guia curto para quem chega pela primeira vez.
const PASSOS = [
  {
    icone: FaSlidersH,
    titulo: 'Escolha o que deseja visualizar',
    texto:
      'Acesse Dados financeiros ou Dados educacionais. No menu lateral (ou, no celular, no botão “Filtros”, localizado no rodapé), selecione o tipo de dado, o município ou a região e o período desejado. Em seguida, clique em “Mostrar”.',
  },
  {
    icone: FaTable,
    titulo: 'Leia o resumo e consulte a tabela',
    texto:
      'Os cartões exibidos na parte superior resumem os resultados: total do último ano, variação, maior componente e cumprimento do mínimo legal. A tabela apresenta todos os valores. Passe o mouse sobre o nome de uma coluna para consultar o significado das informações apresentadas.',
  },
  {
    icone: FaBookOpen,
    titulo: 'Entenda a origem dos dados',
    texto:
      'A “Ficha Técnica” de cada tabela explica quais informações são apresentadas, como os dados são calculados e quais são suas fontes. O botão “Correção monetária” atualiza os valores de acordo com a inflação, permitindo a comparação entre diferentes anos. O índice adotado foi o IPCA, cabendo ao usuário escolher a data de referência para a correção monetária.',
  },
  {
    icone: FaShareAlt,
    titulo: 'Exporte e compartilhe',
    texto:
      'A opção “Exportar” permite baixar a tabela nos formatos Excel, PDF ou CSV. A opção “Copiar link” permite salvar o endereço da consulta com os filtros selecionados, facilitando o seu compartilhamento. Já a opção “Como citar” gera a referência bibliográfica conforme as normas da ABNT.',
  },
];

const ATALHOS = [
  { icone: FaMapMarkerAlt, titulo: 'Perfil do município', texto: 'Consulte os principais dados de um município em uma única página.', link: '/municipio/221100', rotulo: 'Ver um exemplo (Teresina)' },
  { icone: FaBalanceScale, titulo: 'Comparar municípios', texto: 'Compare até 4 municípios lado a lado, utilizando a mediana do Piauí como referência.', link: '/comparar', rotulo: 'Abrir comparação' },
  { icone: FaMapMarkedAlt, titulo: 'Ranking e mapa', texto: 'Consulte, em uma lista ou no mapa do Piauí, os municípios com os maiores e os menores valores de determinado indicador.', link: '/ranking', rotulo: 'Abrir ranking' },
  { icone: FaBookOpen, titulo: 'Glossário', texto: 'Consulte o significado das siglas em linguagem simples', link: '/glossario', rotulo: 'Abrir glossário' },
];

const ComoUsar = () => (
  <main className="homepage-background px-4 py-14">
    <div className="mx-auto max-w-4xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Como usar</p>
      <h1 className="mb-10 text-3xl font-bold text-ink md:text-4xl">Encontre os dados em 4 passos</h1>

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
        {ATALHOS.map(({ icone: Icone, titulo, texto, link, rotulo }, i) => (
          <div key={titulo} className="flex flex-col rounded-2xl border border-line bg-white p-5">
            <Icone className="mb-3 text-xl text-brand" aria-hidden="true" />
            <h3 className="mb-1 font-semibold text-ink">
              <span className="mr-2 text-brand">{i + 1}.</span>
              {titulo}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-texto">{texto}</p>
            <Link to={link} className="text-sm font-semibold text-brand hover:text-brand-dark">
              {rotulo} →
            </Link>
          </div>
        ))}
      </div>

      <p className="mb-6 text-sm text-texto">
        Prefere uma demonstração na tela?{' '}
        <Link to="/municipios?tour=1" className="font-semibold text-brand hover:text-brand-dark">
          Faça o tour guiado (1 minuto) →
        </Link>
      </p>

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
