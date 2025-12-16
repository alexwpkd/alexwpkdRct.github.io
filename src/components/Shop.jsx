import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductData from './ProductData.jsx';
import Hero from './Hero.jsx';
import ScrollButton from './ScrollButton.jsx';
import '../assets/css/shop.css';
import api, { getAuthHeaders } from '../utils.js';
import { emitToast } from '../utils/toast.js';

function Shop({ agregarAlCarrito }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Usar el hook personalizado de datos (ESPAÑOL) como fallback
    const { productos: productosLocal, CATEGORIAS, porCategoria, img, CLP } = useProductData();

    const [productos, setProductos] = useState(productosLocal);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mapeo de categorías para UI
    const categories = [
        { id: 'all', name: '🏪 Todos' },
        ...CATEGORIAS.map(id => ({ id, name: id }))
    ];

    // Filtrar productos por categoría Y búsqueda
    const filteredProducts = (selectedCategory === 'all' ? productos : productos.filter(p => p.categoria === selectedCategory)).filter(producto => 
        (producto.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((producto.categoria || '').toString().replace(/_/g, ' ')).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const productsPerPage = 6;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setSearchTerm(''); // Limpiar búsqueda al cambiar categoría
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a primera página al buscar
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const pages = [...Array(totalPages)].map((_, index) => index + 1);

    useEffect(() => {
        let mounted = true;
        const loadProducts = async () => {
            setLoading(true);
            try {
                const resp = await api.get('/api/productos');
                const list = resp.data || [];
                // Mapear a la estructura que usa la UI
                const mapped = list.map(p => ({
                    id: p.idProducto ?? p.id,
                    nombre: p.nombre ?? p.name,
                    descripcion: p.descripcion ?? p.description ?? '',
                    precio: p.precio ?? p.price ?? 0,
                    enStock: (p.stock ?? p.stockDisponible ?? 0) > 0,
                    stock: p.stock ?? p.stockDisponible ?? 0,
                    categoria: p.categoria ?? p.category ?? 'all',
                    imagenClave: p.imagenClave ?? p.imagenClave ?? null,
                    imageUrl: p.imagenUrl ?? p.imagen ?? null
                }));
                if (mounted) setProductos(mapped.length ? mapped : productosLocal);
            } catch (err) {
                console.warn('No se pudo cargar productos desde backend, usando catálogo local', err);
                if (mounted) {
                    setProductos(productosLocal);
                    setError(err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadProducts();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="Shop">
            <Hero title="Tienda Arsenal" />
            
            {/* Botón de scroll suave */}
            <div className="text-center" style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
                <ScrollButton targetSelector=".container.mt-4" playShots={false} />
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-8 mx-auto mb-3">
                        <div className="search-box">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control search-input"
                                    placeholder="🔍 Buscar productos..." 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <button 
                                        className="btn btn-outline-secondary clear-search" 
                                        type="button"
                                        onClick={clearSearch}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            {searchTerm && (
                                <div className="search-results-info mt-2">
                                    <small className="text-muted">
                                        {filteredProducts.length} producto(s) encontrado(s) para "{searchTerm}"
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <div className="category-selector">
                            <label className="form-label" style={{color:'#fff', fontWeight:'bold'}}>Filtrar por categoría:</label>
                            <select 
                                className="form-select category-dropdown"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {/* products */}
            <div className="product-section mt-50 mb-150">
                <div className="container">
                    <div className="row product-lists">
                        {currentProducts.length > 0 ? (
                            currentProducts.map(producto => (
                                <div key={producto.id} className="col-lg-4 col-md-6 text-center mb-4">
                                    <div className="single-product-item product-bg">
                                        <div className="product-image">
                                            <Link to={`/product/${producto.id}`}>
                                                <img 
                                                    src={producto.imageUrl ? producto.imageUrl : img(producto.imagenClave)} 
                                                    alt={producto.nombre}
                                                />
                                            </Link>
                                            {!producto.enStock && (
                                                <div className="out-of-stock">Agotado</div>
                                            )}
                                        </div>
                                        <div className="product-content">
                                            <h3 className="text-white-custom">{producto.nombre}</h3>
                                            <p className="product-description text-white-custom">{producto.descripcion}</p>
                                            <p className="product-price text-white-custom">
                                                <span className="text-white-custom">Precio</span> {CLP(producto.precio)}
                                            </p>
                                            <button 
                                                className={`cart-btn btn-custom text-white-custom ${!producto.enStock ? 'disabled' : ''}`}
                                                onClick={() => {
                                                    if (producto.enStock) {
                                                        agregarAlCarrito({
                                                            id: producto.id,
                                                            nombre: producto.nombre,
                                                            precio: producto.precio,
                                                            stock: producto.stock || producto.enStock || 1
                                                        }, 1);
                                                        emitToast(`${producto.nombre} agregado al carrito`, 'success');
                                                    }
                                                }}
                                                disabled={!producto.enStock}
                                            >
                                                <i className="fas fa-shopping-cart"></i> 
                                                {producto.enStock ? 'Agregar' : 'Agotado'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <div className="no-products-found">
                                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                    <h4>No se encontraron productos</h4>
                                    <p>No hay productos en esta categoría.</p>                                    <button 
                                        className="btn btn-primary mt-2"
                                        onClick={() => handleCategoryChange('all')}
                                    >
                                        <i className="fas fa-store me-2"></i>
                                        <span className="text-white-custom">Ver todos los productos</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <div className="pagination-wrap">
                                    <div className="pagination-info mb-2">
                                        <small className="text-muted">
                                            Página {currentPage} de {totalPages} - {filteredProducts.length} producto(s) en total
                                        </small>
                                    </div>
                                    <ul>
                                        <li>
                                            <button 
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Prev
                                            </button>
                                        </li>
                                        {pages.map(page => (
                                            <li key={page}>
                                                <button
                                                    className={currentPage === page ? 'active' : ''}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button 
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Shop;