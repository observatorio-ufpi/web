import React from "react";
import StateChartComponent from "./StateChartComponent";
import {
  processFundebData,
} from "../../../../../../utils/processStateData";

const StateFundebCharts = ({ data }) => {
  return (
    <div className="state-fundeb-charts">
      <StateChartComponent
        key="fundeb-composition"
        indicatorType="fundeb-composition"
        processDataFunction={processFundebData}
        title="Composição do Fundeb no Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.fundeb}
      />
    </div>
  );
};

export default StateFundebCharts;
