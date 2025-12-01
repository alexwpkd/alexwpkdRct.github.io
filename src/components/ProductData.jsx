/* eslint-disable react-refresh/only-export-components */
// src/components/ProductData.js
// Catálogo + helpers + componente en UN SOLO ARCHIVO
// Usa tu cargador de imágenes: src/assets/images/index.js

import images from "../assets/images";
import { resolveImage } from '../utils.js';

// ====== Datos base ======
const CATEGORIAS = ["arma_primaria", "arma_secundaria", "municion", "accesorios"];

// helper imagen (intenta resolver varios formatos usando resolveImage)
const img = (clave) => resolveImage(clave) || images[clave] || "";

// formateo CLP
const CLP = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

// catálogo (precios ENTEROS en CLP)
const productos = [
  // ===== ARMAS PRIMARIAS (6 de tu captura) =====
  { id: 1, sku: "SP-CORE-C03-TAN", nombre: "Replica Specna Arms CORE C03 Half tan",
    categoria: "arma_primaria", subcategoria: "fusil", precio: 114500, enStock: true, stock: 8,
    imagenClave: "products/product-img-1", descripcion: "Fusil AEG CORE C03 half tan." },

  { id: 2, sku: "KRY-P90-ALPINE", nombre: "KRYTAC FN P90 SMG Alpine Custom Bundle Edition",
    categoria: "arma_primaria", subcategoria: "subfusil", precio: 909990, enStock: true, stock: 5,
    imagenClave: "products/product-img-2", descripcion: "Subfusil compacto edición Alpine." },

  { id: 3, sku: "KRY-KRISS-VECTOR-GBB", nombre: "KRYTAC KRISS VECTOR GBB",
    categoria: "arma_primaria", subcategoria: "subfusil", precio: 649990, enStock: true, stock: 4,
    imagenClave: "products/product-img-3", descripcion: "KRISS VECTOR con sistema GBB." },

  { id: 4, sku: "SP-CORE-C19-DD-TAN", nombre: "Replica Specna Arms Daniel Defense CORE C19 Half tan",
    categoria: "arma_primaria", subcategoria: "fusil", precio: 156000, enStock: true, stock: 6,
    imagenClave: "products/product-img-4", descripcion: "Fusil CORE C19 half tan." },

  { id: 5, sku: "SP-CORE-C13", nombre: "Replica Specna Arms C13 CORE",
    categoria: "arma_primaria", subcategoria: "fusil", precio: 159900, enStock: true, stock: 9,
    imagenClave: "products/product-img-5", descripcion: "Fusil CORE C13, gran relación precio/rendimiento." },

  { id: 6, sku: "EMG-F1-UDR15-AEG", nombre: "Replica Airsoft EMG F-1 Firearms Ultimate CQB UDR-15-3G AR15 AEG",
    categoria: "arma_primaria", subcategoria: "fusil", precio: 399900, enStock: true, stock: 3,
    imagenClave: "products/product-img-6", descripcion: "AR15 AEG estilo F-1, ideal CQB." },

  // ===== ARMAS SECUNDARIAS (3 pistolas) =====
  { id: 7, sku: "TM-HICAPA-51-GBB", nombre: "Tokyo Marui Hi-Capa 5.1 GBB",
    categoria: "arma_secundaria", subcategoria: "pistola", precio: 260000, enStock: true, stock: 10,
    imagenClave: "products/product-img-7", descripcion: "Pistola GBB de alto desempeño." },

  { id: 8, sku: "WE-G17-GBB", nombre: "WE Glock 17 GBB",
    categoria: "arma_secundaria", subcategoria: "pistola", precio: 220000, enStock: true, stock: 12,
    imagenClave: "products/product-img-8", descripcion: "Clásica G17 con blowback." },

  { id: 9, sku: "KJW-M9-GBB", nombre: "KJW M9 Full Metal GBB",
    categoria: "arma_secundaria", subcategoria: "pistola", precio: 210000, enStock: true, stock: 7,
    imagenClave: "products/product-img-9", descripcion: "M9 full metal con buen retroceso." },

  // ===== MUNICIÓN (2) =====
  { id: 10, sku: "BBS-025-4000", nombre: "BBs 6mm 0.25g (Bolsa 4.000)",
    categoria: "municion", subcategoria: "bbs", precio: 18000, enStock: true, stock: 50,
    imagenClave: "products/product-img-10", descripcion: "0.25g para estabilidad media distancia." },

  { id: 11, sku: "CO2-12G-10PK", nombre: "Cápsulas CO2 12g (Pack x10)",
    categoria: "municion", subcategoria: "co2", precio: 8000, enStock: true, stock: 60,
    imagenClave: "products/product-img-11", descripcion: "Cápsulas estándar para CO2." },

  // ===== ACCESORIOS (4) =====
  { id: 12, sku: "ACC-REDDOT-1X20", nombre: "Mira Red Dot 1x20",
    categoria: "accesorios", subcategoria: "optica", precio: 35000, enStock: true, stock: 15,
    imagenClave: "products/product-img-12", descripcion: "Óptica tipo red dot 1x." },

  { id: 13, sku: "ACC-GRIP-MLOK", nombre: "Empuñadura táctica M-LOK",
    categoria: "accesorios", subcategoria: "agarres", precio: 15000, enStock: true, stock: 25,
    imagenClave: "products/product-img-13", descripcion: "Mejora el control; montaje M-LOK." },

  { id: 14, sku: "ACC-SLING-2PT", nombre: "Correa táctica 2 puntos",
    categoria: "accesorios", subcategoria: "correas", precio: 17000, enStock: true, stock: 30,
    imagenClave: "products/product-img-14", descripcion: "Correa ajustable de dos puntos." },

  { id: 15, sku: "ACC-FLASH-800LM", nombre: "Linterna táctica 800 lm con montura",
    categoria: "accesorios", subcategoria: "iluminacion", precio: 28000, enStock: true, stock: 18,
    imagenClave: "products/product-img-15", descripcion: "800 lúmenes; incluye montura." }
];

// ====== API del “hook” (datos + utilidades) ======
export const useProductData = () => {
  const porCategoria = (cat) => productos.filter((p) => p.categoria === cat);
  const porId = (id) => productos.find((p) => p.id === id);
  const totalCarrito = (items) =>
    items.reduce((t, { id, cantidad = 1 }) => {
      const p = porId(id);
      return t + (p ? p.precio * cantidad : 0);
    }, 0);

  // Helpers de ordenamiento
  const normalizarOrden = (orden) => (orden === "desc" ? "desc" : "asc");
  const baseLista = (categoria) => {
    if (!categoria || categoria === "all") return productos.slice();
    return porCategoria(categoria).slice();
  };

  // Ordenar por nombre (asc|desc), opcionalmente dentro de una categoría
  const ordenarPorNombre = (orden = "asc", categoria) => {
    const lista = baseLista(categoria);
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
    return normalizarOrden(orden) === "desc" ? lista.reverse() : lista;
  };

  // Ordenar por precio numérico (asc|desc), opcionalmente dentro de una categoría
  const ordenarPorPrecio = (orden = "asc", categoria) => {
    const lista = baseLista(categoria);
    lista.sort((a, b) => a.precio - b.precio);
    return normalizarOrden(orden) === "desc" ? lista.reverse() : lista;
  };

  // Punto único para ordenar por criterio ('nombre'|'price'|'precio')
  const ordenarProductos = ({ por = "nombre", orden = "asc", categoria } = {}) => {
    const o = normalizarOrden(orden);
    if (por === "precio" || por === "price") return ordenarPorPrecio(o, categoria);
    if (por === "nombre" || por === "name") return ordenarPorNombre(o, categoria);
    return ordenarPorNombre(o, categoria);
  };

  // ====== Compatibilidad con componentes existentes (EN aliases) ======
  // Normaliza un producto al esquema en inglés que usan algunos componentes
  const normalizarProductoEN = (p) =>
    p && {
      // base
      id: p.id,
      sku: p.sku,
      // nombres/strings
      name: p.nombre,
      description: p.descripcion,
      // categorías
      category: p.categoria,
      subcategory: p.subcategoria,
      // precio formateado para mostrar directamente
      price: CLP(p.precio),
      priceNumber: p.precio,
      // imagen
      imageKey: p.imagenClave,
      // stock
      inStock: !!p.enStock,
      stock: p.stock,
      // extras opcionales
      features: p.features ?? [],
      // conservar original por si se requiere
      __original: p,
    };

  const getProductById = (idLike) => {
    const idNum = typeof idLike === "string" ? parseInt(idLike, 10) : idLike;
    const p = porId(idNum);
    return normalizarProductoEN(p);
  };

  const getProductsByCategory = (cat) => {
    // si envían 'all' devolvemos todos
    const base = !cat || cat === "all" ? productos : porCategoria(cat);
    return base.map(normalizarProductoEN).filter(Boolean);
  };

  const getFeaturedProducts = (n = 3) => {
    // Heurística simple: tomar los primeros n productos ordenados por precio desc
    const destacados = ordenarPorPrecio("desc").slice(0, Math.max(0, n));
    return destacados.map(normalizarProductoEN);
  };

  return {
    CATEGORIAS,
    productos,
    img,
    CLP,
    porCategoria,
    porId,
    totalCarrito,
    ordenarPorNombre,
    ordenarPorPrecio,
    ordenarProductos,
    // API en inglés usada por otros componentes
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
  };
};

// ====== Componente mínimo en el MISMO ARCHIVO (opcional) ======
/*
export const TarjetaProducto = ({ producto, onAgregar }) => (
  <article className="card-producto">
    <img src={img(producto.imagenClave)} alt={producto.nombre} />
    <h3>{producto.nombre}</h3>
    <p>Precio de venta</p>
    <strong>{CLP(producto.precio)}</strong>
    <button onClick={() => onAgregar?.(producto)}>🛒 Agregarlo a tu arsenal</button>
  </article>
);
*/

export default useProductData;
