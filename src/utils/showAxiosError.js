// src/utils/showAxiosError.js
import { emitToast } from './toast.js';

export function showAxiosError(prefix, error) {
  console.error(prefix, error);

  if (error && error.response) {
    console.log('⚠️ Respuesta backend:', error.response.data);
    try {
      const text = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      emitToast(prefix + ' → ' + text, 'error');
    } catch (e) {
      emitToast(prefix + ' → (error al serializar respuesta)', 'error');
    }
  } else if (error && error.request) {
    console.log('⚠️ Sin respuesta del backend:', error.request);
    emitToast(prefix + ' → No hubo respuesta del servidor.', 'error');
  } else {
    emitToast(prefix + ' → ' + (error && error.message ? error.message : String(error)), 'error');
  }
}
