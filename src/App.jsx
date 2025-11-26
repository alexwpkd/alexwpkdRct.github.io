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
import ProductList from './components/ProductList.jsx';
import CrearProducto from './components/CrearProducto.jsx';
import EditarProducto from './components/EditarProducto.jsx';
import React, { useState } from 'react';
import "./styles/shots.css";

export default function App() {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        const nuevaCantidad = Math.min(existe.cantidad + cantidad, producto.stock || producto.enStock || 1);
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
        );
      }
      return [...prev, { ...producto, cantidad: Math.min(cantidad, producto.stock || producto.enStock || 1) }];
    });
  }

  function eliminarDelCarrito(id) {
    setCarrito(prev => prev.filter(item => item.id !== id));
  }

  function actualizarCantidad(id, cantidad) {
    setCarrito(prev => prev.map(item =>
      item.id === id ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock || item.enStock || 1)) } : item
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
  <Route path="/productos" element={<ProductList />} />
  <Route path="/productos/crear" element={<CrearProducto />} />
  <Route path="/crear" element={<CrearProducto />} />
  <Route path="/productos/editar/:id" element={<EditarProducto />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} actualizarCantidad={actualizarCantidad} />} />
        <Route path="/cart" element={<Carrito carrito={carrito} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} actualizarCantidad={actualizarCantidad} />} />
        <Route path="*" element={<div className="container text-center py-5"><h1>404 - Página no encontrada</h1></div>} />
      </Routes>
      <Footer />
    </div>
  )
}