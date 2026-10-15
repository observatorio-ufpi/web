// Glossário dos termos que aparecem nas tabelas, em linguagem simples.
// Usado na explicação ao passar o mouse no nome da coluna (RevenueTable,
// StateRevenueTable) e na página /glossario.
// `busca`: trechos (sem acento, minúsculos) que identificam a coluna pelo nome.
// A ordem importa: termos mais específicos vêm antes dos genéricos.

export const GLOSSARIO = [
  // ---- impostos próprios
  { termo: 'IPTU', grupo: 'Impostos próprios', busca: ['iptu'], texto: 'Imposto sobre a Propriedade Predial e Territorial Urbana, cobrado pelo município dos donos de imóveis urbanos.' },
  { termo: 'ITBI', grupo: 'Impostos próprios', busca: ['itbi'], texto: 'Imposto sobre a Transmissão de Bens Imóveis, cobrado pelo município na compra e venda de imóveis.' },
  { termo: 'ISS', grupo: 'Impostos próprios', busca: ['iss'], texto: 'Imposto Sobre Serviços, cobrado pelo município sobre a prestação de serviços.' },
  { termo: 'IRRF', grupo: 'Impostos próprios', busca: ['irrf'], texto: 'Imposto de Renda Retido na Fonte sobre os salários pagos pelo próprio município (ou Estado), que fica com o ente.' },
  // Coluna "ITR" sozinha (tabela de impostos próprios): ITR cobrado pelo próprio município.
  // `exato` tem prioridade sobre `busca` — "Cota-parte ITR" (transferência) cai na entrada de baixo.
  { termo: 'ITR (cobrado pelo município)', grupo: 'Impostos próprios', exato: ['itr'], busca: [], texto: 'Imposto Territorial Rural. O município fica com 100% quando faz a cobrança por convênio com a União; sem convênio, recebe 50% como transferência (cota-parte).' },
  { termo: 'ITCD', grupo: 'Impostos próprios', busca: ['itcd'], texto: 'Imposto estadual sobre heranças e doações.' },
  // ---- transferências
  { termo: 'FPM', grupo: 'Transferências', busca: ['fpm'], texto: 'Fundo de Participação dos Municípios: parte da arrecadação federal (IR e IPI) repassada aos municípios.' },
  { termo: 'FPE', grupo: 'Transferências', busca: ['fpe'], texto: 'Fundo de Participação dos Estados: parte da arrecadação federal (IR e IPI) repassada aos estados.' },
  { termo: 'ICMS-desoneração', grupo: 'Transferências', busca: ['desoneracao'], texto: 'Compensação paga pela União pela isenção de ICMS sobre exportações (Lei Kandir, LC 87/1996).' },
  { termo: 'Cota-parte do ICMS', grupo: 'Transferências', busca: ['icms'], texto: 'Parte (25%) do ICMS arrecadado pelo Estado que é repassada aos municípios.' },
  { termo: 'IPI-Exportação', grupo: 'Transferências', busca: ['ipi'], texto: 'Parte do IPI sobre produtos exportados que a União repassa a estados e municípios.' },
  { termo: 'Cota-parte do ITR', grupo: 'Transferências', busca: ['itr'], texto: 'Parte do Imposto Territorial Rural (federal) que fica com o município onde está o imóvel rural.' },
  { termo: 'Cota-parte do IPVA', grupo: 'Transferências', busca: ['ipva'], texto: 'Metade do IPVA dos veículos licenciados no município, repassada pelo Estado.' },
  { termo: 'IOF-Ouro', grupo: 'Transferências', busca: ['iof'], texto: 'Parte do imposto sobre operações com ouro repassada ao local de extração.' },
  // ---- receitas adicionais
  { termo: 'Salário-educação', grupo: 'Receitas adicionais', busca: ['salario-educacao', 'salario educacao'], texto: 'Contribuição paga pelas empresas sobre a folha de salários, destinada à educação básica pública.' },
  { termo: 'PDDE', grupo: 'Receitas adicionais', busca: ['pdde'], texto: 'Programa Dinheiro Direto na Escola (FNDE): recursos enviados direto às escolas para manutenção e pequenas despesas.' },
  { termo: 'PNAE', grupo: 'Receitas adicionais', busca: ['pnae'], texto: 'Programa Nacional de Alimentação Escolar (FNDE): recursos para a merenda.' },
  { termo: 'PNATE', grupo: 'Receitas adicionais', busca: ['pnate'], texto: 'Programa Nacional de Apoio ao Transporte do Escolar (FNDE): recursos para o transporte de alunos da zona rural.' },
  { termo: 'Royalties', grupo: 'Receitas adicionais', busca: ['royalties'], texto: 'Parte das compensações pela exploração de petróleo e gás destinada à educação.' },
  // ---- Fundeb
  { termo: 'VAAF', grupo: 'Fundeb', busca: ['vaaf'], texto: 'Complementação da União ao Fundeb para os estados onde o valor anual por aluno não alcança o mínimo nacional.' },
  { termo: 'VAAT', grupo: 'Fundeb', busca: ['vaat'], texto: 'Complementação da União ao Fundeb para as redes com menor valor anual total por aluno (desde 2021). Metade deve ir para a educação infantil e 15% para despesas de capital.' },
  { termo: 'VAAR', grupo: 'Fundeb', busca: ['vaar'], texto: 'Complementação da União ao Fundeb para redes que melhoram indicadores de atendimento e aprendizagem (desde 2023).' },
  { termo: 'Complementação da União', grupo: 'Fundeb', busca: ['complementacao'], texto: 'Dinheiro que a União acrescenta ao Fundeb, além do que estados e municípios contribuem.' },
  { termo: 'Resultado líquido do Fundeb', grupo: 'Fundeb', busca: ['resultado liquido'], texto: 'Diferença entre o que o município recebeu do Fundeb e o que contribuiu. Positivo = ganhou na redistribuição.' },
  { termo: 'Fundeb', grupo: 'Fundeb', busca: ['fundeb', 'fundef'], texto: 'Fundo de Manutenção e Desenvolvimento da Educação Básica: reúne parte dos impostos de estados e municípios e redistribui conforme o número de alunos de cada rede.' },
  // ---- MDE e indicadores
  { termo: 'MDE', grupo: 'Aplicação em educação', busca: ['mde'], texto: 'Manutenção e Desenvolvimento do Ensino: gastos que contam para o mínimo constitucional de 25% dos impostos (CF, art. 212), como salários, escolas e material.' },
  { termo: 'RPEB', grupo: 'Aplicação em educação', busca: ['rpeb'], texto: 'Receita Potencial Mínima vinculada à Educação Básica: estimativa do mínimo de recursos disponíveis para a educação básica.' },
  { termo: 'Despesas de capital', grupo: 'Aplicação em educação', busca: ['despesas de capital', 'despesas de capita'], texto: 'Investimentos: obras, reformas, compra de equipamentos e veículos.' },
  { termo: 'Instituições conveniadas', grupo: 'Aplicação em educação', busca: ['conveniadas'], texto: 'Escolas comunitárias, confessionais ou filantrópicas sem fins lucrativos que recebem recursos públicos por convênio.' },
  { termo: 'Pessoal inativo', grupo: 'Aplicação em educação', busca: ['inativo'], texto: 'Aposentados e pensionistas da educação.' },
  { termo: 'EJA', grupo: 'Etapas', busca: ['jovens e adultos'], texto: 'Educação de Jovens e Adultos: ensino para quem não concluiu a escola na idade esperada.' },
];

const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Explicação do termo mais específico encontrado no nome da coluna (ou null)
export const explicarColuna = (nomeColuna) => {
  if (!nomeColuna) return null;
  const n = normalizar(nomeColuna);
  const exato = GLOSSARIO.find((g) => g.exato && g.exato.includes(n.trim()));
  if (exato) return `${exato.termo}: ${exato.texto}`;
  const achado = GLOSSARIO.find((g) => g.busca.some((b) => new RegExp(`(^|[^a-z])${b}([^a-z]|$)`).test(n)));
  return achado ? `${achado.termo}: ${achado.texto}` : null;
};
