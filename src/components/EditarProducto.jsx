import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const EditarProducto = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    sku: "",
    stock: "",
    categoria: "",
    subcategoria: "",
    descripcion: "",
  });
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/productos/${id}`);
        const p = res.data;
        // soporta diferentes shapes (idProducto vs id, nombre vs name)
        setForm({
          nombre: p.nombre ?? p.name ?? "",
          precio: p.precio ?? p.price ?? "",
          sku: p.sku ?? "",
          stock: p.stock ?? p.cantidad ?? "",
          categoria: p.categoria ?? p.category ?? "",
          subcategoria: p.subcategoria ?? p.subcategory ?? "",
          descripcion: p.descripcion ?? p.description ?? "",
        });
      } catch (err) {
        console.error("Error cargando producto:", err);
        alert("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImagen(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("dto", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (imagen) data.append("imagen", imagen);

      await axios.put(`http://localhost:8080/api/productos/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      alert("Producto actualizado");
      navigate("/productos");
    } catch (err) {
      console.error("Error actualizando:", err);
      alert("No se pudo actualizar el producto.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container py-3">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-2">
          <input className="form-control" type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input className="form-control" type="number" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input className="form-control" type="text" name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <input className="form-control" type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <input className="form-control" type="text" name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <input className="form-control" type="text" name="subcategoria" placeholder="Subcategoría" value={form.subcategoria} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <textarea className="form-control" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange}></textarea>
        </div>
        <div className="mb-3">
          <input className="form-control" type="file" name="imagen" onChange={handleFileChange} />
        </div>

        <button className="btn btn-primary" disabled={loading} type="submit">{loading ? "Guardando..." : "Guardar cambios"}</button>
      </form>
    </div>
  );
};

export default EditarProducto;
