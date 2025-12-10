// src/utils/auth.js

export function getAuthInfo() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('userRole') || localStorage.getItem('rol');
  // Soportar distintos nombres de clave que pueda devolver el backend
  const idRaw = localStorage.getItem('idCliente')
    || localStorage.getItem('id')
    || localStorage.getItem('idUsuario');

  const isClient = rol && rol.toUpperCase() === 'CLIENTE';

  return {
    isLoggedIn: !!token,
    rol,
    idCliente: isClient && idRaw ? Number(idRaw) : null,
  };
}

export function getLoggedClientId() {
  const rol = localStorage.getItem('userRole') || localStorage.getItem('rol');
  const idCliente = localStorage.getItem('idCliente');

  if (rol === 'CLIENTE' || rol === 'cliente') {
    return idCliente;
  }
  return null;
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getUserRole() {
  return localStorage.getItem('userRole') || localStorage.getItem('rol');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('rol');
  localStorage.removeItem('idCliente');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  try {
    sessionStorage.removeItem('authenticated');
  } catch (e) {
    // no crítico
  }
}
