import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Shop from './components/Shop.jsx';
import Login from './components/Login.jsx';
import News from './components/News.jsx';
import Admin from './components/Admin.jsx';
import Product from './components/Product.jsx';
import Carrito from './components/Carrito.jsx';

import api from './utils.js';
import { getAuthInfo } from './utils/auth.js';
import './styles/shots.css';

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const SHIPPING_CONSTANT = 15000;
  const [shippingCost] = useState(SHIPPING_CONSTANT);

  // Cargar carrito del backend SOLO si está logueado
  useEffect(() => {
    loadBackendCart();
  }, []);

  async function loadBackendCart() {
    const { isLoggedIn, idCliente } = getAuthInfo();

    if (!isLoggedIn || !idCliente) {
      console.log('[Carrito] Usuario invitado: se usa carrito solo en memoria');
      return;
    }

    try {
      console.log('[Carrito] Cargando carrito para cliente:', idCliente);
      const carritoResp = await api.get(`/api/carritos/cliente/${idCliente}`);
      const carritoData = carritoResp.data;
      console.log('[Carrito] Carrito backend obtenido:', carritoData);

      if (!carritoData || !carritoData.idCarrito) return;

      const detallesResp = await api.get(
        `/api/detalle-carrito/carrito/${carritoData.idCarrito}`
      );
      const detalles = detallesResp.data || [];

      const mapped = detalles.map(d => ({
        id: d.producto?.idProducto ?? d.producto?.id,
        cantidad: d.cantidad,
        cantidadKey: d.idCarritoDetalle,
        price: d.producto?.precio ?? d.producto?.price ?? 0,
        stock: d.producto?.stock ?? 0,
        name: d.producto?.nombre ?? d.producto?.name ?? '',
        productoObj: d.producto
      }));

      setCarrito(mapped);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        console.log('[Carrito] Cliente no tiene carrito aún, carrito vacío');
        setCarrito([]);
        return;
      }
      console.warn(
        '[Carrito] No se pudo cargar carrito desde backend:',
        err?.response?.data || err.message
      );
    }
  }

  // ✅ Invitado: solo front
  // ✅ Logueado: front + backend
  async function agregarAlCarrito(producto, cantidad = 1) {
    const { isLoggedIn, idCliente } = getAuthInfo();

    // Actualizar carrito local SIEMPRE
    setCarrito(prev => {
      const prodId = producto.id ?? producto.idProducto;
      const existe = prev.find(item => item.id === prodId);
      if (existe) {
        return prev.map(item =>
          item.id === prodId
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, id: prodId, cantidad }];
    });

    // Invitado → NO backend
    if (!isLoggedIn || !idCliente) {
      console.log('[Carrito] Usuario invitado: carrito guardado solo en memoria');
      return;
    }

    // Logueado → sincronizar backend
    try {
      console.log('[Carrito] Sincronizando con backend para cliente:', idCliente);
      const resp = await api.post(`/api/carritos/${idCliente}/agregar`, null, {
        params: { productoId: producto.id ?? producto.idProducto, cantidad }
      });

      const detalle = resp.data;

      setCarrito(prev => {
        const prodId = detalle.producto?.idProducto ?? detalle.producto?.id ?? producto.id;
        const existe = prev.find(item => item.id === prodId);
        if (existe) {
          return prev.map(item =>
            item.id === prodId
              ? {
                  ...item,
                  cantidad: detalle.cantidad,
                  cantidadKey: detalle.idCarritoDetalle
                }
              : item
          );
        }
        return [
          ...prev,
          {
            id: prodId,
            cantidad: detalle.cantidad,
            cantidadKey: detalle.idCarritoDetalle,
            price:
              detalle.producto?.precio ??
              detalle.producto?.price ??
              producto.precio ??
              producto.price ??
              0,
            stock:
              detalle.producto?.stock ??
              producto.stock ??
              producto.enStock ??
              1,
            name:
              detalle.producto?.nombre ??
              producto.nombre ??
              producto.name,
            productoObj: detalle.producto
          }
        ];
      });
    } catch (error) {
      console.warn(
        '[Carrito] No se pudo sincronizar con backend, pero el carrito local sigue funcionando.',
        error
      );
    }
  }

  async function eliminarDelCarrito(id) {
    const { isLoggedIn, idCliente } = getAuthInfo();

    // Local
    setCarrito(prev => prev.filter(item => item.id !== id));

    // Invitado → solo local
    if (!isLoggedIn || !idCliente) {
      console.log('[Carrito] Usuario invitado: item eliminado del carrito local');
      return;
    }

    // Logueado → backend
    try {
      const item = carrito.find(i => i.id === id);
      const detalleId = item?.cantidadKey;
      if (detalleId) {
        await api.delete(`/api/carritos/${idCliente}/eliminar-item/${detalleId}`);
        console.log('[Carrito] Item eliminado del backend');
      }
    } catch (err) {
      console.warn(
        '[Carrito] No se pudo sincronizar eliminación con backend:',
        err?.response?.data || err.message
      );
    }
  }

  async function actualizarCantidad(id, cantidad) {
    const { isLoggedIn, idCliente } = getAuthInfo();

    const item = carrito.find(i => i.id === id);
    const bounded = Math.max(1, Math.min(cantidad, item?.stock || 1));

    // Local
    setCarrito(prev =>
      prev.map(it => (it.id === id ? { ...it, cantidad: bounded } : it))
    );

    // Invitado → solo local
    if (!isLoggedIn || !idCliente) {
      console.log('[Carrito] Usuario invitado: cantidad actualizada solo en memoria');
      return;
    }

    // Logueado → backend
    try {
      const detalleId = item?.cantidadKey;
      if (detalleId) {
        await api.put(`/api/carritos/${idCliente}/actualizar/${detalleId}`, null, {
          params: { cantidad: bounded }
        });
        console.log('[Carrito] Cantidad actualizada en backend');
      }
    } catch (err) {
      console.warn(
        '[Carrito] No se pudo sincronizar actualización con backend:',
        err?.response?.data || err.message
      );
    }
  }

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/shop"
          element={<Shop agregarAlCarrito={agregarAlCarrito} carrito={carrito} />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/product/:id"
          element={<Product agregarAlCarrito={agregarAlCarrito} />}
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
              actualizarCantidad={actualizarCantidad}
              shippingCost={shippingCost}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Carrito
              carrito={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
              actualizarCantidad={actualizarCantidad}
              shippingCost={shippingCost}
            />
          }
        />
        <Route
          path="*"
          element={
            <div className="container text-center py-5">
              <h1>404 - Página no encontrada</h1>
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
