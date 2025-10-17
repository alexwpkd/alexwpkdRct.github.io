import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import images from '../assets/images/index.js';
import useProductData from './ProductData';

function Shop() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Usar el hook personalizado de datos
    const { products, categories, getProductsByCategory } = useProductData();

    // Filtrar productos por categoría
    const filteredProducts = getProductsByCategory(selectedCategory);

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

            {/* Filtros de categoría */}
            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="category-filters text-center">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                                <p>No hay productos en esta categoría.</p>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <div className="pagination-wrap">
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