import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, logoutRequest } from "../api/authService";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    rol: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setAuth({
        token,
        rol,
        user: JSON.parse(userData),
        loading: false,
      });
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (correo, password) => {
    const data = await loginRequest(correo, password);
    setAuth({
      token: data.token || null,
      rol: data.rol || null,
      user: data,
      loading: false,
    });
  };

  const logout = () => {
    logoutRequest();
    setAuth({
      token: null,
      rol: null,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
