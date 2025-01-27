import React from "react";
import ChartComponent from "./ChartComponent";
import {
  processMdeResourcesApplicationControl,
  processFundebResourcesApplicationControl,
  processEducationalVaatResourcesApplicationControl,
  processCapitalVaatResourcesApplicationControl,
} from "../utils/processIndicatorsData";

const ResourcesApplicationControlCharts = ({ data }) => {
  return (
    <div className="resources-application-control-charts">
      <ChartComponent
        key="mde"
        indicatorType="mde"
        processDataFunction={processMdeResourcesApplicationControl}
        title="Aplicação em MDE"
        data={data.aplicacaoMde}
      />

      <ChartComponent
        key="fundeb"
        indicatorType="fundeb"
        processDataFunction={processFundebResourcesApplicationControl}
        title="Aplicação em Fundeb"
        data={data.aplicacaoFundeb}
      />

      <ChartComponent
        key="ed-infantil-vaat"
        indicatorType="ed-infantil-vaat"
        processDataFunction={processEducationalVaatResourcesApplicationControl}
        title="Aplicação do VAAT em Educação Infantil"
        data={data.aplicacaoVaatEducacaoInfantil}
      />

      <ChartComponent
        key="despesa-capital-vaat"
        indicatorType="despesa-capital-vaat"
        processDataFunction={processCapitalVaatResourcesApplicationControl}
        title="Aplicação do VAAT em Despesa de Capital"
        data={data.aplicacaoVaatDespesaCapital}
      />
    </div>
  );
};

export default ResourcesApplicationControlCharts;
