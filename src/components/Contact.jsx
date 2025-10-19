import React, { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        region: '',
        subject: '',
        address: '',
        password: ''
    });
    const [passwordError, setPasswordError] = useState('');

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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === 'password') {
            setPasswordError(validatePassword(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validatePassword(formData.password)) {
            setPasswordError(validatePassword(formData.password));
            return;
        }
        alert('Formulario enviado correctamente');
        setFormData({
            name: '',
            lastname: '',
            phone: '',
            email: '',
            region: '',
            subject: '',
            address: '',
            password: ''
        });
        setPasswordError('');
    };

    return (
        <div>
            {/* Hero con imagen de fondo */}
            <div className="hero-area hero-bg" style={{height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/assets/images/avaters/hero-bg.jpg') no-repeat center center", backgroundSize: 'cover'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 offset-lg-2 text-center">
                            <div className="hero-text">
                                <div className="hero-text-tablecell">
                                    <h1 style={{color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>Identifícate y nos veremos en el campo</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* contact form */}
            <div className="contact-from-section mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mb-5 mb-lg-0">
                            <div className="form-title" style={{marginTop: '40px'}}>
                                <h2>Identifícate y nos veremos en el campo</h2>
                                <p className="descripcion-productos">Completa tus datos para unirte a la misión.</p>
                            </div>
                            <div id="form_status"></div>
                            <div className="contact-form">
                                <form onSubmit={handleSubmit}>
                                    <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                                        <input type="text" placeholder="Nombre" name="name" id="name" maxLength="50" value={formData.name} onChange={handleChange} style={{flex: 1}} />
                                        <input type="text" placeholder="Apellidos" name="lastname" id="lastname" maxLength="100" value={formData.lastname} onChange={handleChange} style={{flex: 1}} />
                                    </div>
                                    <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                                        <input type="text" placeholder="Rut" name="phone" id="phone" maxLength="9" value={formData.phone} onChange={handleChange} style={{flex: 1}} />
                                        <input type="email" placeholder="Correo" name="email" id="email" maxLength="100" value={formData.email} onChange={handleChange} style={{flex: 1}} />
                                    </div>
                                    <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                                        <input type="text" placeholder="Región" name="region" id="region" value={formData.region} onChange={handleChange} style={{flex: 1}} />
                                        <input type="text" placeholder="Comuna" name="subject" id="subject" value={formData.subject} onChange={handleChange} style={{flex: 1}} />
                                    </div>
                                    <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                                        <input type="text" placeholder="Dirección" name="address" id="address" maxLength="300" value={formData.address} onChange={handleChange} style={{flex: 1}} />
                                        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                            <input type="password" placeholder="Contraseña" name="password" id="password" maxLength="50" value={formData.password} onChange={handleChange} />
                                            <small style={{color: passwordError ? 'red' : 'gray'}}>
                                                Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 caracter especial
                                            </small>
                                            {passwordError && <small style={{color: 'red'}}>{passwordError}</small>}
                                        </div>
                                    </div>
                                    <input type="hidden" name="token" value="FsWga4&@f6aw" />
                                    <p><input type="submit" value="Enviar" className="boxed-btn" /></p>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="contact-form-wrap">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="contact-form-box" style={{marginBottom: '30px'}}>
                                        <h4><i className={info.icon}></i> {info.title}</h4>
                                        <p dangerouslySetInnerHTML={{ __html: info.content }}></p>
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