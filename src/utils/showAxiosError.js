// src/utils/showAxiosError.js
export function showAxiosError(prefix, error) {
  console.error(prefix, error);

  if (error && error.response) {
    console.log('⚠️ Respuesta backend:', error.response.data);
    try {
      const text = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      alert(prefix + ' → ' + text);
    } catch (e) {
      alert(prefix + ' → (error al serializar respuesta)');
    }
  } else if (error && error.request) {
    console.log('⚠️ Sin respuesta del backend:', error.request);
    alert(prefix + ' → No hubo respuesta del servidor.');
  } else {
    alert(prefix + ' → ' + (error && error.message ? error.message : String(error)));
  }
}
