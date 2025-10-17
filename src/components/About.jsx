import Hero from './Hero'

export default function About() {
  return (
    <>
      <Hero title="¿Quiénes somos?" />
      
      {/* featured section */}
      <div className="feature-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="featured-text" style={{maxWidth:'540px'}}>
                <h2 className="pb-3 font-title-about text-blanco">Acerca de Nosotros</h2>
                <p className="descripcion-productos text-blanco">
                  En <b>Alpha Squad</b> nacimos con la idea de ofrecer <b>réplicas de armas de calidad</b> para que cada partida sea una experiencia única, segura y llena de adrenalina.<br/>
                  Creemos que el airsoft no solo es un deporte, sino también una forma de <b>trabajo en equipo, respeto y compañerismo</b>.<br/>
                  Nuestro objetivo es apoyar tanto a jugadores que recién comienzan como a veteranos que buscan mejorar su arsenal o su equipamiento táctico.
                </p>
                <h2 className="pb-3 mt-5 font-title-aviso">Aviso Importante</h2>
                <p className="descripcion-productos">
                  <b>Todas nuestras réplicas están destinados exclusivamente al uso recreativo</b> en partidas de airsoft o coleccionismo responsable.<br/>
                  <b className="bg-prohibido">Queda estrictamente prohibido</b> <span className="text-blanco">utilizarlas con fines intimidatorios, delictivos o en cualquier contexto ajeno al deporte.</span><br/>
                  Cada compra queda registrada junto con los datos del cliente y número de serie del producto, y en caso de mal uso, dicha información podrá ser entregada a las autoridades para su ubicación y confiscación correspondiente.<br/>
                  <span className="text-blanco">Nuestro público está orientado a jóvenes mayores de 18 años</span> o menores bajo la supervisión y respaldo de un adulto responsable.<br/>
                  <b>Recordemos:</b> el airsoft es diversión, estrategia y compañerismo — <b>nunca violencia</b>.
                </p>
              </div>
            </div>
          </div>
    </div>
  </div>
  {/* end featured section */}
  {/* team section */}
  <div className="mt-80">
    <div className="container">
      <div className="row">
        <div className="col-lg-8 offset-lg-2 text-center">
          <div className="section-title">
            <h3><span className="azul-text">Nuestro Equipo</span></h3>
            <p className="descripcion-productos font-lg text-blanco-mas-claro" style={{fontWeight:500}}>
              Nuestra pasión por el airsoft nos impulsa a equipar a cada
              jugador con herramientas que potencian su desempeño en el campo, con réplicas que imitan
              fielmente las armas reales en diseño y operación, para cumplir con estándares rigurosos de
              calidad y funcionamiento.
            </p>
          </div>
        </div>
      </div>
      <div className="row justify-content-center text-center" style={{gap:'0.5rem'}}>
        <div className="col-lg-4 col-md-6">
          <div className="single-team-item">
            <div className="team-bg team-bg-1" />
            <h4>Alex R<span /></h4>
            <h4>Fundador<span /></h4>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="single-team-item">
            <div className="team-bg team-bg-3" />
            <h4>Dylan R <span /></h4>
            <h4>Co-fundador<span /></h4>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="single-team-item">
            <div className="team-bg team-bg-2" />
            <h4>Alexis Olgin<span /></h4>
            <h4>Co-fundador<span /></h4>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* end team section */}
    </>
  )
}