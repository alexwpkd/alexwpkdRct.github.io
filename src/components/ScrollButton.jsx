import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function ComicOverlay() {
  return (
    <div className="shotsOverlay" aria-hidden="true">
      <div className="bangGroup">
        <div className="bang" style={{ "--d": "0ms" }}>BANG!</div>
        <div className="bang second" style={{ "--d": "220ms" }}>BANG!</div>
      </div>
    </div>
  );
}

export default function ScrollButton({ targetSelector = null, playShots = false, duration = 600, className = '', style = {}, mode = 'default' }) {
  const [cooldown, setCooldown] = useState(false);
  const [fx, setFx] = useState(false);

  function triggerShots() {
    // Evento: animaciones
    window.dispatchEvent(new CustomEvent('play-shots'));
  }

  function handleClick() {
    if (cooldown) return;
    setCooldown(true);
  // Pequeño cooldown
    setTimeout(() => setCooldown(false), 800);

    // Si es Home, mostrar FX
    if (mode === 'home') {
      setFx(true);
      // Ocultar FX
      setTimeout(() => setFx(false), 900);
    }

    if (playShots || mode === 'home') triggerShots();

    if (targetSelector) {
      const el = document.querySelector(targetSelector);
      if (el) {
        // Calcular posición
        const elementRect = el.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;
        const targetPosition = currentScrollY + elementRect.top - 80; // 80px de margen superior para mejor posicionamiento
        
        // Scroll suave personalizado
        smoothScrollTo(targetPosition, duration);
        return;
      }
    }

    // Alternativa: scroll suave
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

  // Clases del botón
  const combinedClass = [`btn`, `btn-custom`, 'scroll-button', className].filter(Boolean).join(' ');

  return (
    <>
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

    {/* FX solo en Home; montar en body (evita stacking context) */}
    {mode === 'home' && fx && typeof document !== 'undefined' && createPortal(<ComicOverlay />, document.body)}
    </>
  );
}
