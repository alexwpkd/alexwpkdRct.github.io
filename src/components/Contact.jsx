// src/components/Contact.js
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar el formulario
        console.log('Formulario enviado:', formData);
        alert('Mensaje enviado correctamente');
        // Resetear formulario
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

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

    return (
        <div className="Contact">
            <Header />
            
            {/* breadcrumb */}
            <div className="breadcrumb-section breadcrumb-bg">
                <div className="container text-center">
                    <h1>Contáctanos</h1>
                    <p>¿Tienes dudas? Estamos aquí para ayudarte.</p>
                </div>
            </div>

            {/* contact form */}
            <div className="contact-from-section mt-150 mb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="form-title">
                                <h2>¿Tienes alguna pregunta?</h2>
                                <p>Completa el formulario y nuestro equipo se pondrá en contacto contigo a la brevedad.</p>
                            </div>
                            <div id="form_status"></div>
                            <div className="contact-form">
                                <form onSubmit={handleSubmit}>
                                    <p>
                                        <input 
                                            type="text" 
                                            placeholder="Nombre" 
                                            name="name" 
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input 
                                            type="email" 
                                            placeholder="Correo" 
                                            name="email" 
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <input 
                                            type="tel" 
                                            placeholder="Teléfono" 
                                            name="phone" 
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Asunto" 
                                            name="subject" 
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <textarea 
                                            name="message" 
                                            id="message" 
                                            cols="30" 
                                            rows="10" 
                                            placeholder="Mensaje"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </p>
                                    <p><input type="submit" value="Enviar" /></p>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="contact-form-wrap">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="contact-form-box">
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

            <Footer />
        </div>
    );
}

export default Contact;