import { useEffect, useState } from "react";
import { getProductos } from "../api/productoService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar productos");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Catálogo Alpha Squad</h2>
        <div>
          {auth.user && <span>Usuario: {auth.user.correo || "Sin correo"}</span>}
          <button onClick={() => navigate("/carrito")} style={{ marginLeft: "10px" }}>
            Ver carrito
          </button>
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </div>
      </header>

      <ul>
        {productos.map((p) => (
          <li key={p.idProducto}>
            <strong>{p.nombre}</strong> - ${p.precio} - Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosPage;
