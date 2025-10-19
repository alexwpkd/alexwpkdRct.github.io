// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loginStatus, setLoginStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar mensajes de error al escribir
        if (loginStatus) setLoginStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validación básica
        if (!formData.email || !formData.password) {
            setLoginStatus('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        try {
            // Simulación de API call
            console.log('Intentando login:', formData);
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar si es usuario admin @duocuc.cl
            const isAdminUser = formData.email.endsWith('@duocuc.cl');
            
            if (isAdminUser) {
                // Usuario admin - redirigir al panel de administración
                setLoginStatus('success-admin');
                
                // Guardar información de usuario en localStorage
                localStorage.setItem('authToken', 'admin-token');
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userRole', 'admin');
                
                // Redirigir al panel de admin después de un breve delay
                setTimeout(() => {
                    navigate('/admin');
                }, 1500);
                
            } else {
                // Usuario normal - redirigir a la página principal
                setLoginStatus('success-user');
                
                // Guardar información de usuario en localStorage
                localStorage.setItem('authToken', 'user-token');
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userRole', 'user');
                
                // Redirigir a la página principal después de un breve delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
            
            // Resetear formulario
            setFormData({
                email: '',
                password: ''
            });
            
        } catch {
            setLoginStatus('Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Lista de usuarios demo para testing
    const demoUsers = [
        { email: 'admin@duocuc.cl', password: 'admin123', role: 'Administrador' },
        { email: 'ventas@duocuc.cl', password: 'ventas123', role: 'Personal de Ventas' },
        { email: 'usuario@ejemplo.com', password: 'user123', role: 'Usuario Normal' }
    ];

    const fillDemoUser = (email, password) => {
        setFormData({
            email,
            password
        });
    };

    return (
        <div className="Login">
            <Header />
            
            {/* hero area */}
            <div className="hero-area hero-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 offset-lg-2 text-center">
                            <div className="hero-text">
                                <div className="hero-text-tablecell">
                                    <h1>Inicia Sesión</h1>
                                    <p className="subtitle">Accede a tu cuenta Alpha Squad</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
            {/* login section */}
            <div className="full-height-section error-section">
                <div className="full-height-tablecell">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5 col-md-7 text-center">
                                <div className="login-card" style={{padding: '40px 30px', boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderRadius: '10px'}}>
                                    <h2 className="producto-titulo mb-4">Iniciar Sesión</h2>
                                    
                                    {/* Usuarios de demo para testing */}
                                    <div className="demo-users mb-4">
                                        <h6 className="text-muted mb-3">Usuarios de Prueba:</h6>
                                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                                            {demoUsers.map((user, index) => (
                                                <button
                                                    key={index}
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => fillDemoUser(user.email, user.password)}
                                                    title={`${user.role} - ${user.email}`}
                                                >
                                                    {user.role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <input 
                                                type="email" 
                                                className="form-control mb-3" 
                                                name="email" 
                                                placeholder="Correo electrónico" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input 
                                                type="password" 
                                                className="form-control mb-3" 
                                                name="password" 
                                                placeholder="Contraseña" 
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        
                                        <button 
                                            type="submit" 
                                            className="cart-btn" 
                                            style={{width: '100%'}}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                    Iniciando sesión...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                                                </>
                                            )}
                                        </button>
                                    </form>
                                    
                                    {/* Información sobre acceso admin */}
                                    <div className="admin-info mt-3 p-3 bg-light rounded">
                                        <small className="text-muted">
                                            <i className="fas fa-info-circle me-1"></i>
                                            <strong>Acceso Admin:</strong> Usa un correo @duocuc.cl para acceder al panel de administración
                                        </small>
                                    </div>

                                    {/* Enlaces adicionales */}
                                    <div className="mt-4 text-center">
                                        <p>¿No tienes cuenta? <Link to="/contact" className="text-primary">Regístrate aquí</Link></p>
                                        <p className="mt-2">
                                            <Link to="/forgot-password" className="text-muted">
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Estado del login */}
                                    {loginStatus && (
                                        <div 
                                            className={`mt-3 alert ${
                                                loginStatus === 'success-admin' ? 'alert-success' :
                                                loginStatus === 'success-user' ? 'alert-info' : 
                                                'alert-danger'
                                            }`}
                                        >
                                            {loginStatus === 'success-admin' 
                                                ? '✅ ¡Acceso de administrador concedido! Redirigiendo al panel...' 
                                                : loginStatus === 'success-user'
                                                ? '✅ ¡Inicio de sesión exitoso! Redirigiendo...'
                                                : `❌ ${loginStatus}`
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;