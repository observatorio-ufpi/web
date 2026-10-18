// "Vistos recentemente": os últimos perfis de município abertos, guardados só no
// navegador de quem usa (localStorage). Sem acesso (aba anônima, bloqueio), a
// lista simplesmente fica vazia.

const CHAVE = 'opepi:municipiosRecentes';
const MAXIMO = 6;

export const lerRecentes = () => {
  try {
    const lista = JSON.parse(window.localStorage.getItem(CHAVE) || '[]');
    return Array.isArray(lista) ? lista.filter((c) => typeof c === 'string') : [];
  } catch {
    return [];
  }
};

export const registrarRecente = (codigo) => {
  try {
    const lista = [codigo, ...lerRecentes().filter((c) => c !== codigo)].slice(0, MAXIMO);
    window.localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    // sem localStorage: ignora
  }
};

export const limparRecentes = () => {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    // sem localStorage: ignora
  }
};
