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
      <span className="empty-mark" aria-hidden="true">S.</span>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="body-copy">{description}</p>
      <Link className="button" href={href}>{action}<span aria-hidden="true">↗</span></Link>
    </section>
  );
}
