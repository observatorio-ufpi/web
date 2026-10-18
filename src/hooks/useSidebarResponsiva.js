import { useEffect } from 'react';

const LARGURA_DESKTOP = 768; // breakpoint md

// Abre a sidebar em telas largas e fecha em telas estreitas — mas só quando a tela
// CRUZA esse limite (ex.: girar o celular, redimensionar a janela no computador).
//
// Antes, qualquer evento "resize" refazia a regra. No Android, abrir o teclado ao
// tocar num filtro diminui a ALTURA da tela e dispara "resize": a sidebar fechava
// sozinha e a lista de opções aberta ia junto para fora da tela (só o final aparecia).
// Também evitava que quem fechou a sidebar no computador a visse reabrir sozinha.
const useSidebarResponsiva = (setIsOpen) => {
  useEffect(() => {
    let eraDesktop = window.innerWidth >= LARGURA_DESKTOP;
    setIsOpen(eraDesktop);

    const handleResize = () => {
      const ehDesktop = window.innerWidth >= LARGURA_DESKTOP;
      if (ehDesktop !== eraDesktop) {
        eraDesktop = ehDesktop;
        setIsOpen(ehDesktop);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);
};

export default useSidebarResponsiva;
