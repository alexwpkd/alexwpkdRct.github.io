export default function Footer() {
  return (
    <>
      {/* footer */}
      <div className="footer-area">
        <div className="container container-fixed">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-box about-widget">
                <h2 className="widget-title">¿Quienes somos?</h2>
                <p>
                  Somos una unidad creada en 2024 dedicada a equiparte con réplicas
                  de rifles de asalto de aire comprimido, diseñadas para ofrecer alta precisión
                  y maximizar tu desempeño en la próxima misión.
                </p>
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
                <form onSubmit={(e)=>e.preventDefault()}>
                  <input type="email" placeholder="Correo" />
                  <button type="submit"><i className="fas fa-paper-plane"></i></button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* end footer */}

      {/* copyright */}
      <div className="copyright">
        <div className="container container-fixed">
          <div className="row">

            <div className="col-lg-6 col-md-12">
              <p>
                Copyrights &copy; 2024 - <a>Alex Rios | Dylan Rodriguez</a>,  Derechos reservados.<br/>
                Distribuido por - <a href="https://themewagon.com/" target="_blank" rel="noreferrer">Themewagon</a>
              </p>
            </div>

            <div className="col-lg-6 text-right col-md-12">
              <div className="social-icons">
                <ul>
                  <li><a href="#" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href="#" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a></li>
                  <li><a href="#" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a></li>
                  <li><a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* end copyright */}
    </>
  )
}
