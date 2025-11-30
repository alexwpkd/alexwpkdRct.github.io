import { useEffect, useState } from "react";
import {
  getCarritoPorCliente,
  eliminarItemCarrito,
  vaciarCarrito,
  checkoutCarrito,
  actualizarCantidadCarrito,
} from "../api/carritoService";
import { useAuth } from "../context/AuthContext";
import Carrito from "../components/Carrito";

const CarritoPage = () => {
  const { auth } = useAuth();
  const [carritoBack, setCarritoBack] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ID de cliente provisto por el backend en el login
  const idCliente = auth?.user?.idCliente ?? null;

  const cargarCarrito = async () => {
    if (!idCliente) {
      setError("No se encontró idCliente en el usuario autenticado.");
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      const data = await getCarritoPorCliente(idCliente);
      setCarritoBack(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar carrito");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEliminarDelCarrito = async (idDetalleCarrito) => {
    try {
      await eliminarItemCarrito(idCliente, idDetalleCarrito);
      await cargarCarrito();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar ítem");
    }
  };

  const handleActualizarCantidad = async (idDetalleCarrito, cantidad) => {
    try {
      await actualizarCantidadCarrito(idCliente, idDetalleCarrito, cantidad);
      await cargarCarrito();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar cantidad");
    }
  };

  const handleVaciar = async () => {
    try {
      await vaciarCarrito(idCliente);
      await cargarCarrito();
    } catch (err) {
      console.error(err);
      setError("Error al vaciar carrito");
    }
  };

  const handleCheckout = async () => {
    try {
      const venta = await checkoutCarrito(idCliente);
      alert("Checkout exitoso. ID Venta: " + venta.idVenta);
      await cargarCarrito();
    } catch (err) {
      console.error(err);
      setError("Error al hacer checkout");
    }
  };

  if (cargando) return <p>Cargando carrito...</p>;
  if (error) return <p>{error}</p>;

  // Mapeamos el carrito del backend al formato que espera <Carrito />
  const itemsUi =
    carritoBack?.detalles?.map((d) => ({
      id: d.idDetalleCarrito,
      nombre: d.producto?.nombre,
      precio: d.producto?.precio,
      price: d.producto?.precio,
      cantidad: d.cantidad,
      stock: d.producto?.stock ?? 1,
    })) || [];

  return (
    <Carrito
      carrito={itemsUi}
      eliminarDelCarrito={handleEliminarDelCarrito}
      actualizarCantidad={handleActualizarCantidad}
      vaciarCarrito={handleVaciar}
      checkout={handleCheckout}
    />
  );
};

export default CarritoPage;
