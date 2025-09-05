import React from "react";
import StateChartComponent from "./StateChartComponent";
import {
  processMDEData,
  processMDEPercentageData,
} from "../../../../../../utils/processStateData";

const StateMDECharts = ({ data }) => {
  return (
    <div className="state-mde-charts">
      <StateChartComponent
        key="mde-values"
        indicatorType="mde-values"
        processDataFunction={processMDEData}
        title="Valores Exigidos e Aplicados em MDE no Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.mde}
      />

      <StateChartComponent
        key="mde-percentage"
        indicatorType="mde-percentage"
        processDataFunction={processMDEPercentageData}
        title="Percentual Aplicado em MDE no Estado do Piauí"
        chartType="line"
        yAxisLabel="Percentual (%)"
        data={data.mde}
      />
    </div>
  );
};

export default StateMDECharts;
