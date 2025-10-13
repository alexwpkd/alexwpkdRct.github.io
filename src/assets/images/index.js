// src/assets/images/index.js
// Carga TODAS las imágenes (incluye subcarpetas)
const modules = import.meta.glob('./**/*.{png,jpg,jpeg,svg,gif,webp}', {
  eager: true,
  import: 'default', // toma el export default (la URL)
})

// Construye un mapa: "ruta-sin-extensión" -> url
const images = {}
for (const path in modules) {
  // p.ej. "./products/gafas.jpg" -> "products/gafas"
  const key = path
    .replace(/^\.\//, '')         // quita "./"
    .replace(/\.[^./]+$/, '')     // quita extensión
  images[key] = modules[path]
}

export default images