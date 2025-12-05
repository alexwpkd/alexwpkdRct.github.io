// src/App.jsx
import { Routes, Route } from 'react-router-dom'
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
import React, { useState, useEffect } from 'react';
import api from './utils.js';
import "./styles/shots.css";

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const SHIPPING_CONSTANT = 15000;
  const [shippingCost] = useState(SHIPPING_CONSTANT);

  // Si el usuario está autenticado y es cliente, sincronizamos con backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');

    const loadBackendCart = async () => {
      if (!token || !idCliente) return;
      try {
        // Obtener carrito por cliente
        const carritoResp = await api.get(`/api/carritos/cliente/${idCliente}`);
        const carritoData = carritoResp.data;
        if (!carritoData || !carritoData.idCarrito) return;

        // Obtener detalle del carrito
        const detallesResp = await api.get(`/api/detalle-carrito/carrito/${carritoData.idCarrito}`);
        const detalles = detallesResp.data || [];

        // Mapear a la forma que usan los componentes: id = producto.idProducto, cantidad, price, stock, name, detalleId
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
        // Si el backend responde 404 significa que el cliente aún no tiene carrito: tratar como vacío
        const status = err?.response?.status;
        if (status === 404) {
          // carrito vacío
          setCarrito([]);
          return;
        }
        console.warn('No se pudo cargar carrito desde backend:', err);
      }
    };

    loadBackendCart();
  }, []);

  async function agregarAlCarrito(producto, cantidad = 1) {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');
    

    // Si hay sesión de cliente, intentar backend
    if (token && idCliente) {
      try {
        const resp = await api.post(`/api/carritos/${idCliente}/agregar`, null, {
          params: { productoId: producto.id ?? producto.idProducto, cantidad }
        });

        const detalle = resp.data; // DetalleCarrito creado
        // Agregar/actualizar en estado local usando el detalle
        setCarrito(prev => {
          const prodId = detalle.producto?.idProducto ?? detalle.producto?.id ?? producto.id;
          const existe = prev.find(item => item.id === prodId);
          if (existe) {
            return prev.map(item => item.id === prodId ? { ...item, cantidad: detalle.cantidad, cantidadKey: detalle.idCarritoDetalle } : item);
          }
          return [...prev, {
            id: prodId,
            cantidad: detalle.cantidad,
            cantidadKey: detalle.idCarritoDetalle,
            price: detalle.producto?.precio ?? detalle.producto?.price ?? producto.precio ?? producto.price ?? 0,
            stock: detalle.producto?.stock ?? producto.stock ?? producto.enStock ?? 1,
            name: detalle.producto?.nombre ?? producto.nombre ?? producto.name,
            productoObj: detalle.producto
          }];
        });
        return;
      } catch (err) {
        console.warn('No se pudo agregar al carrito en backend, usando fallback local', err);
      }
    }

    // Fallback local (sin backend)
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        const nuevaCantidad = Math.min(existe.cantidad + cantidad, producto.stock || producto.enStock || 1);
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
        );
      }
      const next = [...prev, { ...producto, cantidad: Math.min(cantidad, producto.stock || producto.enStock || 1) }];
      // shippingCost is a fixed constant (SHIPPING_CONSTANT)
      return next;
    });
  }

  async function eliminarDelCarrito(id) {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');
    

    // Si hay sesión, buscar detalleId en el carrito y llamar al backend
    if (token && idCliente) {
      try {
        const item = carrito.find(i => i.id === id);
        const detalleId = item?.cantidadKey;
        if (detalleId) {
          await api.delete(`/api/carritos/${idCliente}/eliminar-item/${detalleId}`);
        }
        // actualizar estado local
        setCarrito(prev => prev.filter(item => item.id !== id));
        // shippingCost is constant; no need to clear it when carrito queda vacío
        setTimeout(() => { setCarrito(prev => prev); }, 50);
        return;
      } catch (err) {
        console.warn('No se pudo eliminar item en backend, usando fallback local', err);
      }
    }

    // Fallback local
    setCarrito(prev => {
      const next = prev.filter(item => item.id !== id);
      // shippingCost is constant; do not clear
      return next;
    });
  }

  async function actualizarCantidad(id, cantidad) {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');
    

    const bounded = Math.max(1, Math.min(cantidad, (carrito.find(i => i.id === id)?.stock || 1)));

    if (token && idCliente) {
      try {
        const item = carrito.find(i => i.id === id);
        const detalleId = item?.cantidadKey;
        if (detalleId) {
          const resp = await api.put(`/api/carritos/${idCliente}/actualizar/${detalleId}`, null, {
            params: { cantidad: bounded }
          });
          const actualizado = resp.data;
          // actualizar estado local
          setCarrito(prev => prev.map(it => it.id === id ? { ...it, cantidad: actualizado.cantidad } : it));
          return;
        }
      } catch (err) {
        console.warn('No se pudo actualizar cantidad en backend, usando fallback local', err);
      }
    }

    // Fallback local
    setCarrito(prev => prev.map(item =>
      item.id === id ? { ...item, cantidad: bounded } : item
    ));
  }

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/shop" element={<Shop agregarAlCarrito={agregarAlCarrito} carrito={carrito} />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<Admin/>} />
  <Route path="/product/:id" element={<Product agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} actualizarCantidad={actualizarCantidad} shippingCost={shippingCost} />} />
        <Route path="/cart" element={<Carrito carrito={carrito} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} actualizarCantidad={actualizarCantidad} shippingCost={shippingCost} />} />
        <Route path="*" element={<div className="container text-center py-5"><h1>404 - Página no encontrada</h1></div>} />
      </Routes>
      <Footer />
    </div>
  )
}