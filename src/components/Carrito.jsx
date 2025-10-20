import React from 'react';
import Hero from './Hero.jsx';
import images from '../assets/images/index.js';

function Carrito({ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad }) {
  // Hero con imagen de fondo y título ARSENAL
  const heroBg = images['products/product-img-1'] || '';

  if (!carrito || carrito.length === 0) {
    return (
      <>
        <Hero title="ARMAMENTO" />
        <div className="container py-5 text-center">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde la tienda.</p>
        </div>
      </>
    );
  }

  // Normaliza datos para evitar NaN
  const getPrice = item => Number(item.price ?? item.precio ?? 0);
  const getStock = item => Number(item.stock ?? item.enStock ?? 1);

  const total = carrito.reduce((acc, item) => acc + getPrice(item) * item.cantidad, 0);
  const iva = Math.round(total * 0.19);
  const totalConIva = total + iva;

  // Incrementador de cantidad
  const handleIncrement = (item) => {
    if (item.cantidad < getStock(item)) {
      actualizarCantidad(item.id, item.cantidad + 1);
    }
  };
  const handleDecrement = (item) => {
    if (item.cantidad > 1) {
      actualizarCantidad(item.id, item.cantidad - 1);
    }
  };

  return (
    <>
      <Hero title="ARSENAL" />
      <div className="container py-5">
        <h2>Carrito de compras</h2>
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map(item => (
              <tr key={item.id}>
                <td>{item.name || item.nombre}</td>
                <td>${getPrice(item)}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleDecrement(item)}>-</button>
                    <span style={{margin: '0 10px', minWidth: '30px', textAlign: 'center'}}>{item.cantidad}</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleIncrement(item)} disabled={item.cantidad >= getStock(item)}>+</button>
                  </div>
                </td>
                <td>${getPrice(item) * item.cantidad}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right">
          <h4>Subtotal: ${total}</h4>
          <h5>IVA (19%): ${iva}</h5>
          <h4>Total con IVA: ${totalConIva}</h4>
        </div>
      </div>
    </>
  );
}

export default Carrito;
