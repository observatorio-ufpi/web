import React from 'react';
import PageHeader from './PageHeader';

// Cabeçalho das páginas de Dados Educacionais no mesmo padrão das financeiras.
// Os títulos dessas páginas são montados como texto único, por exemplo
//   "Número de matrículas em Piauí (2007-2024) | Filtros: Etapa de Ensino"
//   "Número de alunos fora da escola - Piauí (2007-2024)"
// Aqui o texto é separado em título curto + etiquetas (local, período, filtros).
// Se não seguir o padrão, mostra o texto inteiro como título.
const PADRAO = /^(.*?)(?:\s+(?:em|no|na)\s+|\s+-\s+)(.+?)\s+\((\d{4}(?:\s*-\s*\d{4})?)\)(?:\s*\|\s*Filtros:\s*(.*))?$/;

export const separarTitulo = (texto) => {
  const m = PADRAO.exec(String(texto || '').trim());
  if (!m) return { titulo: texto, etiquetas: [] };
  const [, titulo, local, periodo, filtros] = m;
  const etiquetas = [
    ...local.split(/\s*-\s*|\s*\|\s*/).filter(Boolean),
    periodo.replace(/\s*-\s*/, '–'),
    ...(filtros ? filtros.split(/\s*,\s*/).filter(Boolean).map((f) => `Por ${f.charAt(0).toLowerCase()}${f.slice(1)}`) : []),
  ];
  return { titulo, etiquetas };
};

const TituloConsultaEducacional = ({ texto, area, acoes = null }) => {
  if (!texto) return null;
  const { titulo, etiquetas } = separarTitulo(texto);
  return <PageHeader caminho={`Dados educacionais  ›  ${area}`} titulo={titulo} etiquetas={etiquetas} acoes={acoes} />;
};

export default TituloConsultaEducacional;
