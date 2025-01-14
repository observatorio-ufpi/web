import React from "react";
import ChartComponent from "./ChartComponent";
import {
  processFundebParticipationMde,
  processResultadoLiquidoFundeb,
  processParticipacaoComplementacaoUniao,
} from "../utils/processRpebCompositionCharts";

const RpebCompositionCharts = ({ data }) => {
  return (
    <div className="rpeb-composition-charts">
      <ChartComponent
        key="fundeb_participation_mde"
        indicatorType="fundeb_participation_mde"
        processDataFunction={processFundebParticipationMde}
        title="Composição do Fundeb na RPEB [%]"
        data={data.fundebParticipationMde}
      />

      <ChartComponent
        key="resultado_liquido_fundeb"
        indicatorType="resultado_liquido_fundeb"
        processDataFunction={processResultadoLiquidoFundeb}
        title="Composição do Resultado Líquido do Fundeb na RPEB [%]"
        data={data.resultadoLiquidoFundeb}
      />

      <ChartComponent
        key="participacao_complementacao_uniao"
        indicatorType="participacao_complementacao_uniao"
        processDataFunction={processParticipacaoComplementacaoUniao}
        title="Composição da Participação Complementação da União na RPEB [%]"
        data={data.participacaoComplementacaoUniao}
      />
    </div>
  );
};

export default RpebCompositionCharts;
