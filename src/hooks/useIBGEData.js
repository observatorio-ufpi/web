import { useState, useEffect } from 'react';
import { ibgeService } from '../services/ibgeService';
import { rateService } from '../services/rateService';

export const useIBGEData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados em paralelo para melhor performance
        const [
          demographics,
          areaAndPopulation,
          municipalities,
          pib,
          illiteracyRate,
          schoolingRate,
          higherEducationCompletionRate,
          basicEducationEnrollment,
          basicEducationSchools,
          higherEducationEnrollment,
          higherEducationInstitutions
        ] = await Promise.allSettled([
          ibgeService.getPiauiDemographics(),
          ibgeService.getPiauiAreaAndPopulation(),
          ibgeService.getPiauiMunicipalities(),
          ibgeService.getPiauiPIB(),
          rateService.getPiauiIlliteracyRate(2023),
          rateService.getPiauiSchoolingRate(2023),
          rateService.getPiauiHigherEducationCompletionRate(2023),
          // Buscar dados de educação básica do backend
          fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/enrollment?filter=min_year:"2023",max_year:"2023",state:"22"`).then(r => r.json()),
          fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/school/count?filter=min_year:"2023",max_year:"2023",state:"22"`).then(r => r.json()),
          // Buscar dados de educação superior do backend
          fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/university_enrollment?filter=min_year:"2023",max_year:"2023",state:"22"`).then(r => r.json()),
          fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/university/count?filter=min_year:"2023",max_year:"2023",state:"22"`).then(r => r.json())
        ]);

        // Processar resultados (alguns podem falhar, outros não)
        const processedData = {
          population: areaAndPopulation.status === 'fulfilled' 
            ? parseInt(areaAndPopulation.value?.[1]?.V)
            : null,
          municipalities: municipalities.status === 'fulfilled' 
            ? municipalities.value?.length || 224 
            : 224,
          area: areaAndPopulation.status === 'fulfilled' 
            ? parseFloat(areaAndPopulation.value?.[2]?.V)
            : null,
          pib: pib.status === 'fulfilled' 
            ? parseInt(pib.value?.[1]?.V)
            : null,
          illiteracyRate: illiteracyRate.status === 'fulfilled' 
            ? illiteracyRate.value
            : null,
          schoolingRate: schoolingRate.status === 'fulfilled' 
            ? schoolingRate.value
            : null,
          higherEducationCompletionRate: higherEducationCompletionRate.status === 'fulfilled' 
            ? higherEducationCompletionRate.value
            : null,
          education: {
            enrollments: basicEducationEnrollment.status === 'fulfilled' 
              ? basicEducationEnrollment.value?.result?.[0]?.total || null
              : null,
            schools: basicEducationSchools.status === 'fulfilled' 
              ? basicEducationSchools.value?.result?.[0]?.total || null
              : null
          },
          higherEducation: {
            enrollments: higherEducationEnrollment.status === 'fulfilled' 
              ? higherEducationEnrollment.value?.result?.[0]?.total || (higherEducationEnrollment.value?.result?.[0]?.total == 0 ? 0 : null)
              : null,
            institutions: higherEducationInstitutions.status === 'fulfilled' 
              ? higherEducationInstitutions.value?.result?.[0]?.total || (higherEducationInstitutions.value?.result?.[0]?.total == 0 ? 0 : null)
              : null
          }
        };

        console.log('Dados brutos de educação básica:', {
          basicEducationEnrollment: basicEducationEnrollment.status === 'fulfilled' ? basicEducationEnrollment.value : 'rejected',
          basicEducationSchools: basicEducationSchools.status === 'fulfilled' ? basicEducationSchools.value : 'rejected'
        });
        console.log('Dados brutos de educação superior:', {
          higherEducationEnrollment: higherEducationEnrollment.status === 'fulfilled' ? higherEducationEnrollment.value : 'rejected',
          higherEducationInstitutions: higherEducationInstitutions.status === 'fulfilled' ? higherEducationInstitutions.value : 'rejected'
        });

        // Log de debug para verificar os dados de taxas


        setData(processedData);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para atualizar dados de taxas (para municípios)
  const updateRateData = async (municipalityCode, year = 2023) => {
    if (municipalityCode === '22') {
      // Para o estado, usar dados já carregados
      return;
    }

    try {
      const [illiteracyRate, schoolingRate, higherEducationCompletionRate] = await Promise.allSettled([
        rateService.getMunicipalityIlliteracyRate(municipalityCode, year),
        rateService.getMunicipalitySchoolingRate(municipalityCode, year),
        rateService.getMunicipalityHigherEducationCompletionRate(municipalityCode, year)
      ]);

      // Buscar dados de educação para o município
      const [basicEducationEnrollment, basicEducationSchools, higherEducationEnrollment, higherEducationInstitutions] = await Promise.allSettled([
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/enrollment?filter=min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/school/count?filter=min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/university_enrollment?filter=min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/university/count?filter=min_year:"${year}",max_year:"${year}",city:"${municipalityCode}"`).then(r => r.json())
      ]);

      console.log('Dados brutos de educação básica:', {
        basicEducationEnrollment: basicEducationEnrollment.status === 'fulfilled' ? basicEducationEnrollment.value : 'rejected',
        basicEducationSchools: basicEducationSchools.status === 'fulfilled' ? basicEducationSchools.value : 'rejected'
      });
      console.log('Dados brutos de educação superior:', {
        higherEducationEnrollment: higherEducationEnrollment.status === 'fulfilled' ? higherEducationEnrollment.value : 'rejected',
        higherEducationInstitutions: higherEducationInstitutions.status === 'fulfilled' ? higherEducationInstitutions.value : 'rejected'
      });

      const updatedData = {
        ...data,
        illiteracyRate: illiteracyRate.status === 'fulfilled' ? illiteracyRate.value : null,
        schoolingRate: schoolingRate.status === 'fulfilled' ? schoolingRate.value : null,
        higherEducationCompletionRate: higherEducationCompletionRate.status === 'fulfilled' ? higherEducationCompletionRate.value : null,
        education: {
          enrollments: basicEducationEnrollment.status === 'fulfilled' 
            ? basicEducationEnrollment.value?.result?.[0]?.total || null
            : null,
          schools: basicEducationSchools.status === 'fulfilled' 
            ? basicEducationSchools.value?.result?.[0]?.total || null
            : null
        },
        higherEducation: {
          enrollments: higherEducationEnrollment.status === 'fulfilled' 
            ? higherEducationEnrollment.value?.result?.[0]?.total || null
            : null,
          institutions: higherEducationInstitutions.status === 'fulfilled' 
            ? higherEducationInstitutions.value?.result?.[0]?.total || null
            : null
        }
      };


      setData(updatedData);
    } catch (error) {
      console.error('Erro ao atualizar dados de taxas:', error);
    }
  };

  return { data, loading, error, updateRateData };
};
