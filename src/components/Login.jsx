// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollButton from './ScrollButton.jsx';
// Header global se renderiza en App.jsx

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
            // Admin: solo emails exactos y contraseña 'admin'
            const adminEmails = [
                'a.rios@alpha.com',
                'd.rodri@alpha.com',
                'a.olguin@alpha.com'
            ];
            if (adminEmails.includes(formData.email) && formData.password === 'admin') {
                setLoginStatus('success-admin');
                localStorage.setItem('authToken', 'admin-token');
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userRole', 'admin');
                navigate('/admin');
            } else {
                // Buscar usuario registrado en localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const found = users.find(u => u.email === formData.email && u.password === formData.password);
                if (found) {
                    setLoginStatus('success-user');
                    localStorage.setItem('authToken', 'user-token');
                    localStorage.setItem('userEmail', found.email);
                    localStorage.setItem('userRole', 'user');
                    // Mostrar mensaje y redirigir al Home
                    setTimeout(() => {
                        navigate('/');
                    }, 1200);
                } else {
                    setLoginStatus('Correo o contraseña incorrectos');
                }
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

    // Eliminado: usuarios de prueba y autolleno

    return (
        <div className="Login">
            
            
            {/* hero area */}
            <div className="hero-area hero-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 offset-lg-2 text-center">
                            <div className="hero-text">
                                        <div className="hero-text-tablecell">
                                    <h1>Inicia Sesión</h1>
                                    {/* Botón centrado directamente debajo del título */}
                                    <div className="text-center mt-3">
                                        <ScrollButton targetSelector=".full-height-section" playShots={false} className="scroll-button-inline" />
                                    </div>
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
                                            className="cart-btn btn-custom" 
                                            style={{width: '100%'}}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span style={{display:'inline-flex',alignItems:'center'}}>
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    <span className="static-loading-text" style={{display:'inline-block'}}>
                                                        Cargando...
                                                    </span>
                                                </span>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Enlaces adicionales */}
                                    <div className="mt-4 text-center">
                                        <p><span style={{color:'#fff', fontWeight:'bold'}}>¿No tienes cuenta?</span> <Link to="/contact" className="text-primary">Regístrate aquí</Link></p>
                                        <p className="mt-2 text-muted">
                                            ¿Olvidaste tu contraseña?
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
                                                ? '✅ Sesión iniciada. Redirigiendo...'
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
        </div>
    );
}

export default Login;