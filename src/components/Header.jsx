import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import images from '../assets/images/index.js'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setOpen(!open)
  const closeMenu = () => setOpen(false)
  const isActive = (path) => location.pathname === path ? 'current-list-item' : ''

  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const updateAuthFromStorage = () => {
      const token = localStorage.getItem('token')
      const email = localStorage.getItem('userEmail')
      const name = localStorage.getItem('userName')
      const role = localStorage.getItem('userRole')
      // Only consider logged in if session flag set in this tab AND token exists
      const sessionFlag = (() => { try { return sessionStorage.getItem('authenticated') } catch(e) { return null } })();
      if (token && sessionFlag === 'true') {
        setLoggedIn(true)
        setUserEmail(email || '')
        setUserName(name || email || '')
        setUserRole(role || '')
      } else {
        setLoggedIn(false)
        setUserEmail('')
        setUserName('')
        setUserRole('')
      }
    }

    // Inicializar estado
    updateAuthFromStorage()

    // Escuchar cambios de auth dentro de la misma pestaña
    window.addEventListener('authChanged', updateAuthFromStorage)
    // Escuchar cambios desde otras pestañas
    window.addEventListener('storage', updateAuthFromStorage)

    return () => {
      window.removeEventListener('authChanged', updateAuthFromStorage)
      window.removeEventListener('storage', updateAuthFromStorage)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('idCliente')
    setLoggedIn(false)
    setUserEmail('')
    setUserName('')
    navigate('/')
    try { 
      try { sessionStorage.removeItem('authenticated') } catch(e) {}
      window.dispatchEvent(new Event('authChanged')) 
    } catch(e) {}
  }

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
                      {loggedIn && (
                        <span style={{marginLeft:12, display:'inline-flex', alignItems:'center', gap:8}}>
                          <button className="btn btn-sm btn-light" style={{display:'inline-flex', alignItems:'center', gap:8}} onClick={() => { if (userRole && (userRole.toLowerCase()==='admin' || userRole.toLowerCase()==='empleado')) navigate('/admin'); else navigate('/'); }} title="Mi cuenta">
                            <i className="fas fa-user-circle"></i>
                            <span style={{marginLeft:6}}>{(userRole && (userRole.toLowerCase()==='admin' || userRole.toLowerCase()==='empleado')) ? `Admin: ${userName}` : `Usuario: ${userName}`}</span>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={handleLogout} title="Cerrar sesión">
                            <i className="fas fa-sign-out-alt"></i>
                            <span style={{marginLeft:6}}>Salir</span>
                          </button>
                        </span>
                      )}
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
