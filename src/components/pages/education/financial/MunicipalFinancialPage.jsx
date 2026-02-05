import React from 'react';
import RevenueTableContainer from './municipality/tables/RevenueTableContainer';
import FinancialDataPage from '../../FinancialDataPage';

const MunicipalFinancialPage = () => {
  return (
    <FinancialDataPage currentCategory="municipios">
      <RevenueTableContainer />
    </FinancialDataPage>
  );
};

export default MunicipalFinancialPage;
