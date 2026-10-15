import React from 'react';
import { Box, Typography } from '@mui/material';
import { cores } from '../../theme/tokens';

// Conteúdo da Ficha Técnica de cada tabela/página (antes: um texto genérico
// "estarão disponíveis aqui"). Base: DOCUMENTACAO_TECNICA.md (seção 7) e
// docs/decisoes.md. Se a regra de cálculo mudar no código, atualize aqui.

const FONTE_RREO =
  'RREO — Relatório Resumido da Execução Orçamentária, Anexo 8 (Demonstrativo das Receitas e Despesas com MDE), 6º bimestre, publicado no SIOPE/FNDE. Elaboração: OPEPI/UFPI.';
const PERIODO_RREO =
  'Anual (6º bimestre, que representa o acumulado do exercício). Série de 2007 a 2024, conforme a disponibilidade de cada município e ano.';
const VALORES_RREO =
  'Valores nominais em reais, como declarados pelo município. O botão "Correção monetária" atualiza os valores pelo IPCA para comparar anos diferentes.';
const LAYOUT_RREO =
  'O formato do RREO mudou ao longo dos anos (principalmente em 2021 e 2023). Algumas linhas não existem em todos os períodos — nesses casos a tabela mostra "–".';

const MUNICIPAIS = {
  ownRevenues: {
    oQue: 'Quanto cada município arrecadou com seus próprios impostos: IPTU, ITBI, ISS, IRRF e ITR (este último só onde o layout do RREO prevê).',
    calculo: 'Soma das receitas realizadas de cada imposto. O total é a receita resultante de impostos próprios.',
  },
  constitutionalTransfersRevenue: {
    oQue: 'Repasses constitucionais e legais que o município recebe da União e do Estado: FPM, cota-parte do ICMS, ICMS-desoneração, IPI-Exportação, ITR, IPVA, IOF-Ouro e outras compensações.',
    calculo: 'Receitas realizadas de cada transferência; o total é a soma das rubricas do período.',
  },
  municipalTaxesRevenues: {
    oQue: 'Receita líquida de impostos: impostos próprios mais as transferências constitucionais elegíveis. É a base usada para calcular o mínimo constitucional em MDE.',
    calculo: 'Total = receita líquida de impostos próprios + receita líquida de transferências constitucionais (FPM, IPI-Exp, IOF-Ouro, ICMS-desoneração).',
  },
  additionalEducationRevenue: {
    oQue: 'Recursos para a educação além dos impostos: salário-educação, transferências do FNDE (PDDE, PNAE, PNATE e outras), convênios, operações de crédito, royalties e outras receitas.',
    calculo: 'Receitas realizadas de cada rubrica; o total é a soma das receitas adicionais para financiamento do ensino.',
  },
  municipalFundebFundefComposition: {
    oQue: 'Como o Fundeb (Fundef até 2006) do município é formado: quanto ele destina ao fundo, quanto recebe de volta, a complementação da União, rendimentos e ressarcimentos.',
    calculo: 'Resultado líquido = transferências recebidas do Fundeb − contribuição destinada ao Fundeb. Valor positivo indica que o município recebeu mais do que contribuiu.',
  },
  complementationFundebFundef: {
    oQue: 'Complementação da União ao Fundeb do município, por modalidade: VAAF, VAAT (a partir de 2021) e VAAR (a partir de 2023).',
    calculo: 'Total = VAAF + VAAT + VAAR, considerando as parcelas existentes no ano.',
  },
  constitutionalLimitMde: {
    oQue: 'Se o município cumpriu o mínimo constitucional de aplicar 25% da receita de impostos em Manutenção e Desenvolvimento do Ensino (CF, art. 212).',
    calculo: 'Valor exigido = 25% × receita de impostos (base constitucional). Valor aplicado = despesas típicas de MDE − deduções constitucionais. % aplicado = valor aplicado ÷ base constitucional × 100. O valor exigido é calculado pelo sistema, não lido do RREO.',
  },
  expensesBasicEducationFundeb: {
    oQue: 'Quanto do Fundeb foi gasto com profissionais da educação básica.',
    calculo: '% = despesas elegíveis com profissionais ÷ receitas do Fundeb × 100. Mínimo legal: 60% para remuneração do magistério até 2020 (Lei 11.494/2007) e 70% para profissionais da educação básica a partir de 2021 (Lei 14.113/2020) — compare os anos sabendo dessa mudança.',
  },
  areasActivityExpense: {
    oQue: 'Despesas típicas de MDE por área de atuação: educação infantil (creche e pré-escola), ensino fundamental, médio, superior, especial, EJA, profissional e outras.',
    calculo: 'Despesas liquidadas de cada área. Creche e pré-escola já estão somadas em Educação Infantil. A partir de 2021, as linhas de "outras despesas com educação" do RREO não entram, por não serem MDE; por isso Ensino Médio, Superior e similares podem aparecer vazios em 2021–2024.',
  },
  basicEducationMinimalPotential: {
    oQue: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB): estimativa do mínimo de recursos disponíveis para a educação básica. É um indicador composto, não uma linha do RREO.',
    calculo: 'RPEB = 25% da receita de impostos e transferências − recursos destinados ao Fundeb + recursos recebidos do Fundeb + complementação da União + salário-educação + programas do FNDE + royalties destinados à educação.',
  },
  complementaryProtocol: {
    oQue: 'Indicadores complementares do novo Fundeb: aplicação do VAAT na educação infantil e em despesas de capital, despesas com pessoal ativo e inativo, transferências a instituições conveniadas, despesas de capital e recursos de MDE fora do Fundeb.',
    calculo: 'Percentuais e valores informados no RREO a partir de 2021. Mínimos do VAAT (Lei 14.113/2020): 50% na educação infantil e 15% em despesas de capital — só se aplicam a quem recebe complementação VAAT (0% indica que o município não recebeu).',
  },
};

const OUTRAS = {
  estado: {
    oQue: 'Dados financeiros da educação do Estado do Piauí (rede estadual), organizados nas mesmas categorias das tabelas municipais.',
    calculo: 'Valores do RREO estadual (Anexo 8). Percentuais mínimos: 25% em MDE (CF, art. 212); Fundeb para profissionais: 60% até 2020 e 70% a partir de 2021.',
  },
  indicadoresMunicipais: {
    oQue: 'Indicadores calculados a partir das tabelas municipais: composição das receitas, capacidade de financiamento, recursos do Fundeb, controle da aplicação e investimento em educação.',
    calculo: 'Cada indicador é uma razão entre rubricas do RREO (ex.: participação do Fundeb = receitas do Fundeb ÷ receita resultante de impostos × 100). Divisões por zero retornam 0.',
  },
  indicadoresEstaduais: {
    oQue: 'Gráficos da evolução das finanças da educação do Estado do Piauí: composição das receitas, Fundeb, MDE, despesas com educação, receitas adicionais e RPEB.',
    calculo: 'Calculados a partir das tabelas estaduais, com as mesmas regras das tabelas.',
  },
};

const EDUCACAO = {
  basica: {
    oQue: 'Dados da educação básica no Piauí: matrículas, escolas, turmas, professores, pessoal auxiliar e funcionários, com detalhamento por etapa, localidade, rede e município.',
    calculo: 'Contagens por ano. Sem detalhamento escolhido, os totais somam combinações fixas para evitar contar o mesmo aluno duas vezes. Etapas anteriores a 2021 são convertidas para a classificação atual quando a série atravessa 2020/2021.',
    fonte: 'Censo Escolar da Educação Básica (INEP).',
    periodo: 'Anual.',
  },
  superior: {
    oQue: 'Dados da educação superior no Piauí: instituições, matrículas de graduação, docentes e cursos, com detalhamento por modalidade, rede, organização acadêmica, faixa etária, instituição e município.',
    calculo: 'Contagens por ano, conforme os registros importados.',
    fonte: 'Censo da Educação Superior (INEP).',
    periodo: 'Anual.',
  },
  taxas: {
    oQue: 'Indicadores educacionais da população: pessoas fora da escola, frequência líquida, analfabetismo, conclusão da educação básica e do ensino superior e nível de instrução.',
    calculo: 'Os valores vêm calculados na base importada; o sistema não recalcula os denominadores das taxas.',
    periodo: 'Conforme a disponibilidade de cada indicador.',
  },
  condicoes: {
    oQue: 'Condições de oferta das escolas: local de funcionamento, infraestrutura básica, espaços pedagógicos, equipamentos e materiais.',
    calculo: 'Contagem de escolas que declaram cada item.',
    fonte: 'Censo Escolar da Educação Básica (INEP).',
    periodo: 'Anual.',
  },
};

const Secao = ({ titulo, children }) => (
  <Box sx={{ marginBottom: '18px' }}>
    <Typography sx={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: cores.marca, marginBottom: '4px' }}>
      {titulo}
    </Typography>
    <Typography sx={{ fontSize: '15px', lineHeight: 1.6, color: cores.texto }}>{children}</Typography>
  </Box>
);

// chave: id da tabela municipal (ex.: "ownRevenues"), "estado", "indicadoresMunicipais",
// "indicadoresEstaduais" ou uma categoria educacional ("basica", "superior", "taxas", "condicoes")
export const ConteudoFicha = ({ chave }) => {
  const financeira = MUNICIPAIS[chave] || OUTRAS[chave];
  if (financeira) {
    return (
      <>
        <Secao titulo="O que mostra">{financeira.oQue}</Secao>
        <Secao titulo="Como é calculado">{financeira.calculo}</Secao>
        <Secao titulo="Fonte">{FONTE_RREO}</Secao>
        <Secao titulo="Periodicidade">{PERIODO_RREO}</Secao>
        <Secao titulo="Valores">{VALORES_RREO}</Secao>
        <Secao titulo="Observação">{LAYOUT_RREO}</Secao>
      </>
    );
  }
  const edu = EDUCACAO[chave];
  if (edu) {
    return (
      <>
        <Secao titulo="O que mostra">{edu.oQue}</Secao>
        <Secao titulo="Como é calculado">{edu.calculo}</Secao>
        {edu.fonte && <Secao titulo="Fonte">{edu.fonte} Elaboração: OPEPI/UFPI.</Secao>}
        {edu.periodo && <Secao titulo="Periodicidade">{edu.periodo}</Secao>}
      </>
    );
  }
  return null;
};

export const temFicha = (chave) => Boolean(MUNICIPAIS[chave] || OUTRAS[chave] || EDUCACAO[chave]);
