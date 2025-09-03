import React from "react";
import ChartComponent from "./ChartComponent";
import {
  processMdeTotalExpense,
  processMdePessoalAtivo,
  processMdePessoalInativo,
  processMdeCapital,
  processMdeTransferenciasInstituicoesPrivadas,
} from "../../../../../../utils/processIndicatorsData";

const EducationExpenseCompositionCharts = ({ data }) => {
  return (
    <div className="education-expense-composition-charts">
      <ChartComponent
        key="mde_total_expense"
        indicatorType="mde_total_expense"
        processDataFunction={processMdeTotalExpense}
        title="Composição da Despesa Total em MDE"
        enableMonetaryCorrection={true}
        data={data.mdeTotalExpense}
      />

      <ChartComponent
        key="mde_pessoal_ativo"
        indicatorType="mde_pessoal_ativo"
        processDataFunction={processMdePessoalAtivo}
        title="Composição das Despesas com Pessoal Ativo em MDE [%]"
        data={data.mdePessoalAtivo}
      />

      <ChartComponent
        key="mde_pessoal_inativo"
        indicatorType="mde_pessoal_inativo"
        processDataFunction={processMdePessoalInativo}
        title="Composição das Despesas com Pessoal Inativo em MDE [%]"
        data={data.mdePessoalInativo}
      />

      <ChartComponent
        key="mde_capital"
        indicatorType="mde_capital"
        processDataFunction={processMdeCapital}
        title="Composição das Despesas de Capital em MDE [%]"
        data={data.mdeCapital}
      />

      <ChartComponent
        key="mde_transferencias_instituicoes_privadas"
        indicatorType="mde_transferencias_instituicoes_privadas"
        processDataFunction={processMdeTransferenciasInstituicoesPrivadas}
        title="Composição das Transferências para Instituições Privadas em MDE [%]"
        data={data.mdeTransferenciasInstituicoesPrivadas}
      />
    </div>
  );
};

export default EducationExpenseCompositionCharts;
