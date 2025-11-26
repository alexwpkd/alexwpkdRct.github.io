import React, { useState } from "react";
import axios from "../utils/axiosConfig";

const CrearProducto = () => {

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    sku: "",
    stock: "",
    categoria: "",
    subcategoria: "",
    descripcion: ""
  });

  const [imagen, setImagen] = useState(null);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleFile = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // JWT

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("precio", form.precio);
    formData.append("sku", form.sku);
    formData.append("stock", form.stock);
    formData.append("categoria", form.categoria);
    formData.append("subcategoria", form.subcategoria);
    formData.append("descripcion", form.descripcion);

    if (imagen) formData.append("imagen", imagen);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/productos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      alert("Producto creado correctamente");
      console.log(response.data);

    } catch (error) {
      console.error(error);
      alert("Error al crear producto");
    }
  };

  return (
    <div>
      <h2>Crear Producto</h2>

      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required /><br />
        <input name="precio" type="number" placeholder="Precio" onChange={handleChange} required /><br />
        <input name="sku" placeholder="SKU" onChange={handleChange} required /><br />
        <input name="stock" type="number" placeholder="Stock" onChange={handleChange} required /><br />
        <input name="categoria" placeholder="Categoría" onChange={handleChange} required /><br />
        <input name="subcategoria" placeholder="Subcategoría" onChange={handleChange} required /><br />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} required /><br />

        <input type="file" onChange={handleFile} accept="image/*" /><br /><br />

        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default CrearProducto;
