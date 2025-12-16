// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollButton from './ScrollButton.jsx';
// ⬇️ en vez de axios directo, usamos tu cliente API unificado
import api from '../utils.js';
import { emitToast } from '../utils/toast.js';

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
        if (loginStatus) setLoginStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Evitar login de otra cuenta cuando ya hay sesión activa
        const existingRole = (localStorage.getItem('userRole') || '').toLowerCase();
        const hasToken = !!localStorage.getItem('token');
        if (hasToken && existingRole === 'cliente') {
            emitToast('Ya tienes sesión como cliente. Cierra sesión antes de ingresar con otra cuenta.', 'warning');
            setLoading(false);
            return;
        }
        
        if (!formData.email || !formData.password) {
            setLoginStatus('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        try {
            console.log('Intentando login (backend):', formData);

            const payload = { correo: formData.email, password: formData.password };
            let backendOk = false;

            try {
                // ⬇️ usamos el cliente `api` que ya tiene baseURL = 18.213.2.146:8080
                const resp = await api.post('/auth/login', payload);
                const data = resp.data;

                console.log('Respuesta login backend:', data);

                // ⬇️ unificamos la key: SIEMPRE 'token'
                localStorage.setItem('token', data.token || '');
                if (data.rol) {
                    localStorage.setItem('userRole', data.rol.toLowerCase());
                    localStorage.setItem('rol', data.rol); // Mantener ambos formatos
                }
                if (data.correo) localStorage.setItem('userEmail', data.correo);
                // guardar nombre si el backend lo retorna (nombre, name, nombreCompleto)
                const userName = data.nombre || data.name || data.nombreCompleto || data.correo || '';
                if (userName) localStorage.setItem('userName', userName);

                // 🧍 Guardar idCliente SOLO si es CLIENTE
                if (data.rol && data.rol.toUpperCase() === 'CLIENTE') {
                    const idForClient = data.idCliente || data.id || data.idUsuario;
                    if (idForClient) {
                        localStorage.setItem('idCliente', String(idForClient));
                    }
                } else {
                    // Si es ADMIN o EMPLEADO, nos aseguramos de no dejar un idCliente viejo
                    localStorage.removeItem('idCliente');
                }

                if (data.rol && data.rol.toUpperCase() === 'ADMIN') {
                    setLoginStatus('success-admin');
                    try { sessionStorage.setItem('authenticated', 'true'); } catch(e) {}
                    try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
                    navigate('/admin');
                } else if (data.rol && data.rol.toUpperCase() === 'EMPLEADO') {
                    setLoginStatus('success-admin');
                    try { sessionStorage.setItem('authenticated', 'true'); } catch(e) {}
                    try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
                    navigate('/admin');
                } else {
                    setLoginStatus('success-user');
                    try { sessionStorage.setItem('authenticated', 'true'); } catch(e) {}
                    try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
                    setTimeout(() => navigate('/'), 1200);
                }

                backendOk = true;
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401) {
                        console.warn('Backend: credenciales incorrectas');
                        setLoginStatus('Correo o contraseña incorrectos');
                        emitToast('Correo o contraseña incorrectos', 'error');
                    } else {
                        console.error('Backend error:', err.response.status, err.response.data);
                        setLoginStatus('Error del servidor. Intenta nuevamente.');
                        emitToast('Error del servidor. Intenta nuevamente.', 'error');
                    }
                } else {
                    console.warn('No se pudo conectar al backend', err);
                    setLoginStatus('No se pudo conectar al servidor.');
                    emitToast('No se pudo conectar al servidor.', 'error');
                }
            }

            // Si quieres, puedes mantener el fallback local,
            // pero como ya tienes backend real, yo lo dejaría desactivado:
            /*
            if (!backendOk) {
                // ... lógica local anterior ...
            }
            */

            // Opcional: limpiar campos SOLO si el login fue exitoso
            if (backendOk) {
                setFormData({ email: '', password: '' });
                    // Notificar al resto de la app que la autenticación cambió
                    try { 
                        // Marcar sesión activa en esta pestaña
                        try { sessionStorage.setItem('authenticated', 'true'); } catch(e) {}
                        window.dispatchEvent(new Event('authChanged')); 
                    } catch(e) { /* no crítico */ }
            }
            
        } catch {
            setLoginStatus('Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

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
                                    <div className="text-center mt-3">
                                        <ScrollButton
                                            targetSelector=".full-height-section"
                                            playShots={false}
                                            className="scroll-button-inline"
                                        />
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

                                    <div className="mt-4 text-center">
                                        <p><span style={{color:'#fff', fontWeight:'bold'}}>¿No tienes cuenta?</span> <Link to="/contact" className="text-primary">Regístrate aquí</Link></p>
                                        <p className="mt-2 text-muted">
                                            ¿Olvidaste tu contraseña?
                                        </p>
                                    </div>

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
