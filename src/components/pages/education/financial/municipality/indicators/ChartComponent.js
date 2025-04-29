import React, { useEffect, useState } from 'react';
import '../../../../../../style/Chart.css';
import BarChart from './BarChart';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaDownload } from 'react-icons/fa';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { fetchIPCAData, calculateMonetaryCorrection, getCurrentDate } from '../../../../../../utils/bacenApi';

const ChartComponent = ({ indicatorType, processDataFunction, title, data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [municipalityColors, setMunicipalityColors] = useState({});
  const [useMonetaryCorrection, setUseMonetaryCorrection] = useState(false);
  const [ipcaData, setIpcaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FFCD56', '#4D5360', '#00A878', '#FF6B6B', '#B9E769', '#FFA1B5',
    '#9C27B0', '#607D8B', '#8BC34A', '#795548', '#FFC107', '#3F51B5',
    '#673AB7', '#009688', '#CDDC39', '#FFC0CB', '#2196F3', '#F44336'
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const processedData = processDataFunction(data, colorPalette);
        
        if (useMonetaryCorrection) {
          // Get the date range from the data
          const years = processedData.chartData.labels.map(label => {
            const match = label.match(/(\d{4})/);
            return match ? match[1] : null;
          }).filter(Boolean);
          
          const startDate = `01/01/${Math.min(...years)}`;
          const endDate = getCurrentDate();
          
          // Fetch IPCA data
          const ipcaData = await fetchIPCAData(startDate, endDate);
          setIpcaData(ipcaData);
          
          // Apply monetary correction to the data
          const correctedData = {
            ...processedData,
            chartData: {
              ...processedData.chartData,
              datasets: processedData.chartData.datasets.map(dataset => ({
                ...dataset,
                data: dataset.data.map((value, index) => {
                  const label = processedData.chartData.labels[index];
                  const year = label.match(/(\d{4})/)[1];
                  const originalDate = `01/01/${year}`;
                  return calculateMonetaryCorrection(value, originalDate, endDate, ipcaData);
                })
              }))
            }
          };
          
          setChartData(correctedData.chartData);
        } else {
          setChartData(processedData.chartData);
        }
        
        setMunicipalityColors(processedData.municipalityColors);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [indicatorType, processDataFunction, useMonetaryCorrection]);

  const handleMonetaryCorrectionToggle = (event) => {
    setUseMonetaryCorrection(event.target.checked);
  };

  return (
    <div className="indicators-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>{title}</h3>
        <FormControlLabel
          control={
            <Switch
              checked={useMonetaryCorrection}
              onChange={handleMonetaryCorrectionToggle}
              color="primary"
            />
          }
          label="Correção Monetária"
        />
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <BarChart chartData={chartData} title={title} />
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '100px', gap: '5px', fontSize: '13px' }}>
            {Object.values(municipalityColors).map((municipio, index) => (
              <div key={index} className="indicator-item">
                <span style={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: municipio.color,
                  display: 'inline-block',
                  marginRight: '5px'
                }}></span>
                <span>{municipio.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChartComponent;
