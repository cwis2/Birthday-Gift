// =====================================================================
// EDITABLE APP LIST
// Add / remove / edit entries here. Pages (3 rows x 6 cols = 18 slots)
// are recalculated automatically.
//   icon:  an image URL (http/https or /path) — if not a URL, a colored
//          tile is rendered using `color` and `label`.
//   color: fallback background color for the tile.
//   label: 1-2 letter label shown on the fallback tile.
// =====================================================================
export interface App3DS {
  id: string;
  title: string;
  publisher: string;
  icon: string;
  color: string;
  label?: string;
}

const pastels = [
  "#f7a8a8", "#f7c9a0", "#f5e19a", "#bfe6a0", "#9fe0c8", "#9fd3ef",
  "#a9b8f2", "#c8aef0", "#efaedb", "#f2b8c6", "#b5e3e0", "#d9e3a1",
];

export const apps: App3DS[] = Array.from({ length: 30 }, (_, i) => ({
  id: `app-${i + 1}`,
  title: `Placeholder App ${i + 1}`,
  publisher: "Developer",
  icon: "",
  color: pastels[i % pastels.length] ?? "#ccc",
  label: `${String.fromCharCode(65 + (i % 26))}${i >= 26 ? i - 25 : ""}`,
}));

export const isUrl = (s: string) => /^(https?:\/\/|\/|data:image)/.test(s);
