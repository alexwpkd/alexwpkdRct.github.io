// src/components/Product.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import images from '../assets/images/index.js';
import useProductData from './ProductData.jsx';
import Hero from './Hero.jsx';

function Product({ agregarAlCarrito }) {
    const { id } = useParams();
    const { getProductById, getProductsByCategory } = useProductData();
    const [quantity, setQuantity] = useState(1);

    const product = getProductById(id);
    
    // Si no encuentra el producto
    if (!product) {
        return (
            <div className="Product">
                <Header />
                <div className="breadcrumb-section breadcrumb-bg">
                    <div className="container text-center">
                        <h1>Producto No Encontrado</h1>
                        <p>El producto que buscas no existe.</p>
                    </div>
                </div>
                <div className="container text-center mt-5">
                    <Link to="/shop" className="boxed-btn">Volver a la Tienda</Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Obtener productos relacionados (misma categoría, excluyendo el actual)
    const relatedProducts = getProductsByCategory(product.category)
        .filter(p => p.id !== product.id)
        .slice(0, 3);

    const handleAddToCart = () => {
        if (product.inStock) {
            agregarAlCarrito({
                id: product.id,
                nombre: product.name,
                precio: product.priceNumber,
                stock: product.stock,
            }, quantity);
            alert(`${product.name} agregado al carrito`);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    return (
        <div className="Product">
            <Hero title="Detalle del Producto" />

            {/* single product */}
            <div className="single-product mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="single-product-img">
                                <img 
                                    src={images[product.imageKey]} 
                                    alt={product.name}
                                />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="single-product-content">
                                <h3>{product.name}</h3>
                                <p className="single-product-pricing" style={{color:'#737373', fontWeight:'bold', fontSize:'1.3em'}}>
                                    <span style={{color:'#737373', fontWeight:'bold'}}>Precio</span> {product.price}
                                </p>
                                <p style={{color:'#737373', fontWeight:'bold'}}>{product.description}</p>
                                
                                <div className="single-product-form">
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
                                        <input 
                                            type="number" 
                                            placeholder="1" 
                                            min="1" 
                                            max={product.stock}
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            disabled={!product.inStock}
                                        />
                                        <button 
                                            type="submit" 
                                            className={`cart-btn btn-custom ${!product.inStock ? 'disabled' : ''}`}
                                            disabled={!product.inStock}
                                        >
                                            <i className="fas fa-shopping-cart"></i> 
                                            {product.inStock ? 'Agregar al arsenal' : 'Agotado'}
                                        </button>
                                    </form>
                                    {/* Categoría eliminada */}
                                    <p>
                                        <strong>Estado:</strong> 
                                        <span className={product.inStock ? 'text-success' : 'text-danger'}>
                                            {product.inStock ? ' En stock' : ' Agotado'}
                                        </span>
                                    </p>
                                </div>
                                
                                <h4>Características</h4>
                                <ul>
                                    {product.features && product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>

                                {/* Información técnica adicional */}
                                <h4 className="mt-4">Especificaciones Técnicas</h4>
                                <div className="specifications">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Material:</strong> Metal y polímero reforzado</p>
                                            <p><strong>Velocidad de salida:</strong> 400 FPS</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Modo de disparo:</strong> Semi / Auto</p>
                                            <p><strong>Capacidad del cargador:</strong> 300 BBs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos relacionados */}
                    {relatedProducts.length > 0 && (
                        <>
                            <div className="row mt-100">
                                <div className="col-lg-8 offset-lg-2 text-center">
                                    <h4>Productos relacionados</h4>
                                    <p>Descubre otros productos de la misma categoría</p>
                                </div>
                            </div>

                            <div className="row mt-50">
                                {relatedProducts.map(relatedProduct => (
                                    <div key={relatedProduct.id} className="col-lg-4 col-md-6 text-center">
                                        <div className="single-product-item product-bg">
                                            <div className="product-image">
                                                <Link to={`/product/${relatedProduct.id}`}>
                                                    <img 
                                                        src={images[relatedProduct.imageKey]} 
                                                        alt={relatedProduct.name}
                                                    />
                                                </Link>
                                                {!relatedProduct.inStock && (
                                                    <div className="out-of-stock">Agotado</div>
                                                )}
                                            </div>
                                            <h3 style={{color:'#fff'}}>{relatedProduct.name}</h3>
                                            <p className="product-price" style={{color:'#fff'}}>
                                                <span>Precio</span>{relatedProduct.price}
                                            </p>
                                            <Link 
                                                to={`/product/${relatedProduct.id}`}
                                                className="cart-btn btn-custom"
                                            >
                                                <i className="fas fa-eye"></i> Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Botón para volver a la tienda */}
                    <div className="row mt-50">
                        <div className="col-12 text-center">
                            <Link to="/shop" className="boxed-btn">
                                <i className="fas fa-arrow-left"></i> Volver a la Tienda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Product;