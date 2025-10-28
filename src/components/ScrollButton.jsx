import React, { useState } from 'react';

export default function ScrollButton({ targetSelector = null, playShots = false, duration = 600, className = '', style = {} }) {
  const [cooldown, setCooldown] = useState(false);

  function triggerShots() {
    // Event-based hook for future animations
    window.dispatchEvent(new CustomEvent('play-shots'));
  }

  function handleClick() {
    if (cooldown) return;
    setCooldown(true);
    // small cooldown to avoid repeated clicks
    setTimeout(() => setCooldown(false), 800);

    if (playShots) triggerShots();

    if (targetSelector) {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // fallback: scroll one viewport height down
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  // Añadimos las clases 'btn btn-custom' para que el botón herede el estilo de los botones del Hero
  const combinedClass = [`btn`, `btn-custom`, 'scroll-button', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={combinedClass}
      style={style}
      aria-label="Conoce más - Desplazar hacia abajo"
      onClick={handleClick}
      onKeyDown={handleKey}
    >
      <span className="scroll-button-text">Conoce más</span>
      <span className="scroll-button-arrow" aria-hidden>↓</span>
    </button>
  );
}
