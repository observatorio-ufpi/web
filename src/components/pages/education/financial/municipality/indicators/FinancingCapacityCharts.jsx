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
        title="Receita Potencial mínima vinculada para a Educação Básica (RPEb) [R$]"
        data={data.composicaoRpebFinanciamento}
        enableMonetaryCorrection={true}
      />

      <ChartComponent
        key="composicao_fundeb_financiamento"
        indicatorType="composicao_fundeb_financiamento"
        processDataFunction={processFundebFinancingCapacity}
        title="Participação do Fundeb na composição da receita para educação"
        data={data.composicaoFundebFinanciamento}
      />
    </div>
  );
};

export default FinancingCapacityCharts;
