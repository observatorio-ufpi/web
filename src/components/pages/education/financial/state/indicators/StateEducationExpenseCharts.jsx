import React from "react";
import StateChartComponent from "./StateChartComponent";
import {
  processEducationProfessionalsData,
} from "../../../../../../utils/processStateData";

const StateEducationExpenseCharts = ({ data }) => {
  return (
    <div className="state-education-expense-charts">
      <StateChartComponent
        key="education-professionals"
        indicatorType="education-professionals"
        processDataFunction={processEducationProfessionalsData}
        title="Despesas com Profissionais da Educação Básica no Estado do Piauí"
        enableMonetaryCorrection={true}
        data={data.educationProfessionals}
      />
    </div>
  );
};

export default StateEducationExpenseCharts;
