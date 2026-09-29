"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="admin-primary" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button>;
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, {});
  return (
    <form action={action} className="login-form">
      <label>E-mail<input name="email" type="email" autoComplete="username" required autoFocus /></label>
      <label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
