import React from 'react';
import ChartComponent from './ChartComponent';
import {
  processIptuData,
  processIssData,
  processItbiData,
  processIrrfData,
  processIpvaData,
  processIcmsData,
  processFpmData,
  processIofOuroData,
  processOutrasTransferenciasData,
  processIcmsDesoneracaoData,
  processCotaParteIpiData,
  processCotaParteItrData
} from '../utils/processRevenueCompositionCharts';

const RevenueCompositionCharts = ({ data }) => {
  return (
    <div className="revenue-composition-charts">
      <ChartComponent
        key="iptu"
        indicatorType="iptu"
        processDataFunction={processIptuData}
        title="Composição do IPTU na Receita Total de Impostos [%]"
        data={data.iptu}
      />

      <ChartComponent
        key="itbi"
        indicatorType="itbi"
        processDataFunction={processItbiData}
        title="Composição do ITBI na Receita Total de Impostos [%]"
        data={data.itbi}
      />

      <ChartComponent
        key="iss"
        indicatorType="iss"
        processDataFunction={processIssData}
        title="Composição do ISS na Receita Total de Impostos [%]"
        data={data.iss}
      />

      <ChartComponent
        key="irrf"
        indicatorType="irrf"
        processDataFunction={processIrrfData}
        title="Composição do IRRF na Receita Total de Impostos [%]"
        data={data.irrf}
      />

      <ChartComponent
        key="fpm"
        indicatorType="fpm"
        processDataFunction={processFpmData}
        title="Composição do FPM na Receita Total de Impostos [%]"
        data={data.fpm}
      />

      <ChartComponent
        key="icms"
        indicatorType="icms"
        processDataFunction={processIcmsData}
        title="Composição do ICMS na Receita Total de Impostos [%]"
        data={data.icms}
      />

      <ChartComponent
        key="icms-desoneracao"
        indicatorType="icms-desoneracao"
        processDataFunction={processIcmsDesoneracaoData}
        title="Composição do ICMS Desoneração na Receita Total de Impostos [%]"
        data={data.icmsDesoneracao}
      />

      <ChartComponent
        key="cota-parte-ipi"
        indicatorType="cota-parte-ipi"
        processDataFunction={processCotaParteIpiData}
        title="Composição do IPI na Receita Total de Impostos [%]"
        data={data.cotaParteIpi}
      />

      <ChartComponent
        key="cota-parte-itr"
        indicatorType="cota-parte-itr"
        processDataFunction={processCotaParteItrData}
        title="Composição do ITR na Receita Total de Impostos [%]"
        data={data.cotaParteItr}
      />

      <ChartComponent
        key="ipva"
        indicatorType="ipva"
        processDataFunction={processIpvaData}
        title="Composição do IPVA na Receita Total de Impostos [%]"
        data={data.ipva}
      />

      <ChartComponent
        key="iof-ouro"
        indicatorType="iof-ouro"
        processDataFunction={processIofOuroData}
        title="Composição do IOF Ouro na Receita Total de Impostos [%]"
        data={data.iofOuro}
      />

      <ChartComponent
        key="outras-transferencias"
        indicatorType="outras-transferencias"
        processDataFunction={processOutrasTransferenciasData}
        title="Composição de Outras Transferências na Receita Total de Impostos [%]"
        data={data.outrasTransferencias}
      />
    </div>
  );
};

export default RevenueCompositionCharts;