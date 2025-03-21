import React from "react";
import {
  processFundebFinancingCapacity,
  processMdePessoalAtivo,
  processMdeTotalExpense,
  processRpebFinancingCapacity,
} from "../../../../../../utils/processIndicatorsData";
import ChartComponent from "./ChartComponent";

const FinancingCapacityCharts = ({ data }) => {
  return (
    <div className="financing-capacity-charts">
      <ChartComponent
        key="composicao_rpeb_financiamento"
        indicatorType="composicao_rpeb_financiamento"
        processDataFunction={processRpebFinancingCapacity}
        title=""
        data={data.composicaoRpebFinanciamento}
      />

      <ChartComponent
        key="composicao_fundeb_financiamento"
        indicatorType="composicao_fundeb_financiamento"
        processDataFunction={processFundebFinancingCapacity}
        title="Receita Potencial mínima vinculada para a Educação Básica (RPEb) [R$]"
        data={data.composicaoFundebFinanciamento}
      />
    </div>
  );
};

export default FinancingCapacityCharts;
