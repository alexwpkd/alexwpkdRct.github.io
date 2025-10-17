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
                stock: 8,
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
                stock: 3,
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
                stock: 5,
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
                stock: 12,
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
                stock: 0,
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
                stock: 15,
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
                stock: 20,
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
                stock: 25,
                features: [
                    "Capacidad: 300 BBs",
                    "Compatibilidad: M4/M16",
                    "Material: Polímero resistente",
                    "Color: Negro",
                    "Tipo: High-cap",
                    "Peso: 0.3kg"
                ]
            },
            // NUEVOS PRODUCTOS - MUNICIONES
            {
                id: 9,
                name: "Balines 0.20g Precision Elite",
                price: "$15.990 CLP",
                imageKey: "product-img-3",
                category: "municiones",
                description: "Balines de alta precisión 0.20g para máximo rendimiento y exactitud.",
                inStock: true,
                stock: 50,
                features: [
                    "Peso: 0.20 gramos",
                    "Cantidad: 5000 unidades",
                    "Precisión: Superior",
                    "Material: Biodegradable",
                    "Color: Blanco",
                    "Diámetro: 6mm"
                ]
            },
            {
                id: 10,
                name: "Balines 0.25g Heavy Weight",
                price: "$18.990 CLP",
                imageKey: "product-img-4",
                category: "municiones",
                description: "Balines pesados 0.25g para mayor estabilidad en distancias largas.",
                inStock: true,
                stock: 35,
                features: [
                    "Peso: 0.25 gramos",
                    "Cantidad: 4000 unidades",
                    "Estabilidad: Excelente",
                    "Material: Biodegradable",
                    "Color: Blanco",
                    "Ideal: Exteriores"
                ]
            },
            {
                id: 11,
                name: "Balines 0.12g Económicos",
                price: "$8.990 CLP",
                imageKey: "product-img-5",
                category: "municiones",
                description: "Balines económicos perfectos para entrenamiento y práctica.",
                inStock: true,
                stock: 80,
                features: [
                    "Peso: 0.12 gramos",
                    "Cantidad: 6000 unidades",
                    "Uso: Entrenamiento",
                    "Material: Estándar",
                    "Color: Blanco",
                    "Relación: Calidad-Precio"
                ]
            },
            // NUEVOS PRODUCTOS - PISTOLAS
            {
                id: 12,
                name: "Glock 17 Gen 4 GBB",
                price: "$189.990 CLP",
                imageKey: "product-img-6",
                category: "pistolas",
                description: "Réplica Glock 17 Gen 4 con sistema GBB para realismo máximo.",
                inStock: true,
                stock: 7,
                features: [
                    "Sistema: GBB (Gas Blowback)",
                    "Velocidad: 300 FPS",
                    "Capacidad: 25 BBs",
                    "Material: Polímero y metal",
                    "Longitud: 186mm",
                    "Peso: 0.7kg"
                ]
            },
            {
                id: 13,
                name: "Desert Eagle Silver",
                price: "$229.990 CLP",
                imageKey: "product-img-1",
                category: "pistolas",
                description: "Iconica Desert Eagle en acabado plateado, potencia y estilo.",
                inStock: true,
                stock: 4,
                features: [
                    "Sistema: GBB",
                    "Velocidad: 320 FPS",
                    "Capacidad: 20 BBs",
                    "Material: Aleación metálica",
                    "Longitud: 270mm",
                    "Acabado: Plateado"
                ]
            },
            {
                id: 14,
                name: "1911 Tactical CO2",
                price: "$159.990 CLP",
                imageKey: "product-img-2",
                category: "pistolas",
                description: "Clásica 1911 con sistema CO2 para mayor potencia y consistencia.",
                inStock: true,
                stock: 9,
                features: [
                    "Sistema: CO2",
                    "Velocidad: 350 FPS",
                    "Capacidad: 15 BBs",
                    "Material: Metal y polímero",
                    "Longitud: 216mm",
                    "Power: Alta potencia"
                ]
            },
            // NUEVOS PRODUCTOS - ACCESORIOS
            {
                id: 15,
                name: "Mira Red Dot Tactical",
                price: "$89.990 CLP",
                imageKey: "product-img-3",
                category: "accesorios",
                description: "Mira punto rojo táctico con múltiples retículas y ajustes.",
                inStock: true,
                stock: 12,
                features: [
                    "Tipo: Punto rojo",
                    "Rétículas: 4 patrones",
                    "Montura: Riel Picatinny",
                    "Ajuste: 1 MOA por clic",
                    "Batería: CR2032",
                    "Resistente: Agua y golpes"
                ]
            },
            {
                id: 16,
                name: "Linterna Táctica LED 1000lm",
                price: "$45.990 CLP",
                imageKey: "product-img-4",
                category: "accesorios",
                description: "Linterna táctica ultra brillante con montura universal.",
                inStock: true,
                stock: 18,
                features: [
                    "Luminosidad: 1000 lúmenes",
                    "Montura: Riel Picatinny",
                    "Batería: 18650 (incluida)",
                    "Modos: 5 + Strobe",
                    "Alcance: 200 metros",
                    "Material: Aleación aluminio"
                ]
            },
            {
                id: 17,
                name: "Silenciador Táctico 140mm",
                price: "$35.990 CLP",
                imageKey: "product-img-5",
                category: "accesorios",
                description: "Silenciador táctico para réplicas con rosca CCW 14mm.",
                inStock: true,
                stock: 15,
                features: [
                    "Longitud: 140mm",
                    "Diámetro: 35mm",
                    "Roscado: 14mm CCW",
                    "Material: Aluminio anodizado",
                    "Peso: 120g",
                    "Compatibilidad: Universal"
                ]
            },
            {
                id: 18,
                name: "Empuñadura Vertical M-LOK",
                price: "$28.990 CLP",
                imageKey: "product-img-6",
                category: "accesorios",
                description: "Empuñadura vertical para mejor control y estabilidad.",
                inStock: true,
                stock: 22,
                features: [
                    "Sistema: M-LOK",
                    "Material: Polímero reforzado",
                    "Color: Negro táctico",
                    "Textura: Antideslizante",
                    "Instalación: Sin herramientas",
                    "Compatibilidad: M-LOK"
                ]
            },
            // NUEVOS PRODUCTOS - EQUIPAMIENTO
            {
                id: 19,
                name: "Mochila Táctica 30L",
                price: "$79.990 CLP",
                imageKey: "product-img-1",
                category: "equipamiento",
                description: "Mochila táctica de 30L con múltiples compartimentos.",
                inStock: true,
                stock: 10,
                features: [
                    "Capacidad: 30 litros",
                    "Compartimentos: 8+",
                    "Material: Nylon 600D",
                    "Color: Negro/OD Green",
                    "Porta hidratación: Sí",
                    "Peso: 1.1kg"
                ]
            },
            {
                id: 20,
                name: "Botas Tácticas Combat",
                price: "$129.990 CLP",
                imageKey: "product-img-2",
                category: "equipamiento",
                description: "Botas tácticas de combate con soporte ankle y suela antideslizante.",
                inStock: true,
                stock: 14,
                features: [
                    "Material: Cuero y nylon",
                    "Suela: Antideslizante",
                    "Tallas: 38-46",
                    "Color: Negro",
                    "Impermeable: Sí",
                    "Peso: 800g par"
                ]
            },
            // NUEVO - PRODUCTOS NUEVOS
            {
                id: 21,
                name: "ASG Scorpion Evo 3 A1",
                price: "$799.990 CLP",
                imageKey: "product-img-3",
                category: "nuevos",
                description: "NUEVO - Scorpion Evo con tecnología avanzada y diseño innovador.",
                inStock: true,
                stock: 6,
                features: [
                    "Sistema: AEG avanzado",
                    "Velocidad: 410 FPS",
                    "Capacidad: 75 BBs",
                    "Material: Nylon fibra de vidrio",
                    "Electrónica: MOSFET",
                    "Característica: Cambio rápido"
                ]
            },
            {
                id: 22,
                name: "Goggles de Protección Dual Pane",
                price: "$65.990 CLP",
                imageKey: "product-img-4",
                category: "nuevos",
                description: "NUEVO - Goggles de doble lente anti-empañamiento.",
                inStock: true,
                stock: 25,
                features: [
                    "Tecnología: Dual pane",
                    "Anti-empañamiento: Sí",
                    "Protección: UV 100%",
                    "Ventilación: Mejorada",
                    "Compatibilidad: Con gafas",
                    "Certificación: ANSI Z87.1"
                ]
            }
        ],
        categories: [
            { id: "all", name: "🏪 Todos los Productos" },
            { id: "rifles", name: "🔫 Rifles de Asalto" },
            { id: "pistolas", name: "⚡ Pistolas" },
            { id: "subfusiles", name: "🔹 Subfusiles" },
            { id: "equipamiento", name: "🎯 Equipamiento Táctico" },
            { id: "proteccion", name: "🛡️ Protección" },
            { id: "accesorios", name: "🎒 Accesorios" },
            { id: "municiones", name: "💥 Municiones" },
            { id: "nuevos", name: "🆕 Nuevos Productos" }
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

    const getNewProducts = (limit = 6) => {
        return productsData.products
            .filter(product => product.category === 'nuevos')
            .slice(0, limit);
    };

    const getProductsByStock = (minStock = 0) => {
        return productsData.products.filter(product => product.stock > minStock);
    };

    return {
        products: productsData.products,
        categories: productsData.categories,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        getNewProducts,
        getProductsByStock
    };
};

export default useProductData;