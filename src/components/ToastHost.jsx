// src/components/ToastHost.jsx
import React, { useEffect, useState } from 'react';
import { TOAST_EVENT } from '../utils/toast.js';

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const t = e.detail;
      setToasts((prev) => [...prev, t]);
      const timeout = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.duration || 2500);
      return () => clearTimeout(timeout);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  const bgClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning text-dark';
      default:
        return 'bg-dark';
    }
  };

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-host-item text-white ${bgClass(t.type)}`}
          style={{ minWidth: 240, maxWidth: 420, borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
