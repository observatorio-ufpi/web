import { FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
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
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { municipios, Regioes, FaixaPopulacional } from "../../../../../../utils/municipios.mapping";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Typography, CircularProgress, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ptBR from "date-fns/locale/pt-BR";
import {
  MonetaryCorrectionLabel,
  notaCorrecaoMonetaria,
  sufixoArquivoCorrecao,
} from "../../../../../common/MonetaryCorrectionHelp";
import DataSourceNote from "../../../../../common/DataSourceNote";
import SummaryCards from "./SummaryCards";
import { cores } from "../../../../../../theme/tokens";
import {
  fetchIPCAData,
  calculateMonetaryCorrection,
  getCurrentDate,
  getMaxIPCADate,
} from "../../../../../../utils/bacenApi";
import { FONTE_EXPORTACAO, EXCEL_CABECALHO_FUNDO, EXCEL_CABECALHO_TEXTO, PDF_CABECALHO_FUNDO, PDF_LINHA_ALTERNADA } from '../../../../../../utils/exportStyle';
import ColunaComExplicacao from "../../../../../common/ColunaComExplicacao";

export const SEM_DADO_TOOLTIP =
  "Sem dado disponível para este período/categoria — pode ser porque esse item não existia no RREO deste período, ou porque o município não reportou essa informação.";

// Largura mínima proporcional ao nome da coluna: nomes longos ("Educação de
// Jovens e Adultos...") quebravam em 5-6 linhas e deixavam o cabeçalho enorme
const larguraColuna = (type) => `${Math.min(15, Math.max(7.5, type.length * 0.42))}rem`;

// Coluna de total (ex.: "Total de Receitas de Impostos Próprios") ganha destaque
const isColunaTotal = (type) => /total/i.test(type);

const HeadCell = styled(TableCell)({
  backgroundColor: cores.areia,
  color: cores.textoSobreAreia,
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  lineHeight: 1.35,
  padding: "10px 16px",
  textAlign: "right",
  verticalAlign: "bottom",
  minWidth: "7.5rem",
  borderBottom: `1px solid ${cores.linha}`,
  "@media (max-width: 600px)": { minWidth: "6rem", padding: "10px 12px" },
});

const BodyCell = styled(TableCell)({
  textAlign: "right",
  verticalAlign: "middle",
  fontSize: "14px",
  color: cores.tinta,
  fontVariantNumeric: "tabular-nums", // casas decimais alinhadas na coluna
  padding: "12px 16px",
  borderBottom: `1px solid ${cores.linha}`,
  "@media (max-width: 600px)": { padding: "12px 12px" },
});

// Primeira coluna (Município/Ano) fixa ao rolar a tabela pros lados —
// sem isso, no celular o usuário perde de vista qual linha está vendo.
const stickyFirst = {
  position: "sticky",
  left: 0,
  zIndex: 2,
  textAlign: "left",
  boxShadow: `1px 0 0 ${cores.linha}`,
};

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
  // Com várias tabelas na página, o container mostra legenda e fonte uma vez só no fim
  mostrarRodape = true,
  // Cards de resumo acima da tabela (config em TABLE_MAPPINGS.resumo); null = sem cards
  resumo = null,
  // Valores de todos os municípios no último ano (para "posição no Piauí" nos cards)
  referenciaEstadual = null,
}) => {
  const [useMonetaryCorrection, setUseMonetaryCorrection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date());
  const [correctedData, setCorrectedData] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [menuExportar, setMenuExportar] = useState(null);

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
          // Percentuais não são dinheiro — nunca corrigir pela inflação
          const ehPercentual = isPercentageType(type) || type.includes('%');
          Object.keys(typeToRowToValue[type]).forEach(key => {
            const originalValue = typeToRowToValue[type][key];
            if (!ehPercentual && typeof originalValue === 'number' && originalValue > 0) {
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
  const correcaoAtiva = useMonetaryCorrection && !!correctedData;
  const notaValores = correcaoAtiva ? notaCorrecaoMonetaria(targetDate) : null;

  // Se existe pelo menos uma célula sem dado, mostra a legenda explicando o "-"
  const temCelulaSemDado = useMemo(() => {
    return rows.some((row) =>
      types.some(
        (type) => !finalDisplayData[type] || finalDisplayData[type][row] === undefined
      )
    );
  }, [rows, types, finalDisplayData]);

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

  // Título, nome de arquivo e fonte — iguais no Excel e no PDF
  const montarMetadadosExportacao = () => {
    const periodoLabel = anoInicial && anoFinal 
      ? (anoInicial === anoFinal ? `${anoInicial}` : `${anoInicial}-${anoFinal}`)
      : '';
    const municipioLabel = nomeMunicipio ? nomeMunicipio.replace(/\s+/g, '_') : '';
    const tituloCompleto = nomeMunicipio 
      ? `${tableName} - ${nomeMunicipio}${periodoLabel ? ` (${periodoLabel})` : ''}`
      : `${tableName}${periodoLabel ? ` (${periodoLabel})` : ''}`;
    const fonte = FONTE_EXPORTACAO;
    
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
    // Com correção ligada, o arquivo diz isso no nome (e no título, via notaValores)
    if (correcaoAtiva) nomeArquivoParts.push(sufixoArquivoCorrecao(targetDate));
    const nomeArquivoBase = nomeArquivoParts.join('_').replace(/[<>:"/\\|?*]/g, '');

    return { tituloCompleto, nomeArquivoBase, fonte };
  };

  const downloadExcel = async () => {
    const { tituloCompleto, nomeArquivoBase, fonte } = montarMetadadosExportacao();

    // Criar workbook com ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OPEPI/UFPI';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet('Receitas');

    if (groupType === "municipio") {
      // Adicionar título
      worksheet.addRow([tituloCompleto]);
      worksheet.mergeCells(1, 1, 1, types.length + 1);
      worksheet.getCell('A1').font = { bold: true, size: 14 };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
      
      // Aviso de correção monetária (ou linha vazia)
      worksheet.addRow(notaValores ? [notaValores] : []);
      if (notaValores) worksheet.getCell('A2').font = { italic: true, color: { argb: 'FFB45309' } };

      // Cabeçalhos
      const headerRow = worksheet.addRow(["Ano", ...types]);
      headerRow.font = { bold: true, color: { argb: EXCEL_CABECALHO_TEXTO } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_CABECALHO_FUNDO } };
      headerRow.alignment = { horizontal: 'center' };
      
      // Dados
      rows.forEach((row) => {
        const dataRow = [row];
        types.forEach((type) => {
          if (finalDisplayData[type] && finalDisplayData[type][row] !== undefined) {
            const value = finalDisplayData[type][row];
            dataRow.push(typeof value === 'number' ? value : (parseFloat(String(value).replace(/[.\s]/g, '').replace(',', '.')) || value));
          } else {
            dataRow.push("");
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
      for (let i = 2; i <= types.length + 1; i++) {
        worksheet.getColumn(i).width = 20;
        // Aplicar formato numérico
        worksheet.getColumn(i).numFmt = '#,##0.00';
        worksheet.getColumn(i).alignment = { horizontal: 'right' };
      }
    }

    if (groupType === "ano" || groupType === "desagregado") {
      // Adicionar título
      worksheet.addRow([tituloCompleto]);
      worksheet.mergeCells(1, 1, 1, types.length + 1);
      worksheet.getCell('A1').font = { bold: true, size: 14 };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
      
      // Aviso de correção monetária (ou linha vazia)
      worksheet.addRow(notaValores ? [notaValores] : []);
      if (notaValores) worksheet.getCell('A2').font = { italic: true, color: { argb: 'FFB45309' } };

      // Cabeçalhos
      const headerRow = worksheet.addRow(["Município", ...types]);
      headerRow.font = { bold: true, color: { argb: EXCEL_CABECALHO_TEXTO } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_CABECALHO_FUNDO } };
      headerRow.alignment = { horizontal: 'center' };
      
      // Dados
      rows.forEach((row) => {
        const dataRow = [`${municipios[row]?.nomeMunicipio || row}`];
        types.forEach((type) => {
          if (finalDisplayData[type] && finalDisplayData[type][row] !== undefined) {
            const value = finalDisplayData[type][row];
            dataRow.push(typeof value === 'number' ? value : (parseFloat(String(value).replace(/[.\s]/g, '').replace(',', '.')) || value));
          } else {
            dataRow.push("");
          }
        });
        worksheet.addRow(dataRow);
      });
      
      // Linha vazia
      worksheet.addRow([]);
      
      // Fonte
      worksheet.addRow([fonte]);
      
      // Configurar largura das colunas
      worksheet.getColumn(1).width = 35;
      for (let i = 2; i <= types.length + 1; i++) {
        worksheet.getColumn(i).width = 20;
        // Aplicar formato numérico
        worksheet.getColumn(i).numFmt = '#,##0.00';
        worksheet.getColumn(i).alignment = { horizontal: 'right' };
      }
    }
    
    // Salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${nomeArquivoBase}.xlsx`);
  };

  // CSV para quem vai analisar em outras ferramentas (R, Python, planilhas).
  // Separador ";" e vírgula decimal: o Excel em português abre direto, sem assistente.
  // BOM UTF-8 no início para os acentos aparecerem certos.
  const downloadCSV = () => {
    const { nomeArquivoBase, fonte } = montarMetadadosExportacao();
    const primeiraColuna = groupType === "ano" || groupType === "desagregado" ? "Município" : "Ano";
    const escapar = (v) => {
      const t = String(v ?? "");
      return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
    };
    const numeroBR = (v) =>
      typeof v === "number" ? v.toLocaleString("pt-BR", { useGrouping: false, maximumFractionDigits: 10 }) : "";
    const linhas = [
      [primeiraColuna, ...types].map(escapar).join(";"),
      ...rows.map((row) => {
        const rotulo = groupType === "ano" || groupType === "desagregado" ? municipios[row]?.nomeMunicipio || row : row;
        return [escapar(rotulo), ...types.map((t) => numeroBR(finalDisplayData[t]?.[row]))].join(";");
      }),
      "",
      escapar(notaValores ? `${fonte}. ${notaValores}.` : fonte),
    ];
    const blob = new Blob(["﻿" + linhas.join("\r\n")], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${nomeArquivoBase}.csv`);
  };

  const downloadPDF = () => {
    const { tituloCompleto, nomeArquivoBase, fonte } = montarMetadadosExportacao();

    const doc = new jsPDF();
    const headers = [
      groupType === "ano" || groupType === "desagregado" ? "Município" : "Ano",
      ...types,
    ];

    const dataForTable = rows.map((row) => {
      return [
        groupType === "ano" || groupType === "desagregado"
          ? `${municipios[row]?.nomeMunicipio || row}`
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

    // Evita erro quando nÃ£o hÃ¡ linhas (doc.lastAutoTable pode nÃ£o existir).
    if (!dataForTable || dataForTable.length === 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(tituloCompleto, 14, 15);
      if (notaValores) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.text(notaValores, 14, 21);
      }
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text("Nenhum dado encontrado para os filtros selecionados.", 14, 30);
      doc.setFontSize(9);
      doc.text(fonte, 14, 45);
      doc.save(`${nomeArquivoBase}.pdf`);
      return;
    }

    // Adicionar título
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(tituloCompleto, 14, 15);
    if (notaValores) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.text(notaValores, 14, 21);
    }

    // Criar estilos de coluna para alinhar números à direita (todas exceto a primeira coluna)
    const columnStyles = {};
    for (let i = 1; i < headers.length; i++) {
      columnStyles[i] = { halign: 'right' };
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

    // Adicionar fonte no rodapé
    const finalY = doc.lastAutoTable?.finalY ?? 25;
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

  const rotuloPrimeiraColuna =
    groupType === "ano" || groupType === "desagregado" ? "Município" : "Ano";

  return (
    <div>
      {groupType !== "desagregado" && (
        <SummaryCards
          resumo={resumo}
          rows={rows}
          types={types}
          dados={finalDisplayData}
          modo={groupType === "municipio" ? "anos" : "municipios"}
          nomeLinha={(row) => municipios[row]?.nomeMunicipio || row}
          correcaoAtiva={correcaoAtiva}
          anoReferencia={keyTable && /^\d{4}$/.test(String(keyTable)) ? Number(keyTable) : anoFinal}
          referencia={referenciaEstadual}
        />
      )}

      {/* Barra da tabela: correção monetária à esquerda, Exportar à direita */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
          {enableMonetaryCorrection && (
            <FormControlLabel
              control={
                <Switch
                  checked={useMonetaryCorrection}
                  onChange={handleMonetaryCorrectionToggle}
                  color="primary"
                />
              }
              label={<MonetaryCorrectionLabel />}
              sx={{ marginRight: 0, "& .MuiFormControlLabel-label": { fontSize: "14px", color: cores.texto } }}
            />
          )}
          {enableMonetaryCorrection && useMonetaryCorrection && (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de referência"
                value={targetDate}
                onChange={handleDateChange}
                format="dd/MM/yyyy"
                maxDate={maxDate}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          )}
        </Box>

        <Button
          variant="outlined"
          onClick={(e) => setMenuExportar(e.currentTarget)}
          startIcon={<FileDownloadOutlinedIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          aria-haspopup="menu"
          aria-expanded={Boolean(menuExportar)}
          sx={{
            color: cores.tinta,
            borderColor: cores.linhaForte,
            backgroundColor: cores.superficie,
            "&:hover": { borderColor: cores.marca, backgroundColor: cores.areia },
          }}
        >
          Exportar
        </Button>
        <Menu
          anchorEl={menuExportar}
          open={Boolean(menuExportar)}
          onClose={() => setMenuExportar(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => { setMenuExportar(null); downloadExcel(); }}>
            <ListItemIcon><FaFileExcel color={cores.textoSuave} /></ListItemIcon>
            <ListItemText primary="Planilha (Excel)" secondary=".xlsx, com valores numéricos" />
          </MenuItem>
          <MenuItem onClick={() => { setMenuExportar(null); downloadPDF(); }}>
            <ListItemIcon><FaFilePdf color={cores.textoSuave} /></ListItemIcon>
            <ListItemText primary="Documento (PDF)" secondary="pronto para imprimir" />
          </MenuItem>
          <MenuItem onClick={() => { setMenuExportar(null); downloadCSV(); }}>
            <ListItemIcon><FaFileCsv color={cores.textoSuave} /></ListItemIcon>
            <ListItemText primary="Dados (CSV)" secondary="para R, Python ou outras planilhas" />
          </MenuItem>
        </Menu>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100px" }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Aplicando correção monetária...</Typography>
        </Box>
      )}

      {correcaoAtiva && !loading && (
        <Typography
          variant="caption"
          sx={{ display: "block", color: cores.atencao, fontWeight: 600, marginBottom: "8px" }}
        >
          {notaValores} — não são os valores nominais declarados no RREO.
        </Typography>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
          border: `1px solid ${cores.linha}`,
          borderRadius: "14px",
          backgroundColor: cores.superficie,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label={tableName}>
          <TableHead>
            <TableRow>
              <HeadCell sx={{ ...stickyFirst, zIndex: 3 }}>{rotuloPrimeiraColuna}</HeadCell>
              {types.map((type) => (
                <HeadCell
                  key={type}
                  sx={{
                    minWidth: larguraColuna(type),
                    ...(isColunaTotal(type) ? { backgroundColor: cores.areiaEscura, color: cores.tinta, fontWeight: 700 } : {}),
                  }}
                >
                  <ColunaComExplicacao nome={type} />
                </HeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <BodyCell
                  colSpan={types.length + 1}
                  sx={{ textAlign: "center", color: cores.textoSuave, fontStyle: "italic", py: 4 }}
                >
                  Nenhum dado encontrado para os filtros selecionados.
                </BodyCell>
              </TableRow>
            )}
            {rows.map((row, i) => {
              const fundoLinha = i % 2 === 1 ? cores.zebra : cores.superficie;
              return (
                <TableRow
                  key={row}
                  sx={{
                    backgroundColor: fundoLinha,
                    transition: "background-color 120ms ease",
                    "&:hover, &:hover th": { backgroundColor: "#F8EFE9" },
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                  }}
                >
                  <BodyCell
                    component="th"
                    scope="row"
                    sx={{ ...stickyFirst, backgroundColor: fundoLinha, fontWeight: 600 }}
                  >
                    {groupType === "ano" || groupType === "desagregado"
                      ? `${municipios[row]?.nomeMunicipio || row}`
                      : `${row}`}
                  </BodyCell>
                  {types.map((type) => {
                    const hasValue =
                      finalDisplayData[type] &&
                      finalDisplayData[type][row] !== undefined;
                    return (
                      <BodyCell
                        key={type}
                        sx={isColunaTotal(type) ? { fontWeight: 700, backgroundColor: "rgba(243, 230, 222, 0.45)" } : undefined}
                      >
                        {hasValue ? (
                          formatValue(finalDisplayData[type][row], type)
                        ) : (
                          <Tooltip title={SEM_DADO_TOOLTIP} arrow enterTouchDelay={0}>
                            <span style={{ cursor: "help", color: cores.textoSuave }}>–</span>
                          </Tooltip>
                        )}
                      </BodyCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legenda do "–" (só aparece se a tabela tiver alguma célula vazia) */}
      {mostrarRodape && temCelulaSemDado && (
        <Typography
          variant="caption"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "6px",
            color: cores.textoSuave,
            fontSize: "13px",
            lineHeight: 1.45,
            marginTop: "12px",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }} />
          <span>
            <strong>“–”</strong> na tabela significa: {SEM_DADO_TOOLTIP}
          </span>
        </Typography>
      )}

      {/* Fonte dos dados, com link pro documento original */}
      {mostrarRodape && <DataSourceNote nivel="municipal" />}
    </div>
  );
};

export default RevenueTable;
