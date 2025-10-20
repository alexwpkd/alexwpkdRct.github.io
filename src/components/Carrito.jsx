import React from 'react';
import Hero from './Hero.jsx';
// import images from '../assets/images/index.js';

function Carrito({ carrito, eliminarDelCarrito, actualizarCantidad }) {
  // Hero con imagen de fondo y título ARSENAL
  // const heroBg = images['products/product-img-1'] || '';

  if (!carrito || carrito.length === 0) {
    return (
      <>
        <Hero title="ARMAMENTO" />
        <div className="container py-5 text-center">
          <h2 style={{color:'#737373'}}>Tu carrito está vacío</h2>
          <p style={{color:'#737373', fontWeight:'bold', display:'inline'}}>Agrega productos desde la tienda.</p>
          <a href="/shop" className="btn btn-custom ms-3" style={{verticalAlign:'middle'}}>Ir a tienda</a>
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
              <th style={{color:'#737373'}}>Producto</th>
              <th style={{color:'#737373'}}>Precio</th>
              <th style={{color:'#737373'}}>Cantidad</th>
              <th style={{color:'#737373'}}>Subtotal</th>
              <th style={{color:'#737373'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map(item => (
              <tr key={item.id}>
                <td style={{color:'#737373'}}>{item.name || item.nombre}</td>
                <td style={{color:'#737373'}}>${getPrice(item)}</td>
                <td style={{color:'#737373'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleDecrement(item)}>-</button>
                    <span style={{margin: '0 10px', minWidth: '30px', textAlign: 'center'}}>{item.cantidad}</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleIncrement(item)} disabled={item.cantidad >= getStock(item)}>+</button>
                  </div>
                </td>
                <td style={{color:'#737373'}}>${getPrice(item) * item.cantidad}</td>
                <td style={{color:'#737373'}}>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right">
          <h4 style={{color:'#737373'}}>Subtotal: ${total}</h4>
          <h5 style={{color:'#737373'}}>IVA (19%): ${iva}</h5>
          <h4 style={{color:'#737373'}}>Total: ${totalConIva}</h4>
          <button className="btn btn-custom mt-3" onClick={() => alert('¡Compra exitosa!')}>Confirmar compra</button>
        </div>
      </div>
    </>
  );
}

export default Carrito;
