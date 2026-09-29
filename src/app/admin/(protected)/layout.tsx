import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/infrastructure/auth/admin-session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <div className="admin-shell"><AdminNav email={session.email} /><div className="admin-content">{children}</div></div>;
}
