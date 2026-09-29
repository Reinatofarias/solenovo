import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/domain/admin/auth";

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || "L-9gVvkZ0iVnfEVPE_i-9qnJLDYRtjSUrzE7QMDWWlQtM_QWQc0Xo6Rddb34J5Zb";
  return secret;
}

export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token, sessionSecret()) : null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
