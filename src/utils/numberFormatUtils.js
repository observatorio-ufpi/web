export function parseLooseNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  if (typeof value !== 'string') return null;
  let s = value.trim();
  if (!s) return null;
  if (s === '-' || s === '—') return null;

  // Remove currency/percent markers and non-breaking spaces.
  s = s.replace(/\u00A0/g, ' ');
  s = s.replace(/R\$\s?/gi, '');
  s = s.replace(/%/g, '');
  s = s.replace(/\s+/g, '');

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    // Choose the last separator as the decimal separator.
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      // 1.234,56 -> 1234.56
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,234.56 -> 1234.56
      s = s.replace(/,/g, '');
    }
  } else if (hasComma) {
    // 1.234,56 -> 1234.56 (also supports 1234,56)
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasDot) {
    const dotCount = (s.match(/\./g) || []).length;
    if (dotCount > 1) {
      // 1.234.567 -> 1234567
      s = s.replace(/\./g, '');
    } else {
      // Single dot: decide if decimal or thousand separator.
      const [intPart, fracPart] = s.split('.');
      if (fracPart && fracPart.length === 3 && intPart && intPart.length <= 3) {
        // 1.234 -> 1234 (likely thousand separator)
        s = `${intPart}${fracPart}`;
      }
      // Otherwise keep dot as decimal separator (e.g., 1234.56).
    }
  }

  // Keep only digits, minus and dot.
  const cleaned = s.replace(/[^\d.-]/g, '');
  if (!cleaned) return null;

  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function formatPtBrNumber(value, { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) {
  const n = typeof value === 'number' ? value : parseLooseNumber(value);
  if (n === null) return value ?? '-';
  return n.toLocaleString('pt-BR', { minimumFractionDigits, maximumFractionDigits });
}

export function formatPtBrCurrency(value, { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) {
  const n = typeof value === 'number' ? value : parseLooseNumber(value);
  if (n === null) return value ?? '-';
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

// Formats percentage values that are already in the 0..100 scale.
export function formatPtBrPercent(value, { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) {
  const n = typeof value === 'number' ? value : parseLooseNumber(value);
  if (n === null) return value ?? '-';
  return `${n.toLocaleString('pt-BR', { minimumFractionDigits, maximumFractionDigits })}%`;
}

