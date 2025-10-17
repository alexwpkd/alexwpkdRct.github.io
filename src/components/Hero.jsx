export default function Hero({ title = 'ALPHA SQUAD' }) {
    return (
        <>
            {/* hero area */}
            <div className="hero-area hero-bg hero-bg--parallax">
                <div className="hero-center-content">
                    <h1>{title}</h1>
                </div>
            </div>
            {/* end hero area */}
        </>
    )
}
