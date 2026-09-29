import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> SOLE · CAMISARIA</p>
          <h1>Um novo<br />capítulo.<br /><em>Em breve.</em></h1>
          <p className="body-copy">Estamos preparando nossa coleção de camisas.<br className="desktop-break" /> Este é só o começo.</p>
          <Link className="button" href="/produtos">Conheça a coleção<span aria-hidden="true">↗</span></Link>
          <span className="hero-note">As compras ainda não estão disponíveis.</span>
        </div>
        <div className="brand-composition" aria-hidden="true">
          <div className="composition-top"><span>SOLE</span><span>CAMISARIA</span></div>
          <div className="composition-frame"><span className="composition-letter">S</span><span className="composition-period">.</span></div>
          <div className="composition-bottom"><span>UM NOVO CAPÍTULO</span><span>EM BREVE ↗</span></div>
        </div>
      </section>
      <section className="collection-intro" aria-labelledby="collection-title">
        <p className="eyebrow">A COLEÇÃO</p>
        <h2 id="collection-title">O próximo capítulo<br />começa aqui.</h2>
        <div><p>Em breve, este espaço recebe as camisas SOLE. Por enquanto, nossa coleção está em preparação.</p><Link className="text-link" href="/produtos">Acompanhe a coleção <span aria-hidden="true">↗</span></Link></div>
      </section>
    </>
  );
}
