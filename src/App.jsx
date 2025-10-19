// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Shop from './components/Shop.jsx';
import Login from './components/Login.jsx';
import News from './components/News.jsx';
import Admin from './components/Admin.jsx';
import Product from './components/Product.jsx';

export default function App() {
  return (
    <div className="app">
      {/* Header está global para todas las páginas */}
      <Header />
      
      {/* Routes - Cada página maneja su propio contenido */}
      <Routes>
        <Route path="/" element={<Home/>} />           {/* ✅ Home con Hero incluido */}
        <Route path="/about" element={<About/>} />     {/* Sin Hero */}
        <Route path="/shop" element={<Shop/>} />       {/* Sin Hero */}
        <Route path="/contact" element={<Contact/>} /> {/* Sin Hero */}
        <Route path="/news" element={<News/>} />       {/* Sin Hero */}
        <Route path="/login" element={<Login/>} />     {/* Sin Hero */}
        <Route path="/admin" element={<Admin/>} />     {/* Sin Hero */}
        <Route path="/product/:id" element={<Product/>} /> {/* Sin Hero */}
        <Route path="*" element={<div className="container text-center py-5"><h1>404 - Página no encontrada</h1></div>} />
      </Routes>
      
      {/* Footer está global para todas las páginas */}
      <Footer />
    </div>
  )
}