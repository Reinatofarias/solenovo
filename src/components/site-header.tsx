import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "./cart-badge";
import { readSiteSettings } from "@/infrastructure/site/site-settings-repository";
import { defaultSiteSettings } from "@/domain/site/site-settings";

export async function SiteHeader() {
  const settings = await readSiteSettings().catch(() => defaultSiteSettings);
  return (
    <header className="site-header-container">
      {settings.announcementEnabled && (
        <div className="site-topbar">
          <div className="site-topbar-inner">
            <span className="site-topbar-item">
              <span className="status-dot-pulse" aria-hidden="true" />
              {settings.announcementLeft}
            </span>
            <span className="site-topbar-item desktop-only">{settings.announcementCenter}</span>
            <span className="site-topbar-item desktop-only">{settings.announcementRight}</span>
          </div>
        </div>
      )}
      <div className="site-header">
        <nav className="header-nav-left" aria-label="Navegação da marca">
          <Link href="/produtos" className="nav-link">A Coleção</Link>
        </nav>
        <Link className="wordmark" href="/" aria-label="SOLE — Início">
          <Image
            className="brand-logo"
            src="/brand/sole-logo.png"
            alt="SOLE Alta Camisaria"
            width={220}
            height={74}
            priority
          />
        </Link>
        <nav className="header-nav-right" aria-label="Navegação secundária">
          <Link className="bag-link" href="/carrinho" aria-label="Sacola de compras">
            <span className="bag-icon-frame" aria-hidden="true">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 5h10l1 10H1L2 5z" />
                <path d="M4.5 5V3.5a2.5 2.5 0 0 1 5 0V5" />
              </svg>
            </span>
            <span className="bag-text">Sacola</span>
            <span className="bag-counter-wrap"><CartBadge /></span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
