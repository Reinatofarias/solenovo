import Link from "next/link";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
};

export function EmptyState({ eyebrow, title, description, href, action }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <div className="empty-seal" aria-hidden="true">
        <div className="seal-ring outer-ring" />
        <div className="seal-ring inner-ring" />
        <span className="empty-mark">S</span>
        <span className="seal-dot">.</span>
      </div>
      <p className="eyebrow"><span className="status-dot-pulse" aria-hidden="true" /> {eyebrow}</p>
      <h1>{title}</h1>
      <p className="body-copy">{description}</p>
      <div className="empty-action-wrapper">
        <Link className="button" href={href}>
          <span>{action}</span>
          <span className="button-arrow" aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

