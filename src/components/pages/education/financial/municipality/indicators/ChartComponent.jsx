import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import * as XLSX from "xlsx";
import { FaFileExcel, FaDownload } from "react-icons/fa";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import ptBR from "date-fns/locale/pt-BR";
import {
  fetchIPCAData,
  calculateMonetaryCorrection,
  getCurrentDate,
  getMaxIPCADate,
} from "../../../../../../utils/bacenApi";

const ChartComponent = ({
  indicatorType,
  processDataFunction,
  title,
  data,
  enableMonetaryCorrection = false,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [municipalityColors, setMunicipalityColors] = useState({});
  const [useMonetaryCorrection, setUseMonetaryCorrection] = useState(false);
  const [ipcaData, setIpcaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(null);

  const colorPalette = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FFCD56",
    "#4D5360",
    "#00A878",
    "#FF6B6B",
    "#B9E769",
    "#FFA1B5",
    "#9C27B0",
    "#607D8B",
    "#8BC34A",
    "#795548",
    "#FFC107",
    "#3F51B5",
    "#673AB7",
    "#009688",
    "#CDDC39",
    "#FFC0CB",
    "#2196F3",
    "#F44336",
  ];

  // Buscar data máxima disponível do IPCA
  useEffect(() => {
    const fetchMaxDate = async () => {
      try {
        const maxIPCADate = await getMaxIPCADate();
        setMaxDate(maxIPCADate);
        // Se a correção monetária estiver ativada, definir a data como a máxima disponível
        if (useMonetaryCorrection) {
          setTargetDate(maxIPCADate);
        }
      } catch (error) {
        console.error("Erro ao buscar data máxima do IPCA:", error);
        setMaxDate(new Date());
      }
    };

    if (enableMonetaryCorrection) {
      fetchMaxDate();
    }
  }, [enableMonetaryCorrection, useMonetaryCorrection]);

  // Quando ativar a correção monetária, definir a data como a máxima disponível
  useEffect(() => {
    if (useMonetaryCorrection && maxDate) {
      setTargetDate(maxDate);
    }
  }, [useMonetaryCorrection, maxDate]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const processedData = processDataFunction(data, colorPalette);

        if (useMonetaryCorrection) {
          // Get the date range from the data
          const years = processedData.chartData.labels
            .map((label) => {
              const match = label.match(/(\d{4})/);
              return match ? match[1] : null;
            })
            .filter(Boolean);

          const startDate = `31/12/${Math.min(...years)}`;
          const formattedTargetDate = targetDate.toLocaleDateString("pt-BR");

          // Fetch IPCA data
          const ipcaData = await fetchIPCAData(startDate, formattedTargetDate);
          setIpcaData(ipcaData);

          // Apply monetary correction to the data
          const correctedData = {
            ...processedData,
            chartData: {
              ...processedData.chartData,
              datasets: processedData.chartData.datasets.map((dataset) => ({
                ...dataset,
                data: dataset.data.map((value, index) => {
                  const label = processedData.chartData.labels[index];
                  const year = label.match(/(\d{4})/)[1];
                  const originalDate = `01/01/${year}`;
                  return calculateMonetaryCorrection(
                    value,
                    originalDate,
                    formattedTargetDate,
                    ipcaData
                  );
                }),
              })),
            },
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
  }, [indicatorType, processDataFunction, useMonetaryCorrection, targetDate]);

  const handleMonetaryCorrectionToggle = (event) => {
    setUseMonetaryCorrection(event.target.checked);
  };

  const handleDateChange = (newDate) => {
    setTargetDate(newDate);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '10px',
      margin: '20px',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        width: '100%',
      }}>
        <Typography variant="h6" component="h3">{title}</Typography>
        {enableMonetaryCorrection && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useMonetaryCorrection}
                  onChange={handleMonetaryCorrectionToggle}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label="Correção Monetária"
              sx={{ marginRight: 0 }}
            />
            {useMonetaryCorrection && (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ptBR}
              >
                <DatePicker
                  label="Data de referência"
                  value={targetDate}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  maxDate={maxDate}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                          sx: {
                         '& .MuiOutlinedInput-root': {
                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                           },
                         },
                         '& .MuiInputLabel-root': {
                           '&.Mui-focused': {
                             color: theme.palette.primary.main,
                           },
                         },
                         '& .MuiInputBase-input': {
                           '&::selection': {
                             backgroundColor: theme.palette.primary.light,
                             color: 'white',
                           },
                           '&::-moz-selection': {
                             backgroundColor: theme.palette.primary.light,
                             color: 'white',
                           },
                         },
                         '& .MuiInputBase-input:focus': {
                           '&::selection': {
                             backgroundColor: theme.palette.primary.light,
                             color: 'white',
                           },
                         },
                       },
                    } 
                  }}
                />
              </LocalizationProvider>
            )}
          </Box>
        )}
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <BarChart chartData={chartData} title={title} />
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '100px',
            gap: '5px',
            fontSize: '13px',
            justifyContent: 'center',
          }}>
            {Object.values(municipalityColors).map((municipio, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '5px',
              }}>
                <Box sx={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: municipio.color,
                  marginRight: '5px',
                  borderRadius: '2px',
                }} />
                <Typography variant="body2">{municipio.name}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChartComponent;
