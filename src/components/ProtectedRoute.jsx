import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { auth } = useAuth();

  if (auth.loading) return <p>Cargando...</p>;

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const rolUsuario = auth.rol || auth.user?.rol;
    if (!rolUsuario || !roles.includes(rolUsuario)) {
      return <p>No tienes permisos para ver esta página.</p>;
    }
  }

  return children;
};

export default ProtectedRoute;
