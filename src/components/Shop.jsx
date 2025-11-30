import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProductos } from "../api/productoService";
import { agregarAlCarrito as apiAgregarAlCarrito } from "../api/carritoService";
import Hero from "./Hero.jsx";
import ScrollButton from "./ScrollButton.jsx";
import images from "../assets/images/index.js";
import "../assets/css/shop.css";

const CLP = (n) =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(n ?? 0);

function Shop() {
    const { auth } = useAuth();

    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ID de cliente provisto por el backend en el login
    const idCliente = auth?.user?.idCliente ?? null;

    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const data = await getProductos();
                setProductos(data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar productos");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const categoriasUnicas = Array.from(
        new Set(productos.map((p) => p.categoria).filter(Boolean))
    );

    const categories = [
        { id: "all", name: "🏪 Todos" },
        ...categoriasUnicas.map((id) => ({ id, name: id })),
    ];

    const baseList =
        selectedCategory === "all"
            ? productos
            : productos.filter((p) => p.categoria === selectedCategory);

    const filteredProducts = baseList.filter((producto) => {
        const term = searchTerm.toLowerCase();
        return (
            (producto.nombre || "").toLowerCase().includes(term) ||
            (producto.descripcion || "").toLowerCase().includes(term) ||
            (producto.categoria || "").replace(/_/g, " ").toLowerCase().includes(term)
        );
    });

    // paginación
    const productsPerPage = 6;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );
    const pages = [...Array(totalPages)].map((_, index) => index + 1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setSearchTerm("");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const getImageSrc = (producto) => {
        if (producto.imagenClave && images[producto.imagenClave]) {
            return images[producto.imagenClave];
        }
        if (producto.imagen) {
            return `http://localhost:8080/uploads/${producto.imagen}`;
        }
        return "";
    };

    const handleAgregar = async (producto) => {
        if (!idCliente) {
            alert("Debes iniciar sesión como cliente para agregar al carrito.");
            return;
        }
        try {
            const productoId = producto.idProducto ?? producto.id;
            await apiAgregarAlCarrito(idCliente, productoId, 1);
            alert(`${producto.nombre} agregado al carrito`);
        } catch (err) {
            console.error(err);
            alert("Error al agregar al carrito");
        }
    };

    if (loading) {
        return (
            <div className="Shop">
                <Hero title="Tienda Arsenal" />
                <div className="container mt-4">
                    <p className="text-white-custom">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Shop">
                <Hero title="Tienda Arsenal" />
                <div className="container mt-4">
                    <p className="text-white-custom">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="Shop">
            <Hero title="Tienda Arsenal" />

            {/* Botón de scroll suave */}
            <div
                className="text-center"
                style={{
                    marginTop: "-150px",
                    marginBottom: "80px",
                    position: "relative",
                    zIndex: 10,
                }}
            >
                <ScrollButton targetSelector=".container.mt-4" playShots={false} />
            </div>

            {/* Buscador + categorías */}
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
                            <label
                                className="form-label"
                                style={{ color: "#fff", fontWeight: "bold" }}
                            >
                                Filtrar por categoría:
                            </label>
                            <select
                                className="form-select category-dropdown"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="product-section mt-50 mb-150">
                <div className="container">
                    <div className="row product-lists">
                        {currentProducts.length > 0 ? (
                            currentProducts.map((producto) => (
                                <div
                                    key={producto.idProducto ?? producto.id}
                                    className="col-lg-4 col-md-6 text-center mb-4"
                                >
                                    <div className="single-product-item product-bg">
                                        <div className="product-image">
                                            <img
                                                src={getImageSrc(producto)}
                                                alt={producto.nombre}
                                            />
                                            {producto.stock === 0 && (
                                                <div className="out-of-stock">Agotado</div>
                                            )}
                                        </div>
                                        <div className="product-content">
                                            <h3 className="text-white-custom">{producto.nombre}</h3>
                                            <p className="product-description text-white-custom">
                                                {producto.descripcion}
                                            </p>
                                            <p className="product-price text-white-custom">
                                                <span className="text-white-custom">Precio</span>{" "}
                                                {CLP(producto.precio)}
                                            </p>
                                            <button
                                                className={`cart-btn btn-custom text-white-custom ${
                                                    producto.stock === 0 ? "disabled" : ""
                                                }`}
                                                onClick={() => handleAgregar(producto)}
                                                disabled={producto.stock === 0}
                                            >
                                                <i className="fas fa-shopping-cart"></i>{" "}
                                                {producto.stock === 0 ? "Agotado" : "Agregar"}
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
                                    <p>No hay productos en esta categoría.</p>
                                    <button
                                        className="btn btn-primary mt-2"
                                        onClick={() => handleCategoryChange("all")}
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
                                        {pages.map((page) => (
                                            <li key={page}>
                                                <button
                                                    className={currentPage === page ? "active" : ""}
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