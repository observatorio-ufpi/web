import * as XLSX from 'xlsx';
import { municipios } from '../utils/citiesMapping';

const API_BASE_URL = import.meta.env.VITE_API_PUBLIC_URL || 'http://localhost:3003';

/**
 * Função para exportar tabelão de educação básica
 * @param {string} type - Tipo de dados (enrollment, school/count, class, teacher, employees)
 * @param {string} filterDim - Filtro (etapa, localidade, dependencia)
 * @param {number|object} yearOrRange - Ano único ou objeto {startYear, endYear} para série histórica
 */
export const exportBasicEducationTable = async (type, filterDim, yearOrRange) => {
  try {
    // Determinar se é série histórica ou ano único
    const isHistorical = typeof yearOrRange === 'object';
    const startYear = isHistorical ? yearOrRange.startYear : yearOrRange;
    const endYear = isHistorical ? yearOrRange.endYear : yearOrRange;
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }

    console.log('[EXPORT] Iniciando exportação:', { type, filterDim, isHistorical, years });

    // Mapear filtro para dimension da API
    const filterToDimensionMap = {
      'etapa': 'education_level_mod',
      'localidade': 'location',
      'dependencia': 'adm_dependency_detailed'
    };
    const dimension = filterToDimensionMap[filterDim];

    if (!dimension) {
      throw new Error(`Filtro inválido: ${filterDim}`);
    }

    // Obter lista de municípios
    const municipiosList = Object.entries(municipios);
    console.log(`[EXPORT] Total de municípios: ${municipiosList.length}`);

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Processar cada ano
    for (const year of years) {
      console.log(`[EXPORT] Processando ano ${year}...`);

      // Buscar dados para cada município
      const promises = municipiosList.map(async ([codigo, info]) => {
        // Formato do filter: min_year:"2024",max_year:"2024",state:"22",city:"2200051"
        const filter = `min_year:"${year}",max_year:"${year}",state:"22",city:"${codigo}"`;
        const url = `${API_BASE_URL}/basicEducation/${type}?dims=${dimension}&filter=${encodeURIComponent(filter)}`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`[EXPORT] Erro ao buscar dados para ${info.nomeMunicipio} (${response.status})`);
            return null;
          }

          const data = await response.json();
          return {
            municipio: info.nomeMunicipio,
            codigo_ibge: codigo,
            dados: data.result || []
          };
        } catch (error) {
          console.warn(`[EXPORT] Erro ao buscar ${info.nomeMunicipio}:`, error);
          return null;
        }
      });

      const resultados = await Promise.all(promises);
      console.log(`[EXPORT] Dados coletados para ${year}`);

      // Coletar todas as colunas únicas
      const colunasSet = new Set();
      resultados.forEach(resultado => {
        if (resultado && resultado.dados) {
          resultado.dados.forEach(item => {
            let nomeColuna = '';

            if (filterDim === 'etapa') {
              nomeColuna = item.education_level_mod_name || 'Não especificado';
            } else if (filterDim === 'localidade') {
              nomeColuna = item.location_name || 'Não especificado';
            } else if (filterDim === 'dependencia') {
              nomeColuna = item.adm_dependency_detailed_name || 'Não especificado';
            }

            if (nomeColuna) {
              colunasSet.add(nomeColuna);
            }
          });
        }
      });

      const colunas = Array.from(colunasSet).sort();
      console.log(`[EXPORT] Colunas encontradas para ${year}:`, colunas);

      // Processar dados do ano (sem linha de totais ainda)
      const dadosMunicipios = [];
      resultados.forEach(resultado => {
        if (!resultado) return;
        const linha = {
          'Município': resultado.municipio,
          'Código IBGE': resultado.codigo_ibge
        };
        colunas.forEach(coluna => {
          linha[coluna] = 0;
        });
        if (resultado.dados) {
          resultado.dados.forEach(item => {
            let nomeColuna = '';
            if (filterDim === 'etapa') {
              nomeColuna = item.education_level_mod_name || 'Não especificado';
            } else if (filterDim === 'localidade') {
              nomeColuna = item.location_name || 'Não especificado';
            } else if (filterDim === 'dependencia') {
              nomeColuna = item.adm_dependency_detailed_name || 'Não especificado';
            }
            if (nomeColuna && linha[nomeColuna] !== undefined) {
              linha[nomeColuna] = (linha[nomeColuna] || 0) + (item.total || 0);
            }
          });
        }
        dadosMunicipios.push(linha);
      });

      // Ordenar por nome do município
      dadosMunicipios.sort((a, b) => a['Município'].localeCompare(b['Município']));

      // Adicionar coluna de TOTAL para cada linha
      dadosMunicipios.forEach(linha => {
        let totalLinha = 0;
        colunas.forEach(coluna => {
          totalLinha += linha[coluna] || 0;
        });
        linha['TOTAL'] = totalLinha;
      });

      // Adicionar linha de totais
      const linhaTotal = {
        'Município': 'TOTAL',
        'Código IBGE': ''
      };

      // Calcular totais por coluna
      colunas.forEach(coluna => {
        let soma = 0;
        dadosMunicipios.forEach(linha => {
          soma += linha[coluna] || 0;
        });
        linhaTotal[coluna] = soma;
      });

      // Calcular total geral (soma de todas as colunas)
      let totalGeral = 0;
      colunas.forEach(coluna => {
        totalGeral += linhaTotal[coluna] || 0;
      });
      linhaTotal['TOTAL'] = totalGeral;

      const dadosExcel = [...dadosMunicipios, linhaTotal];

      // Criar planilha
      const ws = XLSX.utils.json_to_sheet(dadosExcel);

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 25 }, // Município
        { wch: 15 }, // Código IBGE
        ...colunas.map(() => ({ wch: 15 })),
        { wch: 15 }  // TOTAL
      ];
      ws['!cols'] = colWidths;

      // Adicionar planilha ao workbook
      const sheetName = isHistorical ? `Ano ${year}` : 'Dados';
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    // Gerar o nome do arquivo
    const filterNames = {
      'etapa': 'Etapa',
      'localidade': 'Localidade',
      'dependencia': 'Dependencia'
    };
    const typeNames = {
      'enrollment': 'Matricula',
      'school/count': 'Escolas',
      'class': 'Turmas',
      'teacher': 'Professores',
      'employees': 'Funcionarios'
    };
    const yearLabel = isHistorical ? `${startYear}-${endYear}` : startYear;
    const fileName = `Basica_${typeNames[type]}_${filterNames[filterDim]}_${yearLabel}.xlsx`;

    // Salvar o arquivo
    XLSX.writeFile(wb, fileName);
    console.log('[EXPORT] Arquivo salvo:', fileName);

    return true;
  } catch (error) {
    console.error('[EXPORT] Erro ao exportar dados:', error);
    throw error;
  }
};

/**
 * Função para exportar tabelão de educação superior
 * @param {string} type - Tipo de dados (university/count, university_enrollment, university_teacher, course_count)
 * @param {string} filter - Filtro (modalidade, regimeDeTrabalho, formacaoDocente, etc)
 * @param {number|object} yearOrRange - Ano único ou objeto {startYear, endYear} para série histórica
 */
export const exportHigherEducationTable = async (type, filter, yearOrRange) => {
  try {
    // Determinar se é série histórica ou ano único
    const isHistorical = typeof yearOrRange === 'object';
    const startYear = isHistorical ? yearOrRange.startYear : yearOrRange;
    const endYear = isHistorical ? yearOrRange.endYear : yearOrRange;
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }

    console.log('[EXPORT-HIGHER] Iniciando exportação:', { type, filter, isHistorical, years });

    // Mapear filtro para dimension da API
    const filterToDimensionMap = {
      'modalidade': 'upper_education_mod',
      'regimeDeTrabalho': 'work_regime',
      'formacaoDocente': 'initial_training',
      'categoriaAdministrativa': 'upper_adm_dependency',
      'faixaEtariaSuperior': 'age_student_code',
      'organizacaoAcademica': 'academic_level',
      'instituicaoEnsino': 'institution'
    };
    const dimension = filterToDimensionMap[filter];

    if (!dimension) {
      throw new Error(`Filtro inválido: ${filter}`);
    }

    // Mapear os nomes dos campos baseado no filtro
    const fieldNameMap = {
      'modalidade': { id: 'upper_education_mod_id', name: 'upper_education_mod_name' },
      'regimeDeTrabalho': { id: 'work_regime_id', name: 'work_regime_name' },
      'formacaoDocente': { id: 'initial_training_id', name: 'initial_training_name' },
      'categoriaAdministrativa': { id: 'upper_adm_dependency_id', name: 'upper_adm_dependency_name' },
      'faixaEtariaSuperior': { id: 'age_student_code_id', name: 'age_student_code_name' },
      'organizacaoAcademica': { id: 'academic_level_id', name: 'academic_level_name' },
      'instituicaoEnsino': { id: 'institution_id', name: 'institution_name' }
    };
    const fieldMap = fieldNameMap[filter];

    // Obter lista de municípios
    const municipiosList = Object.entries(municipios);
    console.log(`[EXPORT-HIGHER] Total de municípios: ${municipiosList.length}`);

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Processar cada ano
    for (const year of years) {
      console.log(`[EXPORT-HIGHER] Processando ano ${year}...`);

      // Buscar dados para cada município
      const promises = municipiosList.map(async ([codigo, info]) => {
        const url = `${API_BASE_URL}/higherEducation/${type}?dims=${dimension}&filter=min_year:"${year}",max_year:"${year}",state:"22",city:"${codigo}"`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`[EXPORT-HIGHER] Erro ao buscar dados para ${info.nomeMunicipio} (${response.status})`);
            return null;
          }

          const data = await response.json();
          return {
            municipio: info.nomeMunicipio,
            codigo_ibge: codigo,
            dados: data.result || []
          };
        } catch (error) {
          console.warn(`[EXPORT-HIGHER] Erro ao buscar ${info.nomeMunicipio}:`, error);
          return null;
        }
      });

      const resultados = await Promise.all(promises);
      console.log(`[EXPORT-HIGHER] Dados coletados para ${year}`);

      // Coletar todas as colunas únicas
      const colunasSet = new Set();
      resultados.forEach(resultado => {
        if (resultado && resultado.dados) {
          resultado.dados.forEach(item => {
            const nomeColuna = item[fieldMap.name] || 'Não especificado';
            colunasSet.add(nomeColuna);
          });
        }
      });

      const colunas = Array.from(colunasSet).sort();
      console.log(`[EXPORT-HIGHER] Colunas encontradas para ${year}:`, colunas);

      // Processar dados do ano (sem linha de totais ainda)
      const dadosMunicipios = [];
      resultados.forEach(resultado => {
        if (!resultado) return;
        const linha = {
          'Município': resultado.municipio,
          'Código IBGE': resultado.codigo_ibge
        };
        colunas.forEach(coluna => {
          linha[coluna] = 0;
        });
        if (resultado.dados) {
          resultado.dados.forEach(item => {
            const nomeColuna = item[fieldMap.name] || 'Não especificado';
            if (linha[nomeColuna] !== undefined) {
              linha[nomeColuna] = (linha[nomeColuna] || 0) + (item.total || 0);
            }
          });
        }
        dadosMunicipios.push(linha);
      });

      // Ordenar por nome do município
      dadosMunicipios.sort((a, b) => a['Município'].localeCompare(b['Município']));

      // Adicionar coluna de TOTAL para cada linha
      dadosMunicipios.forEach(linha => {
        let totalLinha = 0;
        colunas.forEach(coluna => {
          totalLinha += linha[coluna] || 0;
        });
        linha['TOTAL'] = totalLinha;
      });

      // Adicionar linha de totais
      const linhaTotal = {
        'Município': 'TOTAL',
        'Código IBGE': ''
      };

      // Calcular totais por coluna
      colunas.forEach(coluna => {
        let soma = 0;
        dadosMunicipios.forEach(linha => {
          soma += linha[coluna] || 0;
        });
        linhaTotal[coluna] = soma;
      });

      // Calcular total geral
      let totalGeral = 0;
      colunas.forEach(coluna => {
        totalGeral += linhaTotal[coluna] || 0;
      });
      linhaTotal['TOTAL'] = totalGeral;

      const dadosExcel = [...dadosMunicipios, linhaTotal];

      // Criar planilha
      const ws = XLSX.utils.json_to_sheet(dadosExcel);

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 25 }, // Município
        { wch: 15 }, // Código IBGE
        ...colunas.map(() => ({ wch: 15 })),
        { wch: 15 }  // TOTAL
      ];
      ws['!cols'] = colWidths;

      // Adicionar planilha ao workbook
      const sheetName = isHistorical ? `Ano ${year}` : 'Dados';
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    // Gerar o nome do arquivo
    const filterNames = {
      'modalidade': 'Modalidade',
      'regimeDeTrabalho': 'RegimeTrabalho',
      'formacaoDocente': 'FormacaoDocente',
      'categoriaAdministrativa': 'CategoriaAdministrativa',
      'faixaEtariaSuperior': 'FaixaEtaria',
      'organizacaoAcademica': 'OrganizacaoAcademica',
      'instituicaoEnsino': 'InstituicaoEnsino'
    };
    const typeNames = {
      'university/count': 'IES',
      'university_enrollment': 'Matricula',
      'university_teacher': 'Docentes',
      'course_count': 'Cursos'
    };
    const yearLabel = isHistorical ? `${startYear}-${endYear}` : startYear;
    const fileName = `Superior_${typeNames[type]}_${filterNames[filter]}_${yearLabel}.xlsx`;

    // Salvar o arquivo
    XLSX.writeFile(wb, fileName);
    console.log('[EXPORT-HIGHER] Arquivo salvo:', fileName);

    return true;
  } catch (error) {
    console.error('[EXPORT-HIGHER] Erro ao exportar dados:', error);
    throw error;
  }
};

