import {
  municipios,
  Regioes,
  FaixaPopulacional,
} from '../../../../utils/citiesMapping';

/**
 * Resolve os filtros territoriais em uma lista de IDs IBGE de municípios.
 * Retorna [] quando nenhum filtro territorial está ativo (= Piauí inteiro).
 */
export function filtrarMunicipios({
  territory,
  faixaPopulacional,
  aglomerado,
  gerencia,
}) {
  if (!territory && !faixaPopulacional && !aglomerado && !gerencia) {
    return [];
  }

  const territorioLabel = territory ? Regioes[territory] : null;
  const faixaLabel = faixaPopulacional
    ? FaixaPopulacional[faixaPopulacional]
    : null;

  return Object.entries(municipios)
    .filter(([, m]) => {
      if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel)
        return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (aglomerado && String(m.aglomerado) !== String(aglomerado))
        return false;
      if (gerencia) {
        const gerencias = String(m.gerencia)
          .split(',')
          .map((g) => g.trim());
        if (!gerencias.includes(String(gerencia))) return false;
      }
      return true;
    })
    .map(([id]) => id);
}

/** Descrição textual do local filtrado (para títulos). */
export function descreverLocal({
  city,
  territory,
  faixaPopulacional,
  aglomerado,
  gerencia,
}) {
  if (city && municipios[city]) return municipios[city].nomeMunicipio;

  const partes = [];
  if (territory) partes.push(Regioes[territory] || territory);
  if (faixaPopulacional)
    partes.push(FaixaPopulacional[faixaPopulacional] || faixaPopulacional);
  if (aglomerado) partes.push(`Aglomerado ${aglomerado}`);
  if (gerencia) partes.push(`${gerencia}ª GRE`);

  return partes.length ? `Piauí - ${partes.join(' | ')}` : 'Piauí';
}
