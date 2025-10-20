import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import images from '../assets/images/index.js'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setOpen(!open)
  const closeMenu = () => setOpen(false)
  const isActive = (path) => location.pathname === path ? 'current-list-item' : ''

  return (
  <>
    {/* header */}
  <div className="top-header-area" style={{background:'transparent',backgroundColor:'transparent',boxShadow:'none',border:'none',zIndex:1000,position:'absolute',width:'100%'}}>
  <div className="container" style={{background:'transparent',backgroundColor:'transparent',boxShadow:'none',border:'none'}}>
  <div className="row" style={{background:'transparent',backgroundColor:'transparent',boxShadow:'none',border:'none'}}>
          <div className="col-lg-12 col-sm-12 text-center" style={{background:'transparent',backgroundColor:'transparent',boxShadow:'none',border:'none'}}>
            <div className="main-menu-wrap" style={{background:'transparent',backgroundColor:'transparent',boxShadow:'none',border:'none'}}>
              {/* logo */}
              <div className="site-logo">
                <Link to="/" onClick={closeMenu}>
                  <img src={images['logo']} alt="Alpha-squad" />
                </Link>
              </div>
              {/* /logo */}

              {/* botón móvil (sin meanmenu) */}
              <button
                className={`nav-toggle ${open ? 'is-open' : ''}`}
                aria-label="Abrir menú"
                onClick={toggleMenu}
              >
                ☰
              </button>

              {/* menú */}
              <nav className={`main-menu ${open ? 'open' : ''}`}>
                <ul>
                  <li className={isActive('/')}>
                    <NavLink to="/" onClick={closeMenu}>Inicio</NavLink>
                  </li>
                  <li className={isActive('/about')}>
                    <NavLink to="/about" onClick={closeMenu}>¿Quienes somos?</NavLink>
                  </li>
                  <li className={isActive('/login')}>
                    <NavLink to="/login" onClick={closeMenu}>Inicio sesión</NavLink>
                  </li>
                  <li className={isActive('/contact')}>
                    <NavLink to="/contact" onClick={closeMenu}>Regístrate</NavLink>
                  </li>
                  <li className={isActive('/shop')}>
                    <NavLink to="/shop" onClick={closeMenu}>Tienda</NavLink>
                  </li>
                  <li>
                    <div className="header-icons">
                      <NavLink className="shopping-cart" to="/cart" onClick={closeMenu}>
                        <i className="fas fa-shopping-cart"></i>
                      </NavLink>
                    </div>
                  </li>
                </ul>
              </nav>
              {/* menu end */}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* end header */}

  </>)
}
