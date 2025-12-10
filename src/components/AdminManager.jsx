// src/components/AdminManager.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils.js';
import { showAxiosError } from '../utils/showAxiosError.js';

function AdminManager() {
  const [activeTab, setActiveTab] = useState('productos');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  // =========================
  // Helpers edición
  // =========================
  const handleEditField = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // Cargar datos según pestaña
  // =========================
  useEffect(() => {
    loadData();
    setEditingId(null);
    setEditData(null);
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let response;

      switch (activeTab) {
        case 'productos':
          response = await api.get('/api/productos');
          setData(response.data || []);
          break;
        case 'empleados':
          response = await api.get('/api/empleados');
          setData(response.data || []);
          break;
        case 'pedidos':
          response = await api.get('/api/ventas');
          setData(response.data || []);
          break;
        case 'clientes':
          response = await api.get('/api/clientes');
          setData(response.data || []);
          break;
        default:
          setData([]);
      }
    } catch (err) {
      console.error(`[AdminManager] Error cargando ${activeTab}:`, err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Editar
  // =========================
  const handleEdit = (item) => {
    // Normalizar ID
    const id =
      item.idProducto ||
      item.idEmpleado ||
      item.idCliente ||
      item.idVenta ||
      item.id;

    // Para productos, preparar también imagenUrl (viene como "imagen" desde backend)
    if (activeTab === 'productos') {
      setEditData({
        ...item,
        imagenUrl: item.imagen || item.imagenUrl || '',
      });
    } else {
      setEditData({ ...item });
    }

    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editData) return;

    try {
      let endpoint = '';
      let payload = editData; // por defecto mandamos todo el objeto

      switch (activeTab) {
        case 'productos': {
          endpoint = `/api/productos/${editingId}`;

          // Construimos el DTO que espera el backend (ProductoCreateDTO)
          payload = {
            nombre: editData.nombre || '',
            precio: Number(editData.precio ?? 0),
            sku: editData.sku || '',
            stock: Number(editData.stock ?? 0),
            categoria: editData.categoria || '',
            subcategoria: editData.subcategoria || '',
            descripcion: editData.descripcion || '',
            imagenUrl: editData.imagenUrl || editData.imagen || '',
          };
          break;
        }
        case 'empleados': {
          endpoint = `/api/empleados/${editingId}`;
          // Aquí mandamos el empleado tal cual (incluye password que ya viene del backend)
          break;
        }
        case 'pedidos': {
          endpoint = `/api/ventas/${editingId}`;
          // Permitimos cambiar sólo estado y descuento,
          // pero enviamos el objeto completo para no perder otros campos
          payload = {
            ...editData,
            descuento: Number(editData.descuento ?? 0),
          };
          break;
        }
        case 'clientes': {
          endpoint = `/api/clientes/${editingId}`;
          // Enviamos cliente completo (manteniendo password, comuna, etc. que ya vienen)
          break;
        }
        default:
          return;
      }

      await api.put(endpoint, payload);
      alert('✅ Actualizado correctamente');
      setEditingId(null);
      setEditData(null);
      loadData();
    } catch (err) {
      showAxiosError(`Error actualizando ${activeTab}`, err);
    }
  };

  // =========================
  // Eliminar
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar este ${activeTab.slice(0, -1)}?`)) {
      return;
    }

    try {
      let endpoint;

      switch (activeTab) {
        case 'productos':
          endpoint = `/api/productos/${id}`;
          break;
        case 'empleados':
          endpoint = `/api/empleados/${id}`;
          break;
        case 'pedidos':
          endpoint = `/api/ventas/${id}`;
          break;
        case 'clientes':
          endpoint = `/api/clientes/${id}`;
          break;
        default:
          return;
      }

      await api.delete(endpoint);
      alert('✅ Eliminado correctamente');
      loadData();
    } catch (err) {
      showAxiosError(`Error eliminando ${activeTab}`, err);
    }
  };

  // =========================
  // Render tabla
  // =========================
  const renderTable = () => {
    if (loading) return <p className="text-white-custom">Cargando...</p>;
    if (data.length === 0) return <p className="text-white-custom">No hay datos disponibles</p>;

    let columns = [];
    let renderRow = (item) => null;

    switch (activeTab) {
      case 'productos':
        columns = ['ID', 'Nombre', 'Precio', 'Stock', 'Categoría', 'Acciones'];
        renderRow = (item) => (
          <tr key={item.idProducto || item.id}>
            <td className="text-white-custom">{item.idProducto || item.id}</td>
            <td className="text-white-custom">{item.nombre}</td>
            <td className="text-white-custom">
              ${(item.precio || 0).toLocaleString('es-CL')}
            </td>
            <td className="text-white-custom">{item.stock}</td>
            <td className="text-white-custom">{item.categoria}</td>
            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(item)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.idProducto || item.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        );
        break;

      case 'empleados':
        columns = ['ID', 'Nombre', 'Correo', 'RUT', 'Acciones'];
        renderRow = (item) => (
          <tr key={item.idEmpleado || item.id}>
            <td className="text-white-custom">{item.idEmpleado || item.id}</td>
            <td className="text-white-custom">
              {item.nombre} {item.apellido}
            </td>
            <td className="text-white-custom">{item.correo}</td>
            <td className="text-white-custom">{item.rut}</td>
            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(item)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.idEmpleado || item.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        );
        break;

      case 'pedidos':
        columns = ['ID', 'Cliente', 'Total', 'Fecha', 'Estado', 'Acciones'];
        renderRow = (item) => {
          const fechaRaw =
            item.fechaVenta || item.fecha || item.fechaCompra || null;
          const fechaFmt = fechaRaw
            ? new Date(fechaRaw).toLocaleDateString('es-CL')
            : '-';

          return (
            <tr key={item.idVenta || item.id}>
              <td className="text-white-custom">{item.idVenta || item.id}</td>
              <td className="text-white-custom">
                {item.cliente?.nombre || 'Sin cliente'}
              </td>
              <td className="text-white-custom">
                ${(item.total || 0).toLocaleString('es-CL')}
              </td>
              <td className="text-white-custom">{fechaFmt}</td>
              <td className="text-white-custom">{item.estado || 'Pendiente'}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(item)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.idVenta || item.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        };
        break;

      case 'clientes':
        columns = ['ID', 'Nombre', 'Correo', 'RUT', 'Acciones'];
        renderRow = (item) => (
          <tr key={item.idCliente || item.id}>
            <td className="text-white-custom">{item.idCliente || item.id}</td>
            <td className="text-white-custom">
              {item.nombre} {item.apellidos || ''}
            </td>
            <td className="text-white-custom">{item.correo}</td>
            <td className="text-white-custom">{item.rut}</td>
            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(item)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.idCliente || item.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        );
        break;

      default:
        return null;
    }

    return (
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-white-custom">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map(renderRow)}</tbody>
      </table>
    );
  };

  // =========================
  // Render formulario de edición
  // =========================
  const renderEditForm = () => {
    if (!editingId || !editData) return null;

    switch (activeTab) {
      case 'productos':
        return (
          <div className="card mb-4 bg-dark border-light">
            <div className="card-header bg-warning text-dark">
              <strong>Editando producto #{editingId}</strong>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-custom">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.nombre || ''}
                    onChange={(e) => handleEditField('nombre', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-custom">Precio</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.precio ?? ''}
                    onChange={(e) =>
                      handleEditField('precio', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-custom">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.stock ?? ''}
                    onChange={(e) =>
                      handleEditField('stock', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-custom">SKU</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.sku || ''}
                    onChange={(e) => handleEditField('sku', e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-custom">
                    Categoría
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.categoria || ''}
                    onChange={(e) =>
                      handleEditField('categoria', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-white-custom">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.subcategoria || ''}
                    onChange={(e) =>
                      handleEditField('subcategoria', e.target.value)
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-white-custom">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editData.descripcion || ''}
                    onChange={(e) =>
                      handleEditField('descripcion', e.target.value)
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-white-custom">
                    URL de imagen
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.imagenUrl || ''}
                    onChange={(e) =>
                      handleEditField('imagenUrl', e.target.value)
                    }
                  />
                  <small className="text-muted">
                    Puede ser una URL absoluta o un path relativo
                    (ej: <code>products/product-img-1</code>).
                  </small>
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary me-2"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        );

      case 'empleados':
        return (
          <div className="card mb-4 bg-dark border-light">
            <div className="card-header bg-warning text-dark">
              <strong>Editando empleado #{editingId}</strong>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-custom">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.nombre || ''}
                    onChange={(e) =>
                      handleEditField('nombre', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.apellido || ''}
                    onChange={(e) =>
                      handleEditField('apellido', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editData.correo || ''}
                    onChange={(e) =>
                      handleEditField('correo', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">RUT</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.rut || ''}
                    onChange={(e) => handleEditField('rut', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        );

      case 'clientes':
        return (
          <div className="card mb-4 bg-dark border-light">
            <div className="card-header bg-warning text-dark">
              <strong>Editando cliente #{editingId}</strong>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-custom">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.nombre || ''}
                    onChange={(e) =>
                      handleEditField('nombre', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.apellidos || ''}
                    onChange={(e) =>
                      handleEditField('apellidos', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editData.correo || ''}
                    onChange={(e) =>
                      handleEditField('correo', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">RUT</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.rut || ''}
                    onChange={(e) => handleEditField('rut', e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label text-white-custom">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.direccion || ''}
                    onChange={(e) =>
                      handleEditField('direccion', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="card mb-4 bg-dark border-light">
            <div className="card-header bg-warning text-dark">
              <strong>Editando pedido #{editingId}</strong>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white-custom">
                    Estado
                  </label>
                  <select
                    className="form-control"
                    value={editData.estado || 'pendiente'}
                    onChange={(e) =>
                      handleEditField('estado', e.target.value)
                    }
                  >
                    <option value="pagada">Pagada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="anulada">Anulada</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">
                    Descuento (CLP)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.descuento ?? 0}
                    onChange={(e) =>
                      handleEditField('descuento', e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-custom">
                    Total (solo lectura)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={(editData.total || 0).toLocaleString('es-CL')}
                    disabled
                  />
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // =========================
  // Render principal
  // =========================
  return (
    <div className="container mt-4 mb-5">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['productos', 'empleados', 'pedidos', 'clientes'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <i
                className={`fas me-2 ${
                  tab === 'productos'
                    ? 'fa-box'
                    : tab === 'empleados'
                    ? 'fa-users'
                    : tab === 'pedidos'
                    ? 'fa-shopping-cart'
                    : 'fa-user'
                }`}
              ></i>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Formulario de edición */}
      {renderEditForm()}

      {/* Tabla */}
      <div className="card bg-dark border-light">
        <div className="card-header">
          <strong className="text-white-custom">
            Gestionar {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </strong>
        </div>
        <div className="card-body">
          <div className="table-responsive">{renderTable()}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminManager;
