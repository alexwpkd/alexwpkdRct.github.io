import React from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero.jsx';
// import images from '../assets/images/index.js';

function Carrito({ carrito, eliminarDelCarrito, actualizarCantidad }) {
  // Hero con imagen de fondo y título ARSENAL
  // const heroBg = images['products/product-img-1'] || '';

  if (!carrito || carrito.length === 0) {
    return (
      <>
        <Hero title="ARMAMENTO" />        <div className="container py-5 text-center">
          <h2 className="text-white-custom">Tu carrito está vacío</h2>
          <p className="text-white-custom" style={{fontWeight:'bold', display:'inline'}}>Agrega productos desde la tienda.</p>
          <Link to="/shop" className="btn btn-custom ms-3 text-white-custom" style={{verticalAlign:'middle'}}>Regresar a la tienda</Link>
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
        <h2 className="text-white-custom">Carrito de compras</h2>        <table className="table table-bordered mt-4">          <thead>
            <tr>
              <th className="text-white-custom">Producto</th>
              <th className="text-white-custom">Precio</th>
              <th className="text-white-custom">Cantidad</th>
              <th className="text-white-custom">Subtotal</th>
              <th className="text-white-custom">Acciones</th>
            </tr>
          </thead>
          <tbody>            {carrito.map(item => (
              <tr key={item.id}>
                <td className="text-white-custom">{item.name || item.nombre}</td>
                <td className="text-white-custom">${getPrice(item)}</td>
                <td className="text-white-custom">
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleDecrement(item)}>-</button>
                    <span className="text-white-custom" style={{margin: '0 10px', minWidth: '30px', textAlign: 'center'}}>{item.cantidad}</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleIncrement(item)} disabled={item.cantidad >= getStock(item)}>+</button>
                  </div>
                </td>
                <td className="text-white-custom">${getPrice(item) * item.cantidad}</td>
                <td className="text-white-custom">
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>        <div className="text-right">
          <h4 className="text-white-custom">Subtotal: ${total}</h4>
          <h5 className="text-white-custom">IVA (19%): ${iva}</h5>
          <h4 className="text-white-custom">Total: ${totalConIva}</h4>
          <button className="btn btn-custom mt-3 text-white-custom" onClick={() => alert('¡Compra exitosa!')}>Confirmar compra</button>
        </div>
      </div>
    </>
  );
}

export default Carrito;
