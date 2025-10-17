// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import useProductData from './ProductData';

function Home() {
    const { getFeaturedProducts } = useProductData();
    const featuredProducts = getFeaturedProducts(3);

    return (
        <div className="Home">
            <Header />
            
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
                                        <Link to="/shop" className="boxed-btn">Explorar Tienda</Link>
                                        <Link to="/about" className="bordered-btn">Conoce Más</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end hero area */}

            {/* Sección de Características */}
            <div className="list-section pt-80 pb-80">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-lg-4 col-md-6">
                            <div className="list-box">
                                <div className="list-icon">
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
                                <div className="list-icon">
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
                                <div className="list-icon">
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
                                <div className="single-product-item">
                                    <div className="product-image">
                                        <Link to={`/product/${product.id}`}>
                                            <img src={`/assets/img/products/${product.imageKey}.jpg`} alt={product.name} />
                                        </Link>
                                    </div>
                                    <h3>{product.name}</h3>
                                    <p className="product-price"><span>Precio</span> {product.price}</p>
                                    <Link to={`/product/${product.id}`} className="cart-btn">
                                        <i className="fas fa-eye"></i> Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <Link to="/shop" className="boxed-btn mt-4">
                                <i className="fas fa-store me-2"></i>
                                Ver Todos los Productos
                            </Link>
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
                                <p>Únete a la comunidad Alpha Squad y lleva tu equipo al siguiente nivel</p>
                                <div className="cta-btns">
                                    <Link to="/contact" className="boxed-btn">Regístrate</Link>
                                    <Link to="/about" className="bordered-btn">Nuestra Historia</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
