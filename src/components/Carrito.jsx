// src/components/Carrito.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils.js';
import { getAuthInfo } from '../utils/auth.js';
import Hero from './Hero.jsx';
import ScrollButton from './ScrollButton.jsx';

function Carrito({ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, shippingCost }) {
  const navigate = useNavigate();
  const [authInfo, setAuthInfo] = useState(() => getAuthInfo());
  const { isLoggedIn, idCliente } = authInfo;
  const [envioData, setEnvioData] = useState({
    direccionEntrega: '',
    ciudad: '',
    comuna: '',
    costoEnvio: shippingCost || ''
  });
  const [comunas, setComunas] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Revisar cada cierto tiempo si cambió el login (porque Login.jsx actualiza localStorage)
  useEffect(() => {
    const checkAuth = () => {
      setAuthInfo(getAuthInfo());
    };
    const interval = setInterval(checkAuth, 800);
    return () => clearInterval(interval);
  }, []);

  // Cargar datos de envío desde el cliente si está logueado
  useEffect(() => {
    if (!isLoggedIn || !idCliente) {
      setEnvioData(prev => ({
        ...prev,
        costoEnvio: shippingCost || prev.costoEnvio
      }));
      return;
    }

    api.get(`/api/clientes/${idCliente}`)
      .then(resp => {
        const c = resp.data || {};
        const direccion = c.direccion ?? c.direccionEntrega ?? '';
        const comunaVal = c.comuna
          ? (c.comuna.idComuna ?? c.comuna.id ?? c.comuna.nombre)
          : '';
        const ciudadVal =
          c.ciudad ??
          (c.comuna &&
            c.comuna.region &&
            (c.comuna.region.nombre || c.comuna.region.nombreRegion)) ??
          '';

        setEnvioData(prev => ({
          ...prev,
          direccionEntrega: direccion,
          comuna: comunaVal,
          ciudad: ciudadVal,
          costoEnvio: shippingCost || prev.costoEnvio
        }));
      })
      .catch(err => {
        console.warn('[Carrito] No se pudieron cargar datos de cliente para envío:', err);
        setEnvioData(prev => ({
          ...prev,
          costoEnvio: shippingCost || prev.costoEnvio
        }));
      });
  }, [isLoggedIn, idCliente, shippingCost]);

  // Cargar comunas
  useEffect(() => {
    api.get('/api/comunas')
      .then(r => setComunas(r.data || []))
      .catch(() => setComunas([]));
  }, []);

  // Si el carrito está vacío
  if (!carrito || carrito.length === 0) {
    return (
      <>
        <Hero title="ARMAMENTO" />

        <div
          className="text-center"
          style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}
        >
          <ScrollButton targetSelector=".container.py-5" playShots={false} />
        </div>

        <div className="container py-5 text-center">
          <h2 className="text-white-custom">Tu carrito está vacío</h2>
          <p className="text-white-custom" style={{ fontWeight: 'bold', display: 'inline' }}>
            Agrega productos desde la tienda.
          </p>
          <Link
            to="/shop"
            className="btn btn-custom ms-3 text-white-custom"
            style={{ verticalAlign: 'middle' }}
          >
            Regresar a la tienda
          </Link>
        </div>
      </>
    );
  }

  // Helpers precios / stock
  const getPrice = item => Number(item.price ?? item.precio ?? 0);
  const getStock = item => Number(item.stock ?? item.enStock ?? 1);

  const parsePrice = (item) => {
    if (typeof item === 'number') return item;
    const n = item?.priceNumber ?? item?.precio ?? item?.price ?? 0;
    if (typeof n === 'number') return n;
    if (typeof n === 'string') {
      const cleaned = n.replace(/[^0-9\-\.]/g, '');
      const parsed = parseFloat(cleaned.replace(/\./g, ''));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const getPriceNum = item => Number(parsePrice(item));
  const shipping = Number(shippingCost || envioData.costoEnvio || 0);

  const itemLines = carrito.map(item => {
    const price = getPriceNum(item);
    const qty = Number(item.cantidad || 1);
    const base = price * qty;
    const iva = Math.round(base * 0.19);
    return { id: item.id, base, iva, qty, price };
  });

  const totalBase = itemLines.reduce((s, it) => s + it.base, 0);
  const totalIva = itemLines.reduce((s, it) => s + it.iva, 0);
  const totalConIva = totalBase + totalIva;

  // Cantidades
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

  // ============================
  // Sincronizar carrito local -> backend (solo si el backend está vacío)
  // ============================
  const syncLocalCarritoToBackendIfNeeded = async () => {
    if (!idCliente) return;

    try {
      let carritoBackend = null;
      let detallesBackend = [];

      // Intentar obtener carrito del cliente
      try {
        const respCar = await api.get(`/api/carritos/cliente/${idCliente}`);
        carritoBackend = respCar.data;
      } catch (e) {
        if (e?.response?.status !== 404) {
          console.warn('[Carrito] Error obteniendo carrito backend:', e);
        }
      }

      if (carritoBackend && carritoBackend.idCarrito) {
        try {
          const respDet = await api.get(
            `/api/detalle-carrito/carrito/${carritoBackend.idCarrito}`
          );
          detallesBackend = respDet.data || [];
        } catch (e) {
          console.warn('[Carrito] Error obteniendo detalle de carrito backend:', e);
        }
      }

      // Si no existe carrito o no tiene ítems, subimos lo que hay en memoria
      if (!carritoBackend || !carritoBackend.idCarrito || detallesBackend.length === 0) {
        for (const item of carrito) {
          const productoId =
            item.productoObj?.idProducto ??
            item.idProducto ??
            item.id;

          const cantidad = item.cantidad || 1;
          if (!productoId) continue;

          await api.post(`/api/carritos/${idCliente}/agregar`, null, {
            params: { productoId, cantidad }
          });
        }
      }
    } catch (e) {
      console.warn(
        '[Carrito] No se pudo sincronizar el carrito local con el backend antes del checkout:',
        e
      );
    }
  };

  // ============================
  // Checkout
  // ============================
  const handleCheckout = async () => {
    // Invitado: se muestra mensaje y NO se llama al backend
    if (!isLoggedIn || !idCliente) {
      setMensaje('register');
      return;
    }

    if (!carrito || carrito.length === 0) {
      setMensaje('❌ Tu carrito está vacío. Agrega productos antes de confirmar la compra.');
      return;
    }

    if (!envioData.direccionEntrega || !envioData.ciudad || !envioData.comuna) {
      setMensaje('❌ Por favor completa los datos de envío antes de confirmar.');
      return;
    }

    setProcessing(true);
    try {
      // 1) Sincronizar carrito local -> backend (solo si el backend está vacío)
      await syncLocalCarritoToBackendIfNeeded();

      // 2) Hacer checkout en backend
      const checkoutResp = await api.post(`/api/carritos/${idCliente}/checkout`, null);
      const venta = checkoutResp.data;

      // 3) Armar payload de envío
      let comunaPayload = {};
      if (!isNaN(parseInt(envioData.comuna, 10))) {
        comunaPayload = { idComuna: parseInt(envioData.comuna, 10) };
      } else {
        comunaPayload = { nombre: envioData.comuna };
      }

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

      setMensaje('✅ Compra realizada correctamente. ¡Gracias por tu pedido! Serás redirigido en 2 segundos.');

      // Limpiar carrito local
      carrito.forEach(item => eliminarDelCarrito(item.id));

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const backendMsg = error?.response?.data?.message;
      console.error('[Carrito] Error en checkout/envío:', backendMsg || error.message);

      if (backendMsg === 'El carrito está vacío') {
        setMensaje(
          '❌ Tu carrito en el servidor está vacío. Vuelve a agregar los productos después de iniciar sesión y reintenta.'
        );
      } else if (error?.response?.status === 403) {
        setMensaje(
          '❌ No tienes permisos para completar esta compra. Verifica tu sesión o contacta al administrador.'
        );
      } else {
        setMensaje(
          '❌ Ocurrió un error al procesar tu compra. Intenta nuevamente en unos minutos.'
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Hero title="ARSENAL" />

      {/* Aviso si el usuario no está autenticado */}
      {!isLoggedIn && (
        <div className="container mt-3">
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <div>
              <strong>Debes estar logueado para poder comprar.</strong> Inicia sesión o crea tu cuenta.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-sm btn-primary">
                Iniciar sesión
              </Link>
              <Link to="/contact" className="btn btn-sm btn-outline-secondary">
                Registrarme
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje dinámico (errores, registro requerido, éxito, etc.) */}
      {mensaje && (
        <div className="container mt-3">
          <div className={`alert ${mensaje === 'register' ? 'alert-warning' : 'alert-info'}`}>
            {mensaje === 'register' ? (
              <div>
                <strong>
                  Para adquirir nuestros productos es necesario tener una cuenta. Favor de registrarse.
                </strong>
                <div className="mt-2">
                  <Link to="/contact" className="btn btn-sm btn-primary">
                    Ir a registrarme
                  </Link>
                </div>
              </div>
            ) : (
              mensaje
            )}
          </div>
        </div>
      )}

      {/* Botón de scroll suave */}
      <div
        className="text-center"
        style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}
      >
        <ScrollButton targetSelector=".container.py-5" playShots={false} />
      </div>

      {/* Contenido principal del carrito */}
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
          <tbody>
            {carrito.map(item => {
              const priceNum = getPriceNum(item);
              const qty = Number(item.cantidad || 1);
              const base = priceNum * qty;
              const ivaItem = Math.round(base * 0.19);
              const totalItem = base + ivaItem;

              return (
                <tr key={item.id}>
                  <td className="text-white-custom">{item.name || item.nombre}</td>
                  <td className="text-white-custom">
                    ${priceNum.toLocaleString('es-CL')}
                  </td>
                  <td className="text-white-custom">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDecrement(item)}
                      >
                        -
                      </button>
                      <span
                        className="text-white-custom"
                        style={{ margin: '0 10px', minWidth: '30px', textAlign: 'center' }}
                      >
                        {item.cantidad}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleIncrement(item)}
                        disabled={item.cantidad >= getStock(item)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-white-custom">
                    ${totalItem.toLocaleString('es-CL')}
                  </td>
                  <td className="text-white-custom">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Datos de envío */}
        <div className="card mt-4">
          <div className="card-header bg-secondary text-white">Datos de envío</div>
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dirección de entrega"
                  value={envioData.direccionEntrega}
                  onChange={e =>
                    setEnvioData(prev => ({ ...prev, direccionEntrega: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ciudad"
                  value={envioData.ciudad}
                  onChange={e => setEnvioData(prev => ({ ...prev, ciudad: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={envioData.comuna}
                  onChange={e => setEnvioData(prev => ({ ...prev, comuna: e.target.value }))}
                >
                  <option value="">Selecciona comuna</option>
                  {comunas && comunas.length > 0 ? (
                    comunas.map(c => (
                      <option key={c.idComuna ?? c.id} value={c.idComuna ?? c.id}>
                        {c.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="">No hay comunas cargadas</option>
                  )}
                </select>
              </div>
            </div>
            <div className="row g-2 mt-3">
              <div className="col-md-3">
                <input
                  type="number"
                  readOnly
                  className="form-control"
                  placeholder="Costo envío (CLP)"
                  value={envioData.costoEnvio || shippingCost || ''}
                />
              </div>
              <div className="col-md-9 text-end">
                <small className="text-muted">
                  El costo de envío se puede ajustar antes de confirmar la compra.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Totales */}
        <div className="text-right mt-3">
          <h4 className="text-white-custom">
            Subtotal: ${totalBase.toLocaleString('es-CL')}
          </h4>
          <h5 className="text-white-custom">
            IVA (19%): ${totalIva.toLocaleString('es-CL')}
          </h5>
          <h5 className="text-white-custom">
            Envío: ${shipping.toLocaleString('es-CL')}
          </h5>
          <h4 className="text-white-custom">
            Total: {(totalConIva + shipping).toLocaleString('es-CL')}
          </h4>
          <button
            className="btn btn-custom mt-3 text-white-custom"
            onClick={handleCheckout}
            disabled={processing || carrito.length === 0}
          >
            {processing ? (
              'Procesando...'
            ) : (
              <>
                <i className="fas fa-check me-1"></i> Confirmar compra
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Carrito;
