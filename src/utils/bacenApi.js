// Utility functions for BACEN API integration and monetary correction

/**
 * Fetches IPCA data from BACEN API for a given date range
 * @param {string} startDate - Start date in DD/MM/YYYY format
 * @param {string} endDate - End date in DD/MM/YYYY format
 * @returns {Promise<Array>} - Array of IPCA data points
 */
export const fetchIPCAData = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch IPCA data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching IPCA data:", error);
    throw error;
  }
};

/**
 * Calculates the monetary correction factor for a given value and date
 * @param {number} value - The nominal value to correct
 * @param {string} originalDate - Original date in DD/MM/YYYY format
 * @param {string} targetDate - Target date in DD/MM/YYYY format
 * @param {Array} ipcaData - Array of IPCA data points
 * @returns {number} - The corrected value
 */
export const calculateMonetaryCorrection = (
  value,
  originalDate,
  targetDate,
  ipcaData
) => {
  // Convert dates to Date objects
  const [originalDay, originalMonth, originalYear] = originalDate.split("/");
  const [targetDay, targetMonth, targetYear] = targetDate.split("/");

  const originalDateObj = new Date(
    originalYear,
    originalMonth - 1,
    originalDay
  );
  const targetDateObj = new Date(targetYear, targetMonth - 1, targetDay);

  // Find IPCA data points within the date range
  const relevantIPCAData = ipcaData.filter((point) => {
    const [day, month, year] = point.data.split("/");
    const pointDate = new Date(year, month - 1, day);
    return pointDate >= originalDateObj && pointDate <= targetDateObj;
  });

  // Calculate cumulative correction factor
  const correctionFactor = relevantIPCAData.reduce((factor, point) => {
    return factor * (1 + point.valor / 100);
  }, 1);

  // Return corrected value
  return value * correctionFactor;
};

/**
 * Gets the current date in DD/MM/YYYY format
 * @returns {string} - Current date string
 */
export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};
