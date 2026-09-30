import { saveSiteSettingsAction } from "@/app/admin/actions";
import { readSiteSettings } from "@/infrastructure/site/site-settings-repository";

export default async function SettingsPage({ searchParams }: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const [settings, params] = await Promise.all([readSiteSettings(), searchParams]);
  return (
    <>
      <header className="admin-page-header"><div>
        <p className="admin-kicker">APARÊNCIA</p><h1>Tarja superior</h1>
        <p>Edite os avisos exibidos no topo de todas as páginas da loja.</p>
      </div></header>
      {params.salvo === "1" && <p className="admin-success">Alterações publicadas.</p>}
      <form className="admin-card settings-form" action={saveSiteSettingsAction}>
        <label className="settings-toggle">
          <input type="checkbox" name="announcementEnabled" defaultChecked={settings.announcementEnabled} />
          Exibir a tarja no site
        </label>
        <label>Texto esquerdo<input name="announcementLeft" maxLength={120} defaultValue={settings.announcementLeft} /></label>
        <label>Texto central<input name="announcementCenter" maxLength={120} defaultValue={settings.announcementCenter} /></label>
        <label>Texto direito<input name="announcementRight" maxLength={120} defaultValue={settings.announcementRight} /></label>
        <div><button className="admin-primary" type="submit">Salvar e publicar</button></div>
      </form>
    </>
  );
}
