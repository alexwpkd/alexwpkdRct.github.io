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
        // Calcular posición manual para mejor control
        const elementRect = el.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;
        const targetPosition = currentScrollY + elementRect.top - 80; // 80px de margen superior para mejor posicionamiento
        
        // Usar scroll suave personalizado en lugar de scrollIntoView
        smoothScrollTo(targetPosition, duration);
        return;
      }
    }

    // fallback: scroll más suave y controlado
    const scrollDistance = window.innerHeight * 0.6; // Reducido a 60% para menos desplazamiento
    const startPosition = window.pageYOffset;
    const targetPosition = startPosition + scrollDistance;
    
    // Scroll suave personalizado
    smoothScrollTo(targetPosition, duration);
  }

  function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Asegurar que la duración sea suficiente para un scroll suave
    const actualDuration = Math.max(duration, 800);

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / actualDuration, 1);
      
      // Función de easing más suave (ease-in-out-quart)
      const easeInOutQuart = progress => 
        progress < 0.5 
          ? 8 * progress * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;
      
      const easedProgress = easeInOutQuart(progress);
      const currentPosition = startPosition + distance * easedProgress;
      
      window.scrollTo({
        top: currentPosition,
        behavior: 'auto' // Usar 'auto' para evitar conflictos con nuestro scroll personalizado
      });
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
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
      aria-label="Sigue navegando - Desplazar hacia abajo"
      onClick={handleClick}
      onKeyDown={handleKey}
    >
      <span className="scroll-button-text">Sigue navegando</span>
      <span className="scroll-button-arrow" aria-hidden="true"> ↓</span>
    </button>
  );
}
