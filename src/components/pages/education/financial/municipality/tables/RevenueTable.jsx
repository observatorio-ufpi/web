import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ThemeProvider, createTheme, styled, useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { municipios, Regioes, FaixaPopulacional } from "../../../../../../utils/municipios.mapping";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Typography, CircularProgress } from "@mui/material";
import ptBR from "date-fns/locale/pt-BR";
import {
  fetchIPCAData,
  calculateMonetaryCorrection,
  getCurrentDate,
  getMaxIPCADate,
} from "../../../../../../utils/bacenApi";

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
      tableHeader: '#cccccc',
    },
  },
  typography: {
    fontSize: 14,
  },
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.tableHeader,
}));

const BoldTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  minWidth: "8rem", // Define a largura mínima de cada célula usando rem
  textAlign: "center", // Centraliza o texto horizontalmente
  verticalAlign: "middle", // Centraliza o texto verticalmente
  "@media (max-width: 600px)": {
    minWidth: "6rem", // Ajusta a largura mínima para telas menores
  },
}));

const CenteredTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "right", // Alinha o texto à direita
  verticalAlign: "middle", // Centraliza o texto verticalmente
}));

const RevenueTable = ({
  data,
  transformDataFunction,
  standardizeTypeFunction,
  tableMapping,
  tableName,
  keyTable,
  groupType,
  enableMonetaryCorrection = false,
  anoInicial = null,
  anoFinal = null,
  nomeMunicipio = null,
  filtrosAplicados = null,
}) => {
  const globalTheme = useTheme();
  const [useMonetaryCorrection, setUseMonetaryCorrection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date());
  const [correctedData, setCorrectedData] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  // Usar useMemo para estabilizar os dados processados
  const { rows, typeToRowToValue, types } = useMemo(() => {
    const { rows: processedRows, typeToRowToValue: processedTypeToRowToValue } = transformDataFunction(
      data,
      standardizeTypeFunction
    );
    const processedTypes = Object.keys(tableMapping);
    
    return {
      rows: processedRows,
      typeToRowToValue: processedTypeToRowToValue,
      types: processedTypes
    };
  }, [data, transformDataFunction, standardizeTypeFunction, tableMapping]);

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

  // Aplicar correção monetária quando necessário
  useEffect(() => {
    const applyCorrection = async () => {
      if (!useMonetaryCorrection || !enableMonetaryCorrection || !typeToRowToValue) {
        setCorrectedData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obter anos dos dados
        const years = [];
        if (groupType === "ano") {
          years.push(...rows);
        } else {
          const firstType = types[0];
          if (firstType && typeToRowToValue[firstType]) {
            years.push(...Object.keys(typeToRowToValue[firstType]));
          }
        }

        const uniqueYears = [...new Set(years)].filter(Boolean).sort();
        if (uniqueYears.length === 0) {
          setLoading(false);
          return;
        }

        const startDate = `31/12/${Math.min(...uniqueYears)}`;
        const formattedTargetDate = targetDate.toLocaleDateString("pt-BR");

        // Buscar dados do IPCA
        const ipcaData = await fetchIPCAData(startDate, formattedTargetDate);

        // Aplicar correção monetária aos dados ORIGINAIS
        const corrected = {};
        
        Object.keys(typeToRowToValue).forEach(type => {
          corrected[type] = {};
          Object.keys(typeToRowToValue[type]).forEach(key => {
            const originalValue = typeToRowToValue[type][key];
            if (typeof originalValue === 'number' && originalValue > 0) {
              const year = groupType === "ano" ? key : key;
              const originalDate = `31/12/${year}`;
              corrected[type][key] = calculateMonetaryCorrection(
                originalValue,
                originalDate,
                formattedTargetDate,
                ipcaData
              );
            } else {
              corrected[type][key] = originalValue;
            }
          });
        });

        setCorrectedData(corrected);
      } catch (error) {
        console.error("Erro ao aplicar correção monetária:", error);
      } finally {
        setLoading(false);
      }
    };

    applyCorrection();
  }, [useMonetaryCorrection, enableMonetaryCorrection, targetDate, groupType]);

  // Usar dados corrigidos se disponíveis, senão usar dados originais
  const finalDisplayData = correctedData || typeToRowToValue;

  // Função para determinar se um tipo deve ser formatado como porcentagem
  const isPercentageType = (type) => {
    return type === "% aplicado em MDE" || type === "% aplicado com profissionais da Educação Básica";
  };

  // Função para formatar valores baseado no tipo
  const formatValue = (value, type) => {
    if (value === undefined || value === null) return "-";
    
    if (isPercentageType(type)) {
      return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
    } else {
      return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const downloadExcel = () => {
    // Gerar período e metadados
    const periodoLabel = anoInicial && anoFinal 
      ? (anoInicial === anoFinal ? `${anoInicial}` : `${anoInicial}-${anoFinal}`)
      : '';
    const municipioLabel = nomeMunicipio ? nomeMunicipio.replace(/\s+/g, '_') : '';
    const tituloCompleto = nomeMunicipio 
      ? `${tableName} - ${nomeMunicipio}${periodoLabel ? ` (${periodoLabel})` : ''}`
      : `${tableName}${periodoLabel ? ` (${periodoLabel})` : ''}`;
    const fonte = "Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI";
    
    // Construir nome do arquivo com filtros aplicados
    const nomeArquivoParts = [tableName.replace(/\s+/g, '_')];
    if (periodoLabel) nomeArquivoParts.push(periodoLabel);
    if (municipioLabel) nomeArquivoParts.push(municipioLabel);
    
    // Adicionar filtros extras se disponíveis
    if (filtrosAplicados) {
      if (filtrosAplicados.territorioDeDesenvolvimentoMunicipio) {
        const territorioLabel = Regioes[filtrosAplicados.territorioDeDesenvolvimentoMunicipio] || filtrosAplicados.territorioDeDesenvolvimentoMunicipio;
        nomeArquivoParts.push(`TD_${territorioLabel.replace(/\s+/g, '_')}`);
      }
      if (filtrosAplicados.faixaPopulacionalMunicipio) {
        const faixaLabel = FaixaPopulacional[filtrosAplicados.faixaPopulacionalMunicipio] || filtrosAplicados.faixaPopulacionalMunicipio;
        nomeArquivoParts.push(`FP_${faixaLabel.replace(/\s+/g, '_').replace(/[^\w]/g, '')}`);
      }
      if (filtrosAplicados.aglomeradoMunicipio) {
        nomeArquivoParts.push(`Agl_${filtrosAplicados.aglomeradoMunicipio}`);
      }
      if (filtrosAplicados.gerenciaRegionalMunicipio) {
        nomeArquivoParts.push(`GRE_${filtrosAplicados.gerenciaRegionalMunicipio}`);
      }
    }
    
    nomeArquivoParts.push(keyTable);
    const nomeArquivoBase = nomeArquivoParts.join('_').replace(/[<>:"/\\|?*]/g, '');

    if (groupType === "municipio") {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [tituloCompleto], // Linha do título
        [], // Linha vazia
        ["Ano", ...types],
        ...rows.map((row) => {
          return [
            row,
            ...types.map((type) => {
              if (
                finalDisplayData[type] &&
                finalDisplayData[type][row] !== undefined
              ) {
                // Para Excel, manter valores numéricos para formatação adequada
                return finalDisplayData[type][row];
              } else {
                return "-";
              }
            }),
          ];
        }),
        [], // Linha vazia
        [fonte], // Linha da fonte
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Mesclar célula do título
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: types.length } }
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, "Receitas");
      XLSX.writeFile(wb, `${nomeArquivoBase}.xlsx`);
    }

    if (groupType === "ano" || groupType === "desagregado") {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [tituloCompleto], // Linha do título
        [], // Linha vazia
        ["Município (IBGE)", ...types],
        ...rows.map((row) => {
          return [
            `${municipios[row]?.nomeMunicipio || row} (${row})`,
            ...types.map((type) => {
              if (
                finalDisplayData[type] &&
                finalDisplayData[type][row] !== undefined
              ) {
                // Para Excel, manter valores numéricos para formatação adequada
                return finalDisplayData[type][row];
              } else {
                return "-";
              }
            }),
          ];
        }),
        [], // Linha vazia
        [fonte], // Linha da fonte
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Mesclar célula do título
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: types.length } }
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, "Receitas");
      XLSX.writeFile(wb, `${nomeArquivoBase}.xlsx`);
    }
  };

  const downloadPDF = () => {
    // Gerar período e metadados
    const periodoLabel = anoInicial && anoFinal 
      ? (anoInicial === anoFinal ? `${anoInicial}` : `${anoInicial}-${anoFinal}`)
      : '';
    const municipioLabel = nomeMunicipio ? nomeMunicipio.replace(/\s+/g, '_') : '';
    const tituloCompleto = nomeMunicipio 
      ? `${tableName} - ${nomeMunicipio}${periodoLabel ? ` (${periodoLabel})` : ''}`
      : `${tableName}${periodoLabel ? ` (${periodoLabel})` : ''}`;
    const fonte = "Fonte: SIOPE/FNDE - Elaboração: OPEPI/UFPI";

    // Construir nome do arquivo com filtros aplicados
    const nomeArquivoParts = [tableName.replace(/\s+/g, '_')];
    if (periodoLabel) nomeArquivoParts.push(periodoLabel);
    if (municipioLabel) nomeArquivoParts.push(municipioLabel);
    
    // Adicionar filtros extras se disponíveis
    if (filtrosAplicados) {
      if (filtrosAplicados.territorioDeDesenvolvimentoMunicipio) {
        const territorioLabel = Regioes[filtrosAplicados.territorioDeDesenvolvimentoMunicipio] || filtrosAplicados.territorioDeDesenvolvimentoMunicipio;
        nomeArquivoParts.push(`TD_${territorioLabel.replace(/\s+/g, '_')}`);
      }
      if (filtrosAplicados.faixaPopulacionalMunicipio) {
        const faixaLabel = FaixaPopulacional[filtrosAplicados.faixaPopulacionalMunicipio] || filtrosAplicados.faixaPopulacionalMunicipio;
        nomeArquivoParts.push(`FP_${faixaLabel.replace(/\s+/g, '_').replace(/[^\w]/g, '')}`);
      }
      if (filtrosAplicados.aglomeradoMunicipio) {
        nomeArquivoParts.push(`Agl_${filtrosAplicados.aglomeradoMunicipio}`);
      }
      if (filtrosAplicados.gerenciaRegionalMunicipio) {
        nomeArquivoParts.push(`GRE_${filtrosAplicados.gerenciaRegionalMunicipio}`);
      }
    }
    
    nomeArquivoParts.push(keyTable);
    const nomeArquivoBase = nomeArquivoParts.join('_').replace(/[<>:"/\\|?*]/g, '');

    const doc = new jsPDF();
    const headers = [
      groupType === "ano" || groupType === "desagregado" ? "Município (IBGE)" : "Ano",
      ...types,
    ];

    const dataForTable = rows.map((row) => {
      return [
        groupType === "ano" || groupType === "desagregado"
          ? `${municipios[row]?.nomeMunicipio || row} (${row})`
          : `${row}`,
        ...types.map((type) => {
          if (
            finalDisplayData[type] &&
            finalDisplayData[type][row] !== undefined
          ) {
            return formatValue(finalDisplayData[type][row], type);
          } else {
            return "-";
          }
        }),
      ];
    });

    // Adicionar título
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(tituloCompleto, 14, 15);

    doc.autoTable({
      head: [headers],
      body: dataForTable,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      theme: "grid",
      didDrawPage: function (data) {
        // Ajusta automaticamente a largura das colunas baseado no conteúdo
        const columnWidth = doc.internal.pageSize.width / (headers.length + 1);
        data.table.columns.forEach((column) => {
          column.minWidth = columnWidth;
        });
      },
    });

    // Adicionar fonte no rodapé
    const finalY = doc.lastAutoTable.finalY || 25;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(fonte, 14, finalY + 10);

    // Salvar PDF
    doc.save(`${nomeArquivoBase}.pdf`);
  };

  const handleMonetaryCorrectionToggle = (event) => {
    setUseMonetaryCorrection(event.target.checked);
  };

  const handleDateChange = (newDate) => {
    setTargetDate(newDate);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Controles de correção monetária */}
        {enableMonetaryCorrection && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '4px',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useMonetaryCorrection}
                    onChange={handleMonetaryCorrectionToggle}
                      sx={{
                       '& .MuiSwitch-switchBase.Mui-checked': {
                         color: globalTheme.palette.primary.main,
                       },
                       '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                         backgroundColor: globalTheme.palette.primary.main,
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
                               borderColor: globalTheme.palette.primary.main,
                             },
                           },
                           '& .MuiInputLabel-root': {
                             '&.Mui-focused': {
                               color: globalTheme.palette.primary.main,
                             },
                           },
                           '& .MuiInputBase-input': {
                             '&::selection': {
                               backgroundColor: globalTheme.palette.primary.light,
                               color: 'white',
                             },
                             '&::-moz-selection': {
                               backgroundColor: globalTheme.palette.primary.light,
                               color: 'white',
                             },
                           },
                           '& .MuiInputBase-input:focus': {
                             '&::selection': {
                               backgroundColor: globalTheme.palette.primary.light,
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
          </Box>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100px' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Aplicando correção monetária...</Typography>
          </Box>
        )}
        
        {/* Adiciona margem nas laterais */}
        <Paper sx={{ backgroundColor: theme.palette.background.default }}>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: "100%", overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <StyledTableHead>
                <TableRow>
                  <BoldTableCell>
                    {groupType === "ano" || groupType === "desagregado" ? "Município (IBGE)" : "Ano"}
                  </BoldTableCell>
                  {types.map((type) => (
                    <BoldTableCell key={type} align="center">
                      {type}
                    </BoldTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <BoldTableCell component="th" scope="row">
                      {groupType === "ano" || groupType === "desagregado"
                        ? `${municipios[row]?.nomeMunicipio || row} (${row})`
                        : `${row}`}
                    </BoldTableCell>
                    {types.map((type) => (
                      <CenteredTableCell key={type} align="right">
                        {finalDisplayData[type] &&
                        finalDisplayData[type][row] !== undefined
                          ? formatValue(finalDisplayData[type][row], type)
                          : "-"}
                      </CenteredTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={downloadExcel}
            startIcon={<FaFileExcel />}
            sx={{
              minWidth: '120px',
              '@media (max-width: 600px)': {
                minWidth: '40px',
                padding: '6px !important',
                '& .MuiButton-startIcon': {
                  margin: 0,
                },
                '& .button-text': {
                  display: 'none',
                },
                '& svg': {
                  fontSize: '20px',
                },
              },
            }}
          >
            <span className="button-text">Excel</span>
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={downloadPDF}
            startIcon={<FaFilePdf />}
            sx={{
              minWidth: '120px',
              '@media (max-width: 600px)': {
                minWidth: '40px',
                padding: '6px !important',
                '& .MuiButton-startIcon': {
                  margin: 0,
                },
                '& .button-text': {
                  display: 'none',
                },
                '& svg': {
                  fontSize: '20px',
                },
              },
            }}
          >
            <span className="button-text">PDF</span>
          </Button>
        </div>
        
        {/* Fonte dos dados */}
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            textAlign: 'right',
            color: '#666',
            fontSize: '12px',
            fontStyle: 'italic',
            marginTop: '8px'
          }}
        >
          Fonte: RREO/SIOPE - FNDE
        </Typography>
      </div>
    </ThemeProvider>
  );
};

export default RevenueTable;
