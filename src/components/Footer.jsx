export default function Footer() {
  return (
    <>
      <div>
        {/* footer */}
        <div className="footer-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="footer-box about-widget">
                  <h2 className="widget-title">¿Quienes somos?</h2>
                  <p>Somos una unidad creada en 2024 dedicada a equiparte con réplicas de rifles de asalto de aire comprimido, diseñadas para ofrecer alta precisión y maximizar tu desempeño en la próxima misión.</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box get-in-touch">
                  <h2 className="widget-title">Tienda</h2>
                  <ul>
                    <li>Antonio Varas 234, 7500539 Providencia, Región Metropolitana</li>
                    <li>soporte@alpha.com</li>
                    <li>+569 30206073</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box subscribe">
                  <h2 className="widget-title">Suscríbete</h2>
                  <p>Suscríbete para recibir las noticias más recientes.</p>
                  <form action="index.html">
                    <input type="email" placeholder="Correo" />
                    <button type="submit"><i className="fas fa-paper-plane" /></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end footer */}
        {/* copyright */}
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <p>Copyrights © 2024 - <a>Alex Rios | Dylan Rodriguez | Alexis Olguin</a>,  Derechos reservados.<br />
                  Distribuido por - <a href="https://themewagon.com/">Themewagon</a>
                </p>
              </div>
              <div className="col-lg-6 text-right col-md-12">
                <div className="social-icons">
                  <ul>
                    <li><a target="_blank"><i className="fab fa-facebook-f" /></a></li>
                    <li><a target="_blank"><i className="fab fa-twitter" /></a></li>
                    <li><a target="_blank"><i className="fab fa-instagram" /></a></li>
                    <li><a target="_blank"><i className="fab fa-linkedin" /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end copyright */}
      </div>

    </>
  )
}
