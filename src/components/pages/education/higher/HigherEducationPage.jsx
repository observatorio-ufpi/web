import React from 'react';
import FilterComponent from './FilterComponent';
import EducationDataPage from '../../EducationDataPage';

const HigherEducationPage = () => {
  return (
    <EducationDataPage currentCategory="superior">
      <FilterComponent />
    </EducationDataPage>
  );
};

export default HigherEducationPage;
