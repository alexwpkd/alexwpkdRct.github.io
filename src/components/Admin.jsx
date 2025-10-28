// src/components/Admin.jsx
import React, { useState } from 'react';
import { useProductData } from './ProductData';
import ScrollButton from './ScrollButton.jsx';
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Botón de scroll suave */}
            <div className="text-center" style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
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
                            <li className="nav-item">
                                <button 
                                    className="nav-link disabled"
                                    style={{ pointerEvents: 'none', opacity: 0.6 }}
                                >
                                    <i className="fas fa-chart-line me-2"></i>
                                    Ventas
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className="nav-link disabled"
                                    style={{ pointerEvents: 'none', opacity: 0.6 }}
                                >
                                    <i className="fas fa-users me-2"></i>
                                    Personal
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className="nav-link disabled"
                                    style={{ pointerEvents: 'none', opacity: 0.6 }}
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
                                    <table className="table table-bordered table-hover">                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-white-custom">ID</th>
                                                <th className="text-white-custom">Producto</th>
                                                <th className="text-white-custom">Categoría</th>
                                                <th className="text-white-custom">Precio</th>
                                                <th className="text-white-custom">Stock</th>
                                                <th className="text-white-custom">Estado</th>
                                                <th className="text-white-custom">Ventas</th>
                                                <th className="text-white-custom">Última Reposición</th>
                                                <th className="text-white-custom">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>                                            {inventory.map(product => (
                                                <tr key={product.id}>
                                                    <td style={{color: '#000'}}>{product.id}</td>
                                                    <td><strong style={{color: '#000'}}>{product.name}</strong></td>
                                                    <td style={{color: '#000'}}>{product.category}</td>
                                                    <td style={{color: '#000'}}>${product.price.toLocaleString('es-CL')} CLP</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(product.stock === 0 ? 'Agotado' : (product.stock < 3 ? 'Stock crítico' : (product.stock < 5 ? 'Stock bajo' : 'En stock')))}`}>
                                                            {product.stock} unidades
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(product.stock === 0 ? 'Agotado' : (product.stock < 3 ? 'Stock crítico' : (product.stock < 5 ? 'Stock bajo' : 'En stock')))}`}>
                                                            {product.stock === 0 ? 'Agotado' : (product.stock < 3 ? 'Stock crítico' : (product.stock < 5 ? 'Stock bajo' : 'En stock'))}
                                                        </span>                                                    </td>
                                                    <td style={{color: '#000'}}>-</td>
                                                    <td style={{color: '#000'}}>{product.lastRestock ? product.lastRestock : '-'}</td>
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
            </div>

            {/* Footer global se renderiza en App.jsx */}
        </div>
    );
}

export default Admin;