// src/components/Admin.jsx
import React, { useState, useEffect } from 'react';
import api, { getAuthHeaders } from '../utils.js';
import { showAxiosError } from '../utils/showAxiosError.js';
import { useProductData } from './ProductData';
import AdminManager from './AdminManager.jsx';
import ScrollButton from './ScrollButton.jsx';
import images from '../assets/images/index.js';
import { resolveImage } from '../utils.js';
// Header/Footer globales se renderizan en App.jsx

function Admin() {
    // Estados principales
    const [activeTab, setActiveTab] = useState('inventory');
    const { productos } = useProductData();
    // Estado local para el inventario editable (sincronizado con ProductData)
    const [inventory, setInventory] = useState(productos.map(p => ({
        ...p,
        name: p.nombre,
        category: p.categoria,
        price: p.precio,
        status: p.stock === 0 ? 'Agotado' : (p.stock < 3 ? 'Stock crítico' : (p.stock < 5 ? 'Stock bajo' : 'En stock'))
    })));
    const [page, setPage] = useState(1);
    const productsPerPage = 10;
    const [loadingInventory, setLoadingInventory] = useState(false);

    const [newStock, setNewStock] = useState({});

    // Funciones de utilidad
    const formatCurrency = (amount) => {
        return `$${amount.toLocaleString('es-CL')} CLP`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'En stock': 'bg-success',
            'Stock bajo': 'bg-warning',
            'Stock crítico': 'bg-danger',
            'Agotado': 'bg-secondary'
        };
        return statusConfig[status] || 'bg-secondary';
    };

    // Cálculos de estadísticas sincronizados con inventario editable
    const totalProducts = inventory.length;
    const totalPages = Math.max(1, Math.ceil(inventory.length / productsPerPage));
    const lowStockProducts = inventory.filter(product => product.stock < 5).length;
    // Valor inventario: suma de precio*stock de todos los productos
    const inventoryValue = inventory.reduce((sum, product) => sum + (product.stock * product.price), 0);
    // Ingresos potenciales: valor inventario + 50%
    const potentialRevenue = Math.round(inventoryValue * 1.5);

    // Funciones de gestión
    // Reponer stock: actualiza el estado local y la fecha de última reposición
    const handleAddStock = (productId, quantity) => {
        if (!quantity || quantity <= 0) {
            alert('Por favor ingresa una cantidad válida');
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        setInventory(prev => prev.map(product => 
            product.id === productId 
                ? { 
                    ...product, 
                    stock: product.stock + quantity,
                    lastRestock: today,
                    status: product.stock + quantity === 0 ? 'Agotado' : (product.stock + quantity < 3 ? 'Stock crítico' : (product.stock + quantity < 5 ? 'Stock bajo' : 'En stock'))
                }
                : product
        ));
        setNewStock(prev => ({ ...prev, [productId]: '' }));
        alert(`✅ Stock actualizado: +${quantity} unidades agregadas al producto ID: ${productId}`);
    };

    // Eliminar funciones de staff, ventas y reportes
    // Solo se mantiene generateInventoryReport si se usa en inventario
    const generateInventoryReport = () => {
        const report = {
            fecha: new Date().toLocaleDateString('es-CL'),
            totalProductos: totalProducts,
            valorInventario: formatCurrency(inventoryValue),
            ingresosPotenciales: formatCurrency(potentialRevenue),
            productosStockBajo: lowStockProducts,
            detalle: inventory.map(product => ({
                producto: product.name,
                categoria: product.category,
                stock: product.stock,
                precio: formatCurrency(product.price),
                estado: product.status
            }))
        };
        console.log('📊 Reporte de Inventario:', report);
        alert('📊 Reporte generado en la consola del navegador');
        return report;
    };

    // Cargar inventario desde backend (si está disponible)
    useEffect(() => {
        let mounted = true;
        const loadInventory = async () => {
            setLoadingInventory(true);
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
            try {
                const resp = await api.get('/api/productos');
                const list = resp.data || [];
                const mapped = list.map(p => ({
                    id: p.idProducto ?? p.id,
                    name: p.nombre ?? p.name,
                    category: p.categoria ?? p.category,
                    price: p.precio ?? p.price ?? 0,
                    stock: p.stock ?? p.stockDisponible ?? 0,
                    status: (p.stock ?? 0) === 0 ? 'Agotado' : ((p.stock ?? 0) < 3 ? 'Stock crítico' : ((p.stock ?? 0) < 5 ? 'Stock bajo' : 'En stock')),
                    lastRestock: p.lastRestock ?? null,
                    imageUrl: p.imagenUrl ?? p.imagen?.url ?? p.urlImagen ?? null,
                    imagenClave: p.imagenClave ?? null
                }));
                if (mounted) {
                    if (mapped.length) setInventory(mapped);
                }
            } catch (err) {
                console.warn('No se pudo cargar inventario desde backend, usando inventario local', err);
            } finally {
                if (mounted) setLoadingInventory(false);
            }
        };
        loadInventory();
        return () => { mounted = false; };
    }, []);

    // Asegurar que la página actual esté dentro del rango cuando cambie el inventario
    useEffect(() => {
        setPage(p => Math.max(1, Math.min(p, totalPages)));
    }, [totalPages]);

    // ======= Formulario para crear productos (administrador) =======
    const [newProduct, setNewProduct] = useState({
        nombre: '', precio: '', sku: '', stock: '', categoria: '', subcategoria: '', descripcion: '', imagenUrl: ''
    });
    const [creating, setCreating] = useState(false);

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    // ahora usamos URL de imagen en lugar de archivo

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        // Validación mínima
        if (!newProduct.nombre || !newProduct.precio || !newProduct.sku || !newProduct.stock || !newProduct.categoria || !newProduct.subcategoria || !newProduct.descripcion) {
            alert('Por favor completa todos los campos del producto');
            return;
        }

        setCreating(true);

        try {
            const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

            const parsedStock = parseInt(newProduct.stock, 10) || 0;

            // Validación: imagenUrl es obligatoria según DTO del backend
            const urlValue = (newProduct.imagenUrl || '').trim();
            if (!urlValue) {
                alert('La URL de la imagen es obligatoria. Puede ser absoluta (https://...) o relativa (p. ej. products/product-img-1)');
                setCreating(false);
                return;
            }
            // Permitir URL absoluta (http/https) o rutas relativas (contienen '/').
            const looksAbsolute = /^https?:\/\//i.test(urlValue);
            const looksRelative = urlValue.includes('/');
            if (!looksAbsolute && !looksRelative) {
                alert('La URL debe ser absoluta (https://...) o una ruta relativa (contiene "/").');
                setCreating(false);
                return;
            }
            const dto = {
                nombre: newProduct.nombre,
                precio: parseInt(newProduct.precio, 10),
                sku: newProduct.sku,
                stock: parsedStock,
                categoria: newProduct.categoria,
                subcategoria: newProduct.subcategoria,
                descripcion: newProduct.descripcion,
                imagenUrl: urlValue
            };

            const token = localStorage.getItem('token');

            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const resp = await api.post('/api/productos', dto, { headers });

            const creado = resp.data;

            // Normalizar al esquema usado en inventory
            const formatted = {
                id: creado.idProducto ?? creado.id ?? Math.random(),
                name: creado.nombre ?? creado.name,
                category: creado.categoria ?? creado.category,
                price: creado.precio ?? creado.price ?? 0,
                stock: creado.stock ?? (creado.stock === 0 ? 0 : creado.stock) ?? 0,
                lastRestock: null,
                // Mapear posibles rutas/propiedades de imagen que el backend devuelva
                imageUrl: creado.imagenUrl ?? creado.imagen?.url ?? creado.imagen ?? creado.urlImagen ?? null,
                imagenClave: creado.imagenClave ?? null
            };

            // Añadir producto al inventario local
            setInventory(prev => [formatted, ...prev]);

            // Si el backend no devolvió una URL de imagen, intentar obtener el producto creado
            if (!formatted.imageUrl) {
                try {
                    const token2 = localStorage.getItem('token');
                    const headers2 = token2 ? { Authorization: `Bearer ${token2}` } : {};
                    const id = creado.idProducto ?? creado.id;
                    if (id) {
                        const getResp = await api.get(`/api/productos/${id}`, { headers: headers2 });
                        const pFull = getResp.data;
                        const resolvedImage = pFull.imagenUrl ?? pFull.imagen?.url ?? pFull.urlImagen ?? null;
                        if (resolvedImage) {
                            setInventory(prev => prev.map(item => item.id === (id) ? ({ ...item, imageUrl: resolvedImage }) : item));
                        }
                    }
                } catch (imgErr) {
                    // No crítico: si no obtenemos la URL de la imagen, mantenemos el fallback local
                    console.warn('No se obtuvo URL de imagen tras crear producto:', imgErr);
                }
            }

            // Reset form
            setNewProduct({ nombre: '', precio: '', sku: '', stock: '', categoria: '', subcategoria: '', descripcion: '', imagenUrl: '' });

            alert('✅ Producto creado correctamente');
        } catch (err) {
            console.error('Error creando producto:', err);
            const serverMsg = err?.response?.data || err?.response?.statusText || err?.message;
            alert('Error al crear producto: ' + serverMsg);
        } finally {
            setCreating(false);
        }
    };

    // ======= Formulario para registrar compras (reabastecer stock) =======
    const [purchaseRows, setPurchaseRows] = useState([
        { productoId: inventory[0]?.id ?? null, cantidad: 1 }
    ]);
    const [purchasing, setPurchasing] = useState(false);

    const handleAddPurchaseRow = () => {
        setPurchaseRows(prev => ([...prev, { productoId: inventory[0]?.id ?? null, cantidad: 1 }]));
    };
    const handleRemovePurchaseRow = (index) => {
        setPurchaseRows(prev => prev.filter((_, i) => i !== index));
    };
    const handlePurchaseChange = (index, field, value) => {
        setPurchaseRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    };

    const handleCreatePurchase = async (e) => {
        e.preventDefault();
        if (!purchaseRows.length) {
            alert('Agrega al menos un item a la compra');
            return;
        }
        // Calcular totalCompra
        let totalCompra = 0;
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
        try {
            // Obtener precios actuales desde el backend para cada producto (si es posible)
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // Para simplicidad, intentamos crear la compra primero
            setPurchasing(true);
            const compraPayload = {
                totalCompra: 0,
                estado: 'recibida',
                fechaCompra: new Date().toISOString()
            };
            const compraResp = await api.post('/api/compras', compraPayload, { headers });
            const compra = compraResp.data;

            // Para cada fila, crear detalle_compra y actualizar stock local
            for (const row of purchaseRows) {
                const productoId = row.productoId;
                const cantidad = parseInt(row.cantidad, 10) || 0;
                if (!productoId || cantidad <= 0) continue;

                // Obtener producto para precio actual
                let producto = null;
                try {
                    const prodResp = await api.get(`/api/productos/${productoId}`, { headers });
                    producto = prodResp.data;
                } catch {
                    // fallback: buscar en inventory local
                    producto = inventory.find(p => p.id === productoId) || null;
                }

                const precioUnitario = producto?.precio ?? producto?.price ?? 0;
                const subtotal = precioUnitario * cantidad;
                totalCompra += subtotal;

                const detallePayload = {
                    cantidad,
                    precioUnitario,
                    subtotal,
                    compra: { idCompra: compra.idCompra ?? compra.id },
                    producto: { idProducto: productoId }
                };

                await api.post('/api/detalle-compra', detallePayload, { headers });

                // Actualizar stock del producto en backend (si existe endpoint PUT /api/productos/{id})
                try {
                    // Obtener producto original (si no lo tenemos)
                    let prodForUpdate = producto;
                    if (!prodForUpdate) {
                        const pResp = await api.get(`/api/productos/${productoId}`, { headers });
                        prodForUpdate = pResp.data;
                    }
                    if (prodForUpdate) {
                        // Asegurar que enviamos un campo imagenUrl no vacío (DTO lo exige)
                        let resolvedImage = prodForUpdate.imagenUrl ?? prodForUpdate.imagen?.url ?? prodForUpdate.imagen ?? prodForUpdate.urlImagen ?? prodForUpdate.imagenClave ?? '';
                        if (!resolvedImage) resolvedImage = 'products/product-img-1';
                        const updatedDto = {
                            nombre: prodForUpdate.nombre,
                            precio: prodForUpdate.precio ?? prodForUpdate.price ?? 0,
                            sku: prodForUpdate.sku ?? prodForUpdate.SKU ?? '',
                            stock: (prodForUpdate.stock ?? prodForUpdate.stock ?? 0) + cantidad,
                            categoria: prodForUpdate.categoria ?? prodForUpdate.category ?? '',
                            subcategoria: prodForUpdate.subcategoria ?? prodForUpdate.subcategory ?? '',
                            descripcion: prodForUpdate.descripcion ?? prodForUpdate.description ?? '',
                            imagenUrl: resolvedImage
                        };

                        const token3 = localStorage.getItem('token');
                        const headers3 = token3 ? { Authorization: `Bearer ${token3}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
                        await api.put(`/api/productos/${productoId}`, updatedDto, { headers: headers3 });

                        // Actualizar inventario local
                        setInventory(prev => prev.map(p => p.id === productoId ? ({ ...p, stock: (p.stock || 0) + cantidad, lastRestock: new Date().toISOString().split('T')[0], status: ((p.stock || 0) + cantidad) === 0 ? 'Agotado' : (((p.stock || 0) + cantidad) < 3 ? 'Stock crítico' : (((p.stock || 0) + cantidad) < 5 ? 'Stock bajo' : 'En stock')) }) : p));
                    }
                } catch (updateErr) {
                    console.warn('No se pudo actualizar producto en backend, actualizaré solo local:', updateErr);
                    setInventory(prev => prev.map(p => p.id === productoId ? ({ ...p, stock: (p.stock || 0) + cantidad, lastRestock: new Date().toISOString().split('T')[0], status: ((p.stock || 0) + cantidad) === 0 ? 'Agotado' : (((p.stock || 0) + cantidad) < 3 ? 'Stock crítico' : (((p.stock || 0) + cantidad) < 5 ? 'Stock bajo' : 'En stock')) }) : p));
                }
            }

            // Actualizar totalCompra si backend no lo calcula
            try {
                await api.put(`/api/compras/${compra.idCompra ?? compra.id}`, { totalCompra }, { headers });
            } catch { /* no crítico */ }

            alert('✅ Compra registrada y stock actualizado.');
            setPurchaseRows([{ productoId: inventory[0]?.id ?? null, cantidad: 1 }]);
        } catch (err) {
            console.error('Error creando compra:', err);
            const serverMsg = err?.response?.data || err?.response?.statusText || err?.message || String(err);
            alert('Error al registrar la compra: ' + serverMsg);
        } finally {
            setPurchasing(false);
        }
    };

    // ======= Sección Personal (empleados) =======
    function PersonalSection() {
        const [employees, setEmployees] = useState([]);
        const [loadingEmployees, setLoadingEmployees] = useState(false);
        const [newEmployee, setNewEmployee] = useState({ nombre: '', apellido: '', correo: '', rut: '', password: '' });
        const [creatingEmployee, setCreatingEmployee] = useState(false);

        useEffect(() => {
            let mounted = true;
            const load = async () => {
                setLoadingEmployees(true);
                const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
                try {
                    const token = localStorage.getItem('token');
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};
                    const resp = await api.get('/api/empleados', { headers });
                    if (!mounted) return;
                    setEmployees(resp.data || []);
                } catch (err) {
                    console.warn('No se pudieron cargar empleados', err);
                } finally {
                    if (mounted) setLoadingEmployees(false);
                }
            };
            load();
            return () => { mounted = false; };
        }, []);

        const handleNewEmployeeChange = (e) => {
            const { name, value } = e.target;
            setNewEmployee(prev => ({ ...prev, [name]: value }));
        };

        const handleCreateEmployee = async (e) => {
            e.preventDefault();
            if (!newEmployee.nombre || !newEmployee.correo) {
                alert('Por favor completa al menos nombre y correo');
                return;
            }
            setCreatingEmployee(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const dto = {
                    nombre: newEmployee.nombre,
                    apellido: newEmployee.apellido,
                    correo: newEmployee.correo,
                    rut: newEmployee.rut,
                    password: newEmployee.password
                };

                // Usar endpoint público de registro de empleado según controlador
                const resp = await api.post('/auth/registro/empleado', dto, { headers });
                const creado = resp.data;
                setEmployees(prev => [creado, ...prev]);
                setNewEmployee({ nombre: '', apellido: '', correo: '', rut: '', password: '' });
                alert('✅ Empleado creado correctamente');
            } catch (err) {
                showAxiosError('Error creando empleado', err);
            } finally {
                setCreatingEmployee(false);
            }
        };

        return (
            <div>
                <form onSubmit={handleCreateEmployee} className="mb-4">
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <input type="text" name="nombre" className="form-control" placeholder="Nombre" value={newEmployee.nombre} onChange={handleNewEmployeeChange} />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input type="text" name="apellido" className="form-control" placeholder="Apellidos" value={newEmployee.apellido} onChange={handleNewEmployeeChange} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6 mb-2">
                            <input type="email" name="correo" className="form-control" placeholder="Correo" value={newEmployee.correo} onChange={handleNewEmployeeChange} />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input type="text" name="rut" className="form-control" placeholder="RUT" value={newEmployee.rut} onChange={handleNewEmployeeChange} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6 mb-2">
                            <input type="password" name="password" className="form-control" placeholder="Contraseña (temporal)" value={newEmployee.password} onChange={handleNewEmployeeChange} />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-12 text-end">
                            <button className="btn btn-primary" type="submit" disabled={creatingEmployee}>{creatingEmployee ? 'Creando...' : 'Agregar Empleado'}</button>
                        </div>
                    </div>
                </form>

                <div className="card">
                    <div className="card-header">Listado de Empleados</div>
                    <div className="card-body">
                        {loadingEmployees ? (
                            <div>Cargando empleados...</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Correo</th>
                                            <th>RUT</th>
                                            <th>Administrador</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map(emp => (
                                            <tr key={emp.id || emp.idEmpleado || emp.correo}>
                                                <td>{emp.nombre ?? emp.name ?? '-'}</td>
                                                <td>{emp.apellido ?? '-'}</td>
                                                <td>{emp.correo ?? emp.email ?? '-'}</td>
                                                <td>{emp.rut ?? '-'}</td>
                                                <td>{(emp.administrador === true || emp.administrador === false) ? (emp.administrador ? 'Sí' : 'No') : (emp.administrador ?? '-')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="Admin">
            
            {/* Hero Section */}
            <div className="hero-area hero-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 offset-lg-2 text-center">
                            <div className="hero-text">
                                <div className="hero-text-tablecell">
                                    <h1>ALPHA SQUAD</h1>
                                    <p className="subtitle">Panel de Administración</p>
                                </div>
                                {/* pagination moved below inventory table */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Botón de scroll suave */}
            <div className="text-center" style={{ marginTop: '-80px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
                <ScrollButton targetSelector=".container.mt-4.mb-5" playShots={false} />
            </div>

            {/* Navegación por pestañas */}
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('inventory')}
                                >
                                    <i className="fas fa-boxes me-2"></i>
                                    Inventario
                                </button>
                            </li>
                            {/* Purchases tab removed as requested */}
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('personal')}
                                >
                                    <i className="fas fa-users me-2"></i>
                                    Personal
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'manager' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('manager')}
                                >
                                    <i className="fas fa-cogs me-2"></i>
                                    Gestión
                                </button>
                            </li>
                            {/* Reportes tab removed */}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Contenido de las pestañas */}
            <div className="container mt-4 mb-5">
                
                {/* Pestaña: Inventario */}
                {activeTab === 'inventory' && (
                    <div className="tab-content">
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Gestión completa del inventario de productos
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            {[ 
                                { title: 'Total Productos', value: totalProducts, icon: 'fa-box', color: 'primary' },
                                { title: 'Valor Inventario', value: formatCurrency(inventoryValue), icon: 'fa-dollar-sign', color: 'success' },
                                { title: 'Productos Stock Bajo', value: lowStockProducts, icon: 'fa-exclamation-triangle', color: 'warning' },
                                { title: 'Ingresos Potenciales', value: formatCurrency(potentialRevenue), icon: 'fa-chart-line', color: 'info' }
                            ].map((stat, index) => (
                                <div key={index} className="col-md-3 mb-3">
                                    <div className={`card bg-${stat.color} text-white`} style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                        <div className="card-body text-center d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
                                            <i className={`fas ${stat.icon} fa-2x mb-2`}></i>
                                            <h5>{stat.title}</h5>
                                            <h3>{stat.value}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formulario para crear producto (mantener estética con tarjetas y botones existentes) */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <strong>Agregar Producto</strong>
                                        <small className="text-muted">Añade un producto nuevo al catálogo</small>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleCreateProduct}>
                                            <div className="row">
                                                <div className="col-md-6 mb-2">
                                                    <input type="text" name="nombre" className="form-control" placeholder="Nombre" value={newProduct.nombre} onChange={handleNewProductChange} />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <input type="number" name="precio" className="form-control" placeholder="Precio (CLP)" value={newProduct.precio} onChange={handleNewProductChange} />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <input type="text" name="sku" className="form-control" placeholder="SKU" value={newProduct.sku} onChange={handleNewProductChange} />
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-3 mb-2">
                                                    <input type="number" name="stock" className="form-control" placeholder="Stock" value={newProduct.stock} onChange={handleNewProductChange} />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <input type="text" name="categoria" className="form-control" placeholder="Categoría" value={newProduct.categoria} onChange={handleNewProductChange} />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <input type="text" name="subcategoria" className="form-control" placeholder="Subcategoría" value={newProduct.subcategoria} onChange={handleNewProductChange} />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <input type="text" name="imagenUrl" className="form-control" placeholder="URL de imagen" value={newProduct.imagenUrl} onChange={handleNewProductChange} />
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-12 mb-2">
                                                    <textarea name="descripcion" className="form-control" placeholder="Descripción" value={newProduct.descripcion} onChange={handleNewProductChange}></textarea>
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-12 text-end">
                                                    <button className="btn btn-primary" type="submit" disabled={creating}>
                                                        {creating ? 'Creando...' : (<><i className="fas fa-plus me-1"></i> Agregar Producto</>)}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fas fa-boxes me-2"></i>
                                    Inventario de Productos
                                </span>
                                <small className="text-white-50">Gestión de inventario</small>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-white-custom">Imagen</th>
                                                <th className="text-white-custom">ID</th>
                                                <th className="text-white-custom">Producto</th>
                                                <th className="text-white-custom">Categoría</th>
                                                <th className="text-white-custom">Precio</th>
                                                <th className="text-white-custom">Stock</th>
                                                <th className="text-white-custom">Estado</th>
                                                <th className="text-white-custom">Ventas</th>
                                                <th className="text-white-custom">Última Reposición</th>
                                            </tr>
                                        </thead>
                                                      <tbody>
                                                          {inventory.slice((page-1)*productsPerPage, page*productsPerPage).map(product => (
                                                <tr key={product.id}>
                                                    <td style={{width: '80px'}}>
                                                        {(() => {
                                                            const srcFromResolve = product.imagenClave ? resolveImage(product.imagenClave) : null;
                                                            const imgSrc = product.imageUrl || srcFromResolve || null;
                                                            if (imgSrc) {
                                                                return <img src={imgSrc} alt={product.name} style={{width: '64px', height: '64px', objectFit: 'cover'}} />;
                                                            }
                                                            return <div style={{width: '64px', height: '64px', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', color:'#666'}}>—</div>;
                                                        })()}
                                                    </td>
                                                    <td style={{color: '#000'}}>{product.id}</td>
                                                    <td><strong style={{color: '#000'}}>{product.name}</strong></td>
                                                    <td style={{color: '#000'}}>{product.category}</td>
                                                    <td style={{color: '#000'}}>${(product.price || 0).toLocaleString('es-CL')} CLP</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(product.stock === 0 ? 'Agotado' : (product.stock < 3 ? 'Stock crítico' : (product.stock < 5 ? 'Stock bajo' : 'En stock')))}`}>
                                                            {product.stock} unidades
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(product.stock === 0 ? 'Agotado' : (product.stock < 3 ? 'Stock crítico' : (product.stock < 5 ? 'Stock bajo' : 'En stock')))}`}>
                                                            {product.stock === 0 ? 'Agotado' : (product.stock < 3 ? 'Stock crítico' : (product.stock < 5 ? 'Stock bajo' : 'En stock'))}
                                                        </span>
                                                    </td>
                                                    <td style={{color: '#000'}}>-</td>
                                                    <td style={{color: '#000'}}>{product.lastRestock ? product.lastRestock : '-'}</td>
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination controls for inventory table */}
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prev</button>
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages}>Next</button>
                                    </div>
                                    <div>
                                        <small className="text-muted">Página {page} — Mostrando {Math.max(0, Math.min(productsPerPage, inventory.length - ((page-1)*productsPerPage)))} de {inventory.length} productos</small>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña: Personal - administrar empleados (crear/listar) */}
                {activeTab === 'personal' && (
                    <div className="tab-content">
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <strong>Personal</strong>
                                        <small className="text-muted">Agregar nuevo empleado</small>
                                    </div>
                                    <div className="card-body">
                                        <PersonalSection />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'manager' && (
                    <AdminManager />
                )}
            </div>

            {/* Footer global se renderiza en App.jsx */}
        </div>
    );
}

export default Admin;