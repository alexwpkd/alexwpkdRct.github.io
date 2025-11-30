import api from "./api";

export const loginRequest = async (correo, password) => {
  const response = await api.post("/auth/login", { correo, password });
  const data = response.data;

  // Ajusta 'token' y 'rol' a tu DTO real si tienen otros nombres
  if (!data.token) {
    console.warn("La respuesta de login no contiene 'token'. Ajusta authService.");
  }

  // Guarda en localStorage
  localStorage.setItem("token", data.token || "");
  localStorage.setItem("rol", data.rol || "");
  localStorage.setItem("userData", JSON.stringify(data));

  return data;
};

export const logoutRequest = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("userData");
};

export const registrarClienteRequest = async (cliente) => {
  const response = await api.post("/auth/registro/cliente", cliente);
  return response.data;
};
