// Per-recipient palette. Each entry is a self-contained color set used for pins,
// labels, and dropdown options. Colors are hardcoded glow accents (intentional —
// they are functional identifiers, not theme tokens).
export type RecipientColor = {
  name: string;
  hex: string; // base color
  fill: string; // translucent fill for MapPin
  glow: string; // drop-shadow glow
  glowStrong: string; // selected state glow
  border: string;
  bg: string;
  text: string;
};

export const RECIPIENT_COLORS: RecipientColor[] = [
  {
    name: "cyan",
    hex: "#22d3ee",
    fill: "rgba(34, 211, 238, 0.35)",
    glow: "drop-shadow(0 0 6px #22d3ee) drop-shadow(0 0 12px #22d3ee)",
    glowStrong:
      "drop-shadow(0 0 8px #22d3ee) drop-shadow(0 0 18px #22d3ee) drop-shadow(0 0 28px #22d3ee)",
    border: "rgba(34, 211, 238, 0.7)",
    bg: "rgba(34, 211, 238, 0.15)",
    text: "#67e8f9",
  },
  {
    name: "purple",
    hex: "#a855f7",
    fill: "rgba(168, 85, 247, 0.35)",
    glow: "drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px #a855f7)",
    glowStrong:
      "drop-shadow(0 0 8px #a855f7) drop-shadow(0 0 18px #a855f7) drop-shadow(0 0 28px #a855f7)",
    border: "rgba(168, 85, 247, 0.7)",
    bg: "rgba(168, 85, 247, 0.15)",
    text: "#d8b4fe",
  },
  {
    name: "orange",
    hex: "#fb923c",
    fill: "rgba(251, 146, 60, 0.35)",
    glow: "drop-shadow(0 0 6px #fb923c) drop-shadow(0 0 12px #fb923c)",
    glowStrong:
      "drop-shadow(0 0 8px #fb923c) drop-shadow(0 0 18px #fb923c) drop-shadow(0 0 28px #fb923c)",
    border: "rgba(251, 146, 60, 0.7)",
    bg: "rgba(251, 146, 60, 0.15)",
    text: "#fdba74",
  },
  {
    name: "pink",
    hex: "#ec4899",
    fill: "rgba(236, 72, 153, 0.35)",
    glow: "drop-shadow(0 0 6px #ec4899) drop-shadow(0 0 12px #ec4899)",
    glowStrong:
      "drop-shadow(0 0 8px #ec4899) drop-shadow(0 0 18px #ec4899) drop-shadow(0 0 28px #ec4899)",
    border: "rgba(236, 72, 153, 0.7)",
    bg: "rgba(236, 72, 153, 0.15)",
    text: "#f9a8d4",
  },
  {
    name: "lime",
    hex: "#a3e635",
    fill: "rgba(163, 230, 53, 0.35)",
    glow: "drop-shadow(0 0 6px #a3e635) drop-shadow(0 0 12px #a3e635)",
    glowStrong:
      "drop-shadow(0 0 8px #a3e635) drop-shadow(0 0 18px #a3e635) drop-shadow(0 0 28px #a3e635)",
    border: "rgba(163, 230, 53, 0.7)",
    bg: "rgba(163, 230, 53, 0.15)",
    text: "#bef264",
  },
  {
    name: "amber",
    hex: "#fbbf24",
    fill: "rgba(251, 191, 36, 0.35)",
    glow: "drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 12px #fbbf24)",
    glowStrong:
      "drop-shadow(0 0 8px #fbbf24) drop-shadow(0 0 18px #fbbf24) drop-shadow(0 0 28px #fbbf24)",
    border: "rgba(251, 191, 36, 0.7)",
    bg: "rgba(251, 191, 36, 0.15)",
    text: "#fcd34d",
  },
];

export function getRecipientColor(index: number): RecipientColor {
  const i = ((index % RECIPIENT_COLORS.length) + RECIPIENT_COLORS.length) %
    RECIPIENT_COLORS.length;
  return RECIPIENT_COLORS[i];
}
