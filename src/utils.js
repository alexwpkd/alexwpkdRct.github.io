import axios from 'axios';
import images from './assets/images/index.js';

// 👇 AHORA tu app apunta por defecto a la IP de la instancia EC2
// Si quieres sobreescribirlo en el futuro, crea un .env con VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || 'http://18.213.2.146:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛡️ Interceptor: adjunta automáticamente el JWT a TODAS las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ← usamos SIEMPRE la misma key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Útil si quieres headers manuales en algún caso puntual
export function getAuthHeaders() {
  const token = localStorage.getItem('token'); // unificado con el interceptor
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default api;

// log útil en desarrollo para saber qué backend está apuntando la app
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info('[api] API_BASE =', API_BASE);
}

/**
 * Resolver claves de imagen que pueden venir del backend.
 * Soporta:
 * - URLs absolutas (http(s)://...)
 * - claves que coinciden con las claves del mapa generado por `src/assets/images/index.js`
 * - claves sin prefijo de carpeta (intentará añadir `products/`)
 * - claves con o sin extensión (.jpg, .png, ...)
 */
export function resolveImage(clave) {
  if (!clave) return '';
  if (typeof clave !== 'string') return '';

  // Si es una URL absoluta, devolver tal cual
  if (/^https?:\/\//i.test(clave)) return clave;

  const tryKeys = new Set();

  const raw = clave.trim();
  tryKeys.add(raw);

  // quitar ./ o prefijo / si existe
  tryKeys.add(raw.replace(/^\.\//, '').replace(/^\//, ''));

  // sin extensión
  tryKeys.add(raw.replace(/\.[^/.]+$/, ''));

  // con carpeta products/ si no la tiene
  if (!/\//.test(raw)) {
    tryKeys.add(`products/${raw}`);
    tryKeys.add(`products/${raw.replace(/\.[^/.]+$/, '')}`);
  } else if (!raw.startsWith('products/')) {
    // si tiene subcarpeta diferente, también intentar con products/
    const nameNoExt = raw.replace(/\.[^/.]+$/, '');
    tryKeys.add(`products/${nameNoExt}`);
  }

  // probar cada key contra el mapa images
  for (const k of tryKeys) {
    if (k && images[k]) return images[k];
  }

  return '';
}

/**
 * Valida un RUT chileno
 * @param {string} rut - RUT a validar (formato: XX.XXX.XXX-X)
 * @returns {boolean} - true si el RUT es válido, false si no
 */
export function validarRUT(rut) {
  if (typeof rut !== 'string') {
    throw new TypeError('rut debe ser un string');
  }

  // Eliminar puntos y guión
  const rutLimpio = rut.replace(/\./g, '').replace('-', '');

  // Verificar que tenga al menos 8 caracteres (7 números + 1 dígito verificador)
  if (rutLimpio.length < 8) {
    return false;
  }

  // Separar número y dígito verificador
  const numero = rutLimpio.slice(0, -1);
  const digitoVerificador = rutLimpio.slice(-1).toLowerCase();

  // Verificar que el número contenga solo dígitos
  if (!/^\d+$/.test(numero)) {
    return false;
  }

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const digitoCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();

  return digitoVerificador === digitoCalculado;
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido, false si no
 */
export function validarEmail(email) {
  if (typeof email !== 'string') {
    throw new TypeError('email debe ser un string');
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si la contraseña es segura, false si no
 */
export function validarPassword(password) {
  if (typeof password !== 'string') {
    throw new TypeError('password debe ser un string');
  }

  // La contraseña debe tener al menos 6 caracteres
  if (password.length < 6) {
    return false;
  }

  // Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero = /\d/.test(password);
  const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial;
}

/**
 * Valida un formulario completo
 * @param {Object} datos - Objeto con los datos del formulario
 * @returns {boolean} - true si todos los datos son válidos, false si no
 */
export function validarFormulario(datos) {
  if (typeof datos !== 'object' || datos === null) {
    throw new TypeError('datos debe ser un objeto con nombre, email y password');
  }

  // Verificar que no hay campos vacíos
  if (!datos.nombre || !datos.email || !datos.password) {
    return false;
  }

  // Verificar que el nombre no esté vacío después de eliminar espacios
  if (datos.nombre.trim() === '') {
    return false;
  }

  // Validar email
  if (!validarEmail(datos.email)) {
    return false;
  }

  // Validar contraseña
  if (!validarPassword(datos.password)) {
    return false;
  }

  return true;
}

/**
 * Autentica un usuario (dummy local)
 * @param {string} usuario - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {boolean} - true si las credenciales son correctas, false si no
 */
export function loginUsuario(usuario, password) {
  if (typeof usuario !== 'string' || typeof password !== 'string') {
    throw new TypeError('usuario y password deben ser strings');
  }
  return usuario === 'usuario' && password === '1234';
}
