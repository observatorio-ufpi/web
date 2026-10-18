import React from 'react';
import Select from 'react-select';
import { Tooltip } from '@mui/material';
import { cores } from '../../theme/tokens';

// Opção com explicação em linguagem simples numa segunda linha (campo `descricao`).
// Só no menu aberto — com a opção já escolhida, o campo mostra só o nome.
// Uso: <Select options={[{ value, label, descricao }]} formatOptionLabel={formatarOpcaoComDescricao} />
export const formatarOpcaoComDescricao = ({ label, descricao }, { context }) => (
  <div>
    <div>{label}</div>
    {context === 'menu' && descricao && (
      <div style={{ fontSize: '0.85em', opacity: 0.7, lineHeight: 1.3, marginTop: 2 }}>
        {descricao}
      </div>
    )}
  </div>
);

// Motivo padrão dos filtros de localidade (Território, Faixa, Aglomerado, GRE)
// desabilitados quando já há um município escolhido — usado nas sidebars
// financeira e educacionais
export const MOTIVO_MUNICIPIO_SELECIONADO =
  'Desabilitado porque um município específico já foi selecionado acima';

const CustomSelect = ({ 
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Selecione uma opção',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  // Texto explicando por que o campo está desabilitado (aparece ao passar o mouse/tocar)
  disabledReason = null,
  className = '',
  ...props 
}) => {
  // No celular, listas curtas não abrem o teclado (não precisam de busca): no iPhone,
  // tocar num campo com texto menor que 16px dava zoom automático na página e a lista
  // de opções ficava deslocada para o lado, cortada. Listas longas (ex.: os 224
  // municípios) continuam com busca, com o texto digitado em 16px para não dar zoom.
  const ehToque = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  const buscavel = props.isSearchable ?? !(ehToque && options.length <= 30);
  const sizes = {
    xxs: 'text-[10px]',
    xs: 'text-xs',
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const baseClasses = `${sizes[size]} transition-colors duration-200`;
  // Mesmos tamanhos em px para os estilos do react-select (as classes Tailwind acima
  // não valem como valor de fontSize)
  const tamanhoPx = { xxs: '10px', xs: '12px', small: '14px', medium: '16px', large: '18px' }[size] || '16px';
  
  // Estilos customizados baseados no que já existe no Home.jsx
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? `2px solid ${cores.marca}` : `2px solid ${cores.linha}`,
      borderRadius: '8px',
      boxShadow: state.isFocused ? `0 0 0 1px ${cores.marca}` : 'none',
      minHeight: size === 'xxs' ? '24px' : size === 'xs' ? '28px' : size === 'small' ? '36px' : size === 'large' ? '48px' : '40px',
      '&:hover': {
        border: `2px solid ${cores.marca}`
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? cores.marca : state.isFocused ? cores.areia : 'white',
      color: state.isSelected ? 'white' : cores.tinta,
      // opções da lista com no mínimo 14px (legíveis no celular), mesmo em campos compactos
      fontSize: ['xxs', 'xs'].includes(size) ? '14px' : tamanhoPx,
      '&:hover': {
        backgroundColor: state.isSelected ? cores.marca : cores.areia
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    singleValue: (provided) => ({
      ...provided,
      color: cores.tinta,
      fontSize: tamanhoPx
    }),
    placeholder: (provided) => ({
      ...provided,
      color: cores.textoSuave,
      fontSize: tamanhoPx
    }),
    input: (provided) => ({
      ...provided,
      // 16px no celular evita o zoom automático do iPhone ao focar o campo
      '@media (max-width: 768px)': { fontSize: '16px' },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: size === 'xxs' ? '0px 4px' : size === 'xs' ? '2px 6px' : size === 'small' ? '4px 8px' : size === 'large' ? '12px 16px' : '8px 12px'
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: size === 'xxs' ? '0px 2px' : size === 'xs' ? '2px 6px' : size === 'small' ? '4px 8px' : size === 'large' ? '12px 16px' : '8px 12px'
    })
  };
  
  const campo = (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={disabled}
      isSearchable={buscavel}
      className={baseClasses}
      classNamePrefix="react-select"
      styles={customStyles}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      {...props}
    />
  );

  return (
    <div className={`${fullWidth ? 'w-full' : 'min-w-[200px]'} ${className}`}>
      {label && (
        <label className={`block text-gray-700 mb-2 font-medium ${size === 'xs' ? 'text-xs' : 'text-sm'}`}>
          {label}
        </label>
      )}
      {disabled && disabledReason ? (
        // O <span> recebe o mouse/toque — elemento desabilitado não dispara eventos
        <Tooltip title={disabledReason} arrow enterTouchDelay={0}>
          <span style={{ display: 'block', cursor: 'not-allowed' }}>{campo}</span>
        </Tooltip>
      ) : (
        campo
      )}
    </div>
  );
};

export default CustomSelect;
