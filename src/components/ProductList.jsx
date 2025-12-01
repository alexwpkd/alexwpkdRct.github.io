import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/productos/${id}`);
      // refrescar lista
      setProductos((prev) => prev.filter((p) => p.idProducto !== id && p.id !== id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar el producto. Revisa la consola.");
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Productos</h2>
        <div>
          <Link to="/productos/crear" className="btn btn-primary">Crear Producto</Link>
        </div>
      </div>

      {productos.length === 0 ? (
        <p>No hay productos.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>SKU / ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.idProducto ?? p.id}>
                <td>{p.sku ?? "-"} / {p.idProducto ?? p.id}</td>
                <td>{p.nombre ?? p.name}</td>
                <td>{p.precio ?? p.price ?? "-"}</td>
                <td>{p.stock ?? (p.inStock ? "Sí" : "No")}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => navigate(`/productos/editar/${p.idProducto ?? p.id}`)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.idProducto ?? p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
