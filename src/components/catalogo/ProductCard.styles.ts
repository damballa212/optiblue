import type { CSSProperties } from "react";
import { colors } from "../../styles/tokens";

export const cardImg: CSSProperties = { fontSize: 52, textAlign: "center", padding: "28px 0 12px", background: colors.blueBg };
export const cardImgReal: CSSProperties = { width: "100%", height: 140, objectFit: "cover", display: "block", background: colors.blueBg };
export const cardBody: CSSProperties = { padding: "14px 16px 16px" };
export const cardCat: CSSProperties = { fontSize: 11, color: colors.blue600, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 };
export const cardName: CSSProperties = { fontSize: 15, fontWeight: 700, color: colors.slate900, marginBottom: 4 };
export const cardDesc: CSSProperties = { fontSize: 13, color: colors.slate500, marginBottom: 12, lineHeight: 1.5 };
export const cardPrice: CSSProperties = { fontSize: 20, fontWeight: 800, color: colors.blue700, marginBottom: 10 };
export const cardFootnote: CSSProperties = { fontSize: 12, color: colors.slate400, textAlign: "center", marginTop: 6 };
