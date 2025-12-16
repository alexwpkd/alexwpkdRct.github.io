// src/utils/toast.js
export const TOAST_EVENT = 'app:toast';

export function emitToast(message, type = 'info', duration = 2500) {
  try {
    const detail = {
      id: Date.now() + Math.random(),
      message,
      type,
      duration,
    };
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
  } catch (e) {
    console.log('[toast] ', type, message);
  }
}
