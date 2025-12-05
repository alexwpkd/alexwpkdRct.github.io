import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from './Hero.jsx';
import ScrollButton from './ScrollButton.jsx';
// import images from '../assets/images/index.js';

function Carrito({ carrito, eliminarDelCarrito, actualizarCantidad, shippingCost }) {
  const navigate = useNavigate();
  const [envioData, setEnvioData] = useState({ direccionEntrega: '', ciudad: '', comuna: '', costoEnvio: '' });
  const [comunas, setComunas] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
    axios.get(`${API_BASE}/api/comunas`).then(r => {
      setComunas(r.data || []);
    }).catch(() => {
      setComunas([]);
    });
  }, []);
  // Hero con imagen de fondo y título ARSENAL
  // const heroBg = images['products/product-img-1'] || '';

  if (!carrito || carrito.length === 0) {
    return (
      <>
        <Hero title="ARMAMENTO" />
        
        {/* Botón de scroll suave */}
        <div className="text-center" style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
          <ScrollButton targetSelector=".container.py-5" playShots={false} />
        </div>
        
        <div className="container py-5 text-center">
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
  const shipping = Number(shippingCost || envioData.costoEnvio || 0);

  // Distribuir shipping proporcionalmente entre items para sumar a cada subtotal
  const itemSubtotals = carrito.map(item => {
    const itemBase = getPrice(item) * item.cantidad;
    const proportion = total > 0 ? itemBase / total : 0;
    const itemShipping = Math.round(shipping * proportion);
    return { id: item.id, base: itemBase, shipping: itemShipping, total: itemBase + itemShipping };
  });

  const totalShippingAllocated = itemSubtotals.reduce((s, it) => s + it.shipping, 0);
  // Fix rounding difference by adjusting the first item
  if (shipping > 0 && totalShippingAllocated !== shipping && itemSubtotals.length > 0) {
    const diff = shipping - totalShippingAllocated;
    itemSubtotals[0].shipping += diff;
    itemSubtotals[0].total += diff;
  }

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
      
      {/* Botón de scroll suave */}
      <div className="text-center" style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
        <ScrollButton targetSelector=".container.py-5" playShots={false} />
      </div>
      
        <div className="container py-5">
        <h2 className="text-white-custom">Carrito de compras</h2>
        <table className="table table-bordered mt-4">
          <thead>
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
                <td className="text-white-custom">${(() => {
                  const it = itemSubtotals.find(s => s.id === item.id);
                  return it ? it.total : (getPrice(item) * item.cantidad);
                })()}</td>
                <td className="text-white-custom">
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sección de envío (mantener estilo y colocación) */}
        <div className="card mt-4">
          <div className="card-header bg-secondary text-white">Datos de envío</div>
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Dirección de entrega" value={envioData.direccionEntrega} onChange={e => setEnvioData(prev => ({ ...prev, direccionEntrega: e.target.value }))} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Ciudad" value={envioData.ciudad} onChange={e => setEnvioData(prev => ({ ...prev, ciudad: e.target.value }))} />
              </div>
              <div className="col-md-3">
                <select className="form-control" value={envioData.comuna} onChange={e => setEnvioData(prev => ({ ...prev, comuna: e.target.value }))}>
                  <option value="">Selecciona comuna</option>
                  {comunas && comunas.length > 0 ? (
                    comunas.map(c => <option key={c.idComuna ?? c.id} value={c.idComuna ?? c.id}>{c.nombre}</option>)
                  ) : (
                    <option value="">No hay comunas cargadas</option>
                  )}
                </select>
              </div>
            </div>
            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <input type="number" className="form-control" placeholder="Costo envío (CLP)" value={envioData.costoEnvio || shippingCost || ''} onChange={e => setEnvioData(prev => ({ ...prev, costoEnvio: e.target.value }))} />
              </div>
              <div className="col-md-9 text-end">
                <small className="text-muted">El costo de envío se puede ajustar antes de confirmar la compra.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right mt-3">
          <h4 className="text-white-custom">Subtotal: ${total}</h4>
          <h5 className="text-white-custom">IVA (19%): ${iva}</h5>
          <h5 className="text-white-custom">Envío: ${shipping}</h5>
          <h4 className="text-white-custom">Total: ${totalConIva + shipping}</h4>
          <button className="btn btn-custom mt-3 text-white-custom" onClick={async () => {
            // Confirmar compra: usar checkout backend + crear envio
            const token = localStorage.getItem('token');
            const idCliente = localStorage.getItem('idCliente');
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

            if (!token || !idCliente) {
              alert('Debes iniciar sesión como cliente para confirmar la compra');
              navigate('/login');
              return;
            }

            if (!envioData.direccionEntrega || !envioData.ciudad || !envioData.comuna) {
              alert('Por favor completa los datos de envío');
              return;
            }

            setProcessing(true);
            try {
              // Llamar checkout
              const checkoutResp = await axios.post(`${API_BASE}/api/carritos/${idCliente}/checkout`, null, { headers: { Authorization: `Bearer ${token}` } });
              const venta = checkoutResp.data;

              // Construir payload de envio
              let comunaPayload = {};
              if (!isNaN(parseInt(envioData.comuna, 10))) comunaPayload = { idComuna: parseInt(envioData.comuna, 10) };
              else comunaPayload = { nombre: envioData.comuna };

              const envioPayload = {
                direccionEntrega: envioData.direccionEntrega,
                ciudad: envioData.ciudad,
                costoEnvio: shipping,
                estado: 'pendiente',
                venta: { idVenta: venta.idVenta ?? venta.id },
                cliente: { id: parseInt(idCliente, 10) },
                comuna: comunaPayload
              };

              await axios.post(`${API_BASE}/api/envios`, envioPayload, { headers: { Authorization: `Bearer ${token}` } });

              alert('✅ Compra confirmada y envío registrado.');
              // Limpiar carrito local llamando al eliminador por cada item
              carrito.forEach(item => eliminarDelCarrito(item.id));
              // Opcional: redirigir a home o a historial de compras
              navigate('/');
            } catch (err) {
              console.error('Error en checkout/envio:', err);
              alert('Ocurrió un error al confirmar la compra. Revisa la consola.');
            } finally {
              setProcessing(false);
            }
          }} disabled={processing}>{processing ? 'Procesando...' : (<><i className="fas fa-check me-1"></i> Confirmar compra</>)}</button>
        </div>
      </div>
    </>
  );
}

export default Carrito;
