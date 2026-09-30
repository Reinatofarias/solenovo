import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav({ email }: { email: string }) {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-wordmark" href="/admin">SOLE<span>ADMINISTRAÇÃO</span></Link>
      <nav aria-label="Administração">
        <Link href="/admin">Visão geral</Link>
        <Link href="/admin/produtos">Produtos</Link>
        <Link href="/admin/produtos/novo">Nova peça</Link>
        <Link href="/admin/configuracoes">Configurações</Link>
        <Link href="/admin/localizacao">Localização</Link>
      </nav>
      <div className="admin-account">
        <span>{email}</span>
        <form action={logoutAction}><button>Encerrar sessão</button></form>
      </div>
    </aside>
  );
}
