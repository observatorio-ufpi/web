import React from 'react';
import ParentComponent from './ParentComponent';
import EducationDataPage from '../../EducationDataPage';

const BasicEducationPage = () => {
  return (
    <EducationDataPage currentCategory="basica">
      <ParentComponent />
    </EducationDataPage>
  );
};

export default BasicEducationPage;
