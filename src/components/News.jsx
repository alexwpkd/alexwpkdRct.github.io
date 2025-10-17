// src/components/News.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import images from '../assets/images/index.js';

function News() {
    const [currentPage, setCurrentPage] = useState(2);

    const newsArticles = [
        {
            id: 1,
            title: "Nueva Llegada: Réplica HK416 DEVGRU Edición Especial",
            excerpt: "Descubre nuestra última adición al catálogo, la HK416 DEVGRU con mejoras en precisión y durabilidad para operaciones tácticas exigentes.",
            author: "Admin Alpha",
            date: "15 Enero, 2024",
            imageKey: "product-img-1",
            category: "Nuevos Productos"
        },
        {
            id: 2,
            title: "Torneo Nacional de Airsoft 2024 - Inscripciones Abiertas",
            excerpt: "Participa en el torneo más grande del año. Premios en equipamiento y reconocimiento nacional para los mejores equipos.",
            author: "Admin Alpha", 
            date: "12 Enero, 2024",
            imageKey: "product-img-2",
            category: "Eventos"
        },
        {
            id: 3,
            title: "Guía: Mantenimiento de Réplicas de Aire Comprimido",
            excerpt: "Aprende las mejores prácticas para mantener tus réplicas en óptimo estado y maximizar su vida útil.",
            author: "Soporte Técnico",
            date: "8 Enero, 2024",
            imageKey: "product-img-3",
            category: "Tutoriales"
        },
        {
            id: 4,
            title: "Actualización de Normativas de Seguridad 2024",
            excerpt: "Conoce los nuevos protocolos de seguridad para partidas de airsoft y mantente actualizado con las regulaciones.",
            author: "Admin Alpha",
            date: "5 Enero, 2024", 
            imageKey: "product-img-4",
            category: "Normativas"
        },
        {
            id: 5,
            title: "Oferta Especial: Kit Inicial para Principiantes",
            excerpt: "Lanzamos un kit completo con todo lo necesario para empezar en el mundo del airsoft con el mejor equipamiento.",
            author: "Admin Alpha",
            date: "3 Enero, 2024",
            imageKey: "product-img-5",
            category: "Ofertas"
        },
        {
            id: 6,
            title: "Entrevista: Equipo Táctico Delta en Campeonato Internacional",
            excerpt: "Conoce la experiencia del equipo Delta que representó a Chile en el campeonato internacional de airsoft.",
            author: "Comunicaciones",
            date: "28 Diciembre, 2023",
            imageKey: "product-img-6",
            category: "Entrevistas"
        }
    ];

    const partners = [
        { id: 1, logo: images['company-logos/1'], alt: "Partner 1" },
        { id: 2, logo: images['company-logos/2'], alt: "Partner 2" },
        { id: 3, logo: images['company-logos/3'], alt: "Partner 3" },
        { id: 4, logo: images['company-logos/4'], alt: "Partner 4" },
        { id: 5, logo: images['company-logos/5'], alt: "Partner 5" }
    ];

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const pages = [1, 2, 3];

    return (
        <div className="News">
            <Header />
            
            {/* breadcrumb-section */}
            <div className="breadcrumb-section breadcrumb-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 text-center">
                            <div className="breadcrumb-text">
                                <p>Información y Novedades</p>
                                <h1>Noticias Alpha Squad</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end breadcrumb section */}

            {/* latest news */}
            <div className="latest-news mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        {newsArticles.map(article => (
                            <div key={article.id} className="col-lg-4 col-md-6">
                                <div className="single-latest-news">
                                    <Link to={`/news/${article.id}`}>
                                        <div className="latest-news-bg">
                                            <img 
                                                src={images[`products/${article.imageKey}`]} 
                                                alt={article.title}
                                                style={{
                                                    width: '100%',
                                                    height: '250px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    </Link>
                                    <div className="news-text-box">
                                        <span className="news-category">{article.category}</span>
                                        <h3>
                                            <Link to={`/news/${article.id}`}>{article.title}</Link>
                                        </h3>
                                        <p className="blog-meta">
                                            <span className="author">
                                                <i className="fas fa-user"></i> {article.author}
                                            </span>
                                            <span className="date">
                                                <i className="fas fa-calendar"></i> {article.date}
                                            </span>
                                        </p>
                                        <p className="excerpt">{article.excerpt}</p>
                                        <Link to={`/news/${article.id}`} className="read-more-btn">
                                            leer más <i className="fas fa-angle-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row">
                        <div className="container">
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
                                                    disabled={currentPage === pages.length}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end latest news */}

            {/* logo carousel */}
            <div className="logo-carousel-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center mb-5">
                                <h3>Nuestros Socios</h3>
                                <p>Marcas que confían en Alpha Squad</p>
                            </div>
                            <div className="logo-carousel-inner">
                                {partners.map(partner => (
                                    <div key={partner.id} className="single-logo-item">
                                        <img 
                                            src={partner.logo} 
                                            alt={partner.alt}
                                            onError={(e) => {
                                                // Si la imagen no existe, mostrar placeholder
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTUwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iODAiIGZpbGw9IiNGM0YzRjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxMiI+TG9nbzwvdGV4dD48L3N2Zz4=';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end logo carousel */}

            <Footer />
        </div>
    );
}

export default News;