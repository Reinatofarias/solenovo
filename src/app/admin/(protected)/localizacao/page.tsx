import { readLocationSummary } from "@/infrastructure/analytics/location-analytics";

export default async function LocationPage() {
  const locations = await readLocationSummary(30);
  const total = locations.reduce((sum, location) => sum + location.views, 0);
  return (
    <>
      <header className="admin-page-header"><div>
        <p className="admin-kicker">AUDIÊNCIA · ÚLTIMOS 30 DIAS</p><h1>Localização dos visitantes</h1>
        <p>Visitas aproximadas por cidade, região e país, sem armazenar endereço IP.</p>
      </div></header>
      <section className="stats-grid">
        <article className="stat-card"><span>Visualizações mapeadas</span><strong>{total}</strong></article>
        <article className="stat-card"><span>Localidades</span><strong>{locations.length}</strong></article>
      </section>
      <section className="admin-card location-card">
        {locations.length ? <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Cidade</th><th>Região</th><th>País</th><th>Visualizações</th></tr></thead>
          <tbody>{locations.map((location) => <tr key={`${location.country}-${location.region}-${location.city}`}>
            <td>{location.city}</td><td>{location.region}</td><td>{location.country}</td><td>{location.views}</td>
          </tr>)}</tbody>
        </table></div> : <p>Ainda não há visitas registradas. Os dados começam a aparecer após o deploy na Vercel.</p>}
      </section>
    </>
  );
}
