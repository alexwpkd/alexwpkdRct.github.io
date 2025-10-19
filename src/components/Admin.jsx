// src/components/Admin.jsx
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function Admin() {
    // Estados principales
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventory, setInventory] = useState([
        {
            id: 1,
            name: "Réplica Specna Arms CORE C03 Half tan",
            category: "Rifles",
            stock: 15,
            price: 114500,
            cost: 80000,
            sales: 15,
            lastRestock: "2024-01-10",
            status: "En stock"
        },
        {
            id: 2,
            name: "KRYTAC KRISS VECTOR GBB",
            category: "Subfusiles", 
            stock: 5,
            price: 649990,
            cost: 500000,
            sales: 5,
            lastRestock: "2024-01-08",
            status: "Stock bajo"
        },
        {
            id: 3,
            name: "Réplica HK416 DEVGRU",
            category: "Rifles",
            stock: 8,
            price: 720000,
            cost: 550000,
            sales: 8,
            lastRestock: "2024-01-12",
            status: "En stock"
        },
        {
            id: 4,
            name: "KRYTAC P90 Alpine Edition",
            category: "Subfusiles",
            stock: 3,
            price: 909990,
            cost: 700000,
            sales: 2,
            lastRestock: "2024-01-05",
            status: "Stock crítico"
        },
        {
            id: 5,
            name: "Tokyo Marui Hi-Capa 5.1",
            category: "Pistolas",
            stock: 0,
            price: 289990,
            cost: 200000,
            sales: 10,
            lastRestock: "2023-12-20",
            status: "Agotado"
        }
    ]);

    const [staffUsers, setStaffUsers] = useState([
        {
            id: 1,
            name: "Alex Rios",
            email: "alex.rios@duocuc.cl",
            role: "Administrador",
            department: "Gestión",
            status: "Activo",
            joinDate: "2024-01-01"
        },
        {
            id: 2, 
            name: "Dylan Rodriguez",
            email: "dylan.rodriguez@duocuc.cl",
            role: "Ventas",
            department: "Comercial",
            status: "Activo",
            joinDate: "2024-01-01"
        }
    ]);

    const [sales, _setSales] = useState([
        {
            id: 1001,
            productId: 1,
            productName: "Réplica Specna Arms CORE C03 Half tan",
            customer: "Juan Pérez",
            quantity: 1,
            total: 114500,
            date: "2024-01-15",
            status: "Completada"
        },
        {
            id: 1002,
            productId: 3,
            productName: "Réplica HK416 DEVGRU", 
            customer: "María González",
            quantity: 1,
            total: 720000,
            date: "2024-01-14",
            status: "Completada"
        },
        {
            id: 1003,
            productId: 2,
            productName: "KRYTAC KRISS VECTOR GBB",
            customer: "Carlos López",
            quantity: 1,
            total: 649990,
            date: "2024-01-13",
            status: "Completada"
        }
    ]);

    // Estado para formularios
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Ventas',
        department: 'Comercial'
    });

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

    // Cálculos de estadísticas
    const totalProducts = inventory.length;
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalUnitsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const lowStockProducts = inventory.filter(product => product.stock < 5).length;

    const inventoryValue = inventory.reduce((sum, product) => sum + (product.stock * product.cost), 0);
    const potentialRevenue = inventory.reduce((sum, product) => sum + (product.stock * product.price), 0);

    // Funciones de gestión
    const handleAddStock = (productId, quantity) => {
        if (!quantity || quantity <= 0) {
            alert('Por favor ingresa una cantidad válida');
            return;
        }

        setInventory(prev => prev.map(product => 
            product.id === productId 
                ? { 
                    ...product, 
                    stock: product.stock + quantity,
                    status: product.stock + quantity >= 10 ? 'En stock' : 
                           product.stock + quantity >= 5 ? 'Stock bajo' : 'Stock crítico'
                }
                : product
        ));
        setNewStock(prev => ({ ...prev, [productId]: '' }));
        alert(`✅ Stock actualizado: +${quantity} unidades agregadas al producto ID: ${productId}`);
    };

    const handleAddStaffUser = (e) => {
        e.preventDefault();
        
        // Validar email duocuc
        if (!newUser.email.endsWith('@duocuc.cl')) {
            alert('❌ Solo se permiten correos institucionales @duocuc.cl');
            return;
        }

        // Validar que no exista el email
        if (staffUsers.some(user => user.email === newUser.email)) {
            alert('❌ Este correo ya está registrado en el sistema');
            return;
        }

        const newStaff = {
            id: staffUsers.length + 1,
            ...newUser,
            status: 'Activo',
            joinDate: new Date().toISOString().split('T')[0]
        };

        setStaffUsers(prev => [...prev, newStaff]);
        setNewUser({
            name: '',
            email: '',
            role: 'Ventas',
            department: 'Comercial'
        });
        
        alert('✅ Usuario de personal agregado exitosamente');
    };

    const handleDeleteStaff = (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            setStaffUsers(prev => prev.filter(user => user.id !== userId));
            alert('✅ Usuario eliminado exitosamente');
        }
    };

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

    return (
        <div className="Admin">
            <Header />
            
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
                            </div>
                        </div>
                    </div>
                </div>
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
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('sales')}
                                >
                                    <i className="fas fa-chart-line me-2"></i>
                                    Ventas
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'staff' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('staff')}
                                >
                                    <i className="fas fa-users me-2"></i>
                                    Personal
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('reports')}
                                >
                                    <i className="fas fa-file-alt me-2"></i>
                                    Reportes
                                </button>
                            </li>
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
                                    <div className={`card bg-${stat.color} text-white`}>
                                        <div className="card-body text-center">
                                            <i className={`fas ${stat.icon} fa-2x mb-2`}></i>
                                            <h5>{stat.title}</h5>
                                            <h3>{stat.value}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fas fa-boxes me-2"></i>
                                    Inventario de Productos
                                </span>
                                <button 
                                    className="btn btn-light btn-sm"
                                    onClick={generateInventoryReport}
                                >
                                    <i className="fas fa-file-export me-1"></i>
                                    Generar Reporte
                                </button>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Producto</th>
                                                <th>Categoría</th>
                                                <th>Precio</th>
                                                <th>Stock</th>
                                                <th>Estado</th>
                                                <th>Ventas</th>
                                                <th>Última Reposición</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventory.map(product => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td><strong>{product.name}</strong></td>
                                                    <td>{product.category}</td>
                                                    <td>{formatCurrency(product.price)}</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(product.status)}`}>
                                                            {product.stock} unidades
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(product.status)}`}>
                                                            {product.status}
                                                        </span>
                                                    </td>
                                                    <td>{product.sales} unidades</td>
                                                    <td>{product.lastRestock}</td>
                                                    <td>
                                                        <div className="input-group input-group-sm" style={{width: '200px'}}>
                                                            <input 
                                                                type="number" 
                                                                className="form-control" 
                                                                placeholder="Cantidad"
                                                                value={newStock[product.id] || ''}
                                                                onChange={(e) => setNewStock(prev => ({
                                                                    ...prev, 
                                                                    [product.id]: parseInt(e.target.value) || ''
                                                                }))}
                                                                min="1"
                                                            />
                                                            <button 
                                                                className="btn btn-success"
                                                                onClick={() => handleAddStock(product.id, parseInt(newStock[product.id]) || 0)}
                                                                disabled={!newStock[product.id]}
                                                            >
                                                                <i className="fas fa-plus"></i> Reponer
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña: Ventas */}
                {activeTab === 'sales' && (
                    <div className="tab-content">
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="alert alert-success">
                                    <i className="fas fa-chart-line me-2"></i>
                                    Resumen de ventas y transacciones
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            {[
                                { title: 'Ventas Totales', value: sales.length, icon: 'fa-shopping-cart', color: 'success' },
                                { title: 'Ingresos Totales', value: formatCurrency(totalSales), icon: 'fa-money-bill-wave', color: 'primary' },
                                { title: 'Unidades Vendidas', value: totalUnitsSold, icon: 'fa-box-open', color: 'info' },
                                { title: 'Ticket Promedio', value: formatCurrency(sales.length > 0 ? totalSales / sales.length : 0), icon: 'fa-chart-bar', color: 'warning' }
                            ].map((stat, index) => (
                                <div key={index} className="col-md-3 mb-3">
                                    <div className={`card bg-${stat.color} text-white`}>
                                        <div className="card-body text-center">
                                            <i className={`fas ${stat.icon} fa-2x mb-2`}></i>
                                            <h5>{stat.title}</h5>
                                            <h3>{stat.value}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <i className="fas fa-list me-2"></i>
                                Historial de Ventas
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>ID Venta</th>
                                                <th>Producto</th>
                                                <th>Cliente</th>
                                                <th>Cantidad</th>
                                                <th>Total</th>
                                                <th>Fecha</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sales.map(sale => (
                                                <tr key={sale.id}>
                                                    <td>#{sale.id}</td>
                                                    <td>{sale.productName}</td>
                                                    <td>{sale.customer}</td>
                                                    <td>{sale.quantity}</td>
                                                    <td className="text-success">
                                                        <strong>{formatCurrency(sale.total)}</strong>
                                                    </td>
                                                    <td>{sale.date}</td>
                                                    <td>
                                                        <span className="badge bg-success">{sale.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña: Personal */}
                {activeTab === 'staff' && (
                    <div className="tab-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-info text-white">
                                        <i className="fas fa-user-plus me-2"></i>
                                        Agregar Nuevo Personal
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleAddStaffUser}>
                                            <div className="mb-3">
                                                <label className="form-label">Nombre Completo</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={newUser.name}
                                                    onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email Institucional</label>
                                                <input 
                                                    type="email" 
                                                    className="form-control"
                                                    placeholder="usuario@duocuc.cl"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                                                    required
                                                />
                                                <div className="form-text">Solo se permiten correos @duocuc.cl</div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Rol</label>
                                                <select 
                                                    className="form-control"
                                                    value={newUser.role}
                                                    onChange={(e) => setNewUser(prev => ({...prev, role: e.target.value}))}
                                                >
                                                    <option value="Ventas">Ventas</option>
                                                    <option value="Administrador">Administrador</option>
                                                    <option value="Soporte">Soporte Técnico</option>
                                                    <option value="Inventario">Gestor de Inventario</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Departamento</label>
                                                <select 
                                                    className="form-control"
                                                    value={newUser.department}
                                                    onChange={(e) => setNewUser(prev => ({...prev, department: e.target.value}))}
                                                >
                                                    <option value="Comercial">Comercial</option>
                                                    <option value="Gestión">Gestión</option>
                                                    <option value="Técnico">Técnico</option>
                                                    <option value="Operaciones">Operaciones</option>
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-success w-100">
                                                <i className="fas fa-user-plus me-2"></i>
                                                Agregar Usuario
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header bg-warning text-white">
                                        <i className="fas fa-users me-2"></i>
                                        Personal Registrado ({staffUsers.length})
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Email</th>
                                                        <th>Rol</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {staffUsers.map(user => (
                                                        <tr key={user.id}>
                                                            <td>{user.name}</td>
                                                            <td>{user.email}</td>
                                                            <td>
                                                                <span className="badge bg-primary">{user.role}</span>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-success">{user.status}</span>
                                                            </td>
                                                            <td>
                                                                <button 
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDeleteStaff(user.id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña: Reportes */}
                {activeTab === 'reports' && (
                    <div className="tab-content">
                        <div className="row">
                            <div className="col-12">
                                <div className="alert alert-warning">
                                    <i className="fas fa-file-alt me-2"></i>
                                    Generación de reportes del sistema
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <i className="fas fa-boxes fa-3x text-primary mb-3"></i>
                                        <h5>Reporte de Inventario</h5>
                                        <p>Genera un reporte completo del inventario actual</p>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={generateInventoryReport}
                                        >
                                            <i className="fas fa-download me-2"></i>
                                            Generar Reporte
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <i className="fas fa-chart-line fa-3x text-success mb-3"></i>
                                        <h5>Reporte de Ventas</h5>
                                        <p>Reporte detallado de ventas y rendimiento</p>
                                        <button className="btn btn-success">
                                            <i className="fas fa-download me-2"></i>
                                            Generar Reporte
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <i className="fas fa-users fa-3x text-info mb-3"></i>
                                        <h5>Reporte de Personal</h5>
                                        <p>Informe del equipo y asignaciones</p>
                                        <button className="btn btn-info">
                                            <i className="fas fa-download me-2"></i>
                                            Generar Reporte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Admin;