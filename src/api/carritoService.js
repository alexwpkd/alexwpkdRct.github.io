import api from "./api";

export const getCarritoPorCliente = async (idCliente) => {
  const res = await api.get(`/api/carritos/cliente/${idCliente}`);
  return res.data;
};

export const agregarAlCarrito = async (idCliente, productoId, cantidad) => {
  const res = await api.post(
    `/api/carritos/${idCliente}/agregar`,
    null,
    { params: { productoId, cantidad } }
  );
  return res.data;
};

export const actualizarCantidadCarrito = async (idCliente, idDetalle, cantidad) => {
  const res = await api.put(
    `/api/carritos/${idCliente}/actualizar/${idDetalle}`,
    null,
    { params: { cantidad } }
  );
  return res.data;
};

export const eliminarItemCarrito = async (idCliente, idDetalle) => {
  await api.delete(`/api/carritos/${idCliente}/eliminar-item/${idDetalle}`);
};

export const vaciarCarrito = async (idCliente) => {
  await api.delete(`/api/carritos/${idCliente}/vaciar`);
};

export const checkoutCarrito = async (idCliente) => {
  const res = await api.post(`/api/carritos/${idCliente}/checkout`);
  return res.data; // Venta
};
