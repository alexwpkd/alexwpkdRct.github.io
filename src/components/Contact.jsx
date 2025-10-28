import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import images from '../assets/images/index.js';
import ScrollButton from './ScrollButton';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        region: '',
        comuna: '',
        address: '',
        password: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [rutError, setRutError] = useState('');
    const navigate = useNavigate();

    // Contact info block restored
    const contactInfo = [
        {
            icon: 'fas fa-map',
            title: 'Dirección',
            content: 'Antonio Varas 234, Providencia <br> Región Metropolitana, Chile'
        },
        {
            icon: 'fas fa-clock',
            title: 'Horario',
            content: 'Lunes - Viernes: 9 AM a 8 PM <br> Sábado: 10 AM a 5 PM'
        },
        {
            icon: 'fas fa-address-book',
            title: 'Contacto',
            content: 'Tel: +56 9 3020 6073 <br> soporte@alpha.com'
        }
    ];

    // Regiones y comunas de Chile (resumen representativo)
    const regionesComunas = useMemo(() => ({
        'Arica y Parinacota': ['Arica', 'Camarones', 'General Lagos', 'Putre'],
        'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
        'Antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
        'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco', 'Chañaral', 'Diego de Almagro'],
        'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
        'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'Casablanca', 'Quintero', 'Puchuncaví', 'San Antonio', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'Quillota', 'La Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Felipe', 'Llaillay', 'Catemu', 'Panquehue', 'Putaendo', 'Santa María', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban'],
        "Región Metropolitana": ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
        'O\'Higgins': ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
        'Maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
        'Ñuble': ['Chillán', 'Chillán Viejo', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'],
        'Biobío': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualpén', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Cabrero', 'Laja', 'Los Ángeles', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Lebu', 'Los Álamos', 'Tirúa'],
        'La Araucanía': ['Temuco', 'Carahue', 'Cholchol', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
        'Los Ríos': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'],
        'Los Lagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Llanquihue', 'Los Muermos', 'Maullín', 'Puerto Varas', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chiloé: Ancud', 'Castro', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao'],
        'Aysén': ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O\'Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'],
        'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'],
    }), []);

    const comunaOptions = useMemo(() => regionesComunas[formData.region] || [], [regionesComunas, formData.region]);

    // Función para validar RUT chileno
    const validarRUT = (rut) => {
        // Limpiar RUT
        rut = rut.replace(/[^0-9kK]/g, '');
        
        if (rut.length < 2) return false;
        
        const cuerpo = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();
        
        // Validar que el cuerpo sean solo números
        if (!/^\d+$/.test(cuerpo)) return false;
        
        // Calcular DV
        let suma = 0;
        let multiplo = 2;
        
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i)) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
        
        const dvEsperado = 11 - (suma % 11);
        let dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
        
        return dvCalculado === dv;
    };

    // Password validation
    const validatePassword = (value) => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);
        if (value.length < minLength) {
            return 'Mínimo 8 caracteres';
        }
        if (!hasUpper) {
            return 'Debe tener al menos 1 mayúscula';
        }
        if (!hasNumber) {
            return 'Debe tener al menos 1 número';
        }
        if (!hasSpecial) {
            return 'Debe tener al menos 1 caracter especial';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name } = e.target;
        let { value } = e.target;

        // Filtros por campo
        if (name === 'name' || name === 'lastname') {
            // Solo letras (incluye acentos) y espacios
            value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
        }
        if (name === 'phone') {
            // RUT: solo dígitos y K, en mayúscula
            value = value.toUpperCase().replace(/[^0-9K]/g, '');
            // Validar RUT en tiempo real
            if (value.length >= 2) {
                const rutValido = validarRUT(value);
                setRutError(rutValido ? '' : 'RUT inválido');
            } else {
                setRutError('');
            }
        }
        if (name === 'email') {
            // recortar espacios
            value = value.trim();
        }
        if (name === 'region') {
            // reiniciar comuna cuando cambia región
            setFormData(prev => ({ ...prev, region: value, comuna: '' }));
            return;
        }

        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            setPasswordError(validatePassword(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar RUT
        if (!validarRUT(formData.phone)) {
            setRutError('RUT inválido. Por favor ingresa un RUT válido');
            return;
        }

        // Validaciones básicas extra
        const emailOk = /.+@.+/.test(formData.email);
        if (!emailOk) {
            alert('Correo inválido: debe incluir @');
            return;
        }

        if (!formData.region || !formData.comuna) {
            alert('Selecciona región y comuna');
            return;
        }

        if (validatePassword(formData.password)) {
            setPasswordError(validatePassword(formData.password));
            return;
        }

        // Guardar usuario en localStorage para futuros inicios de sesión
        try {
            const regularUsers = JSON.parse(localStorage.getItem('regular_users') || '[]');
            
            // Verificar si el usuario ya existe
            if (regularUsers.some(user => user.email === formData.email)) {
                alert('❌ Este correo ya está registrado. Puedes iniciar sesión.');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: `${formData.name} ${formData.lastname}`,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                region: formData.region,
                comuna: formData.comuna,
                address: formData.address,
                status: 'Activo',
                registerDate: new Date().toISOString().split('T')[0],
                role: 'user'
            };

            const updatedUsers = [...regularUsers, newUser];
            localStorage.setItem('regular_users', JSON.stringify(updatedUsers));
            
            alert('✅ Registro exitoso. Ya puedes iniciar sesión.');

            // Limpiar formulario
            setFormData({
                name: '',
                lastname: '',
                phone: '',
                email: '',
                region: '',
                comuna: '',
                address: '',
                password: ''
            });
            setPasswordError('');
            setRutError('');

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Error guardando usuario:', err);
            alert('Hubo un problema guardando tu registro. Intenta nuevamente.');
        }
    };

    return (
        <div>
            {/* Hero con imagen de fondo */}
            {(() => {
                const heroBg = `url(${images['ejem']}) no-repeat center center`;
                return (
                    <div className="hero-area hero-bg" style={{height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: heroBg, backgroundSize: 'cover'}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-9 offset-lg-2 text-center">
                                    <div className="hero-text">
                                        <div className="hero-text-tablecell">
                                            <h1 style={{color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>Unete a nuestras filas</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Botón de scroll suave */}
                        <div className="text-center" style={{ marginTop: '-150px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
                            <ScrollButton targetSelector=".breadcrumb-section" playShots={false} />
                        </div>
                    </div>
                );
            })()}

            {/* contact form */}
            <div className="contact-from-section mt-100 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mb-5 mb-lg-0">
                            <div className="form-title" style={{marginTop: '10px'}}>
                                <h2>Identifícate y nos veremos en el campo</h2>
                                <p className="descripcion-productos">Completa tus datos para unirte a la misión.</p>
                            </div>
                            <div id="form_status"></div>
                            <div className="contact-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="contact-form-row">
                                        <input 
                                            type="text" 
                                            placeholder="Nombre" 
                                            name="name" 
                                            id="name" 
                                            maxLength="50" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            className="contact-form-input" 
                                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+" 
                                            title="Solo letras y espacios" 
                                            required 
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Apellidos" 
                                            name="lastname" 
                                            id="lastname" 
                                            maxLength="100" 
                                            value={formData.lastname} 
                                            onChange={handleChange} 
                                            className="contact-form-input" 
                                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+" 
                                            title="Solo letras y espacios" 
                                            required 
                                        />
                                    </div>
                                    <div className="contact-form-row">
                                        <input 
                                            type="text" 
                                            placeholder="RUT (sin puntos ni guion, ej: 12345678K)" 
                                            name="phone" 
                                            id="phone" 
                                            maxLength="9" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            className="contact-form-input" 
                                            pattern="[0-9K]+" 
                                            title="Solo números y la letra K" 
                                            required 
                                        />
                                        <input 
                                            type="email" 
                                            placeholder="Correo" 
                                            name="email" 
                                            id="email" 
                                            maxLength="100" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            className="contact-form-input" 
                                            pattern="[^@\s]+@[^@\s]+" 
                                            title="Debe contener @" 
                                            required 
                                        />
                                    </div>
                                    {rutError && (
                                        <div className="contact-form-row">
                                            <small className="contact-password-error" style={{color: 'red', fontSize: '12px'}}>
                                                {rutError}
                                            </small>
                                        </div>
                                    )}
                                    <div className="contact-form-row">
                                        <select 
                                            name="region" 
                                            id="region" 
                                            value={formData.region} 
                                            onChange={handleChange} 
                                            className="contact-form-select" 
                                            required
                                        >
                                            <option value="">Selecciona región</option>
                                            {Object.keys(regionesComunas).map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <select 
                                            name="comuna" 
                                            id="comuna" 
                                            value={formData.comuna} 
                                            onChange={handleChange} 
                                            className="contact-form-select" 
                                            required 
                                            disabled={!formData.region}
                                        >
                                            <option value="">Selecciona comuna</option>
                                            {comunaOptions.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="contact-form-row">
                                        <input 
                                            type="text" 
                                            placeholder="Dirección" 
                                            name="address" 
                                            id="address" 
                                            maxLength="300" 
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            className="contact-form-input" 
                                            required 
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="Contraseña" 
                                            name="password" 
                                            id="password" 
                                            maxLength="50" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            className="contact-form-input" 
                                            required 
                                        />
                                    </div>
                                    <div className="contact-requirements-container">                                        <small className={`contact-password-requirements text-white-custom ${passwordError ? 'error' : ''}`}>
                                            Requisitos: Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 caracter especial
                                        </small>
                                        {passwordError && <small className="contact-password-error">{passwordError}</small>}
                                    </div>
                                    <input type="hidden" name="token" value="FsWga4&@f6aw" />
                                    <p><input type="submit" value="Registrarse" className="boxed-btn" /></p>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="contact-form-wrap">                                {contactInfo.map((info, index) => (
                                    <div key={index} className="contact-form-box" style={{marginBottom: '30px'}}>
                                        <h4 style={{color: '#000000'}}><i className={info.icon} style={{color:'#051922'}}></i> {info.title}</h4>
                                        <p style={{color: '#000000'}} dangerouslySetInnerHTML={{ __html: info.content }}></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-100">
                        <div className="col-lg-12">
                            <div className="map-outer">
                                <div className="gmap_canvas">
                                    <iframe 
                                        width="100%" 
                                        height="450" 
                                        id="gmap_canvas"
                                        src="https://maps.google.com/maps?q=Antonio%20Varas%20234,%20Providencia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                        frameBorder="0" 
                                        scrolling="no" 
                                        marginHeight="0" 
                                        marginWidth="0"
                                        title="Ubicación Alpha Airsoft"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;