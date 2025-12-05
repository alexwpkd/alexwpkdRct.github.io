import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils.js';
import Hero from './Hero.jsx';
import ScrollButton from './ScrollButton.jsx';
// import images from '../assets/images/index.js';

function Carrito({ carrito, eliminarDelCarrito, actualizarCantidad, shippingCost }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [envioData, setEnvioData] = useState({ direccionEntrega: '', ciudad: '', comuna: '', costoEnvio: shippingCost || '' });
  const [comunas, setComunas] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Prefill envio data from registered cliente if available
  useEffect(() => {
    const tokenNow = localStorage.getItem('token');
    const idClienteNow = localStorage.getItem('idCliente');
    setIsAuthenticated(Boolean(tokenNow && idClienteNow));

    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');
    if (token && idCliente) {
      api.get(`/api/clientes/${idCliente}`).then(resp => {
        const c = resp.data || {};
        const direccion = c.direccion ?? c.direccionEntrega ?? '';
        // comuna puede venir como objeto o id
        const comunaVal = c.comuna ? (c.comuna.idComuna ?? c.comuna.id ?? c.comuna.nombre) : '';
        const ciudadVal = c.ciudad ?? (c.comuna && c.comuna.region && (c.comuna.region.nombre || c.comuna.region.nombreRegion)) ?? '';
        setEnvioData(prev => ({ ...prev, direccionEntrega: direccion, comuna: comunaVal, ciudad: ciudadVal, costoEnvio: shippingCost || prev.costoEnvio }));
      }).catch(err => {
        // Si falla, mantenemos lo que haya en envioData
        console.warn('No se pudieron cargar datos de cliente para envío:', err);
        setEnvioData(prev => ({ ...prev, costoEnvio: shippingCost || prev.costoEnvio }));
      });
    } else {
      // No hay sesión de cliente: solo asegurar costo fijo
      setEnvioData(prev => ({ ...prev, costoEnvio: shippingCost || prev.costoEnvio }));
    }
  }, [shippingCost]);

  useEffect(() => {
    api.get('/api/comunas').then(r => {
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
  // Mejorar parseo de precio: soportar priceNumber, precio, o cadenas con símbolos
  const parsePrice = (item) => {
    if (typeof item === 'number') return item;
    // objeto esperado
    const n = item?.priceNumber ?? item?.precio ?? item?.price ?? 0;
    if (typeof n === 'number') return n;
    if (typeof n === 'string') {
      // eliminar símbolos y separadores
      const cleaned = n.replace(/[^0-9\-\.]/g, '');
      const parsed = parseFloat(cleaned.replace(/\./g, ''));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const getPriceNum = item => Number(parsePrice(item));
  const shipping = Number(shippingCost || envioData.costoEnvio || 0);

  // Calcular totales por línea incluyendo IVA por artículo (redondeado por línea)
  const itemLines = carrito.map(item => {
    const price = getPriceNum(item);
    const qty = Number(item.cantidad || 1);
    const base = price * qty;
    const iva = Math.round(base * 0.19);
    return { id: item.id, base, iva, qty, price };
  });

  const totalBase = itemLines.reduce((s, it) => s + it.base, 0);
  const totalIva = itemLines.reduce((s, it) => s + it.iva, 0);

  // Distribuir shipping proporcionalmente sobre la base (antes de IVA)
  const itemSubtotals = itemLines.map(it => {
    const proportion = totalBase > 0 ? it.base / totalBase : 0;
    const itemShipping = Math.round(shipping * proportion);
    const total = it.base + it.iva + itemShipping;
    return { id: it.id, base: it.base, iva: it.iva, shipping: itemShipping, total };
  });

  // Ajuste de redondeo en shipping para que la suma coincida
  const totalShippingAllocated = itemSubtotals.reduce((s, it) => s + it.shipping, 0);
  if (shipping > 0 && totalShippingAllocated !== shipping && itemSubtotals.length > 0) {
    const diff = shipping - totalShippingAllocated;
    itemSubtotals[0].shipping += diff;
    itemSubtotals[0].total += diff;
  }

  const total = totalBase;
  const iva = totalIva;
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
      {/* Aviso si el usuario no está autenticado */}
      {!isAuthenticated && (
        <div className="container mt-3">
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <div>
              <strong>No estás autenticado:</strong> Debes iniciar sesión para confirmar compras y guardar datos de envío.
            </div>
            <div style={{display: 'flex', gap: 8}}>
              <button className="btn btn-sm btn-primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/contact')}>Registrarme</button>
            </div>
          </div>
        </div>
      )}
      
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
                  return it ? it.total.toLocaleString('es-CL') : (getPriceNum(item) * item.cantidad).toLocaleString('es-CL');
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
                <input type="number" readOnly className="form-control" placeholder="Costo envío (CLP)" value={envioData.costoEnvio || shippingCost || ''} />
              </div>
              <div className="col-md-9 text-end">
                <small className="text-muted">El costo de envío se puede ajustar antes de confirmar la compra.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right mt-3">
          <h4 className="text-white-custom">Subtotal: ${total.toLocaleString('es-CL')}</h4>
          <h5 className="text-white-custom">IVA (19%): ${iva.toLocaleString('es-CL')}</h5>
          <h5 className="text-white-custom">Envío: ${shipping.toLocaleString('es-CL')}</h5>
          <h4 className="text-white-custom">Total: ${(totalConIva + shipping).toLocaleString('es-CL')}</h4>
          <button className="btn btn-custom mt-3 text-white-custom" onClick={async () => {
            // Confirmar compra: usar checkout backend + crear envio
            const token = localStorage.getItem('token');
            const idCliente = localStorage.getItem('idCliente');
            if (!token || !idCliente) {
              // UX: si no autenticado, redirigir al login con mensaje
              alert('Debes iniciar sesión para confirmar la compra. Serás redirigido al inicio de sesión.');
              navigate('/login');
              return;
            }
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

            if (!envioData.direccionEntrega || !envioData.ciudad || !envioData.comuna) {
              alert('Por favor completa los datos de envío');
              return;
            }

            setProcessing(true);
            try {
              // Llamar checkout
              const checkoutResp = await api.post(`/api/carritos/${idCliente}/checkout`, null);
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

              await api.post('/api/envios', envioPayload);

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
