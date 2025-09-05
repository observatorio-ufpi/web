import React, { useState, useCallback } from 'react';
import { loadIndicatorData } from '../services/stateDataService';

export const useStateIndicatorsData = (indicatorType, autoLoad = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!indicatorType) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loadIndicatorData(indicatorType);
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar dados dos indicadores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [indicatorType]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Auto-load quando o tipo de indicador muda
  React.useEffect(() => {
    if (autoLoad && indicatorType) {
      fetchData();
    }
  }, [indicatorType, autoLoad, fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};
