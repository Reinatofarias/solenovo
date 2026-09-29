"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">SOLE</p><h1>Não foi possível abrir esta página.</h1>
      <p className="body-copy">Tente novamente em alguns instantes.</p>
      <button className="button" onClick={reset}>Tentar novamente <span aria-hidden="true">↗</span></button>
    </section>
  );
}
