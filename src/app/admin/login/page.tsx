import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/infrastructure/auth/admin-session";

export const metadata: Metadata = { title: "Administração", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <div className="admin-login"><section><div className="admin-login-brand">SOLE<span>ADMINISTRAÇÃO</span></div><p className="admin-kicker">ACESSO RESTRITO</p><h1>Operação da camisaria.</h1><p>Entre para organizar peças, fotos, variações e estoque.</p><LoginForm /></section><aside aria-hidden="true"><span>S.</span></aside></div>;
}
