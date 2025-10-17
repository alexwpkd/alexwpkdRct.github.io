import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header.jsx'
import Hero from './components/Hero'
import Footer from '@/components/Footer.jsx'
import About from '@/components/About.jsx'
import Contact from '@/components/Contact.jsx'
import Shop from '@/components/Shop.jsx'
import Login from '@/components/Login.jsx'
import News from '@/components/News.jsx'
import Admin from '@/components/Admin.jsx' // ✅ IMPORTACIÓN AGREGADA

/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
*/

// crea luego tus páginas reales:
const Home = () => <main className="container" style={{padding:'3rem 0'}}>Home</main>

export default function App() {
  return (
    <>
    <div className="app">
      <Header />
      <Hero />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<Admin/>} /> {/* ✅ RUTA AGREGADA */}
        <Route path="*" element={<main className="container" style={{padding:'3rem 0'}}>404</main>} />
      </Routes>
      <Footer />
    </div>
    </>
  )
}