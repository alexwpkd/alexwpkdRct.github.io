// src/components/Product.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import images from '../assets/images/index.js';
import api from '../api/api';
import Hero from './Hero.jsx';

function Product({ agregarAlCarrito }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/productos/${id}`);
                const p = res.data;
                // normalize to the shape previous components used
                const normalized = {
                    id: p.idProducto ?? p.id,
                    name: p.nombre ?? p.name,
                    description: p.descripcion ?? p.description,
                    price: p.precio ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(p.precio) : p.price,
                    priceNumber: p.precio ?? p.priceNumber ?? null,
                    stock: p.stock ?? p.cantidad ?? null,
                    inStock: p.enStock ?? p.inStock ?? (p.stock > 0),
                    imageKey: p.imagenClave ?? null,
                    imagen: p.imagen ?? null,
                    features: p.features ?? [],
                    category: p.categoria ?? p.category ?? null,
                    __raw: p,
                };
                setProduct(normalized);

                // fetch all products and compute related by category (simple)
                if (normalized.category) {
                    const listRes = await api.get('/api/productos');
                    const all = listRes.data || [];
                    const related = all
                        .filter(x => (x.categoria ?? x.category) === (p.categoria ?? p.category) && (x.idProducto ?? x.id) !== normalized.id)
                        .slice(0, 3)
                        .map(x => ({
                            id: x.idProducto ?? x.id,
                            name: x.nombre ?? x.name,
                            price: x.precio ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(x.precio) : x.price,
                            priceNumber: x.precio ?? x.priceNumber ?? null,
                            stock: x.stock ?? x.cantidad ?? null,
                            inStock: x.enStock ?? x.inStock ?? (x.stock > 0),
                            imageKey: x.imagenClave ?? null,
                            imagen: x.imagen ?? null,
                        }));
                    setRelatedProducts(related);
                }

            } catch (err) {
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
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
        if (value > 0) setQuantity(value);
    };

    if (loading) return <div className="container py-4">Cargando producto...</div>;
    if (!product) return (
        <div className="container text-center py-5">
            <h1>Producto No Encontrado</h1>
            <p>El producto que buscas no existe.</p>
            <Link to="/shop" className="boxed-btn">Volver a la Tienda</Link>
        </div>
    );

    return (
        <div className="Product">
            <Hero title="Detalle del Producto" />

            <div className="single-product mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="single-product-img">
                                {/* use local mapping if available, otherwise backend uploads folder */}
                                <img
                                    src={product.imageKey ? images[product.imageKey] : (product.imagen ? `http://localhost:8080/uploads/${product.imagen}` : '')}
                                    alt={product.name}
                                />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="single-product-content">
                                <h3 className="text-white-custom">{product.name}</h3>
                                <p className="single-product-pricing text-white-custom" style={{fontWeight:'bold', fontSize:'1.3em'}}>
                                    <span className="text-white-custom" style={{fontWeight:'bold'}}>Precio</span> {product.price}
                                </p>
                                <p className="text-white-custom" style={{fontWeight:'bold'}}>{product.description}</p>

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

                                    <p className="text-white-custom">
                                        <strong>Estado:</strong>
                                        <span className={product.inStock ? 'text-success' : 'text-danger'}>
                                            {product.inStock ? ' En stock' : ' Agotado'}
                                        </span>
                                    </p>
                                </div>

                                <h4 className="text-white-custom">Características</h4>
                                <ul className="text-white-custom">
                                    {product.features && product.features.map((feature, index) => (
                                        <li key={index} className="text-white-custom">{feature}</li>
                                    ))}
                                </ul>

                                <h4 className="mt-4 text-white-custom">Especificaciones Técnicas</h4>
                                <div className="specifications">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p className="text-white-custom"><strong>Material:</strong> Metal y polímero reforzado</p>
                                            <p className="text-white-custom"><strong>Velocidad de salida:</strong> 400 FPS</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="text-white-custom"><strong>Modo de disparo:</strong> Semi / Auto</p>
                                            <p className="text-white-custom"><strong>Capacidad del cargador:</strong> 300 BBs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                                        src={relatedProduct.imageKey ? images[relatedProduct.imageKey] : (relatedProduct.imagen ? `http://localhost:8080/uploads/${relatedProduct.imagen}` : '')}
                                                        alt={relatedProduct.name}
                                                    />
                                                </Link>
                                                {!relatedProduct.inStock && (
                                                    <div className="out-of-stock">Agotado</div>
                                                )}
                                            </div>
                                            <h3 style={{color:'#fff'}}>{relatedProduct.name}</h3>
                                            <p className="product-price text-white-custom">
                                                <span className="text-white-custom">Precio</span>{relatedProduct.price}
                                            </p>
                                            <Link
                                                to={`/product/${relatedProduct.id}`}
                                                className="cart-btn btn-custom text-white-custom"
                                            >
                                                <i className="fas fa-eye"></i> Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

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