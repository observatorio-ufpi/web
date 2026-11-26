// Glossário dos termos que aparecem nas tabelas, em linguagem simples.
// Usado na explicação ao passar o mouse no nome da coluna (RevenueTable,
// StateRevenueTable) e na página /glossario.
// `busca`: trechos (sem acento, minúsculos) que identificam a coluna pelo nome.
// A ordem importa: termos mais específicos vêm antes dos genéricos.
// `exato` tem prioridade sobre `busca` (ex.: "IRRF" municipal não pega "IRRF/Estaduais").

const TEXTO_IPI_EXPORTACAO =
  'Parcela da arrecadação do IPI incidente sobre produtos industrializados exportados, transferida pela União aos estados e ao Distrito Federal, que repassam 25% desse valor aos municípios.';

const TEXTO_IOF_OURO =
  'Parcela da arrecadação do Imposto sobre Operações Financeiras (IOF), incidente sobre operações com ouro quando definido em lei como ativo financeiro ou instrumento cambial, destinada ao estado e ao município de origem da extração.';

export const GLOSSARIO = [
  // ---- de onde vêm os dados (não casam com nomes de coluna; aparecem no glossário e na busca)
  { termo: 'RREO', grupo: 'De onde vêm os dados?', busca: [], texto: 'Relatório Resumido da Execução Orçamentária: prestação de contas que cada município e estado publica a cada dois meses, conforme a Lei de Responsabilidade Fiscal, demonstrando quanto arrecadou e quanto gastou. Os dados financeiros do OPEPI são extraídos do relatório do 6º bimestre, que consolida as informações do ano.' },
  { termo: 'Anexo 8 do RREO', grupo: 'De onde vêm os dados?', busca: [], texto: 'Parte do RREO dedicada à educação: o “Demonstrativo das Receitas e Despesas com Manutenção e Desenvolvimento do Ensino (MDE)”. Apresenta informações sobre os impostos, o Fundeb, os gastos com educação e o cumprimento dos mínimos legais. É dessa fonte que são extraídas todas as tabelas financeiras do site.' },
  { termo: 'SIOPE', grupo: 'De onde vêm os dados?', busca: [], texto: 'Sistema de Informações sobre Orçamentos Públicos em Educação, do FNDE/MEC. É o sistema no qual os municípios e os estados declaram os dados do Anexo 8 e no qual qualquer pessoa pode consultar os relatórios originais.' },

  // ---- impostos próprios municipais
  { termo: 'IPTU', grupo: 'Impostos próprios municipais', busca: ['iptu'], texto: 'Imposto sobre a Propriedade Predial e Territorial Urbana, cobrado pelo município dos proprietários de imóveis urbanos.' },
  { termo: 'ITBI', grupo: 'Impostos próprios municipais', busca: ['itbi'], texto: 'Imposto sobre a Transmissão de Bens Imóveis, cobrado pelo município nas operações de compra e venda de imóveis.' },
  { termo: 'ISS', grupo: 'Impostos próprios municipais', busca: ['iss'], texto: 'Imposto sobre Serviços, cobrado pelo município sobre a prestação de serviços.' },
  { termo: 'IRRF- municipais', grupo: 'Impostos próprios municipais', exato: ['irrf'], busca: [], texto: 'Imposto sobre a Renda Retido na Fonte, incidente sobre os salários pagos pelo próprio município (ou pelo Estado). A arrecadação fica com o ente que efetua o pagamento.' },
  // Coluna "ITR" sozinha (tabela de impostos próprios): ITR cobrado pelo próprio município.
  { termo: 'ITR (cobrado pelo município)', grupo: 'Impostos próprios municipais', exato: ['itr'], busca: [], texto: 'Imposto Territorial Rural. O município fica com 100% quando faz a cobrança por convênio com a União; sem convênio, recebe 50% como transferência (cota-parte).' },

  // ---- impostos próprios estaduais
  { termo: 'ICMS', grupo: 'Impostos próprios estaduais', exato: ['icms'], busca: [], texto: 'Imposto sobre Circulação de Mercadorias e Serviços. É o principal imposto estadual e incide sobre a circulação de mercadorias e a prestação de serviços de transporte intermunicipal e interestadual, além dos serviços de comunicação.' },
  { termo: 'IPVA', grupo: 'Impostos próprios estaduais', exato: ['ipva'], busca: [], texto: 'Imposto sobre a Propriedade de Veículos Automotores cobrado anualmente dos proprietários de veículos automotores.' },
  { termo: 'ITCMD ou ITCD', grupo: 'Impostos próprios estaduais', exato: ['itcd', 'itcmd'], busca: [], texto: 'Imposto sobre Transmissão Causa Mortis e Doação. Incide sobre a transferência de bens ou direitos por herança/inventário (causa mortis) ou por doação em vida.' },
  { termo: 'IRRF- estadual', grupo: 'Impostos próprios estaduais', busca: ['irrf/estaduais', 'irrf estaduais'], texto: 'Imposto sobre a Renda Retido na Fonte, incidente sobre os salários pagos pelo próprio Estado. A arrecadação fica com o ente que efetua o pagamento.' },

  // ---- transferências aos municípios
  { termo: 'FPM', grupo: 'Transferências Constitucionais para os municípios', busca: ['fpm'], texto: 'Fundo de Participação dos Municípios: parcela da arrecadação federal do Imposto de Renda (IR) e do Imposto sobre Produtos Industrializados (IPI) repassada aos municípios.' },
  { termo: 'Cota-parte do ICMS', grupo: 'Transferências Constitucionais para os municípios', busca: ['cota parte icms', 'cota-parte icms', 'cota-parte do icms'], texto: 'Parcela correspondente a, no mínimo, 25% da arrecadação do ICMS pertencente aos municípios, repassada pelo Estado.' },
  { termo: 'Cota-parte do ITR', grupo: 'Transferências Constitucionais para os municípios', busca: ['cota-parte itr', 'cota parte itr', 'cota-parte do itr'], texto: 'Parcela da arrecadação do Imposto sobre a Propriedade Territorial Rural (ITR) repassada ao município onde está localizado o imóvel rural. Em regra, corresponde a 50% da arrecadação, podendo chegar a 100% quando o município assume as atribuições de fiscalização e cobrança, mediante convênio com a União.' },
  { termo: 'IPI – Exportação', grupo: 'Transferências Constitucionais para os municípios', busca: ['ipi'], texto: TEXTO_IPI_EXPORTACAO },
  { termo: 'Cota-parte do IPVA', grupo: 'Transferências Constitucionais para os municípios', busca: ['cota-parte ipva', 'cota parte ipva', 'cota-parte do ipva'], texto: 'Parcela correspondente a 50% da arrecadação do IPVA relativa aos veículos licenciados no município, repassada pelo Estado.' },
  { termo: 'IOF-Ouro', grupo: 'Transferências Constitucionais para os municípios', busca: ['iof'], texto: TEXTO_IOF_OURO },

  // ---- transferências aos estados
  { termo: 'FPE', grupo: 'Transferências Constitucionais para os estados', busca: ['fpe'], texto: 'Fundo de Participação dos Estados: parcela da arrecadação federal do Imposto de Renda (IR) e do Imposto sobre Produtos Industrializados (IPI) repassada aos estados.' },
  { termo: 'ICMS – desoneração', grupo: 'Transferências Constitucionais para os estados', busca: ['desoneracao'], texto: 'Compensação financeira paga pela União aos estados em razão das perdas de arrecadação do ICMS decorrentes da desoneração das exportações, conforme a Lei Complementar nº 87/1996 (Lei Kandir).' },
  { termo: 'IPI – Exportação', grupo: 'Transferências Constitucionais para os estados', busca: [], texto: TEXTO_IPI_EXPORTACAO },
  { termo: 'IOF-Ouro', grupo: 'Transferências Constitucionais para os estados', busca: [], texto: TEXTO_IOF_OURO },

  // ---- receitas adicionais
  { termo: 'Salário-educação', grupo: 'Receitas adicionais', busca: ['salario-educacao', 'salario educacao'], texto: 'Contribuição social recolhida pelas empresas, calculada com base na folha de pagamento dos empregados. Os recursos são destinados ao financiamento de programas, projetos e ações voltados à educação básica pública.' },
  { termo: 'PDDE', grupo: 'Receitas adicionais', busca: ['pdde'], texto: 'Programa Dinheiro Direto na Escola, do Fundo Nacional de Desenvolvimento da Educação (FNDE). Repassa recursos diretamente às escolas públicas para apoiar sua manutenção, seu funcionamento e a realização de pequenas despesas.' },
  { termo: 'PNAE', grupo: 'Receitas adicionais', busca: ['pnae'], texto: 'Programa Nacional de Alimentação Escolar, do FNDE. Repassa recursos para a oferta de alimentação escolar aos estudantes da educação básica pública.' },
  { termo: 'PNATE', grupo: 'Receitas adicionais', busca: ['pnate'], texto: 'Programa Nacional de Apoio ao Transporte do Escolar, do FNDE. Repassa recursos para apoiar o custeio do transporte dos estudantes da educação básica pública residentes em áreas rurais.' },
  { termo: 'Royalties', grupo: 'Receitas adicionais', busca: ['royalties'], texto: 'Receitas provenientes da exploração de petróleo e gás natural, das quais uma parcela é destinada ao financiamento da educação, conforme a legislação vigente.' },

  // ---- Fundeb (termos específicos antes do genérico)
  { termo: 'VAAF', grupo: 'Fundeb', busca: ['vaaf'], texto: 'Valor Anual por Aluno. Complementação da União destinada aos estados e municípios cujos recursos vinculados ao Fundeb não alcançam o valor anual mínimo por aluno definido nacionalmente.' },
  { termo: 'VAAT', grupo: 'Fundeb', busca: ['vaat'], texto: 'Valor Anual Total por Aluno. Complementação da União destinada às redes de ensino que não atingem o valor anual total mínimo por aluno. Pelo menos 50% desses recursos devem ser destinados à educação infantil, e no mínimo 15% devem ser aplicados em despesas de capital.' },
  { termo: 'VAAR', grupo: 'Fundeb', busca: ['vaar'], texto: 'Complementação da União destinada às redes de ensino que atendem a condicionalidades de gestão e apresentam evolução em indicadores de atendimento e aprendizagem, com redução das desigualdades educacionais.' },
  { termo: 'Complementação da União', grupo: 'Fundeb', busca: ['complementacao'], texto: 'Recursos adicionais repassados pela União ao Fundeb para complementar os valores dos fundos estaduais e assegurar maior equidade no financiamento da educação básica.' },
  { termo: 'Resultado líquido do Fundeb', grupo: 'Fundeb', busca: ['resultado liquido'], texto: 'Diferença entre os recursos recebidos pelo município ou pelo estado por meio do Fundeb e os valores de sua contribuição ao Fundo em âmbito estadual. Quando o resultado é positivo ou negativo, significa que o ente recebeu mais ou menos recursos do que contribuiu.' },
  { termo: 'Fundeb', grupo: 'Fundeb', busca: ['fundeb', 'fundef'], texto: 'Fundo de Manutenção e Desenvolvimento da Educação Básica e de Valorização dos Profissionais da Educação. Reúne recursos provenientes de impostos e transferências dos estados, do Distrito Federal e dos municípios, além da complementação da União, e os redistribui para financiar a educação básica pública, conforme o número de alunos de cada rede.' },

  // ---- aplicação em educação
  { termo: 'MDE', grupo: 'Aplicação em educação', busca: ['mde'], texto: 'Manutenção e Desenvolvimento do Ensino. Despesas com ações de manutenção e desenvolvimento do ensino que podem ser contabilizadas para o cumprimento do mínimo constitucional de 25% da receita resultante de impostos, incluídas as transferências, conforme o art. 212 da Constituição Federal.' },
  { termo: 'RPEB', grupo: 'Aplicação em educação', busca: ['rpeb'], texto: 'Receita Potencial Mínima vinculada à Educação Básica. Estimativa do valor mínimo de recursos que deve ser destinado à educação básica, considerando as receitas vinculadas à manutenção e ao desenvolvimento do ensino e as transferências universais do FNDE.' },
  { termo: 'Despesas de capital', grupo: 'Aplicação em educação', busca: ['despesas de capital', 'despesas de capita'], texto: 'Despesas destinadas a investimentos, como construção, aquisição de equipamentos, mobiliário e veículos.' },
  { termo: 'Instituições conveniadas', grupo: 'Aplicação em educação', busca: ['conveniadas'], texto: 'Instituições comunitárias, confessionais ou filantrópicas, sem fins lucrativos, que mantêm convênios com o poder público e podem receber recursos públicos para a oferta educacional, conforme os requisitos legais.' },
  { termo: 'Pessoal inativo', grupo: 'Aplicação em educação', busca: ['inativo'], texto: 'Aposentados e pensionistas vinculados à área da educação. Esses gastos não integram o cálculo do mínimo constitucional de 25% em MDE.' },

  // ---- modalidades da educação básica
  { termo: 'EJA', grupo: 'Modalidades da Educação Básica', busca: ['jovens e adultos', 'eja'], texto: 'Educação de Jovens e Adultos: destinada a quem não teve acesso ou continuidade de estudos no Ensino Fundamental ou Médio na idade prevista na legislação.' },
  { termo: 'Educação Especial', grupo: 'Modalidades da Educação Básica', busca: ['educacao especial'], texto: 'Atendimento educacional especializado voltado a estudantes com deficiência, transtornos globais do desenvolvimento e altas habilidades/superdotação, preferencialmente na rede regular de ensino.' },
  { termo: 'EPT', grupo: 'Modalidades da Educação Básica', busca: ['ensino profissional', 'educacao profissional', 'ept'], texto: 'Educação Profissional e Tecnológica. Integra a formação geral com habilitação técnica para o mundo do trabalho (oferecida principalmente no Ensino Médio ou na EJA).' },
  { termo: 'Educação do Campo', grupo: 'Modalidades da Educação Básica', busca: ['educacao do campo'], texto: 'Voltada às populações rurais (agricultores, extrativistas, ribeirinhos), adaptando conteúdos e calendários à realidade do campo.' },
  { termo: 'Educação Escolar Indígena', grupo: 'Modalidades da Educação Básica', busca: ['educacao escolar indigena', 'educacao indigena'], texto: 'Garantia de ensino intercultural, bilíngue e comunitário, preservando a memória, línguas e identidades dos povos indígenas.' },
  { termo: 'Educação Escolar Quilombola', grupo: 'Modalidades da Educação Básica', busca: ['educacao escolar quilombola', 'quilombola'], texto: 'Oferecida com materiais e metodologias específicos que valorizam a cultura, história e saberes das comunidades quilombolas.' },
];

const normalizar = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Explicação do termo mais específico encontrado no nome da coluna (ou null)
export const explicarColuna = (nomeColuna) => {
  if (!nomeColuna) return null;
  const n = normalizar(nomeColuna);
  const exato = GLOSSARIO.find((g) => g.exato && g.exato.includes(n.trim()));
  if (exato) return `${exato.termo}: ${exato.texto}`;
  const achado = GLOSSARIO.find((g) => g.busca.some((b) => new RegExp(`(^|[^a-z])${b}([^a-z]|$)`).test(n)));
  return achado ? `${achado.termo}: ${achado.texto}` : null;
};
