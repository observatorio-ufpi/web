import React, { useEffect, useRef, useState } from 'react';

// Número que conta de 0 até o valor quando aparece na tela (faixa de números da home).
// Quem pediu menos movimento no sistema vê o valor final direto.
// prefixo: ex. "+" para "+80"
const NumeroAnimado = ({ valor, duracao = 1200, prefixo = '' }) => {
  const [atual, setAtual] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const semMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento || typeof IntersectionObserver === 'undefined') {
      setAtual(valor);
      return undefined;
    }
    let quadro;
    const animar = () => {
      const inicio = performance.now();
      const passo = (agora) => {
        const t = Math.min((agora - inicio) / duracao, 1);
        setAtual(Math.round(valor * (1 - Math.pow(1 - t, 3)))); // desacelera no fim
        if (t < 1) quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    };
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          animar();
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor, duracao]);

  return (
    <span ref={ref} aria-label={`${prefixo}${valor}`}>
      {prefixo}
      {atual.toLocaleString('pt-BR')}
    </span>
  );
};

export default NumeroAnimado;
