import React, { useState, useEffect, useMemo } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled, useTheme } from '@mui/material/styles';
import { Box, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { fetchIPCAData, calculateMonetaryCorrection, getMaxIPCADate } from '../../../../../utils/bacenApi.jsx';
import '../../../../../style/Buttons.css';
import TechnicalSheetButton from '../../../../common/TechnicalSheetButton.jsx';
import { MonetaryCorrectionLabel, notaCorrecaoMonetaria, sufixoArquivoCorrecao } from '../../../../common/MonetaryCorrectionHelp';
import DataSourceNote from '../../../../common/DataSourceNote';
import SummaryCards from '../municipality/tables/SummaryCards';
import { cores } from '../../../../../theme/tokens';
import { FONTE_EXPORTACAO, EXCEL_CABECALHO_FUNDO, EXCEL_CABECALHO_TEXTO, PDF_CABECALHO_FUNDO, PDF_LINHA_ALTERNADA } from '../../../../../utils/exportStyle';
import { ConteudoFicha } from '../../../../common/fichasTecnicas';
import ColunaComExplicacao from '../../../../common/ColunaComExplicacao';

// Mesmo visual da tabela municipal (RevenueTable): cabeçalho areia compacto,
// números alinhados pelas casas decimais, coluna de total destacada
const isColunaTotal = (type) => /total/i.test(type);
const larguraColuna = (type) => `${Math.min(15, Math.max(8, type.length * 0.42))}rem`;

const StyledTableHead = styled(TableHead)({});

const BoldTableCell = styled(TableCell)({
  backgroundColor: cores.areia,
  color: cores.textoSobreAreia,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  lineHeight: 1.35,
  padding: '10px 16px',
  textAlign: 'right',
  verticalAlign: 'bottom',
  minWidth: '8rem',
  borderBottom: `1px solid ${cores.linha}`,
  '@media (max-width: 600px)': { minWidth: '6rem' },
});

const CenteredTableCell = styled(TableCell)({
  textAlign: 'right',
  verticalAlign: 'middle',
  fontSize: '14px',
  color: cores.tinta,
  fontVariantNumeric: 'tabular-nums',
  padding: '12px 16px',
  borderBottom: `1px solid ${cores.linha}`,
});

const StateRevenueTable = ({ csvData, tableName, startYear, endYear, enableMonetaryCorrection = false, resumo = null }) => {
  const globalTheme = useTheme();
  const [data, setData] = useState({
    types: [],
    years: [],
    valuesByTypeAndYear: {}
  });
  const [useMonetaryCorrection, setUseMonetaryCorrection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date());
  const [correctedData, setCorrectedData] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    if (csvData) {
      parseCSVData(csvData);
    }
  }, [csvData]); // Removido startYear e endYear das dependências

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
      if (!useMonetaryCorrection || !enableMonetaryCorrection || !data.valuesByTypeAndYear || Object.keys(data.valuesByTypeAndYear).length === 0) {
        setCorrectedData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obter anos dos dados
        const years = data.years.filter(Boolean).sort();
        if (years.length === 0) {
          setLoading(false);
          return;
        }

        const startDate = `31/12/${Math.min(...years)}`;
        const formattedTargetDate = targetDate.toLocaleDateString("pt-BR");

        // Buscar dados do IPCA
        const ipcaData = await fetchIPCAData(startDate, formattedTargetDate);

        // Aplicar correção monetária aos dados ORIGINAIS
        const corrected = {};
        
        Object.keys(data.valuesByTypeAndYear).forEach(type => {
          corrected[type] = {};
          // Colunas de percentual (ex.: "% aplicado em MDE") não são dinheiro:
          // corrigir pela inflação distorcia o valor quando o botão era ligado
          const ehPercentual = type.includes('%');
          Object.keys(data.valuesByTypeAndYear[type]).forEach(year => {
            const originalValue = data.valuesByTypeAndYear[type][year];
            if (!ehPercentual && typeof originalValue === 'number' && originalValue > 0) {
              const originalDate = `31/12/${year}`;
              corrected[type][year] = calculateMonetaryCorrection(
                originalValue,
                originalDate,
                formattedTargetDate,
                ipcaData
              );
            } else {
              corrected[type][year] = originalValue;
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
  }, [useMonetaryCorrection, enableMonetaryCorrection, targetDate, data.valuesByTypeAndYear, data.years]);

  const parseCSVData = (csvText) => {
    // Verificar se csvText é uma string
    if (typeof csvText !== 'string') {
      console.error('csvText não é uma string:', csvText);
      setData({ types: [], years: [], valuesByTypeAndYear: {} });
      return;
    }

    // Verificar se o conteúdo parece ser CSV (não JavaScript)
    if (csvText.includes('import ') || csvText.includes('window.') || csvText.includes('injectIntoGlobalHook')) {
      console.error('csvText parece conter código JavaScript em vez de dados CSV:', csvText);
      setData({ types: [], years: [], valuesByTypeAndYear: {} });
      return;
    }

    // Remover qualquer conteúdo HTML que possa estar no texto
    const cleanText = csvText.replace(/<[^>]*>/g, '');
    
    // Dividir por linhas, ignorando linhas vazias
    const lines = cleanText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error('Nenhuma linha encontrada no CSV');
      setData({ types: [], years: [], valuesByTypeAndYear: {} });
      return;
    }
    
    
    // Função para analisar uma linha CSV respeitando aspas
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      if (current) {
        result.push(current.trim());
      }
      
      return result;
    };
    
    // Analisar a primeira linha para obter os tipos de receita (cabeçalhos das colunas)
    const headerParts = parseCSVLine(lines[0]);
    
    // O primeiro item é "Ano", os demais são os tipos de receita
    const types = headerParts.slice(1); // Remover "Ano" e pegar os tipos
    
    
    // Processar linhas de dados para obter os anos e valores
    const years = [];
    const valuesByTypeAndYear = {};
    
    // Inicializar objeto para cada tipo
    types.forEach(type => {
      valuesByTypeAndYear[type] = {};
    });
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      // Verificar se a linha tem dados suficientes
      if (values.length <= 1) continue;
      
      // O primeiro valor é o ano
      const year = values[0].replace(/^"|"$/g, ''); // Remover aspas se existirem
      const yearNum = parseInt(year);
      
      // Filtrar por ano inicial e final
      if (yearNum >= startYear && yearNum <= endYear) {
        years.push(year);
        
        // Processar valores para cada tipo de receita
        for (let j = 0; j < types.length; j++) {
          const type = types[j];
          const value = values[j + 1];
          
          // Converter para número, preservando o valor completo
          if (value) {
            // Remover caracteres não numéricos, exceto ponto, vírgula e hífen
            const cleanValue = value.replace(/[^\d.,-]/g, '');
            
            // Substituir vírgula por ponto para conversão correta
            // Importante: no Brasil, usamos vírgula como separador decimal
            const normalizedValue = cleanValue.replace(/\./g, '').replace(/,/g, '.');
            
            const numValue = parseFloat(normalizedValue);
            valuesByTypeAndYear[type][year] = isNaN(numValue) ? value : numValue;
          } else {
            valuesByTypeAndYear[type][year] = null;
          }
        }
      }
    }
    
    
    setData({ types, years, valuesByTypeAndYear });
  };

  // Usar dados corrigidos se disponíveis, senão usar dados originais
  const finalDisplayData = useMemo(() => {
    return correctedData || data.valuesByTypeAndYear;
  }, [correctedData, data.valuesByTypeAndYear]);

  const correcaoAtiva = useMonetaryCorrection && !!correctedData;
  const notaValores = correcaoAtiva ? notaCorrecaoMonetaria(targetDate) : null;
  const nomeArquivoBase = `${tableName}_${startYear}-${endYear}${correcaoAtiva ? `_${sufixoArquivoCorrecao(targetDate)}` : ''}`;

  const handleMonetaryCorrectionToggle = (event) => {
    setUseMonetaryCorrection(event.target.checked);
  };

  const handleDateChange = (newDate) => {
    setTargetDate(newDate);
  };

  const downloadExcel = async () => {
    // Criar workbook com ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OPEPI/UFPI';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet('Dados do Estado');
    
    const tituloCompleto = `${tableName} - Estado do Piauí (${startYear}-${endYear})`;
    const fonte = FONTE_EXPORTACAO;
    const numCols = data.types.length + 1;
    
    // Adicionar título
    worksheet.addRow([tituloCompleto]);
    worksheet.mergeCells(1, 1, 1, numCols);
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Aviso de correção monetária (ou linha vazia)
    worksheet.addRow(notaValores ? [notaValores] : []);
    if (notaValores) worksheet.getCell('A2').font = { italic: true, color: { argb: 'FFB45309' } };

    // Cabeçalhos
    const headerRow = worksheet.addRow(['Ano', ...data.types]);
    headerRow.font = { bold: true, color: { argb: EXCEL_CABECALHO_TEXTO } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_CABECALHO_FUNDO } };
    headerRow.alignment = { horizontal: 'center' };
    
    // Dados
    data.years.forEach(year => {
      const dataRow = [year];
      data.types.forEach(type => {
        const value = finalDisplayData[type] && finalDisplayData[type][year] !== undefined 
          ? finalDisplayData[type][year] 
          : data.valuesByTypeAndYear[type][year];
        if (value === undefined || value === null) {
          dataRow.push("");
        } else {
          dataRow.push(typeof value === 'number' ? value : (parseFloat(String(value).replace(/[.\s]/g, '').replace(',', '.')) || value));
        }
      });
      worksheet.addRow(dataRow);
    });
    
    // Linha vazia
    worksheet.addRow([]);
    
    // Fonte
    worksheet.addRow([fonte]);
    
    // Configurar largura das colunas
    worksheet.getColumn(1).width = 12;
    for (let i = 2; i <= numCols; i++) {
      worksheet.getColumn(i).width = 20;
      // Aplicar formato numérico
      worksheet.getColumn(i).numFmt = '#,##0.00';
      worksheet.getColumn(i).alignment = { horizontal: 'right' };
    }
    
    // Salvar arquivo
    const fileName = `${nomeArquivoBase}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Ano",
      ...data.types,
    ];
    
    const tituloCompleto = `${tableName} - Estado do Piauí (${startYear}-${endYear})`;
    const fonte = FONTE_EXPORTACAO;

    const dataForTable = data.years.map((year) => {
      return [
        `${year}`,
        ...data.types.map((type) => {
          const value = finalDisplayData[type] && finalDisplayData[type][year] !== undefined 
            ? finalDisplayData[type][year] 
            : data.valuesByTypeAndYear[type][year];
          if (typeof value === 'number') {
            return value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          } else {
            return value || "-";
          }
        }),
      ];
    });

    // Evita erro quando nÃ£o hÃ¡ linhas (doc.lastAutoTable pode nÃ£o existir).
    if (!dataForTable || dataForTable.length === 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(tituloCompleto, doc.internal.pageSize.width / 2, 15, { align: 'center' });
      if (notaValores) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.text(notaValores, doc.internal.pageSize.width / 2, 21, { align: 'center' });
      }
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text("Nenhum dado encontrado para os filtros selecionados.", 14, 30);
      doc.setFontSize(9);
      doc.text(fonte, 14, 45);
      doc.save(`${nomeArquivoBase}.pdf`);
      return;
    }

    // Criar estilos de coluna para alinhar números à direita (todas exceto a primeira coluna)
    const columnStyles = {};
    for (let i = 1; i < headers.length; i++) {
      columnStyles[i] = { halign: 'right' };
    }
    
    // Adicionar título
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(tituloCompleto, doc.internal.pageSize.width / 2, 15, { align: 'center' });
    if (notaValores) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.text(notaValores, doc.internal.pageSize.width / 2, 21, { align: 'center' });
    }

    doc.autoTable({
      head: [headers],
      body: dataForTable,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'left',
      },
      headStyles: {
        fillColor: PDF_CABECALHO_FUNDO,
        textColor: 255,
        fontStyle: "bold",
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: PDF_LINHA_ALTERNADA,
      },
      columnStyles: columnStyles,
      theme: "grid",
      didDrawPage: function (data) {
        // Ajusta automaticamente a largura das colunas baseado no conteúdo
        const columnWidth = doc.internal.pageSize.width / (headers.length + 1);
        data.table.columns.forEach((column) => {
          column.minWidth = columnWidth;
        });
      },
    });
    
    // Adicionar fonte no final
    const finalY = doc.lastAutoTable?.finalY ?? 25;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(fonte, 14, finalY + 10);

    // Salvar PDF
    doc.save(`${nomeArquivoBase}.pdf`);
  };

  return (
    <>
      <div>
        <SummaryCards
          resumo={resumo}
          rows={data.years}
          types={data.types}
          dados={finalDisplayData}
          modo="anos"
          nomeLinha={(ano) => ano}
          correcaoAtiva={correcaoAtiva}
        />

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
                label={<MonetaryCorrectionLabel />}
                sx={{ marginRight: 0 }}
              />
              {useMonetaryCorrection && (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Data de Referência"
                    value={targetDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} size="small" />}
                    inputFormat="dd/MM/yyyy"
                    maxDate={maxDate}
                  />
                </LocalizationProvider>
              )}
            </Box>
          </Box>
        )}

        {loading && (
          <Box sx={{ textAlign: 'center', padding: '20px' }}>
            Aplicando correção monetária...
          </Box>
        )}

        {correcaoAtiva && !loading && (
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#b45309', fontStyle: 'italic', marginBottom: '6px' }}
          >
            {notaValores} — não são os valores nominais declarados no RREO.
          </Typography>
        )}

        <Paper elevation={0} sx={{ border: `1px solid ${cores.linha}`, borderRadius: '14px', overflow: 'hidden' }}>
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="state revenue table">
              <StyledTableHead>
                <TableRow>
                  <BoldTableCell sx={{ textAlign: 'left' }}>Ano</BoldTableCell>
                  {data.types.map((type) => (
                    <BoldTableCell
                      key={type}
                      align="right"
                      sx={{
                        minWidth: larguraColuna(type),
                        ...(isColunaTotal(type) ? { backgroundColor: cores.areiaEscura, color: cores.tinta, fontWeight: 700 } : {}),
                      }}
                    >
                      <ColunaComExplicacao nome={type} />
                    </BoldTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {data.years.map((year, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 1 ? cores.zebra : cores.superficie,
                      '&:hover': { backgroundColor: '#F8EFE9' },
                      '&:last-child td, &:last-child th': { borderBottom: 0 },
                    }}
                  >
                    <CenteredTableCell component="th" scope="row" sx={{ textAlign: 'left', fontWeight: 600 }}>
                      {year}
                    </CenteredTableCell>
                    {data.types.map((type, idx) => {
                      const value = finalDisplayData[type] && finalDisplayData[type][year] !== undefined 
                        ? finalDisplayData[type][year] 
                        : data.valuesByTypeAndYear[type][year];
                      return (
                        <CenteredTableCell key={idx} align="right">
                          {typeof value === 'number' 
                            ? `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${type.includes('%') ? '%' : ''}`
                            : value || '-'}
                        </CenteredTableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="success"
            onClick={downloadExcel}
            startIcon={<FaFileExcel />}
            aria-label="Baixar tabela em Excel"
            className="action-button"
          >
            <span className="button-text">Excel</span>
          </Button>
          <Button
            variant="contained"
            onClick={downloadPDF}
            startIcon={<FaFilePdf />}
            aria-label="Baixar tabela em PDF"
            sx={{
              backgroundColor: globalTheme.palette.primary.main,
              color: globalTheme.palette.primary.contrastText,
              '&:hover': { backgroundColor: globalTheme.palette.primary.dark },
            }}
            className="action-button"
          >
            <span className="button-text">PDF</span>
          </Button>
          <TechnicalSheetButton dialogTitle={`Ficha técnica — ${tableName}`}>
              <ConteudoFicha chave="estado" />
            </TechnicalSheetButton>
        </div>
        
        {/* Fonte dos dados, com link pro documento original */}
        <DataSourceNote nivel="estadual" />
      </div>
    </>
  );
};

export default StateRevenueTable; 
