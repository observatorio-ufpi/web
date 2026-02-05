import React from 'react';
import FiltrosRateComponent from './FiltrosRateComponent';
import EducationDataPage from '../../EducationDataPage';

const RateIndicatorsPage = () => {
  return (
    <EducationDataPage currentCategory="taxas">
      <FiltrosRateComponent />
    </EducationDataPage>
  );
};

export default RateIndicatorsPage;
