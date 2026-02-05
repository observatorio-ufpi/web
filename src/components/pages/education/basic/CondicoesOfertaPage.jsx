import React from 'react';
import CensoEscolarComponent from './CensoEscolarComponent';
import EducationDataPage from '../../EducationDataPage';

const CondicoesOfertaPage = () => {
  return (
    <EducationDataPage currentCategory="condicoes">
      <CensoEscolarComponent />
    </EducationDataPage>
  );
};

export default CondicoesOfertaPage;
