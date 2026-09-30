import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand-column">
          <div className="footer-wordmark">
            <Image
              className="footer-brand-logo"
              src="/brand/sole-logo.png"
              alt="SOLE Alta Camisaria"
              width={220}
              height={74}
            />
          </div>
          <p className="footer-description">
            Camisaria autoral de precisão. Tecidos de fiação nobre, caimento milimétrico e o requinte da alfaiataria clássica contemporânea.
          </p>
          <div className="footer-atelier-badge">
            <span className="status-dot-pulse" aria-hidden="true" />
            <span>Atelier em Camaragibe, Pernambuco · Atendimento exclusivo</span>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h3 className="footer-heading">A Coleção</h3>
            <ul className="footer-list">
              <li><Link href="/produtos">Todas as Peças</Link></li>
              <li><Link href="/produtos">Camisas em Linho Puro</Link></li>
              <li><Link href="/produtos">Algodão Egípcio 120s</Link></li>
              <li><Link href="/carrinho">Sacola de Escolhas</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">O Atelier</h3>
            <ul className="footer-list">
              <li><span className="footer-text-item">Corte sob Medida</span></li>
              <li><span className="footer-text-item">Alfaiataria Artesanal</span></li>
              <li><span className="footer-text-item">Guia de Caimento</span></li>
              <li><span className="footer-text-item">Cuidados com a Peça</span></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Status do Lançamento</h3>
            <p className="footer-note">
              Estamos finalizando a costura e o acabamento das peças da primeira coleção. O catálogo abrirá vendas em breve.
            </p>
            <div className="footer-status-pill">
              <span className="pill-dot" />
              <span>Coleção em Preparação</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} SOLE Camisaria. Todos os direitos reservados.
        </p>
        <div className="footer-bottom-meta">
          <span>Feito no Brasil</span>
          <span className="meta-sep">·</span>
          <span>Alfaiataria Autoral</span>
          <span className="meta-sep">·</span>
          <span>Fibras Nobres</span>
        </div>
      </div>
    </footer>
  );
}
