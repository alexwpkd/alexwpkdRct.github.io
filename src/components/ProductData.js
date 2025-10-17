// src/components/ProductData.js
export const useProductData = () => {
    const productsData = {
        products: [
            {
                id: 1,
                name: "Réplica HK416 DEVGRU",
                price: "$720.000 CLP",
                imageKey: "product-img-1",
                category: "rifles",
                description: "Réplica de alta precisión con sistema de aire comprimido, ideal para operaciones tácticas.",
                inStock: true,
                features: [
                    "Material: Metal y polímero reforzado",
                    "Velocidad de salida: 400 FPS",
                    "Modo de disparo: Semi / Auto",
                    "Capacidad del cargador: 300 BBs",
                    "Sistema de alimentación: AEG",
                    "Longitud: 800mm",
                    "Peso: 3.2kg"
                ]
            },
            {
                id: 2,
                name: "KRYTAC P90 Alpine Edition",
                price: "$909.990 CLP",
                imageKey: "product-img-2",
                category: "subfusiles",
                description: "Edición especial alpine con mejoras de rendimiento y diseño único.",
                inStock: true,
                features: [
                    "Material: Polímero de alta resistencia",
                    "Velocidad de salida: 380 FPS",
                    "Modo de disparo: Semi / Auto",
                    "Capacidad del cargador: 170 BBs",
                    "Sistema: AEG",
                    "Longitud: 500mm",
                    "Peso: 2.8kg"
                ]
            },
            {
                id: 3,
                name: "KRYTAC KRISS VECTOR GBB",
                price: "$649.990 CLP",
                imageKey: "product-img-3",
                category: "subfusiles",
                description: "Sistema de gas blowback para mayor realismo y experiencia táctil.",
                inStock: true,
                features: [
                    "Material: Aleación de aluminio",
                    "Velocidad de salida: 350 FPS",
                    "Modo de disparo: Semi / Auto",
                    "Capacidad del cargador: 50 BBs",
                    "Sistema: GBB (Gas Blowback)",
                    "Longitud: 600mm",
                    "Peso: 3.0kg"
                ]
            },
            {
                id: 4,
                name: "G&G CM16 Raider",
                price: "$399.990 CLP",
                imageKey: "product-img-4",
                category: "rifles",
                description: "Perfecto para principiantes, confiable y durable para entrenamiento.",
                inStock: true,
                features: [
                    "Material: Polímero reforzado",
                    "Velocidad de salida: 370 FPS",
                    "Modo de disparo: Semi / Auto",
                    "Capacidad del cargador: 450 BBs",
                    "Sistema: AEG",
                    "Longitud: 750mm",
                    "Peso: 2.5kg"
                ]
            },
            {
                id: 5,
                name: "Tokyo Marui Hi-Capa 5.1",
                price: "$289.990 CLP",
                imageKey: "product-img-5",
                category: "pistolas",
                description: "Pistola de alto rendimiento para competencia y uso profesional.",
                inStock: false,
                features: [
                    "Material: Polímero y metal",
                    "Velocidad de salida: 280 FPS",
                    "Modo de disparo: Semi-automático",
                    "Capacidad del cargador: 31 BBs",
                    "Sistema: GBB",
                    "Longitud: 220mm",
                    "Peso: 0.9kg"
                ]
            },
            {
                id: 6,
                name: "Chaleco táctico EmersonGear",
                price: "$149.990 CLP",
                imageKey: "product-img-6",
                category: "equipamiento",
                description: "Chaleco modular con múltiples opciones de carga y ajuste personalizable.",
                inStock: true,
                features: [
                    "Material: Nylon 1000D",
                    "Color: Negro táctico",
                    "Tallas: S, M, L, XL",
                    "Bolsillos: 8 modulares",
                    "Ajuste: Correas laterales",
                    "Peso: 1.2kg"
                ]
            },
            {
                id: 7,
                name: "Máscara de protección Full Face",
                price: "$89.990 CLP",
                imageKey: "product-img-1",
                category: "proteccion",
                description: "Protección completa para cara y ojos con ventilación mejorada.",
                inStock: true,
                features: [
                    "Material: Malla de acero + policarbonato",
                    "Protección: Cara completa",
                    "Ventilación: Sí, mejorada",
                    "Compatibilidad: Con gafas",
                    "Talla: Universal",
                    "Peso: 0.4kg"
                ]
            },
            {
                id: 8,
                name: "Cargador adicional M4",
                price: "$45.990 CLP",
                imageKey: "product-img-2",
                category: "accesorios",
                description: "Cargador de alta capacidad para réplicas M4, compatible con múltiples modelos.",
                inStock: true,
                features: [
                    "Capacidad: 300 BBs",
                    "Compatibilidad: M4/M16",
                    "Material: Polímero resistente",
                    "Color: Negro",
                    "Tipo: High-cap",
                    "Peso: 0.3kg"
                ]
            }
        ],
        categories: [
            { id: "all", name: "Todos los productos" },
            { id: "rifles", name: "Rifles de Asalto" },
            { id: "subfusiles", name: "Subfusiles" },
            { id: "pistolas", name: "Pistolas" },
            { id: "equipamiento", name: "Equipamiento" },
            { id: "proteccion", name: "Protección" },
            { id: "accesorios", name: "Accesorios" }
        ]
    };

    // Funciones útiles
    const getProductById = (id) => {
        return productsData.products.find(product => product.id === parseInt(id));
    };

    const getProductsByCategory = (category) => {
        if (category === 'all') return productsData.products;
        return productsData.products.filter(product => product.category === category);
    };

    const getFeaturedProducts = (limit = 3) => {
        return productsData.products.slice(0, limit);
    };

    return {
        products: productsData.products,
        categories: productsData.categories,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts
    };
};

export default useProductData;