import React from "react";
import StateChartComponent from "./StateChartComponent";
import {
  processRPEBCompositionData,
} from "../../../../../../utils/processStateData";

const StateRPEBCharts = ({ data }) => {
  return (
    <div className="state-rpeb-charts">
      <StateChartComponent
        key="rpeb-composition"
        indicatorType="rpeb-composition"
        processDataFunction={processRPEBCompositionData}
        title="Composição da Receita Potencial da Educação Básica (RPEB) no Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.rpeb}
      />
    </div>
  );
};

export default StateRPEBCharts;
