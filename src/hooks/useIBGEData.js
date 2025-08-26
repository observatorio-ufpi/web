import { useState, useEffect } from 'react';
import { ibgeService } from '../services/ibgeService';

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
          education,
          higherEducation,
          postGraduation
        ] = await Promise.allSettled([
          ibgeService.getPiauiDemographics(),
          ibgeService.getPiauiAreaAndPopulation(),
          ibgeService.getPiauiMunicipalities(),
          ibgeService.getPiauiPIB(),
          ibgeService.getPiauiIlliteracyRate(),
          ibgeService.getPiauiEducation(),
          ibgeService.getPiauiHigherEducation(),
          ibgeService.getPiauiPostGraduation()
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
            ? (() => {
                // Tentar encontrar a taxa de analfabetismo na tabela 5918
                const data = illiteracyRate.value;
                if (!data || !Array.isArray(data)) return null;
                
                // Procurar por variáveis relacionadas ao analfabetismo
                for (let i = 1; i < data.length; i++) {
                  const item = data[i];
                  if (item.D2N && item.D2N.includes('analfabet') && item.V !== '..') {
                    return parseFloat(item.V);
                  }
                }
                
                // Se não encontrar, retornar null
                return null;
              })()
            : null,
          education: {
            enrollments: education.status === 'fulfilled' && education.value
              ? education.value?.data?.enrollments || null
              : null,
            schools: education.status === 'fulfilled' && education.value
              ? education.value?.data?.schools || null
              : null
          },
          higherEducation: {
            enrollments: higherEducation.status === 'fulfilled' && higherEducation.value
              ? higherEducation.value?.data?.enrollments || null
              : null,
            institutions: higherEducation.status === 'fulfilled' && higherEducation.value
              ? higherEducation.value?.data?.institutions || null
              : null,
            enrollmentRate: higherEducation.status === 'fulfilled' && higherEducation.value
              ? higherEducation.value?.data?.enrollmentRate || null
              : null
          },
          postGraduation: {
            masters: postGraduation.status === 'fulfilled' && postGraduation.value
              ? postGraduation.value?.data?.masters || null
              : null,
            doctors: postGraduation.status === 'fulfilled' && postGraduation.value
              ? postGraduation.value?.data?.doctors || null
              : null
          }
        };

        setData(processedData);
      } catch (err) {
        console.error('Erro ao buscar dados do IBGE:', err);
        setError('Erro ao carregar dados. Usando dados padrão.');
        
        // Dados de fallback em caso de erro total
        setData({
          population: 3375646,
          municipalities: 224,
          area: 251529,
          education: {
            enrollments: 198306,
            schools: 634
          },
          higherEducation: {
            enrollments: 135807,
            institutions: 47,
            enrollmentRate: 18.5
          },
          postGraduation: {
            masters: 2847,
            doctors: 156
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        demographics,
        areaAndPopulation,
        municipalities,
        pib,
        illiteracyRate,
        education,
        higherEducation,
        postGraduation
      ] = await Promise.allSettled([
        ibgeService.getPiauiDemographics(),
        ibgeService.getPiauiAreaAndPopulation(),
        ibgeService.getPiauiMunicipalities(),
        ibgeService.getPiauiPIB(),
        ibgeService.getPiauiIlliteracyRate(),
        ibgeService.getPiauiEducation(),
        ibgeService.getPiauiHigherEducation(),
        ibgeService.getPiauiPostGraduation()
      ]);

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
          ? (() => {
                // Tentar encontrar a taxa de analfabetismo na tabela 5918
                const data = illiteracyRate.value;
                if (!data || !Array.isArray(data)) return null;
                
                // Procurar por variáveis relacionadas ao analfabetismo
                for (let i = 1; i < data.length; i++) {
                  const item = data[i];
                  if (item.D2N && item.D2N.includes('analfabet') && item.V !== '..') {
                    return parseFloat(item.V);
                  }
                }
                
                // Se não encontrar, retornar null
                return null;
              })()
            : null,
        education: {
          enrollments: education.status === 'fulfilled' && education.value
            ? education.value?.data?.enrollments || null
            : null,
          schools: education.status === 'fulfilled' && education.value
            ? education.value?.data?.schools || null
            : null
        },
        higherEducation: {
          enrollments: higherEducation.status === 'fulfilled' && higherEducation.value
            ? higherEducation.value?.data?.enrollments || null
            : null,
          institutions: higherEducation.status === 'fulfilled' && higherEducation.value
            ? higherEducation.value?.data?.institutions || null
            : null,
          enrollmentRate: higherEducation.status === 'fulfilled' && higherEducation.value
            ? higherEducation.value?.data?.enrollmentRate || null
            : null
        },
        postGraduation: {
          masters: postGraduation.status === 'fulfilled' && postGraduation.value
            ? postGraduation.value?.data?.masters || null
            : null,
          doctors: postGraduation.status === 'fulfilled' && postGraduation.value
            ? postGraduation.value?.data?.doctors || null
            : null
        }
      };

      setData(processedData);
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setError('Erro ao atualizar dados.');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};
