import React from "react";
import StateChartComponent from "./StateChartComponent";
import {
  processRevenueCompositionData,
  processConstitutionalTransfersData,
} from "../../../../../../utils/processStateData";

const StateRevenueCompositionCharts = ({ data }) => {
  return (
    <div className="state-revenue-composition-charts">
      <StateChartComponent
        key="revenue-composition"
        indicatorType="revenue-composition"
        processDataFunction={processRevenueCompositionData}
        title="Composição das Receitas de Impostos Próprios do Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.revenueComposition}
      />

      <StateChartComponent
        key="constitutional-transfers"
        indicatorType="constitutional-transfers"
        processDataFunction={processConstitutionalTransfersData}
        title="Composição das Transferências Constitucionais Recebidas pelo Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.constitutionalTransfers}
      />
    </div>
  );
};

export default StateRevenueCompositionCharts;
