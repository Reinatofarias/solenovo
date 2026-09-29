import Link from "next/link";
import { parseCatalog } from "@/domain/catalog/product";
import { catalogRepository } from "@/infrastructure/catalog/local-catalog";

export default async function AdminDashboardPage() {
  const products = parseCatalog(await catalogRepository.read());
  const variants = products.flatMap((product) => product.variants);
  const stats = [
    ["Peças", products.length], ["Publicadas", products.filter((item) => item.status === "published").length],
    ["Rascunhos", products.filter((item) => item.status === "draft").length], ["Variações", variants.length],
    ["Unidades em estoque", variants.reduce((total, variant) => total + variant.stock, 0)],
  ] as const;
  return <><header className="admin-page-header"><div><p className="admin-kicker">VISÃO GERAL</p><h1>Catálogo da SOLE</h1><p>Organize a coleção antes de abrir as vendas.</p></div><Link className="admin-primary" href="/admin/produtos/novo">Cadastrar peça</Link></header><section className="stats-grid">{stats.map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</section><section className="admin-card admin-onboarding"><div><p className="admin-kicker">PRÓXIMO PASSO</p><h2>{products.length ? "Continue montando a coleção." : "Cadastre sua primeira camisa."}</h2><p>Inclua fotos, informações comerciais, tamanhos, cores, preço e estoque. As vendas continuam bloqueadas até o checkout estar pronto.</p></div><Link className="admin-secondary" href="/admin/produtos">Gerenciar produtos</Link></section><p className="local-storage-notice">Persistência local ativa. Na Vercel, a gravação será liberada depois da integração com Supabase Database e Storage.</p></>;
}
