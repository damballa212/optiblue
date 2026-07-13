import type { ReactNode } from "react";
import styles from "./AdminLayout.module.css";

interface AdminPageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function AdminPageHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: AdminPageHeadingProps) {
  return (
    <div className={`${styles.pageTitle} ${className ?? ""}`.trim()}>
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
