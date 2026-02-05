import React from 'react';
import StateRevenueTableContainer from './state/StateRevenueTableContainer';
import FinancialDataPage from '../../FinancialDataPage';

const StateFinancialPage = () => {
  return (
    <FinancialDataPage currentCategory="estado">
      <StateRevenueTableContainer />
    </FinancialDataPage>
  );
};

export default StateFinancialPage;
