import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="SOLE — início">SOLE<span>CAMISARIA</span></Link>
      <nav aria-label="Navegação principal">
        <Link href="/produtos">A coleção</Link>
        <Link className="bag-link" href="/carrinho">Sacola <span aria-label="0 itens">0</span></Link>
      </nav>
    </header>
  );
}
