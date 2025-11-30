import api from "./api";

export const getProductos = async () => {
  const res = await api.get("/api/productos");
  return res.data;
};

export const getProductoPorId = async (id) => {
  const res = await api.get(`/api/productos/${id}`);
  return res.data;
};

export const getProductosPorCategoria = async (categoria) => {
  const res = await api.get(`/api/productos/categoria/${categoria}`);
  return res.data;
};

export const getProductosPorSubcategoria = async (subcategoria) => {
  const res = await api.get(`/api/productos/subcategoria/${subcategoria}`);
  return res.data;
};

// Crear producto con imagen (ADMIN/EMPLEADO)
export const crearProductoConImagen = async (dto, file) => {
  const formData = new FormData();
  formData.append("dto", JSON.stringify(dto));
  if (file) {
    formData.append("imagen", file);
  }

  const res = await api.post("/api/productos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
