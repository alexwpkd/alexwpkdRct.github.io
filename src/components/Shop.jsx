import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import images from '../assets/images/index.js';
import useProductData from './ProductData';

function Shop() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Usar el hook personalizado de datos
    const { products, categories, getProductsByCategory } = useProductData();

    // Filtrar productos por categoría Y búsqueda
    const filteredProducts = getProductsByCategory(selectedCategory).filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const productsPerPage = 6;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    const handleAddToCart = (product) => {
        console.log('Producto agregado:', product);
        alert(`${product.name} agregado al carrito`);
    };

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

    return (
        <div className="Shop">
            <Header />
            
            {/* breadcrumb */}
            <div className="breadcrumb-section breadcrumb-bg">
                <div className="container text-center">
                    <h1>Tienda</h1>
                    <p>Explora nuestra selección de réplicas, accesorios y equipamiento táctico.</p>
                </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="container mt-4">
                <div className="row">
                    {/* Buscador */}
                    <div className="col-lg-6 mb-3">
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

                    {/* Selector de Categorías */}
                    <div className="col-lg-6 mb-3">
                        <div className="category-selector">
                            <label className="form-label">Filtrar por categoría:</label>
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

                {/* Filtros Rápidos con Botones */}
                <div className="row">
                    <div className="col-12">
                        <div className="quick-filters">
                            <label className="filter-label">Categorías rápidas:</label>
                            <div className="filter-buttons">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de Filtros Activos */}
            {(selectedCategory !== 'all' || searchTerm) && (
                <div className="container mt-3">
                    <div className="active-filters">
                        <div className="filter-tags">
                            {selectedCategory !== 'all' && (
                                <span className="filter-tag">
                                    Categoría: {categories.find(cat => cat.id === selectedCategory)?.name}
                                    <button 
                                        onClick={() => handleCategoryChange('all')}
                                        className="remove-filter"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {searchTerm && (
                                <span className="filter-tag">
                                    Búsqueda: "{searchTerm}"
                                    <button 
                                        onClick={clearSearch}
                                        className="remove-filter"
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {(selectedCategory !== 'all' || searchTerm) && (
                                <button 
                                    className="clear-all-filters"
                                    onClick={() => {
                                        handleCategoryChange('all');
                                        clearSearch();
                                    }}
                                >
                                    Limpiar todos los filtros
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* products */}
            <div className="product-section mt-50 mb-150">
                <div className="container">
                    <div className="row product-lists">
                        {currentProducts.length > 0 ? (
                            currentProducts.map(product => (
                                <div key={product.id} className="col-lg-4 col-md-6 text-center">
                                    <div className="single-product-item">
                                        <div className="product-image">
                                            <Link to={`/product/${product.id}`}>
                                                <img 
                                                    src={images[`products/${product.imageKey}`]} 
                                                    alt={product.name}
                                                />
                                            </Link>
                                            {!product.inStock && (
                                                <div className="out-of-stock">Agotado</div>
                                            )}
                                        </div>
                                        <h3>{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <p className="product-price">
                                            <span>Precio</span> {product.price}
                                        </p>
                                        <button 
                                            className={`cart-btn ${!product.inStock ? 'disabled' : ''}`}
                                            onClick={() => product.inStock && handleAddToCart(product)}
                                            disabled={!product.inStock}
                                        >
                                            <i className="fas fa-shopping-cart"></i> 
                                            {product.inStock ? 'Agregar' : 'Agotado'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <div className="no-products-found">
                                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                    <h4>No se encontraron productos</h4>
                                    <p>
                                        {searchTerm 
                                            ? `No hay resultados para "${searchTerm}" en ${selectedCategory !== 'all' ? categories.find(cat => cat.id === selectedCategory)?.name : 'todas las categorías'}`
                                            : `No hay productos en la categoría ${categories.find(cat => cat.id === selectedCategory)?.name}`
                                        }
                                    </p>
                                    <button 
                                        className="btn btn-primary mt-2"
                                        onClick={() => {
                                            handleCategoryChange('all');
                                            clearSearch();
                                        }}
                                    >
                                        <i className="fas fa-store me-2"></i>
                                        Ver todos los productos
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

            <Footer />
        </div>
    );
}

export default Shop;