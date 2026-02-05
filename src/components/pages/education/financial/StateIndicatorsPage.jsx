import React from 'react';
import StateIndicatorsContainer from './state/indicators/StateIndicatorsContainer';
import FinancialDataPage from '../../FinancialDataPage';

const StateIndicatorsPage = () => {
  return (
    <FinancialDataPage currentCategory="indicadores-estaduais">
      <StateIndicatorsContainer />
    </FinancialDataPage>
  );
};

export default StateIndicatorsPage;
