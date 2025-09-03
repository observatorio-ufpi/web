import React from "react";
import StateChartComponent from "./StateChartComponent";
import {
  processAdditionalRevenueData,
} from "../../../../../../utils/processStateData";

const StateAdditionalRevenueCharts = ({ data }) => {
  return (
    <div className="state-additional-revenue-charts">
      <StateChartComponent
        key="additional-revenue"
        indicatorType="additional-revenue"
        processDataFunction={processAdditionalRevenueData}
        title="Receitas Adicionais para o Financiamento do Ensino no Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.additionalRevenue}
      />
    </div>
  );
};

export default StateAdditionalRevenueCharts;
