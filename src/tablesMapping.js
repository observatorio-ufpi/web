export const mapOwnRevenues = {
  "IPTU": ["RECEITA_RESULTANTE_IMPOSTO_IPTU", "IPTU_RECEITA_RESULTANTE", "RECEITA_IPTU"],
  "ITBI": ["ITBI_RECEITA_RESULTANTE", "RECEITA_ITBI", "RECEITA_RESULTANTE_ITBI"],
  "ISS": ["RECEITA_ISS", "ISS_RECEITA_RESULTANTE", "RECEITA_RESULTANTE_ISS"],
  "IRRF": ["IRRF_RECEITA_RESULTANTE", "RECEITA_RESULTANTE_IRRF", "RECEITA_IRRF"],
  "ITR": ["ITR_RECEITA_RESULTANTE"],
  "TOTAL": ["RECEITAS_DE_IMPOSTO", "RECEITAS_DE_IMPOSTOS", "RECEITA_DE_IMPOSTOS"]
};

export const mapConstitutionalTransfersRevenue = {
  "FPM": ["FPM", "COTA_PARTE_FPM"],
  "Cota parte ICMS": ["COTA_PARTE_ICMS"],
  "ICMS Desoneração LC87/96": ["ICMS_DESONERACAO", "ICMS_DESONERACAO_LC_87_1996"],
  "Cota parte IPI-Exp": ["IPI_EXPORTACAO", "COTA_PARTE_IPI_EXPORTACAO"],
  "Cota-parte ITR": ["COTA_PARTE_ITR_100_PORCENTO", "COTA_PARTE_ITR"],
  "Cota-parte IPVA": ["COTA_PARTE_IPVA", "COTA_PARTE_IPVA_100_PORCENTO"],
  "Cota-parte IOF-Ouro": ["COTA_PARTE_IOF_OURO_100_PORCENTO", "COTA_PARTE_IOF_OURO"],
  "Outras transferências e compensações financeiras de impostos e transferências constitucionais": ["COMPENSACOES_FINANCEIRAS"],
  "TOTAL": ["RECEITAS_DE_TRANSFERENCIAS_CONSTITUCIONAIS_E_LEGAL", "RECEITA_DE_TRANSFERENCIAS_CONSTITUCIONAIS_E_LEGAIS", "RECEITA_TRANSFERENCIAS_CONSTITUCIONAIS"]
}

export const mapMunicipalTaxesRevenues = {
  "Receita líquida de impostos próprios": ["RECEITAS_DE_IMPOSTO", "RECEITA_DE_IMPOSTOS", "RECEITAS_DE_IMPOSTOS"],
  "Receita líquida de transferências constitucionais federais (FPM, IPI-EXP, IOF-Ouro, ICMS desoneração)": [
    "RECEITAS_DE_TRANSFERENCIAS_CONSTITUCIONAIS_E_LEGAL",
    "RECEITA_DE_TRANSFERENCIAS_CONSTITUCIONAIS_E_LEGAIS",
    "RECEITA_TRANSFERENCIAS_CONSTITUCIONAIS"
  ],
  "TOTAL": ["RECEITA_RESULTANTE_DE_IMPOSTOS", "TOTAL_RECEITA_BRUTA_IMPOSTOS", "TOTAL_RECEITA_IMPOSTOS"]
};

export const mapAdditionalMunicipalEducationRevenue = {
  "Salário-Educação": ["TRANSFERENCIAS_DO_SALARIO_EDUCACAO", "TRANSFERENCIAS_SALARIO_EDUCACAO", "FIN_ENSINO_SALARIO_EDUCACAO"],
  "Outras transferências do FNDE": [
    "OUTRAS_TRANSFERENCIAS_DO_FNDE",
    "OUTRAS_TRANSFERENCIAS_FNDE",
    "FIN_ENSINO_OUTRAS_TRANSFERENCIAS_FNDE"
  ],
  "Aplicação financeira dos recursos do FNDE": ["APLICACAO_FINANCEIRA_FNDE"],
  "PDDE": ["TRANSFERENCIAS_DIRETAS_PDDE", "FIN_ENSINO_PDDE"],
  "PNAE": ["TRANSFERENCIAS_DIRETAS_PNAE", "FIN_ENSINO_PNAE"],
  "PNATE": ["FIN_ENSINO_PNATE", "TRANSFERENCIAS_DIRETAS_PNATE"],
  "Convênios": [
    "TRANSFERENCIAS_DESTINADAS_A_PROGRAMAS_DE_EDUCACAO",
    "TRANSFERENCIAS_CONVENIOS_PROGRAMAS_EDUCACAO",
    "TRANSFERENCIAS_CONVENIOS",
    "FIN_ENSINO_RECEITA_TRANSFERENCIAS_CONVENIOS"
  ],
  "Operação de créditos": [
    "RECEITA_DE_OPERACOES_DE_CREDITO_DESTINADAS_A_EDUCACAO",
    "RECEITA_OPERACOES_CREDITO_DESTINADA_EDUCACAO",
    "RECEITA_OPERACOES_CREDITO",
    "FIN_ENSINO_RECEITA_OPERACOES_CREDITO_EDUCACAO"
  ],
  "Royalties": ["FIN_ENSINO_RECEITA_ROYALTIES_DESTINADOS_EDUCACAO"],
  "Outras receitas": ["FIN_ENSINO_OUTRAS_RECEITAS", "OUTRAS_RECEITAS_FINANCIAMENTO_ENSINO", "OUTRAS_RECEITAS_DESTINADAS_EDUCACAO"],
  "TOTAL": ["TOTAL", "TOTAL_OUTRAS_RECEITAS_DESTINADAS_ENSINO", "TOTAL_RECEITAS_ADICIONAIS_FINANCIAMENTO_ENSINO", "FIN_ENSINO_TOTAL_RECEITAS_ADICIONAIS"]
};

export const mapMunicipalFundebFundefComposition = {
  "Contribuição na formação do Fundef/Fundeb – destinada": ["PARCELA_TRANSFERENCIAS_DESTINADAS_A_FORMACAO_DO_FUNDEF", "RECEITAS_DESTINADAS_AO_FUNDEB", "TOTAL_DESTINADO_FUNDEB"],
  "Receita recebida na redistribuição interna do Fundeb (Transferência de recursos do Fundeb)": ["TRANSFERENCIAS_DE_RECURSOS_DO_FUNDEF", "TRANSFERENCIAS_RECURSOS_FUNDEB", "TRANSFERENCIAS_DE_RECURSOS_DO_FUNDEB", "FUNDEB_PRINCIPAL_6_1_1"],
  "Resultado Líquido (ganhos ou perdas = recebido - enviado)": ["RESULTADO_LIQUIDO", "RESULTADO_LIQUIDO_TRANSFERENCIAS_FUNDEB", "RESULTADO_LIQUIDO_DAS_TRANSFERENCIAS_DO_FUNDEB"],
  "Complementação da União": ["COMPLEMENTACAO_DA_UNIAO_AO_FUNDEF", "COMPLEMENTACAO_UNIAO_FUNDEB", "COMPLEMENTACAO_DA_UNIAO_AO_FUNDEB", "COMPLEMENTACAO_UNIAO"],
  "Receita da aplicação financeira do Fundeb": ["RECEITA_APLICACAO_FINANCEIRA_RECURSOS_FUNDEB", "RECEITA_DE_APLICACAO_FINANCEIRA_DOS_RECURSOS_DO_FUNDEB", "RECEITA_APLICACAO_FINANCEIRA"],
  "Total do Fundeb": ["TOTAL_FUNDEB", "RECEITAS_RECEBIDAS_DO_FUNDEB", "RECEITAS_RECEBIDAS_FUNDEB"]
}

export const mapComplementationFundebFundef = {
  "VAAF": ["COMPLEMENTACAO_DA_UNIAO_AO_FUNDEF", "COMPLEMENTACAO_UNIAO_FUNDEB", "COMPLEMENTACAO_DA_UNIAO_AO_FUNDEB", "FUNDEB_PRINCIPAL_6_2_1"],
  "VAAT": ["FUNDEB_PRINCIPAL_6_3_1"],
  "TOTAL": ["TOTAL"]
}

export const mapAreasActivityExpense = {
  "Educação Infantil": ["EDUCACAO_INFANTIL", "MDE_EDUCACAO_INFANTIL", "MDE_DESPESAS_EDUCACAO_INFANTIL"],
  "Creche": ["CRECHE", "MDE_DESPESAS_CRECHE", "MDE_DESPESAS_EDUCACAO_INFANTIL_CRECHE"],
  "Pré-escola": ["PRE_ESCOLA", "MDE_DESPESAS_EDUCACAO_INFANTIL_PRE_ESCOLA", "MDE_DESPESAS_PRE_ESCOLA"],
  "Ensino Fundamental": ["ENSINO_FUNDAMENTAL", "MDE_ENSINO_FUNDAMENTAL", "MDE_DESPESAS_ENSINO_FUNDAMENTAL"],
  "Ensino Médio": ["OUTRAS_DESPESAS_ENSINO_MEDIO", "MDE_DESPESAS_ENSINO_MEDIO", "ENSINO_MEDIO"],
  "Ensino Superior": ["ENSINO_SUPERIOR", "MDE_DESPESAS_ENSINO_SUPERIOR", "OUTRAS_DESPESAS_ENSINO_SUPERIOR"],
  "Educação Especial": ["EDUCACAO_ESPECIAL"],
  "Educação Jovens e Adultos": ["EDUCACAO_DE_JOVENS_E_ADULTOS"],
  "Ensino Profissional não integrado ao ensino regular": ["OUTRAS_DESPESAS_ENSINO_PROFISSIONAL_NAO_INTEGRADO", "MDE_DESPESAS_ENSINO_PROFISSIONAL_NAO_INTEGRADO_ENSINO_REGULAR", "ENSINO_PROFISSIONAL"],
  "Outras": ["OUTRAS_SUBFUNCOES", "MDE_OUTRAS_DESPESAS"],
  "TOTAL despesas típicas com MDE": ["TOTAL", "MDE_TOTAL_DESPESAS_ACOES_TIPICAS", "TOTAL_DESPESAS_COM_ACOES_TIPICAS_MDE", "TOTAL_DAS_DESPESAS_COM_ENSINO"]
}

const standardizeType = (type, map) => {
  for (const [standardType, types] of Object.entries(map)) {
    if (types.includes(type)) {
      return standardType;
    }
  }
  return type;
};

export const standardizeTypeOwnRevenues = (type) => standardizeType(type, mapOwnRevenues);
export const standardizedTypeConstitutionalTransfersRevenue = (type) => standardizeType(type, mapConstitutionalTransfersRevenue)
export const standardizeTypeMunicipalTaxesRevenues = (type) => standardizeType(type, mapMunicipalTaxesRevenues);
export const standardizeTypeAdditionalEducationRevenues = (type) => standardizeType(type, mapAdditionalMunicipalEducationRevenue);
export const standardizedTypeMunicipalFundebFundefComposition = (type) => standardizeType(type, mapMunicipalFundebFundefComposition)
export const standardizedTypeComplementationFundebFundef = (type) => standardizeType(type, mapComplementationFundebFundef)
export const standardizedTypeAreasActivityExpense = (type) => standardizeType(type, mapAreasActivityExpense)
