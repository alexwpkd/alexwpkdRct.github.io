// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useProductData from './ProductData.jsx';
import images from '../assets/images/index.js';

function Home() {
    const { getFeaturedProducts } = useProductData();
    const featuredProducts = getFeaturedProducts(3);

    return (
        <div className="Home">
            
            {/* Hero Section - SOLO en el Home */}
            <div className="hero-area hero-bg hero-bg--parallax">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 offset-lg-2 text-center">
                            <div className="hero-text">
                                <div className="hero-text-tablecell">
                                    <h1>ALPHA SQUAD</h1>
                                    <p className="subtitle">Equipamiento táctico de elite para operaciones de precisión</p>
                                    <div className="hero-btns">
                                        <Link to="/shop" className="btn btn-custom">Explorar Tienda</Link>
                                        <Link to="/about" className="btn btn-custom ms-2">Conoce Más</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end hero area */}

            {/* ...otros bloques... */}

            {/* Productos Destacados */}
            <div className="product-section mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 text-center">
                            <div className="section-title">
                                <h3><span className="orange-text">Productos</span> Destacados</h3>
                                <p>Lo más vendido de nuestro catálogo táctico</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="col-lg-4 col-md-6 text-center">
                                <div className="single-product-item product-bg">
                                    <div className="product-image">
                                        <Link to={`/product/${product.id}`}>
                                            <img src={images[product.imageKey]} alt={product.name} />
                                        </Link>
                                    </div>
                                    <div className="product-content">
                                        <h3>{product.name}</h3>
                                        <p className="product-price"><span>Precio</span> {product.price}</p>
                                        <Link to={`/product/${product.id}`} className="btn btn-custom">
                                            <i className="fas fa-eye"></i> Ver Detalles
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <Link to="/shop" className="btn btn-custom mt-4">
                                <i className="fas fa-store me-2"></i>
                                Ver Todos los Productos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección CTA (si existe) */}
            <div className="cta-section cta-bg"></div>

            {/* Sección de Características (justo antes de la llamada a la acción) */}
            <div className="list-section pt-80 pb-80" style={{ marginTop: '40px' }}>
                <div className="container">
                    <div className="row text-center">
                        <div className="col-lg-4 col-md-6">
                            <div className="list-box">
                                <div className="list-icon" style={{ color: '#051922' }}>
                                    <i className="fas fa-shipping-fast"></i>
                                </div>
                                <div className="content">
                                    <h3>Envíos Express</h3>
                                    <p>Entrega en 24-48 horas en todo Chile</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="list-box">
                                <div className="list-icon" style={{ color: '#051922' }}>
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className="content">
                                    <h3>Calidad Garantizada</h3>
                                    <p>Productos testados y certificados</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="list-box">
                                <div className="list-icon" style={{ color: '#051922' }}>
                                    <i className="fas fa-headset"></i>
                                </div>
                                <div className="content">
                                    <h3>Soporte Expertos</h3>
                                    <p>Asesoría técnica especializada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Llamada a la Acción */}
            <div className="cta-section cta-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 text-center">
                            <div className="cta-text">
                                <h2>¿Listo para tu próxima misión?</h2>
                                <p style={{ color: '#737373' }}>Únete a la comunidad Alpha Squad y lleva tu equipo al siguiente nivel. Forma parte de un grupo de entusiastas. ¡Conoce, participa y potencia tu experiencia táctica!</p>
                                <div className="cta-btns">
                                    <Link to="/contact" className="btn btn-secondary">Regístrate</Link>
                                    <Link to="/about" className="btn btn-secondary ms-2">Nuestra Historia</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;
