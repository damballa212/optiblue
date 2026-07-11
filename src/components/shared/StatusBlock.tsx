import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

type StatusKind = "loading" | "empty" | "error";

interface StatusBlockProps {
  kind: StatusKind;
  title: string;
  message: string;
}

const tone: Record<StatusKind, { bg: string; border: string; fg: string }> = {
  loading: { bg: colors.blueBgLight, border: colors.blueBorder, fg: colors.blue700 },
  empty: { bg: colors.slate50, border: colors.slate200, fg: colors.slate600 },
  error: { bg: colors.red100, border: colors.red100, fg: colors.red800 },
};

export function StatusBlock({ kind, title, message }: StatusBlockProps) {
  const t = tone[kind];
  const wrap: CSSProperties = {
    background: t.bg,
    border: `1px solid ${t.border}`,
    borderRadius: radii.md,
    padding: "18px 20px",
    color: colors.slate700,
  };
  const heading: CSSProperties = { margin: 0, color: t.fg, fontSize: 15, fontWeight: 800 };
  const body: CSSProperties = { margin: "6px 0 0", color: colors.slate600, fontSize: 14, lineHeight: 1.5 };

  return (
    <div style={wrap} role={kind === "error" ? "alert" : "status"} aria-live="polite">
      <p style={heading}>{title}</p>
      <p style={body}>{message}</p>
    </div>
  );
}
