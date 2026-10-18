// Anos em que o modelo do RREO (Anexo 8) mudou — marcados nas tabelas para
// ninguém comparar com os anos anteriores sem saber. Base: fichas técnicas e
// docs/decisoes.md (novo Fundeb a partir de 2021; novo modelo em 2023).

export const MUDANCAS_RREO = {
  2021:
    'Em 2021 mudou o modelo do relatório de onde vêm estes dados (o Anexo 8 do RREO, que cada município entrega com as contas da educação), por causa do novo Fundeb. Algumas linhas mudaram de nome, foram juntadas ou deixaram de existir, e o mínimo do Fundeb para pagar profissionais subiu de 60% para 70%. Por isso, compare com cuidado com os anos anteriores.',
  2023:
    'Em 2023 o modelo do relatório (Anexo 8 do RREO) mudou de novo: entrou o VAAR, um dinheiro extra da União para redes que melhoram seus resultados na educação. Algumas linhas mudaram em relação a 2021 e 2022.',
};

export const mudancaRREO = (ano) => MUDANCAS_RREO[Number(ano)] || null;
