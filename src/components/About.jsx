export default function About() {
  return (<div>
  &lt;&gt;
  {/* title */}
  <title>¿Quienes somos?</title>
  {/* hero area */}
  <div className="hero-area hero-bg">
    <div className="container">
      <div className="row">
        <div className="col-lg-9 offset-lg-2 text-center">
          <div className="hero-text">
            <div className="hero-text-tablecell">
              <h1>¿Quienes somos?</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* end hero area */}
  {/* featured section */}
  <div className="feature-bg">
    <div className="container">
      <div className="row">
        <div className="col-lg-7">
          <div className="featured-text">
            <h2 className="pb-3">¿Por que nosotros?</h2>
            <p className="descripcion-productos">
              Somos Alpha Squad, una unidad de élite creada en 2024 con la misión de equiparte con armas
              de airsoft de primera categoría, especializándonos en fusiles de asalto de aire comprimido.
              Estas réplicas no solo destacan por su alta precisión y realismo, sino que también son
              completamente seguras para el juego, ya que utilizan aire comprimido para disparar balines
              plásticos a baja velocidad, minimizando riesgos y ofreciendo un entrenamiento táctico
              efectivo.
            </p>
            <p className="descripcion-productos">
              El aire comprimido es un sistema fiable y controlado que propulsa cada proyectil con
              potencia suficiente para la experiencia realista, pero sin causar daños graves, siempre
              cumpliendo con estrictas normas de seguridad. Nuestra oferta asegura que cada fusil cumple
              con los más altos estándares de calidad y funcionamiento, para que cada operación sea un
              éxito.
            </p>
            <p className="descripcion-productos">
              Confía en nuestro arsenal para dominar el campo de juego, potenciar tus habilidades y
              cumplir tus objetivos con disciplina, eficacia y potencia. En Alpha Squad, tu misión es
              nuestra prioridad.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* end featured section */}
  {/* team section */}
  <div className="mt-150">
    <div className="container">
      <div className="row">
        <div className="col-lg-8 offset-lg-2 text-center">
          <div className="section-title">
            <h3><span className="azul-text">Nuestro Equipo</span></h3>
            <p className="descripcion-productos">Nuestra pasión por el airsoft nos impulsa a equipar a cada
              jugador con herramientas que potencian su desempeño en el campo, con réplicas que imitan
              fielmente las armas reales en diseño y operación, para cumplir con estándares rigurosos de
              calidad y funcionamiento.</p>
          </div>
        </div>
      </div>
      <div className="row justify-content-center text-center">
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
      </div>
    </div>
  </div>
  {/* end team section */}
</div>

  )
}