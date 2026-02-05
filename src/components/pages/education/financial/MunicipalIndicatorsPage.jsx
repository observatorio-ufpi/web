import React from 'react';
import ChartContainer from './municipality/indicators/ChartContainer';
import FinancialDataPage from '../../FinancialDataPage';

const MunicipalIndicatorsPage = () => {
  return (
    <FinancialDataPage currentCategory="indicadores">
      <ChartContainer />
    </FinancialDataPage>
  );
};

export default MunicipalIndicatorsPage;
